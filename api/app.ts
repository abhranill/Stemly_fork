import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();

app.use(express.json({ limit: '15mb' }));

// CORS & Preflight handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Lazy GoogleGenAI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY environment variable is not configured. If hosted on Vercel, go to your Vercel Project Settings > Environment Variables, add GEMINI_API_KEY, and redeploy.'
      );
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// System prompt for STEM visualization generation
const VISUAL_SYSTEM_INSTRUCTION = `You are Visu AI's core STEM visualization generator.
Your objective is to generate complete, production-grade, interactive, scientifically accurate STEM visualizations in self-contained HTML/CSS/JavaScript.

CRITICAL MATHEMATICAL & ANIMATION LOGIC REQUIREMENTS:
1. COMPLETE, SELF-CONTAINED & ZERO EXTERNAL DEPENDENCIES:
   - Output must be an entire standalone HTML document (<!DOCTYPE html><html><head>...</head><body>...</body></html>).
   - Use native HTML5 Canvas 2D or WebGL, SVG, or pure JavaScript.
   - NEVER use external CDN scripts (no external Three.js, D3, Chart.js, or MathJax CDN URLs) as they fail or get blocked by iframe sandbox policies. Write clean vanilla JS algorithms.

2. STABLE NUMERICAL PHYSICS & ANIMATION LOOP (PREVENT NaN / EXPLOSIONS):
   - Numerical Integration: ALWAYS use Symplectic Euler (v += a * dt; x += v * dt), Velocity Verlet, or Runge-Kutta 4 (RK4). NEVER use naive forward Euler for oscillators, gravity, pendulums, or wave equations, as energy will artificially accumulate and blow up.
   - Sub-stepping: Implement sub-stepping for physical simulations! Divide each frame's elapsed time into 4 to 8 substeps:
     const subDt = dt / 6;
     for (let step = 0; step < 6; step++) { stepPhysics(subDt); }
   - Delta Time Clamping: ALWAYS clamp delta time in requestAnimationFrame to prevent explosion when returning from background tabs:
     let lastTime = performance.now();
     function loop(now) {
       requestAnimationFrame(loop);
       if (!isRunning || isScrollPaused) return;
       const dt = Math.min((now - lastTime) / 1000, 0.033); // Clamp dt to max 33ms
       lastTime = now;
       if (dt <= 0) return;
       physicsStep(dt);
       render();
     }
     requestAnimationFrame(loop);

3. PRECISE INTERACTION & TOUCH-GESTURE READY COORDINATES:
   - The sandbox environment automatically equips the canvas with a standardized multi-touch gesture handler (supporting 2-finger pinch-to-zoom, 2-finger pan, and double-tap reset).
   - Single-touch and mouse pointer interactions are preserved for your simulation's physical controls (dragging masses, pertubing fields, placing particles, and operating UI sliders).
   - NEVER use raw e.clientX / e.clientY or e.clientX - canvas.offsetLeft!
   - ALWAYS compute accurate canvas relative coordinates using getBoundingClientRect() and canvas scale ratio:
     function getPointerPos(e) {
       const rect = canvas.getBoundingClientRect();
       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
       const clientY = e.touches ? e.touches[0].clientY : e.clientY;
       const dpr = Math.min(window.devicePixelRatio || 1, 2);
       const scaleX = (canvas.width / (rect.width || 1)) / dpr;
       const scaleY = (canvas.height / (rect.height || 1)) / dpr;
       return {
         x: (clientX - rect.left) * scaleX,
         y: (clientY - rect.top) * scaleY
       };
     }
   - Implement intuitive mouse/touch dragging, clicking to perturb/spawn, or mouse-driven viewpoints. Provide clear cursor feedback (e.g. canvas.style.cursor = 'grab' / 'grabbing').

4. RICH VISUAL LOGIC & SCIENTIFIC TELEMETRY:
   - Every visualization must provide rich visual indicators of the physical phenomenon:
     * Fading trajectory paths, orbit trails, or wave crest lines using smooth alpha trails.
     * Dynamic vector arrows for velocity, force, or electric/magnetic fields.
     * A real-time scientific telemetry HUD in the upper-left (e.g., Kinetic Energy, Potential Energy, Total Energy, Frequency, Velocity, Reynolds number, FPS, and governing equation formatted nicely in monospace).
   - High-contrast, glowing scientific palette: deep obsidian background (#080c14), electric cyan (#06b6d4 / #38bdf8), neon emerald (#10b981), amber (#f59e0b), rose/violet (#8b5cf6 / #f43f5e).

5. RESPONSIVE CANVAS & HIGH-DPI RETINA SCALING:
   - Handle canvas resizing cleanly:
     function resize() {
       const dpr = Math.min(window.devicePixelRatio || 1, 2);
       width = canvas.parentElement.clientWidth || window.innerWidth;
       height = canvas.parentElement.clientHeight || window.innerHeight;
       canvas.width = Math.floor(width * dpr);
       canvas.height = Math.floor(height * dpr);
       if (ctx.resetTransform) ctx.resetTransform();
       else ctx.setTransform(1, 0, 0, 1, 0, 0);
       ctx.scale(dpr, dpr);
       originX = width / 2;
       originY = height / 2;
     }
     window.addEventListener('resize', resize);

6. INTUITIVE & WORKING ON-SCREEN CONTROLS:
   - Include a floating glass control bar at the bottom:
     * Play/Pause toggle with visual active state
     * Reset button (restoring initial conditions)
     * Clear Trails button (if applicable)
     * 2 to 4 parameter sliders with live numerical readout spans that update in real-time on input.
   - Wrap element event bindings inside DOMContentLoaded or guarantee elements exist before querying.

7. MANDATORY INTEGRATION HOOKS:
   You MUST include this exact error catching code at the very start of the <head> script:
   \`\`\`javascript
   window.onerror = function(msg, url, line, col, err) {
     window.parent.postMessage({
       type: 'VISU_RUNTIME_ERROR',
       error: {
         message: String(msg),
         line: line,
         column: col,
         stack: err && err.stack ? err.stack : ''
       }
     }, '*');
     return false;
   };
   window.addEventListener('unhandledrejection', function(event) {
     window.parent.postMessage({
       type: 'VISU_RUNTIME_ERROR',
       error: {
         message: event.reason?.message || String(event.reason),
         stack: event.reason?.stack || ''
       }
     }, '*');
   });
   \`\`\`

   And you MUST listen for visibility changes from the parent's IntersectionObserver:
   \`\`\`javascript
   let isScrollPaused = false;
   window.addEventListener('message', function(e) {
     if (e.data && e.data.type === 'VISU_VISIBILITY_CHANGE') {
       isScrollPaused = !e.data.isVisible;
       if (!isScrollPaused && isRunning) {
         lastTime = performance.now();
         requestAnimationFrame(loop);
       }
     }
   });
   \`\`\`

   And notify ready when loaded:
   \`\`\`javascript
   window.addEventListener('DOMContentLoaded', function() {
     window.parent.postMessage({ type: 'VISU_READY' }, '*');
   });
   \`\`\`
`;

// Helper: Parse and normalize Gemini API error
function parseGeminiError(err: any): { message: string; isHighDemand: boolean; statusCode: number } {
  const raw = err?.message || String(err);
  let isHighDemand = false;
  let cleanMessage = raw;

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.error && parsed.error.message) {
        cleanMessage = parsed.error.message;
        if (
          parsed.error.code === 503 ||
          parsed.error.status === 'UNAVAILABLE' ||
          cleanMessage.toLowerCase().includes('high demand') ||
          cleanMessage.toLowerCase().includes('unavailable')
        ) {
          isHighDemand = true;
        }
      }
    }
  } catch {
    // Keep fallback text
  }

  if (
    raw.includes('503') ||
    raw.toLowerCase().includes('high demand') ||
    raw.toLowerCase().includes('unavailable') ||
    raw.includes('RESOURCE_EXHAUSTED')
  ) {
    isHighDemand = true;
  }

  if (isHighDemand) {
    cleanMessage = 'The AI model is currently experiencing a temporary high-demand spike. Please retry in a moment or explore our instant STEM library.';
  }

  return {
    message: cleanMessage,
    isHighDemand,
    statusCode: isHighDemand ? 503 : 500,
  };
}

// Resilient content generator with backoff and model fallbacks
async function generateWithResilience(
  ai: GoogleGenAI,
  requestParams: { contents: any; config: any }
): Promise<any> {
  const candidateModels = [
    'gemini-3.6-flash',
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest',
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      console.log(`Calling Gemini model: ${model}`);
      const response = await Promise.race([
        ai.models.generateContent({
          ...requestParams,
          model,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Model ${model} request timed out (18s)`)), 18000)
        ),
      ]);
      console.log(`Gemini model ${model} succeeded`);
      return response;
    } catch (err: any) {
      lastError = err;
      const { message } = parseGeminiError(err);
      console.warn(`Model ${model} unavailable: ${message}, failing over to next model...`);
    }
  }

  throw lastError;
}

// Robust helpers for universal execution in Express, Vercel Serverless Functions, or Node http
export async function parseRequestBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
  }

  if (typeof req.on === 'function') {
    return new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk: any) => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          resolve(data ? JSON.parse(data) : {});
        } catch {
          resolve({});
        }
      });
      req.on('error', () => resolve({}));
    });
  }

  return {};
}

export function sendJsonResponse(res: any, statusCode: number, payload: any) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  } catch {}

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.end(JSON.stringify(payload));
}

// API: Health check handler
export async function handleHealth(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    } catch {}
    if (typeof res.status === 'function') return res.status(200).end();
    res.statusCode = 200;
    return res.end();
  }

  return sendJsonResponse(res, 200, {
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    nodeEnv: process.env.NODE_ENV || 'production',
  });
}

// API: Generate STEM visual handler
export async function handleGenerateVisual(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    } catch {}
    if (typeof res.status === 'function') return res.status(200).end();
    res.statusCode = 200;
    return res.end();
  }

  try {
    const body = await parseRequestBody(req);
    const { prompt, category } = body;
    if (!prompt || typeof prompt !== 'string') {
      return sendJsonResponse(res, 400, {
        success: false,
        error: 'Prompt is required.',
      });
    }

    const ai = getGenAI();

    const response = await generateWithResilience(ai, {
      contents: `Generate a rich, interactive STEM visualization for the following prompt:
Prompt: "${prompt}"
Category: "${category || 'STEM'}"

Output structured JSON strictly adhering to the schema. The htmlCode must be complete, runnable, and interactive HTML.`,
      config: {
        systemInstruction: VISUAL_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'A crisp, professional title for the visualization',
            },
            category: {
              type: Type.STRING,
              description: 'Primary scientific domain (Physics, Mathematics, Chemistry, Biology, Computer Science, Astronomy, or Other)',
            },
            description: {
              type: Type.STRING,
              description: 'Clear 1-2 sentence explanation of the STEM concept demonstrated',
            },
            scientificPrinciples: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of 2-4 key scientific laws, formulas, or principles behind this concept',
            },
            interactiveFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of controls and interactive actions user can perform',
            },
            htmlCode: {
              type: Type.STRING,
              description: 'The complete self-contained HTML document with inline CSS and JavaScript',
            },
          },
          required: ['title', 'category', 'description', 'scientificPrinciples', 'interactiveFeatures', 'htmlCode'],
        },
      },
    });

    const rawText = response.text ? response.text.trim() : '';
    if (!rawText) {
      throw new Error('No content returned from Gemini model.');
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('Failed to parse generated visualization JSON.');
      }
    }

    return sendJsonResponse(res, 200, {
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error('Error generating visual:', error);
    const parsed = parseGeminiError(error);
    return sendJsonResponse(res, parsed.statusCode, {
      success: false,
      error: parsed.message,
      is503: parsed.isHighDemand,
    });
  }
}

// API: Fix/Self-Heal STEM visual handler
export async function handleFixVisual(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    } catch {}
    if (typeof res.status === 'function') return res.status(200).end();
    res.statusCode = 200;
    return res.end();
  }

  try {
    const body = await parseRequestBody(req);
    const { originalPrompt, brokenCode, error } = body;
    if (!brokenCode) {
      return sendJsonResponse(res, 400, {
        success: false,
        error: 'Broken code is required for fixing.',
      });
    }

    const ai = getGenAI();

    const fixInstruction = `You are Visu AI's automated self-healing debugger.
A generated STEM visualization threw a syntax error or runtime exception when executed in the browser sandbox.

ORIGINAL USER PROMPT:
"${originalPrompt || 'STEM visualization'}"

DETECTED RUNTIME / SYNTAX ERROR:
Message: ${error?.message || 'Unknown syntax or render error'}
Line: ${error?.line || 'N/A'}
Column: ${error?.column || 'N/A'}
Stack Trace:
${error?.stack || 'No stack trace available'}

BROKEN CODE:
\`\`\`html
${brokenCode}
\`\`\`

TASK:
1. Identify the exact root cause of the syntax error or runtime crash.
2. Rewrite the HTML code completely to fix this error and guarantee bug-free execution.
3. Preserve all STEM interactivity, controls, dark mode aesthetic, and the mandatory message handlers (VISU_RUNTIME_ERROR, VISU_VISIBILITY_CHANGE, and VISU_READY).
4. Enforce mathematical physics stability: clamp delta time dt to <= 0.033s, use sub-stepping, avoid naive Euler, ensure getBoundingClientRect() is used for pointer coordinates, and ensure all getElementById calls are safe.
5. Provide a clear 1-2 sentence summary of what was fixed.`;

    const response = await generateWithResilience(ai, {
      contents: fixInstruction,
      config: {
        systemInstruction: VISUAL_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fixSummary: {
              type: Type.STRING,
              description: 'Brief explanation of what bug/syntax error was repaired',
            },
            htmlCode: {
              type: Type.STRING,
              description: 'The repaired complete self-contained HTML document',
            },
          },
          required: ['fixSummary', 'htmlCode'],
        },
      },
    });

    const rawText = response.text ? response.text.trim() : '';
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('Failed to parse fix visual JSON response.');
      }
    }

    return sendJsonResponse(res, 200, {
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error('Error fixing visual:', error);
    const parsed = parseGeminiError(error);
    return sendJsonResponse(res, parsed.statusCode, {
      success: false,
      error: parsed.message,
      is503: parsed.isHighDemand,
    });
  }
}

// Bind Express routes (for container, tsx server, or Express hosting)
app.get(['/api/health', '/health'], handleHealth);
app.post(['/api/generate-visual', '/generate-visual'], handleGenerateVisual);
app.post(['/api/fix-visual', '/fix-visual'], handleFixVisual);

export default app;
