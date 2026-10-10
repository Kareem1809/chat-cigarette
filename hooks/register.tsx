// شو هاد؟ «سيجارة المحادثة»: أول كل شات بتنولّع سيجارة فوق خانة الكتابة،
// وكل رسالة منك لكلود = نَفَس. لما تخلص، كلود بيقلك: It's time to get some rest.
// ليش؟ تذكير لطيف للمدخنين (ولغيرهم) يخففوا قعدة الحاسوب.
import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Limit, Smoke } from '../types'

// كم نَفَس بالسيجارة = كم رسالة منك قبل ما تخلص. غيّر الرقم إذا بدك.
const PUFFS = 20

const REST_LINE = "It's time to get some rest 🍁"

const smoke = atom({ plugin: 'chat-cigarette', key: 'smoke' } as const, {
  puffs: 0,
  isRested: false,
} as Smoke)
const limit = atom({ plugin: 'chat-cigarette', key: 'limit' } as const, null as Limit)

// بس رسائل الإنسان بتنحسب نَفَس — مش إشعارات المهام ولا رسائل البلجنات.
const HUMAN = new Set(['composer', 'bridge', 'sdk'])

// آخر نَفَس: كلود نفسه بيقلك تروح ترتاح.
const LAST_PUFF =
  "[chat-cigarette] This message was the user's last puff: the 'chat cigarette' " +
  'that burns down with every message they send has just burned out. It is a ' +
  'wellbeing mod they installed on purpose to cut down their screen time. Answer ' +
  'their message normally, then close your reply with one short warm line (in ' +
  `their language) telling them to step away and rest, ending with exactly: "${REST_LINE}"`

function tagline(puffs: number): string {
  const f = puffs / PUFFS
  if (f >= 1) return '🍁 خلصت السيجارة… سكّر الشاشة وروح ارتاح'
  if (puffs === 0) return '🔥 ولّعنا سيجارة المحادثة — كل رسالة منك نَفَس'
  if (f < 0.25) return '☕ لسا بأولها… استمتع بالحكي'
  if (f < 0.5) return '🌬️ ربعها راح — خذ نفس هوا حقيقي كمان'
  if (f < 0.75) return '⏳ نصّها راح — قرّب وقت الاستراحة'
  return '🕯️ آخر كم نَفَس — جهّز حالك ترتاح'
}

function limitLine(lim: Limit, now: number): string | null {
  if (lim === null) return null
  let line = `⏳ حدّ الـ5 ساعات: ${Math.round(lim.percent)}%`
  const at = lim.resetsAt ? Date.parse(lim.resetsAt) : NaN
  if (Number.isFinite(at) && at > now) {
    const mins = Math.round((at - now) / 60000)
    const h = Math.floor(mins / 60)
    const m = mins % 60
    line += ` · بيتجدد بعد ${h > 0 ? `${h}س ` : ''}${m}د`
  }
  return line
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

function defs(): string {
  return `<defs>
<linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#17112e"/><stop offset="1" stop-color="#2d1f4a"/></linearGradient>
<linearGradient id="cork" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3b86d"/><stop offset=".5" stop-color="#d0843a"/><stop offset="1" stop-color="#94501d"/></linearGradient>
<linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f2ede4"/><stop offset="1" stop-color="#c9c0b0"/></linearGradient>
<linearGradient id="ash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c2bdb6"/><stop offset="1" stop-color="#5f5953"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".5" stop-color="#d9b04f"/><stop offset="1" stop-color="#a77d22"/></linearGradient>
<linearGradient id="night" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe6a8"/><stop offset="1" stop-color="#c8b6ff"/></linearGradient>
<linearGradient id="tray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4c86"/><stop offset="1" stop-color="#211a38"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#ffd27a"/><stop offset=".35" stop-color="#ff7a1a" stop-opacity=".85"/><stop offset="1" stop-color="#ff3d00" stop-opacity="0"/></radialGradient>
<radialGradient id="leafGlow"><stop offset="0" stop-color="#ff9a3c" stop-opacity=".45"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
<pattern id="dots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".9" fill="#6b3510" opacity=".45"/><circle cx="5.5" cy="5" r=".7" fill="#6b3510" opacity=".35"/></pattern>
</defs>`
}

function cigaretteSvg(puffs: number, isWorking: boolean): string {
  const f = Math.min(1, puffs / PUFFS)
  const head = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="112" viewBox="0 0 600 112">${defs()}<rect width="600" height="112" rx="16" fill="url(#sky)"/>${stars()}`
  return head + (f >= 1 ? burnedOut() : burning(puffs, f, isWorking)) + '</svg>'
}

function burning(puffs: number, f: number, isWorking: boolean): string {
  const fx0 = 28
  const fx1 = 112
  const px0 = 116
  const px1 = 520
  const cy = 54
  const ch = 24
  const y0 = cy - ch / 2
  const end = px0 + (px1 - px0) * (1 - f)
  const pulse = isWorking ? '1.1s' : '2.6s'
  const smokeDur = isWorking ? 2.4 : 3.8
  const sx = end + 16

  // صف النَّفَسات: المحروق برتقالي، الجاي فاضي، وآخر واحد بينبض.
  const step = (px1 - fx0) / (PUFFS - 1)
  let dots = ''
  for (let i = 0; i < PUFFS; i++) {
    const x = (fx0 + i * step).toFixed(1)
    if (i < puffs) {
      const isLast = i === puffs - 1
      dots += `<circle cx="${x}" cy="94" r="3.2" fill="#ff8a3d">${isLast ? '<animate attributeName="r" values="3.2;4.4;3.2" dur="1.6s" repeatCount="indefinite"/>' : ''}</circle>`
    } else {
      dots += `<circle cx="${x}" cy="94" r="3" fill="none" stroke="#5d4f86" stroke-width="1.2"/>`
    }
  }

  return `
<text x="28" y="22" font-family="${FONT}" font-size="10" font-weight="600" letter-spacing="2.6" fill="#a99ccf">CHAT CIGARETTE</text>
<text x="572" y="22" text-anchor="end" font-family="${FONT}" font-size="10" font-weight="600" letter-spacing="1.6" fill="#a99ccf">${puffs} / ${PUFFS} PUFFS</text>
<ellipse cx="${(fx0 + end) / 2}" cy="${cy + 17}" rx="${(end - fx0) / 2}" ry="4" fill="#000" opacity=".35" filter="url(#blur)"/>
<rect x="${fx0}" y="${y0}" width="${fx1 - fx0}" height="${ch}" rx="5" fill="url(#cork)"/>
<rect x="${fx0}" y="${y0}" width="${fx1 - fx0}" height="${ch}" rx="5" fill="url(#dots)"/>
<rect x="${fx1}" y="${y0}" width="4" height="${ch}" fill="url(#gold)"/>
<rect x="${px0}" y="${y0}" width="${Math.max(0, end - px0).toFixed(1)}" height="${ch}" fill="url(#paper)"/>
<line x1="${px0}" y1="${y0 + 5}" x2="${end.toFixed(1)}" y2="${y0 + 5}" stroke="#ffffff" stroke-width=".8" opacity=".9"/>
<circle cx="${end + 4}" cy="${cy}" r="24" fill="url(#glow)" filter="url(#soft)" opacity=".7"><animate attributeName="opacity" values=".45;.95;.45" dur="${pulse}" repeatCount="indefinite"/></circle>
<path d="M ${end + 4} ${y0 + 1} L ${end + 18} ${y0 + 2} L ${end + 21} ${y0 + 7} L ${end + 19} ${cy} L ${end + 22} ${y0 + ch - 6} L ${end + 17} ${y0 + ch - 1} L ${end + 4} ${y0 + ch - 1} Z" fill="url(#ash)"/>
<circle cx="${end + 10}" cy="${cy - 4}" r="1" fill="#3d3833"/><circle cx="${end + 14}" cy="${cy + 5}" r="1.1" fill="#3d3833"/>
<rect x="${end - 2}" y="${y0}" width="7" height="${ch}" fill="#ff5a14"><animate attributeName="fill" values="#ff5a14;#ffb347;#ff5a14" dur="${pulse}" repeatCount="indefinite"/></rect>
<circle cx="${end + 6}" cy="${cy - 6}" r="1.2" fill="#ffcf6b"><animate attributeName="opacity" values="0;1;0" dur="${pulse}" repeatCount="indefinite"/></circle>
<circle cx="${end + 6}" cy="${cy + 7}" r="1" fill="#ffcf6b"><animate attributeName="opacity" values="1;0;1" dur="${pulse}" repeatCount="indefinite"/></circle>
<g filter="url(#blur)" stroke="#ddd6f3" fill="none" stroke-linecap="round">
${wisp(sx, y0 - 2, 0, smokeDur, 3, 1)}
${wisp(sx + 4, y0 - 4, smokeDur / 3, smokeDur, 2.4, -1)}
${wisp(sx - 3, y0 - 1, (2 * smokeDur) / 3, smokeDur, 2, 1)}
</g>
${dots}`
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

function burnedOut(): string {
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
<g transform="rotate(-9 300 82)">
<rect x="262" y="76" width="56" height="13" rx="3" fill="url(#cork)"/>
<rect x="262" y="76" width="56" height="13" rx="3" fill="url(#dots)"/>
<rect x="318" y="76" width="3" height="13" fill="url(#gold)"/>
<path d="M 321 76 L 330 75 L 334 79 L 331 83 L 336 87 L 329 90 L 321 89 Z" fill="#e9e3d8"/>
<path d="M 330 75 L 334 79 L 331 83 L 336 87 L 329 90" fill="none" stroke="#4a443f" stroke-width="1.5"/>
</g>
<g filter="url(#blur)" stroke="#ddd6f3" fill="none" stroke-linecap="round">${wisp(334, 72, 0, 5, 1.6, 1)}</g>`
}

// ───────────── الرسمة (تيرمنال): سيجارة من حروف ─────────────

const PAPER_CELLS = 26

export const register: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    if (!HUMAN.has(e.origin.kind)) return next(e)
    const { puffs } = await read($, smoke)
    if (puffs >= PUFFS) return next(e)
    await update($, smoke, s => ({ ...s, puffs: Math.min(PUFFS, s.puffs + 1) }))
    if (puffs + 1 < PUFFS) return next(e)
    return next({ ...e, context: [...(e.context ?? []), LAST_PUFF] })
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
    const usage = limitLine(lim, await $.clock.now())
    const line = tagline(s.puffs)

    if (e.surface === 'desktop') {
      const { Box, Text, Svg } = $.ui.resolve(e)
      const footer = [
        <Text key="tag" bold color={s.puffs >= PUFFS ? '#b9a6ff' : undefined}>
          {line}
        </Text>,
      ]
      if (usage !== null) footer.push(<Text key="lim" dimColor>{usage}</Text>)
      return (
        <Box flexDirection="column" gap={1}>
          <Svg
            source={cigaretteSvg(s.puffs, e.props.isWorking)}
            alt={
              s.puffs >= PUFFS
                ? `Chat cigarette burned out — ${REST_LINE}`
                : `Chat cigarette: ${s.puffs} of ${PUFFS} puffs smoked`
            }
            isInteractive
          />
          <Box flexDirection="row" justifyContent="space-between" gap={2}>
            {footer}
          </Box>
        </Box>
      )
    }

    if (e.surface === 'terminal') {
      const { Box, Text } = $.ui.resolve(e)
      const f = Math.min(1, s.puffs / PUFFS)
      const left = Math.round(PAPER_CELLS * (1 - f))
      const stick =
        f >= 1
          ? [
              <Text key="butt" color="#d0843a">▐▓▓▓</Text>,
              <Text key="ring" color="#d9b04f">▌</Text>,
              <Text key="out" color="#8a8580">░  💤 </Text>,
              <Text key="rest" color="#b9a6ff" italic>{REST_LINE}</Text>,
            ]
          : [
              <Text key="cork" color="#d0843a">▐▓▓▓▓</Text>,
              <Text key="ring" color="#d9b04f">▌</Text>,
              <Text key="paper" color="#f2ede4">{'█'.repeat(left)}</Text>,
              <Text key="ember" color={e.props.isWorking ? '#ffb347' : '#ff5a14'}>▌</Text>,
              <Text key="ash" color="#8a8580">▒░</Text>,
              <Text key="smoke" dimColor>{e.props.isWorking ? ' ∿∿~' : ' ~'}</Text>,
              <Text key="count" dimColor>{`  ${s.puffs}/${PUFFS}`}</Text>,
            ]
      const footer = [<Text key="tag">{line}</Text>]
      if (usage !== null) footer.push(<Text key="lim" dimColor>{usage}</Text>)
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
