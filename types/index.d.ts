// شو هاد؟ عقد الحالة تبع المود. كله محلي: حالة الجلسة ($.state) ومخزن البلجن ($.store).

// المنفضة: يوم (بيبلّش الساعة 5 الصبح) فيه كل عقب خلص، وكم نَفَس انشرب.
export type Day = { key: string; butts: Style[]; puffs: number }

// السيجارة الحالية + منفضة اليوم بنفس المكان، عشان كل نَفَس = تحديث واحد (رسمة وحدة).
// unsynced = اللي لسا ما انكتب بمخزن اليوم (بينكتب لما يخلص الدور، مش وإنت عم تبعت).
export type Smoke = {
  puffs: number
  isRested: boolean
  day?: Day
  unsynced?: { puffs: number; butts: Style[] }
}

// حدّ الـ5 ساعات: آخر قراءة. isFresh = الوقت تبعه خلص وإجا «باكيت جديد» قبل القراءة الجاية.
export type Limit = { percent: number; resetsAt?: string; isFresh?: boolean } | null

// الكونتكست: قديش امتلت نافذة المحادثة — null قبل أول رد.
export type Context = { percent: number; tokens: number; window: number } | null

// شو عم تدخّن: سيجارة ولا جوينت (/smoke).
export type Style = 'cigarette' | 'joint'

// لغة الكتابة: إنجليزي (الافتراضي)، عربي أو عبري (/smokeen · /smokear · /smokehe).
export type Lang = 'en' | 'ar' | 'he'

declare module 'claude-code' {
  interface PluginState {
    'chat-cigarette': {
      smoke: Smoke
      limit: Limit
      context: Context
      style: Style
      lang: Lang
    }
  }
}
