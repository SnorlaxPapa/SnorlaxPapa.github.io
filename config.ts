// ============================================================================
// SITE CONFIG
// ----------------------------------------------------------------------------
// This is the only file you need to edit to make this template your own.
// Fill in your info below and the whole terminal (boot sequence, prompt,
// and every command) updates automatically.
// ============================================================================

export interface Experience {
  role: string;
  org: string;
  period: string;
  location?: string;
  bullets: string[];
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  status?: string;
  links?: { label: string; url: string }[];
}

export interface ContactLink {
  label: string;
  url: string;
}

export interface SiteConfig {
  identity: {
    /** Your name, shown in `whoami` / `about`. */
    name: string;
    /** Shell username shown in the prompt, e.g. "jane" in jane@pww:~$ */
    handle: string;
    /** Shell hostname shown in the prompt, e.g. "pww" in jane@pww:~$ */
    host: string;
    role: string;
    tagline: string;
    location: string;
  };
  theme: {
    /** Primary phosphor color. Try amber (#ffb000) or blue (#33aaff) too. */
    accent: string;
    /** Dimmer shade of the accent, used for secondary text. */
    accentDim: string;
    /** Screen background color. */
    background: string;
    /** Whether CRT effects (scanlines/glow/flicker) start on by default. */
    crtDefaultOn: boolean;
  };
  /** Lines printed one-by-one during the boot sequence on page load. */
  boot: string[];
  about: string[];
  experiences: Experience[];
  projects: Project[];
  contact: {
    email: string;
    links: ContactLink[];
  };
}

// Defined once and reused below so the prompt, boot log, and about text
// never drift out of sync when you edit them.
const name = "Rongyang Ye";
const handle = "rongyang";
const host = "ucla";

const config: SiteConfig = {
  identity: {
    name,
    handle,
    host,
    role: "Computer Science student & ML systems builder",
    tagline: "Efficient AI systems, from GPU kernels to inference engines.",
    location: "Los Angeles, CA",
  },

  theme: {
    accent: "#33ff66",
    accentDim: "#72b681",
    background: "#0a0f0a",
    crtDefaultOn: true,
  },

  boot: [
    "BIOS v4.20.16 -- RONGYANG TERMINAL",
    "Initializing memory... OK",
    `Mounting /home/${handle}... OK`,
    "Starting portfolio.service... OK",
    "",
    "Welcome. Type 'help' to see available commands.",
  ],

  about: [
    `Hi, I'm ${name} -- a computer science student at UCLA interested in`,
    "machine learning systems, GPU programming, and practical inference.",
    "",
    "I build systems that make models faster and more memory efficient,",
    "from custom Triton kernels to small-device computer vision.",
  ],

  experiences: [
    {
      role: "Administrative In-Charge",
      org: "Singapore Armed Forces",
      period: "Jan 2024 - Dec 2025",
      location: "Singapore",
      bullets: [
        "Managed manpower tracking, safety processes, and personnel documentation for a 200+ person military company",
        "Built Google Forms, Pandas validation workflows, and Google Sheets dashboards, reducing manual processing by approximately 90%",
        "Awarded the Commanding Officer's coin for digitalization efforts",
      ],
    },
    {
      role: "B.S. Computer Science",
      org: "University of California, Los Angeles",
      period: "Expected Jun 2030",
      location: "Los Angeles, CA",
      bullets: [
        "Languages: Python, JavaScript",
        "ML stack: Triton, PyTorch, Hugging Face, vLLM, Ultralytics",
        "Tools: Git, Linux, Excel, Docker",
      ],
    },
  ],

  projects: [
    {
      name: "mini-vllm-inference",
      description: "A PyTorch inference runtime for Qwen2.5-3B-Instruct with iteration-level scheduling, chunked prefill, prefix caching, paged KV-cache management, preemption, and CUDA graph replay.",
      tech: ["PyTorch", "Triton", "vLLM", "Hugging Face"],
      links: [
        { label: "repo", url: "https://github.com/SnorlaxPapa/tiny-vllm" },
      ],
    },
    {
      name: "custom-triton-kernels",
      description: "Custom Softmax, Layer Normalization, and FlashAttention-2 forward and backward kernels with causal masking and fused gradient computation. Up to 1.5x higher backward throughput on an RTX 4080.",
      tech: ["Triton", "GPU optimization"],
      links: [
        { label: "repo", url: "https://github.com/SnorlaxPapa/triton-kernels-custom" },
      ],
    },
    {
      name: "recyclable-object-detection",
      description: "A YOLOv8n model trained on a curated 20,000-image dataset and deployed with ONNX Runtime on a Raspberry Pi 4 at 2 FPS.",
      tech: ["YOLOv8n", "Roboflow", "ONNX Runtime"],
    },
    {
      name: "deepseek-v3-distributed-training",
      description: "I'm working on distributed training using the DeepSeek-V3 architecture.",
      tech: ["Distributed training", "DeepSeek-V3"],
      status: "IN PROGRESS",
    },
  ],

  contact: {
    email: "yerongyang@g.ucla.edu",
    links: [
      { label: "GitHub", url: "https://github.com/SnorlaxPapa" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/rongyang-ye-272a01367/" },
    ],
  },
};

export default config;
