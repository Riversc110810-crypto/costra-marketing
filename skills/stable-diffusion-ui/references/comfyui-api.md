# ComfyUI API Reference

ComfyUI exposes a WebSocket + REST API that lets you run workflows programmatically — no UI interaction needed. This is the foundation of headless marketing pipelines.

## Enabling the API

ComfyUI's API is always on. Start normally and the API is available at `http://127.0.0.1:8188`.

```bash
python main.py --listen 0.0.0.0   # expose to network (for remote servers)
python main.py                     # localhost only (default)
```

## Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/prompt` | POST | Queue a workflow for generation |
| `/history/{prompt_id}` | GET | Poll status and get output image paths |
| `/view` | GET | Download a generated image |
| `/queue` | GET | See current queue status |
| `/interrupt` | POST | Cancel the current generation |
| `/system_stats` | GET | GPU/CPU memory usage |

## Workflow API Format

ComfyUI has two workflow formats:
- **UI format** — what you see when you `Save` in the UI (contains visual layout data)
- **API format** — what the `/prompt` endpoint accepts (nodes only, no layout)

To export API format: **Settings → Enable Dev Mode Options**, then use **Save (API Format)** button.

## Full Python Example

```python
import json
import uuid
import time
import requests
from pathlib import Path

COMFY_URL = "http://127.0.0.1:8188"

def queue_prompt(workflow: dict) -> str:
    payload = {"client_id": str(uuid.uuid4()), "prompt": workflow}
    r = requests.post(f"{COMFY_URL}/prompt", json=payload)
    r.raise_for_status()
    return r.json()["prompt_id"]

def wait_for_completion(prompt_id: str, poll_interval: float = 1.0) -> dict:
    while True:
        r = requests.get(f"{COMFY_URL}/history/{prompt_id}")
        history = r.json()
        if prompt_id in history:
            return history[prompt_id]
        time.sleep(poll_interval)

def download_outputs(history_entry: dict, out_dir: str = "outputs") -> list[str]:
    Path(out_dir).mkdir(exist_ok=True)
    saved = []
    for node_output in history_entry["outputs"].values():
        for img in node_output.get("images", []):
            params = {"filename": img["filename"], "subfolder": img["subfolder"], "type": img["type"]}
            r = requests.get(f"{COMFY_URL}/view", params=params)
            dest = Path(out_dir) / img["filename"]
            dest.write_bytes(r.content)
            saved.append(str(dest))
    return saved

# --- Usage ---

workflow = json.load(open("workflow_api.json"))

# Modify nodes before queuing
# Node IDs are strings matching what's in the JSON ("6", "3", etc.)
workflow["6"]["inputs"]["text"] = "minimalist SaaS dashboard, dark mode, clean UI"
workflow["3"]["inputs"]["seed"] = 12345
workflow["5"]["inputs"]["batch_size"] = 4          # generate 4 images

prompt_id = queue_prompt(workflow)
print(f"Queued: {prompt_id}")

result = wait_for_completion(prompt_id)
paths = download_outputs(result, out_dir="marketing-outputs")
print(f"Saved: {paths}")
```

## Batch Generation Loop

Generate many variations by iterating over prompts and seeds:

```python
import random

prompts = [
    "product hero image, white background, studio lighting, photorealistic",
    "product lifestyle shot, coffee shop setting, warm tones",
    "product flat lay, minimal, overhead, clean shadows",
]

results = []
for prompt_text in prompts:
    workflow["6"]["inputs"]["text"] = prompt_text
    workflow["3"]["inputs"]["seed"] = random.randint(0, 2**32)

    pid = queue_prompt(workflow)
    hist = wait_for_completion(pid)
    paths = download_outputs(hist, out_dir=f"batch/{prompt_text[:30]}")
    results.extend(paths)

print(f"Generated {len(results)} images")
```

## WebSocket (Real-Time Progress)

For live progress updates during generation:

```python
import websocket
import json
import uuid

client_id = str(uuid.uuid4())
ws = websocket.WebSocket()
ws.connect(f"ws://127.0.0.1:8188/ws?clientId={client_id}")

# Queue a prompt using the same client_id
# Then listen for progress events
while True:
    msg = json.loads(ws.recv())
    if msg["type"] == "progress":
        step = msg["data"]["value"]
        total = msg["data"]["max"]
        print(f"Step {step}/{total}")
    elif msg["type"] == "executing" and msg["data"]["node"] is None:
        print("Generation complete")
        break

ws.close()
```

## Finding Node IDs

Node IDs in the API JSON correspond to what you see in the UI. The easiest way to find which node controls what:

1. Open your workflow in ComfyUI
2. Click a node — its ID shows in the title bar or node header
3. In the API JSON, that number is the key: `"6": {"class_type": "CLIPTextEncode", ...}`

Common node types:
- `CLIPTextEncode` — your positive/negative prompts
- `KSampler` — seed, steps, CFG, sampler settings
- `EmptyLatentImage` — width, height, batch size
- `CheckpointLoaderSimple` — which model to use
- `SaveImage` — output directory prefix

## Workflow Parameterization Pattern

For marketing pipelines, parameterize your workflow at the top of your script:

```python
CONFIG = {
    "prompt": "your marketing prompt",
    "negative": "blurry, low quality, watermark",
    "model": "sdxl_base_1.0.safetensors",
    "width": 1200,
    "height": 630,   # blog hero / OG image size
    "steps": 25,
    "cfg": 7.0,
    "seed": 42,
    "batch": 1,
}

# Map to workflow nodes
workflow["4"]["inputs"]["ckpt_name"] = CONFIG["model"]
workflow["6"]["inputs"]["text"] = CONFIG["prompt"]
workflow["7"]["inputs"]["text"] = CONFIG["negative"]
workflow["3"]["inputs"]["seed"] = CONFIG["seed"]
workflow["3"]["inputs"]["steps"] = CONFIG["steps"]
workflow["3"]["inputs"]["cfg"] = CONFIG["cfg"]
workflow["5"]["inputs"]["width"] = CONFIG["width"]
workflow["5"]["inputs"]["height"] = CONFIG["height"]
workflow["5"]["inputs"]["batch_size"] = CONFIG["batch"]
```

## Running Headless (No UI)

To run ComfyUI as a pure API server without opening the browser:

```bash
python main.py --dont-print-server   # suppress server URL messages
```

For server deployments, use `--listen 0.0.0.0 --port 8188` and restrict access via firewall or reverse proxy authentication.
