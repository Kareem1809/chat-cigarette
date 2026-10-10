// شو هاد؟ «سيجارة المحادثة»: أول كل شات بتنولّع سيجارة (أو جوينت — /smoke بيبدّل)
// فوق خانة الكتابة، وكل رسالة منك لكلود = نَفَس. لما تخلص، كلود بيقلك:
// It's time to get some rest. ليش؟ تذكير لطيف يخفف قعدة الحاسوب.
import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Limit, Smoke, Style } from '../types'

// كم نَفَس بالسيجارة = كم رسالة منك قبل ما تخلص. غيّر الرقم إذا بدك.
const PUFFS = 20

const REST_LINE = "It's time to get some rest 🍁"

const smoke = atom({ plugin: 'chat-cigarette', key: 'smoke' } as const, {
  puffs: 0,
  isRested: false,
} as Smoke)
const limit = atom({ plugin: 'chat-cigarette', key: 'limit' } as const, null as Limit)
const style = atom({ plugin: 'chat-cigarette', key: 'style' } as const, 'cigarette' as Style)

// بس رسائل الإنسان بتنحسب نَفَس — مش إشعارات المهام ولا رسائل البلجنات.
const HUMAN = new Set(['composer', 'bridge', 'sdk'])

// الجمل بالترتيب: ولّعت · <25% · <50% · <75% · آخر النَّفَسات · خلصت.
const KINDS: Record<Style, { title: string; noun: string; lines: readonly string[] }> = {
  cigarette: {
    title: 'CHAT CIGARETTE',
    noun: 'cigarette',
    lines: [
      '🔥 ولّعنا سيجارة المحادثة — كل رسالة منك نَفَس',
      '☕ لسا بأولها… استمتع بالحكي',
      '🌬️ ربعها راح — خذ نفس هوا حقيقي كمان',
      '⏳ نصّها راح — قرّب وقت الاستراحة',
      '🕯️ آخر كم نَفَس — جهّز حالك ترتاح',
      '🍁 خلصت السيجارة… سكّر الشاشة وروح ارتاح',
    ],
  },
  joint: {
    title: 'CHAT JOINT',
    noun: 'joint',
    lines: [
      '🔥 ولّعنا الجوينت — كل رسالة منك نَفَس',
      '😌 لسا بأوله… روق واستمتع بالحكي',
      '🌬️ ربعه راح — خذ نفس هوا حقيقي كمان',
      '⏳ نصّه راح — قرّب وقت الاستراحة',
      '🕯️ آخر كم نَفَس — جهّز حالك ترتاح',
      '🍁 خلص الجوينت… سكّر الشاشة وروح ارتاح',
    ],
  },
}

function tagline(kind: Style, puffs: number): string {
  const f = puffs / PUFFS
  const i = f >= 1 ? 5 : puffs === 0 ? 0 : f < 0.25 ? 1 : f < 0.5 ? 2 : f < 0.75 ? 3 : 4
  return KINDS[kind].lines[i] ?? ''
}

// آخر نَفَس: كلود نفسه بيقلك تروح ترتاح.
function lastPuff(kind: Style): string {
  return (
    `[chat-cigarette] This message was the user's last puff: the 'chat ${KINDS[kind].noun}' ` +
    'that burns down with every message they send has just burned out. It is a ' +
    'wellbeing mod they installed on purpose to cut down their screen time. Answer ' +
    'their message normally, then close your reply with one short warm line (in ' +
    `their language) telling them to step away and rest, ending with exactly: "${REST_LINE}"`
  )
}

// لون شريط حدّ الـ5 ساعات: أخضر ← برتقالي ← أحمر.
function limitColor(pct: number): string {
  return pct < 50 ? '#5fd3a5' : pct < 80 ? '#ffb347' : '#ff5a5f'
}

// النص بيطلع بس لما تمرّق الماوس فوق الشريط (tooltip) — الشريط نفسه بلا كتابة.
function limitHint(lim: Exclude<Limit, null>, now: number): string {
  let hint = `5-hour limit: ${Math.round(lim.percent)}%`
  const at = lim.resetsAt ? Date.parse(lim.resetsAt) : NaN
  if (Number.isFinite(at) && at > now) {
    const mins = Math.round((at - now) / 60000)
    hint += ` · resets in ${Math.floor(mins / 60)}h ${mins % 60}m`
  }
  return hint
}

// ───────────── الرسمة (ديسكتوب): SVG بدخان متحرك ─────────────

const FONT = "ui-sans-serif, -apple-system, 'Helvetica Neue', sans-serif"

function stars(): string {
  const pts = [
    [64, 14, 0.9, 0],
    [150, 30, 0.6, 1.2],
    [236, 12, 0.8, 2.1],
    [340, 26, 0.5, 0.6],
    [420, 10, 0.7, 1.7],
    [470, 34, 0.5, 2.6],
    [548, 50, 0.6, 0.3],
    [24, 96, 0.5, 1.4],
    [580, 98, 0.6, 2.2],
  ]
  return pts
    .map(
      ([x, y, r, b]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff7d6"><animate attributeName="opacity" values=".15;1;.15" dur="3.2s" begin="${b}s" repeatCount="indefinite"/></circle>`,
    )
    .join('')
}

function wisp(x: number, y: number, begin: number, dur: number, width: number, sway: number): string {
  return (
    `<path d="M ${x} ${y} c ${-8 * sway} -6 ${8 * sway} -12 0 -18 s ${-8 * sway} -12 2 -18 s 6 -10 -2 -14" ` +
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

function defs(): string {
  return `<defs>
<linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#17112e"/><stop offset="1" stop-color="#2d1f4a"/></linearGradient>
<linearGradient id="cork" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3b86d"/><stop offset=".5" stop-color="#d0843a"/><stop offset="1" stop-color="#94501d"/></linearGradient>
<linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f2ede4"/><stop offset="1" stop-color="#c9c0b0"/></linearGradient>
<linearGradient id="rollPaper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffef9"/><stop offset=".5" stop-color="#f3eee2"/><stop offset="1" stop-color="#cfc6b3"/></linearGradient>
<linearGradient id="crutch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf6e8"/><stop offset="1" stop-color="#d9cba6"/></linearGradient>
<linearGradient id="ash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c2bdb6"/><stop offset="1" stop-color="#5f5953"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".5" stop-color="#d9b04f"/><stop offset="1" stop-color="#a77d22"/></linearGradient>
<linearGradient id="night" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe6a8"/><stop offset="1" stop-color="#c8b6ff"/></linearGradient>
<linearGradient id="tray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4c86"/><stop offset="1" stop-color="#211a38"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#ffd27a"/><stop offset=".35" stop-color="#ff7a1a" stop-opacity=".85"/><stop offset="1" stop-color="#ff3d00" stop-opacity="0"/></radialGradient>
<radialGradient id="leafGlow"><stop offset="0" stop-color="#ff9a3c" stop-opacity=".45"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
<pattern id="dots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".9" fill="#6b3510" opacity=".45"/><circle cx="5.5" cy="5" r=".7" fill="#6b3510" opacity=".35"/></pattern>
<pattern id="herb" width="9" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1" fill="#6f9a3a" opacity=".38"/><circle cx="6.5" cy="6" r=".8" fill="#4f7a2a" opacity=".32"/><circle cx="7" cy="1.5" r=".6" fill="#8bb04a" opacity=".32"/></pattern>
</defs>`
}

function scene(kind: Style, puffs: number, isWorking: boolean, lim: Limit, now: number): string {
  const f = Math.min(1, puffs / PUFFS)
  const h = lim === null ? 112 : 124
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="${h}" viewBox="0 0 600 ${h}">` +
    `${defs()}<rect width="600" height="${h}" rx="16" fill="url(#sky)"/>${stars()}` +
    (f >= 1 ? burnedOut(kind) : burning(kind, puffs, f, isWorking)) +
    (lim === null ? '' : limitBar(lim, now, 111)) +
    '</svg>'
  )
}

// حدّ الـ5 ساعات: ساعة رمل صغيرة + شريط ملوّن، بلا كتابة.
function limitBar(lim: Exclude<Limit, null>, now: number, y: number): string {
  const pct = Math.max(0, Math.min(100, lim.percent))
  const x0 = 46
  const x1 = 572
  const w = (((x1 - x0) * pct) / 100).toFixed(1)
  const color = limitColor(pct)
  return `<g><title>${limitHint(lim, now)}</title>
<path d="M 29 ${y - 6} h 10 M 29 ${y + 6} h 10 M 30 ${y - 6} c 0 4 4 4.5 4 6 c 0 1.5 -4 2 -4 6 M 38 ${y - 6} c 0 4 -4 4.5 -4 6 c 0 1.5 4 2 4 6" stroke="#a99ccf" stroke-width="1.3" fill="none" stroke-linecap="round"/>
<path d="M 31.5 ${y + 5} h 5 l -2.5 -3 z" fill="${color}"/>
<rect x="${x0}" y="${y - 2}" width="${x1 - x0}" height="4" rx="2" fill="#3a2f5c"/>
<rect x="${x0}" y="${y - 2}" width="${w}" height="4" rx="2" fill="${color}" opacity=".6" filter="url(#blur)"/>
<rect x="${x0}" y="${y - 2}" width="${w}" height="4" rx="2" fill="${color}"/>
</g>`
}

// الجمرة والرماد والشرار عند الطرف المولّع — نفسها للسيجارة والجوينت.
function tip(end: number, cy: number, hh: number, pulse: string): string {
  const y0 = cy - hh
  const h = hh * 2
  return `
<circle cx="${end + 4}" cy="${cy}" r="${hh * 2}" fill="url(#glow)" filter="url(#soft)" opacity=".7"><animate attributeName="opacity" values=".45;.95;.45" dur="${pulse}" repeatCount="indefinite"/></circle>
<path d="M ${end + 4} ${y0 + 1} L ${end + 18} ${y0 + 2} L ${end + 21} ${(y0 + h * 0.3).toFixed(1)} L ${end + 19} ${cy} L ${end + 22} ${(y0 + h * 0.75).toFixed(1)} L ${end + 17} ${y0 + h - 1} L ${end + 4} ${y0 + h - 1} Z" fill="url(#ash)"/>
<circle cx="${end + 10}" cy="${cy - hh / 3}" r="1" fill="#3d3833"/><circle cx="${end + 14}" cy="${cy + hh / 2.4}" r="1.1" fill="#3d3833"/>
<rect x="${end - 2}" y="${y0}" width="7" height="${h}" fill="#ff5a14"><animate attributeName="fill" values="#ff5a14;#ffb347;#ff5a14" dur="${pulse}" repeatCount="indefinite"/></rect>
<circle cx="${end + 6}" cy="${cy - hh / 2}" r="1.2" fill="#ffcf6b"><animate attributeName="opacity" values="0;1;0" dur="${pulse}" repeatCount="indefinite"/></circle>
<circle cx="${end + 6}" cy="${cy + hh / 1.7}" r="1" fill="#ffcf6b"><animate attributeName="opacity" values="1;0;1" dur="${pulse}" repeatCount="indefinite"/></circle>`
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

// جوينت: كرتونة ملفوفة (crutch) + ورق رقيق مخروطي بيوسع لعند الجمرة، والعشبة باينة من ورا.
function jointBody(x0: number, end: number, cy: number, hh0: number, hh: number): string {
  const cone = `M ${x0} ${cy - hh0} L ${end.toFixed(1)} ${(cy - hh).toFixed(1)} L ${end.toFixed(1)} ${(cy + hh).toFixed(1)} L ${x0} ${cy + hh0} Z`
  let spiral = ''
  for (let x = 22; x < x0; x += 6) {
    spiral += `<line x1="${x}" y1="${cy - hh0}" x2="${x + 6}" y2="${cy + hh0}" stroke="#b49c68" stroke-width="1" opacity=".55"/>`
  }
  let folds = ''
  for (const k of [0.22, 0.48, 0.74]) {
    const x = x0 + (end - x0) * k
    if (end - x0 > 40) {
      const half = hh0 + (hh - hh0) * k
      folds += `<line x1="${x.toFixed(1)}" y1="${(cy - half + 1).toFixed(1)}" x2="${(x + 7).toFixed(1)}" y2="${(cy + half - 1).toFixed(1)}" stroke="#d6cdb8" stroke-width=".9" opacity=".8"/>`
    }
  }
  return `
<clipPath id="crutchClip"><rect x="28" y="${cy - hh0}" width="${x0 - 28}" height="${hh0 * 2}" rx="3"/></clipPath>
<rect x="28" y="${cy - hh0}" width="${x0 - 28}" height="${hh0 * 2}" rx="3" fill="url(#crutch)"/>
<g clip-path="url(#crutchClip)">${spiral}</g>
<path d="${cone}" fill="url(#rollPaper)"/>
<path d="${cone}" fill="url(#herb)"/>
${folds}
<line x1="${x0}" y1="${cy - hh0 + 2.5}" x2="${end.toFixed(1)}" y2="${(cy - hh + 3).toFixed(1)}" stroke="#ffffff" stroke-width=".9" opacity=".9"/>`
}

function burning(kind: Style, puffs: number, f: number, isWorking: boolean): string {
  const cy = 54
  const px1 = 520
  const pulse = isWorking ? '1.1s' : '2.6s'
  const dur = isWorking ? 2.4 : 3.8

  let end: number
  let hh: number
  let stick: string
  if (kind === 'joint') {
    const x0 = 94
    end = x0 + (px1 - x0) * (1 - f)
    hh = 7 + 7 * ((end - x0) / (px1 - x0))
    stick = jointBody(x0, end, cy, 7, hh)
  } else {
    end = 116 + (px1 - 116) * (1 - f)
    hh = 12
    stick = cigaretteBody(end, cy)
  }

  // الجوينت دخانه أتقل شوي.
  const sx = end + 16
  const top = cy - hh
  let smoke =
    wisp(sx, top - 2, 0, dur, 3, 1) +
    wisp(sx + 4, top - 4, dur / 3, dur, 2.4, -1) +
    wisp(sx - 3, top - 1, (2 * dur) / 3, dur, 2, 1)
  if (kind === 'joint') smoke += wisp(sx + 8, top - 3, dur / 2, dur * 1.2, 3.6, -1)

  // صف النَّفَسات: المحروق برتقالي، الجاي فاضي، وآخر واحد بينبض.
  const step = (px1 - 28) / (PUFFS - 1)
  let dots = ''
  for (let i = 0; i < PUFFS; i++) {
    const x = (28 + i * step).toFixed(1)
    if (i < puffs) {
      const isLast = i === puffs - 1
      dots += `<circle cx="${x}" cy="94" r="3.2" fill="#ff8a3d">${isLast ? '<animate attributeName="r" values="3.2;4.4;3.2" dur="1.6s" repeatCount="indefinite"/>' : ''}</circle>`
    } else {
      dots += `<circle cx="${x}" cy="94" r="3" fill="none" stroke="#5d4f86" stroke-width="1.2"/>`
    }
  }

  return `
<text x="28" y="22" font-family="${FONT}" font-size="10" font-weight="600" letter-spacing="2.6" fill="#a99ccf">${KINDS[kind].title}</text>
<text x="572" y="22" text-anchor="end" font-family="${FONT}" font-size="10" font-weight="600" letter-spacing="1.6" fill="#a99ccf">${puffs} / ${PUFFS} PUFFS</text>
<ellipse cx="${(28 + end) / 2}" cy="${cy + hh + 5}" rx="${(end - 28) / 2}" ry="4" fill="#000" opacity=".35" filter="url(#blur)"/>
${stick}
${tip(end, cy, hh, pulse)}
<g filter="url(#blur)" stroke="#ddd6f3" fill="none" stroke-linecap="round">${smoke}</g>
${dots}`
}

function butt(kind: Style): string {
  if (kind === 'joint') {
    return `<g transform="rotate(-9 300 82)">
<rect x="276" y="78" width="28" height="10" rx="2.5" fill="url(#crutch)"/>
<line x1="282" y1="78" x2="288" y2="88" stroke="#b49c68" opacity=".6"/><line x1="290" y1="78" x2="296" y2="88" stroke="#b49c68" opacity=".6"/>
<path d="M 304 78 L 318 76.5 L 318 89.5 L 304 88 Z" fill="#f3eee2"/>
<path d="M 304 78 L 318 76.5 L 318 89.5 L 304 88 Z" fill="url(#herb)"/>
<path d="M 318 76.5 L 325 77 L 328 81 L 324 84 L 329 88 L 322 90 L 318 89.5 Z" fill="#e9e3d8"/>
<path d="M 325 77 L 328 81 L 324 84 L 329 88 L 322 90" fill="none" stroke="#4a443f" stroke-width="1.5"/>
</g>`
  }
  return `<g transform="rotate(-9 300 82)">
<rect x="262" y="76" width="56" height="13" rx="3" fill="url(#cork)"/>
<rect x="262" y="76" width="56" height="13" rx="3" fill="url(#dots)"/>
<rect x="318" y="76" width="3" height="13" fill="url(#gold)"/>
<path d="M 321 76 L 330 75 L 334 79 L 331 83 L 336 87 L 329 90 L 321 89 Z" fill="#e9e3d8"/>
<path d="M 330 75 L 334 79 L 331 83 L 336 87 L 329 90" fill="none" stroke="#4a443f" stroke-width="1.5"/>
</g>`
}

function burnedOut(kind: Style): string {
  const smokeX = kind === 'joint' ? 328 : 334
  return `
<circle cx="548" cy="40" r="32" fill="url(#leafGlow)"/>
${leaf(548, 40, 30, 0, 5)}
${leaf(72, 30, 16, 1.6, 6.5)}
${leaf(470, 82, 13, 3.1, 7)}
<text x="508" y="30" font-family="${FONT}" font-size="11" font-weight="700" fill="#c8b6ff">z<animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 6; -4 -6" dur="2.4s" repeatCount="indefinite"/></text>
<text x="494" y="22" font-family="${FONT}" font-size="8" font-weight="700" fill="#c8b6ff">z<animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="1.2s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 6; -4 -6" dur="2.4s" begin="1.2s" repeatCount="indefinite"/></text>
<text x="300" y="44" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="25" fill="url(#night)">It's time to get some rest</text>
<ellipse cx="300" cy="90" rx="118" ry="13" fill="url(#tray)" stroke="#7d6fb4" stroke-width="1.2"/>
<ellipse cx="300" cy="88" rx="96" ry="8" fill="#1a1430"/>
${butt(kind)}
<g filter="url(#blur)" stroke="#ddd6f3" fill="none" stroke-linecap="round">${wisp(smokeX, 72, 0, 5, 1.6, 1)}</g>`
}

// ───────────── التيرمنال: سيجارة/جوينت من حروف ─────────────

const PAPER_CELLS = 26
const RAMP = ['▃', '▄', '▅', '▆', '▇'] as const

function jointPaper(cells: number): string {
  let out = ''
  for (let i = 0; i < cells; i++) out += RAMP[Math.min(4, Math.floor((i / PAPER_CELLS) * 5))]
  return out
}

function parseStyle(args: string): Style | null {
  const a = args.trim().toLowerCase()
  if (a === 'joint' || a.includes('جوينت')) return 'joint'
  if (a === 'cigarette' || a.includes('سيجار')) return 'cigarette'
  return null
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const saved = await $.store.get('style')
    if (saved === 'joint' || saved === 'cigarette') await update($, style, () => saved)
    await $.command.register({
      name: 'smoke',
      description: 'Switch between the chat cigarette 🚬 and the chat joint 🌿',
      argumentHint: '[cigarette|joint]',
    })
    return next(e)
  })

  on('command.run', { command: 'smoke' }, async ($, e) => {
    const current = await read($, style)
    const want = parseStyle(e.args) ?? (current === 'joint' ? 'cigarette' : 'joint')
    await update($, style, () => want)
    await $.store.set('style', want)
    return {
      text: want === 'joint' ? '🌿 Switched to the chat joint.' : '🚬 Switched to the chat cigarette.',
    }
  })

  on('prompt.submit', async ($, e, next) => {
    if (!HUMAN.has(e.origin.kind)) return next(e)
    const { puffs } = await read($, smoke)
    if (puffs >= PUFFS) return next(e)
    await update($, smoke, s => ({ ...s, puffs: Math.min(PUFFS, s.puffs + 1) }))
    if (puffs + 1 < PUFFS) return next(e)
    const kind = await read($, style)
    return next({ ...e, context: [...(e.context ?? []), lastPuff(kind)] })
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    const s = await read($, smoke)
    if (s.puffs >= PUFFS && !s.isRested) {
      await update($, smoke, v => ({ ...v, isRested: true }))
      $.ui.toast(`🍁 ${REST_LINE}`, { timeoutMs: 12000 })
    }
    return result
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('rateLimits')) {
      const w = e.rateLimits.find(r => r.kind === 'five_hour') ?? e.rateLimits[0]
      const value: Limit = w ? { percent: w.percentUsed, resetsAt: w.resetsAt } : null
      await update($, limit, () => value)
    }
    return next(e)
  })

  // /clear = شات جديد = سيجارة جديدة.
  on('session.end', async ($, e, next) => {
    if (e.reason === 'clear') await update($, smoke, () => ({ puffs: 0, isRested: false }))
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || e.props.view.agentId !== undefined) return next(e)

    const s = await read($, smoke)
    const lim = await read($, limit)
    const kind = await read($, style)
    const line = tagline(kind, s.puffs)
    const isOut = s.puffs >= PUFFS

    if (e.surface === 'desktop') {
      const { Box, Text, Svg } = $.ui.resolve(e)
      const noun = KINDS[kind].noun
      return (
        <Box flexDirection="column" gap={1}>
          <Svg
            source={scene(kind, s.puffs, e.props.isWorking, lim, await $.clock.now())}
            alt={
              isOut
                ? `Chat ${noun} burned out — ${REST_LINE}`
                : `Chat ${noun}: ${s.puffs} of ${PUFFS} puffs smoked`
            }
            isInteractive
          />
          <Text key="tag" bold color={isOut ? '#b9a6ff' : undefined}>
            {line}
          </Text>
        </Box>
      )
    }

    if (e.surface === 'terminal') {
      const { Box, Text } = $.ui.resolve(e)
      const f = Math.min(1, s.puffs / PUFFS)
      const left = Math.round(PAPER_CELLS * (1 - f))
      const isJoint = kind === 'joint'
      const stick = isOut
        ? [
            <Text key="butt" color={isJoint ? '#efe6cf' : '#d0843a'}>{isJoint ? '▐≋≋' : '▐▓▓▓'}</Text>,
            ...(isJoint ? [] : [<Text key="ring" color="#d9b04f">▌</Text>]),
            <Text key="out" color="#8a8580">░  💤 </Text>,
            <Text key="rest" color="#b9a6ff" italic>{REST_LINE}</Text>,
          ]
        : [
            <Text key="cork" color={isJoint ? '#efe6cf' : '#d0843a'}>{isJoint ? '▐≋≋≋' : '▐▓▓▓▓'}</Text>,
            ...(isJoint ? [] : [<Text key="ring" color="#d9b04f">▌</Text>]),
            <Text key="paper" color="#f2ede4">{isJoint ? jointPaper(left) : '█'.repeat(left)}</Text>,
            <Text key="ember" color={e.props.isWorking ? '#ffb347' : '#ff5a14'}>▌</Text>,
            <Text key="ash" color="#8a8580">▒░</Text>,
            <Text key="smoke" dimColor>{e.props.isWorking ? ' ∿∿~' : ' ~'}</Text>,
            <Text key="count" dimColor>{`  ${s.puffs}/${PUFFS}`}</Text>,
          ]
      const footer = [<Text key="tag">{line}</Text>]
      if (lim !== null) {
        const filled = Math.round(Math.max(0, Math.min(100, lim.percent)) / 10)
        footer.push(
          <Box key="limit" flexDirection="row">
            <Text dimColor>⏳ </Text>
            <Text color={limitColor(lim.percent)}>{'▰'.repeat(filled)}</Text>
            <Text dimColor>{'▱'.repeat(10 - filled)}</Text>
          </Box>,
        )
      }
      return (
        <Box flexDirection="column">
          <Box flexDirection="row">{stick}</Box>
          <Box flexDirection="row" gap={3}>
            {footer}
          </Box>
        </Box>
      )
    }

    return next(e)
  })
}
