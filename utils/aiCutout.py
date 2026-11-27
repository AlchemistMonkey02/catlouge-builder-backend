import sys
import json
import base64
import io
import os
import warnings
warnings.filterwarnings("ignore")
os.environ["ORT_LOGGING_LEVEL"] = "3"

from PIL import Image
from rembg import remove, new_session
import numpy as np
from scipy.ndimage import binary_fill_holes, binary_closing

# Pre-create high-accuracy isnet-general-use session strictly on CPU (fallback to u2net)
try:
    session = new_session("isnet-general-use", providers=["CPUExecutionProvider"])
except Exception:
    try:
        session = new_session("u2net", providers=["CPUExecutionProvider"])
    except Exception:
        session = None

def process():
    try:
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"success": False, "error": "No input received"}))
            return

        payload = json.loads(input_data)
        image_b64 = payload.get("image")
        if not image_b64:
            print(json.dumps({"success": False, "error": "No image data"}))
            return

        # Strip data uri header if present
        if "," in image_b64:
            image_b64 = image_b64.split(",", 1)[1]

        image_bytes = base64.b64decode(image_b64)
        input_image = Image.open(io.BytesIO(image_bytes))

        # Perform neural background removal with alpha matting for clean fabric/border edges
        if session:
            output_image = remove(
                input_image,
                session=session,
                alpha_matting=True,
                alpha_matting_foreground_threshold=245,
                alpha_matting_background_threshold=20,
                alpha_matting_erode_size=4,
                post_process_mask=True,
            )
        else:
            output_image = remove(input_image, alpha_matting=True, post_process_mask=True)

        # Close small edge notches and fill any enclosed interior holes inside the foreground mask
        rgba_out = output_image.convert("RGBA")
        arr = np.array(rgba_out)
        alpha = arr[:, :, 3]
        closed = binary_closing(alpha > 128, structure=np.ones((15, 15)), iterations=2)
        filled = binary_fill_holes(closed)
        new_alpha = np.where(filled & (alpha <= 128), 255, alpha).astype(np.uint8)
        rgb_in = np.array(input_image.convert("RGB"))
        arr[:, :, :3] = np.where((filled & (alpha <= 128))[:, :, None], rgb_in, arr[:, :, :3])
        arr[:, :, 3] = new_alpha
        # Guard: if foreground is <12% (full-frame fabric close-up with no background), keep original
        if (new_alpha > 128).mean() < 0.12:
            output_image = input_image.convert("RGBA")
        else:
            output_image = Image.fromarray(arr, "RGBA")

        # Encode to PNG base64
        buffered = io.BytesIO()
        output_image.save(buffered, format="PNG")
        output_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

        print(json.dumps({
            "success": True,
            "cutout": f"data:image/png;base64,{output_b64}"
        }))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    process()
