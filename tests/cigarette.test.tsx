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
  expect(await term.find({ type: 'Text', text: /استمتع بالحكي/ })).toBeDefined()
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
    expect(await ui.find({ type: 'Text', text: /خلصت السيجارة/ })).toBeDefined()
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
    expect(await ui.find({ type: 'Text', text: /الجوينت/ })).toBeDefined()
    await ui.unmount()
  }
  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(JSON.stringify(await desk.drawn())).toContain('CHAT JOINT')
  await desk.unmount()

  expect((await $.command.run(SMOKE(''))).text).toContain('cigarette')
})

test('a joint picked last time comes back in the next session', async ($, on) => {
  mock.clock(on)
  mock.store(on, { style: 'joint' })
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', () => ({ value: undefined }) as never)
  await $.session.start({ cwd: '/tmp', surface: 'terminal', isInteractive: true })
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /الجوينت/ })).toBeDefined()
  await ui.unmount()
})

test('the 5-hour limit is a bar with no words', async ($, on) => {
  mock.clock(on)
  on('session.measure', ($, e) => ({ changed: e.changed }))
  await $.session.measure({
    context: { window: 200000 },
    rateLimits: [{ kind: 'five_hour', percentUsed: 42 }],
    changed: ['rateLimits'],
  })
  const term = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await term.find({ type: 'Text', text: '▰▰▰▰' }))).toBeDefined()
  expect(await term.find({ type: 'Text', text: /%|حدّ/ })).toBeUndefined()
  await term.unmount()

  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await desk.find({ type: 'Text', text: /%|حدّ/ })).toBeUndefined()
  expect(JSON.stringify(await desk.drawn())).toContain('5-hour limit: 42%')
  await desk.unmount()
})
