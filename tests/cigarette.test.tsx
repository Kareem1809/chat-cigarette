import { expect, mock, test } from 'claude-code/testing'

// ضهر يوم عادي — عشان وضع آخر الليل ما يتدخّل بالاختبارات القديمة.
const NOON = new Date(2026, 9, 11, 12, 0).getTime()

const BAND = {
  plugin: 'chat-cigarette',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 20,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 19 },
    view: {},
  },
} as const

test('every message is a puff, and the band shows the count on both surfaces', async ($, on) => {
  mock.clock(on, { now: NOON })
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  for (let i = 0; i < 3; i++) {
    await $.prompt.submit({ text: `hi ${i}`, wait: false, origin: { kind: 'composer' } })
  }
  const term = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await term.find({ type: 'Text', text: '3/20' })).toBeDefined()
  expect(await term.find({ type: 'Text', text: /Cigarette lit/ })).toBeUndefined()
  await term.unmount()

  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(JSON.stringify(await desk.drawn())).toContain('3 / 20 PUFFS')
  await desk.unmount()
})

test('a notification is not a puff', async ($, on) => {
  mock.clock(on, { now: NOON })
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  await $.prompt.submit({ text: 'done', wait: false, origin: { kind: 'plugin', name: 'x' } } as never)
  const term = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await term.find({ type: 'Text', text: '0/20' })).toBeDefined()
  await term.unmount()
})

test('the last puff asks Claude to say it is time to rest, and the band burns out', async ($, on) => {
  mock.clock(on, { now: NOON })
  const contexts: (readonly string[] | undefined)[] = []
  on('prompt.submit', ($, e) => {
    contexts.push(e.context)
    return { text: e.text, context: e.context }
  })
  for (let i = 0; i < 21; i++) {
    await $.prompt.submit({ text: `msg ${i}`, wait: false, origin: { kind: 'composer' } })
  }
  expect(contexts[18]).toBeUndefined()
  expect(contexts[19]?.join(' ')).toContain("It's time to get some rest")
  expect(contexts[20]).toBeUndefined()

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect(await ui.find({ type: 'Text', text: /burned out/ })).toBeDefined()
    expect(JSON.stringify(await ui.drawn())).toContain("It's time to get some rest")
    await ui.unmount()
  }
})

const SMOKE = (args: string) => ({
  command: 'smoke',
  args,
  origin: { kind: 'composer' },
  presentation: { isFullscreen: false, columns: 80 },
}) as const

test('/smoke switches to the joint and back, on both surfaces', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on)
  expect((await $.command.run(SMOKE('joint'))).text).toContain('joint')
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect(await ui.find({ type: 'Text', text: /Joint lit/ })).toBeDefined()
    await ui.unmount()
  }
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(JSON.stringify(await desk.drawn())).toContain('CHAT JOINT')
  await desk.unmount()

  expect((await $.command.run(SMOKE(''))).text).toContain('cigarette')
})

test('a joint picked last time comes back in the next session', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on, { kind: 'joint' })
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', () => ({ value: undefined }) as never)
  await $.session.start({ cwd: '/tmp', surface: 'terminal', isInteractive: true })
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /Joint lit/ })).toBeDefined()
  await ui.unmount()
})

test('the 5-hour limit is a tidy English row, outside the drawing', async ($, on) => {
  mock.clock(on, { now: NOON })
  on('session.measure', ($, e) => ({ changed: e.changed }))
  await $.session.measure({
    context: { window: 200000 },
    rateLimits: [{ kind: 'five_hour', percentUsed: 42, resetsAt: new Date(NOON + 8_100_000).toISOString() }],
    changed: ['rateLimits'],
  })
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect(await ui.find({ type: 'Text', text: '5-hour limit' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '42%' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: 'resets in 2h 15m' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '━━━━━━' })).toBeDefined()
    await ui.unmount()
  }
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(JSON.stringify(await desk.drawn())).not.toContain('5-hour limit:')
  await desk.unmount()
})

test('the drawing does not change when Claude starts working (no reload flash)', async ($, on) => {
  mock.clock(on, { now: NOON })
  const idle = await $.ui.mount({ ...BAND, surface: 'desktop' })
  const before = JSON.stringify((await idle.find({ type: 'Svg' })) ?? null)
  await idle.unmount()
  const busy = await $.ui.mount({ ...BAND, surface: 'desktop', props: { ...BAND.props, isWorking: true } })
  expect(JSON.stringify((await busy.find({ type: 'Svg' })) ?? null)).toBe(before)
  await busy.unmount()
})

for (const [name, env, isAnimated] of [
  ['on Windows the drawing is a still image (no iframe reload)', { OS: 'Windows_NT' }, false],
  ['elsewhere the drawing is animated', {}, true],
] as const) {
  test(name, async ($, on) => {
    mock.clock(on, { now: NOON })
    mock.store(on)
    mock.env(on, env)
    on('session.start', ($, e) => ({ cwd: e.cwd }))
    on('command.register', () => ({ value: undefined }) as never)
    await $.session.start({ cwd: '/tmp', surface: 'desktop', isInteractive: true })
    const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
    expect(JSON.stringify(await ui.drawn()).includes('"isInteractive":true')).toBe(isAnimated)
    await ui.unmount()
  })
}

test('every message brings a different line', async ($, on) => {
  mock.clock(on, { now: NOON })
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  const seen: string[] = []
  for (let i = 0; i < 19; i++) {
    await $.prompt.submit({ text: `m ${i}`, wait: false, origin: { kind: 'composer' } })
    const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
    const texts = await ui.findAll({ type: 'Text' })
    seen.push(texts.map(t => t.text).find(t => /^\p{Extended_Pictographic}/u.test(t ?? '')) ?? '')
    await ui.unmount()
  }
  for (let i = 1; i < seen.length; i++) expect(seen[i]).not.toBe(seen[i - 1])
})

test('/smokear turns the words Arabic and /smokeen turns them back', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on)
  on('session.measure', ($, e) => ({ changed: e.changed }))
  await $.session.measure({
    context: { window: 200000 },
    rateLimits: [{ kind: 'five_hour', percentUsed: 42 }],
    changed: ['rateLimits'],
  })
  const run = (command: string) =>
    $.command.run({ command, args: '', origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 80 } })
  expect((await run('smokear')).text).toContain('بالعربي')
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect(await ui.find({ type: 'Text', text: /ولّعنا السيجارة/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: 'حدّ الـ5 ساعات' })).toBeDefined()
    await ui.unmount()
  }
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(JSON.stringify(await desk.drawn())).toContain('سيجارة المحادثة')
  await desk.unmount()

  expect((await run('smokeen')).text).toContain('English')
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /Cigarette lit/ })).toBeDefined()
  await ui.unmount()
})

test('/smokehe turns the words Hebrew', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on)
  on('session.measure', ($, e) => ({ changed: e.changed }))
  await $.session.measure({
    context: { window: 200000 },
    rateLimits: [{ kind: 'five_hour', percentUsed: 42 }],
    changed: ['rateLimits'],
  })
  const r = await $.command.run({
    command: 'smokehe',
    args: '',
    origin: { kind: 'composer' },
    presentation: { isFullscreen: false, columns: 80 },
  })
  expect(r.text).toContain('בעברית')
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect(await ui.find({ type: 'Text', text: /הדלקנו סיגריה/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: 'מגבלת 5 השעות' })).toBeDefined()
    await ui.unmount()
  }
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(JSON.stringify(await desk.drawn())).toContain('סיגריית השיחה')
  await desk.unmount()
})

// نص الرسمة نفسها (بلا الوصف المخفي alt).
function svgSource(n: unknown): string {
  const e = n as { type?: string; props?: { source?: string }; children?: unknown[] }
  if (e?.type === 'Svg') return e.props?.source ?? ''
  for (const c of e?.children ?? []) {
    const found = svgSource(c)
    if (found) return found
  }
  return ''
}

const at = (h: number, m = 0) => new Date(2026, 9, 11, h, m).getTime()
const complete = {
  answer: 'ok',
  durationMs: 1,
  isAborted: false,
  turnId: 't',
  reason: 'answer',
  category: null,
  explanation: null,
  text: 'ok',
} as const

test('a fake pack warning on the drawing, new with every puff, in all three languages', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on)
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  const seen: string[] = []
  for (let i = 0; i < 3; i++) {
    await $.prompt.submit({ text: `m ${i}`, wait: false, origin: { kind: 'composer' } })
    const term = await $.ui.mount({ ...BAND, surface: 'terminal' })
    seen.push((await term.find({ type: 'Text', text: /WARNING:/ }))?.text ?? '')
    await term.unmount()
  }
  expect(new Set(seen).size).toBe(3)
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(JSON.stringify(await desk.drawn())).toContain('WARNING:')
  await desk.unmount()
  for (const [command, word] of [['smokear', 'تحذير:'], ['smokehe', 'אזהרה:']] as const) {
    await $.command.run({ command, args: '', origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 80 } })
    const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
    expect(await ui.find({ type: 'Text', text: word })).toBeDefined()
    await ui.unmount()
  }
})

test('every finished cigarette leaves a butt in the day’s ashtray, kept across sessions', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on, { day: { key: '2026-10-11', butts: ['joint'], puffs: 7 } })
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', () => ({ value: undefined }) as never)
  on('session.usage', () => ({ value: { startedAt: 0, context: { window: 200000 }, rateLimits: [] } }) as never)
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  on('turn.complete', ($, e) => ({ ...e }) as never)
  on('ui.toast', () => ({ value: undefined }) as never)
  await $.session.start({ cwd: '/tmp', surface: 'desktop', isInteractive: true })

  const before = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(JSON.stringify(await before.drawn())).toContain('data-butts=\\"1\\"')
  await before.unmount()

  for (let i = 0; i < 20; i++) {
    await $.prompt.submit({ text: `m ${i}`, wait: false, origin: { kind: 'composer' } })
    await $.turn.complete(complete as never)
  }
  const card = await $.ui.mount({ ...BAND, surface: 'desktop' })
  const drawn = JSON.stringify(await card.drawn())
  expect(drawn).toContain('data-butts=\\"2\\"')
  expect(drawn).toContain('TODAY  ·  2 BUTTS  ·  27 PUFFS')
  expect(drawn).toContain('/plugin install chat-cigarette --marketplace Kareem1809/chat-cigarette')
  expect(await card.find({ type: 'Text', text: '/plugin install chat-cigarette' })).toBeDefined()
  await card.unmount()
})

test('a new day starts with an empty ashtray', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on, { day: { key: '2026-10-10', butts: ['cigarette', 'cigarette'], puffs: 40 } })
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', () => ({ value: undefined }) as never)
  on('session.usage', () => ({ value: { startedAt: 0, context: { window: 200000 }, rateLimits: [] } }) as never)
  await $.session.start({ cwd: '/tmp', surface: 'desktop', isInteractive: true })
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(JSON.stringify(await ui.drawn())).toContain('data-butts=\\"0\\"')
  await ui.unmount()
})

test('late in the joint Claude signs off chill; the cigarette never does', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on)
  const contexts: string[] = []
  on('prompt.submit', ($, e) => {
    contexts.push((e.context ?? []).join(' '))
    return { text: e.text, context: e.context }
  })
  await $.command.run({ command: 'smoke', args: 'joint', origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 80 } })
  for (let i = 0; i < 20; i++) await $.prompt.submit({ text: `m ${i}`, wait: false, origin: { kind: 'composer' } })
  expect(contexts[12]).toBe('')
  expect(contexts[13]).toContain('laid-back sign-off')
  expect(contexts[13]).toContain('same precision')
  expect(contexts[18]).toContain('laid-back sign-off')
  expect(contexts[19]).toContain("It's time to get some rest")
  expect(contexts[19]).not.toContain('laid-back')
})

test('the cigarette never asks Claude to chill', async ($, on) => {
  mock.clock(on, { now: NOON })
  const contexts: string[] = []
  on('prompt.submit', ($, e) => {
    contexts.push((e.context ?? []).join(' '))
    return { text: e.text, context: e.context }
  })
  for (let i = 0; i < 19; i++) await $.prompt.submit({ text: `m ${i}`, wait: false, origin: { kind: 'composer' } })
  expect(contexts.every(c => c === '')).toBe(true)
})

test('out of smokes: the row says when the new pack comes, then a toast says it came', async ($, on) => {
  const clock = mock.clock(on, { now: NOON })
  const toasts: string[] = []
  on('ui.toast', ($, e) => {
    toasts.push(e.text)
    return { value: undefined } as never
  })
  on('session.measure', ($, e) => ({ changed: e.changed }))
  await $.session.measure({
    context: { window: 200000 },
    rateLimits: [{ kind: 'five_hour', percentUsed: 100, resetsAt: new Date(NOON + 100 * 60000).toISOString() }],
    changed: ['rateLimits'],
  })
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: 'Out of smokes — new pack in 1h 40m' })).toBeDefined()
  await ui.unmount()

  await clock.advance(100 * 60000)
  expect(toasts.some(t => t.includes('New pack’s here'))).toBe(true)
  const after = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await after.find({ type: 'Text', text: 'New pack’s here' })).toBeDefined()
  await after.unmount()
})

test('the context window gets its own meter, with a /clear hint near the top', async ($, on) => {
  mock.clock(on, { now: NOON })
  on('session.measure', ($, e) => ({ changed: e.changed }))
  await $.session.measure({
    context: { tokens: 170000, window: 200000, percent: 85 },
    rateLimits: [],
    changed: ['context'],
  })
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    expect(await ui.find({ type: 'Text', text: 'Context · 170k of 200k · time to /clear soon' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '85%' })).toBeDefined()
    await ui.unmount()
  }
})

test('after midnight the lines roast you, with the time', async ($, on) => {
  mock.clock(on, { now: at(2, 14) })
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  const lines = new Set<string>()
  for (let i = 0; i < 6; i++) {
    await $.prompt.submit({ text: `m ${i}`, wait: false, origin: { kind: 'composer' } })
    const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
    const all = await ui.findAll({ type: 'Text' })
    for (const t of all) if (t.text && /2:14am|owls|lighter is yawning|after 1am|Tomorrow-you/.test(t.text)) lines.add(t.text)
    await ui.unmount()
  }
  expect(lines.size).toBeGreaterThan(2)
})

test('around 4am a new cigarette will not light, and the message still goes through', async ($, on) => {
  mock.clock(on, { now: at(4, 30) })
  const sent: string[] = []
  on('prompt.submit', ($, e) => {
    sent.push(e.text)
    return { text: e.text, context: e.context }
  })
  await $.prompt.submit({ text: 'fix the bug', wait: false, origin: { kind: 'composer' } })
  expect(sent).toEqual(['fix the bug'])
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: '0/20' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /4:30am\. The lighter refuses/ })).toBeDefined()
  await ui.unmount()
})

test('all thirty warnings live in the drawing and cycle by themselves; a still image shows one', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on)
  mock.env(on, {})
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', () => ({ value: undefined }) as never)
  on('session.usage', () => ({ value: { startedAt: 0, context: { window: 200000 }, rateLimits: [] } }) as never)
  await $.session.start({ cwd: '/tmp', surface: 'desktop', isInteractive: true })
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  const source = svgSource(await ui.drawn())
  expect(source.split('WARNING:').length - 1).toBe(30)
  expect(source).toContain('attributeName="opacity" dur="150s"')
  await ui.unmount()
})

test('on Windows the warning strip shows a single warning', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on)
  mock.env(on, { OS: 'Windows_NT' })
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', () => ({ value: undefined }) as never)
  on('session.usage', () => ({ value: { startedAt: 0, context: { window: 200000 }, rateLimits: [] } }) as never)
  await $.session.start({ cwd: '/tmp', surface: 'desktop', isInteractive: true })
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(svgSource(await ui.drawn()).split('WARNING:').length - 1).toBe(1)
  await ui.unmount()
})

test('every puff adds ash to the ashtray at the end', async ($, on) => {
  mock.clock(on, { now: NOON })
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  const ash: number[] = []
  for (let i = 0; i < 4; i++) {
    await $.prompt.submit({ text: `m ${i}`, wait: false, origin: { kind: 'composer' } })
    const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
    ash.push(Number(/data-ash=\\"([0-9.]+)\\"/.exec(JSON.stringify(await ui.drawn()))?.[1]))
    await ui.unmount()
  }
  expect(ash).toEqual([0.05, 0.1, 0.15, 0.2])
})

test('the terminal band is a tidy framed card with the warning sign', async ($, on) => {
  mock.clock(on, { now: NOON })
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  await $.prompt.submit({ text: 'hi', wait: false, origin: { kind: 'composer' } })
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  const drawn = await ui.drawn()
  expect(drawn).toMatchObject({ type: 'Box', props: { borderStyle: 'round' } })
  expect(await ui.find({ type: 'Text', text: '⚠' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'WARNING:' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'CHAT CIGARETTE' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '1/20 puffs' })).toBeDefined()
  await ui.unmount()
})

test('the joint tip says RAW, in the drawing and in the terminal', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on)
  await $.command.run({ command: 'smoke', args: 'joint', origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 80 } })
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(svgSource(await desk.drawn())).toContain('>RAW</text>')
  await desk.unmount()
  const term = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await term.find({ type: 'Text', text: 'RAW' })).toBeDefined()
  await term.unmount()
})

test('after the rest, the next message lights a fresh one from the pack; the butt stays', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on)
  const toasts: string[] = []
  on('ui.toast', ($, e) => {
    toasts.push(e.text)
    return { value: undefined } as never
  })
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  on('turn.complete', ($, e) => ({ ...e }) as never)
  for (let i = 0; i < 20; i++) {
    await $.prompt.submit({ text: `m ${i}`, wait: false, origin: { kind: 'composer' } })
    await $.turn.complete(complete as never)
  }
  await $.prompt.submit({ text: 'one more', wait: false, origin: { kind: 'composer' } })
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: '1/20 puffs' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '📦 Fresh one from the pack — #2 today' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '×1' })).toBeDefined()
  await ui.unmount()
  expect(toasts).toContain('📦 Fresh one from the pack — #2 today')
})

test('a joint gets rolled fresh, not pulled from a pack', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on)
  on('ui.toast', () => ({ value: undefined }) as never)
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  on('turn.complete', ($, e) => ({ ...e }) as never)
  await $.command.run({ command: 'smoke', args: 'joint', origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 80 } })
  for (let i = 0; i < 20; i++) {
    await $.prompt.submit({ text: `m ${i}`, wait: false, origin: { kind: 'composer' } })
    await $.turn.complete(complete as never)
  }
  await $.prompt.submit({ text: 'again', wait: false, origin: { kind: 'composer' } })
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: '🌿 Rolled a fresh one — #2 today' })).toBeDefined()
  await ui.unmount()
})

test('no fresh one while Claude is still saying goodnight', async ($, on) => {
  mock.clock(on, { now: NOON })
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  for (let i = 0; i < 21; i++) await $.prompt.submit({ text: `m ${i}`, wait: false, origin: { kind: 'composer' } })
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: '20/20 puffs' })).toBeDefined()
  await ui.unmount()
})

test('the ashtray always shows how many butts are in it', async ($, on) => {
  mock.clock(on, { now: NOON })
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(svgSource(await ui.drawn())).toContain('data-count="0"')
  await ui.unmount()
})

test('the first puff plays the lighting (cigarette) or rolling (joint) animation, once', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on)
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  await $.prompt.submit({ text: 'a', wait: false, origin: { kind: 'composer' } })
  let ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(svgSource(await ui.drawn())).toContain('data-intro="light"')
  await ui.unmount()
  await $.prompt.submit({ text: 'b', wait: false, origin: { kind: 'composer' } })
  ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(svgSource(await ui.drawn())).not.toContain('data-intro')
  await ui.unmount()
})

test('a joint rolls on its first puff', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on)
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  await $.command.run({ command: 'smoke', args: 'joint', origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 80 } })
  await $.prompt.submit({ text: 'a', wait: false, origin: { kind: 'composer' } })
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(svgSource(await ui.drawn())).toContain('data-intro="roll"')
  await ui.unmount()
})

test('when it burns out, the butt gets stubbed out in the ashtray', async ($, on) => {
  mock.clock(on, { now: NOON })
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  for (let i = 0; i < 20; i++) await $.prompt.submit({ text: `m ${i}`, wait: false, origin: { kind: 'composer' } })
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  const src = svgSource(await ui.drawn())
  expect(src).toContain('data-stub="1"')
  expect(src).toContain('data-count="1"')
  await ui.unmount()
})

test('a joint picked with the old /smoke (before 0.4) is still remembered', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on, { style: 'joint' })
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', () => ({ value: undefined }) as never)
  on('session.usage', () => ({ value: { startedAt: 0, context: { window: 200000 }, rateLimits: [] } }) as never)
  await $.session.start({ cwd: '/tmp', surface: 'terminal', isInteractive: true })
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: 'CHAT JOINT' })).toBeDefined()
  await ui.unmount()
})

test('the terminal band fits its rows; the desktop drawing keeps its natural size', async ($, on) => {
  mock.clock(on, { now: NOON })
  on('session.measure', ($, e) => ({ changed: e.changed }))
  await $.session.measure({
    context: { tokens: 46000, window: 200000, percent: 23 },
    rateLimits: [{ kind: 'five_hour', percentUsed: 42 }],
    changed: ['rateLimits', 'context'],
  })
  for (const maxRows of [6, 9, 30]) {
    const props = { ...BAND.props, maxRows, scroll: { offset: 0, bodyRows: maxRows - 1 } }
    const term = await $.ui.mount({ ...BAND, surface: 'terminal', props })
    const box = (await term.drawn()) as unknown as { children: unknown[] }
    expect(box.children.length + 2).toBeLessThanOrEqual(Math.max(4, maxRows))
    await term.unmount()

    // بالديسكتوب الرسمة بحجمها الطبيعي — بلا width/height (تصغيرها خرّب الشكل بالماك).
    const desk = await $.ui.mount({ ...BAND, surface: 'desktop', props })
    const tree = (await desk.drawn()) as unknown as { children: { type: string; props: { height?: number } }[] }
    expect(tree.children.find(c => c.type === 'Svg')?.props.height).toBeUndefined()
    await desk.unmount()
  }
})

test('the chill sign-off line changes every puff (from a pool of 30, in all three languages)', async ($, on) => {
  mock.clock(on, { now: NOON })
  mock.store(on)
  const contexts: string[] = []
  on('prompt.submit', ($, e) => {
    contexts.push((e.context ?? []).join(' '))
    return { text: e.text, context: e.context }
  })
  await $.command.run({ command: 'smoke', args: 'joint', origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 80 } })
  for (let i = 0; i < 19; i++) await $.prompt.submit({ text: `m ${i}`, wait: false, origin: { kind: 'composer' } })
  const chill = contexts.slice(13, 19)
  expect(new Set(chill).size).toBe(6)
  for (const c of chill) {
    expect(c).toContain('EN «')
    expect(c).toContain('AR «')
    expect(c).toContain('HE «')
  }
})

test('there are a hundred status lines per language, so they rarely repeat', async ($, on) => {
  mock.clock(on, { now: NOON })
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  const seen = new Set<string>()
  for (let i = 0; i < 19; i++) {
    await $.prompt.submit({ text: `m ${i}`, wait: false, origin: { kind: 'composer' } })
    const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
    const texts = await ui.findAll({ type: 'Text' })
    const line = texts.map(t => t.text).find(t => /^\p{Extended_Pictographic}/u.test(t ?? '') && !/⚠|WARNING/.test(t ?? ''))
    if (line) seen.add(line)
    await ui.unmount()
  }
  expect(seen.size).toBeGreaterThanOrEqual(18)
})
