// شو هاد؟ عقد الحالة تبع المود: كم نَفَس انشرب، وهل انقال «روح ارتاح».
export type Smoke = { puffs: number; isRested: boolean }

// شو هاد؟ آخر قراءة لحد الاستهلاك (نافذة الـ5 ساعات) — null قبل أول قراءة.
export type Limit = { percent: number; resetsAt?: string } | null

// شو هاد؟ شو عم تدخّن: سيجارة ولا جوينت (بيتبدّل بـ /smoke وبينحفظ بين الجلسات).
export type Style = 'cigarette' | 'joint'

// شو هاد؟ لغة الكتابة: إنجليزي (الافتراضي)، عربي أو عبري (/smokeen · /smokear · /smokehe).
export type Lang = 'en' | 'ar' | 'he'

declare module 'claude-code' {
  interface PluginState {
    'chat-cigarette': { smoke: Smoke; limit: Limit; style: Style; lang: Lang }
  }
}
