import { useEffect, useRef, useState } from 'react'

const DEFAULT_VALUES = { brightness: 100, contrast: 100, saturate: 100, hue: 0, sepia: 0, grayscale: 0, smooth: 0 }

const FILTERS = [
  { id: 'none',       label: 'Asli',         values: { ...DEFAULT_VALUES } },
  { id: 'clarity',    label: 'Clarity',      values: { ...DEFAULT_VALUES, brightness: 102, contrast: 120, saturate: 112 } },
  { id: 'editorial',  label: 'Editorial',    values: { ...DEFAULT_VALUES, contrast: 122, saturate: 90, hue: 4 } },
  { id: 'goldenhour', label: 'Golden Hour',  values: { ...DEFAULT_VALUES, brightness: 108, contrast: 98, saturate: 120, hue: -12, sepia: 28 } },
  { id: 'tealorange', label: 'Teal & Orange',values: { ...DEFAULT_VALUES, brightness: 102, contrast: 112, saturate: 125, hue: 8, sepia: 10 } },
  { id: 'rosegold',   label: 'Rose Gold',    values: { ...DEFAULT_VALUES, brightness: 106, saturate: 118, hue: -4, sepia: 22 } },
  { id: 'matte',      label: 'Matte',        values: { ...DEFAULT_VALUES, brightness: 104, contrast: 82, saturate: 92, sepia: 8 } },
  { id: 'fade',       label: 'Fade',         values: { ...DEFAULT_VALUES, brightness: 106, contrast: 80, saturate: 88, sepia: 12 } },
  { id: 'moody',      label: 'Moody',        values: { ...DEFAULT_VALUES, brightness: 92, contrast: 118, saturate: 85, hue: -6, sepia: 5 } },
  { id: 'bw',         label: 'Hitam Putih',  values: { ...DEFAULT_VALUES, contrast: 112, grayscale: 100 } },
  { id: 'noir',       label: 'Noir',         values: { ...DEFAULT_VALUES, brightness: 88, contrast: 145, grayscale: 100 } },
  { id: 'sepia',      label: 'Sephia',       values: { ...DEFAULT_VALUES, brightness: 103, contrast: 105, sepia: 75 } },
  { id: 'vintage',    label: 'Vintage',      values: { ...DEFAULT_VALUES, brightness: 106, contrast: 92, saturate: 125, hue: -8, sepia: 35 } },
  { id: 'vivid',      label: 'Vivid',        values: { ...DEFAULT_VALUES, contrast: 115, saturate: 160 } },
  { id: 'cool',       label: 'Dingin',       values: { ...DEFAULT_VALUES, brightness: 104, saturate: 110, hue: 18 } },
  { id: 'warm',       label: 'Hangat',       values: { ...DEFAULT_VALUES, brightness: 105, saturate: 130, hue: -8, sepia: 20 } },
]

const SLIDERS = [
  { key: 'brightness', label: 'Kecerahan',  min: 50,  max: 150, unit: '%' },
  { key: 'contrast',   label: 'Kontras',    min: 50,  max: 150, unit: '%' },
  { key: 'saturate',   label: 'Saturasi',   min: 0,   max: 200, unit: '%' },
  { key: 'hue',        label: 'Hue',        min: -180, max: 180, unit: '°' },
  { key: 'sepia',      label: 'Sephia',     min: 0,   max: 100, unit: '%' },
  { key: 'grayscale',  label: 'Grayscale',  min: 0,   max: 100, unit: '%' },
]

const BEAUTY_SLIDER = { key: 'smooth', label: 'Halus & glow', min: 0, max: 100, unit: '%' }

const FRAMES = [
  { id: 'none',      label: 'Tanpa bingkai', style: 'none',     swatchBg: '#0e0c0a' },
  { id: 'polaroid',  label: 'Polaroid',      style: 'polaroid', swatchBg: '#F0E6D2' },
  { id: 'film',      label: 'Film strip',    style: 'film',     swatchBg: '#111111' },
  { id: 'sunset',    label: 'Sunset',        style: 'sunset',   swatchBg: 'linear-gradient(135deg,#FF6F91,#FF9F45,#FFD56B)' },
  { id: 'holo',      label: 'Holographic',   style: 'holo',     swatchBg: 'linear-gradient(135deg,#7F5AF0,#2CB1BC,#FF61D2,#FFD166)' },
  { id: 'gold',      label: 'Gold Foil',     style: 'gold',     swatchBg: 'linear-gradient(135deg,#B8860B,#F9E9B0,#D4AF37)' },
  { id: 'confetti',  label: 'Confetti',      style: 'confetti', swatchBg: '#F3ECDD' },
  { id: 'stamp',     label: 'Perangko',      style: 'stamp',    swatchBg: '#EDE0C8' },
  { id: 'amber',     label: 'Amber',         style: 'mat', color: '#F2B33D', border: '#fff6e3', swatchBg: '#F2B33D' },
  { id: 'plum',      label: 'Plum',          style: 'mat', color: '#3B2142', border: '#efe0c9', swatchBg: '#3B2142' },
  { id: 'mint',      label: 'Mint',          style: 'mat', color: '#4F7C6B', border: '#f2ede0', swatchBg: '#4F7C6B' },
  { id: 'blush',     label: 'Blush',         style: 'mat', color: '#D98A8A', border: '#fff3ec', swatchBg: '#D98A8A' },
  { id: 'ocean',     label: 'Ocean',         style: 'mat', color: '#2C5B73', border: '#eaf4f7', swatchBg: '#2C5B73' },
  { id: 'scallop',   label: 'Scallop',       style: 'scallop', swatchBg: '#FFFFFF' },
  { id: 'ticket',    label: 'Tiket',         style: 'ticket',  swatchBg: '#EFE6D2' },
  { id: 'neon',      label: 'Neon',          style: 'neon',    swatchBg: '#150E1F' },
  { id: 'washi',     label: 'Scrapbook',     style: 'washi',   swatchBg: '#F3ECDD' },
  { id: 'mono',      label: 'Mono Dot',      style: 'mono',    swatchBg: '#FFFFFF' },
]

// starting sticker library — the user can add their own text/emoji or upload
// an image sticker on top of this (feature: custom stickers)
const DEFAULT_STICKERS = [
  { id: 'heart',   kind: 'emoji', content: '❤️' },
  { id: 'sparkle', kind: 'emoji', content: '✨' },
  { id: 'star',    kind: 'emoji', content: '⭐' },
  { id: 'flower',  kind: 'emoji', content: '🌸' },
  { id: 'ribbon',  kind: 'emoji', content: '🎀' },
  { id: 'balloon', kind: 'emoji', content: '🎈' },
  { id: 'party',   kind: 'emoji', content: '🎉' },
  { id: 'cloud',   kind: 'emoji', content: '☁️' },
  { id: 'clover',  kind: 'emoji', content: '🍀' },
  { id: 'sun',     kind: 'emoji', content: '☀️' },
  { id: 'moon',    kind: 'emoji', content: '🌙' },
  { id: 'fire',    kind: 'emoji', content: '🔥' },
]

const LAYOUTS = [
  { id: 'single', label: 'Single',   shots: 1, cols: 1, rows: 1 },
  { id: 'strip3', label: 'Strip 3',  shots: 3, cols: 1, rows: 3 },
  { id: 'strip4', label: 'Strip 4',  shots: 4, cols: 1, rows: 4 },
  { id: 'grid',   label: 'Grid 2x2', shots: 4, cols: 2, rows: 2 },
]
// upper bound (in total pixel area) per layout — the actual capture uses the
// phone's real, currently-displayed aspect ratio, so it scales with whatever
// the device/browser/orientation provides instead of a hardcoded ratio
const CAPTURE_CAP = { single: [3840, 2880], strip3: [1600, 1200], strip4: [1600, 1200], grid: [1280, 960] }
function withCell(layout, cell) { return { ...layout, cellW: cell[0], cellH: cell[1] } }

// picks the largest cell that fits the ratio the booth screen is ACTUALLY
// showing right now (desktop landscape 4:3, mobile portrait 3:4, etc.),
// capped by CAPTURE_CAP's pixel area so multi-shot layouts stay a reasonable
// file size. Matching the on-screen ratio (instead of a fixed 4:3) is what
// fixes the "photo looks zoomed in" issue on phones.
function resolveCaptureCell(layoutId, video, screenEl) {
  const [capW, capH] = CAPTURE_CAP[layoutId]
  let targetRatio = capW / capH
  const rect = screenEl?.getBoundingClientRect()
  if (rect && rect.width > 0 && rect.height > 0) targetRatio = rect.width / rect.height

  const nativeW = video?.videoWidth || capW
  const nativeH = video?.videoHeight || capH
  const nativeRatio = nativeW / nativeH
  let w, h
  if (nativeRatio > targetRatio) { h = nativeH; w = Math.round(h * targetRatio) }
  else { w = nativeW; h = Math.round(w / targetRatio) }

  const capArea = capW * capH
  const area = w * h
  if (area > capArea) {
    const scale = Math.sqrt(capArea / area)
    w = Math.round(w * scale)
    h = Math.round(h * scale)
  }
  return [w, h]
}

const TIMER_OPTIONS = [
  { value: 0,  label: 'Tanpa' },
  { value: 3,  label: '3 dtk' },
  { value: 5,  label: '5 dtk' },
  { value: 10, label: '10 dtk' },
]

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// used only for the LIVE video preview, applied as a real CSS filter on the
// <video> element — this always renders reliably in the browser
function buildFilterCss(v) {
  return `brightness(${v.brightness}%) contrast(${v.contrast}%) saturate(${v.saturate}%) hue-rotate(${v.hue}deg) sepia(${v.sepia}%) grayscale(${v.grayscale}%)`
}

function clamp255(v) { return v < 0 ? 0 : v > 255 ? 255 : v }

// Applies brightness/contrast/saturate/hue-rotate/sepia/grayscale by hand,
// pixel by pixel, instead of relying on the canvas 2D `filter` property.
// Canvas `filter` support is inconsistent on some phone WebViews/in-app
// browsers, which is exactly why the downloaded photo used to come out with
// no effect applied even though the live view looked filtered — this
// guarantees the exported photo always matches what was previewed.
function applyManualFilter(imageData, v) {
  const d = imageData.data
  const brightnessMul = v.brightness / 100
  const contrastMul = v.contrast / 100
  const saturateMul = v.saturate / 100
  const hueRad = (v.hue || 0) * Math.PI / 180
  const sepiaAmt = (v.sepia || 0) / 100
  const grayAmt = (v.grayscale || 0) / 100
  const cosH = Math.cos(hueRad), sinH = Math.sin(hueRad)

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i + 1], b = d[i + 2]

    r *= brightnessMul; g *= brightnessMul; b *= brightnessMul

    r = (r - 128) * contrastMul + 128
    g = (g - 128) * contrastMul + 128
    b = (b - 128) * contrastMul + 128
    r = clamp255(r); g = clamp255(g); b = clamp255(b)

    if (hueRad !== 0) {
      const nr = (0.213 + cosH * 0.787 - sinH * 0.213) * r + (0.715 - cosH * 0.715 - sinH * 0.715) * g + (0.072 - cosH * 0.072 + sinH * 0.928) * b
      const ng = (0.213 - cosH * 0.213 + sinH * 0.143) * r + (0.715 + cosH * 0.285 + sinH * 0.140) * g + (0.072 - cosH * 0.072 - sinH * 0.283) * b
      const nb = (0.213 - cosH * 0.213 - sinH * 0.787) * r + (0.715 - cosH * 0.715 + sinH * 0.715) * g + (0.072 + cosH * 0.928 + sinH * 0.072) * b
      r = clamp255(nr); g = clamp255(ng); b = clamp255(nb)
    }

    if (saturateMul !== 1) {
      const gray = 0.213 * r + 0.715 * g + 0.072 * b
      r = clamp255(gray + (r - gray) * saturateMul)
      g = clamp255(gray + (g - gray) * saturateMul)
      b = clamp255(gray + (b - gray) * saturateMul)
    }

    if (sepiaAmt > 0) {
      const sr = r * 0.393 + g * 0.769 + b * 0.189
      const sg = r * 0.349 + g * 0.686 + b * 0.168
      const sb = r * 0.272 + g * 0.534 + b * 0.131
      r = clamp255(r + (sr - r) * sepiaAmt)
      g = clamp255(g + (sg - g) * sepiaAmt)
      b = clamp255(b + (sb - b) * sepiaAmt)
    }

    if (grayAmt > 0) {
      const gy = 0.213 * r + 0.715 * g + 0.072 * b
      r = r + (gy - r) * grayAmt
      g = g + (gy - g) * grayAmt
      b = b + (gy - b) * grayAmt
    }

    d[i] = clamp255(r); d[i + 1] = clamp255(g); d[i + 2] = clamp255(b)
  }
  return imageData
}

// draws `cell` into `ctx` at (x,y,w,h) with the color filter baked in
// pixel-by-pixel, and returns the filtered offscreen canvas so callers (the
// beauty-glow pass) can reuse the already-filtered pixels
function drawCellWithFilter(ctx, cell, x, y, w, h, filterValues) {
  const off = document.createElement('canvas')
  off.width = w; off.height = h
  const octx = off.getContext('2d')
  octx.drawImage(cell, 0, 0, w, h)
  const imgData = octx.getImageData(0, 0, w, h)
  applyManualFilter(imgData, filterValues)
  octx.putImageData(imgData, 0, 0)
  ctx.drawImage(off, x, y, w, h)
  return off
}

function roundRectPath(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// scalloped (wavy bump) rectangle outline, bumps pointing outward on every side
function scallopedRectPath(ctx, x, y, w, h, r) {
  const nTop = Math.max(2, Math.round(w / (2 * r)))
  const nSide = Math.max(2, Math.round(h / (2 * r)))
  const rTop = w / (2 * nTop)
  const rSide = h / (2 * nSide)
  ctx.beginPath()
  ctx.moveTo(x, y)
  for (let i = 0; i < nTop; i++) ctx.arc(x + rTop * (2 * i + 1), y, rTop, Math.PI, 0, false)
  for (let i = 0; i < nSide; i++) ctx.arc(x + w, y + rSide * (2 * i + 1), rSide, -Math.PI / 2, Math.PI / 2, false)
  for (let i = 0; i < nTop; i++) ctx.arc(x + w - rTop * (2 * i + 1), y + h, rTop, 0, Math.PI, false)
  for (let i = 0; i < nSide; i++) ctx.arc(x, y + h - rSide * (2 * i + 1), rSide, Math.PI / 2, -Math.PI / 2, false)
  ctx.closePath()
}

function drawTape(ctx, cx, cy, w, h, angleDeg, color) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(angleDeg * Math.PI / 180)
  ctx.fillStyle = color
  ctx.fillRect(-w / 2, -h / 2, w, h)
  ctx.restore()
}

function drawSparkleStar(ctx, cx, cy, size, color, alpha = 1) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx, cy - size)
  ctx.lineTo(cx + size * 0.28, cy - size * 0.28)
  ctx.lineTo(cx + size, cy)
  ctx.lineTo(cx + size * 0.28, cy + size * 0.28)
  ctx.lineTo(cx, cy + size)
  ctx.lineTo(cx - size * 0.28, cy + size * 0.28)
  ctx.lineTo(cx - size, cy)
  ctx.lineTo(cx - size * 0.28, cy - size * 0.28)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawConfettiPiece(ctx, cx, cy, size, angleDeg, color, shape) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(angleDeg * Math.PI / 180)
  ctx.fillStyle = color
  if (shape === 'circle') {
    ctx.beginPath(); ctx.arc(0, 0, size / 2, 0, Math.PI * 2); ctx.fill()
  } else {
    ctx.fillRect(-size / 2, -size / 4, size, size / 2)
  }
  ctx.restore()
}

function drawEmojiSticker(ctx, cx, cy, size, text) {
  ctx.save()
  ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, cx, cy)
  ctx.restore()
}

const CONFETTI_SPOTS = [
  { xf: 0.06, yf: 0.05, size: 10, angle: 20,  color: '#F2B33D', shape: 'rect' },
  { xf: 0.92, yf: 0.06, size: 8,  angle: -30, color: '#B23A3A', shape: 'circle' },
  { xf: 0.05, yf: 0.94, size: 9,  angle: 50,  color: '#4F7C6B', shape: 'rect' },
  { xf: 0.94, yf: 0.93, size: 11, angle: -10, color: '#3B2142', shape: 'circle' },
  { xf: 0.5,  yf: 0.03, size: 7,  angle: 5,   color: '#D98A8A', shape: 'circle' },
  { xf: 0.5,  yf: 0.97, size: 8,  angle: -20, color: '#F2B33D', shape: 'rect' },
  { xf: 0.03, yf: 0.5,  size: 8,  angle: 40,  color: '#2C5B73', shape: 'circle' },
  { xf: 0.97, yf: 0.5,  size: 9,  angle: -45, color: '#B23A3A', shape: 'rect' },
  { xf: 0.16, yf: 0.02, size: 6,  angle: 0,   color: '#3B2142', shape: 'circle' },
  { xf: 0.84, yf: 0.02, size: 7,  angle: 15,  color: '#4F7C6B', shape: 'rect' },
  { xf: 0.15, yf: 0.98, size: 7,  angle: -25, color: '#F2B33D', shape: 'circle' },
  { xf: 0.85, yf: 0.98, size: 8,  angle: 35,  color: '#D98A8A', shape: 'rect' },
]
const SPARKLE_SPOTS = [
  { xf: 0.08, yf: 0.1,  size: 9 }, { xf: 0.9, yf: 0.08, size: 7 },
  { xf: 0.12, yf: 0.85, size: 7 }, { xf: 0.88, yf: 0.88, size: 10 },
  { xf: 0.5, yf: 0.06, size: 6 },  { xf: 0.06, yf: 0.5, size: 6 },
  { xf: 0.94, yf: 0.5, size: 6 },  { xf: 0.5, yf: 0.94, size: 7 },
]

// professional-style skin smoothing: blends a slightly blurred, slightly
// brightened copy of the ALREADY color-filtered cell using soft-light so
// skin looks smoother without the whole photo turning blurry
function drawSkinGlow(ctx, filteredCell, x, y, w, h, smoothPct) {
  if (smoothPct <= 0) return
  const layer = document.createElement('canvas')
  layer.width = w; layer.height = h
  const lctx = layer.getContext('2d')
  lctx.filter = `blur(${(smoothPct / 100 * 2.4).toFixed(2)}px) brightness(1.03)`
  lctx.drawImage(filteredCell, 0, 0, w, h)
  ctx.save()
  ctx.globalAlpha = Math.min(0.55, smoothPct / 100 * 0.6)
  ctx.globalCompositeOperation = 'soft-light'
  ctx.drawImage(layer, x, y, w, h)
  ctx.restore()
}

function frameGeometry(frame, layout, scale = 1) {
  const g = (() => {
    switch (frame.style) {
      case 'none':     return { pad: { t: 0, r: 0, b: 0, l: 0 }, gap: 6, radius: 6 }
      case 'polaroid': return { pad: { t: 26, r: 26, b: layout.rows > 1 ? 60 : 92, l: 26 }, gap: 10, radius: 14 }
      case 'film':     return { pad: { t: 18, r: 34, b: 18, l: 34 }, gap: 4, radius: 4 }
      case 'mat':      return { pad: { t: 16, r: 16, b: 16, l: 16 }, gap: 10, radius: 16 }
      case 'scallop':  return { pad: { t: 36, r: 36, b: 36, l: 36 }, gap: 10, radius: 0 }
      case 'ticket':   return { pad: { t: 22, r: 40, b: 22, l: 40 }, gap: 10, radius: 0 }
      case 'neon':     return { pad: { t: 26, r: 26, b: 26, l: 26 }, gap: 10, radius: 18 }
      case 'washi':    return { pad: { t: 24, r: 24, b: 24, l: 24 }, gap: 10, radius: 14 }
      case 'mono':     return { pad: { t: 26, r: 26, b: 26, l: 26 }, gap: 8, radius: 8 }
      case 'sunset':   return { pad: { t: 18, r: 18, b: 18, l: 18 }, gap: 10, radius: 18 }
      case 'holo':     return { pad: { t: 28, r: 28, b: 28, l: 28 }, gap: 10, radius: 20 }
      case 'gold':     return { pad: { t: 20, r: 20, b: 20, l: 20 }, gap: 10, radius: 14 }
      case 'confetti': return { pad: { t: 30, r: 30, b: 30, l: 30 }, gap: 10, radius: 14 }
      case 'stamp':    return { pad: { t: 26, r: 26, b: 26, l: 26 }, gap: 10, radius: 0 }
      default:         return { pad: { t: 16, r: 16, b: 16, l: 16 }, gap: 10, radius: 12 }
    }
  })()
  return {
    pad: { t: g.pad.t * scale, r: g.pad.r * scale, b: g.pad.b * scale, l: g.pad.l * scale },
    gap: g.gap,
    radius: g.radius * scale,
  }
}

// capture one raw (unfiltered) frame at target size, cover-fit cropped from
// the video's current native resolution. `zoom` further shrinks the source
// rect for the digital-zoom fallback (used when the camera track has no
// native zoom capability) — mirrored only for the front camera
function captureRaw(video, w, h, mirror, zoom = 1) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')
  ctx.save()
  if (mirror) { ctx.translate(w, 0); ctx.scale(-1, 1) }
  const vw = video.videoWidth, vh = video.videoHeight
  const targetRatio = w / h, srcRatio = vw / vh
  let sw, sh
  if (srcRatio > targetRatio) { sh = vh; sw = vh * targetRatio }
  else { sw = vw; sh = vw / targetRatio }
  sw = sw / zoom
  sh = sh / zoom
  const sx = (vw - sw) / 2
  const sy = (vh - sh) / 2
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h)
  ctx.restore()
  return c
}

// `placedStickers`: [{ kind:'emoji'|'image', content, img, xf, yf, size }]
// xf/yf are 0..1 fractions of the final image; size is a % of the final
// image width. These come straight from the draggable overlay in the UI so
// stickers land in the exact same place the user dropped them.
function composeOutput(rawCells, layout, filterValues, frame, frameScale, placedStickers) {
  const geo = frameGeometry(frame, layout, frameScale)
  const { t: padTop, r: padRight, b: padBottom, l: padLeft } = geo.pad
  const gap = geo.gap
  const radius = geo.radius

  const contentW = layout.cols * layout.cellW + (layout.cols - 1) * gap
  const contentH = layout.rows * layout.cellH + (layout.rows - 1) * gap
  const W = padLeft + contentW + padRight
  const H = padTop + contentH + padBottom

  const out = document.createElement('canvas')
  out.width = W; out.height = H
  const ctx = out.getContext('2d')

  const cellBorder = frame.style === 'mat' || frame.style === 'sunset' || frame.style === 'holo' || frame.style === 'gold'
  const cellBorderColor = frame.style === 'mat' ? frame.border
    : frame.style === 'sunset' ? '#FFF6E9'
    : frame.style === 'holo' ? '#FFFFFF'
    : frame.style === 'gold' ? '#FFF8E7' : '#FFFFFF'

  if (frame.style === 'none') {
    // transparent
  } else if (frame.style === 'scallop') {
    ctx.save()
    scallopedRectPath(ctx, 14, 14, W - 28, H - 28, 13)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()
    ctx.restore()
  } else if (frame.style === 'stamp') {
    ctx.save()
    scallopedRectPath(ctx, 10, 10, W - 20, H - 20, 7)
    ctx.fillStyle = '#EDE0C8'
    ctx.fill()
    ctx.restore()
    ctx.save()
    ctx.setLineDash([5, 5])
    ctx.strokeStyle = '#8C7A54'
    ctx.lineWidth = 1.5
    ctx.strokeRect(20, 20, W - 40, H - 40)
    ctx.restore()
  } else if (frame.style === 'ticket') {
    ctx.fillStyle = '#EFE6D2'
    ctx.fillRect(0, 0, W, H)
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath(); ctx.arc(0, H / 2, 16, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(W, H / 2, 16, 0, Math.PI * 2); ctx.fill()
    ctx.restore()
    ctx.save()
    ctx.setLineDash([7, 6])
    ctx.strokeStyle = '#8C2B2B'
    ctx.lineWidth = 2
    ctx.strokeRect(9, 9, W - 18, H - 18)
    ctx.restore()
  } else if (frame.style === 'neon') {
    ctx.save()
    roundRectPath(ctx, 0, 0, W, H, radius)
    ctx.fillStyle = '#150E1F'
    ctx.fill()
    ctx.restore()
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#FF4FD8'); grad.addColorStop(0.5, '#4FF2E0'); grad.addColorStop(1, '#F2B33D')
    ctx.save()
    ctx.shadowColor = 'rgba(79,242,224,0.65)'
    ctx.shadowBlur = 22
    ctx.lineWidth = 5
    ctx.strokeStyle = grad
    roundRectPath(ctx, 10, 10, W - 20, H - 20, Math.max(0, radius - 6))
    ctx.stroke()
    ctx.restore()
  } else if (frame.style === 'mono') {
    ctx.save()
    roundRectPath(ctx, 0, 0, W, H, radius)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()
    ctx.restore()
    ctx.save()
    ctx.strokeStyle = '#111111'
    ctx.lineWidth = 3
    roundRectPath(ctx, 10, 10, W - 20, H - 20, 6)
    ctx.stroke()
    ctx.fillStyle = '#111111'
    for (let xx = 18; xx < W - 14; xx += 10) {
      ctx.beginPath(); ctx.arc(xx, 12, 1.6, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(xx, H - 12, 1.6, 0, Math.PI * 2); ctx.fill()
    }
    for (let yy = 18; yy < H - 14; yy += 10) {
      ctx.beginPath(); ctx.arc(12, yy, 1.6, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(W - 12, yy, 1.6, 0, Math.PI * 2); ctx.fill()
    }
    ctx.restore()
  } else if (frame.style === 'sunset') {
    ctx.save()
    roundRectPath(ctx, 0, 0, W, H, radius)
    ctx.clip()
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#FF6F91'); grad.addColorStop(0.5, '#FF9F45'); grad.addColorStop(1, '#FFD56B')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
    ctx.restore()
  } else if (frame.style === 'holo') {
    ctx.save()
    roundRectPath(ctx, 0, 0, W, H, radius)
    ctx.fillStyle = '#1b1330'
    ctx.fill()
    ctx.clip()
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#7F5AF0'); grad.addColorStop(0.35, '#2CB1BC'); grad.addColorStop(0.68, '#FF61D2'); grad.addColorStop(1, '#FFD166')
    ctx.globalAlpha = 0.88
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
    ctx.globalAlpha = 1
    ctx.restore()
    SPARKLE_SPOTS.forEach(s => drawSparkleStar(ctx, s.xf * W, s.yf * H, s.size, '#FFFFFF', 0.85))
  } else if (frame.style === 'gold') {
    ctx.save()
    roundRectPath(ctx, 0, 0, W, H, radius)
    ctx.clip()
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#B8860B'); grad.addColorStop(0.5, '#F9E9B0'); grad.addColorStop(1, '#D4AF37')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)
    ctx.restore()
    ctx.save()
    ctx.strokeStyle = 'rgba(120,84,10,0.55)'
    ctx.lineWidth = 1.5
    roundRectPath(ctx, 8, 8, W - 16, H - 16, Math.max(0, radius - 4))
    ctx.stroke()
    ctx.restore()
  } else {
    // polaroid, film, mat, washi, confetti
    const bg = frame.style === 'film' ? '#111111'
      : frame.style === 'mat' ? frame.color
      : (frame.style === 'washi' || frame.style === 'confetti') ? '#F3ECDD'
      : '#F0E6D2'
    ctx.save()
    roundRectPath(ctx, 0, 0, W, H, radius)
    ctx.clip()
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)
    ctx.restore()
  }

  rawCells.forEach((cell, i) => {
    const col = i % layout.cols
    const row = Math.floor(i / layout.cols)
    const x = padLeft + col * (layout.cellW + gap)
    const y = padTop + row * (layout.cellH + gap)

    if (cellBorder) {
      ctx.fillStyle = cellBorderColor
      ctx.fillRect(x - 4, y - 4, layout.cellW + 8, layout.cellH + 8)
    }
    const filtered = drawCellWithFilter(ctx, cell, x, y, layout.cellW, layout.cellH, filterValues)
    drawSkinGlow(ctx, filtered, x, y, layout.cellW, layout.cellH, filterValues.smooth || 0)
  })

  if (frame.style === 'film') {
    ctx.fillStyle = '#e9e2d3'
    const holeR = 5
    const bandCenterL = padLeft / 2 - 1
    const bandCenterR = W - padRight / 2 + 1
    const step = 26
    for (let yy = 14; yy < H - 6; yy += step) {
      ctx.beginPath(); ctx.arc(bandCenterL, yy, holeR, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(bandCenterR, yy, holeR, 0, Math.PI * 2); ctx.fill()
    }
  } else if (frame.style === 'polaroid') {
    ctx.fillStyle = '#3a3226'
    ctx.textAlign = 'center'
    const size = layout.rows > 1 ? 22 : 26
    ctx.font = `italic 600 ${size}px Fraunces, serif`
    ctx.fillText('snap booth', W / 2, H - padBottom / 2 + 8)
  } else if (frame.style === 'washi') {
    drawTape(ctx, padLeft * 0.85, padTop * 0.85, 92, 34, -10, 'rgba(242,179,61,0.85)')
    drawTape(ctx, W - padRight * 0.85, H - padBottom * 0.85, 92, 34, 12, 'rgba(178,58,58,0.55)')
  } else if (frame.style === 'confetti') {
    CONFETTI_SPOTS.forEach(c => drawConfettiPiece(ctx, c.xf * W, c.yf * H, c.size, c.angle, c.color, c.shape))
  }

  // stickers (#7): drawn exactly where the user dragged them in the overlay,
  // xf/yf/size are fractions of the final image so the mapping is 1:1
  placedStickers.forEach(s => {
    const cx = s.xf * W, cy = s.yf * H
    const sizePx = (s.size / 100) * W
    if (s.kind === 'image' && s.img && s.img.complete && s.img.naturalWidth) {
      const ratio = s.img.naturalWidth / s.img.naturalHeight
      const w = sizePx, h = sizePx / ratio
      ctx.drawImage(s.img, cx - w / 2, cy - h / 2, w, h)
    } else if (s.kind !== 'image') {
      drawEmojiSticker(ctx, cx, cy, sizePx, s.content)
    }
  })

  return out
}

export default function App() {
  const videoRef = useRef(null)
  const screenRef = useRef(null)
  const countNumRef = useRef(null)
  const flashRef = useRef(null)
  const outputCanvasRef = useRef(null)
  const pendingCanvasRef = useRef(null)
  const streamRef = useRef(null)
  const pendingCellsRef = useRef([])
  const captureCellRef = useRef(CAPTURE_CAP.single)
  const overlayRef = useRef(null)
  const [previewWidth, setPreviewWidth] = useState(0)
  const uidRef = useRef(0)
  function nextUid(prefix) { uidRef.current += 1; return `${prefix}-${uidRef.current}` }

  const [stage, setStage] = useState('shoot') // 'shoot' | 'review'
  const [filterValues, setFilterValues] = useState({ ...DEFAULT_VALUES })
  const [activePreset, setActivePreset] = useState('none')
  const [slidersOpen, setSlidersOpen] = useState(false)
  const [layoutId, setLayoutId] = useState('single')
  const [timerSec, setTimerSec] = useState(3)
  const [busy, setBusy] = useState(false)
  const [permDenied, setPermDenied] = useState(false)
  const [shotStatus, setShotStatus] = useState('siap')
  const [switchingCam, setSwitchingCam] = useState(false)

  // camMode: 'front' | 'back' | 'wide'. camGroups holds the actual detected
  // MediaDeviceInfo per category once the browser exposes device labels
  // (only available after camera permission has been granted at least once)
  const [camMode, setCamMode] = useState('front')
  const [camGroups, setCamGroups] = useState({ front: null, back: null, wide: null })
  const [zoom, setZoom] = useState(1)
  const [zoomCaps, setZoomCaps] = useState(null) // {min,max,step} when the track supports real zoom, else null (digital fallback)

  const [captureIndex, setCaptureIndex] = useState(0)
  const [pendingCell, setPendingCell] = useState(null)

  const [capturedCells, setCapturedCells] = useState(null)
  const [capturedLayout, setCapturedLayout] = useState(null)
  const [capturedFilterValues, setCapturedFilterValues] = useState({ ...DEFAULT_VALUES })
  const [reviewFrame, setReviewFrame] = useState('polaroid')
  const [reviewFrameScale, setReviewFrameScale] = useState(1)
  const [outputNote, setOutputNote] = useState('')

  // sticker library (presets + anything the user has typed/uploaded) and the
  // instances actually placed & dragged onto the current photo
  const [stickerLibrary, setStickerLibrary] = useState(DEFAULT_STICKERS)
  const [placedStickers, setPlacedStickers] = useState([])
  const [activeStickerId, setActiveStickerId] = useState(null)
  const [draggingId, setDraggingId] = useState(null)
  const [customStickerText, setCustomStickerText] = useState('')

  const layout = LAYOUTS.find(l => l.id === layoutId)
  const filterCss = buildFilterCss(filterValues)
  const mirror = camMode === 'front'
  const isCapturing = busy || !!pendingCell
  const zoomMin = zoomCaps?.min ?? 1
  const zoomMax = zoomCaps?.max ?? 3
  const zoomStep = zoomCaps?.step ?? 0.1

  async function enumerateCams() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const vids = devices.filter(d => d.kind === 'videoinput')
      let front = null, back = null, wide = null
      vids.forEach(d => {
        const label = d.label.toLowerCase()
        if (!front && /front|user|depan|face/.test(label)) front = d
        else if (!wide && /ultra|wide angle|superwide|0\.5x/.test(label)) wide = d
        else if (!back && /back|rear|environment|belakang/.test(label)) back = d
      })
      setCamGroups({ front, back, wide })
    } catch {
      // enumerateDevices can fail/be unavailable — camera still works via facingMode fallback
    }
  }

  async function startCamera(mode) {
    const useMode = mode || camMode
    streamRef.current?.getTracks().forEach(t => t.stop())
    const device = camGroups[useMode]
    const videoConstraints = device
      ? { deviceId: { exact: device.deviceId }, width: { ideal: 4096 }, height: { ideal: 3072 } }
      : { facingMode: useMode === 'front' ? 'user' : 'environment', width: { ideal: 4096 }, height: { ideal: 3072 } }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setPermDenied(false)
      const track = stream.getVideoTracks()[0]
      const caps = track.getCapabilities ? track.getCapabilities() : null
      if (caps && caps.zoom && caps.zoom.max > caps.zoom.min) {
        setZoomCaps({ min: caps.zoom.min, max: caps.zoom.max, step: caps.zoom.step || 0.1 })
        setZoom(Math.min(caps.zoom.max, Math.max(caps.zoom.min, 1)))
      } else {
        setZoomCaps(null)
        setZoom(1)
      }
      if (!device) await enumerateCams()
    } catch (err) {
      setPermDenied(true)
    }
  }

  async function flipCamera() {
    if (switchingCam || isCapturing) return
    setSwitchingCam(true)
    const next = camMode === 'front' ? 'back' : 'front'
    await startCamera(next)
    setCamMode(next)
    setSwitchingCam(false)
  }

  async function selectCamera(mode) {
    if (switchingCam || isCapturing || mode === camMode) return
    setSwitchingCam(true)
    await startCamera(mode)
    setCamMode(mode)
    setSwitchingCam(false)
  }

  function setZoomValue(v) {
    const clamped = Math.min(zoomMax, Math.max(zoomMin, v))
    setZoom(clamped)
    if (zoomCaps) {
      const track = streamRef.current?.getVideoTracks()?.[0]
      track?.applyConstraints?.({ advanced: [{ zoom: clamped }] }).catch(() => {})
    }
  }

  useEffect(() => {
    startCamera('front')
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [])

  useEffect(() => {
    if (videoRef.current) videoRef.current.style.filter = filterCss
  }, [filterCss])

  // mirrors the front camera + applies digital zoom (feature #5 fallback)
  // to the live video display; matches captureRaw's crop math exactly so
  // what's on screen is always what gets captured
  useEffect(() => {
    if (!videoRef.current) return
    const digitalScale = zoomCaps ? 1 : zoom
    const mirrorSign = mirror ? -1 : 1
    videoRef.current.style.transform = `scaleX(${mirrorSign * digitalScale}) scaleY(${digitalScale})`
  }, [mirror, zoom, zoomCaps])

  // draw the just-taken shot (full filter + glow applied) into the confirm overlay
  useEffect(() => {
    if (!pendingCell) return
    const canvas = pendingCanvasRef.current
    if (!canvas) return
    const w = pendingCell.width, h = pendingCell.height
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    const filtered = drawCellWithFilter(ctx, pendingCell, 0, 0, w, h, filterValues)
    drawSkinGlow(ctx, filtered, 0, 0, w, h, filterValues.smooth || 0)
  }, [pendingCell, filterValues])

  // recompose the review canvas whenever the captured photos, frame, frame
  // size or stickers change
  useEffect(() => {
    if (stage !== 'review' || !capturedCells || !capturedLayout) return
    const composed = composeOutput(
      capturedCells, capturedLayout, capturedFilterValues,
      FRAMES.find(f => f.id === reviewFrame), reviewFrameScale, placedStickers
    )
    const canvas = outputCanvasRef.current
    if (!canvas) return
    canvas.width = composed.width
    canvas.height = composed.height
    canvas.getContext('2d').drawImage(composed, 0, 0)
  }, [stage, capturedCells, capturedLayout, capturedFilterValues, reviewFrame, reviewFrameScale, placedStickers])

  // tracks the review canvas's actual on-screen width so sticker size (set
  // as a % of the final image) can be converted to real px in the drag
  // overlay — measured via ResizeObserver instead of CSS container-query
  // units, which collapse the wrapper's size when it has no explicit width
  useEffect(() => {
    if (stage !== 'review') return
    const el = outputCanvasRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect ? entry.contentRect.width : entry.target.getBoundingClientRect().width
        setPreviewWidth(w)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [stage])

  function applyPreset(f) {
    setFilterValues({ ...f.values, smooth: filterValues.smooth })
    setActivePreset(f.id)
  }

  function adjustSlider(key, value) {
    setFilterValues(v => ({ ...v, [key]: value }))
    setActivePreset('custom')
  }

  function resetFilters() {
    setFilterValues({ ...DEFAULT_VALUES })
    setActivePreset('none')
  }

  // --- stickers: add to library / place on canvas / drag / resize / remove ---
  function placeSticker(entry) {
    setPlacedStickers(list => {
      if (list.length >= 14) return list
      const n = list.length
      const xf = 0.5 + ((n % 3) - 1) * 0.16
      const yf = 0.5 + (Math.floor(n / 3) % 3 - 1) * 0.16
      return [...list, {
        uid: nextUid('sticker'),
        kind: entry.kind,
        content: entry.content,
        img: entry.img || null,
        xf, yf,
        size: entry.kind === 'image' ? 20 : 14,
      }]
    })
  }

  function addCustomEmojiSticker() {
    const text = customStickerText.trim()
    if (!text) return
    const entry = { id: nextUid('custom'), kind: 'emoji', content: text }
    setStickerLibrary(lib => [...lib, entry])
    placeSticker(entry)
    setCustomStickerText('')
  }

  function handleStickerImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const entry = { id: nextUid('img'), kind: 'image', content: reader.result, img }
        setStickerLibrary(lib => [...lib, entry])
        placeSticker(entry)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function removeSticker(uid) {
    setPlacedStickers(list => list.filter(s => s.uid !== uid))
    setActiveStickerId(cur => (cur === uid ? null : cur))
  }

  function resizeSticker(uid, delta) {
    setPlacedStickers(list => list.map(s => s.uid === uid ? { ...s, size: Math.min(45, Math.max(6, s.size + delta)) } : s))
  }

  function handleStickerPointerDown(e, uid) {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setActiveStickerId(uid)
    setDraggingId(uid)
  }
  function handleStickerPointerMove(e, uid) {
    if (draggingId !== uid || !overlayRef.current) return
    const rect = overlayRef.current.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    let xf = (e.clientX - rect.left) / rect.width
    let yf = (e.clientY - rect.top) / rect.height
    xf = Math.min(1, Math.max(0, xf))
    yf = Math.min(1, Math.max(0, yf))
    setPlacedStickers(list => list.map(s => s.uid === uid ? { ...s, xf, yf } : s))
  }
  function handleStickerPointerUp(e, uid) {
    if (draggingId === uid) setDraggingId(null)
  }

  async function runCountdown(duration) {
    for (let n = duration; n >= 1; n--) {
      const el = countNumRef.current
      if (el) {
        el.textContent = n
        el.classList.remove('show'); void el.offsetWidth
        el.classList.add('show')
      }
      await sleep(n > 3 ? 550 : 700)
    }
    countNumRef.current?.classList.remove('show')
  }

  function fireFlash() {
    const el = flashRef.current
    if (!el) return
    el.classList.remove('fire'); void el.offsetWidth
    el.classList.add('fire')
  }

  // captures ONE shot at full resolution, then pauses and shows a confirm/retake screen
  async function captureOneShot(idx) {
    setBusy(true)
    setCaptureIndex(idx)
    setShotStatus(layout.shots > 1 ? `foto ${idx + 1} dari ${layout.shots}` : 'bersiap...')
    if (timerSec > 0) await runCountdown(timerSec)
    fireFlash()
    await sleep(90)
    const captureLayout = withCell(layout, captureCellRef.current)
    const digitalZoom = zoomCaps ? 1 : zoom
    const cell = captureRaw(videoRef.current, captureLayout.cellW, captureLayout.cellH, mirror, digitalZoom)
    setBusy(false)
    setPendingCell(cell)
  }

  function handleShutter() {
    if (isCapturing || !streamRef.current) return
    pendingCellsRef.current = []
    // lock in the capture resolution for this whole sequence, based on the
    // phone's actual current camera feed AND the aspect ratio really shown
    // on screen right now (so it matches the real device, no more "zoom")
    captureCellRef.current = resolveCaptureCell(layout.id, videoRef.current, screenRef.current)
    captureOneShot(0)
  }

  function handleRetakeShot() {
    if (busy) return
    setPendingCell(null)
    captureOneShot(captureIndex)
  }

  function handleNextShot() {
    if (!pendingCell) return
    const cells = [...pendingCellsRef.current, pendingCell]
    pendingCellsRef.current = cells
    setPendingCell(null)
    if (captureIndex + 1 < layout.shots) {
      captureOneShot(captureIndex + 1)
    } else {
      setShotStatus('selesai')
      setCapturedCells(cells)
      setCapturedLayout(withCell(layout, captureCellRef.current))
      setCapturedFilterValues(filterValues)
      setOutputNote('Pilih bingkai, atur ukurannya, lalu tempel stiker sesukamu.')
      setStage('review')
    }
  }

  function handleRetake() {
    setStage('shoot')
    setCapturedCells(null)
    setShotStatus('siap')
    setPlacedStickers([])
    setActiveStickerId(null)
    setReviewFrameScale(1)
  }

  function handleDownload() {
    const canvas = outputCanvasRef.current
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `snapbooth-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <div className="wrap">
      <header>
        <div>
          <div className="wordmark"><span className="logo-mark">◎</span>snap<span>booth</span></div>
          <div className="tagline">Studio foto digital di browser kamu — atur filter, jepret, lalu pilih bingkai &amp; stiker untuk hasilnya.</div>
        </div>
      </header>

      {stage === 'shoot' ? (
        <div className="stage" key="shoot">
          <div className="booth">
            <div className="screen" ref={screenRef}>
              <video ref={videoRef} autoPlay playsInline muted />
              {pendingCell && (
                <div className="shot-confirm-overlay">
                  <canvas ref={pendingCanvasRef} className="shot-confirm-canvas"></canvas>
                </div>
              )}
              <div className="countdown-num" ref={countNumRef}></div>
              <div className="flash-overlay" ref={flashRef}></div>
              <button className="flip-cam-btn" onClick={flipCamera} disabled={switchingCam || isCapturing} aria-label="Ganti kamera">⟲</button>
              {permDenied && (
                <div className="perm-msg">
                  <div>Butuh izin kamera untuk mulai motret.</div>
                  <button onClick={() => startCamera('front')}>Aktifkan kamera</button>
                </div>
              )}
            </div>
            <div className="booth-label">
              <span><span className="rec-dot"></span>LIVE VIEWFINDER</span>
              <span>{shotStatus}</span>
            </div>

            {pendingCell ? (
              <div className="shot-confirm-actions">
                <button className="ghost-btn" onClick={handleRetakeShot}>↺ Ambil ulang</button>
                <button className="shutter-btn small" onClick={handleNextShot}>
                  {captureIndex + 1 < layout.shots ? 'Lanjut ke foto berikutnya' : 'Selesai, lihat hasil'}
                </button>
              </div>
            ) : (
              <div className="shutter-row">
                <button className="shutter-btn" onClick={handleShutter} disabled={isCapturing || permDenied}>Jepret</button>
                <div className="shutter-hint">{layout.shots === 1 ? '1 foto akan diambil' : `${layout.shots} foto berurutan — tiap foto bisa diambil ulang`}</div>
              </div>
            )}
          </div>

          <div className="rail">
            <div className="control-card">
              <span className="group-title">🖼️ Jenis foto</span>
              <div className="seg">
                {LAYOUTS.map(l => (
                  <button key={l.id} className={l.id === layoutId ? 'active' : ''} disabled={isCapturing} onClick={() => setLayoutId(l.id)}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-card">
              <span className="group-title">🎥 Kamera</span>
              <div className="seg">
                <button className={camMode === 'front' ? 'active' : ''} disabled={isCapturing || switchingCam} onClick={() => selectCamera('front')}>Depan</button>
                <button className={camMode === 'back' ? 'active' : ''} disabled={isCapturing || switchingCam} onClick={() => selectCamera('back')}>Belakang</button>
                {camGroups.wide && (
                  <button className={camMode === 'wide' ? 'active' : ''} disabled={isCapturing || switchingCam} onClick={() => selectCamera('wide')}>Wide</button>
                )}
              </div>

              <div className="zoom-row">
                <button className="zoom-btn" disabled={isCapturing || zoom <= zoomMin} onClick={() => setZoomValue(zoom - (zoomCaps ? zoomStep : 0.2))}>−</button>
                <input
                  type="range" min={zoomMin} max={zoomMax} step={zoomStep}
                  value={zoom} disabled={isCapturing}
                  onChange={e => setZoomValue(Number(e.target.value))}
                />
                <button className="zoom-btn" disabled={isCapturing || zoom >= zoomMax} onClick={() => setZoomValue(zoom + (zoomCaps ? zoomStep : 0.2))}>+</button>
                <span className="zoom-value">{zoom.toFixed(1)}x</span>
              </div>
            </div>

            <div className="control-card">
              <span className="group-title">🎨 Filter</span>
              <div className="swatch-row">
                {FILTERS.map(f => (
                  <button key={f.id} className={'swatch' + (f.id === activePreset ? ' active' : '')} onClick={() => applyPreset(f)}>
                    <span className="thumb" style={{ filter: buildFilterCss(f.values) }}></span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>

              <button className="filter-toggle-btn" onClick={() => setSlidersOpen(v => !v)}>
                {slidersOpen ? '▲ Sembunyikan atur manual' : '▾ Atur manual (kecerahan, kontras, dll)'}
              </button>

              {slidersOpen && (
                <div className="filter-sliders">
                  {SLIDERS.map(s => (
                    <div className="slider-row" key={s.key}>
                      <div className="slider-label">
                        <span>{s.label}</span>
                        <span className="slider-value">{filterValues[s.key]}{s.unit}</span>
                      </div>
                      <input type="range" min={s.min} max={s.max} value={filterValues[s.key]} onChange={e => adjustSlider(s.key, Number(e.target.value))} />
                    </div>
                  ))}

                  <div className="slider-row beauty-row">
                    <div className="slider-label">
                      <span>{BEAUTY_SLIDER.label}</span>
                      <span className="slider-value">{filterValues.smooth}{BEAUTY_SLIDER.unit}</span>
                    </div>
                    <input type="range" min={BEAUTY_SLIDER.min} max={BEAUTY_SLIDER.max} value={filterValues.smooth} onChange={e => adjustSlider('smooth', Number(e.target.value))} />
                    <div className="slider-note">Efek halus profesional (soft-light blend) — tidak menurunkan ketajaman foto seperti blur biasa.</div>
                  </div>

                  <button className="reset-link" onClick={resetFilters}>Reset filter ke Asli</button>
                </div>
              )}
            </div>

            <div className="control-card">
              <span className="group-title">⏱️ Hitung mundur</span>
              <div className="seg">
                {TIMER_OPTIONS.map(t => (
                  <button key={t.value} className={t.value === timerSec ? 'active' : ''} disabled={isCapturing} onClick={() => setTimerSec(t.value)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="stage" key="review">
          <div className="review-canvas-wrap">
            <div className="sticker-canvas-shell">
              <canvas ref={outputCanvasRef} className="review-canvas"></canvas>
              <div className="sticker-overlay" ref={overlayRef} onPointerDown={() => setActiveStickerId(null)}>
                {placedStickers.map(s => (
                  <div
                    key={s.uid}
                    className={'placed-sticker' + (activeStickerId === s.uid ? ' active' : '')}
                    style={{ left: `${s.xf * 100}%`, top: `${s.yf * 100}%`, fontSize: `${previewWidth ? (s.size / 100) * previewWidth : s.size * 2}px` }}
                    onPointerDown={e => { e.stopPropagation(); handleStickerPointerDown(e, s.uid) }}
                    onPointerMove={e => handleStickerPointerMove(e, s.uid)}
                    onPointerUp={e => handleStickerPointerUp(e, s.uid)}
                    onPointerCancel={e => handleStickerPointerUp(e, s.uid)}
                  >
                    {s.kind === 'image'
                      ? <img src={s.content} alt="stiker" draggable={false} />
                      : s.content}
                    {activeStickerId === s.uid && (
                      <div className="sticker-controls" onPointerDown={e => e.stopPropagation()}>
                        <button onClick={() => resizeSticker(s.uid, -2)} aria-label="Perkecil">−</button>
                        <button onClick={() => resizeSticker(s.uid, 2)} aria-label="Perbesar">+</button>
                        <button onClick={() => removeSticker(s.uid)} aria-label="Hapus">🗑</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rail">
            <div className="control-card">
              <span className="group-title">🧩 Pilih bingkai</span>
              <div className="frame-row">
                {FRAMES.map(fr => (
                  <button key={fr.id} className={'frame-chip' + (fr.id === reviewFrame ? ' active' : '')} onClick={() => setReviewFrame(fr.id)}>
                    <span className="frame-swatch" style={{ background: fr.swatchBg, border: fr.id === 'none' ? '1px dashed rgba(255,255,255,.25)' : 'none' }}></span>
                    <span>{fr.label}</span>
                  </button>
                ))}
              </div>

              <div className="frame-scale-row">
                <span className="frame-scale-label">📐 Ukuran</span>
                <input type="range" min={0.6} max={1.8} step={0.1} value={reviewFrameScale} onChange={e => setReviewFrameScale(Number(e.target.value))} />
                <span className="frame-scale-value">{Math.round(reviewFrameScale * 100)}%</span>
              </div>
            </div>

            <div className="control-card">
              <span className="group-title">✨ Stiker</span>
              <div className="sticker-row">
                {stickerLibrary.map(s => (
                  <button key={s.id} className="sticker-chip" onClick={() => placeSticker(s)} title="Tambah ke foto">
                    {s.kind === 'image' ? <img src={s.content} alt="" /> : s.content}
                  </button>
                ))}
                <label className="sticker-chip sticker-upload" title="Unggah gambar stiker">
                  <input type="file" accept="image/*" onChange={handleStickerImageUpload} hidden />
                  🖼️+
                </label>
              </div>

              <div className="sticker-custom-row">
                <input
                  type="text" maxLength={6} placeholder="Emoji / teks custom"
                  value={customStickerText} onChange={e => setCustomStickerText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addCustomEmojiSticker() }}
                />
                <button className="ghost-btn small" onClick={addCustomEmojiSticker}>Tambah</button>
              </div>

              {placedStickers.length > 0 && (
                <>
                  <div className="preview-note">Geser stiker langsung di foto untuk memindahkannya. Ketuk stiker untuk memperbesar, memperkecil, atau menghapus.</div>
                  <button className="reset-link" onClick={() => setPlacedStickers([])}>Hapus semua stiker</button>
                </>
              )}
            </div>

            <div className="output-note">{outputNote}</div>
            <button className="shutter-btn" onClick={handleDownload}>Unduh foto (HD)</button>
            <button className="ghost-btn" onClick={handleRetake}>Jepret ulang</button>
          </div>
        </div>
      )}
    </div>
  )
}
