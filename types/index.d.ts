// شو هاد؟ عقد الحالة تبع المود: كم نَفَس انشرب، وهل انقال «روح ارتاح».
export type Smoke = { puffs: number; isRested: boolean }

// شو هاد؟ آخر قراءة لحد الاستهلاك (نافذة الـ5 ساعات) — null قبل أول قراءة.
export type Limit = { percent: number; resetsAt?: string } | null

declare module 'claude-code' {
  interface PluginState {
    'chat-cigarette': { smoke: Smoke; limit: Limit }
  }
}
