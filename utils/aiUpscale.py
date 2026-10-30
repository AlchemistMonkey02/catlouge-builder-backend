import sys
import json
import base64
import io
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

def upscale_and_enhance(image_base64, scale_factor=2, sharpness=1.35, contrast=1.12, saturation=1.08):
    try:
        # Strip data URL prefix if present
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]

        image_data = base64.b64decode(image_base64)
        input_image = Image.open(io.BytesIO(image_data))

        has_alpha = input_image.mode in ("RGBA", "LA") or (input_image.mode == "P" and "transparency" in input_image.info)
        
        if has_alpha:
            img = input_image.convert("RGBA")
            # Auto-trim transparent borders so the product fills the frame clearly
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
            # Clean floating ghost artifacts (e.g. faint matchbox / background relics below alpha 24)
            alpha = alpha.point(lambda p: 0 if p < 24 else (255 if p > 240 else p))
            rgb = Image.merge("RGB", (r, g, b))
        else:
            img = input_image.convert("RGB")
            rgb = img
            alpha = None

        # 1. Super-Resolution Upscaling with Lanczos filter
        w, h = rgb.size
        target_w = int(w * scale_factor)
        target_h = int(h * scale_factor)
        
        # Max dimension guard (e.g. 4000px max)
        if max(target_w, target_h) > 4000:
            ratio = 4000 / max(target_w, target_h)
            target_w = int(target_w * ratio)
            target_h = int(target_h * ratio)

        upscaled_rgb = rgb.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        if alpha:
            upscaled_alpha = alpha.resize((target_w, target_h), Image.Resampling.LANCZOS)
            upscaled_alpha = upscaled_alpha.point(lambda p: 0 if p < 18 else (255 if p > 235 else p))
        else:
            upscaled_alpha = None

        # 2. Studio Lighting Tone Mapping & Dynamic Range Auto-balance
        # Lifts muddy shadows from phone cameras and normalizes exposure
        balanced_rgb = ImageOps.autocontrast(upscaled_rgb, cutoff=0.5)

        # 3. Micro-Contrast & Texture Clarity
        contrast_enhancer = ImageEnhance.Contrast(balanced_rgb)
        enhanced_rgb = contrast_enhancer.enhance(contrast)

        # 4. Color Vibrancy & White Balance
        color_enhancer = ImageEnhance.Color(enhanced_rgb)
        enhanced_rgb = color_enhancer.enhance(saturation)

        # 5. Dual-Pass Multi-Scale Unsharp Masking
        # Pass 1: Fine-detail edge sharpening for micro-textures (wood grain, metal highlights)
        enhanced_rgb = enhanced_rgb.filter(ImageFilter.UnsharpMask(radius=1.5, percent=140, threshold=2))
        # Pass 2: Global edge definition
        enhanced_rgb = enhanced_rgb.filter(ImageFilter.UnsharpMask(radius=3.0, percent=60, threshold=4))

        # 6. Global Sharpness Boost
        sharp_enhancer = ImageEnhance.Sharpness(enhanced_rgb)
        final_rgb = sharp_enhancer.enhance(sharpness)

        # Recombine with alpha channel if transparent cutout
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
        final_image.save(buffered, format=out_format, quality=95, optimize=True)
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
        sharpness = float(data.get("sharpness", 1.45))
        contrast = float(data.get("contrast", 1.15))
        saturation = float(data.get("saturation", 1.10))

        if not image_base64:
            print(json.dumps({"success": False, "error": "Missing image"}))
            sys.exit(1)

        result = upscale_and_enhance(
            image_base64,
            scale_factor=scale_factor,
            sharpness=sharpness,
            contrast=contrast,
            saturation=saturation
        )
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)
