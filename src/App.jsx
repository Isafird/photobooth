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
  { id: 'none',     label: 'Tanpa bingkai', style: 'none',     swatchBg: '#0e0c0a' },
  { id: 'polaroid', label: 'Polaroid',      style: 'polaroid', swatchBg: '#F0E6D2' },
  { id: 'film',     label: 'Film strip',    style: 'film',     swatchBg: '#111111' },
  { id: 'amber',    label: 'Amber',         style: 'mat', color: '#F2B33D', border: '#fff6e3', swatchBg: '#F2B33D' },
  { id: 'plum',     label: 'Plum',          style: 'mat', color: '#3B2142', border: '#efe0c9', swatchBg: '#3B2142' },
  { id: 'mint',     label: 'Mint',          style: 'mat', color: '#4F7C6B', border: '#f2ede0', swatchBg: '#4F7C6B' },
  { id: 'blush',    label: 'Blush',         style: 'mat', color: '#D98A8A', border: '#fff3ec', swatchBg: '#D98A8A' },
  { id: 'ocean',    label: 'Ocean',         style: 'mat', color: '#2C5B73', border: '#eaf4f7', swatchBg: '#2C5B73' },
  { id: 'scallop',  label: 'Scallop',       style: 'scallop', swatchBg: '#FFFFFF' },
  { id: 'ticket',   label: 'Tiket',         style: 'ticket',  swatchBg: '#EFE6D2' },
  { id: 'neon',     label: 'Neon',          style: 'neon',    swatchBg: '#150E1F' },
  { id: 'washi',    label: 'Scrapbook',     style: 'washi',   swatchBg: '#F3ECDD' },
  { id: 'mono',     label: 'Mono Dot',      style: 'mono',    swatchBg: '#FFFFFF' },
]
const PREVIEW_FRAME = FRAMES.find(f => f.id === 'none')

const LAYOUTS = [
  { id: 'single', label: 'Single',   shots: 1, cols: 1, rows: 1, cellW: 640, cellH: 480 },
  { id: 'strip3', label: 'Strip 3',  shots: 3, cols: 1, rows: 3, cellW: 380, cellH: 285 },
  { id: 'strip4', label: 'Strip 4',  shots: 4, cols: 1, rows: 4, cellW: 380, cellH: 285 },
  { id: 'grid',   label: 'Grid 2x2', shots: 4, cols: 2, rows: 2, cellW: 320, cellH: 240 },
]

const TIMER_OPTIONS = [
  { value: 0,  label: 'Tanpa' },
  { value: 3,  label: '3 dtk' },
  { value: 5,  label: '5 dtk' },
  { value: 10, label: '10 dtk' },
]

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function buildFilterCss(v) {
  return `brightness(${v.brightness}%) contrast(${v.contrast}%) saturate(${v.saturate}%) hue-rotate(${v.hue}deg) sepia(${v.sepia}%) grayscale(${v.grayscale}%)`
}

// professional-style skin smoothing: blends a slightly blurred, slightly
// brightened copy using soft-light so skin looks smoother without the
// whole photo turning blurry — edges/eyes/hair stay sharp underneath
function drawSkinGlow(ctx, cell, x, y, w, h, smoothPct, filterCss) {
  if (smoothPct <= 0) return
  const layer = document.createElement('canvas')
  layer.width = w; layer.height = h
  const lctx = layer.getContext('2d')
  lctx.filter = `${filterCss} blur(${(smoothPct / 100 * 2.4).toFixed(2)}px) brightness(1.03)`
  lctx.drawImage(cell, 0, 0, w, h)
  ctx.save()
  ctx.globalAlpha = Math.min(0.55, smoothPct / 100 * 0.6)
  ctx.globalCompositeOperation = 'soft-light'
  ctx.drawImage(layer, x, y, w, h)
  ctx.restore()
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

function frameGeometry(frame, layout) {
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
    default:         return { pad: { t: 16, r: 16, b: 16, l: 16 }, gap: 10, radius: 12 }
  }
}

// capture one raw (unfiltered) frame at target size, cover-fit cropped.
// mirrored only for the front ("user") camera, matching the selfie preview
function captureRaw(video, w, h, mirror) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')
  ctx.save()
  if (mirror) { ctx.translate(w, 0); ctx.scale(-1, 1) }
  const vw = video.videoWidth, vh = video.videoHeight
  const targetRatio = w / h, srcRatio = vw / vh
  let sx, sy, sw, sh
  if (srcRatio > targetRatio) { sh = vh; sw = vh * targetRatio; sx = (vw - sw) / 2; sy = 0 }
  else { sw = vw; sh = vw / targetRatio; sx = 0; sy = (vh - sh) / 2 }
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h)
  ctx.restore()
  return c
}

function composeOutput(rawCells, layout, filterCss, frame, smoothPct = 0) {
  const geo = frameGeometry(frame, layout)
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

  const cellBorder = frame.style === 'mat'
  const cellBorderColor = frame.border

  if (frame.style === 'none') {
    // transparent
  } else if (frame.style === 'scallop') {
    ctx.save()
    scallopedRectPath(ctx, 14, 14, W - 28, H - 28, 13)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()
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
  } else {
    const bg = frame.style === 'film' ? '#111111' : (frame.style === 'mat' ? frame.color : (frame.style === 'washi' ? '#F3ECDD' : '#F0E6D2'))
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
    ctx.save()
    ctx.filter = filterCss
    ctx.drawImage(cell, x, y, layout.cellW, layout.cellH)
    ctx.restore()
    drawSkinGlow(ctx, cell, x, y, layout.cellW, layout.cellH, smoothPct, filterCss)
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
  }

  return out
}

export default function App() {
  const videoRef = useRef(null)
  const countNumRef = useRef(null)
  const flashRef = useRef(null)
  const outputCanvasRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const streamRef = useRef(null)
  const stateRef = useRef({})

  const [stage, setStage] = useState('shoot') // 'shoot' | 'review'
  const [filterValues, setFilterValues] = useState({ ...DEFAULT_VALUES })
  const [activePreset, setActivePreset] = useState('none')
  const [layoutId, setLayoutId] = useState('single')
  const [timerSec, setTimerSec] = useState(3)
  const [busy, setBusy] = useState(false)
  const [permDenied, setPermDenied] = useState(false)
  const [shotStatus, setShotStatus] = useState('siap')
  const [facingMode, setFacingMode] = useState('user')
  const [switchingCam, setSwitchingCam] = useState(false)

  const [capturedCells, setCapturedCells] = useState(null)
  const [capturedFilterCss, setCapturedFilterCss] = useState('none')
  const [capturedSmooth, setCapturedSmooth] = useState(0)
  const [reviewFrame, setReviewFrame] = useState('polaroid')
  const [outputNote, setOutputNote] = useState('')

  const layout = LAYOUTS.find(l => l.id === layoutId)
  const filterCss = buildFilterCss(filterValues)
  const mirror = facingMode === 'user'

  stateRef.current = { layout, filterCss, smooth: filterValues.smooth, busy, permDenied, stage, mirror }

  async function startCamera(facing) {
    const useFacing = facing || facingMode
    streamRef.current?.getTracks().forEach(t => t.stop())
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: useFacing, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setPermDenied(false)
    } catch (err) {
      setPermDenied(true)
    }
  }

  async function flipCamera() {
    if (switchingCam || busy) return
    setSwitchingCam(true)
    const next = facingMode === 'user' ? 'environment' : 'user'
    await startCamera(next)
    setFacingMode(next)
    setSwitchingCam(false)
  }

  useEffect(() => {
    startCamera('user')
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [])

  useEffect(() => {
    if (videoRef.current) videoRef.current.style.filter = filterCss
  }, [filterCss])

  // live "before you shoot" preview (layout + filter only, no frame yet)
  useEffect(() => {
    const id = setInterval(() => {
      const { layout: l, filterCss: css, smooth: sm, busy: b, permDenied: pd, stage: st, mirror: mr } = stateRef.current
      const video = videoRef.current
      const canvas = previewCanvasRef.current
      if (st !== 'shoot' || !video || !canvas || b || pd || video.readyState < 2) return
      const cell = captureRaw(video, l.cellW, l.cellH, mr)
      const cells = Array.from({ length: l.shots }, () => cell)
      const composed = composeOutput(cells, l, css, PREVIEW_FRAME, sm)
      canvas.width = composed.width
      canvas.height = composed.height
      canvas.getContext('2d').drawImage(composed, 0, 0)
    }, 200)
    return () => clearInterval(id)
  }, [])

  // recompose the review canvas whenever the captured photos or chosen frame change
  useEffect(() => {
    if (stage !== 'review' || !capturedCells) return
    const composed = composeOutput(capturedCells, layout, capturedFilterCss, FRAMES.find(f => f.id === reviewFrame), capturedSmooth)
    const canvas = outputCanvasRef.current
    if (!canvas) return
    canvas.width = composed.width
    canvas.height = composed.height
    canvas.getContext('2d').drawImage(composed, 0, 0)
  }, [stage, capturedCells, capturedFilterCss, capturedSmooth, reviewFrame, layout])

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

  async function handleShutter() {
    if (busy || !streamRef.current) return
    setBusy(true)

    const cells = []
    for (let i = 0; i < layout.shots; i++) {
      setShotStatus(layout.shots > 1 ? `foto ${i + 1} dari ${layout.shots}` : 'bersiap...')
      if (timerSec > 0) await runCountdown(timerSec)
      fireFlash()
      await sleep(90)
      cells.push(captureRaw(videoRef.current, layout.cellW, layout.cellH, mirror))
      await sleep(220)
    }

    setShotStatus('selesai')
    setCapturedCells(cells)
    setCapturedFilterCss(filterCss)
    setCapturedSmooth(filterValues.smooth)
    setOutputNote('Pilih bingkai, lalu unduh.')
    setBusy(false)
    setStage('review')
  }

  function handleRetake() {
    setStage('shoot')
    setCapturedCells(null)
    setShotStatus('siap')
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
          <div className="wordmark">snap<span>booth</span></div>
          <div className="tagline">Studio foto digital di browser kamu — atur filter, jepret, lalu pilih bingkai untuk hasilnya.</div>
        </div>
      </header>

      {stage === 'shoot' ? (
        <div className="stage">
          <div className="booth">
            <div className="screen">
              <video ref={videoRef} autoPlay playsInline muted className={mirror ? 'mirror' : ''} />
              <div className="countdown-num" ref={countNumRef}></div>
              <div className="flash-overlay" ref={flashRef}></div>
              <button className="flip-cam-btn" onClick={flipCamera} disabled={switchingCam || busy} aria-label="Ganti kamera">⟲</button>
              {permDenied && (
                <div className="perm-msg">
                  <div>Butuh izin kamera untuk mulai motret.</div>
                  <button onClick={() => startCamera('user')}>Aktifkan kamera</button>
                </div>
              )}
            </div>
            <div className="booth-label">
              <span><span className="rec-dot"></span>LIVE VIEWFINDER</span>
              <span>{shotStatus}</span>
            </div>
          </div>

          <div className="rail">
            <div>
              <span className="group-title">Jenis foto</span>
              <div className="seg">
                {LAYOUTS.map(l => (
                  <button key={l.id} className={l.id === layoutId ? 'active' : ''} onClick={() => setLayoutId(l.id)}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="preview-block">
              <span className="group-title">Pratinjau sebelum jepret</span>
              <div className="preview-frame">
                <canvas ref={previewCanvasRef} className="preview-canvas"></canvas>
              </div>
              <div className="preview-note">Bingkai dipilih setelah foto diambil — ini pratinjau layout &amp; filter saja.</div>
            </div>

            <div>
              <span className="group-title">Filter</span>
              <div className="swatch-row">
                {FILTERS.map(f => (
                  <button key={f.id} className={'swatch' + (f.id === activePreset ? ' active' : '')} onClick={() => applyPreset(f)}>
                    <span className="thumb" style={{ filter: buildFilterCss(f.values) }}></span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>

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
            </div>

            <div>
              <span className="group-title">Hitung mundur</span>
              <div className="seg">
                {TIMER_OPTIONS.map(t => (
                  <button key={t.value} className={t.value === timerSec ? 'active' : ''} onClick={() => setTimerSec(t.value)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button className="shutter-btn" onClick={handleShutter} disabled={busy || permDenied}>Jepret</button>
            <div className="shutter-hint">{layout.shots === 1 ? '1 foto akan diambil' : `${layout.shots} foto berurutan akan diambil`}</div>
          </div>
        </div>
      ) : (
        <div className="stage">
          <div className="review-canvas-wrap">
            <canvas ref={outputCanvasRef} className="review-canvas"></canvas>
          </div>

          <div className="rail">
            <div>
              <span className="group-title">Pilih bingkai</span>
              <div className="frame-row">
                {FRAMES.map(fr => (
                  <button key={fr.id} className={'frame-chip' + (fr.id === reviewFrame ? ' active' : '')} onClick={() => setReviewFrame(fr.id)}>
                    <span className="frame-swatch" style={{ background: fr.swatchBg, border: fr.id === 'none' ? '1px dashed rgba(255,255,255,.25)' : 'none' }}></span>
                    <span>{fr.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="output-note">{outputNote}</div>
            <button className="shutter-btn" onClick={handleDownload}>Unduh foto</button>
            <button className="ghost-btn" onClick={handleRetake}>Jepret ulang</button>
          </div>
        </div>
      )}
    </div>
  )
}
