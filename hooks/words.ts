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

// دفعة تالتة: نكت بس — عن الكود وكلود والبرومبتات والسهر (كريم 11/10: «بدي أعطي المستخدم joy»،
// «نكت بس عن الكود وكلود والصحيان متأخر» — بلا أكل ولا أهل ولا مسلسلات).
const FUN_LINES: Record<Lang, Lines> = {
  en: {
    early: [
      '🔥 Lit. Claude is officially your smoking buddy now',
      '🤖 Claude doesn’t smoke. It just reads your code. Judging.',
      '🧠 Brain warming up… compiling thoughts',
      '☕ Coffee, smoke, prompt. The full stack.',
      '🐛 The bugs heard you lit up. They’re nervous.',
      '📈 Productivity up 3%. Lungs down 3%. Balanced.',
      '🪄 Prompt, puff, pretend you planned this',
      '🗣️ “Just a quick question” — famous last words',
      '🦾 You and Claude: an unstoppable duo of mild confusion',
      '📜 Step one: write a prompt. Step two: rewrite the prompt.',
      '🙈 Your git history can’t see you. Yet.',
      '🍿 Get comfy — Claude is about to write a novel',
      '🐌 Slow and steady wins the merge',
      '🎲 You rolled a 1: “open another tab”',
      '🫡 Reporting for duty, Captain Keyboard',
      '🧯 Fire extinguisher ready. You said “deploy”.',
      '👽 Aliens are studying your tabs. They’re confused too.',
      '🐒 Inner monkey says “rewrite it all”. Ignore it.',
      '📦 node_modules weighs more than your laptop',
      '🧙 Claude used Rewrite File. It’s super effective!',
      '🧂 Take every “should work” with a pinch of salt',
      '🎤 Talking to an AI while smoking. Normal Tuesday.',
      '🪤 That “simple fix” is a trap. You know it.',
      '🦆 Rubber duck on standby. Explain it slowly.',
      '🛫 Prompt cleared for takeoff',
      '🤌 Chef’s kiss on that prompt',
      '🙏 May your build be green and your lighter full',
      '🐉 Here be dragons. And one missing semicolon.',
      '💅 Writing code with style. And smoke.',
      '🧾 Receipt: 1 smoke, 0 tests, infinite hope',
      '🫠 Day one of “I’ll just check one thing”',
      '🎢 Buckle up, it’s a refactor',
      '📡 Claude received your vibes. Processing…',
      '🦥 Speed: slow. Commits: clean. Vibes: immaculate.',
      '🥷 Ninja commit: in and out, nobody gets hurt',
      '🧪 Hypothesis: one more puff fixes it. Testing…',
      '🏋️ Today’s workout: lifting stack traces',
      '🎻 A tiny violin for every failing test',
      '😎 Cool, calm, and copy-pasting',
      '🤓 Nerd fuel: nicotine, caffeine, dark mode',
      '🥳 All tests passed! (There was one test.)',
      '🧑‍🚀 Houston, the prompt has landed',
      '🐣 New smoke, same bugs',
      '🦄 Somewhere, a clean codebase exists. Not here.',
      '🪁 You fly the ideas. Claude holds the string.',
      '✍️ Be specific. Claude can’t read minds. Yet.',
      '📋 Pasted the whole error. Good. Claude loves context.',
      '🔮 Claude saw that bug coming. You didn’t ask.',
      '🧱 Strong prompt, strong code. Weak prompt, “hmm”.',
      '🤖 “You’re absolutely right!” — Claude, before fixing it',
      '⌨️ Ctrl+C, Ctrl+V, Ctrl+Pray',
    ],
    mid: [
      '🔁 You asked that twice. Claude noticed. Politely.',
      '🤡 “It’s probably a one-liner” — you, 40 minutes ago',
      '🍃 Half smoked, half a feature. Math.',
      '🧯 The bug is fine. Your patience is on fire.',
      '🐌 Your code is fast. You, not so much.',
      '🧠 RAM: 98% used. Mostly Stack Overflow tabs.',
      '🤔 The real bug was the friends we made along the way',
      '🕳️ Deep in a rabbit hole. Wave to the rabbit.',
      '🗿 The face of someone reading a 400-line diff',
      '🛠️ Fixed one bug. It brought three friends.',
      '🙃 It worked yesterday. Yesterday lied.',
      '🦖 Your legacy code has seen things. Terrible things.',
      '😢 Somewhere, a TODO from 2019 is crying',
      '🤖 Claude has typed more today than you’ve spoken',
      '🧮 Puffs today: higher than your test coverage',
      '😤 Arguing with the linter. Winning? No.',
      '🧊 Chill. Deadlines are a social construct.',
      '🔍 Hunting that bug like it owes you money',
      '🐙 Forty tabs open. Impressive. Concerning.',
      '🫥 You stared at that line. It stared back.',
      '🌪️ Your desk looks like a merge conflict',
      '🍄 Five nested ifs. Mario would be proud.',
      '🎰 Same command again, hoping for a new result',
      '🦜 “Why?” “WHY?” “why…” — your last three prompts',
      '🥲 Fixed it. Don’t know how. Not touching it.',
      '🎯 A Stack Overflow answer from 2011: still the best',
      '🧦 Mismatched socks, matched brackets. Priorities.',
      '📝 Your prompt is longer than the code. Respect.',
      '🤝 Claude wrote it, you approved it, nobody read it',
      '🔥 This file has 2,000 lines. And one function.',
      '🐞 It’s not a bug, it’s an undocumented feature',
      '🧩 Claude fixed it in one line. You spent an hour.',
      '💬 “Make it better” is not a prompt. It’s a wish.',
      '📉 Context window shrinking. Like your patience.',
      '🧹 Delete code you don’t need. Feel lighter. Repeat.',
      '🙊 The oldest debugger alive: console.log',
      '🔄 Turned it off and on again. Classic.',
      '🫣 Approved the edit without reading. Bold.',
      '🧾 Commit message: “stuff”. Future you: “what stuff?”',
      '👻 That bug only shows up when you’re not looking',
      '🏗️ Building a house of cards, but async',
      '🕵️ The bug was a typo. It’s always a typo.',
      '🎭 “Works on my machine” — then ship your machine',
      '😵 Three files changed. You asked for one.',
      '📚 Read the docs? In this economy?',
      '🪓 A refactor so big it needs its own cigarette',
      '🛑 Before the next prompt: did you read the answer?',
      '🥸 Pretending to understand regex. Again.',
      '🔐 Hardcoded the password “just for testing”',
      '🧬 Your code evolves. Mostly sideways.',
    ],
    late: [
      '🛏️ Your bed left you on “seen”',
      '🚪 Exit stage left. Gracefully. With a commit.',
      '🧯 Almost out. Unlike your bugs.',
      '😴 Your eyelids filed a merge request',
      '🎬 And… cut. That’s a wrap on today’s code.',
      '🪦 Here lies today’s to-do list. It tried.',
      '💾 Save the code. Then save yourself.',
      '🏁 Final puffs. The build goes green. Maybe.',
      '🧸 Bedtime story: once upon a time, the build passed…',
      '🔋 Your battery: 4%. Your charger: the bed.',
      '🕹️ Game over. Insert pillow to continue.',
      '🐞 Fewer bugs tomorrow — if you sleep',
      '🥱 That yawn was a 404: energy not found',
      '🧾 Today’s bill: 20 puffs, 1 tired developer',
      '🎉 Congrats! You survived another day of software',
      '🌧️ Brain buffering… time to reboot',
      '🔒 Lock the laptop. Bugs can’t open doors.',
      '📅 Tomorrow called: “bring energy, leave the bugs”',
      '🤝 Claude says thanks. Claude also says log off.',
      '⚡ Tomorrow-you fixes it 10× faster. Trust them.',
      '🧠 Brain storage full. Please empty in bed.',
      '🧳 Your code will still be here tomorrow. Sadly.',
      '👑 King of commits. Now go be king of sleep.',
      '🎈 Let it go: the code, the day, the bugs',
      '📬 Out of office: you, in a few puffs',
      '🧘 Final boss: actually logging off',
      '🔚 Last commit: “good night”',
      '⏹️ Stop the process. Yours, not the server’s.',
      '🚦 Last prompt. Make it a good one.',
      '📦 Ship it tomorrow, rested. Not tonight, tired.',
      '😪 Your code is tired. You’re tired. Everyone’s tired.',
      '🛌 Sleep: the only fix that works every time',
      '🔁 Reboot required: you',
      '🫡 Good session. Claude’s proud. Now go.',
      '🧯 Put out the cigarette before you push to main',
      '🌃 The servers stay up all night. You don’t have to.',
      '💤 Tomorrow’s bug is already waiting. Let it wait.',
      '🗑️ Close 40 tabs, keep one dream',
      '📌 Leave a TODO for tomorrow. A real one, this time.',
      '🐢 Tired code is slow code. Go recharge.',
      '🎮 Final level: closing the laptop without “one more thing”',
      '📉 Every puff now lowers your code quality by 4%',
      '🧪 Experiment: sleep. Expected result: fewer bugs.',
      '🫖 Last prompt, last puff, lights out',
      '🧱 Leave the wall half-built. It’ll be there tomorrow.',
      '🛎️ The bell rang: session over',
      '😮‍💨 Exhale the day. Then sleep.',
      '🧮 You’ve sent enough prompts to write a book. Rest.',
      '🔕 Notifications off. Brain off. Good night.',
      '🌌 Even the stars are logging off',
    ],
  },
  ar: {
    early: [
      '🔥 ولعت. كلود رسمياً صار رفيقك بالدخان',
      '🤖 كلود ما بيدخّن. بس بيقرا كودك. وبيحكم.',
      '🧠 المخ عم يسخّن… عم يجمّع الأفكار',
      '☕ قهوة، دخان، وبرومبت. الـfull stack.',
      '🐛 البقّ سمع إنك ولّعت. صار متوتّر.',
      '📈 الإنتاجية طلعت 3%. الرئتين نزلوا 3%. توازن.',
      '🪄 برومبت، نَفَس، واعمل حالك مخطّطلها',
      '🗣️ «سؤال صغير بس» — آخر كلام قبل الكارثة',
      '🦾 إنت وكلود: فريق ما بينوقف… عن الحيرة',
      '📜 الخطوة الأولى: اكتب برومبت. التانية: أعد كتابته.',
      '🙈 تاريخ الـgit مش شايفك. لهلّق.',
      '🍿 ريّح حالك — كلود رح يكتبلك رواية',
      '🐌 شوي شوي بيوصل الـmerge',
      '🎲 رميت النرد وطلعلك: «افتح تاب كمان»',
      '🫡 جاهز للخدمة يا كابتن كيبورد',
      '🧯 طفّاية الحريق جاهزة. إنت قلت «deploy».',
      '👽 الفضائيين عم يدرسوا تاباتك. ضايعين كمان.',
      '🐒 القرد اللي جوّاك بدّه يعيد كتابة كل إشي. طنّشه.',
      '📦 مجلّد node_modules أتقل من اللابتوب نفسه',
      '🧙 كلود استعمل «إعادة كتابة الملف». فعّال جداً!',
      '🧂 كل «المفروض تشتغل» خدها مع رشّة ملح',
      '🎤 عم تحكي مع ذكاء صناعي وإنت بتدخّن. يوم عادي.',
      '🪤 «التصليح البسيط» هاد فخ. وإنت عارف.',
      '🦆 البطة المطاطية جاهزة. اشرحلها عالمهل.',
      '🛫 البرومبت جاهز للإقلاع',
      '🤌 يا سلام عهالبرومبت',
      '🙏 الله يخلّيلك البيلد أخضر والقدّاحة مليانة',
      '🐉 هون في تنانين. وفاصلة منقوطة ناقصة.',
      '💅 عم تكتب كود بستايل. وبدخان.',
      '🧾 الفاتورة: نَفَس، صفر تيستات، وأمل لا نهائي',
      '🫠 أول يوم من «بس بشيّك على إشي واحد»',
      '🎢 اربط الحزام، في ريفاكتور',
      '📡 كلود استلم الفايبز تبعك. عم يعالج…',
      '🦥 السرعة: بطيئة. الكوميتات: نضيفة. المزاج: عالي.',
      '🥷 كوميت نينجا: بتفوت وبتطلع وما حدا بينأذى',
      '🧪 فرضية: نَفَس كمان بيحلّها. عم نجرّب…',
      '🏋️ تمرين اليوم: رفع رسائل خطأ',
      '🎻 كمنجة صغيرة لكل تيست فاشل',
      '😎 رايق، هادي، وعم تعمل كوبي بيست',
      '🤓 بنزين النيردز: نيكوتين، كافيين، ووضع ليلي',
      '🥳 كل التيستات نجحت! (كان في تيست واحد.)',
      '🧑‍🚀 هيوستن، البرومبت هبط بسلام',
      '🐣 نَفَس جديد، نفس البقّ',
      '🦄 بمكان ما في كود نضيف. مش هون.',
      '🪁 إنت بتطيّر الأفكار، وكلود ماسك الخيط',
      '✍️ وضّح بالبرومبت. كلود ما بيقرا الأفكار. لهلّق.',
      '📋 لزقت الخطأ كامل. برافو. كلود بيحب السياق.',
      '🔮 كلود توقّع هالبقّة. إنت ما سألت.',
      '🧱 برومبت قوي، كود قوي. برومبت ضعيف، «همم».',
      '🤖 «معك حق تماماً!» — كلود، قبل ما يصلّحها',
      '⌨️ كوبي، بيست، وتمنّى',
    ],
    mid: [
      '🔁 سألت نفس السؤال مرتين. كلود انتبه. بأدب.',
      '🤡 «أكيد سطر واحد» — إنت، قبل 40 دقيقة',
      '🍃 نصها انحرق، ونص الفيتشر خلص. رياضيات.',
      '🧯 البقّ منيح. صبرك هو اللي عم يحترق.',
      '🐌 الكود سريع. إنت… مش كتير.',
      '🧠 الذاكرة: 98% مليانة. تابات Stack Overflow بمعظمها.',
      '🤔 البقّ الحقيقي كان الصحاب اللي تعرّفنا عليهم بالطريق',
      '🕳️ نزلت بحفرة الأرنب. سلّم عالأرنب.',
      '🗿 وجه واحد عم يقرا diff من 400 سطر',
      '🛠️ صلّحت بقّة. جابت معها تلات صحاب.',
      '🙃 مبارح كانت شغّالة. مبارح كذّاب.',
      '🦖 الكود القديم شاف أشيا… أشيا صعبة.',
      '😢 بمكان ما، في TODO من 2019 عم تبكي',
      '🤖 كلود كتب اليوم أكتر من ما إنت حكيت',
      '🧮 نَفَساتك اليوم أكتر من تغطية التيستات',
      '😤 عم تتناقر مع الـlinter. ربحان؟ لأ.',
      '🧊 روق. الديدلاين اختراع اجتماعي.',
      '🔍 عم تدوّر عالبقّة كأنها مدينتلك مصاري',
      '🐙 أربعين تاب مفتوحة. مبهر. ومقلق.',
      '🫥 بحلقت بهالسطر. وهو بحلق فيك.',
      '🌪️ طاولتك شكلها merge conflict',
      '🍄 خمس if جوّا بعض. ماريو فخور فيك.',
      '🎰 بتشغّل نفس الأمر وبتستنّى نتيجة جديدة',
      '🦜 «ليش؟» «لييييش؟» «ليش…» — آخر تلات برومبتات',
      '🥲 زبطت. ما بعرف كيف. ما حدا يلمسها.',
      '🎯 جواب Stack Overflow من 2011: لسا الأحسن',
      '🧦 كلسات مش متطابقة، أقواس متطابقة. أولويات.',
      '📝 البرومبت تبعك أطول من الكود. احترام.',
      '🤝 كلود كتبه، إنت وافقت، وما حدا قراه',
      '🔥 هالملف فيه 2000 سطر. وفنكشن وحدة.',
      '🐞 مش بقّ، هاي ميزة مش موثّقة',
      '🧩 كلود حلّها بسطر. إنت قعدت ساعة.',
      '💬 «خلّيه أحسن» مش برومبت. هاي أمنية.',
      '📉 نافذة السياق عم تصغر. متل صبرك.',
      '🧹 امحي الكود اللي ما بتحتاجه. بتخفّ. وعيد.',
      '🙊 أقدم ديبَغر بالتاريخ: console.log',
      '🔄 طفّيته وشغّلته. كلاسيك.',
      '🫣 وافقت عالتعديل بلا ما تقرا. جرأة.',
      '🧾 رسالة الكوميت: «أشيا». إنت تبع بكرا: «أي أشيا؟»',
      '👻 هالبقّة ما بتطلع إلا لما ما تكون متطلّع',
      '🏗️ عم تبني برج كرتون، بس async',
      '🕵️ البقّة طلعت غلطة إملائية. دايماً غلطة إملائية.',
      '🎭 «عندي شغّالة» — طيب انشر جهازك',
      '😵 تغيّروا تلات ملفات. إنت طلبت واحد.',
      '📚 تقرا التوثيق؟ بهالاقتصاد؟',
      '🪓 ريفاكتور كبير لدرجة بدّه سيجارة لحاله',
      '🛑 قبل البرومبت الجاي: قريت الجواب؟',
      '🥸 عم تعمل حالك فاهم الـregex. كمان مرة.',
      '🔐 حطّيت الباسوورد بالكود «بس للتجربة»',
      '🧬 الكود عم يتطوّر. بالعرض غالباً.',
    ],
    late: [
      '🛏️ تختك عملك «شاف» وما ردّ',
      '🚪 اطلع من المسرح. بأناقة. ومع كوميت.',
      '🧯 قرّبت تخلص. مش متل البقّ تبعك.',
      '😴 جفونك قدّمت طلب دمج',
      '🎬 وستوب. خلص تصوير كود اليوم.',
      '🪦 هون يرقد جدول مهام اليوم. حاول.',
      '💾 احفظ الكود. وبعدين احفظ حالك.',
      '🏁 آخر نَفَسات. البيلد بيخضرّ. يمكن.',
      '🧸 حكاية قبل النوم: كان يا ما كان، بيلد نجح…',
      '🔋 بطاريتك: 4%. الشاحن: التخت.',
      '🕹️ انتهت اللعبة. حط مخدة لتكمّل.',
      '🐞 بقّ بكرا أقل، إذا نمت',
      '🥱 هالتثاؤب كان 404: الطاقة مش موجودة',
      '🧾 فاتورة اليوم: 20 نَفَس، ومبرمج واحد تعبان',
      '🎉 مبروك! عشت يوم كمان بعالم السوفتوير',
      '🌧️ المخ عم يحمّل… وقت الريستارت',
      '🔒 اقفل اللابتوب. البقّ ما بيعرف يفتح أبواب.',
      '📅 بكرا اتصل: «جيب طاقة، وخلّي البقّ»',
      '🤝 كلود بيشكرك. وكمان بيقلك سكّر.',
      '⚡ إنت تبع بكرا رح يحلّها أسرع بعشر مرات. ثق فيه.',
      '🧠 مساحة المخ خلصت. فضّيها بالتخت.',
      '🧳 الكود رح يضل هون بكرا. للأسف.',
      '👑 ملك الكوميتات. هلّق روح كون ملك النوم.',
      '🎈 فلّت: الكود، النهار، والبقّ',
      '📬 رد تلقائي: «مش موجود» — إنت، بعد كم نَفَس',
      '🧘 الوحش الأخير: إنك تسكّر فعلاً',
      '🔚 آخر كوميت: «تصبح على خير»',
      '⏹️ وقّف البروسس. تبعك، مش تبع السيرفر.',
      '🚦 آخر برومبت. خلّيه يستاهل.',
      '📦 انشرها بكرا وإنت مرتاح. مش الليلة وإنت تعبان.',
      '😪 الكود تعبان. إنت تعبان. الكل تعبان.',
      '🛌 النوم: التصليح الوحيد اللي بيزبط كل مرة',
      '🔁 مطلوب ريستارت: إلك',
      '🫡 جلسة منيحة. كلود فخور فيك. يلّا روح.',
      '🧯 طفّي السيجارة قبل ما تعمل push عالـmain',
      '🌃 السيرفرات بتسهر كل الليل. إنت مش مجبور.',
      '💤 بقّة بكرا مستنّيتك. خلّيها تستنّى.',
      '🗑️ سكّر 40 تاب، وخلّي حلم واحد',
      '📌 اترك TODO لبكرا. حقيقية هالمرة.',
      '🐢 الكود التعبان كود بطيء. روح اشحن.',
      '🎮 المرحلة الأخيرة: تسكّر اللابتوب بلا «بس إشي كمان»',
      '📉 كل نَفَس هلّق بينزّل جودة الكود 4%',
      '🧪 تجربة: نام. النتيجة المتوقعة: بقّ أقل.',
      '🫖 آخر برومبت، آخر نَفَس، وطفّي الضو',
      '🧱 خلّي الحيط نص مبني. بكرا بيكون هون.',
      '🛎️ الجرس دقّ: خلصت الجلسة',
      '😮‍💨 ازفر النهار. وبعدين نام.',
      '🧮 بعتّ برومبتات بتكفّي تكتب كتاب. ارتاح.',
      '🔕 الإشعارات طفيت. المخ طفي. تصبح على خير.',
      '🌌 حتى النجوم عم تسكّر',
    ],
  },
  he: {
    early: [
      '🔥 דלוק. קלוד רשמית החבר שלך לעישון',
      '🤖 קלוד לא מעשן. הוא רק קורא את הקוד שלך. ושופט.',
      '🧠 המוח מתחמם… מקמפל מחשבות',
      '☕ קפה, עשן, פרומפט. פול סטאק.',
      '🐛 הבאגים שמעו שהדלקת. הם לחוצים.',
      '📈 הפרודוקטיביות עלתה ב־3%. הריאות ירדו ב־3%. איזון.',
      '🪄 פרומפט, שאכטה, ותעשה כאילו תכננת את זה',
      '🗣️ ״רק שאלה קטנה״ — מילים אחרונות מפורסמות',
      '🦾 אתה וקלוד: צמד בלתי ניתן לעצירה של בלבול קל',
      '📜 שלב אחד: לכתוב פרומפט. שלב שתיים: לכתוב אותו מחדש.',
      '🙈 היסטוריית ה־git לא רואה אותך. עדיין.',
      '🍿 תתרווח — קלוד עומד לכתוב רומן',
      '🐌 לאט ובטוח מגיעים למרג׳',
      '🎲 הטלת קובייה ויצא: ״לפתוח עוד טאב״',
      '🫡 מתייצב לשירות, קפטן מקלדת',
      '🧯 המטף מוכן. אמרת ״דיפלוי״.',
      '👽 חייזרים חוקרים את הטאבים שלך. גם הם מבולבלים.',
      '🐒 הקוף הפנימי אומר ״לשכתב הכול״. תתעלם ממנו.',
      '📦 ה־node_modules שוקל יותר מהלפטופ',
      '🧙 קלוד השתמש ב״שכתוב קובץ״. סופר אפקטיבי!',
      '🧂 כל ״זה אמור לעבוד״ — עם קורט מלח',
      '🎤 מדבר עם בינה מלאכותית ומעשן. יום שלישי רגיל.',
      '🪤 ה״תיקון הפשוט״ הזה הוא מלכודת. אתה יודע.',
      '🦆 ברווז הגומי בכוננות. תסביר לו לאט.',
      '🛫 הפרומפט קיבל אישור המראה',
      '🤌 נשיקת שף לפרומפט הזה',
      '🙏 שהבילד יהיה ירוק והמצית מלא',
      '🐉 כאן יש דרקונים. ונקודה־פסיק חסרה.',
      '💅 כותב קוד עם סטייל. ועם עשן.',
      '🧾 קבלה: שאכטה אחת, אפס טסטים, תקווה אינסופית',
      '🫠 יום ראשון של ״רק אבדוק דבר אחד״',
      '🎢 תחגור, יש ריפקטור',
      '📡 קלוד קיבל את הוייבים שלך. מעבד…',
      '🦥 מהירות: איטית. קומיטים: נקיים. וייב: מושלם.',
      '🥷 קומיט נינג׳ה: נכנס, יוצא, אף אחד לא נפגע',
      '🧪 השערה: עוד שאכטה תפתור את זה. בודקים…',
      '🏋️ האימון של היום: הרמת סטאק טרייסים',
      '🎻 כינור קטן לכל טסט שנכשל',
      '😎 רגוע, שליו, ועושה קופי־פייסט',
      '🤓 דלק של חנונים: ניקוטין, קפאין ומצב כהה',
      '🥳 כל הטסטים עברו! (היה טסט אחד.)',
      '🧑‍🚀 יוסטון, הפרומפט נחת',
      '🐣 שאכטה חדשה, אותם באגים',
      '🦄 איפשהו קיים קוד נקי. לא פה.',
      '🪁 אתה מעיף את הרעיונות, קלוד מחזיק את החוט',
      '✍️ תהיה ספציפי. קלוד לא קורא מחשבות. עדיין.',
      '📋 הדבקת את כל השגיאה. יופי. קלוד אוהב הקשר.',
      '🔮 קלוד חזה את הבאג הזה. לא שאלת.',
      '🧱 פרומפט חזק, קוד חזק. פרומפט חלש, ״הממ״.',
      '🤖 ״אתה צודק לגמרי!״ — קלוד, לפני שהוא מתקן',
      '⌨️ העתק, הדבק, תתפלל',
    ],
    mid: [
      '🔁 שאלת את זה פעמיים. קלוד שם לב. בנימוס.',
      '🤡 ״זה בטח שורה אחת״ — אתה, לפני 40 דקות',
      '🍃 חצי עישנת, חצי פיצ׳ר. מתמטיקה.',
      '🧯 הבאג בסדר. הסבלנות שלך בוערת.',
      '🐌 הקוד מהיר. אתה… פחות.',
      '🧠 זיכרון: 98% בשימוש. בעיקר טאבים של Stack Overflow.',
      '🤔 הבאג האמיתי היה החברים שהכרנו בדרך',
      '🕳️ נפלת לבור של ארנב. תגיד שלום לארנב.',
      '🗿 הפרצוף של מי שקורא דיף של 400 שורות',
      '🛠️ תיקנת באג אחד. הוא הביא שלושה חברים.',
      '🙃 אתמול זה עבד. אתמול שיקר.',
      '🦖 קוד הלגאסי שלך ראה דברים. דברים נוראיים.',
      '😢 איפשהו TODO משנת 2019 בוכה',
      '🤖 קלוד הקליד היום יותר ממה שאתה דיברת',
      '🧮 השאכטות של היום: יותר מכיסוי הטסטים',
      '😤 מתווכח עם הלינטר. מנצח? לא.',
      '🧊 תירגע. דדליין זה מבנה חברתי.',
      '🔍 צד את הבאג כאילו הוא חייב לך כסף',
      '🐙 ארבעים טאבים פתוחים. מרשים. מדאיג.',
      '🫥 בהית בשורה הזאת. היא בהתה בחזרה.',
      '🌪️ השולחן שלך נראה כמו מרג׳ קונפליקט',
      '🍄 חמישה if מקוננים. מריו גאה בך.',
      '🎰 מריץ שוב את אותה פקודה ומקווה לתוצאה אחרת',
      '🦜 ״למה?״ ״למההה?״ ״למה…״ — שלושת הפרומפטים האחרונים',
      '🥲 תוקן. לא יודע איך. לא נוגעים.',
      '🎯 תשובה מ־Stack Overflow משנת 2011: עדיין הכי טובה',
      '🧦 גרביים לא תואמות, סוגריים תואמים. סדרי עדיפויות.',
      '📝 הפרומפט שלך ארוך מהקוד. כבוד.',
      '🤝 קלוד כתב, אתה אישרת, אף אחד לא קרא',
      '🔥 בקובץ הזה 2,000 שורות. ופונקציה אחת.',
      '🐞 זה לא באג, זה פיצ׳ר לא מתועד',
      '🧩 קלוד פתר את זה בשורה אחת. אתה ישבת שעה.',
      '💬 ״תשפר את זה״ זה לא פרומפט. זו משאלה.',
      '📉 חלון הקונטקסט מצטמק. כמו הסבלנות שלך.',
      '🧹 תמחק קוד שאתה לא צריך. תרגיש קליל. חוזר חלילה.',
      '🙊 הדיבאגר הכי ותיק בעולם: console.log',
      '🔄 כיבית והדלקת. קלאסיקה.',
      '🫣 אישרת את העריכה בלי לקרוא. אמיץ.',
      '🧾 הודעת קומיט: ״דברים״. אתה של מחר: ״איזה דברים?״',
      '👻 הבאג הזה מופיע רק כשאתה לא מסתכל',
      '🏗️ בונה מגדל קלפים, אבל אסינכרוני',
      '🕵️ הבאג היה טעות הקלדה. זה תמיד טעות הקלדה.',
      '🎭 ״אצלי זה עובד״ — אז תשלח את המחשב שלך',
      '😵 שלושה קבצים השתנו. ביקשת אחד.',
      '📚 לקרוא את התיעוד? בכלכלה הזאת?',
      '🪓 ריפקטור כל כך גדול שהוא צריך סיגריה משלו',
      '🛑 לפני הפרומפט הבא: קראת את התשובה?',
      '🥸 עושה כאילו אתה מבין regex. שוב.',
      '🔐 שמת את הסיסמה בקוד ״רק לבדיקה״',
      '🧬 הקוד שלך מתפתח. בעיקר הצידה.',
    ],
    late: [
      '🛏️ המיטה השאירה אותך על ״נקרא״',
      '🚪 יציאה מהבמה. באלגנטיות. עם קומיט.',
      '🧯 כמעט נגמר. לא כמו הבאגים שלך.',
      '😴 העפעפיים שלך הגישו מרג׳ ריקווסט',
      '🎬 וקאט. סיימנו לצלם את הקוד של היום.',
      '🪦 כאן נחה רשימת המשימות של היום. היא ניסתה.',
      '💾 תשמור את הקוד. ואז תשמור על עצמך.',
      '🏁 שאכטות אחרונות. הבילד מוריק. אולי.',
      '🧸 סיפור לפני השינה: היה היה בילד שעבר…',
      '🔋 הסוללה שלך: 4%. המטען: המיטה.',
      '🕹️ המשחק נגמר. תכניס כרית כדי להמשיך.',
      '🐞 מחר פחות באגים, אם תישן',
      '🥱 הפיהוק הזה היה 404: אנרגיה לא נמצאה',
      '🧾 החשבון של היום: 20 שאכטות, מתכנת עייף אחד',
      '🎉 מזל טוב! שרדת עוד יום בעולם התוכנה',
      '🌧️ המוח בטעינה… זמן לריסטארט',
      '🔒 תנעל את הלפטופ. באגים לא יודעים לפתוח דלתות.',
      '📅 מחר התקשר: ״תביא אנרגיה, תשאיר באגים״',
      '🤝 קלוד אומר תודה. קלוד גם אומר להתנתק.',
      '⚡ אתה של מחר יתקן את זה פי עשרה מהר. תסמוך עליו.',
      '🧠 אחסון המוח מלא. נא לרוקן במיטה.',
      '🧳 הקוד יהיה פה מחר. לצערנו.',
      '👑 מלך הקומיטים. עכשיו לך להיות מלך השינה.',
      '🎈 תשחרר: את הקוד, את היום, את הבאגים',
      '📬 מענה אוטומטי: ״לא במשרד״ — אתה, בעוד כמה שאכטות',
      '🧘 הבוס האחרון: באמת להתנתק',
      '🔚 קומיט אחרון: ״לילה טוב״',
      '⏹️ תעצור את התהליך. שלך, לא של השרת.',
      '🚦 פרומפט אחרון. שיהיה שווה.',
      '📦 תשחרר מחר, נח. לא הלילה, עייף.',
      '😪 הקוד עייף. אתה עייף. כולם עייפים.',
      '🛌 שינה: התיקון היחיד שעובד כל פעם',
      '🔁 נדרש ריסטארט: לך',
      '🫡 סשן טוב. קלוד גאה בך. עכשיו לך.',
      '🧯 תכבה את הסיגריה לפני שאתה דוחף למיין',
      '🌃 השרתים ערים כל הלילה. אתה לא חייב.',
      '💤 הבאג של מחר כבר מחכה. שיחכה.',
      '🗑️ תסגור 40 טאבים, תשאיר חלום אחד',
      '📌 תשאיר TODO למחר. אמיתי, הפעם.',
      '🐢 קוד עייף הוא קוד איטי. לך להיטען.',
      '🎮 השלב האחרון: לסגור את הלפטופ בלי ״רק עוד דבר״',
      '📉 כל שאכטה עכשיו מורידה 4% מאיכות הקוד',
      '🧪 ניסוי: לישון. תוצאה צפויה: פחות באגים.',
      '🫖 פרומפט אחרון, שאכטה אחרונה, מכבים אור',
      '🧱 תשאיר את הקיר חצי בנוי. הוא יהיה פה מחר.',
      '🛎️ הפעמון צלצל: הסשן נגמר',
      '😮‍💨 תנשוף את היום. ולך לישון.',
      '🧮 שלחת מספיק פרומפטים לכתוב ספר. תנוח.',
      '🔕 התראות כבויות. מוח כבוי. לילה טוב.',
      '🌌 אפילו הכוכבים מתנתקים',
    ],
  },
}

// للجوينت بس (بتنخلط مع الجمل لما يكون جوينت) — نفس الشي: كود وبرومبتات وسهر.
const JOINT_LINES: Record<Lang, Lines> = {
  en: {
    early: [
      '🌿 Rolled tight, coding loose',
      '🛸 Lift-off. Houston, we have vibes.',
      '🌀 The code looks… wavy. That’s normal.',
      '🎨 The syntax colors just got 40% prettier',
      '😌 Hey. Hey. Your terminal is beautiful.',
      '🐢 Typing at the speed of chill',
      '🍃 Herbal pair programming',
      '🎶 The keyboard has a rhythm. Can you hear it?',
      '🧘 Inner peace: 70%. Inner bugs: 30%.',
      '👀 Why are the brackets so… round?',
    ],
    mid: [
      '🍪 The munchies are compiling… 80%',
      '🤯 What if variables… have feelings?',
      '🍕 Pizza is an infinite loop of joy',
      '🐉 You explained recursion to yourself. Twice.',
      '😂 You laughed at a log message. Out loud.',
      '🫠 You stare at the cursor. It blinks back. Bonding.',
      '🌈 The rainbow brackets are speaking to you',
      '🤔 Is the bug in the code… or in all of us?',
      '🌀 You wrote a loop. Then got lost in it.',
      '💡 Your prompt is a poem now. Claude is moved.',
    ],
    late: [
      '🛋️ Couch lock imminent. Commit your work.',
      '😴 You’re not sleepy. You’re “meditating” on the code.',
      '🌌 You and the universe agree: bedtime',
      '🎧 Lo-fi beats to fall asleep to',
      '🫧 Your thoughts are bubbles. Let them float to bed.',
      '🌿 The joint has spoken: sleep',
      '🔁 You read the same line 6 times. Bedtime.',
      '🧾 Tomorrow: read what you wrote. Laugh. Delete.',
      '📝 Whatever you named that variable — rename it tomorrow',
      '🐌 Typing speed: one letter per giggle',
    ],
  },
  ar: {
    early: [
      '🌿 لفّة مشدودة، كود مرخي',
      '🛸 إقلاع. هيوستن، عنا فايبز.',
      '🌀 الكود شكله… متموّج. عادي.',
      '🎨 ألوان الكود صارت أحلى بـ40%',
      '😌 اسمع. اسمع. التيرمنال تبعك حلو كتير.',
      '🐢 عم تكتب بسرعة الروقان',
      '🍃 برمجة بالأزواج… بالأعشاب',
      '🎶 للكيبورد إيقاع. سامعه؟',
      '🧘 سلام داخلي: 70%. بقّ داخلي: 30%.',
      '👀 ليش الأقواس… مدوّرة هيك؟',
    ],
    mid: [
      '🍪 الجوعة عم تتحمّل… 80%',
      '🤯 طب إذا المتغيّرات… إلها مشاعر؟',
      '🍕 البيتزا لوب لا نهائي من السعادة',
      '🐉 شرحت الـrecursion لحالك. مرتين.',
      '😂 ضحكت على رسالة لوغ. بصوت عالي.',
      '🫠 بتبحلق بالمؤشر. وهو بيرمّشلك. علاقة.',
      '🌈 الأقواس الملوّنة عم تحكي معك',
      '🤔 البقّ بالكود… ولا فينا كلنا؟',
      '🌀 كتبت لوب. وبعدين ضعت جوّاه.',
      '💡 البرومبت تبعك صار قصيدة. كلود تأثّر.',
    ],
    late: [
      '🛋️ الكنباية رح تبلعك. اعمل كوميت.',
      '😴 إنت مش نعسان. إنت «بتتأمّل» بالكود.',
      '🌌 إنت والكون متّفقين: وقت النوم',
      '🎧 لو-فاي لتنام عليه',
      '🫧 أفكارك فقاقيع. خلّيها تطير عالتخت.',
      '🌿 الجوينت حكى: نام',
      '🔁 قريت نفس السطر 6 مرات. وقت النوم.',
      '🧾 بكرا اقرا شو كتبت. اضحك. وامحي.',
      '📝 شو ما سمّيت هالمتغيّر — غيّر اسمه بكرا',
      '🐌 سرعة الكتابة: حرف مع كل ضحكة',
    ],
  },
  he: {
    early: [
      '🌿 גלגול הדוק, קוד משוחרר',
      '🛸 המראה. יוסטון, יש לנו וייבים.',
      '🌀 הקוד נראה… גלי. זה נורמלי.',
      '🎨 הצבעים של הקוד נהיו יפים ב־40%',
      '😌 תקשיב. תקשיב. הטרמינל שלך יפהפה.',
      '🐢 מקליד במהירות של צ׳יל',
      '🍃 פיר פרוגרמינג… צמחי',
      '🎶 למקלדת יש קצב. אתה שומע?',
      '🧘 שקט פנימי: 70%. באגים פנימיים: 30%.',
      '👀 למה הסוגריים כל כך… עגולים?',
    ],
    mid: [
      '🍪 המאנצ׳יז בטעינה… 80%',
      '🤯 מה אם למשתנים… יש רגשות?',
      '🍕 פיצה היא לולאה אינסופית של אושר',
      '🐉 הסברת לעצמך רקורסיה. פעמיים.',
      '😂 צחקת מהודעת לוג. בקול.',
      '🫠 אתה בוהה בסמן. הוא מהבהב בחזרה. קשר.',
      '🌈 הסוגריים הצבעוניים מדברים איתך',
      '🤔 הבאג בקוד… או בכולנו?',
      '🌀 כתבת לולאה. ואז הלכת בה לאיבוד.',
      '💡 הפרומפט שלך נהיה שיר. קלוד התרגש.',
    ],
    late: [
      '🛋️ הספה עומדת לבלוע אותך. תעשה קומיט.',
      '😴 אתה לא עייף. אתה ״עושה מדיטציה״ על הקוד.',
      '🌌 אתה והיקום מסכימים: לישון',
      '🎧 לו־פיי להירדם עליו',
      '🫧 המחשבות שלך בועות. תן להן לצוף למיטה.',
      '🌿 הג׳וינט אמר את דברו: לישון',
      '🔁 קראת את אותה שורה 6 פעמים. לישון.',
      '🧾 מחר תקרא מה כתבת. תצחק. תמחק.',
      '📝 איך שלא קראת למשתנה הזה — תשנה מחר',
      '🐌 מהירות הקלדה: אות אחת לכל צחקוק',
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
    '🔮 Tomorrow-you will review this code. Be kind to them.',
  ],
  ar: [
    '🍁 الساعة {time} يا صاحبي… حتى البقّ نام',
    '🦉 بعد نص الليل ما بيسهر غير البوم وصاحب المناوبة',
    '😴 حتى القدّاحة عم تتثاوب',
    '🕯️ ولا إشي منيح بيندمج بعد الساعة 1',
    '🛌 تختك فتح تيكت: المستخدم مفقود من الساعة {time}',
    '🔮 إنت تبع بكرا رح يراجع هالكود… ارحمه',
  ],
  he: [
    '🍁 השעה {time}, אחי. אפילו הבאגים הלכו לישון.',
    '🦉 אחרי חצות ערים רק ינשופים ותורנים',
    '😴 אפילו המצית מפהק',
    '🕯️ שום דבר טוב לא עולה למיין אחרי אחת בלילה',
    '🛌 המיטה שלך פתחה טיקט: משתמש נעדר מאז {time}',
    '🔮 אתה של מחר יעשה ריוויו לקוד הזה. תרחם עליו.',
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

// دفعة تالتة لنكت الليل (المجموع 42 بكل لغة — أكتر من نَفَسات سيجارة كاملة، فما في تكرار).
const LATE_NIGHT: Record<Lang, readonly string[]> = {
  en: [
    '🧛 {time}? Even vampires call that late.',
    '🍁 Fun fact: {time} is not a coding hour',
    '🌃 It’s {time}. The street lights are judging you.',
    '📵 Your phone went to sleep before you. Your phone.',
    '🦉 The owls want their shift back',
    '👽 Aliens visit at {time}. Act natural.',
    '🧠 Your brain at {time}: “what is a variable?”',
    '🔕 Even the notifications stopped. Take the hint.',
    '💤 Your dreams started without you',
    '🥛 Late-night commits age like milk',
    '🫣 At {time}, every bug looks like a feature',
    '🛏️ {time} and your bed is still made. Tragic.',
    '🧟 Brains… need… sleep…',
    '🚨 Sleep police! Step away from the keyboard.',
    '🐞 At {time}, the only bugs awake are yours',
    '☠️ Code written at {time} haunts you at 10am',
    '📖 Tomorrow-you will read this code out loud at standup',
    '🙃 Your eyes are open. Your brain left at midnight.',
    '🛌 Your pillow thinks you’re cheating on it',
    '🤖 Claude never sleeps. You’re not Claude.',
    '🔥 git push at {time}? Bold. Very bold.',
    '😵 At {time}, “quick fix” means “new bug”',
    '📉 Your IQ drops 10 points an hour after midnight',
    '🧯 Nothing written at {time} survives code review',
  ],
  ar: [
    '🧛 الساعة {time}؟ حتى مصّاصين الدما شايفينها متأخرة',
    '🍁 معلومة: الساعة {time} مش ساعة برمجة',
    '🌃 الساعة {time}. أعمدة الضو عم تحكم عليك.',
    '📵 تلفونك نام قبلك. تلفونك!',
    '🦉 البوم بدّه شفته ترجعله',
    '👽 الفضائيين بيزوروا الساعة {time}. تصرّف طبيعي.',
    '🧠 مخّك الساعة {time}: «شو يعني متغيّر؟»',
    '🔕 حتى الإشعارات وقفت. افهمها.',
    '💤 أحلامك بلّشت بدونك',
    '🥛 كوميتات آخر الليل بتخرب متل الحليب',
    '🫣 الساعة {time} كل بقّة بتبيّن ميزة',
    '🛏️ الساعة {time} وتختك لسا مرتّب. مأساة.',
    '🧟 مخ… بدّه… نوم…',
    '🚨 شرطة النوم! ابعد عن الكيبورد.',
    '🐞 الساعة {time} البقّ الوحيد الصاحي هو تبعك',
    '☠️ كود الساعة {time} رح يطاردك الساعة 10 الصبح',
    '📖 إنت تبع بكرا رح يقرا هالكود بصوت عالي بالاجتماع',
    '🙃 عيونك مفتّحة. مخّك روّح من نص الليل.',
    '🛌 مخدّتك فاكرة إنك عم تخونها',
    '🤖 كلود ما بينام. إنت مش كلود.',
    '🔥 تعمل push الساعة {time}؟ جرأة. جرأة كتير.',
    '😵 الساعة {time}: «تصليح سريع» يعني «بقّة جديدة»',
    '📉 ذكاءك بينزل 10 نقاط كل ساعة بعد نص الليل',
    '🧯 ولا إشي بتكتبه الساعة {time} بيعدّي المراجعة',
  ],
  he: [
    '🧛 השעה {time}? אפילו ערפדים חושבים שזה מאוחר',
    '🍁 עובדה: {time} זו לא שעה לקוד',
    '🌃 השעה {time}. פנסי הרחוב שופטים אותך.',
    '📵 הטלפון שלך הלך לישון לפניך. הטלפון!',
    '🦉 הינשופים רוצים את המשמרת שלהם בחזרה',
    '👽 חייזרים מבקרים ב־{time}. תתנהג רגיל.',
    '🧠 המוח שלך ב־{time}: ״מה זה משתנה?״',
    '🔕 אפילו ההתראות הפסיקו. תבין את הרמז.',
    '💤 החלומות שלך התחילו בלעדיך',
    '🥛 קומיטים של לילה מחמיצים כמו חלב',
    '🫣 ב־{time} כל באג נראה כמו פיצ׳ר',
    '🛏️ השעה {time} והמיטה עדיין מסודרת. טרגדיה.',
    '🧟 מוח… צריך… שינה…',
    '🚨 משטרת השינה! תתרחק מהמקלדת.',
    '🐞 ב־{time} הבאגים היחידים שערים הם שלך',
    '☠️ קוד שנכתב ב־{time} ירדוף אותך בעשר בבוקר',
    '📖 אתה של מחר יקרא את הקוד הזה בקול בדיילי',
    '🙃 העיניים פתוחות. המוח הלך בחצות.',
    '🛌 הכרית שלך חושבת שאתה בוגד בה',
    '🤖 קלוד לא ישן. אתה לא קלוד.',
    '🔥 פוש ב־{time}? אמיץ. מאוד אמיץ.',
    '😵 ב־{time} ״תיקון מהיר״ זה ״באג חדש״',
    '📉 ה־IQ שלך יורד ב־10 נקודות לכל שעה אחרי חצות',
    '🧯 שום דבר שתכתוב ב־{time} לא יעבור ריוויו',
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

// كل الدفعات مخلوطة بترتيب ثابت (نفسه كل مرة) — عشان النكت الجديدة تتوزّع بين القديمة،
// مش تيجي كتلة وحدة. بتنحسب مرة وحدة لكل لغة ومرحلة.
const POOLS = new Map<string, readonly string[]>()

function mixed(key: string, make: () => string[]): readonly string[] {
  const hit = POOLS.get(key)
  if (hit) return hit
  const rank = (t: string) => {
    let h = 5381
    for (const c of t) h = (h * 33 + (c.codePointAt(0) ?? 0)) % 1_000_003
    return h
  }
  const pool = make().sort((a, b) => rank(a) - rank(b))
  POOLS.set(key, pool)
  return pool
}

// earlier = كم سيجارة خلصت اليوم قبل هاي.
export function tagline(kind: Style, ln: Lang, puffs: number, now: number, seed = 0, earlier = 0): string {
  if (puffs >= PUFFS) return KINDS[kind].out[ln]
  const phase = nightPhase(now)
  const time = clockText(now, ln)
  if (phase === 'dawn' && puffs === 0) return DAWN[ln].replace('{time}', time)
  if (puffs === 1 && earlier > 0) return freshLine(kind, ln, earlier + 1)
  if (phase !== 'day') {
    const night = mixed(`night/${ln}`, () => [...NIGHT[ln], ...MORE_NIGHT[ln], ...LATE_NIGHT[ln]])
    return (night[(puffs + seed) % night.length] ?? '').replace('{time}', time)
  }
  if (puffs === 0) return KINDS[kind].lit[ln]
  const f = puffs / PUFFS
  const stage = f < 1 / 3 ? 'early' : f < 2 / 3 ? 'mid' : 'late'
  const pool = mixed(`${kind}/${ln}/${stage}`, () => [
    ...LINES[ln][stage],
    ...MORE_LINES[ln][stage],
    ...FUN_LINES[ln][stage],
    ...(kind === 'joint' ? JOINT_LINES[ln][stage] : []),
  ])
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

// دفعة تالتة: 30 تحذير كمان بكل لغة + 6 للجوينت (المجموع 60 + 12) — كلهم عن الكود وكلود والسهر.
const EXTRA_WARNINGS: Record<Lang, { all: readonly string[]; joint: readonly string[] }> = {
  en: {
    all: [
      'Smoking while prompting doubles your token usage. Probably.',
      'Claude has seen your code. Claude is concerned.',
      'May cause a sudden belief that you are a senior engineer',
      'Prolonged use leads to explaining bugs to a rubber duck',
      'Every cigarette adds a TODO you will never finish',
      'Smoking in the codebase leaves stains in git blame',
      'Contains 0% vitamins and 100% semicolons',
      'Your keyboard is 40% ash by now',
      'May cause “quick refactors” that last three days',
      'Not recommended for people with deadlines',
      'Causes chronic “let me just try one thing”',
      'Exposure may lead to branches named fix-fix-final',
      'May cause a sudden urge to write documentation. Rare.',
      'Your laptop fan is breathing harder than you',
      'Inhaling YAML can cause indentation disorders',
      'Keep away from open tickets and open flames',
      'May cause you to say “the AI wrote it” in code review',
      'Users report 300% more “hmm” per minute',
      'Causes sudden memory loss of why you opened this file',
      'Mixing with energy drinks voids your warranty',
      'Do not smoke near the database',
      'Side effects: sleeping at 4am, waking at 2pm',
      'This cigarette is better tested than your code',
      'Can lead to arguing with an AI at 2am. And losing.',
      'Prompts written after 2am may contain typos and regret',
      'Claude will remember this conversation. Until /clear.',
      'Causes acute stand-up meeting anxiety',
      'May cause you to say “one more prompt” 40 times',
      'Causes saying “just this once” every single time',
      'Smoking near the server room takes the site down',
    ],
    joint: [
      'May cause you to believe the code is alive',
      'Do not merge anything you found hilarious',
      'Comments written high may contain poetry',
      'Causes 3am ideas that sound genius. They are not.',
      'May cause refactoring, then forgetting what you refactored',
      'Variables may end up named after snacks',
    ],
  },
  ar: {
    all: [
      'التدخين وقت البرومبت بيضاعف استهلاك التوكنز. غالباً.',
      'كلود شاف الكود تبعك. كلود قلقان.',
      'بيسبّب شعور مفاجئ إنك سينيور',
      'الاستعمال الطويل بيخلّيك تشرح البقّ لبطة مطاطية',
      'كل سيجارة بتزيد TODO عمرك ما رح تخلّصها',
      'التدخين بالكود بيترك بقع بالـgit blame',
      'بيحتوي على 0% فيتامينات و100% فواصل منقوطة',
      'الكيبورد تبعك صار 40% رماد',
      'بيسبّب «ريفاكتور سريع» بيطوّل تلات أيام',
      'مش منصوح فيه للناس اللي عندهم ديدلاين',
      'بيسبّب حالة مزمنة من «خلّيني أجرّب إشي واحد»',
      'بيخلّيك تسمّي البرانشات fix-fix-final',
      'ممكن يسبّب رغبة مفاجئة تكتب توثيق. نادر.',
      'مروحة اللابتوب عم تتنفّس أصعب منك',
      'استنشاق الـYAML بيسبّب اضطرابات بالمسافات',
      'يُحفظ بعيداً عن التيكتات المفتوحة والنار',
      'بيخلّيك تقول «الذكاء الصناعي كتبها» بالمراجعة',
      'المستخدمين بلّغوا عن زيادة 300% بـ«همم» بالدقيقة',
      'بيسبّب نسيان مفاجئ ليش فتحت هالملف',
      'خلطه مع مشروبات الطاقة بيلغي الكفالة',
      'ممنوع التدخين جنب قاعدة البيانات',
      'الأعراض الجانبية: نوم الساعة 4 الصبح وصحيان الساعة 2 الضهر',
      'هالسيجارة مفحوصة أكتر من الكود تبعك',
      'بيوصّلك تتناقر مع ذكاء صناعي الساعة 2 بالليل. وتخسر.',
      'البرومبتات بعد الساعة 2 بالليل فيها أغلاط وندم',
      'كلود رح يتذكّر هالمحادثة. لحد /clear.',
      'بيسبّب قلق حاد قبل اجتماع الصبح',
      'بيخلّيك تقول «برومبت كمان وبس» 40 مرة',
      'بيخلّيك تقول «بس هالمرة» كل مرة',
      'التدخين جنب غرفة السيرفرات بيوقّع الموقع',
    ],
    joint: [
      'بيخلّيك تآمن إنّ الكود عايش',
      'لا تدمج إشي ضحّكك كتير',
      'التعليقات اللي بتنكتب وإنت مسطول ممكن يكون فيها شعر',
      'بيسبّب أفكار الساعة 3 بالليل بتبيّن عبقرية. مش عبقرية.',
      'بيخلّيك تعمل ريفاكتور وتنسى شو عملتله ريفاكتور',
      'ممكن تسمّي المتغيّرات على أسامي سناكات',
    ],
  },
  he: {
    all: [
      'עישון תוך כדי פרומפטים מכפיל את צריכת הטוקנים. כנראה.',
      'קלוד ראה את הקוד שלך. קלוד מודאג.',
      'עלול לגרום לתחושה פתאומית שאתה סניור',
      'שימוש ממושך גורם להסביר באגים לברווז גומי',
      'כל סיגריה מוסיפה TODO שלעולם לא תסיים',
      'עישון בקוד משאיר כתמים ב־git blame',
      'מכיל 0% ויטמינים ו־100% נקודה־פסיק',
      'המקלדת שלך כבר 40% אפר',
      'עלול לגרום ל״ריפקטור קטן״ שנמשך שלושה ימים',
      'לא מומלץ לאנשים עם דדליין',
      'גורם למקרה כרוני של ״רק אנסה דבר אחד״',
      'גורם לקרוא לבראנצ׳ים fix-fix-final',
      'עלול לגרום לדחף פתאומי לכתוב תיעוד. נדיר.',
      'המאוורר של הלפטופ נושם יותר כבד ממך',
      'שאיפת YAML גורמת להפרעות הזחה',
      'להרחיק מטיקטים פתוחים ומאש גלויה',
      'עלול לגרום לך להגיד ״ה־AI כתב את זה״ בקוד ריוויו',
      'משתמשים מדווחים על 300% יותר ״הממ״ לדקה',
      'גורם לשכוח פתאום למה פתחת את הקובץ הזה',
      'שילוב עם משקאות אנרגיה מבטל את האחריות',
      'אין לעשן ליד מסד הנתונים',
      'תופעות לוואי: לישון בארבע לפנות בוקר ולקום בשתיים בצהריים',
      'הסיגריה הזאת בדוקה יותר מהקוד שלך',
      'מוביל לוויכוח עם בינה מלאכותית בשתיים בלילה. ולהפסיד.',
      'פרומפטים אחרי שתיים בלילה עלולים להכיל טעויות וחרטה',
      'קלוד יזכור את השיחה הזאת. עד /clear.',
      'גורם לחרדה חריפה לפני הדיילי',
      'גורם להגיד ״רק עוד פרומפט אחד״ 40 פעם',
      'גורם להגיד ״רק הפעם״ כל פעם',
      'עישון ליד חדר השרתים מפיל את האתר',
    ],
    joint: [
      'עלול לגרום לך להאמין שהקוד חי',
      'אל תמזג שום דבר שהצחיק אותך יותר מדי',
      'הערות שנכתבו מסטול עלולות להכיל שירה',
      'גורם לרעיונות של שלוש בלילה שנשמעים גאוניים. הם לא.',
      'גורם לעשות ריפקטור ולשכוח מה ריפקטרת',
      'משתנים עלולים לקבל שמות של נשנושים',
    ],
  },
}

// كل التحذيرات بالترتيب، بادئين من تحذير هالنَّفَس — الرسمة بتلفّ عليهم لحالها.
export function warnings(kind: Style, ln: Lang, puffs: number, seed = 0): string[] {
  const w = WARNINGS[ln]
  const m = MORE_WARNINGS[ln]
  const x = EXTRA_WARNINGS[ln]
  const all = [...w.all, ...m.all, ...x.all]
  const pool = kind === 'joint' ? [...w.joint, ...m.joint, ...x.joint, ...all] : all
  // خطوة 7 (ما بتقسم 60 ولا 72) — عشان يمرّوا كل التحذيرات قبل ما يتكرّروا.
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
