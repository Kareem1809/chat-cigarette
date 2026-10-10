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
<linearGradient id="cork" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde2b6"/><stop offset=".5" stop-color="#f0bf82"/><stop offset="1" stop-color="#cf9152"/></linearGradient>
<linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f2ede4"/><stop offset="1" stop-color="#c9c0b0"/></linearGradient>
<linearGradient id="rollPaper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efdcb6"/><stop offset=".45" stop-color="#d9bf8f"/><stop offset="1" stop-color="#a4855a"/></linearGradient>
<linearGradient id="herbTint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d7a3a" stop-opacity=".04"/><stop offset=".6" stop-color="#5f6a2c" stop-opacity=".12"/><stop offset="1" stop-color="#4a4a22" stop-opacity=".22"/></linearGradient>
<linearGradient id="crutch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d3b282"/><stop offset=".55" stop-color="#b08b58"/><stop offset="1" stop-color="#7f5d33"/></linearGradient>
<linearGradient id="ash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c2bdb6"/><stop offset="1" stop-color="#5f5953"/></linearGradient>
<linearGradient id="jointAsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d1cbbf"/><stop offset="1" stop-color="#6b6457"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".5" stop-color="#d9b04f"/><stop offset="1" stop-color="#a77d22"/></linearGradient>
<linearGradient id="night" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe6a8"/><stop offset="1" stop-color="#c8b6ff"/></linearGradient>
<linearGradient id="tray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4c86"/><stop offset="1" stop-color="#211a38"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#ffd27a"/><stop offset=".35" stop-color="#ff7a1a" stop-opacity=".85"/><stop offset="1" stop-color="#ff3d00" stop-opacity="0"/></radialGradient>
<radialGradient id="leafGlow"><stop offset="0" stop-color="#ff9a3c" stop-opacity=".45"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
<pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.4" cy="1.5" r=".75" fill="#2a1506" opacity=".6"/><circle cx="4.5" cy="3.9" r=".65" fill="#2a1506" opacity=".55"/><circle cx="2.6" cy="5" r=".45" fill="#3d2410" opacity=".5"/><circle cx="5.3" cy=".9" r=".4" fill="#3d2410" opacity=".45"/></pattern>
<pattern id="herb" width="9" height="7" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="2.5" r="1" fill="#55602a" opacity=".42"/><circle cx="6" cy="5.2" r=".85" fill="#3c4a1d" opacity=".42"/><circle cx="7" cy="1.3" r=".55" fill="#7d8a3e" opacity=".38"/><circle cx="3.6" cy="5.9" r=".5" fill="#5e4a27" opacity=".45"/></pattern>
<pattern id="fiber" width="23" height="5" patternUnits="userSpaceOnUse"><line x1="0" y1="1" x2="14" y2="1.4" stroke="#f3e2bf" stroke-width=".5" opacity=".7"/><line x1="8" y1="3.6" x2="21" y2="3.2" stroke="#a88a5c" stroke-width=".45" opacity=".55"/></pattern>
<linearGradient id="ashHeap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfc9c0"/><stop offset=".6" stop-color="#8e877d"/><stop offset="1" stop-color="#544e47"/></linearGradient>
</defs>`
}

function frame(h: number, night: number): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="${h}" viewBox="0 0 600 ${h}">` +
    `${defs(night)}<rect width="600" height="${h}" rx="16" fill="url(#sky)"/>${stars(night, h)}`
  )
}

// ───────────── تحذير الباكيت ─────────────

// مثلث أحمر مليان فيه علامة تعجب بيضا — واحد بس، لازق بكلمة التحذير (كريم) — جزء من نفس السطر،
// فبيمشي مع الجملة مهما كان طولها. ▲ بخط Arial (عرضه 1em بالماك وويندوز) و«!» فوقه بالنص.
// السطر كله من اليسار لليمين؛ الجملة العربي/العبري بقطعة لحالها من اليمين لليسار جوّاته.
function sign(): string {
  const tri = 13.9
  const bang = 3
  const back = -(tri / 2 + bang / 2)
  const fwd = tri / 2 - bang / 2
  return (
    `<tspan fill="#e0312b" font-family="Arial, 'Apple Symbols', sans-serif" font-size="14" font-weight="400">\u25B2</tspan>` +
    `<tspan dx="${back.toFixed(2)}" dy="-1.3" fill="#ffffff" font-family="Arial, sans-serif" font-size="9" font-weight="900">!</tspan>` +
    `<tspan dx="${fwd.toFixed(2)}" dy="1.3"> </tspan>`
  )
}

// شريط أبيض بإطار أسود متل تحذيرات الباكيت الحقيقية. بالرسمة المتحركة كل التحذيرات
// جوّاته وبيتبدّلوا لحالهم كل 5 ثواني (بلا إعادة تحميل)؛ بالصورة الثابتة بيبيّن الأول بس.
function warningStrip(texts: readonly string[], ln: Lang, animated: boolean): string {
  // الجملة بالنص، ومثلث أحمر واحد لازق بكلمة التحذير (كريم).
  const rtl = ln !== 'en'
  const attrs = `x="300" y="25.6" text-anchor="middle" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11.5" font-weight="800" fill="#0b0b0b"`
  const list = animated ? texts : texts.slice(0, 1)
  const n = list.length
  const each = 5
  const T = n * each
  const e = (0.35 / T).toFixed(4)
  const lines = list
    .map((t, i) => {
      const words = rtl ? `<tspan direction="rtl" unicode-bidi="embed">${esc(t)}</tspan>` : esc(t)
      // إنجليزي: المثلث قبل WARNING (يسار) · عربي/عبري: بعد «تحذير»/«אזהרה» (يمين).
      const body = rtl ? `${words} ${sign()}` : `${sign()}${words}`
      if (n === 1) return `<text ${attrs}>${body}</text>`
      const a = (i / n).toFixed(4)
      const b = ((i + 1) / n).toFixed(4)
      const ae = (i / n + Number(e)).toFixed(4)
      const be = ((i + 1) / n - Number(e)).toFixed(4)
      const anim =
        i === 0
          ? `values="1;1;0;0;1" keyTimes="0;${be};${b};${(1 - Number(e)).toFixed(4)};1"`
          : i === n - 1
            ? `values="0;0;1;1;0" keyTimes="0;${a};${ae};${be};1"`
            : `values="0;0;1;1;0;0" keyTimes="0;${a};${ae};${be};${b};1"`
      return `<text ${attrs} opacity="${i === 0 ? 1 : 0}">${body}<animate attributeName="opacity" dur="${T}s" repeatCount="indefinite" ${anim}/></text>`
    })
    .join('\n')
  return `<rect x="16" y="9" width="568" height="25" rx="2" fill="#f6f3ec" stroke="#0b0b0b" stroke-width="2.5"/>
${lines}`
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
${isJoint ? '' : `<circle cx="${end + 10}" cy="${cy - hh / 3}" r="1" fill="#3d3833"/><circle cx="${end + 14}" cy="${cy + hh / 2.4}" r="1.1" fill="#3d3833"/>`}
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

// فلتر السيجارة: فلين فاتح بنقاط سودا، لمعة فوق، ظل تحت، فتحة الفلتر مبيّنة، وخطّين دهبي.
function cigaretteBody(end: number, cy: number): string {
  const y0 = cy - 12
  return `
<rect x="28" y="${y0}" width="84" height="24" rx="5" fill="url(#cork)"/>
<rect x="28" y="${y0}" width="84" height="24" rx="5" fill="url(#dots)"/>
<rect x="31" y="${y0 + 2.5}" width="78" height="3.2" rx="1.6" fill="#ffffff" opacity=".35"/>
<rect x="28" y="${y0 + 17}" width="84" height="7" rx="3.5" fill="#8a5420" opacity=".16"/>
<ellipse cx="29.6" cy="${cy}" rx="2.6" ry="11.3" fill="#f8ead0" stroke="#d6a466" stroke-width=".8"/>
<rect x="108.6" y="${y0}" width="1.7" height="24" fill="url(#gold)"/>
<rect x="112" y="${y0}" width="4" height="24" fill="url(#gold)"/>
<rect x="116" y="${y0}" width="${Math.max(0, end - 116).toFixed(1)}" height="24" fill="url(#paper)"/>
<line x1="116" y1="${y0 + 5}" x2="${end.toFixed(1)}" y2="${y0 + 5}" stroke="#ffffff" stroke-width=".8" opacity=".9"/>`
}

// جوينت: فلتر كرتون غير مبيّض مكتوب عليه RAW (طلب كريم) + ورق مخروطي بيوسع لعند الجمرة.
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
      folds += `<line x1="${x.toFixed(1)}" y1="${(cy - half + 1).toFixed(1)}" x2="${(x + 7).toFixed(1)}" y2="${(cy + half - 1).toFixed(1)}" stroke="#c4a679" stroke-width=".9" opacity=".8"/>`
    }
  }
  return `
<clipPath id="crutchClip"><rect x="28" y="${cy - hh0}" width="${x0 - 28}" height="${hh0 * 2}" rx="3"/></clipPath>
<rect x="28" y="${cy - hh0}" width="${x0 - 28}" height="${hh0 * 2}" rx="3" fill="url(#crutch)"/>
<g clip-path="url(#crutchClip)">${spiral}</g>
<text x="${(28 + x0) / 2}" y="${cy + 3.6}" text-anchor="middle" font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif" font-size="10" font-weight="900" letter-spacing="1.6" fill="#3a2512" stroke="#e2c79a" stroke-width="1.6" paint-order="stroke">RAW</text>
<path d="${cone}" fill="url(#rollPaper)"/>
<path d="${cone}" fill="url(#herbTint)"/>
<path d="${cone}" fill="url(#fiber)"/>
${folds}
<line x1="${x0}" y1="${cy - hh0 + 2.5}" x2="${end.toFixed(1)}" y2="${(cy - hh + 3).toFixed(1)}" stroke="#f6e8c8" stroke-width=".9" opacity=".9"/>`
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
        `<path d="M 3 -3.2 L 9 -3.8 L 9 3.8 L 3 3.2 Z" fill="#d9bf8f"/><path d="M 3 -3.2 L 9 -3.8 L 9 3.8 L 3 3.2 Z" fill="url(#herbTint)"/>` +
        `<path d="M 9 -3.8 L 12 -2 L 10.5 0 L 12.5 2.4 L 9 3.8 Z" fill="#4a443f"/>`
      : `<rect x="-12" y="-3.6" width="17" height="7.2" rx="1.8" fill="url(#cork)"/>` +
        `<rect x="5" y="-3.6" width="1.6" height="7.2" fill="url(#gold)"/>` +
        `<path d="M 6.6 -3.6 L 10 -3.9 L 12.4 -1.4 L 10.8 .6 L 12.8 2.8 L 9.8 3.8 L 6.6 3.6 Z" fill="#e9e3d8"/>` +
        `<path d="M 10 -3.9 L 12.4 -1.4 L 10.8 .6 L 12.8 2.8 L 9.8 3.8" fill="none" stroke="#4a443f" stroke-width="1.1"/>`
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot}) scale(${scale})">${body}</g>`
}

// كومة الرماد: قبّة مدوّرة بتكبر مع كل سحبة (ash من 0 لـ1)، وعليها حبيبات فاتحة وغامقة.
function ashHeap(cx: number, base: number, maxW: number, maxH: number, ash: number): string {
  if (ash <= 0) return ''
  const w = 3 + (maxW - 3) * Math.sqrt(ash)
  const h = 1.5 + (maxH - 1.5) * ash
  let specks = ''
  const count = Math.round(4 + 14 * ash)
  for (let i = 0; i < count; i++) {
    const t = ((i * 0.618) % 1) * 2 - 1
    const x = cx + t * w * 0.75
    const y = base - (1 - t * t) * h * (0.25 + ((i * 7) % 6) / 10)
    specks += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.5 + ((i * 3) % 4) * 0.14).toFixed(2)}" fill="${i % 3 === 0 ? '#3d3833' : '#e6e1d9'}" opacity=".85"/>`
  }
  return `<path d="M ${(cx - w).toFixed(1)} ${base} C ${(cx - w * 0.55).toFixed(1)} ${(base - h * 1.35).toFixed(1)} ${(cx + w * 0.55).toFixed(1)} ${(base - h * 1.35).toFixed(1)} ${(cx + w).toFixed(1)} ${base} Z" fill="url(#ashHeap)"/>${specks}`
}

// المكتة (المنفضة) بآخر السيجارة: الرماد فيها بيزيد مع كل سحبة، وأعقاب اليوم بتضل فيها.
function ashtray(butts: readonly Style[], ash: number): string {
  const cx = 532
  const cy = 82
  const n = butts.length
  const shown = butts.slice(-5)
  let out = `<g data-butts="${n}" data-ash="${ash.toFixed(2)}">
<ellipse cx="${cx}" cy="${cy + 3}" rx="48" ry="11" fill="#000" opacity=".3" filter="url(#blur)"/>
<ellipse cx="${cx}" cy="${cy}" rx="46" ry="12" fill="url(#tray)" stroke="#8a7cc0" stroke-width="1.2"/>
<ellipse cx="${cx}" cy="${cy - 1.5}" rx="37" ry="7.5" fill="#1a1430"/>
<rect x="${cx - 47}" y="${cy - 3.2}" width="9" height="4" rx="2" fill="#1a1430"/>
<rect x="${cx + 38}" y="${cy - 3.2}" width="9" height="4" rx="2" fill="#1a1430"/>
${ashHeap(cx - 2, cy + 1.5, 24, 10, ash)}`
  shown.forEach((b, i) => {
    out += buttShape(b, cx - 18 + i * 8.5, cy - 2 + (i % 2) * 2, -22 + i * 11, 0.82)
  })
  if (n > 0) {
    out += `<text x="${cx + 40}" y="${cy - 15}" text-anchor="middle" font-family="${FONT}" font-size="10" font-weight="700" fill="#c8b6ff">×${n}</text>`
  }
  return out + '</g>'
}

// ذرّة رماد بتوقع من الجمرة كل كم ثانية — وإذا الجمرة قريبة، بتوقع جوّا المكتة.
function fallingAsh(fromX: number, fromY: number): string {
  const dx = Math.max(0, Math.min(52, 528 - fromX)).toFixed(1)
  const dy = (fromX > 440 ? 78 - fromY : 20).toFixed(1)
  return `<circle cx="${fromX.toFixed(1)}" cy="${fromY.toFixed(1)}" r="1.4" fill="#b9b3aa" opacity="0">
<animate attributeName="opacity" values="0;.9;.9;0" keyTimes="0;.1;.85;1" dur="4.2s" begin="1s" repeatCount="indefinite"/>
<animateTransform attributeName="transform" type="translate" values="0 0; ${(Number(dx) * 0.35).toFixed(1)} ${(Number(dy) * 0.15).toFixed(1)}; ${dx} ${dy}" keyTimes="0;.45;1" dur="4.2s" begin="1s" repeatCount="indefinite"/></circle>`
}

// المنفضة الكبيرة بكرت المشاركة: أعقاب اليوم كلها مفروشة فيها.
function bigTray(butts: readonly Style[]): string {
  const n = butts.length
  const shown = butts.slice(-12)
  const m = shown.length
  const spacing = Math.min(30, 230 / Math.max(1, m))
  let out = `<g data-butts="${n}">
<ellipse cx="300" cy="120" rx="150" ry="17" fill="url(#tray)" stroke="#7d6fb4" stroke-width="1.2"/>
<ellipse cx="300" cy="118" rx="124" ry="10" fill="#1a1430"/>
${ashHeap(300, 122, 70, 15, 1)}`
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
  warnings: readonly string[]
  butts: readonly Style[]
  isUnlit: boolean
  stats: string
  animated: boolean
}

export function scene(s: Scene): string {
  const f = Math.min(1, s.puffs / PUFFS)
  if (f >= 1) return burnedOut(s)
  return frame(142, f) + warningStrip(s.warnings, s.ln, s.animated) + `<g transform="translate(0 30)">${burning(s, f)}</g></svg>`
}

function burning(s: Scene, f: number): string {
  const cy = 54
  // السيجارة أقصر شوي عشان المكتة تقعد بآخرها.
  const px1 = 462
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
      `<g filter="url(#blur)" stroke="${isJoint ? '#e6e2d2' : '#ddd6f3'}" fill="none" stroke-linecap="round">${smoke}</g>` +
      fallingAsh(end + 14, cy + hh - 2)
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
${ashtray(s.butts, f)}`
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
