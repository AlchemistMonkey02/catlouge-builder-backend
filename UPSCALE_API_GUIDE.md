# Production AI Image Upscaler & Enhancer API Service

High-performance, GPU-accelerated Super-Resolution & Clarity API powered by **FastAPI**, **PyTorch (`super-image`)**, and **OpenCV (`cv2`)**.

---

## 1. Quick Start

### Start the Dedicated FastAPI Service (Port 5020)
```bash
# Option A: Run directly with Python
cd server
python upscale_api.py

# Option B: Run with Uvicorn (multi-worker for production)
uvicorn upscale_api:app --host 0.0.0.0 --port 5020 --workers 2

# Option C: Via npm
npm run upscale:api
```

Once started:
- **Interactive Swagger Docs**: [http://localhost:5020/docs](http://localhost:5020/docs)
- **ReDoc Documentation**: [http://localhost:5020/redoc](http://localhost:5020/redoc)
- **Health Check**: [http://localhost:5020/health](http://localhost:5020/health)

---

## 2. API Endpoints

### `POST /upscale` (JSON: Base64 or Image URL)

#### Request Body:
```json
{
  "image": "https://example.com/product.jpg",
  "scale": 2.0,
  "engine": "auto",
  "sharpness": 1.35,
  "contrast": 1.12,
  "saturation": 1.08,
  "format": "json"
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `image` | `string` | **Required** | Data URL (`data:image/jpeg;base64,...`), raw Base64, or an HTTP/HTTPS image URL |
| `scale` | `float` | `2.0` | Upscale factor (`2.0` = 2x HD, `4.0` = 4x Ultra 4K) |
| `engine` | `string` | `"auto"` | `"auto"` (Hybrid Neural + OpenCV CLAHE), `"super-image"` (PyTorch Deep Learning), `"opencv"` (OpenCV Lanczos4 + CLAHE), `"qirias"` (Progressive Laplacian) |
| `sharpness` | `float` | `1.35` | Micro-edge sharpness multiplier (0.5 to 2.5) |
| `contrast` | `float` | `1.12` | Tone curve / contrast boost (0.8 to 1.6) |
| `saturation` | `float` | `1.08` | Color vibrancy factor (0.8 to 1.6) |
| `format` | `string` | `"json"` | `"json"` (returns Base64 + metadata) or `"binary"` (returns raw image bytes) |

#### Response (JSON):
```json
{
  "success": true,
  "upscaled": "data:image/jpeg;base64,...",
  "image": "data:image/jpeg;base64,...",
  "width": 1600,
  "height": 1200,
  "originalWidth": 800,
  "originalHeight": 600,
  "scaleFactor": 2.0,
  "engine": "Studio Hybrid (super-image Neural + OpenCV CLAHE)",
  "latency_ms": 120.4,
  "stats": {
    "from": "800x600",
    "to": "1600x1200",
    "scale": "2x",
    "engine": "Studio Hybrid (super-image Neural + OpenCV CLAHE)"
  }
}
```

---

### `POST /upscale/file` (Multipart File Upload)

Upload an image file directly from a form or cURL pipe:

#### cURL Example:
```bash
curl -X POST "http://localhost:5020/upscale/file" \
  -F "file=@/path/to/my_product.jpg" \
  -F "scale=2.0" \
  -F "engine=auto" \
  -F "format=binary" \
  --output "upscaled_output.jpg"
```

---

## 3. Integration Examples

### cURL (JSON with Image URL)
```bash
curl -X POST "http://localhost:5020/upscale" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    "scale": 2.0,
    "engine": "auto",
    "format": "json"
  }'
```

### Python (`requests`)
```python
import requests

url = "http://localhost:5020/upscale"
payload = {
    "image": "https://example.com/product.jpg",
    "scale": 2.0,
    "engine": "auto",
    "format": "json"
}

response = requests.post(url, json=payload)
data = response.json()
print("Success:", data["success"])
print("New Dimensions:", data["width"], "x", data["height"])
```

### JavaScript / Node.js
```javascript
const response = await fetch("http://localhost:5020/upscale", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    image: myBase64String,
    scale: 2.0,
    engine: "auto",
    format: "json"
  })
});

const result = await response.json();
console.log(result.stats);
```

---

## 4. Production Deployment

### Run as a Background System Service (Linux Systemd)
Create `/etc/systemd/system/upscaler.service`:
```ini
[Unit]
Description=Production AI Upscaler Service
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/ecommerce-catalog/server
ExecStart=/usr/bin/python3 upscale_api.py
Restart=always
Environment=UPSCALE_PORT=5020

[Install]
WantedBy=multi-user.target
```
Start and enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now upscaler
```

### Run with Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5020
CMD ["uvicorn", "upscale_api:app", "--host", "0.0.0.0", "--port", "5020", "--workers", "2"]
```
