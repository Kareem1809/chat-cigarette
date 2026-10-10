# 🚬 Chat Cigarette — سيجارة المحادثة

مود لـ **Claude Code**: أول كل شات بتنولّع سيجارة فوق خانة الكتابة، وكل رسالة بتبعتها لكلود = نَفَس.
لما تخلص السيجارة، كلود نفسه بيقلك: **It's time to get some rest 🍁**

A Claude Code mod for smokers (and everyone else) who want to spend less time at the computer: a cigarette burns down above the prompt, one puff per message. When it's finished, Claude tells you it's time to rest.

![burning](docs/burning.png)
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
| 🌬️ وكلود عم يشتغل | الدخان بيصير أسرع والجمرة بتنبض |
| ⏳ تحتها | نسبة حدّ الـ5 ساعات وقديش ضايل ليتجدد |
| 🍁 آخر نَفَس | كلود بيجاوبك وبيختم بـ «It's time to get some rest 🍁» + إشعار |
| 🧹 `/clear` | سيجارة جديدة |

- **Desktop app:** an animated SVG (smoke, glowing ember, puff dots).
- **Terminal:** a coloured text cigarette `▐▓▓▓▓▌██████▌▒░ ~  7/20`.

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
