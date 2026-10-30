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

# Pre-create ultra-fast lightweight u2netp session strictly on CPU
try:
    session = new_session("u2netp", providers=["CPUExecutionProvider"])
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

        # Perform neural background removal
        if session:
            output_image = remove(input_image, session=session)
        else:
            output_image = remove(input_image)

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
