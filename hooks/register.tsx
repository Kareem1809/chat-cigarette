// شو هاد؟ «سيجارة المحادثة»: أول كل شات بتنولّع سيجارة (أو جوينت — /smoke بيبدّل)
// فوق خانة الكتابة، وكل رسالة منك لكلود = نَفَس، مع جملة جديدة وتحذير باكيت جديد.
// لما تخلص بيطلع كرت المشاركة وكلود بيقلك: It's time to get some rest.
// ليش؟ يخفف قعدة الحاسوب، وبيضحّك. كله محلي: لا إنترنت، لا shell، لا ملفات —
// بس حالة الجلسة ومخزن البلجن.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, Timer } from 'claude-code'

import type { Context, Day, Lang, Limit, Smoke, Style } from '../types'
import { scene } from './art'
import {
  CHILL_FROM,
  FRESH_PACK,
  INSTALL,
  JOINT_CHILL,
  KINDS,
  METER,
  PUFFS,
  PUFF_WORD,
  REST_LINE,
  SAID,
  SHARE,
  contextDetail,
  dayKey,
  freshLine,
  lastPuff,
  nightPhase,
  outOfSmokes,
  resetsIn,
  seedOf,
  stats,
  tagline,
  warnings,
} from './words'

const smoke = atom({ plugin: 'chat-cigarette', key: 'smoke' } as const, {
  puffs: 0,
  isRested: false,
} as Smoke)
const limit = atom({ plugin: 'chat-cigarette', key: 'limit' } as const, null as Limit)
const context = atom({ plugin: 'chat-cigarette', key: 'context' } as const, null as Context)
const style = atom({ plugin: 'chat-cigarette', key: 'style' } as const, 'cigarette' as Style)
const lang = atom({ plugin: 'chat-cigarette', key: 'lang' } as const, 'en' as Lang)

// بس رسائل الإنسان بتنحسب نَفَس — مش إشعارات المهام ولا رسائل البلجنات.
const HUMAN = new Set(['composer', 'bridge', 'sdk'])

const METER_CELLS = 14
const RAMP = ['▃', '▄', '▅', '▆', '▇'] as const
const HEAP = [' ', '▁', '▂', '▃', '▄', '▅', '▆'] as const

function emptyDay(key: string): Day {
  return { key, butts: [], puffs: 0 }
}

function isDay(v: unknown): v is Day {
  const d = v as Day | null
  return typeof d?.key === 'string' && typeof d.puffs === 'number' && Array.isArray(d.butts)
}

// منفضة اليوم كما بتبيّن هلّق (إذا اليوم تغيّر من آخر مرة، بتبلّش فاضية).
function dayView(s: Smoke, now: number): Day {
  const key = dayKey(now)
  return s.day?.key === key ? s.day : emptyDay(key)
}

function meterColor(pct: number): string {
  return pct < 50 ? '#5fd3a5' : pct < 80 ? '#ffb347' : '#ff5a5f'
}

type Meter = { key: string; icon: string; pct: number | null; color: string; text: string }

// العدّادات تحت الجملة: حدّ الـ5 ساعات (أو «خلص الدخان» / «باكيت جديد») والكونتكست.
function meters(lim: Limit, ctx: Context, now: number, ln: Lang): Meter[] {
  const out: Meter[] = []
  if (lim !== null) {
    const at = lim.resetsAt ? Date.parse(lim.resetsAt) : NaN
    const ms = Number.isFinite(at) && at > now ? at - now : null
    if (lim.isFresh) {
      out.push({ key: 'limit', icon: '📦', pct: null, color: '#5fd3a5', text: FRESH_PACK[ln].replace('📦 ', '') })
    } else if (lim.percent >= 100) {
      out.push({ key: 'limit', icon: '📦', pct: 100, color: '#ff5a5f', text: outOfSmokes(ms, ln) })
    } else {
      const detail = ms === null ? '' : ` · ${resetsIn(ms, ln)}`
      out.push({ key: 'limit', icon: '⏳', pct: lim.percent, color: meterColor(lim.percent), text: METER.limit[ln] + detail })
    }
  }
  if (ctx !== null) {
    out.push({
      key: 'context',
      icon: '🧠',
      pct: ctx.percent,
      color: meterColor(ctx.percent),
      text: `${METER.context[ln]} · ${contextDetail(ctx.tokens, ctx.window, ctx.percent, ln)}`,
    })
  }
  return out
}

function meterBar(pct: number | null): { used: string; left: string; label: string } {
  if (pct === null) return { used: '', left: '─'.repeat(METER_CELLS), label: ' '.repeat(4) }
  const p = Math.max(0, Math.min(100, pct))
  const on = Math.round((p / 100) * METER_CELLS)
  return { used: '━'.repeat(on), left: '─'.repeat(METER_CELLS - on), label: `${Math.round(p)}%`.padStart(4, ' ') }
}

// المكتة بالتيرمنال: كومة رماد بتعلى مع كل سحبة.
function ashCells(ash: number): string {
  const top = Math.round(ash * (HEAP.length - 1))
  return [top - 2, top - 1, top, top - 1, top - 2].map(h => HEAP[Math.max(0, h)] ?? ' ').join('')
}

function parseStyle(args: string): Style | null {
  const a = args.trim().toLowerCase()
  if (a === 'joint' || a.includes('جوينت') || a.includes('ג׳וינט') || a.includes("ג'וינט")) return 'joint'
  if (a === 'cigarette' || a.includes('سيجار') || a.includes('סיגרי')) return 'cigarette'
  return null
}

function contextOf(c: { tokens?: number; window: number; percent?: number }): Context {
  return c.tokens === undefined || c.percent === undefined
    ? null
    : { percent: c.percent, tokens: c.tokens, window: c.window }
}

// مؤقّت «الباكيت الجديد»: بيرنّ لما حدّ الـ5 ساعات يتجدّد بعد ما خلص.
let packTimer: Timer | undefined

async function freshPack($: EngineInterface): Promise<void> {
  const [lim, ln] = await Promise.all([read($, limit), read($, lang)])
  if (lim === null || lim.isFresh || lim.percent < 100) return
  await update($, limit, v => (v === null ? v : { ...v, isFresh: true }))
  $.ui.toast(FRESH_PACK[ln], { timeoutMs: 10000 })
}

function armPack($: EngineInterface, lim: Limit, now: number): void {
  packTimer?.cancel()
  packTimer = undefined
  if (lim === null || lim.isFresh || lim.percent < 100 || !lim.resetsAt) return
  const at = Date.parse(lim.resetsAt)
  if (!Number.isFinite(at)) return
  packTimer = $.clock.after(Math.max(0, at - now), () => void freshPack($))
}

export const register: Register = on => {
  // على ويندوز الرسمة المتحركة (iframe) بتختفي ثانيتين كل ما تنعاد تحميلها،
  // فهناك بنرسمها صورة ثابتة — بتتبدّل فوراً بلا وميض.
  let isWindows = false
  on('session.start', async ($, e, next) => {
    // إذا ما قدرنا نعرف النظام، بنكمّل عادي (الرسمة المتحركة).
    isWindows = await $.env.get('OS').then(
      os => os === 'Windows_NT',
      () => false,
    )
    // الافتراضي سيجارة بالإنجليزي؛ اختيارك (/smoke · /smokear · /smokehe · /smokeen) بيضل محفوظ.
    const [savedKind, savedLang, savedDay, usage, now] = await Promise.all([
      $.store.get('kind'),
      $.store.get('lang'),
      $.store.get('day'),
      $.session.usage().catch(() => null),
      $.clock.now(),
    ])
    if (savedKind === 'joint' || savedKind === 'cigarette') await update($, style, () => savedKind)
    if (savedLang === 'ar' || savedLang === 'en' || savedLang === 'he') await update($, lang, () => savedLang)

    // منفضة اليوم من المخزن (+ اللي لسا ما انكتب من هالجلسة).
    const key = dayKey(now)
    const stored = isDay(savedDay) && savedDay.key === key ? savedDay : emptyDay(key)
    await update($, smoke, v => {
      const u = v.unsynced ?? { puffs: 0, butts: [] }
      return { ...v, day: { key, puffs: stored.puffs + u.puffs, butts: [...stored.butts, ...u.butts] } }
    })

    // العدّادات بتطلع من أول لحظة، مش بس بعد أول رد.
    if (usage !== null) {
      const w = usage.rateLimits.find(r => r.kind === 'five_hour') ?? usage.rateLimits[0]
      if (w) await update($, limit, v => v ?? { percent: w.percentUsed, resetsAt: w.resetsAt })
      const c = contextOf(usage.context)
      if (c !== null) await update($, context, v => v ?? c)
    }
    armPack($, await read($, limit), now)

    await Promise.all([
      $.command.register({
        name: 'smoke',
        description: 'Switch between the chat cigarette 🚬 and the chat joint 🌿',
        argumentHint: '[cigarette|joint]',
        immediate: true,
      }),
      $.command.register({ name: 'smokear', description: 'Chat cigarette in Arabic — بالعربي', immediate: true }),
      $.command.register({ name: 'smokehe', description: 'Chat cigarette in Hebrew — בעברית', immediate: true }),
      $.command.register({ name: 'smokeen', description: 'Chat cigarette in English', immediate: true }),
      $.command.register({ name: 'smokeng', description: 'Chat cigarette in English (same as /smokeen)', immediate: true }),
    ])
    return next(e)
  })

  on('command.run', { command: 'smoke' }, async ($, e) => {
    const [current, ln] = await Promise.all([read($, style), read($, lang)])
    const want = parseStyle(e.args) ?? (current === 'joint' ? 'cigarette' : 'joint')
    await update($, style, () => want)
    await $.store.set('kind', want)
    return { text: SAID[want][ln] }
  })

  on('command.run', { command: ['smokear', 'smokehe', 'smokeen', 'smokeng'] }, async ($, e) => {
    const want: Lang = e.command === 'smokear' ? 'ar' : e.command === 'smokehe' ? 'he' : 'en'
    await update($, lang, () => want)
    await $.store.set('lang', want)
    return { text: SAID.lang[want] }
  })

  // كل رسالة منك = نَفَس (تحديث واحد للحالة). الرسالة نفسها بتكمّل فوراً.
  on('prompt.submit', async ($, e, next) => {
    if (!HUMAN.has(e.origin.kind)) return next(e)
    const [s, kind, now, ln] = await Promise.all([read($, smoke), read($, style), $.clock.now(), read($, lang)])
    const isDawn = nightPhase(now) === 'dawn'
    // خلصت وكلود قال «روح ارتاح»؟ الرسالة الجاية بتولّع وحدة جديدة من الباكيت (أو بتلفّ جوينت).
    // لسا عم يقلك «ارتاح» (الدور ما خلص)، أو 4 الصبح — ما في جديدة.
    const isRelight = s.puffs >= PUFFS
    if (isRelight && (!s.isRested || isDawn)) return next(e)
    // 4 الصبح: سيجارة جديدة ما بتولّع (بالرسمة بس).
    if (s.puffs === 0 && isDawn) return next(e)

    const puffs = isRelight ? 1 : s.puffs + 1
    const isLast = puffs >= PUFFS
    await update($, smoke, v => {
      const day = dayView(v, now)
      const u = v.unsynced ?? { puffs: 0, butts: [] }
      const from = v.puffs >= PUFFS ? 0 : v.puffs
      return {
        ...v,
        puffs: Math.min(PUFFS, from + 1),
        isRested: v.puffs >= PUFFS ? false : v.isRested,
        day: { key: day.key, puffs: day.puffs + 1, butts: isLast ? [...day.butts, kind] : day.butts },
        unsynced: { puffs: u.puffs + 1, butts: isLast ? [...u.butts, kind] : u.butts },
      }
    })
    if (isRelight) $.ui.toast(freshLine(kind, ln, dayView(s, now).butts.length + 1), { timeoutMs: 6000 })

    if (isLast) return next({ ...e, context: [...(e.context ?? []), lastPuff(kind)] })
    if (kind === 'joint' && puffs >= CHILL_FROM) return next({ ...e, context: [...(e.context ?? []), JOINT_CHILL] })
    return next(e)
  })

  // بعد ما الدور يخلص (مش وإنت عم تستنّى): منكتب منفضة اليوم بالمخزن، ومنبعت «روح ارتاح».
  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId !== undefined) return result
    const s = await read($, smoke)

    const u = s.unsynced
    if (u !== undefined && (u.puffs > 0 || u.butts.length > 0) && s.day !== undefined) {
      const stored = await $.store.get('day')
      const base = isDay(stored) && stored.key === s.day.key ? stored : emptyDay(s.day.key)
      const merged: Day = { key: base.key, puffs: base.puffs + u.puffs, butts: [...base.butts, ...u.butts] }
      await $.store.set('day', merged)
      await update($, smoke, v => {
        const rest = v.unsynced ?? { puffs: 0, butts: [] }
        const left = { puffs: rest.puffs - u.puffs, butts: rest.butts.slice(u.butts.length) }
        return {
          ...v,
          day: { key: merged.key, puffs: merged.puffs + left.puffs, butts: [...merged.butts, ...left.butts] },
          unsynced: left,
        }
      })
    }

    if (s.puffs >= PUFFS && !s.isRested) {
      await update($, smoke, v => ({ ...v, isRested: true }))
      $.ui.toast(`🍁 ${REST_LINE}`, { timeoutMs: 12000 })
    }
    return result
  })

  on('session.measure', async ($, e, next) => {
    const now = await $.clock.now()
    if (e.changed.includes('rateLimits')) {
      const w = e.rateLimits.find(r => r.kind === 'five_hour') ?? e.rateLimits[0]
      const value: Limit = w ? { percent: w.percentUsed, resetsAt: w.resetsAt } : null
      const [before, ln] = await Promise.all([read($, limit), read($, lang)])
      await update($, limit, () => value)
      // إذا كان خالص وإجت قراءة جديدة قبل ما المؤقّت يرنّ — برضه «باكيت جديد».
      if (before !== null && before.percent >= 100 && !before.isFresh && value !== null && value.percent < 100) {
        $.ui.toast(FRESH_PACK[ln], { timeoutMs: 10000 })
      }
      armPack($, value, now)
    }
    if (e.changed.includes('context')) await update($, context, () => contextOf(e.context))
    return next(e)
  })

  // /clear = شات جديد = سيجارة جديدة (والمنفضة بتضل).
  on('session.end', async ($, e, next) => {
    if (e.reason === 'clear') {
      await update($, smoke, v => ({ ...v, puffs: 0, isRested: false }))
      await update($, context, () => null)
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || e.props.view.agentId !== undefined) return next(e)

    // كل القراءات سوا — رحلة وحدة، عشان الرسمة ما تتأخر.
    const [s, lim, ctx, kind, ln, now] = await Promise.all([
      read($, smoke),
      read($, limit),
      read($, context),
      read($, style),
      read($, lang),
      $.clock.now(),
    ])
    const day = dayView(s, now)
    const isOut = s.puffs >= PUFFS
    const isUnlit = s.puffs === 0 && nightPhase(now) === 'dawn'
    // كل سيجارة إلها رقم (من اليوم وكم عقب قبلها) — بتبلّش جملها وتحذيراتها من مكان جديد.
    const seed = seedOf(day.key, isOut ? Math.max(0, day.butts.length - 1) : day.butts.length)
    const line = tagline(kind, ln, s.puffs, now, seed, isOut ? 0 : day.butts.length)
    const warns = warnings(kind, ln, s.puffs, seed)
    const warn = warns[0] ?? ''
    const limitPct = lim !== null && !lim.isFresh ? Math.round(Math.min(100, lim.percent)) : null
    const card = stats(ln, day.butts.length, day.puffs, limitPct)
    const ms = meters(lim, ctx, now, ln)

    if (e.surface === 'desktop') {
      const { Box, Text, Svg } = $.ui.resolve(e)
      const noun = KINDS[kind].noun
      const rows = [
        <Text key="tag" bold color={isOut ? '#b9a6ff' : undefined}>
          {line}
        </Text>,
      ]
      for (const m of ms) {
        const b = meterBar(m.pct)
        rows.push(
          <Box key={m.key} flexDirection="row" gap={1}>
            <Text>{m.icon}</Text>
            <Box flexDirection="row">
              <Text color={m.color}>{b.used}</Text>
              <Text dimColor>{b.left}</Text>
            </Box>
            <Text bold color={m.color}>{b.label}</Text>
            <Text dimColor>{m.text}</Text>
          </Box>,
        )
      }
      if (isOut) {
        rows.push(
          <Box key="share" flexDirection="row" gap={1}>
            <Text dimColor>{SHARE[ln]}</Text>
            <Text color="#bdb2e0">{INSTALL}</Text>
          </Box>,
        )
      }
      return (
        <Box flexDirection="column" gap={1}>
          <Svg
            source={scene({ kind, ln, puffs: s.puffs, warnings: warns, butts: day.butts, isUnlit, stats: card, animated: !isWindows })}
            alt={
              isOut
                ? `Chat ${noun} burned out — ${REST_LINE} — ${card}`
                : `Chat ${noun}: ${s.puffs} of ${PUFFS} puffs smoked — ${warn}`
            }
            isInteractive={!isWindows}
          />
          <Box flexDirection="column">{rows}</Box>
        </Box>
      )
    }

    if (e.surface === 'terminal') {
      const { Box, Text } = $.ui.resolve(e)
      // كرت بإطار مدوّر: عنوان وعدّاد · السيجارة والمكتة بآخر السطر · التحذير · الجملة · العدّادات.
      const width = Math.max(48, Math.min(e.props.bodyColumns, 96))
      const inner = width - 4
      const paperCells = Math.max(14, Math.min(60, inner - 30))
      const f = Math.min(1, s.puffs / PUFFS)
      const left = Math.round(paperCells * (1 - f))
      const isJoint = kind === 'joint'
      const filter = isJoint ? '#b08b58' : '#f0bf82'
      const paper = isJoint
        ? Array.from({ length: left }, (_, i) => RAMP[Math.min(4, Math.floor((i / paperCells) * 5))]).join('')
        : '█'.repeat(left)

      const stick = isOut
        ? [
            <Text key="butt" color={filter}>{isJoint ? '▐≋≋' : '▐▓▓▓'}</Text>,
            ...(isJoint ? [] : [<Text key="ring" color="#d9b04f">▌</Text>]),
            <Text key="out" color="#8a8580">░ 💤 </Text>,
            <Text key="rest" color="#b9a6ff" italic>{REST_LINE}</Text>,
          ]
        : [
            ...(isJoint
              ? [
                  <Text key="cork" color={filter}>▐</Text>,
                  <Text key="raw" bold color="#3a2512" backgroundColor={filter}>RAW</Text>,
                ]
              : [<Text key="cork" color={filter}>▐▓▓▓▓</Text>]),
            ...(isJoint ? [] : [<Text key="ring" color="#d9b04f">▌</Text>]),
            <Text key="paper" color={isJoint ? '#d9bf8f' : '#f2ede4'}>{paper}</Text>,
            ...(isUnlit
              ? [<Text key="unlit" color={isJoint ? '#5f7d3a' : '#8a5a2b'}>▌</Text>]
              : [
                  <Text key="ember" color={e.props.isWorking ? '#ffb347' : '#ff5a14'}>▌</Text>,
                  <Text key="ashTip" color="#8a8580">▒░</Text>,
                  <Text key="smoke" dimColor>{e.props.isWorking ? ' ∿∿~' : ' ~'}</Text>,
                ]),
          ]
      const tray = [
        <Text key="trayL" color="#8a7cc0">╰</Text>,
        <Text key="ash" color="#9a948b">{ashCells(isOut ? 1 : f)}</Text>,
        <Text key="trayR" color="#8a7cc0">╯</Text>,
        ...day.butts.slice(-6).map((b, i) => (
          <Text key={`b${i}`} color={b === 'joint' ? '#b08b58' : '#f0bf82'}>▬</Text>
        )),
      ]
      if (day.butts.length > 0) tray.push(<Text key="count" color="#c8b6ff" bold>{` ×${day.butts.length}`}</Text>)

      const rows = [
        <Box key="head" flexDirection="row" justifyContent="space-between">
          <Text bold color="#c8b6ff">{KINDS[kind].title[ln]}</Text>
          <Text dimColor>{`${s.puffs}/${PUFFS} ${PUFF_WORD[ln]}`}</Text>
        </Box>,
        <Box key="stick" flexDirection="row" justifyContent="space-between">
          <Box flexDirection="row">{stick}</Box>
          <Box flexDirection="row">{tray}</Box>
        </Box>,
      ]
      if (isOut) {
        rows.push(<Text key="stats" color="#c8b6ff" bold>{card}</Text>)
      } else {
        // التحذير بنص الشريط، ومثلث أحمر واحد لازق بكلمة التحذير (يسار بالإنجليزي، يمين بالعربي/العبري).
        const body = ` ${warn} `
        const padL = Math.max(0, Math.floor((inner - body.length - 3) / 2))
        const padR = Math.max(0, inner - padL - body.length - 3)
        const sign = <Text key="sign" inverse bold color="#e0312b">{' ⚠ '}</Text>
        const words = <Text key="words" inverse bold wrap="truncate">{body}</Text>
        rows.push(
          <Box key="warn" flexDirection="row">
            <Text inverse>{' '.repeat(padL)}</Text>
            {ln === 'en' ? [sign, words] : [words, sign]}
            <Text inverse>{' '.repeat(padR)}</Text>
          </Box>,
        )
      }
      rows.push(<Text key="tag" wrap="truncate">{line}</Text>)
      for (const m of ms) {
        const b = meterBar(m.pct)
        rows.push(
          <Box key={m.key} flexDirection="row" gap={1}>
            <Text>{m.icon}</Text>
            <Box flexDirection="row">
              <Text color={m.color}>{b.used}</Text>
              <Text dimColor>{b.left}</Text>
            </Box>
            <Text bold color={m.color}>{b.label}</Text>
            <Text dimColor wrap="truncate">{m.text}</Text>
          </Box>,
        )
      }
      if (isOut) {
        rows.push(
          <Box key="share" flexDirection="row" gap={1}>
            <Text dimColor>{SHARE[ln]}</Text>
            <Text color="#bdb2e0">{INSTALL}</Text>
          </Box>,
        )
      }
      return (
        <Box flexDirection="column" width={width} borderStyle="round" borderColor="#5d4f86" paddingX={1}>
          {rows}
        </Box>
      )
    }

    return next(e)
  })
}
