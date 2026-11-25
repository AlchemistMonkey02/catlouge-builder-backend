"""
Production AI Super-Resolution & Clarity Upscaler API Service
Built with FastAPI & Uvicorn

Features:
- 4 State-of-the-art Upscaling & Enhancement Engines:
    1. 'auto' / 'hybrid': Neural Super-Resolution (super-image) + OpenCV CLAHE + Studio Lighting
    2. 'super-image': PyTorch Deep Learning (PAN / EDSR Attention Networks) with CUDA acceleration
    3. 'opencv': OpenCV Lanczos4 / Bicubic + CLAHE micro-contrast + Gaussian Unsharp Masking
    4. 'qirias': Progressive Multi-Step Upscaling with Laplacian edge recovery
- Accepts Base64, Image URLs, and Multipart File Uploads
- Returns Base64 JSON (for web/mobile apps) or raw binary image (for direct download or cURL pipes)
- Auto-documentation at /docs (Swagger UI) & /redoc
- Health check at /health
"""

import sys
import os
import io
import time
import base64
import urllib.request
from typing import Optional, Literal
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel, Field

# Ensure server/utils is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
UTILS_DIR = os.path.join(CURRENT_DIR, "utils")
if UTILS_DIR not in sys.path:
    sys.path.insert(0, UTILS_DIR)

from aiUpscale import (
    upscale_and_enhance,
    upscale_opencv,
    upscale_qirias,
    upscale_super_image_nn,
    opencv_clarity_enhancement
)

import torch

# Initialize FastAPI application
app = FastAPI(
    title="Production AI Image Upscaler & Enhancer API",
    description="High-performance Super-Resolution API utilizing PyTorch deep learning (super-image), OpenCV CLAHE, and progressive multi-step algorithms.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for cross-origin integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- REQUEST & RESPONSE SCHEMAS ---

class UpscaleRequest(BaseModel):
    image: str = Field(
        ...,
        description="Image to upscale. Can be a base64 data URL (e.g. 'data:image/jpeg;base64,...'), raw base64 string, or an HTTP/HTTPS image URL."
    )
    scale: float = Field(default=2.0, ge=1.0, le=4.0, description="Upscale factor: 2.0 (2x HD) or 4.0 (4x Ultra 4K).")
    engine: Literal["auto", "hybrid", "super-image", "opencv", "qirias", "pillow"] = Field(
        default="auto",
        description="Upscaling engine to use: 'auto' (Deep Learning + OpenCV CLAHE), 'super-image' (PyTorch Neural Net), 'opencv' (OpenCV Lanczos4 + CLAHE), 'qirias' (Progressive Laplacian)."
    )
    sharpness: float = Field(default=1.35, ge=0.5, le=2.5, description="Edge sharpness multiplier.")
    contrast: float = Field(default=1.12, ge=0.8, le=1.6, description="Micro-contrast multiplier.")
    saturation: float = Field(default=1.08, ge=0.8, le=1.6, description="Color vibrancy multiplier.")
    clarity_mode: str = Field(default="clean_hd", description="Clarity profile: 'clean_hd', 'crisp', 'soft'.")
    denoise: bool = Field(default=True, description="Whether to apply edge-preserving noise & compression artifact reduction.")
    format: Literal["json", "binary"] = Field(
        default="json",
        description="'json' returns base64 string with metadata; 'binary' returns the direct image bytes (image/png or image/jpeg)."
    )


def resolve_image_to_base64(image_input: str) -> str:
    """Helper to resolve URLs or raw base64 to standardized base64 string."""
    image_str = image_input.strip()
    if image_str.startswith("http://") or image_str.startswith("https://"):
        req = urllib.request.Request(
            image_str,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AI Upscaler Service"}
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            content_type = resp.headers.get_content_type() or "image/jpeg"
            return f"data:{content_type};base64,{base64.b64encode(data).decode('utf-8')}"
    return image_str


# --- API ROUTES ---

@app.get("/")
def root():
    """Service status and quick links."""
    return {
        "service": "AI Super-Resolution & Clarity Upscaler API",
        "version": "2.0.0",
        "status": "online",
        "cuda_available": torch.cuda.is_available(),
        "device": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU",
        "engines": [
            {"id": "auto", "name": "Studio Ultra-Hybrid (Neural + OpenCV CLAHE)", "recommended": True},
            {"id": "super-image", "name": "PyTorch Deep Learning (PAN / EDSR)"},
            {"id": "opencv", "name": "OpenCV Lanczos4 + CLAHE Micro-Contrast"},
            {"id": "qirias", "name": "Progressive Multi-Step (Laplacian Edge Recovery)"}
        ],
        "endpoints": {
            "upscale_json": "POST /upscale",
            "upscale_file": "POST /upscale/file",
            "health": "GET /health",
            "documentation": "GET /docs"
        }
    }


@app.get("/health")
def health_check():
    """Production health check for load balancers and Kubernetes probes."""
    return {
        "status": "healthy",
        "uptime": time.time(),
        "cuda": torch.cuda.is_available(),
        "torch_version": torch.__version__
    }


@app.post("/upscale")
def upscale_image_json(payload: UpscaleRequest):
    """
    Primary JSON endpoint.
    Upscales an image provided as a Base64 string or an image URL.
    Returns either rich JSON with metadata, or direct binary image bytes.
    """
    start_time = time.time()
    try:
        base64_data = resolve_image_to_base64(payload.image)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch or decode input image: {str(e)}")

    result = upscale_and_enhance(
        image_base64=base64_data,
        scale_factor=payload.scale,
        sharpness=payload.sharpness,
        contrast=payload.contrast,
        saturation=payload.saturation,
        clarity_mode=payload.clarity_mode,
        denoise=payload.denoise,
        engine=payload.engine
    )

    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Upscaling failed"))

    latency_ms = round((time.time() - start_time) * 1000, 2)
    result["latency_ms"] = latency_ms

    # If binary response requested (e.g. for direct downloads, cURL pipes, or <img src="...">)
    if payload.format == "binary":
        data_url = result["upscaled"]
        header, b64_bytes = data_url.split(",", 1)
        mime_type = header.split(";")[0].replace("data:", "")
        image_bytes = base64.b64decode(b64_bytes)
        return Response(content=image_bytes, media_type=mime_type)

    return result


@app.post("/upscale/file")
async def upscale_image_file(
    file: UploadFile = File(..., description="Image file to upscale (PNG, JPEG, WebP)"),
    scale: float = Form(default=2.0, description="Upscale factor: 2.0 or 4.0"),
    engine: str = Form(default="auto", description="Engine: 'auto', 'super-image', 'opencv', 'qirias'"),
    sharpness: float = Form(default=1.35),
    contrast: float = Form(default=1.12),
    saturation: float = Form(default=1.08),
    format: str = Form(default="json", description="'json' or 'binary'")
):
    """
    Multipart Form / Direct File Upload Endpoint.
    Upload an image file directly from any form, cURL, or client application.
    """
    start_time = time.time()
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    mime_type = file.content_type or "image/jpeg"
    base64_data = f"data:{mime_type};base64,{base64.b64encode(contents).decode('utf-8')}"

    result = upscale_and_enhance(
        image_base64=base64_data,
        scale_factor=scale,
        sharpness=sharpness,
        contrast=contrast,
        saturation=saturation,
        engine=engine
    )

    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Upscaling failed"))

    latency_ms = round((time.time() - start_time) * 1000, 2)
    result["latency_ms"] = latency_ms

    if format == "binary":
        data_url = result["upscaled"]
        header, b64_bytes = data_url.split(",", 1)
        out_mime = header.split(";")[0].replace("data:", "")
        image_bytes = base64.b64decode(b64_bytes)
        return Response(content=image_bytes, media_type=out_mime)

    return result


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("UPSCALE_PORT", 5020))
    print(f"Starting Production AI Upscaler API on port {port}...")
    print(f"Swagger Documentation: http://localhost:{port}/docs")
    uvicorn.run("upscale_api:app", host="0.0.0.0", port=port, reload=False, workers=1)
