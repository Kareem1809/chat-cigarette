// شو هاد؟ الرسمة (SVG) اللي بتطلع بتطبيق الديسكتوب: السيجارة/الجوينت، تحذير الباكيت،
// المنفضة الصغيرة، وكرت المشاركة لما تخلص. ليش لحاله؟ الرسم طويل وما إله دخل بالمنطق.
// كل تغيير بالنص هون بيعيد تحميل الرسمة — فما بنحط فيه إشي بيتغيّر لحاله مع الوقت.
import type { Lang, Style } from '../types'
import { INSTALL, KINDS, PUFFS, REST_LINE } from './words'

const FONT = "ui-sans-serif, -apple-system, 'Helvetica Neue', sans-serif"
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ───────────── الخلفية ─────────────

// النجوم بتبيّن أكتر كل ما الليل ينزل (night من 0 لـ1).
function stars(night: number, h: number): string {
  const peak = (0.35 + 0.65 * night).toFixed(2)
  const pts = [
    [64, 0.12, 0.9, 0],
    [150, 0.27, 0.6, 1.2],
    [236, 0.11, 0.8, 2.1],
    [340, 0.23, 0.5, 0.6],
    [420, 0.09, 0.7, 1.7],
    [470, 0.3, 0.5, 2.6],
    [548, 0.45, 0.6, 0.3],
    [24, 0.86, 0.5, 1.4],
    [580, 0.88, 0.6, 2.2],
  ]
  return pts
    .map(
      ([x, y, r, b]) =>
        `<circle cx="${x}" cy="${((y ?? 0) * h).toFixed(1)}" r="${r}" fill="#fff7d6"><animate attributeName="opacity" values=".1;${peak};.1" dur="3.2s" begin="${b}s" repeatCount="indefinite"/></circle>`,
    )
    .join('')
}

function wisp(x: number, y: number, begin: number, dur: number, width: number, sway: number): string {
  return (
    `<path d="M ${x.toFixed(1)} ${y.toFixed(1)} c ${-8 * sway} -6 ${8 * sway} -12 0 -18 s ${-8 * sway} -12 2 -18 s 6 -10 -2 -14" ` +
    `stroke-width="${width}" opacity="0">` +
    `<animate attributeName="opacity" values="0;.6;0" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>` +
    `<animateTransform attributeName="transform" type="translate" values="0 8; ${3 * sway} -12" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>` +
    `</path>`
  )
}

// ورقة 🍁 بتتمايل وبتنزل شوي ورا ترجع.
function leaf(x: number, y: number, size: number, begin: number, dur: number): string {
  return (
    `<g transform="translate(${x} ${y})"><g>` +
    `<animateTransform attributeName="transform" type="translate" values="0 -4; 3 4; 0 -4" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>` +
    `<text text-anchor="middle" dominant-baseline="central" font-size="${size}">🍁` +
    `<animateTransform attributeName="transform" type="rotate" values="-14;14;-14" dur="${dur / 2}s" begin="${begin}s" repeatCount="indefinite"/>` +
    `</text></g></g>`
  )
}

// لون من a لـ b حسب t (0..1).
function mix(a: string, b: string, t: number): string {
  const ch = (c: string, i: number) => parseInt(c.slice(1 + 2 * i, 3 + 2 * i), 16)
  const out = [0, 1, 2].map(i => Math.round(ch(a, i) + (ch(b, i) - ch(a, i)) * t))
  return '#' + out.map(v => v.toString(16).padStart(2, '0')).join('')
}

// السما بتبلّش غروب (بنفسجي دافي، تحتها خمري) وبتغمق لليل مع كل نَفَس.
// الجوينت: كرتونة كرافت بنّية، ورق رقيق شفاف، وعشبة خضرا باينة من ورا.
function defs(night: number): string {
  return `<defs>
<linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix('#2a1d4e', '#120d26', night)}"/><stop offset="1" stop-color="${mix('#5b2f57', '#241a40', night)}"/></linearGradient>
<linearGradient id="cork" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3b86d"/><stop offset=".5" stop-color="#d0843a"/><stop offset="1" stop-color="#94501d"/></linearGradient>
<linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f2ede4"/><stop offset="1" stop-color="#c9c0b0"/></linearGradient>
<linearGradient id="rollPaper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf8ee"/><stop offset=".45" stop-color="#ebe6d2"/><stop offset="1" stop-color="#b9b394"/></linearGradient>
<linearGradient id="herbTint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9dbb6a" stop-opacity=".05"/><stop offset=".6" stop-color="#6f9446" stop-opacity=".15"/><stop offset="1" stop-color="#4e6e30" stop-opacity=".26"/></linearGradient>
<linearGradient id="crutch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3c79c"/><stop offset=".55" stop-color="#c9a374"/><stop offset="1" stop-color="#9a7448"/></linearGradient>
<linearGradient id="ash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c2bdb6"/><stop offset="1" stop-color="#5f5953"/></linearGradient>
<linearGradient id="jointAsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d1cbbf"/><stop offset="1" stop-color="#6b6457"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".5" stop-color="#d9b04f"/><stop offset="1" stop-color="#a77d22"/></linearGradient>
<linearGradient id="night" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe6a8"/><stop offset="1" stop-color="#c8b6ff"/></linearGradient>
<linearGradient id="tray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4c86"/><stop offset="1" stop-color="#211a38"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#ffd27a"/><stop offset=".35" stop-color="#ff7a1a" stop-opacity=".85"/><stop offset="1" stop-color="#ff3d00" stop-opacity="0"/></radialGradient>
<radialGradient id="leafGlow"><stop offset="0" stop-color="#ff9a3c" stop-opacity=".45"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
<pattern id="dots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".9" fill="#6b3510" opacity=".45"/><circle cx="5.5" cy="5" r=".7" fill="#6b3510" opacity=".35"/></pattern>
<pattern id="herb" width="9" height="7" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="2.5" r="1.1" fill="#4c7a2a" opacity=".5"/><circle cx="6" cy="5.2" r=".9" fill="#2f5419" opacity=".5"/><circle cx="7" cy="1.3" r=".6" fill="#86ad4a" opacity=".45"/><circle cx="3.6" cy="5.9" r=".55" fill="#5e4f27" opacity=".5"/></pattern>
</defs>`
}

function frame(h: number, night: number): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="${h}" viewBox="0 0 600 ${h}">` +
    `${defs(night)}<rect width="600" height="${h}" rx="16" fill="url(#sky)"/>${stars(night, h)}`
  )
}

// ───────────── تحذير الباكيت ─────────────

// شريط أبيض بإطار أسود متل تحذيرات الباكيت الحقيقية.
function warningStrip(text: string, ln: Lang): string {
  const dir = ln === 'en' ? '' : ' direction="rtl"'
  return `<rect x="16" y="9" width="568" height="25" rx="2" fill="#f6f3ec" stroke="#0b0b0b" stroke-width="2.5"/>
<text x="300" y="25.6" text-anchor="middle"${dir} font-family="'Helvetica Neue', Arial, sans-serif" font-size="11.5" font-weight="800" fill="#0b0b0b">${esc(text)}</text>`
}

// ───────────── السيجارة والجوينت ─────────────

// الجمرة والرماد والشرار عند الطرف المولّع.
function tip(end: number, cy: number, hh: number, isJoint: boolean): string {
  const y0 = cy - hh
  const h = hh * 2
  const pulse = '2.2s'
  return `
<circle cx="${end + 4}" cy="${cy}" r="${hh * 2}" fill="url(#glow)" filter="url(#soft)" opacity=".7"><animate attributeName="opacity" values=".45;.95;.45" dur="${pulse}" repeatCount="indefinite"/></circle>
<path d="M ${end + 4} ${y0 + 1} L ${end + 18} ${y0 + 2} L ${end + 21} ${(y0 + h * 0.3).toFixed(1)} L ${end + 19} ${cy} L ${end + 22} ${(y0 + h * 0.75).toFixed(1)} L ${end + 17} ${y0 + h - 1} L ${end + 4} ${y0 + h - 1} Z" fill="url(#${isJoint ? 'jointAsh' : 'ash'})"/>
<circle cx="${end + 10}" cy="${cy - hh / 3}" r="1" fill="#3d3833"/><circle cx="${end + 14}" cy="${cy + hh / 2.4}" r="1.1" fill="#3d3833"/>
<rect x="${end - 2}" y="${y0}" width="7" height="${h}" fill="#ff5a14"><animate attributeName="fill" values="#ff5a14;#ffb347;#ff5a14" dur="${pulse}" repeatCount="indefinite"/></rect>
<circle cx="${end + 6}" cy="${cy - hh / 2}" r="1.2" fill="#ffcf6b"><animate attributeName="opacity" values="0;1;0" dur="${pulse}" repeatCount="indefinite"/></circle>
<circle cx="${end + 6}" cy="${cy + hh / 1.7}" r="1" fill="#ffcf6b"><animate attributeName="opacity" values="1;0;1" dur="${pulse}" repeatCount="indefinite"/></circle>`
}

// طرف ما ولّع (4 الصبح): تبغ/عشبة باينة، بلا جمرة ولا دخان.
function unlitTip(end: number, cy: number, hh: number, isJoint: boolean): string {
  const fill = isJoint ? '#5f7d3a' : '#8a5a2b'
  return `<rect x="${end - 1}" y="${cy - hh}" width="4" height="${hh * 2}" fill="${fill}"/>
<circle cx="${end + 1}" cy="${cy - hh / 3}" r=".9" fill="#3a2a14"/><circle cx="${end + 1.5}" cy="${cy + hh / 3}" r=".8" fill="#3a2a14"/>`
}

function cigaretteBody(end: number, cy: number): string {
  const y0 = cy - 12
  return `
<rect x="28" y="${y0}" width="84" height="24" rx="5" fill="url(#cork)"/>
<rect x="28" y="${y0}" width="84" height="24" rx="5" fill="url(#dots)"/>
<rect x="112" y="${y0}" width="4" height="24" fill="url(#gold)"/>
<rect x="116" y="${y0}" width="${Math.max(0, end - 116).toFixed(1)}" height="24" fill="url(#paper)"/>
<line x1="116" y1="${y0 + 5}" x2="${end.toFixed(1)}" y2="${y0 + 5}" stroke="#ffffff" stroke-width=".8" opacity=".9"/>`
}

// جوينت: كرتونة كرافت ملفوفة + ورق مخروطي بيوسع لعند الجمرة، والعشبة باينة من ورا.
function jointBody(x0: number, end: number, cy: number, hh0: number, hh: number): string {
  const cone = `M ${x0} ${cy - hh0} L ${end.toFixed(1)} ${(cy - hh).toFixed(1)} L ${end.toFixed(1)} ${(cy + hh).toFixed(1)} L ${x0} ${cy + hh0} Z`
  let spiral = ''
  for (let x = 22; x < x0; x += 6) {
    spiral += `<line x1="${x}" y1="${cy - hh0}" x2="${x + 6}" y2="${cy + hh0}" stroke="#7a5631" stroke-width="1" opacity=".55"/>`
  }
  let folds = ''
  for (const k of [0.22, 0.48, 0.74]) {
    const x = x0 + (end - x0) * k
    if (end - x0 > 40) {
      const half = hh0 + (hh - hh0) * k
      folds += `<line x1="${x.toFixed(1)}" y1="${(cy - half + 1).toFixed(1)}" x2="${(x + 7).toFixed(1)}" y2="${(cy + half - 1).toFixed(1)}" stroke="#cfc8ad" stroke-width=".9" opacity=".8"/>`
    }
  }
  return `
<clipPath id="crutchClip"><rect x="28" y="${cy - hh0}" width="${x0 - 28}" height="${hh0 * 2}" rx="3"/></clipPath>
<rect x="28" y="${cy - hh0}" width="${x0 - 28}" height="${hh0 * 2}" rx="3" fill="url(#crutch)"/>
<g clip-path="url(#crutchClip)">${spiral}</g>
<path d="${cone}" fill="url(#rollPaper)"/>
<path d="${cone}" fill="url(#herbTint)"/>
<path d="${cone}" fill="url(#herb)"/>
${folds}
<line x1="${x0}" y1="${cy - hh0 + 2.5}" x2="${end.toFixed(1)}" y2="${(cy - hh + 3).toFixed(1)}" stroke="#ffffff" stroke-width=".9" opacity=".85"/>`
}

// العنوان والعدّاد: إنجليزي (العنوان يسار) أو عربي/عبري (العنوان يمين، متل الكتابة).
function header(kind: Style, puffs: number, ln: Lang): string {
  if (ln !== 'en') {
    return `<text x="572" y="23" text-anchor="end" font-family="${FONT}" font-size="12" font-weight="700" fill="#a99ccf">${KINDS[kind].title[ln]}</text>
<text x="28" y="23" font-family="${FONT}" font-size="11" font-weight="600" letter-spacing="1.6" fill="#a99ccf">${puffs} / ${PUFFS}</text>`
  }
  return `<text x="28" y="22" font-family="${FONT}" font-size="10" font-weight="600" letter-spacing="2.6" fill="#a99ccf">${KINDS[kind].title[ln]}</text>
<text x="572" y="22" text-anchor="end" font-family="${FONT}" font-size="10" font-weight="600" letter-spacing="1.6" fill="#a99ccf">${puffs} / ${PUFFS} PUFFS</text>`
}

// ───────────── المنفضة ─────────────

// عقب صغير: سيجارة (فلتر + طرف رمادي) أو جوينت (كرتونة كرافت + ورق محروق).
function buttShape(kind: Style, x: number, y: number, rot: number, scale: number): string {
  const body =
    kind === 'joint'
      ? `<rect x="-11" y="-3.2" width="14" height="6.4" rx="1.6" fill="url(#crutch)"/>` +
        `<line x1="-7" y1="-3.2" x2="-4" y2="3.2" stroke="#7a5631" opacity=".6"/>` +
        `<path d="M 3 -3.2 L 9 -3.8 L 9 3.8 L 3 3.2 Z" fill="#ebe6d2"/><path d="M 3 -3.2 L 9 -3.8 L 9 3.8 L 3 3.2 Z" fill="url(#herbTint)"/>` +
        `<path d="M 9 -3.8 L 12 -2 L 10.5 0 L 12.5 2.4 L 9 3.8 Z" fill="#4a443f"/>`
      : `<rect x="-12" y="-3.6" width="17" height="7.2" rx="1.8" fill="url(#cork)"/>` +
        `<rect x="5" y="-3.6" width="1.6" height="7.2" fill="url(#gold)"/>` +
        `<path d="M 6.6 -3.6 L 10 -3.9 L 12.4 -1.4 L 10.8 .6 L 12.8 2.8 L 9.8 3.8 L 6.6 3.6 Z" fill="#e9e3d8"/>` +
        `<path d="M 10 -3.9 L 12.4 -1.4 L 10.8 .6 L 12.8 2.8 L 9.8 3.8" fill="none" stroke="#4a443f" stroke-width="1.1"/>`
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot}) scale(${scale})">${body}</g>`
}

// المنفضة الصغيرة جنب السيجارة: كل عقب خلص اليوم بيضل فيها.
function miniTray(butts: readonly Style[]): string {
  const cx = 566
  const cy = 100
  const n = butts.length
  const shown = butts.slice(-5)
  let out = `<g data-butts="${n}" opacity="${n > 0 ? 1 : 0.5}">
<ellipse cx="${cx}" cy="${cy}" rx="25" ry="7" fill="url(#tray)" stroke="#7d6fb4" stroke-width="1"/>
<ellipse cx="${cx}" cy="${cy - 1}" rx="19" ry="3.6" fill="#1a1430"/>`
  shown.forEach((b, i) => {
    out += buttShape(b, cx - 13 + i * 6.5, cy - 3 + (i % 2) * 1.5, -24 + i * 12, 0.7)
  })
  if (n > 0) {
    out += `<text x="${cx}" y="${cy - 11}" text-anchor="middle" font-family="${FONT}" font-size="9.5" font-weight="700" fill="#c8b6ff">×${n}</text>`
  }
  return out + '</g>'
}

// المنفضة الكبيرة بكرت المشاركة: أعقاب اليوم كلها مفروشة فيها.
function bigTray(butts: readonly Style[]): string {
  const n = butts.length
  const shown = butts.slice(-12)
  const m = shown.length
  const spacing = Math.min(30, 230 / Math.max(1, m))
  let out = `<g data-butts="${n}">
<ellipse cx="300" cy="120" rx="150" ry="17" fill="url(#tray)" stroke="#7d6fb4" stroke-width="1.2"/>
<ellipse cx="300" cy="118" rx="124" ry="10" fill="#1a1430"/>`
  shown.forEach((b, i) => {
    const x = 300 + (i - (m - 1) / 2) * spacing
    const y = 114 + (i % 2 ? 5 : 0)
    const rot = (i % 2 ? 14 : -12) + (((i * 37) % 9) - 4)
    out += buttShape(b, x, y, rot, 1.35)
  })
  if (n > m) {
    out += `<text x="462" y="124" font-family="${FONT}" font-size="12" font-weight="700" fill="#c8b6ff">+${n - m}</text>`
  }
  return out + '</g>'
}

// ───────────── المشاهد ─────────────

export type Scene = {
  kind: Style
  ln: Lang
  puffs: number
  warning: string
  butts: readonly Style[]
  isUnlit: boolean
  stats: string
}

export function scene(s: Scene): string {
  const f = Math.min(1, s.puffs / PUFFS)
  if (f >= 1) return burnedOut(s)
  return frame(142, f) + warningStrip(s.warning, s.ln) + `<g transform="translate(0 30)">${burning(s, f)}</g></svg>`
}

function burning(s: Scene, f: number): string {
  const cy = 54
  const px1 = 520
  const isJoint = s.kind === 'joint'

  let end: number
  let hh: number
  let stick: string
  if (isJoint) {
    const x0 = 94
    end = x0 + (px1 - x0) * (1 - f)
    hh = 7 + 7 * ((end - x0) / (px1 - x0))
    stick = jointBody(x0, end, cy, 7, hh)
  } else {
    end = 116 + (px1 - 116) * (1 - f)
    hh = 12
    stick = cigaretteBody(end, cy)
  }

  // الجوينت دخانه أتقل شوي وأخضر خفيف.
  let lit = unlitTip(end, cy, hh, isJoint)
  if (!s.isUnlit) {
    const dur = 3.4
    const sx = end + 16
    const top = cy - hh
    let smoke =
      wisp(sx, top - 2, 0, dur, 3, 1) +
      wisp(sx + 4, top - 4, dur / 3, dur, 2.4, -1) +
      wisp(sx - 3, top - 1, (2 * dur) / 3, dur, 2, 1)
    if (isJoint) smoke += wisp(sx + 8, top - 3, dur / 2, dur * 1.2, 3.6, -1)
    lit =
      tip(end, cy, hh, isJoint) +
      `<g filter="url(#blur)" stroke="${isJoint ? '#dfe8d4' : '#ddd6f3'}" fill="none" stroke-linecap="round">${smoke}</g>`
  }

  // صف النَّفَسات: المحروق برتقالي، الجاي فاضي، وآخر واحد بينبض.
  const step = (px1 - 28) / (PUFFS - 1)
  let dots = ''
  for (let i = 0; i < PUFFS; i++) {
    const x = (28 + i * step).toFixed(1)
    if (i < s.puffs) {
      const isLast = i === s.puffs - 1
      dots += `<circle cx="${x}" cy="94" r="3.2" fill="#ff8a3d">${isLast ? '<animate attributeName="r" values="3.2;4.4;3.2" dur="1.6s" repeatCount="indefinite"/>' : ''}</circle>`
    } else {
      dots += `<circle cx="${x}" cy="94" r="3" fill="none" stroke="#5d4f86" stroke-width="1.2"/>`
    }
  }

  return `
${header(s.kind, s.puffs, s.ln)}
<ellipse cx="${(28 + end) / 2}" cy="${cy + hh + 5}" rx="${(end - 28) / 2}" ry="4" fill="#000" opacity=".35" filter="url(#blur)"/>
${stick}
${lit}
${dots}
${miniTray(s.butts)}`
}

// كرت المشاركة: «روح ارتاح»، أرقام اليوم، المنفضة بكل أعقاب اليوم، وسطر التركيب.
function burnedOut(s: Scene): string {
  const h = 184
  const dir = s.ln === 'en' ? '' : ' direction="rtl"'
  return (
    frame(h, 1) +
    `
<circle cx="548" cy="40" r="32" fill="url(#leafGlow)"/>
${leaf(548, 40, 30, 0, 5)}
${leaf(66, 34, 16, 1.6, 6.5)}
${leaf(520, 132, 13, 3.1, 7)}
<text x="508" y="30" font-family="${FONT}" font-size="11" font-weight="700" fill="#c8b6ff">z<animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 6; -4 -6" dur="2.4s" repeatCount="indefinite"/></text>
<text x="494" y="22" font-family="${FONT}" font-size="8" font-weight="700" fill="#c8b6ff">z<animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="1.2s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 6; -4 -6" dur="2.4s" begin="1.2s" repeatCount="indefinite"/></text>
<text x="300" y="46" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="25" fill="url(#night)">${esc(REST_LINE.replace(/\s*🍁$/, ''))}</text>
<text x="300" y="74" text-anchor="middle"${dir} font-family="${FONT}" font-size="11" font-weight="700" letter-spacing="${s.ln === 'en' ? 1.6 : 0}" fill="#c8b6ff">${esc(s.stats)}</text>
${bigTray(s.butts)}
<g filter="url(#blur)" stroke="#ddd6f3" fill="none" stroke-linecap="round">${wisp(318, 104, 0, 5, 1.6, 1)}</g>
<rect x="64" y="150" width="472" height="22" rx="11" fill="#ffffff" fill-opacity=".06" stroke="#ffffff" stroke-opacity=".16"/>
<text x="300" y="165" text-anchor="middle" font-family="${MONO}" font-size="10.5" fill="#bdb2e0">${esc(INSTALL)}</text>
</svg>`
  )
}
