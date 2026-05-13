# UI Setup & Installation Reference

Quick-start install commands for each UI. All require Python 3.10+ and Git. NVIDIA GPU strongly recommended; AMD and Apple Silicon work with caveats noted.

---

## ComfyUI

```bash
git clone https://github.com/comfyanonymous/ComfyUI
cd ComfyUI
pip install -r requirements.txt

# Install ComfyUI Manager (strongly recommended — handles node installation)
cd custom_nodes
git clone https://github.com/ltdrdata/ComfyUI-Manager
cd ..

# Place models in: ComfyUI/models/checkpoints/
python main.py
# Open: http://127.0.0.1:8188
```

**First steps:**
1. Download a model (e.g., SDXL from Hugging Face) into `models/checkpoints/`
2. Open the default workflow and swap the checkpoint node to your model
3. Install ComfyUI Manager, then browse and install node packs you need

**Useful node packs:**
- `ComfyUI-Impact-Pack` — face detailing, iterative upscaling
- `ComfyUI_IPAdapter_plus` — IP-Adapter for style/face reference
- `comfyui_controlnet_aux` — ControlNet preprocessors
- `rgthree-comfy` — better node management UI

---

## AUTOMATIC1111 Stable Diffusion WebUI

```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
cd stable-diffusion-webui

# Place models in: models/Stable-diffusion/
# Run the installer (downloads dependencies automatically)
./webui.sh         # Linux/Mac
webui-user.bat     # Windows

# Open: http://127.0.0.1:7860
```

**Launch flags** (add to `webui-user.sh` / `COMMANDLINE_ARGS` in `webui-user.bat`):

```bash
--api                    # Enable REST API at /sdapi/v1/
--xformers               # Memory-efficient attention (NVIDIA)
--medvram                # Reduce VRAM usage
--no-half-vae            # Fix black images with some VAEs
--share                  # Create public Gradio link (for remote access)
```

**Useful extensions (install via Extensions tab):**
- `sd-webui-controlnet` — ControlNet
- `sd-webui-inpaint-anything` — segment-anything inpainting
- `multidiffusion-upscaler` — VRAM-friendly upscaling
- `sd-webui-regional-prompter` — control different regions of an image

---

## Stable Diffusion WebUI Forge

```bash
git clone https://github.com/lllyasviel/stable-diffusion-webui-forge
cd stable-diffusion-webui-forge

# Same structure as A1111 — models go in models/Stable-diffusion/
./webui.sh         # Linux/Mac
webui-user.bat     # Windows

# Open: http://127.0.0.1:7860
```

**Migration from A1111:**
- Point `webui-user.sh` at your existing A1111 models folder with `--ckpt-dir /path/to/models`
- Most A1111 extensions work; check the Forge issues page for known incompatibilities
- Same API endpoints as A1111 (`/sdapi/v1/txt2img` etc.) — drop-in for scripts

**Forge-specific advantages:**
- Built-in Flux support (FP8/FP16 quantization options)
- `--always-offload-from-vram` for very low VRAM setups
- Significantly lower peak VRAM vs A1111 on equivalent tasks

---

## InvokeAI

```bash
# Recommended: installer script (handles venv + dependencies)
curl -L https://github.com/invoke-ai/InvokeAI/releases/latest/download/InvokeAI-installer-v*.zip -o invoke.zip
unzip invoke.zip && cd InvokeAI-Installer
./install.sh       # Linux/Mac
install.bat        # Windows

# Or via pip:
pip install "InvokeAI[xformers]" --use-pep517
invokeai-configure  # first-run model download wizard
invokeai           # start the server

# Open: http://127.0.0.1:9090
```

**First-run wizard downloads models interactively.** You can add models later via the Model Manager in the UI.

**API:** Full OpenAPI/Swagger spec at `http://127.0.0.1:9090/docs`. Supports:
- `POST /api/v1/images/generate` — generate images
- `GET /api/v1/images/{image_name}` — retrieve outputs
- WebSocket at `/ws/subscribe` for real-time events

---

## Fooocus

```bash
git clone https://github.com/lllyasviel/Fooocus
cd Fooocus
pip install -r requirements_versions.txt

# First run downloads SDXL model automatically (~6GB)
python entry_with_update.py
# Open: http://127.0.0.1:7865
```

**Presets** (pass at launch):
```bash
python entry_with_update.py --preset realistic    # photorealism focus
python entry_with_update.py --preset anime        # anime style
python entry_with_update.py --listen              # allow network access
```

**Notes:**
- Fooocus manages its own model downloads to `./models/`
- Style presets are in `sdxl_styles/` — you can add custom JSON style definitions
- No significant extension ecosystem — if you need extensions, use Forge instead

---

## SwarmUI

```bash
git clone https://github.com/mcmonkeyprojects/SwarmUI
cd SwarmUI

# Linux/Mac
./launch-linux.sh

# Windows
launch-windows.bat

# Open: http://127.0.0.1:7801
```

**First-run setup wizard** configures backends (ComfyUI, A1111, or both) and downloads models.

**Grid generation:**
1. Go to **Generate** tab
2. Click **Grid** button next to any parameter
3. Enter comma-separated values: `steps: 15, 20, 25` × `cfg: 5, 7, 9`
4. SwarmUI generates all combinations and displays as a grid

**Multi-GPU:**
- Configure additional backends in **Server** → **Backends**
- SwarmUI automatically distributes queued jobs across backends

**API:**
```
POST http://127.0.0.1:7801/API/GenerateText2Image
POST http://127.0.0.1:7801/API/GenerateImage2Image
GET  http://127.0.0.1:7801/API/GetCurrentStatus
```
Full API docs at `http://127.0.0.1:7801/API/` after launch.

---

## Sharing a Models Folder Across UIs

All six UIs can use the same models directory. Save disk space and avoid duplicating multi-GB files:

**A1111 / Forge:** Set `--ckpt-dir`, `--lora-dir`, `--vae-dir` in launch args.

**ComfyUI:** Edit `extra_model_paths.yaml`:
```yaml
a111:
  base_path: /path/to/your/shared/models/
  checkpoints: Stable-diffusion
  vae: VAE
  loras: |
    Lora
    LyCORIS
  embeddings: embeddings
  hypernetworks: hypernetworks
  controlnet: ControlNet
```

**InvokeAI:** Set `models_dir` in `~/.invokeai/invokeai.yaml`.

**Fooocus:** Copy or symlink the `models/` directory. Or set paths in Fooocus settings.

**SwarmUI:** Configure model paths in **Server** → **Server Configuration**.
