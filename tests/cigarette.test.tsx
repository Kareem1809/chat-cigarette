import { expect, mock, test } from 'claude-code/testing'

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
  mock.clock(on)
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  for (let i = 0; i < 3; i++) {
    await $.prompt.submit({ text: `hi ${i}`, wait: false, origin: { kind: 'composer' } })
  }
  const term = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await term.find({ type: 'Text', text: '3/20' })).toBeDefined()
  expect(await term.find({ type: 'Text', text: /Good chat so far/ })).toBeDefined()
  await term.unmount()

  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(JSON.stringify(await desk.drawn())).toContain('3 / 20 PUFFS')
  await desk.unmount()
})

test('a notification is not a puff', async ($, on) => {
  mock.clock(on)
  on('prompt.submit', ($, e) => ({ text: e.text, context: e.context }))
  await $.prompt.submit({ text: 'done', wait: false, origin: { kind: 'plugin', name: 'x' } } as never)
  const term = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await term.find({ type: 'Text', text: '0/20' })).toBeDefined()
  await term.unmount()
})

test('the last puff asks Claude to say it is time to rest, and the band burns out', async ($, on) => {
  mock.clock(on)
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
  mock.clock(on)
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
  mock.clock(on)
  mock.store(on, { kind: 'joint' })
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', () => ({ value: undefined }) as never)
  await $.session.start({ cwd: '/tmp', surface: 'terminal', isInteractive: true })
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /Joint lit/ })).toBeDefined()
  await ui.unmount()
})

test('the 5-hour limit is a tidy English row, outside the drawing', async ($, on) => {
  mock.clock(on)
  on('session.measure', ($, e) => ({ changed: e.changed }))
  await $.session.measure({
    context: { window: 200000 },
    rateLimits: [{ kind: 'five_hour', percentUsed: 42, resetsAt: new Date(8_100_000).toISOString() }],
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
  mock.clock(on)
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
    mock.clock(on)
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
  mock.clock(on)
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
  mock.clock(on)
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
  mock.clock(on)
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
