import sys
import json
import base64
import io
import os
import contextlib
import numpy as np
import cv2
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

# Suppress Hugging Face symlink warnings on Windows
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

# Global model cache to avoid re-initializing weights on repeated calls
_MODEL_CACHE = {}

def find_local_cached_model_dir(model_slug):
    """Finds local offline snapshot directory in HuggingFace cache if available."""
    try:
        hub_cache = os.path.expanduser("~/.cache/huggingface/hub")
        hub_dir = os.path.join(hub_cache, f"models--{model_slug.replace('/', '--')}")
        snapshots_dir = os.path.join(hub_dir, "snapshots")
        if os.path.isdir(snapshots_dir):
            for snap in os.listdir(snapshots_dir):
                full_snap = os.path.join(snapshots_dir, snap)
                if os.path.isdir(full_snap) and os.path.isfile(os.path.join(full_snap, "config.json")):
                    return full_snap
    except Exception:
        pass
    return model_slug

def get_super_image_model(scale_factor=2, model_type="pan"):
    """
    Load and cache pretrained super-image deep learning model (PAN or EDSR).
    Uses CUDA GPU acceleration if available, otherwise CPU.
    """
    scale = 4 if scale_factor >= 3 else 2
    cache_key = f"{model_type}_{scale}"
    if cache_key in _MODEL_CACHE:
        return _MODEL_CACHE[cache_key], scale

    try:
        import torch
        from super_image import PanModel, EdsrModel

        device = "cuda" if torch.cuda.is_available() else "cpu"
        model_cls = EdsrModel if model_type == "edsr" else PanModel
        model_slug = "eugenesiow/edsr-base" if model_type == "edsr" else "eugenesiow/pan-bam"
        target_path = find_local_cached_model_dir(model_slug)

        with contextlib.redirect_stdout(sys.stderr):
            model = model_cls.from_pretrained(target_path, scale=scale)
            model = model.to(device)
            model.eval()
        _MODEL_CACHE[cache_key] = (model, device)
        return (model, device), scale
    except Exception as e:
        sys.stderr.write(f"Warning: super-image model loading failed ({e}). Falling back.\n")
        return None, scale


def opencv_clarity_enhancement(
    img_bgr,
    apply_clahe=True,
    apply_unsharp=True,
    apply_bilateral=True,
    clarity_mode="clean_hd",
    unsharp_strength=0.75,
    denoise_strength=28
):
    """
    OpenCV-based clean clarity and detail enhancement:
    - Bilateral edge-preserving filter: eliminates mobile camera sensor noise & JPEG block compression
    - Gentle CLAHE in LAB luminance channel: lifts natural micro-textures without harsh black halos
    - Edge-masked unsharp masking: sharpens genuine contours and textures above threshold,
      leaving flat areas (table, skin, fabric body) silky smooth and clean.
    """
    enhanced = img_bgr.copy()

    # 1. Edge-preserving noise smoothing (critical for clean HD clarity)
    if apply_bilateral:
        d = 7 if clarity_mode == "clean_hd" else 5
        sigma = 32 if clarity_mode == "clean_hd" else denoise_strength
        enhanced = cv2.bilateralFilter(enhanced, d=d, sigmaColor=sigma, sigmaSpace=sigma)

    # 2. CLAHE on luminance channel (preserves colors while lifting micro-textures)
    if apply_clahe:
        lab = cv2.cvtColor(enhanced, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clip = 1.15 if clarity_mode == "clean_hd" else (1.55 if clarity_mode == "crisp" else 1.05)
        clahe = cv2.createCLAHE(clipLimit=clip, tileGridSize=(8, 8))
        l_clahe = clahe.apply(l)
        lab_enhanced = cv2.merge((l_clahe, a, b))
        enhanced = cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2BGR)

    # 3. Clean Edge-Masked Unsharp Masking
    # Only sharpens true edge boundaries; leaves smooth surfaces noise-free
    if apply_unsharp:
        strength = 0.70 if clarity_mode == "clean_hd" else (1.10 if clarity_mode == "crisp" else 0.40)
        gaussian = cv2.GaussianBlur(enhanced, (0, 0), sigmaX=1.2)
        diff = cv2.subtract(enhanced, gaussian)
        gray_diff = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        threshold_val = 4 if clarity_mode == "clean_hd" else (3 if clarity_mode == "crisp" else 6)
        _, mask = cv2.threshold(gray_diff, threshold_val, 255, cv2.THRESH_BINARY)
        mask_3c = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR).astype(np.float32) / 255.0
        enhanced = np.clip(
            enhanced.astype(np.float32) + (diff.astype(np.float32) * strength * mask_3c),
            0, 255
        ).astype(np.uint8)

    return enhanced


def upscale_opencv(img_rgb, target_w, target_h, interpolation="lanczos4", clarity_mode="clean_hd", denoise=True):
    """
    OpenCV interpolation-based upscaler:
    - cv2.INTER_LANCZOS4 (8x8 neighborhood sinc interpolation)
    - cv2.INTER_CUBIC (bicubic)
    - cv2.INTER_LINEAR (bilinear)
    followed by computer vision detail & clean HD clarity filters.
    """
    interp_map = {
        "linear": cv2.INTER_LINEAR,
        "cubic": cv2.INTER_CUBIC,
        "lanczos4": cv2.INTER_LANCZOS4,
        "lanczos": cv2.INTER_LANCZOS4,
    }
    cv2_interp = interp_map.get(str(interpolation).lower(), cv2.INTER_LANCZOS4)

    # Convert RGB to BGR for OpenCV
    bgr = cv2.cvtColor(np.array(img_rgb), cv2.COLOR_RGB2BGR)

    # 1. Scale with OpenCV resize
    upscaled_bgr = cv2.resize(bgr, (target_w, target_h), interpolation=cv2_interp)

    # 2. Apply computer vision clean clarity enhancement
    enhanced_bgr = opencv_clarity_enhancement(
        upscaled_bgr,
        apply_clahe=True,
        apply_unsharp=True,
        apply_bilateral=denoise,
        clarity_mode=clarity_mode
    )

    # Convert back to RGB PIL Image
    enhanced_rgb = cv2.cvtColor(enhanced_bgr, cv2.COLOR_BGR2RGB)
    return Image.fromarray(enhanced_rgb)


def upscale_qirias(img_rgb, target_w, target_h):
    """
    Progressive Multi-Step Upscaling inspired by Qirias/Python-Image-Upscaler:
    Scales the image in fractional increments (e.g. 1.35x per pass) instead of
    one aggressive jump, applying Laplacian edge recovery at each step to prevent
    the blurring and halo artifacts associated with single-pass scaling.
    """
    curr = cv2.cvtColor(np.array(img_rgb), cv2.COLOR_RGB2BGR)
    curr_h, curr_w = curr.shape[:2]

    step_ratio = 1.35
    while curr_w < target_w or curr_h < target_h:
        next_w = min(target_w, int(curr_w * step_ratio))
        next_h = min(target_h, int(curr_h * step_ratio))
        if next_w <= curr_w and next_h <= curr_h:
            break

        # Step resize with bicubic interpolation
        curr = cv2.resize(curr, (next_w, next_h), interpolation=cv2.INTER_CUBIC)

        # Apply high-pass Laplacian edge recovery kernel
        kernel = np.array([
            [0, -0.25, 0],
            [-0.25, 2.0, -0.25],
            [0, -0.25, 0]
        ], dtype=np.float32)
        filtered = cv2.filter2D(curr, -1, kernel)
        curr = cv2.addWeighted(curr, 0.75, filtered, 0.25, 0)
        curr = np.clip(curr, 0, 255).astype(np.uint8)

        curr_w, curr_h = next_w, next_h

    # Final exact size match
    if (curr_w, curr_h) != (target_w, target_h):
        curr = cv2.resize(curr, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)

    # Polish with subtle CLAHE
    curr = opencv_clarity_enhancement(curr, apply_clahe=True, apply_unsharp=True, apply_bilateral=False)
    rgb = cv2.cvtColor(curr, cv2.COLOR_BGR2RGB)
    return Image.fromarray(rgb)


def upscale_super_image_nn(img_rgb, scale_factor=2, model_type="pan"):
    """
    Deep Learning Super-Resolution using super-image (PyTorch EDSR / PAN).
    True neural super-resolution that reconstructs fine textures and crisp edges.
    """
    try:
        from super_image import ImageLoader
        import torch

        model_entry, actual_scale = get_super_image_model(scale_factor, model_type=model_type)
        if not model_entry:
            return None

        model, device = model_entry
        inputs = ImageLoader.load_image(img_rgb).to(device)

        with torch.no_grad():
            preds = model(inputs)

        # Convert tensor back to PIL Image
        # preds is in [0, 1] range tensor (1, 3, H, W)
        pred_tensor = preds.squeeze(0).cpu().clamp(0, 1)
        pred_np = (pred_tensor.permute(1, 2, 0).numpy() * 255.0).astype(np.uint8)
        return Image.fromarray(pred_np)
    except Exception as e:
        sys.stderr.write(f"Warning: super-image inference error ({e}).\n")
        return None


def upscale_and_enhance(
    image_base64,
    scale_factor=2,
    sharpness=1.35,
    contrast=1.12,
    saturation=1.08,
    clarity_mode="clean_hd",
    denoise=True,
    engine="auto",
    interpolation="lanczos4"
):
    """
    Master Super-Resolution & Clarity Enhancement Pipeline.
    Supports Clean HD clarity profiles ('clean_hd', 'crisp', 'soft') with
    smart edge-preserving denoising to eliminate grain and artifacts.
    """
    try:
        # Strip data URL prefix if present
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]

        image_data = base64.b64decode(image_base64)
        input_image = Image.open(io.BytesIO(image_data))

        has_alpha = (
            input_image.mode in ("RGBA", "LA")
            or (input_image.mode == "P" and "transparency" in input_image.info)
        )

        if has_alpha:
            img = input_image.convert("RGBA")
            # Auto-trim transparent borders so the product fills the frame cleanly
            bbox = img.getbbox()
            if bbox:
                bx0, by0, bx1, by1 = bbox
                bw, bh = bx1 - bx0, by1 - by0
                if bw > 20 and bh > 20:
                    pad = max(4, int(min(bw, bh) * 0.02))
                    cx0 = max(0, bx0 - pad)
                    cy0 = max(0, by0 - pad)
                    cx1 = min(img.width, bx1 + pad)
                    cy1 = min(img.height, by1 + pad)
                    img = img.crop((cx0, cy0, cx1, cy1))

            r, g, b, alpha = img.split()
            # Clean floating ghost artifacts
            alpha = alpha.point(lambda p: 0 if p < 24 else (255 if p > 240 else p))
            rgb = Image.merge("RGB", (r, g, b))
        else:
            img = input_image.convert("RGB")
            rgb = img
            alpha = None

        w, h = rgb.size
        target_w = int(w * scale_factor)
        target_h = int(h * scale_factor)

        # Max dimension guard (e.g. 4000px max)
        if max(target_w, target_h) > 4000:
            ratio = 4000 / max(target_w, target_h)
            target_w = int(target_w * ratio)
            target_h = int(target_h * ratio)

        engine_used = engine.lower() if engine else "auto"
        upscaled_rgb = None

        # --- ENGINE SELECTION ---

        # 1. Super-Image Neural Super-Resolution
        if engine_used in ("super-image", "superimage", "edsr", "pan"):
            model_type = "edsr" if engine_used == "edsr" else "pan"
            upscaled_rgb = upscale_super_image_nn(rgb, scale_factor=scale_factor, model_type=model_type)
            if upscaled_rgb is not None:
                # If target dimension differs slightly due to model fixed 2x/4x, scale to exact
                if upscaled_rgb.size != (target_w, target_h):
                    upscaled_rgb = upscaled_rgb.resize((target_w, target_h), Image.Resampling.LANCZOS)
                actual_engine = f"super-image ({model_type.upper()})"
            else:
                engine_used = "auto"  # Fallback to auto/opencv

        # 2. OpenCV Upscaler (cv2.resize + CLAHE + unsharp)
        if upscaled_rgb is None and engine_used == "opencv":
            upscaled_rgb = upscale_opencv(
                rgb,
                target_w,
                target_h,
                interpolation=interpolation,
                clarity_mode=clarity_mode,
                denoise=denoise
            )
            actual_engine = f"OpenCV ({interpolation})"

        # 3. Qirias Progressive Multi-Step Upscaler
        if upscaled_rgb is None and engine_used in ("qirias", "progressive"):
            upscaled_rgb = upscale_qirias(rgb, target_w, target_h)
            actual_engine = "Qirias Progressive Multi-Step"

        # 4. Auto / Hybrid Mode (The Best of All 3!)
        if upscaled_rgb is None:
            # Try neural super-resolution first for smaller/medium images
            if max(w, h) <= 1800:
                upscaled_rgb = upscale_super_image_nn(rgb, scale_factor=scale_factor, model_type="pan")

            if upscaled_rgb is not None:
                if upscaled_rgb.size != (target_w, target_h):
                    upscaled_rgb = upscaled_rgb.resize((target_w, target_h), Image.Resampling.LANCZOS)
                # Apply OpenCV clean clarity on top of neural output
                bgr = cv2.cvtColor(np.array(upscaled_rgb), cv2.COLOR_RGB2BGR)
                polished_bgr = opencv_clarity_enhancement(
                    bgr,
                    apply_clahe=True,
                    apply_unsharp=True,
                    apply_bilateral=denoise,
                    clarity_mode=clarity_mode
                )
                upscaled_rgb = Image.fromarray(cv2.cvtColor(polished_bgr, cv2.COLOR_BGR2RGB))
                actual_engine = "Studio Clean HD Hybrid"
            else:
                # High-precision OpenCV Lanczos4 + Clean HD Clarity
                upscaled_rgb = upscale_opencv(
                    rgb,
                    target_w,
                    target_h,
                    interpolation="lanczos4",
                    clarity_mode=clarity_mode,
                    denoise=denoise
                )
                actual_engine = "OpenCV Lanczos4 + Clean HD Clarity"

        # Handle Alpha channel scaling for transparent cutouts
        if alpha:
            alpha_cv = cv2.resize(np.array(alpha), (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)
            _, alpha_clean = cv2.threshold(alpha_cv, 18, 255, cv2.THRESH_TOZERO)
            upscaled_alpha = Image.fromarray(alpha_clean)
        else:
            upscaled_alpha = None

        # --- STUDIO CLEAN CLARITY & LIGHTING POST-PROCESSING ---

        # Gentle tone balance (avoid clipping shadows to harsh pure blacks)
        if clarity_mode == "clean_hd":
            balanced_rgb = upscaled_rgb
        else:
            balanced_rgb = ImageOps.autocontrast(upscaled_rgb, cutoff=0.1)

        # Micro-Contrast
        if contrast != 1.0:
            contrast_enhancer = ImageEnhance.Contrast(balanced_rgb)
            enhanced_rgb = contrast_enhancer.enhance(contrast)
        else:
            enhanced_rgb = balanced_rgb

        # Color Saturation
        if saturation != 1.0:
            color_enhancer = ImageEnhance.Color(enhanced_rgb)
            enhanced_rgb = color_enhancer.enhance(saturation)

        # Micro-sharpness: For Clean HD, the edge-masked unsharp pass in OpenCV is already optimal.
        # Only apply subtle PIL sharpness if user explicitly boosted sharpness.
        if clarity_mode == "crisp" and sharpness > 1.0:
            sharp_enhancer = ImageEnhance.Sharpness(enhanced_rgb)
            final_rgb = sharp_enhancer.enhance(min(1.25, sharpness))
        else:
            final_rgb = enhanced_rgb

        # Output format encoding
        if upscaled_alpha:
            r_c, g_c, b_c = final_rgb.split()
            final_image = Image.merge("RGBA", (r_c, g_c, b_c, upscaled_alpha))
            out_format = "PNG"
            mime_type = "image/png"
        else:
            final_image = final_rgb
            out_format = "JPEG"
            mime_type = "image/jpeg"

        buffered = io.BytesIO()
        final_image.save(buffered, format=out_format, quality=96, optimize=True)
        encoded = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return {
            "success": True,
            "upscaled": f"data:{mime_type};base64,{encoded}",
            "image": f"data:{mime_type};base64,{encoded}",
            "width": target_w,
            "height": target_h,
            "originalWidth": w,
            "originalHeight": h,
            "scaleFactor": scale_factor,
            "clarityMode": clarity_mode,
            "denoised": denoise,
            "engine": actual_engine,
            "stats": {
                "from": f"{w}x{h}",
                "to": f"{target_w}x{target_h}",
                "scale": f"{scale_factor}x",
                "clarity": "Clean HD" if clarity_mode == "clean_hd" else clarity_mode.capitalize(),
                "engine": actual_engine,
            },
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


if __name__ == "__main__":
    try:
        raw_input = sys.stdin.read()
        if not raw_input.strip():
            print(json.dumps({"success": False, "error": "No input data received"}))
            sys.exit(1)

        data = json.loads(raw_input)
        image_base64 = data.get("image")
        scale_factor = float(data.get("scaleFactor") or data.get("scale") or 2.0)
        sharpness = float(data.get("sharpness", 1.35))
        contrast = float(data.get("contrast", 1.12))
        saturation = float(data.get("saturation", 1.08))
        clarity_mode = str(data.get("clarityMode") or data.get("clarity_mode") or "clean_hd").lower()
        denoise = bool(data.get("denoise", True))
        engine = data.get("engine", "auto")
        interpolation = data.get("interpolation", "lanczos4")

        if not image_base64:
            print(json.dumps({"success": False, "error": "Missing image"}))
            sys.exit(1)

        result = upscale_and_enhance(
            image_base64,
            scale_factor=scale_factor,
            sharpness=sharpness,
            contrast=contrast,
            saturation=saturation,
            clarity_mode=clarity_mode,
            denoise=denoise,
            engine=engine,
            interpolation=interpolation
        )
        print("__UPSCALE_JSON_START__\n" + json.dumps(result) + "\n__UPSCALE_JSON_END__")
    except Exception as e:
        print("__UPSCALE_JSON_START__\n" + json.dumps({"success": False, "error": str(e)}) + "\n__UPSCALE_JSON_END__")
        sys.exit(1)
