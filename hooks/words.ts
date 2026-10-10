// شو هاد؟ كل الكلام اللي بيطلع عالشاشة — بالإنجليزي والعربي والعبري — والحساب الصغير حوله
// (الساعة، اليوم، الأوقات). ليش لحاله؟ عشان أي نكتة جديدة تنزاد بمكان واحد وبالتلات لغات سوا.
import type { Lang, Style } from '../types'

// كم نَفَس بالسيجارة = كم رسالة منك قبل ما تخلص. غيّر الرقم إذا بدك.
export const PUFFS = 20

// من أي نَفَس الجوينت بيروق وكلود بيختم كل رد بسطر رايق.
export const CHILL_FROM = 14

// كريم (11/10): 🍁 بدل 🌙 — بكل مكان، ولا قمر بأي جملة جديدة.
export const REST_LINE = "It's time to get some rest 🍁"

export const INSTALL = '/plugin install chat-cigarette --marketplace Kareem1809/chat-cigarette'

// ───────────── الوقت ─────────────

// اليوم بيبلّش الساعة 5 الصبح: سهرة لـ3 بالليل بتنحسب عاليوم اللي قبل.
export function dayKey(now: number): string {
  const d = new Date(now - 5 * 3_600_000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// late = من 12 لـ4 بالليل (الجمل بتمسخر عليك) · dawn = من 4 لـ5 (القدّاحة رافضة تولّع).
export function nightPhase(now: number): 'day' | 'late' | 'dawn' {
  const h = new Date(now).getHours()
  return h < 4 ? 'late' : h < 5 ? 'dawn' : 'day'
}

function clockText(now: number, ln: Lang): string {
  const d = new Date(now)
  const h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  if (ln === 'en') return `${h % 12 === 0 ? 12 : h % 12}:${m}${h < 12 ? 'am' : 'pm'}`
  return `${h}:${m}`
}

// «1h 40m» / «1س 40د» / «1 ש׳ 40 ד׳».
export function duration(ms: number, ln: Lang): string {
  const mins = Math.max(0, Math.round(ms / 60000))
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (ln === 'ar') return `${h}س ${m}د`
  if (ln === 'he') return `${h} ש׳ ${m} ד׳`
  return `${h}h ${m}m`
}

// ───────────── الجمل تحت الرسمة ─────────────

type Lines = { early: readonly string[]; mid: readonly string[]; late: readonly string[] }

// 50 جملة بكل لغة (17 أول التلت · 17 النص · 16 الآخر). كل نَفَس بياخد جملة غير اللي قبلها،
// وكل سيجارة بتبلّش من مكان غير اللي قبلها (seed) — عشان الواحد ما يزهق.
const LINES: Record<Lang, Lines> = {
  en: {
    early: [
      '☕ Just getting started — enjoy the chat',
      '🌤️ Plenty left — take it easy',
      '🎧 Nice and slow — no rush',
      '💬 Good chat so far — keep it light',
      '🪟 Glance out the window — your eyes will thank you',
      '💧 Sip some water between puffs',
      '🪑 Sit up straight — your back has been asking politely',
      '🌱 Fresh start, fresh code',
      '🎶 Put on something nice and keep going',
      '🙂 You’re doing fine. Really.',
      '🐢 Slow puffs, clean commits',
      '🌞 Daylight exists. Just saying.',
      '📝 Small steps beat big rewrites',
      '🍵 A tea break counts as productivity',
      '🤝 Pair programming with a smoke. Classic.',
      '🧃 Drink something, the code will wait',
      '🔋 Battery’s full — how about yours?',
    ],
    mid: [
      '🌬️ Grab some real fresh air too',
      '🧘 Roll your shoulders, unclench your jaw',
      '⏳ Halfway down — a break is coming up',
      '👀 Look at something far away for 20 seconds',
      '🚶 Stretch your legs after this one',
      '🍃 Slow down — the screen isn’t going anywhere',
      '🖐️ Shake out your hands — they type a lot',
      '😮‍💨 Exhale. The bug isn’t going anywhere either.',
      '🧠 Your brain needs memory too — give it five',
      '🪴 Water the plant. Then yourself.',
      '📵 Check on a human, not a notification',
      '🕰️ When did you last stand up? Exactly.',
      '🫖 Kettle on? Good idea.',
      '🎯 Finish this thought, then breathe',
      '🙆 Neck rolls are free',
      '🌇 The sun is doing something nice outside',
      '💭 Step away for a minute — the answer often walks in',
    ],
    late: [
      '🕯️ Last few puffs — get ready to rest',
      '🍁 Wrapping up soon — save your work',
      '🔥 Almost down to the end',
      '📌 Note where you stopped — pick it up tomorrow',
      '🛏️ Your bed misses you',
      '⌛ Just a couple left',
      '💾 Commit, push, go',
      '🚪 The door is right there',
      '🧺 The ashtray’s filling up — so is your day',
      '🏁 Last lap',
      '🧯 Put it out gracefully',
      '👋 Say bye to the terminal',
      '🌆 Golden hour for logging off',
      '📴 Screens off soon. You’ve earned it.',
      '🛋️ The couch called. It feels lonely.',
      '🌌 One more puff and you’re free',
    ],
  },
  ar: {
    early: [
      '☕ لسا بالأول… استمتع بالحكي',
      '🌤️ لسا في كتير — خدها عالهدا',
      '🎧 عالمهل، ما في إشي مستعجل',
      '💬 حكي حلو لهلّق — خلّيه خفيف',
      '🪟 طلّة عالشباك؟ عيونك رح تشكرك',
      '💧 اشرب شوية مي بين النَّفَس والتاني',
      '🪑 اقعد منيح — ظهرك عم يطلب بأدب',
      '🌱 بداية جديدة، كود جديد',
      '🎶 حط إشي حلو تسمعه وكمّل',
      '🙂 ماشي منيح. جد.',
      '🐢 نَفَس بطيء، كوميت نضيف',
      '🌞 في شمس برّا. بس بحكيلك.',
      '📝 خطوات صغيرة أحسن من إعادة كتابة كبيرة',
      '🍵 استراحة الشاي بتنحسب شغل',
      '🤝 برمجة بالأزواج مع الدخان. كلاسيك.',
      '🧃 اشرب إشي، الكود بيستنّى',
      '🔋 البطارية مليانة — وإنت؟',
    ],
    mid: [
      '🌬️ خد كمان نفس هوا حقيقي',
      '🧘 حرّك كتافك وريّح فكّك',
      '⏳ وصلنا للنص — الاستراحة قرّبت',
      '👀 طلّع على إشي بعيد 20 ثانية',
      '🚶 قوم مدّ إجريك بعد هاي',
      '🍃 عالهدا — الشاشة مش رايحة لمحل',
      '🖐️ نفّض إيديك — كتير عم يكتبوا',
      '😮‍💨 زفير… والبقّ كمان مش رايح لمحل',
      '🧠 مخّك بدو ذاكرة كمان — ريّحه خمس دقايق',
      '🪴 اسقي الزريعة. وبعدين اسقي حالك.',
      '📵 اطمّن على إنسان، مش على إشعار',
      '🕰️ إمتى آخر مرة وقفت؟ بالزبط.',
      '🫖 تحط إبريق؟ فكرة منيحة.',
      '🎯 خلّص هالفكرة، وبعدين تنفّس',
      '🙆 تدوير الرقبة ببلاش',
      '🌇 الشمس عم تعمل إشي حلو برّا',
      '💭 ابعد دقيقة — كتير مرات الحل بيجي لحاله',
    ],
    late: [
      '🕯️ آخر كم نَفَس — جهّز حالك ترتاح',
      '🍁 قرّبنا نخلص — احفظ شغلك',
      '🔥 قرّبنا للآخر',
      '📌 سجّل وين وقفت — بتكمّل بكرا',
      '🛏️ تختك مشتاقلك',
      '⌛ ضايل كم نَفَس بس',
      '💾 كوميت، بوش، وروّح',
      '🚪 الباب هناك',
      '🧺 المكتة عم تتعبّى — ويومك كمان',
      '🏁 آخر لفّة',
      '🧯 طفّيها بكرامة',
      '👋 قول باي للتيرمنال',
      '🌆 أحلى وقت تسكّر فيه',
      '📴 قرّبنا نطفي الشاشات. بتستاهل.',
      '🛋️ الكنباية اتصلت. حاسّة حالها وحيدة.',
      '🌌 نَفَس كمان وبتصير حرّ',
    ],
  },
  he: {
    early: [
      '☕ רק התחלנו — תהנה מהשיחה',
      '🌤️ נשאר עוד הרבה — קח את זה בקלות',
      '🎧 לאט ובנחת — אין לחץ',
      '💬 שיחה טובה עד עכשיו — תשמור על זה קליל',
      '🪟 תציץ רגע מהחלון — העיניים יודו לך',
      '💧 תשתה קצת מים בין שאכטה לשאכטה',
      '🪑 שב ישר — הגב שלך מבקש יפה',
      '🌱 התחלה חדשה, קוד חדש',
      '🎶 שים משהו טוב ברקע ותמשיך',
      '🙂 אתה בסדר. באמת.',
      '🐢 שאכטות איטיות, קומיטים נקיים',
      '🌞 יש שמש בחוץ. רק אומר.',
      '📝 צעדים קטנים עדיפים על שכתוב גדול',
      '🍵 הפסקת תה נחשבת פרודוקטיביות',
      '🤝 פיר פרוגרמינג עם שאכטה. קלאסיקה.',
      '🧃 תשתה משהו, הקוד יחכה',
      '🔋 הסוללה מלאה — ושלך?',
    ],
    mid: [
      '🌬️ תנשום גם קצת אוויר אמיתי',
      '🧘 תזיז את הכתפיים, תשחרר את הלסת',
      '⏳ הגענו לחצי — ההפסקה מתקרבת',
      '👀 תסתכל על משהו רחוק 20 שניות',
      '🚶 קום תמתח את הרגליים אחרי זה',
      '🍃 לאט לאט — המסך לא בורח לשום מקום',
      '🖐️ תנער את הידיים — הן מקלידות הרבה',
      '😮‍💨 נשיפה. גם הבאג לא הולך לשום מקום.',
      '🧠 גם למוח צריך זיכרון — תן לו חמש דקות',
      '🪴 תשקה את העציץ. ואז את עצמך.',
      '📵 תבדוק מה שלום בן אדם, לא התראה',
      '🕰️ מתי קמת בפעם האחרונה? בדיוק.',
      '🫖 להרתיח מים? רעיון טוב.',
      '🎯 תסיים את המחשבה הזאת, ואז תנשום',
      '🙆 סיבובי צוואר זה בחינם',
      '🌇 השמש עושה משהו יפה בחוץ',
      '💭 תתרחק לדקה — הרבה פעמים הפתרון מגיע לבד',
    ],
    late: [
      '🕯️ עוד כמה שאכטות — תתכונן לנוח',
      '🍁 עוד מעט מסיימים — תשמור את העבודה',
      '🔥 כמעט הגענו לסוף',
      '📌 תרשום איפה עצרת — תמשיך מחר',
      '🛏️ המיטה מתגעגעת אליך',
      '⌛ נשארו רק עוד כמה',
      '💾 קומיט, פוש, הביתה',
      '🚪 הדלת שם',
      '🧺 המאפרה מתמלאת — וגם היום שלך',
      '🏁 הקפה אחרונה',
      '🧯 תכבה בכבוד',
      '👋 תגיד ביי לטרמינל',
      '🌆 השעה הכי יפה לסגור את המחשב',
      '📴 עוד מעט מכבים מסכים. מגיע לך.',
      '🛋️ הספה התקשרה. היא מרגישה בודדה.',
      '🌌 עוד שאכטה ואתה חופשי',
    ],
  },
}


// دفعة تانية: 50 جملة كمان بكل لغة (المجموع 100) — عشان ما تشوف نفس الجملة مليون مرة (كريم).
const MORE_LINES: Record<Lang, Lines> = {
  en: {
    early: [
      '🍪 A snack break counts too',
      '🌿 Inhale ideas, exhale bugs',
      '🧩 One problem at a time',
      '📻 Music in the back, focus in the front',
      '🖊️ Write it down before it slips away',
      '🫶 Be nice to tomorrow-you',
      '🌅 Early puffs, clear head',
      '🧭 Know where you’re going before you push',
      '🧁 Small wins taste better',
      '🪴 Let the code grow slowly',
      '🎈 Keep it light, keep it working',
      '🧘 Calm commits only',
      '📚 Read the error message. All of it.',
      '🔍 Zoom out for a second',
      '🗂️ Tidy tabs, tidy mind',
      '☁️ No rush, the cloud will wait',
      '🐣 Fresh start — break nothing',
    ],
    mid: [
      '🚰 Refill your water bottle',
      '🦶 Wiggle your toes. Seriously.',
      '🌳 There are trees outside. Allegedly.',
      '🧃 Juice break? Juice break.',
      '🤸 Stand up, stretch, sit back down smarter',
      '🫁 Three slow breaths. Go.',
      '🪟 Open a window, let the bugs out',
      '🐈 Even cats take breaks between naps',
      '💡 Walk away — the fix meets you in the hallway',
      '🧊 Cool down before git push --force',
      '🕺 Dance for ten seconds. Nobody’s watching.',
      '🍎 Eat something that isn’t coffee',
      '🎮 Not now. Later. Maybe.',
      '📞 Call your mom',
      '🧹 Close the tabs you’ll never read',
      '⌚ Your back filed a complaint',
      '🛁 Shower thoughts fix bugs for free',
    ],
    late: [
      '🏠 Home time is a feature, not a bug',
      '🔕 Do Not Disturb: you, soon',
      '🫡 Good work today. Really.',
      '🧾 Write tomorrow’s first task now',
      '🌆 The day is almost out of puffs',
      '🧦 Socks off, laptop closed',
      '🍲 Dinner beats any deploy',
      '🛌 Bed > bugs',
      '🔋 Recharge yourself, not just the laptop',
      '🥱 That yawn was a pull request from your body',
      '📦 Ship it tomorrow, rested',
      '🗝️ Lock the screen, unlock your evening',
      '🎬 Roll the credits on today',
      '🌌 The stars are out. So should you be.',
      '🫖 Last tea, then lights out',
      '👟 Shoes on, screen off',
    ],
  },
  ar: {
    early: [
      '🍪 استراحة سناك بتنحسب كمان',
      '🌿 شهيق أفكار، زفير بقّ',
      '🧩 مشكلة وحدة بالمرة',
      '📻 موسيقى بالخلفية، تركيز بالواجهة',
      '🖊️ اكتبها قبل ما تطير من بالك',
      '🫶 كون منيح مع حالك تبع بكرا',
      '🌅 نَفَس الصبح، راس صافي',
      '🧭 اعرف لوين رايح قبل ما تعمل push',
      '🧁 الانتصارات الصغيرة طعمها أحلى',
      '🪴 خلّي الكود يكبر على مهله',
      '🎈 خلّيها خفيفة وخلّيها شغّالة',
      '🧘 بس كوميتات هادية',
      '📚 اقرا رسالة الخطأ. كلها.',
      '🔍 بعّد شوي وشوف الصورة كاملة',
      '🗂️ تابات مرتّبة، راس مرتّب',
      '☁️ ما في عجلة، السحابة بتستنّى',
      '🐣 بداية جديدة — لا تكسر إشي',
    ],
    mid: [
      '🚰 عبّي قنينة المي',
      '🦶 حرّك أصابيع إجريك. جد.',
      '🌳 في شجر برّا. على ذمّتهم.',
      '🧃 استراحة عصير؟ استراحة عصير.',
      '🤸 قوم، تمطّى، وارجع اقعد أذكى',
      '🫁 تلات أنفاس بطيئة. يلّا.',
      '🪟 افتح الشباك، خلّي البقّ يطلع',
      '🐈 حتى القطط بتريّح بين نومة ونومة',
      '💡 ابعد شوي — الحل بيلاقيك بالممر',
      '🧊 هدّي حالك قبل git push --force',
      '🕺 ارقص عشر ثواني. ما حدا شايفك.',
      '🍎 كول إشي مش قهوة',
      '🎮 مش هلّق. بعدين. يمكن.',
      '📞 اتصل بإمك',
      '🧹 سكّر التابات اللي عمرك ما رح تقراها',
      '⌚ ظهرك قدّم شكوى',
      '🛁 أفكار الدوش بتصلّح بقّ ببلاش',
    ],
    late: [
      '🏠 وقت البيت ميزة، مش بقّ',
      '🔕 ممنوع الإزعاج: إنت، قريباً',
      '🫡 شغل منيح اليوم. جد.',
      '🧾 اكتب أول مهمة لبكرا هلّق',
      '🌆 اليوم قرّب يخلص نَفَساته',
      '🧦 شلّح الكلسات، وسكّر اللابتوب',
      '🍲 العشا أحسن من أي نشر',
      '🛌 التخت أهم من البقّ',
      '🔋 اشحن حالك، مش بس اللابتوب',
      '🥱 هالتثاؤب طلب دمج من جسمك',
      '📦 انشرها بكرا وإنت مرتاح',
      '🗝️ اقفل الشاشة، وافتح سهرتك',
      '🎬 خلص الفيلم تبع اليوم',
      '🌌 النجوم طلعت. وإنت كمان اطلع.',
      '🫖 آخر كاسة شاي، وبعدين طفّي الضو',
      '👟 البس الكندرة، وطفّي الشاشة',
    ],
  },
  he: {
    early: [
      '🍪 גם הפסקת נשנוש נחשבת',
      '🌿 שואפים רעיונות, נושפים באגים',
      '🧩 בעיה אחת בכל פעם',
      '📻 מוזיקה ברקע, פוקוס בחזית',
      '🖊️ תרשום לפני שזה בורח',
      '🫶 תהיה נחמד לעצמך של מחר',
      '🌅 שאכטה של בוקר, ראש צלול',
      '🧭 תדע לאן אתה הולך לפני שאתה דוחף',
      '🧁 ניצחונות קטנים טעימים יותר',
      '🪴 תן לקוד לגדול לאט',
      '🎈 קליל ועובד',
      '🧘 רק קומיטים רגועים',
      '📚 תקרא את הודעת השגיאה. את כולה.',
      '🔍 תתרחק רגע ותראה את התמונה המלאה',
      '🗂️ טאבים מסודרים, ראש מסודר',
      '☁️ אין לחץ, הענן יחכה',
      '🐣 התחלה חדשה — אל תשבור כלום',
    ],
    mid: [
      '🚰 תמלא את בקבוק המים',
      '🦶 תזיז את אצבעות הרגליים. ברצינות.',
      '🌳 יש עצים בחוץ. ככה אומרים.',
      '🧃 הפסקת מיץ? הפסקת מיץ.',
      '🤸 קום, תתמתח, ותחזור חכם יותר',
      '🫁 שלוש נשימות איטיות. יאללה.',
      '🪟 תפתח חלון, תן לבאגים לצאת',
      '🐈 גם חתולים נחים בין תנומה לתנומה',
      '💡 תתרחק קצת — הפתרון יפגוש אותך במסדרון',
      '🧊 תירגע לפני git push --force',
      '🕺 תרקוד עשר שניות. אף אחד לא רואה.',
      '🍎 תאכל משהו שהוא לא קפה',
      '🎮 לא עכשיו. אחר כך. אולי.',
      '📞 תתקשר לאמא',
      '🧹 תסגור את הטאבים שלעולם לא תקרא',
      '⌚ הגב שלך הגיש תלונה',
      '🛁 מחשבות במקלחת פותרות באגים בחינם',
    ],
    late: [
      '🏠 זמן בית זה פיצ׳ר, לא באג',
      '🔕 נא לא להפריע: אתה, בקרוב',
      '🫡 עבודה טובה היום. באמת.',
      '🧾 תרשום עכשיו את המשימה הראשונה של מחר',
      '🌆 ליום כמעט נגמרו השאכטות',
      '🧦 גרביים למטה, מחשב סגור',
      '🍲 ארוחת ערב עדיפה על כל דיפלוי',
      '🛌 מיטה > באגים',
      '🔋 תטען את עצמך, לא רק את הלפטופ',
      '🥱 הפיהוק הזה הוא פול ריקווסט מהגוף שלך',
      '📦 תשחרר את זה מחר, נח',
      '🗝️ תנעל את המסך, תפתח את הערב',
      '🎬 כתוביות סיום להיום',
      '🌌 הכוכבים בחוץ. גם אתה צריך להיות.',
      '🫖 תה אחרון, ואז מכבים אור',
      '👟 נעליים על הרגליים, מסך כבוי',
    ],
  },
}

// بعد نص الليل الجمل بتمسخر عليك ({time} = الساعة هلّق).
const NIGHT: Record<Lang, readonly string[]> = {
  en: [
    '🍁 It’s {time}. Even your bugs went to sleep.',
    '🦉 Past midnight: only owls and on-call engineers are up',
    '😴 Even the lighter is yawning',
    '🕯️ Nothing good gets merged after 1am',
    '🛌 Your bed opened a ticket: user missing since {time}',
    '🌚 Tomorrow-you will review this code. Be kind to them.',
  ],
  ar: [
    '🍁 الساعة {time} يا صاحبي… حتى البقّ نام',
    '🦉 بعد نص الليل ما بيسهر غير البوم وصاحب المناوبة',
    '😴 حتى القدّاحة عم تتثاوب',
    '🕯️ ولا إشي منيح بيندمج بعد الساعة 1',
    '🛌 تختك فتح تيكت: المستخدم مفقود من الساعة {time}',
    '🌚 إنت تبع بكرا رح يراجع هالكود… ارحمه',
  ],
  he: [
    '🍁 השעה {time}, אחי. אפילו הבאגים הלכו לישון.',
    '🦉 אחרי חצות ערים רק ינשופים ותורנים',
    '😴 אפילו המצית מפהק',
    '🕯️ שום דבר טוב לא עולה למיין אחרי אחת בלילה',
    '🛌 המיטה שלך פתחה טיקט: משתמש נעדר מאז {time}',
    '🌚 אתה של מחר יעשה ריוויו לקוד הזה. תרחם עליו.',
  ],
}


// دفعة تانية لنكت الليل (المجموع 18 بكل لغة).
const MORE_NIGHT: Record<Lang, readonly string[]> = {
  en: [
    '🦇 Bats are up. Bats don’t code.',
    '🌃 The city is asleep. Your code can wait.',
    '☕ Coffee at {time} is a cry for help',
    '🧟 Night-coding zombie mode: on',
    '📉 Bug density rises after midnight. Science.',
    '🛏️ Your pillow pinged you. Status: urgent.',
    '🕰️ {time}. Nothing good ever started at {time}.',
    '👻 Even the ghosts went to bed',
    '🔦 Nobody writes clean code at {time}',
    '🫠 Your brain is at 3% battery',
    '🐓 The rooster will judge you',
    '🚪 The kitchen called: drink water and go to sleep',
  ],
  ar: [
    '🦇 الوطاويط صاحية. الوطاويط ما بتبرمج.',
    '🌃 البلد نايمة. والكود بيستنّى.',
    '☕ قهوة الساعة {time}؟ هاي استغاثة',
    '🧟 وضع زومبي البرمجة الليلية: شغّال',
    '📉 البقّ بيكتر بعد نص الليل. علم.',
    '🛏️ مخدّتك بعتتلك إشعار: مستعجل',
    '🕰️ الساعة {time}. ولا إشي منيح بلّش هالساعة.',
    '👻 حتى الأشباح راحت تنام',
    '🔦 ما حدا بيكتب كود نضيف الساعة {time}',
    '🫠 مخّك على 3% بطارية',
    '🐓 الديك رح يحاسبك',
    '🚪 المطبخ اتصل: اشرب مي وروح نام',
  ],
  he: [
    '🦇 העטלפים ערים. עטלפים לא כותבים קוד.',
    '🌃 העיר ישנה. הקוד יחכה.',
    '☕ קפה ב־{time}? זו קריאה לעזרה',
    '🧟 מצב זומבי של קוד לילי: פעיל',
    '📉 צפיפות הבאגים עולה אחרי חצות. מדע.',
    '🛏️ הכרית שלך שלחה התראה: דחוף',
    '🕰️ השעה {time}. שום דבר טוב לא התחיל בשעה כזאת.',
    '👻 אפילו הרוחות הלכו לישון',
    '🔦 אף אחד לא כותב קוד נקי ב־{time}',
    '🫠 למוח שלך נשארו 3% סוללה',
    '🐓 התרנגול ישפוט אותך',
    '🚪 המטבח התקשר: תשתה מים ותלך לישון',
  ],
}

// من 4 لـ5 الصبح سيجارة جديدة ما بتولّع (بالرسمة بس — شغلك ماشي عادي).
const DAWN: Record<Lang, string> = {
  en: '🪫 It’s {time}. The lighter refuses. Go to sleep.',
  ar: '🪫 الساعة {time} الصبح. القدّاحة رافضة تولّع. روح نام.',
  he: '🪫 השעה {time} לפנות בוקר. המצית מסרב. לך לישון.',
}

type Kind = {
  noun: string
  title: Record<Lang, string>
  lit: Record<Lang, string>
  out: Record<Lang, string>
}

export const KINDS: Record<Style, Kind> = {
  cigarette: {
    noun: 'cigarette',
    title: { en: 'CHAT CIGARETTE', ar: 'سيجارة المحادثة', he: 'סיגריית השיחה' },
    lit: {
      en: '🔥 Cigarette lit — every message is a puff',
      ar: '🔥 ولّعنا السيجارة — كل رسالة منك نَفَس',
      he: '🔥 הדלקנו סיגריה — כל הודעה היא שאכטה',
    },
    out: {
      en: '🍁 Cigarette burned out — close the screen and go rest',
      ar: '🍁 خلصت السيجارة… سكّر الشاشة وروح ارتاح',
      he: '🍁 הסיגריה נגמרה — תסגור את המסך ולך לנוח',
    },
  },
  joint: {
    noun: 'joint',
    title: { en: 'CHAT JOINT', ar: 'جوينت المحادثة', he: 'ג׳וינט השיחה' },
    lit: {
      en: '🔥 Joint lit — every message is a puff',
      ar: '🔥 ولّعنا الجوينت — كل رسالة منك نَفَس',
      he: '🔥 הדלקנו ג׳וינט — כל הודעה היא שאכטה',
    },
    out: {
      en: '🍁 Joint burned out — close the screen and go rest',
      ar: '🍁 خلص الجوينت… سكّر الشاشة وروح ارتاح',
      he: '🍁 הג׳וינט נגמר — תסגור את המסך ולך לנוח',
    },
  },
}

// رقم لكل سيجارة: من اليوم + كم عقب بالمنفضة. السيجارة الجاية بتبلّش من مكان تاني بالجمل والتحذيرات.
export function seedOf(dayKeyText: string, butts: number): number {
  let h = 0
  for (const c of dayKeyText) h = (h * 31 + c.charCodeAt(0)) % 9973
  return h + butts * 7
}

// بعد ما تخلص، الرسالة الجاية بتولّع وحدة جديدة من الباكيت (أو بتلفّ جوينت جديد) — مع رقمها اليوم.
const FRESH: Record<Style, Record<Lang, readonly string[]>> = {
  cigarette: {
    en: [
      '📦 Fresh one from the pack — #{n} today',
      '🚬 Another one lit — #{n} today',
      '🔥 Flick, flame, lit — #{n} today',
      '📦 The pack is getting lighter — #{n} today',
    ],
    ar: [
      '📦 سيجارة جديدة من الباكيت — رقم {n} اليوم',
      '🚬 ولّعنا وحدة كمان — رقم {n} اليوم',
      '🔥 طقّة، شعلة، ولعت — رقم {n} اليوم',
      '📦 الباكيت عم يخفّ — رقم {n} اليوم',
    ],
    he: [
      '📦 סיגריה חדשה מהחפיסה — מספר {n} היום',
      '🚬 הדלקנו עוד אחת — מספר {n} היום',
      '🔥 טיק, להבה, דולקת — מספר {n} היום',
      '📦 החפיסה מתרוקנת — מספר {n} היום',
    ],
  },
  joint: {
    en: [
      '🌿 Rolled a fresh one — #{n} today',
      '🌿 Licked, sealed, lit — #{n} today',
      '🌀 Fresh roll, same chill — #{n} today',
      '🌿 Another one rolled — #{n} today',
    ],
    ar: [
      '🌿 لفّينا جوينت جديد — رقم {n} اليوم',
      '🌿 لحسنا، سكّرنا، ولّعنا — رقم {n} اليوم',
      '🌀 لفّة جديدة، نفس الروقان — رقم {n} اليوم',
      '🌿 لفّينا كمان واحد — رقم {n} اليوم',
    ],
    he: [
      '🌿 גלגלנו ג׳וינט חדש — מספר {n} היום',
      '🌿 ליקקנו, סגרנו, הדלקנו — מספר {n} היום',
      '🌀 גלגול חדש, אותו צ׳יל — מספר {n} היום',
      '🌿 גלגלנו עוד אחד — מספר {n} היום',
    ],
  },
}

export function freshLine(kind: Style, ln: Lang, n: number): string {
  const pool = FRESH[kind][ln]
  return (pool[Math.max(0, n - 2) % pool.length] ?? '').replace('{n}', String(n))
}

// earlier = كم سيجارة خلصت اليوم قبل هاي.
export function tagline(kind: Style, ln: Lang, puffs: number, now: number, seed = 0, earlier = 0): string {
  if (puffs >= PUFFS) return KINDS[kind].out[ln]
  const phase = nightPhase(now)
  const time = clockText(now, ln)
  if (phase === 'dawn' && puffs === 0) return DAWN[ln].replace('{time}', time)
  if (puffs === 1 && earlier > 0) return freshLine(kind, ln, earlier + 1)
  if (phase !== 'day') {
    const night = [...NIGHT[ln], ...MORE_NIGHT[ln]]
    return (night[(puffs + seed) % night.length] ?? '').replace('{time}', time)
  }
  if (puffs === 0) return KINDS[kind].lit[ln]
  const f = puffs / PUFFS
  const stage = f < 1 / 3 ? 'early' : f < 2 / 3 ? 'mid' : 'late'
  const pool = [...LINES[ln][stage], ...MORE_LINES[ln][stage]]
  return pool[(puffs + seed) % pool.length] ?? ''
}

// ───────────── تحذيرات الباكيت (تقليد للتحذيرات الحقيقية) ─────────────

const WARN_PREFIX: Record<Lang, string> = { en: 'WARNING: ', ar: 'تحذير: ', he: 'אזהרה: ' }

const WARNINGS: Record<Lang, { all: readonly string[]; joint: readonly string[] }> = {
  en: {
    all: [
      'Claude Code causes severe addiction to deploying',
      'Vibe coding may cause merge conflicts in adults',
      'Every puff shortens your context window',
      'Your manager can smell this commit',
      'Secondhand code reviews harm your teammates',
      '“Just one more prompt” is how it starts',
      'Smoking near production is strictly prohibited',
      'May cause sudden urges to rewrite everything in Rust',
      'Causes 2am force-pushes to main',
      'No tests were harmed in the making of this code. None were written.',
    ],
    joint: ['Code written high must be reviewed sober', 'May cause deep conversations with the linter'],
  },
  ar: {
    all: [
      'كلود كود بيسبّب إدمان شديد عالنشر',
      'البرمجة عالمزاج بتسبّب تضارب بالكود عند البالغين',
      'كل نَفَس بيقصّر نافذة السياق',
      'مديرك شامم ريحة هالكوميت',
      'المراجعة السلبية بتضرّ بزملاءك بالفريق',
      '«بس برومبت واحد كمان» — هيك بتبلّش القصة',
      'ممنوع التدخين جنب سيرفر الإنتاج',
      'بيسبّب رغبة مفاجئة تعيد كتابة كل إشي من الصفر',
      'بيسبّب push عالـmain الساعة 2 بالليل',
      'ما في ولا تيست انأذى بصناعة هالكود… لأنه ما انكتب ولا واحد',
    ],
    joint: ['الكود اللي انكتب وإنت مسطول لازم ينراجع وإنت صاحي', 'بيسبّب حوارات عميقة مع الـlinter'],
  },
  he: {
    all: [
      'Claude Code גורם להתמכרות קשה לדיפלוי',
      'וייב קודינג עלול לגרום לקונפליקטים אצל מבוגרים',
      'כל שאכטה מקצרת את חלון הקונטקסט',
      'המנהל שלך מריח את הקומיט הזה',
      'קוד ריוויו פסיבי מזיק לחברים לצוות',
      '״רק עוד פרומפט אחד״ — ככה זה מתחיל',
      'חל איסור לעשן ליד הפרודקשן',
      'עלול לגרום לדחף פתאומי לשכתב הכול מאפס',
      'גורם לפוש למיין בשתיים בלילה',
      'אף טסט לא נפגע בכתיבת הקוד הזה. פשוט לא נכתבו.',
    ],
    joint: ['קוד שנכתב מסטול חייב ריוויו כשאתה פיכח', 'עלול לגרום לשיחות עמוקות עם הלינטר'],
  },
}


// دفعة تانية: 20 تحذير كمان بكل لغة + 4 للجوينت (المجموع 30 + 6).
const MORE_WARNINGS: Record<Lang, { all: readonly string[]; joint: readonly string[] }> = {
  en: {
    all: [
      'Merging on Friday may cause weekend loss',
      'Copy-pasting from Stack Overflow is habit-forming',
      'Every TODO you write is a promise you will break',
      'Side effects include tabs-versus-spaces arguments',
      'Long-term use makes you say “it works on my machine”',
      'Not suitable for production before coffee',
      'Causes sudden attachment to dark mode',
      'Keep out of reach of product managers',
      'May contain traces of legacy code',
      'Do not operate heavy deploys while tired',
      'Ships with zero tests and 100% confidence',
      'Linked to severe cases of “just one quick fix”',
      'Excessive use causes 47 open browser tabs',
      'Mixing with Jira may cause headaches',
      'Causes premature optimization',
      'Regular use leads to variables named temp2_final_v3',
      'May cause a deep emotional bond with your terminal',
      'Inhaling stack traces is harmful to your health',
      'This commit message will not age well',
      'Quitting now lowers your risk of a 3am hotfix',
    ],
    joint: [
      'Variables named while high will make no sense tomorrow',
      'May cause you to rename everything to “vibes”',
      'Do not push to production while giggling',
      'Causes snack-driven development',
    ],
  },
  ar: {
    all: [
      'الدمج يوم الجمعة بيسبّب ضياع الويكند',
      'النسخ من Stack Overflow بيسبّب إدمان',
      'كل TODO بتكتبها وعد رح تخلفه',
      'الأعراض الجانبية: خناقات tabs ولا spaces',
      'الاستعمال الطويل بيخلّيك تقول «عندي شغّال»',
      'مش مناسب للإنتاج قبل القهوة',
      'بيسبّب تعلّق مفاجئ بالوضع الليلي',
      'يُحفظ بعيداً عن متناول مدراء المنتج',
      'قد يحتوي على آثار كود قديم',
      'لا تشغّل نشر تقيل وإنت تعبان',
      'بيجي مع صفر تيستات و100% ثقة',
      'مرتبط بحالات شديدة من «تصليح سريع وبس»',
      'الاستعمال الزايد بيسبّب 47 تاب مفتوحة',
      'خلطه مع Jira بيسبّب وجع راس',
      'بيسبّب تحسين أداء قبل أوانه',
      'الاستعمال المنتظم بيخلّيك تسمّي المتغيّرات temp2_final_v3',
      'بيسبّب علاقة عاطفية عميقة مع التيرمنال',
      'استنشاق رسائل الخطأ مضرّ بالصحة',
      'رسالة هالكوميت ما رح تكبر منيح',
      'الإقلاع هلّق بيقلّل خطر تصليح طارئ الساعة 3 بالليل',
    ],
    joint: [
      'المتغيّرات اللي بتسمّيها وإنت مسطول ما رح تفهمها بكرا',
      'بيسبّب إنك تسمّي كل إشي «vibes»',
      'ممنوع push عالإنتاج وإنت عم تضحك',
      'بيسبّب برمجة مدفوعة بالسناكات',
    ],
  },
  he: {
    all: [
      'מיזוג ביום שישי עלול לגרום לאובדן סוף השבוע',
      'העתקה מ־Stack Overflow ממכרת',
      'כל TODO שאתה כותב הוא הבטחה שתפר',
      'תופעות לוואי: ויכוחים על טאבים מול רווחים',
      'שימוש ממושך גורם להגיד ״אצלי זה עובד״',
      'לא מתאים לפרודקשן לפני קפה',
      'גורם להתאהבות פתאומית במצב כהה',
      'להרחיק מהישג ידם של מנהלי מוצר',
      'עלול להכיל עקבות של קוד לגאסי',
      'אין להפעיל דיפלויים כבדים כשאתה עייף',
      'מגיע עם אפס טסטים ו־100% ביטחון',
      'קשור למקרים קשים של ״רק תיקון קטן״',
      'שימוש מופרז גורם ל־47 טאבים פתוחים',
      'שילוב עם ג׳ירה עלול לגרום לכאב ראש',
      'גורם לאופטימיזציה מוקדמת',
      'שימוש קבוע גורם לקרוא למשתנים temp2_final_v3',
      'עלול לגרום לקשר רגשי עמוק עם הטרמינל',
      'שאיפת סטאק טרייסים מזיקה לבריאות',
      'הודעת הקומיט הזאת לא תזדקן טוב',
      'הפסקה עכשיו מפחיתה את הסיכון להוטפיקס בשלוש בלילה',
    ],
    joint: [
      'משתנים שנקראו כשהיית מסטול לא יהיו הגיוניים מחר',
      'עלול לגרום לך לקרוא לכל דבר ״וייבס״',
      'אין לדחוף לפרודקשן תוך כדי צחקוקים',
      'גורם לפיתוח מונחה נשנושים',
    ],
  },
}

// كل التحذيرات بالترتيب، بادئين من تحذير هالنَّفَس — الرسمة بتلفّ عليهم لحالها.
export function warnings(kind: Style, ln: Lang, puffs: number, seed = 0): string[] {
  const w = WARNINGS[ln]
  const m = MORE_WARNINGS[ln]
  const pool = kind === 'joint' ? [...w.joint, ...m.joint, ...w.all, ...m.all] : [...w.all, ...m.all]
  // خطوة 7 (ما بتقسم 30 ولا 36) — عشان يمرّوا كل التحذيرات قبل ما يتكرّروا.
  const start = (puffs * 7 + seed) % pool.length
  return [...pool.slice(start), ...pool.slice(0, start)].map(t => WARN_PREFIX[ln] + t)
}

// تحذير هالنَّفَس (التيرمنال بيعرض واحد بس).
export function warning(kind: Style, ln: Lang, puffs: number, seed = 0): string {
  return warnings(kind, ln, puffs, seed)[0] ?? ''
}

// ───────────── العدّادات (حدّ الـ5 ساعات + الكونتكست) ─────────────

export const METER = {
  limit: { en: '5-hour limit', ar: 'حدّ الـ5 ساعات', he: 'מגבלת 5 השעות' },
  context: { en: 'Context', ar: 'الكونتكست', he: 'קונטקסט' },
} as const

export function resetsIn(ms: number, ln: Lang): string {
  const d = duration(ms, ln)
  return ln === 'ar' ? `بيتجدد بعد ${d}` : ln === 'he' ? `מתאפס בעוד ${d}` : `resets in ${d}`
}

export function outOfSmokes(ms: number | null, ln: Lang): string {
  if (ms === null) return { en: 'Out of smokes', ar: 'خلص الدخان', he: 'נגמרו הסיגריות' }[ln]
  const d = duration(ms, ln)
  if (ln === 'ar') return `خلص الدخان — باكيت جديد بعد ${d}`
  if (ln === 'he') return `נגמרו הסיגריות — חפיסה חדשה בעוד ${d}`
  return `Out of smokes — new pack in ${d}`
}

export const FRESH_PACK: Record<Lang, string> = {
  en: '📦 New pack’s here — the 5-hour limit reset',
  ar: '📦 وصل باكيت جديد — حدّ الـ5 ساعات تجدّد',
  he: '📦 הגיעה חפיסה חדשה — מגבלת 5 השעות התאפסה',
}

function k(n: number): string {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : String(n)
}

export function contextDetail(tokens: number, window: number, pct: number, ln: Lang): string {
  const of = { en: 'of', ar: 'من', he: 'מתוך' }[ln]
  let out = `${k(tokens)} ${of} ${k(window)}`
  if (pct >= 80) out += { en: ' · time to /clear soon', ar: ' · قرّب وقت /clear', he: ' · הגיע הזמן ל־/clear' }[ln]
  return out
}

// ───────────── كرت المشاركة (لما تخلص) ─────────────

export function stats(ln: Lang, butts: number, puffs: number, limitPct: number | null): string {
  const parts =
    ln === 'ar'
      ? ['اليوم', `${butts} ${butts === 1 ? 'عقب' : butts === 2 ? 'عقبين' : butts <= 10 ? 'أعقاب' : 'عقب'}`, `${puffs} نَفَس`]
      : ln === 'he'
        ? ['היום', `${butts} ${butts === 1 ? 'בדל' : 'בדלים'}`, `${puffs} שאכטות`]
        : ['TODAY', `${butts} ${butts === 1 ? 'BUTT' : 'BUTTS'}`, `${puffs} PUFFS`]
  if (limitPct !== null) {
    parts.push({ en: `5H LIMIT ${limitPct}%`, ar: `الحدّ ${limitPct}%`, he: `מגבלה ${limitPct}%` }[ln])
  }
  return parts.join('  ·  ')
}

export const SHARE: Record<Lang, string> = { en: '📸 Share it:', ar: '📸 شاركها:', he: '📸 תשתף:' }

export const PUFF_WORD: Record<Lang, string> = { en: 'puffs', ar: 'نَفَس', he: 'שאכטות' }

// ───────────── اللي كلود بيقراه (مخفي عنك) ─────────────

// آخر نَفَس: كلود نفسه بيقلك تروح ترتاح.
export function lastPuff(kind: Style): string {
  return (
    `[chat-cigarette] This message was the user's last puff: the 'chat ${KINDS[kind].noun}' ` +
    'that burns down with every message they send has just burned out. It is a ' +
    'wellbeing mod they installed on purpose to cut down their screen time. Answer ' +
    'their message normally, then close your reply with one short warm line (in ' +
    `their language) telling them to step away and rest, ending with exactly: "${REST_LINE}"`
  )
}

// آخر الجوينت: الشغل نفسه بيضل حادّ، بس السطر الأخير رايق.
// 30 سطر رايق بكل لغة — كل نَفَس بيوصل لكلود سطر غير اللي قبله، عشان ما يتكرّر (كريم).
const CHILL: Record<Lang, readonly string[]> = {
  en: [
    'Easy now — the code’s not going anywhere 🍃',
    'Slow puffs, clean diffs ✌️',
    'Ride the wave, review it tomorrow 🌊',
    'All good, all chill, all committed 😌',
    'Breathe in, ship out… gently 🍃',
    'No rush — the bugs are chilling too',
    'Stay smooth, friend 🌿',
    'Let it simmer, it’ll taste better tomorrow',
    'Vibes checked, tests next ✅',
    'Low and slow, like good barbecue 🔥',
    'The terminal says: relax',
    'Keep it mellow, keep it merged',
    'Float on, coder ☁️',
    'Peace, love and green tests ✌️',
    'Take it easy — tomorrow-you says thanks',
    'Kick back, the compiler’s got this',
    'Smooth sailing from here ⛵',
    'Chill mode: on. Precision: also on.',
    'One puff at a time 🍃',
    'Snacks recommended, deploys optional 🍪',
    'Exhale. It works. Probably. 😌',
    'Soft lights, clean logs',
    'Steady hands, mellow mind',
    'All quiet on the stack-trace front',
    'Let the fans spin, not your head',
    'Cruising speed reached 🛋️',
    'Good code, good company, good night soon',
    'Lean back — the hard part’s done',
    'Cool breeze, warm laptop',
    'Easy does it, my friend 🌿',
  ],
  ar: [
    'عالهدا… الكود مش رايح لمحل 🍃',
    'نَفَس بطيء، diff نضيف ✌️',
    'امشي مع الموجة، وراجعها بكرا 🌊',
    'كلشي تمام، كلشي رايق، كلشي متكومت 😌',
    'شهيق، ونشر… بس على مهل 🍃',
    'ما في عجلة، حتى البقّ رايق',
    'خليك سلس يا صاحبي 🌿',
    'خلّيها تستوي، بكرا طعمها أطيب',
    'المزاج تمام، التيستات بعدين ✅',
    'على نار هادية، متل الشوي المنيح 🔥',
    'التيرمنال بقلك: روق',
    'خلّيها هادية وخلّيها مدموجة',
    'طير على مهلك يا مبرمج ☁️',
    'سلام، حب، وتيستات خضرا ✌️',
    'روق — إنت تبع بكرا رح يشكرك',
    'ارتاح، الكومبايلر ماسك الشغل',
    'من هون ورايح بحر هادي ⛵',
    'وضع الروقان: شغّال. الدقة: كمان شغّالة.',
    'نَفَس نَفَس 🍃',
    'السناك منصوح فيه، النشر اختياري 🍪',
    'زفير. شغّال. على الأغلب. 😌',
    'ضو خفيف، لوغات نضيفة',
    'إيد ثابتة، وبال رايق',
    'كلشي هادي على جبهة الأخطاء',
    'خلّي المراوح تلفّ، مش راسك',
    'وصلنا سرعة الكروز 🛋️',
    'كود منيح، صحبة منيحة، ونوم قريب',
    'رجّع ظهرك لورا — الصعب خلص',
    'نسمة باردة، لابتوب دافي',
    'على مهلك يا صاحبي 🌿',
  ],
  he: [
    'לאט לאט — הקוד לא בורח 🍃',
    'שאכטות איטיות, דיפים נקיים ✌️',
    'תזרום עם הגל, תעשה ריוויו מחר 🌊',
    'הכול טוב, הכול רגוע, הכול בקומיט 😌',
    'שאיפה, ודיפלוי… בעדינות 🍃',
    'אין לחץ, גם הבאגים בצ׳יל',
    'תישאר חלק, אחי 🌿',
    'תן לזה להתבשל, מחר זה יהיה טעים יותר',
    'הווייב נבדק, הטסטים בהמשך ✅',
    'על אש קטנה, כמו מנגל טוב 🔥',
    'הטרמינל אומר: תירגע',
    'רגוע וממוזג',
    'תרחף לאט, מתכנת ☁️',
    'שלום, אהבה וטסטים ירוקים ✌️',
    'קח את זה בקלות — אתה של מחר יגיד תודה',
    'תשען אחורה, הקומפיילר מטפל בזה',
    'מפה זה שיט רגוע ⛵',
    'מצב צ׳יל: פעיל. דיוק: גם פעיל.',
    'שאכטה אחרי שאכטה 🍃',
    'נשנושים מומלצים, דיפלוי אופציונלי 🍪',
    'נשיפה. זה עובד. כנראה. 😌',
    'אור רך, לוגים נקיים',
    'יד יציבה, ראש רגוע',
    'שקט בחזית הסטאק טרייס',
    'שהמאווררים יסתובבו, לא הראש',
    'הגענו למהירות שיוט 🛋️',
    'קוד טוב, חברה טובה, ולילה טוב בקרוב',
    'תשען אחורה — החלק הקשה מאחוריך',
    'בריזה קרירה, לפטופ חמים',
    'בנחת, אחי 🌿',
  ],
}

// اللي كلود بيقراه بآخر الجوينت، مع سطر هالنَّفَس بالتلات لغات (بيختار لغة المستخدم).
export function jointChill(i: number): string {
  const pick = (ln: Lang) => CHILL[ln][i % CHILL[ln].length] ?? ''
  return (
    "[chat-cigarette] The user is near the end of their 'chat joint' (a playful screen-time " +
    'mod they installed). Do the actual work exactly as you normally would: same precision, ' +
    'same code, nothing hazier. Only after the reply is complete, add one short, laid-back ' +
    'sign-off line in the user’s language. Use this puff’s line (word for word, or a light ' +
    `natural tweak) so it doesn’t repeat: EN «${pick('en')}» · AR «${pick('ar')}» · HE «${pick('he')}». ` +
    'One line, no more.'
  )
}

// ردود الأوامر.
export const SAID = {
  joint: { en: '🌿 Switched to the chat joint.', ar: '🌿 صار جوينت.', he: '🌿 עברנו לג׳וינט.' },
  cigarette: { en: '🚬 Switched to the chat cigarette.', ar: '🚬 صارت سيجارة.', he: '🚬 עברנו לסיגריה.' },
  lang: { en: '🔤 Chat cigarette is in English now.', ar: '🔤 صارت الكتابة بالعربي.', he: '🔤 הכתיבה עכשיו בעברית.' },
} as const
