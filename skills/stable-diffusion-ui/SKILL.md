---
name: stable-diffusion-ui
description: "When the user wants to set up, choose, or use a self-hosted Stable Diffusion UI for marketing image generation. Use when the user mentions 'ComfyUI,' 'AUTOMATIC1111,' 'A1111,' 'SD WebUI,' 'Forge,' 'InvokeAI,' 'Fooocus,' 'SwarmUI,' 'local Stable Diffusion,' 'self-hosted image generation,' 'open-source image generation,' or 'running SD locally.' Also use when the user wants to run image generation without API costs, needs batch generation pipelines, or wants full control over models and workflows. For cloud-based AI image generation (Flux API, Ideogram, Gemini), see image."
metadata:
  version: 1.0.0
---

# Stable Diffusion UI

You are an expert in self-hosted AI image generation for marketing. You help users choose, set up, and use open-source Stable Diffusion UIs to produce marketing assets — without API costs or usage limits.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists, read it before proceeding.

Gather this context before recommending a UI:

1. **Use case** — batch generation, one-off images, inpainting, workflow automation, or team use?
2. **Technical level** — comfortable with CLI and Python, or needs a simple UI?
3. **Hardware** — GPU VRAM (critical for model choice and UI compatibility)
4. **Volume** — occasional use or high-throughput marketing pipeline?
5. **Models needed** — SDXL, Flux, SD 1.5, ControlNet, custom LoRAs?

---

## UI Comparison

Six major open-source UIs, each with a distinct philosophy:

| UI | Best For | Learning Curve | API | GPU VRAM Min |
|----|----------|:-:|:-:|-------------|
| **ComfyUI** | Workflow automation, pipelines, power users | Steep | Yes (REST) | 4GB |
| **A1111 WebUI** | General use, huge extension ecosystem | Moderate | Yes | 4GB |
| **Forge** | A1111 replacement, low VRAM, faster | Moderate | Yes (A1111-compatible) | 2–4GB |
| **InvokeAI** | Professional canvas work, inpainting | Moderate | Yes | 6GB |
| **Fooocus** | Simplest setup, Midjourney-like quality | Low | Limited | 4GB |
| **SwarmUI** | Batch generation, multi-backend, comparisons | Moderate | Yes | 4GB |

---

## The UIs

### ComfyUI
**Repo:** `Comfy-Org/ComfyUI`

Node-based visual workflow editor. Each processing step is a node; you wire them together. The most powerful and flexible option — and the steepest to learn.

**Strengths:**
- JSON workflows are portable, version-controllable, and automatable
- Native REST API — send a workflow JSON and get an image back, no manual clicking
- Supports every architecture: SD 1.5, SDXL, Flux, ControlNet, IP-Adapter, etc.
- Massive node library via [ComfyUI Manager](https://github.com/ltdrdata/ComfyUI-Manager)
- Reproducible outputs — the workflow IS the recipe

**Weaknesses:**
- No "just type a prompt" experience — every session starts with a workflow
- Debugging node chains is non-trivial
- UI looks intimidating to non-technical users

**Marketing use case:** Batch pipeline automation. Generate 50 product shot variations programmatically. Run headless on a server and call via API.

**Quick API usage:**
```python
import json, requests, uuid

workflow = json.load(open("my_workflow.json"))
workflow["3"]["inputs"]["seed"] = 42
workflow["6"]["inputs"]["text"] = "your marketing prompt here"

r = requests.post("http://127.0.0.1:8188/prompt", json={
    "client_id": str(uuid.uuid4()),
    "prompt": workflow,
})
prompt_id = r.json()["prompt_id"]
```

See [references/comfyui-api.md](references/comfyui-api.md) for full workflow automation guide.

---

### AUTOMATIC1111 Stable Diffusion WebUI
**Repo:** `AUTOMATIC1111/stable-diffusion-webui`

The original SD web UI and still the most widely documented. Tab-based interface covering txt2img, img2img, inpainting, extras, and PNG info.

**Strengths:**
- Largest extension ecosystem (1000+ extensions)
- Deep community documentation — almost every question is answered somewhere
- Stable, battle-tested, familiar to anyone who's used SD
- Has a REST API (`--api` launch flag)

**Weaknesses:**
- Slower generation than Forge on the same hardware
- Higher VRAM usage than Forge
- Core development has slowed — Forge is the actively developed fork

**Marketing use case:** General-purpose workhorse when you want the widest extension compatibility and community support.

**Launch with API enabled:**
```bash
./webui.sh --api --nowebui   # API-only mode
# or
./webui.sh --api             # UI + API
```

**API endpoint:**
```
POST http://127.0.0.1:7860/sdapi/v1/txt2img
```

---

### Stable Diffusion WebUI Forge
**Repo:** `lllyasviel/stable-diffusion-webui-forge`

A drop-in fork of A1111 by lllyasviel (also the creator of ControlNet). Replaces A1111's memory management with a redesigned backend that uses significantly less VRAM and generates faster.

**Strengths:**
- 30–100% faster generation than A1111 on the same hardware
- Much lower VRAM — can run SDXL on 4GB cards (A1111 needs 8GB+)
- Fully A1111-compatible — same extensions, same API, same workflows
- First-class support for newer architectures (Flux, SD 3.5)
- Actively maintained

**Weaknesses:**
- Slightly less stable than A1111 on edge-case extensions
- Fewer tutorials specifically for Forge (though A1111 tutorials apply)

**Marketing use case:** Default choice when upgrading from A1111, or when running on mid-range GPUs. Same experience, better performance.

**Migration from A1111:** Drop-in replacement. Point it at your existing models folder, your extensions mostly transfer.

---

### InvokeAI
**Repo:** `invoke-ai/InvokeAI`

Professional-focused UI with a canvas-based interface, strong inpainting/outpainting tools, and team-oriented features. Closest to a design tool among the six.

**Strengths:**
- Canvas interface — drag, paint, and composite images directly
- Best inpainting and outpainting UX of the group
- Workflow editor (node-based, like ComfyUI) plus simple generation mode
- Board/gallery system for organizing outputs — useful for teams
- REST API with OpenAPI spec
- Model management UI built-in

**Weaknesses:**
- Heavier install than A1111/Forge
- Fewer extensions than A1111

**Marketing use case:** Product image retouching, background replacement, and composite scenes where you need precise control over what gets changed. Also good for teams who need shared model/output management.

**API:**
```
POST http://127.0.0.1:9090/api/v1/images/generate
```
Full OpenAPI spec at `http://127.0.0.1:9090/docs`.

---

### Fooocus
**Repo:** `lllyasviel/Fooocus`

Minimal UI designed to be as simple as Midjourney. Hides all technical parameters behind sensible defaults and presets. Optimized for SDXL.

**Strengths:**
- Zero-configuration — install and generate immediately
- Excellent default quality with minimal prompting
- Style presets built-in (Cinematic, Anime, Photography, etc.)
- Very low VRAM floor — runs on 4GB with SDXL
- Best "I just want a good image" experience

**Weaknesses:**
- Limited control — no extension ecosystem
- No batch pipeline API designed for automation
- SDXL-centric — not the right tool for Flux or SD 1.5 workflows

**Marketing use case:** Quick one-off marketing images when you don't want to learn node graphs or fiddle with settings. Good for content marketers who aren't developers.

**Prompt approach (Fooocus optimizes internally):**
```
Product: a SaaS dashboard showing revenue charts, clean UI, dark mode
Style: Professional Photography
Aspect: 16:9
```

---

### SwarmUI
**Repo:** `mcmonkeyprojects/SwarmUI`

Grid-first UI designed for comparing and batch-generating variations. Supports multiple backends (ComfyUI, A1111) and is built for throughput.

**Strengths:**
- Grid generation — vary seed, prompt, model, or settings across a matrix in one click
- Multi-backend — can use ComfyUI or A1111 under the hood
- Multi-GPU support — distribute generation across multiple GPUs
- Good API for automation
- Extension system with preset/workflow sharing

**Weaknesses:**
- Less community content than A1111 or ComfyUI
- Grid UI can feel complex for simple one-off generation

**Marketing use case:** A/B testing visual concepts. Generate a 4×4 grid of variations (different prompts × different styles) to rapidly evaluate what direction works best before committing to a batch.

---

## Choosing the Right UI

```
Do you need to automate generation via code/API?
├── Yes, maximum control → ComfyUI
├── Yes, simple API with familiar syntax → Forge or A1111
└── No ↓

Do you have limited VRAM (under 6GB)?
├── Yes → Forge (best), Fooocus (SDXL only)
└── No ↓

Do you need inpainting / canvas compositing?
├── Yes → InvokeAI
└── No ↓

Do you want to compare many variations quickly?
├── Yes → SwarmUI
└── No ↓

Do you want the simplest possible setup?
└── Fooocus

Do you want the largest extension/community ecosystem?
└── A1111 or Forge (same extensions)
```

---

## Marketing Workflows

### Batch Product Shot Variations (ComfyUI API)

Generate 50 product shot variations overnight without touching the UI:

1. Build the workflow once in ComfyUI (load product image → set style → KSampler)
2. Export as `workflow_api.json` (enable Dev Mode in settings)
3. Write a Python loop to POST the workflow with varied seeds/prompts
4. Pull completed images from `http://127.0.0.1:8188/history/{prompt_id}`

### Background Replacement (InvokeAI)

Replace product photo backgrounds without a studio shoot:

1. Load product photo into InvokeAI canvas
2. Use the mask brush to isolate the product
3. Inpaint the background with your target scene
4. Export at original resolution

### Style Concept Testing (SwarmUI)

Evaluate 4 visual directions before briefing a designer:

1. Write your core prompt: `[product] on a [surface]`
2. Create a prompt grid: vary adjectives (minimal/luxury/playful/technical)
3. Cross with style presets or model variations
4. Review the 16-image grid to pick a direction

### Social Graphics at Scale (Forge + ControlNet)

Generate brand-consistent social headers from a template:

1. Install Forge + ControlNet extension
2. Use your brand asset as a reference image (IP-Adapter for style, Canny for composition)
3. Batch txt2img with varied backgrounds and seasonal themes
4. Post-process with ImageMagick to add text overlays

---

## Hardware Guide

| VRAM | What Runs | Recommended UI |
|------|-----------|----------------|
| 2–4GB | SD 1.5, SDXL (Forge only) | Forge, Fooocus |
| 6–8GB | SDXL, Flux schnell | Forge, InvokeAI, ComfyUI |
| 10–12GB | Flux dev, SD 3.5 | ComfyUI, SwarmUI |
| 16GB+ | Full Flux, multi-model | Any — ComfyUI for pipelines |
| CPU only | Slow but possible | A1111 or Forge with `--use-cpu` |

---

## Model Sources

All UIs use the same model files (`.safetensors` or `.ckpt`):

- **Civitai** — largest community model hub (SDXL, SD 1.5, LoRAs, embeddings)
- **Hugging Face** — official model releases (Flux, SD 3.5, SDXL base)
- **Black Forest Labs** — Flux model family

Place models in each UI's `models/Stable-diffusion/` folder (Forge/A1111) or the configured models directory (ComfyUI/InvokeAI). All six UIs can share the same models folder.

---

## Common Mistakes

1. **Running A1111 instead of Forge** — Forge is faster with the same interface; prefer Forge unless you have a specific extension that requires A1111
2. **Using Fooocus for automation** — it's built for manual use; use ComfyUI or Forge for pipelines
3. **Ignoring VRAM limits** — loading a model too large for your GPU causes OOM crashes; check model requirements first
4. **Not exporting ComfyUI workflows as API format** — the default export format isn't the same as the API format; enable Dev Mode to get the right JSON
5. **Generating marketing images without brand reference** — use IP-Adapter (ComfyUI/Forge) or InvokeAI's reference image to maintain style consistency across outputs
6. **No seeding strategy** — using random seeds means you can't reproduce good results; log seeds of images you like

---

## Related Skills

- **image**: For cloud-based AI image generation (Flux API, Ideogram, Gemini, GPT Image) and image optimization
- **ad-creative**: For platform-specific ad image specs and scaled ad production
- **video**: For AI video generation workflows
- **free-tool-strategy**: If you're considering wrapping a local SD instance as a free tool for users
