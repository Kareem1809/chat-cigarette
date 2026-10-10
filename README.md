# 🚬🌿 Chat Cigarette — سيجارة المحادثة

مود لـ **Claude Code** فيه نوعين — **سيجارة 🚬** و**جوينت 🌿** — وبتبدّل بيناتهم بأمر `/smoke`.
أول كل شات بتنولّع فوق خانة الكتابة، وكل رسالة بتبعتها لكلود = نَفَس.
لما تخلص السيجارة، كلود نفسه بيقلك: **It's time to get some rest 🍁**

A Claude Code mod for smokers (and everyone else) who want to spend less time at the computer: a cigarette — or a joint, `/smoke` switches — burns down above the prompt, one puff per message. When it's finished, Claude tells you it's time to rest.

![cigarette](docs/burning.png)
![joint](docs/joint.png)
![burned out](docs/burned-out.png)

## التركيب — Install

افتح تيرمنال، شغّل `claude`، واكتب جوّاته:

```
/plugin install chat-cigarette --marketplace Kareem1809/chat-cigarette
```

بعدها اضغط `y` (إضافة الماركتبليس) و`Enter` (اختيار الـscope). خلص، بيشتغل فوراً — وبكل جلسة جديدة كمان، حتى بتاب Code بتطبيق Claude للديسكتوب.

> The install line works in a terminal `claude` session (a recent Claude Code with function-hook mods — built and tested on 2.1.295). Once installed at user scope it also loads in the desktop app's Code tab.

## كيف بيشتغل — How it works

| | |
|---|---|
| 🔥 أول الشات | سيجارة جديدة، 20 نَفَس |
| 💬 كل رسالة منك | نَفَس — السيجارة بتقصر والنقطة بتولّع (الإشعارات ورسائل البرامج ما بتنحسب) |
| 💬 تحتها | جملة جديدة مع **كل** رسالة (18 جملة: بالأول خفيفة، بالنص «قوم تحرّك»، بالآخر «جهّز حالك ترتاح») |
| 🌆 السما | بتبلّش غروب وبتغمق لليل مع كل نَفَس، والنجوم بتبيّن أكتر |
| ⏳ وتحتها | `⏳ 5-hour limit ━━━━━━─────── 42% · resets in 2h 15m` — أخضر ← برتقالي ← أحمر |
| 🍁 آخر نَفَس | كلود بيجاوبك وبيختم بـ «It's time to get some rest 🍁» + إشعار |
| 🧹 `/clear` | سيجارة جديدة |
| 🔁 `/smoke` | بدّل بين السيجارة والجوينت (`/smoke joint` · `/smoke cigarette`) |
| 🔤 `/smokear` · `/smokeen` | الكتابة عربي أو إنجليزي (الافتراضي: سيجارة بالإنجليزي) — وكل اختيار بينحفظ للجلسات الجاية |

- **Desktop app:** an animated SVG (smoke, glowing ember, puff dots). On **Windows** it is drawn as a still image: the animated version reloads on every change and blinks out for a moment there.
- **Terminal:** a coloured text cigarette `▐▓▓▓▓▌██████▌▒░ ~  7/20` or joint `▐≋≋≋▃▄▅▆▇▌▒░ ~`.
- **Both:** a new status line with every message (English by default, `/smokear` for Arabic, `/smokeen` back) and the 5-hour limit, `⏳ 5-hour limit ━━━━━━─────── 42% · resets in 2h 15m`.
- The sky goes from dusk to night as it burns.

## التحديث — Update

لما ينزل إصدار جديد، من تيرمنال عادي (برّا `claude`):

```bash
claude plugin marketplace update chat-cigarette
claude plugin update chat-cigarette@chat-cigarette
```

وبعدين سكّر Claude وافتحه من جديد.

## بدك سيجارة أطول أو أقصر؟

بـ [`hooks/register.tsx`](hooks/register.tsx) غيّر الرقم:

```ts
const PUFFS = 20
```

## للمطوّرين — Development

```bash
claude plugin validate .
claude plugin test .
```

MIT License.
