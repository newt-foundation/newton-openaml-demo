---
name: "newton-demo-design"
description: "Visual and copy rules for building or restyling any Newton demo, the demo library, or a case study page: black and white with tint (Coal, Bone), GT Sectra Fine headlines, the one-screen layout, verdict states, copy and ship checklist."
---

# Newton demo design

The system the Newton Protocol demos share (sanctions, Lazarus Scan, Pool Guard, OpenAML). It comes from the Newton Explorer token contract used in Lazarus Scan (`design/tokens.css`) and the sanctions demo's `DESIGN-SYSTEM.md`, plus a few rules borrowed from `landing-page-design` in [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills) (MIT).

The demos are educational. Their job is to make one Newton Protocol decision legible: what was checked, against what data, who signed it, and what happens next. Each demo is dark and cinematic, in the Newton brand palette (newt.foundation/brand), used black and white: Coal and Bone with film grain, colour only as a tint, a glass nav, and one screen that changes state: a sparse form beside a 3D visual of the real data, the running explainer, then the verdict. Conversion patterns (free trials, pricing, risk reversal, testimonial walls) do not apply. The reference build is the OpenAML demo (`components/Demo.tsx`, `components/DataGlobe.tsx`, `components/CheckFlow.tsx`, the dark layer at the end of `app/globals.css`).

When a rule here conflicts with a framework default or another design skill, this file wins. When the user's explicit request conflicts with a rule, the user wins. When restyling an existing demo, read its own tokens file first; if it differs from this one, ask which wins before changing it.

## 1. Three rules the system exists to serve

1. **Never render a verdict the response did not contain.** An unreadable answer is "No decision", never "Allowed". One demo once showed green for every task because undefined fell through to the happy branch.
2. **The signed verdict decides; anything else only explains.** Lookups done after the verdict (which list matched, which tier) are labelled as unsigned. If they disagree with the verdict, the page says so instead of letting the reader reconcile it.
3. **Colour carries meaning, so it cannot also carry interaction.** Outcome tones are outcomes. Interaction is ink.

## 2. Colour

**Black and white, with tint.** Coal `#010101` and Bone `#FEFDF9` carry the page: background, text, the primary button, the logo, the globe's common dots and scan ring, the lit step, every ambient light (a faint Bone glow at most 8%, or none). Backgrounds stay flat. The one gradient on text is the hero headline, left to right Bone `#FEFDF9` to `#A8A295`.

**Colour appears only as a tint, where it means something:** a soft wash behind a thing, with text in the lighter tint of the same hue. Red tint for blocked (a Blocked verdict washes the whole screen; a control set to Block gets the wash and red text), green tint for allowed, grey for no decision. No neon: no glowing dots, bright edges or `text-shadow` on tinted things. At rest the only saturated colour is the handful of severe-tier dots on the globe, in the demo red.

**Sand `#D6B376`** is the third brand colour and is used sparingly: the picked sample wallet, and stale-data caution. It is never a glow.

**Neutrals**

| Token | Value | Use |
|---|---|---|
| page (Coal) | `#010101` | Page background |
| ink (Bone) | `#FEFDF9` | Text, primary button fill, focus ring, logo |
| ink hover | `#E9E6DC` | Hover of the Bone button |
| accent (Sand) | `#D6B376` | The picked sample wallet; stale-data caution |
| secondary | `#A1A1A6` | Body copy, labels (7.6:1) |
| tertiary | `#86868B` | Hints, metadata, captions (5.4:1) |
| disabled | `#5A5A5E` | Disabled text |
| control | `#3A3A3D` | Input borders at rest |
| hairline | `#262628` | Dividers, outline buttons |
| field | `#1A1A1C` | Segmented track, hover fills |
| raised | `#2A2A2D` | Selected segment |
| input | `#050506` | Field fill |
| glass | white at 3.5%, edge white at 9%, `backdrop-filter: blur(20px) saturate(1.2)`, inset top highlight white at 6% | Stage, cards, chips, nav |

**Outcome tones.** The wash is the light-theme colour at about 30% over black; the text is a lighter tint of the same hue so it reads on black (all clear 4.5:1 on their wash).

| Outcome | Text | Wash | Glow and edge |
|---|---|---|---|
| Pass, allowed, clear | `#62D6A8` | `rgba(11,110,79,0.28)` | `#2FBF85` |
| **Deny, blocked, not authorized (brand red)** | `#F2896B` | `rgba(159,54,25,0.30)`, the brand red `#9F3619` | `#E0552E` |
| Caution, stale data (Sand) | `#D6B376` | `rgba(214,179,118,0.16)` | `#D6B376` |
| Neutral, no decision, unavailable | `#A1A1A6` | `#1A1A1C` | none |

- The demo red `#9F3619` is the base of every deny wash and the glow on a Blocked headline. Its 13° hue carries through the text tint `#F2896B` and the edge `#E0552E`. Never orange for "no", and never red for atmosphere.
- Input errors use the deny text colour.
- **A fail-closed denial is grey, not red.** When the policy denies because it could not screen, painting it red beside "Blocked" accuses the counterparty. Use the neutral tone, no glow, and say the system refused to guess.
- Verdict headlines are set in their tone with no glow. The screen behind them takes a large soft wash of the same hue (red at about 42% fading out, green at about 36%); neutral states get none.

## 3. Type

Two brand faces (newt.foundation/brand): **GT Sectra Fine LCG** for display and **Inter** for body. **JetBrains Mono** for addresses, hashes, task ids and numbers. Self host all three (no Google Fonts at build time).

- **GT Sectra Fine, Regular 400, headlines only:** the hero headline, the tagline, the section title and the verdict and running headline. Never body text, labels, buttons or data. No italics. Fallback stack `"Iowan Old Style", Georgia, serif`.
- **Font files:** the web subset is `app/gt-sectra-fine-regular.woff2` in the OpenAML demo repo (Latin, about 23 KB), loaded with `next/font/local` as `--font-display`; `app/gt-sectra-fine-regular.woff` is the same face for `next/og` share images. Copy those two files into a new demo. The full family (Fine, Display and Text cuts, as `.otf`) is licensed to the Foundation by Grilli Type and is kept out of public repos; ask Alaz for the originals when another weight or a wider character set is needed, and subset it with `pyftsubset` before it ships.
- **Inter** weights 400 and 500 only.

| Role | Size | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|
| hero | `clamp(3.25rem, 1.5rem + 5.4vw, 5.75rem)` (52–92), GT Sectra Fine | 400 | 1.02 | -0.015em | Hero headline only, Bone to grey gradient text |
| tagline | `clamp(2rem, 1.1rem + 2.8vw, 3.25rem)` (32–52), GT Sectra Fine | 400 | 1.14 | -0.015em | The tagline reveal section |
| display | `clamp(2rem, 1.4rem + 1.6vw, 2.75rem)` (32–44), GT Sectra Fine | 400 | 1.1 | -0.015em | Verdict and running-state headline |
| title | `clamp(1.125rem, 1rem + 0.6vw, 1.25rem)` (18–20) | 500 | 1.2 | -0.01em | Page title |
| heading | 18px | 500 | 1.25 | -0.01em | Card heading |
| lead | 16px | 400 | 1.45 | 0 | Verdict reason, intro body |
| body | 14px | 400 | 1.45 | 0 | Default body |
| ui | 14px | 500 | 1.4 | 0 | Buttons, labels, row titles |
| caption | 12px | 400 | 1.4 | 0 | Metadata, hints |
| eyebrow | 12px | 500 | 1.4 | 0.08em uppercase | Section labels, nav lockup |
| data | 14px mono | 400 | 1.45 | 0 | Addresses, hashes |

- Labels are sentence case at 14px. Uppercase tracking only in the nav lockup and eyebrows.
- A timestamp is set in sans, not mono, so it does not compete with addresses.
- `text-wrap: balance` on headings, `text-wrap: pretty` on body, so no single word sits alone on a last line.
- Cap measure: 44ch for the verdict reason, 64ch for detail text.

## 4. Space, size, radius

**Space** (nothing in between): 4, 8, 12, 16, 20 (page padding), 24 (card padding), 32, 40, 48 (between major sections), then 64 and 80 for floors.

**Sizes:** touch target 44px, control 40px, small control 32px, large control 48px, address field 48px, icons 16 or 18px.

**Radius:** 12px controls (inputs, segments), 16px surfaces (cards, stage), 999px pill (nav, buttons, chips, badges).

- **Nested radius:** when a shape sits inside another with a gap under 32px, inner radius = outer radius minus the gap (only if the result is above 2).
- Borders are 1px, all the way round or not at all. Never on one side of a card.

**Horizontal inset:** `clamp(24px, 4vw, 48px)` inside every stage panel (console, running, verdict), so their contents share one left line and one right line.

## 5. Layout

**Page:** one screen. A floating nav, then the screen for the current state (the form beside the globe, running, or the verdict). Content sits in a 1440px column with `clamp(16px, 4vw, 48px)` side padding.

**Atmosphere:** film grain over the whole page (a fixed SVG `feTurbulence` overlay at 7% opacity, `pointer-events: none`), and at most a faint Bone glow behind the current screen (a radial gradient of Bone at 8% or less, blurred, behind content and never over text). When a verdict lands, that light becomes a large soft wash in the outcome's hue and pulses once.

**Floating glass nav:** fixed 16px from the top, centred with auto margins and `width: max-content` (never `left: 50%` plus a transform, which halves the width it can lay out in and pushes the logo out on phones). Pill shape, dark glass (`rgba(14,14,16,0.6)` over `backdrop-filter: blur(16px) saturate(1.4)`), white-at-10% border, deep shadow. Contents: the Bone Newton logo (`public/newton-logo-white.svg`, 18px, back to top), then, for a co-branded demo, a 1px hairline and the partner's mark and name on the same line at the same visual weight (OpenAML: the FINOS mark and wordmark, then "OpenAML" in Inter), then a pulsing dot plus "Sepolia" in secondary grey (caution colour and the age when data is stale). No button in the nav. **Logo rules from the brand page:** never recolour beyond the Coal and Bone versions, distort, outline, fade or add effects to the Newton mark, never use the wordmark without the symbol, and keep clear space of at least half the symbol's height on every side.

**First screen (the form beside the globe):** two columns from 1024px, and deliberately sparse: five things only. Left, with no card around it: the gradient headline on two lines; one line of context in secondary grey naming the data, its size and who signs; the rule; the wallet; the primary button. Right: the data globe over a faint Bone glow, with no caption (its description is its accessible label). Nothing else: no step numbers, no per-option descriptions, no helper lines, no eyebrow. Detail that does not fit goes in a tooltip or onto the globe. If the screen starts to feel crowded, cut content before shrinking type.

- **The rule** is a small label ("Block if the wallet is") over one row of on/off pills, one per option, any mix on at once (two per row on phones). On is Bone text on a faint red wash (about 16%) with a small flat red dot, no glow; off is grey text in an outline with a hollow dot. Each pill's meaning and real count are its tooltip and its accessible label.
- **The wallet** is a labelled field whose placeholder says "Paste an address, or pick one below", then the sample wallets as a quiet line of underlined text links ("Try one: clean · sanctioned · blocked · fraud · flagged", lowercase, the picked one in Sand). They must not look like the rule's pills: two rows of similar buttons with the same words is the main place a new visitor hesitates. One reserved line under them says what was picked or what is wrong.
- **The button** before a wallet is set is a Bone outline with dimmed text, never a grey block; it turns solid Bone when the check can run. The field starts empty: do not prefill a wallet.
- Say "the wallet" when the visitor enters one wallet, even if the policy also screens a sender they never see.

**Data globe (the first screen's 3D visual):** the demo's real dataset as a slowly turning sphere of 2,600 points on a canvas with its own projection (no 3D library). Every dot stands for the same number of records, and colours follow the real counts: the common tier dim Bone, the rare severe tiers in the demo red (`#E0552E`), so the picture is the true shape of the data. A Bone scan ring sweeps the globe and the red dots flare as it passes. The globe leans toward the pointer. **Labels are flat callouts, like map annotations:** plain text (name in Bone, real count in grey) on a short 1px rule in each of the four corners the globe leaves empty, with a thin leader running to a dot on the globe's edge. No pill, no tilt, no bobbing; they stay still while the globe turns. The dot is red when that option is blocked by the visitor's rule and a hollow ring when it is allowed; the label and leader brighten to full Bone when a wallet of that kind is picked, and the ring sweeps once and one dot of that kind flares. Pauses off screen and in background tabs; reduced motion draws one still frame. In one column (below 1024px) the globe is a small, dim backdrop behind the top right of the headline with no callouts. For a demo without a list dataset, pick the visual that is equally literal about its data.

**No tagline section.** The benefit statement is the one line of context under the headline.

**One screen, three states:** the first screen, the running state while operators check, the verdict at the end. Each replaces the last in place, with a short crossfade (a view transition where the browser has one, so the wallet address travels from the field to the running screen to the verdict). Nothing scrolls and nothing drops in like a modal.

**Running state:** two columns from 900px. Left: display headline "Checking the wallet" and a numbered explainer of the four things that happen (the transfer is sent, operators run the policy, they read the data, a quorum signs). Right: the check diagram. The step the diagram is on is lit with a Bone outline; the rest sit at 45% opacity. The screen stays for at least one full pass of the diagram (7s) even when the answer comes back sooner, so there is time to read it; reduced motion skips the wait and lights every step. On phones it shows one step at a time above a smaller diagram and must fit one screen. Never a percentage: the steps show the order of events, not live progress.

**Check diagram:** near-black boxes (`#0E0E10`, `#2A2A2D` outline) for the transfer (short address), Newton Protocol operators (four dots), the data source with its version or commit, and the verdict signed on Sepolia, joined by hairlines with marching dashes. Pulses travel transfer to operators, out to the data and back, then to the verdict; boxes outline in white as a pulse reaches them; operator dots light in turn; pulses are white with a soft glow. SVG `animateMotion` (no JS clock), 5.2s loop at rest, 7s while checking. A wide layout from 640px and a stacked one below. Every box must be true of the deployed policy.

**No footer, no eyebrow over the hero, no scrolling.** The demo is one screen at every window size, phones included: the page is exactly the window (`html, body { overflow: hidden }`), and each state (form, running, verdict) is laid out in the space under the nav. Layouts are designed to fit at common sizes (1920×1080, 1440×900, 1536×864, 1280×800, 768×1024, 390×844) without help; below that, `<Fit>` in `Demo.tsx` lays the screen out wider and scales it down until it fits, never below 0.5. On one-column layouts the globe is a dim backdrop behind the headline and the verdict shows the rule as one line ("Block Sanctioned, Blocked and Fraud.") with "Check another wallet"; the rule is changed on the first screen. Credit for the data lives in the nav's co-brand and the repo, not in a footer. Before shipping, measure every state at those sizes: `document.documentElement.scrollHeight` must equal `innerHeight`.

**Verdict screen, right column (the rule, live):** the same options as full switches in one bordered list (name, real count, one line on what it means, "Block" or "Allow"; a row set to Block is Bone text on a faint red wash, and the toggle carries the red), "Run again with this rule" (enabled once a switch differs from the checked rule) and "Check another wallet". Each choice must map to a client whose on-chain params hold that rule; the choice is never passed to the policy as an argument. Under the buttons, **Earlier checks**: up to three previous checks of this visit, one line each (short address, "same wallet," when it is, the rule in a few words, the outcome in its colour linking to its attestation), so the same wallet's different answers under different rules can be compared. One check gives one signed verdict and one attestation link. Under the Explorer button a small line shows what was signed: "Task 0x1234…abcd signed by Newton Protocol operators on Ethereum Sepolia".

**The rule comes first.** Whatever the layout, the visitor decides what to block before choosing who to pay: the rule sits above the wallet, then the action. The primary action must stay above the fold at 1280×800, 1536×864 and 1440×900. The hint line under the wallet always keeps its room, so picking a wallet never resizes the form. On short, wide windows drop the context line and cap the globe by window height (`calc(100dvh - 190px)`) so the controls stay full size instead of the whole screen being scaled down.

**Verdict panel (max 36–40rem, centred):**

```
headline (outcome tone)
reason (lead, 44ch)
[what matched: chips, only for real matches]
[signed verdicts and attestation links]
──── rule ────  [stale notice] · New check
party (full address, Copy) · Decided (timestamp)
```

Nothing sits above the headline except the "Signed verdict" eyebrow. The verdict word is `clamp(2.75rem, 1.9rem + 2.2vw, 3.75rem)` (44 to 60px): read first, but never so large that the reason beside it stops carrying the screen. Detail never rearranges the verdict. The address is shown whole, never truncated, because people screenshot this panel as the record.

**Breakpoints:** 640 / 768 / 1024 (Tailwind). Below 1024 the first screen and the verdict become one column. Below 640 the diagram switches to its stacked layout, segments wrap into rows, parties stack, buttons go full width.

## 6. Components

- **Primary button:** white pill, black `ui` text, 44px tall (48px and 16px text in the hero, 36px in the nav). Disabled is the field fill with disabled text. While a check runs the stage switches to the running state rather than spinning the button.
- **Outline button:** pill, 1px hairline, ink text, hover to sunken fill.
- **Field:** visible label above (not just a placeholder), `#050506` fill, 1px `#3A3A3D` border, 12px radius, mono text. Truncated to `0x1234…5678` at rest, whole on focus. Error: deny-colour border and an inline message.
- **Segmented picks (radio group):** `#1A1A1C` track with 4px padding; selected option is a `#2A2A2D` raised pill with an inset top highlight. Arrow keys move, only the selected option is tabbable.
- **Tag (a fact):** soft wash, no border, caption type. **Button (an action):** bordered or filled. They must never look the same.
- **Icons:** Phosphor. Never Material.

## 7. States

Every interactive element ships with all of these:

- **Hover:** background shift (sunken) or ink to ink hover.
- **Active:** a slightly darker press fill.
- **Focus:** `2px solid` ink ring, 2px offset, on every interactive element. Neutral, never a tone colour.
- **Loading:** the sweep band or a skeleton shaped like the real content. No spinners on the main action.
- **Empty:** nothing prefilled. A demo that arrives with an address in the box invites pressing the button without reading.
- **Error:** inline, specific, says what failed and what to do. Never `alert()`. Gateway and server details go to the server log, never to the visitor.
- **Stale input:** if the visitor edits the field after a verdict, dim the verdict and say "Recipient changed · run again".

## 8. Motion

**Pace: take your time.** Every entrance, landing, screen change and timed hold runs at 1.5× the durations and staggers listed here, set by one knob in each place: `--oa-slow: 1.5` in CSS (write durations as `calc(0.9s * var(--oa-slow))`, delays as `calc(var(--d) * var(--oa-slow))`) and `MOTION = 1.5` in `lib/ds.ts` for timers, the globe sweep and the check diagram's loop. Keep the two equal. Interaction feedback (hover, focus, a switch flipping) stays at 300ms or less, because that answers a click rather than telling a story.

Curve `--ease-newton: cubic-bezier(0.22, 1, 0.36, 1)` for transforms, `cubic-bezier(0.33, 1, 0.68, 1)` for opacity and blur. Interaction 300ms. Never a browser default curve. Everything enters by rising from below and resolving from blur to sharp, staggered in reading order (the `newton-demo-motion` choreography, live on the page).

| Kind | From | Duration |
|---|---|---|
| `up` (text, rows, buttons) | `translateY(10px)`, `blur(4px)`, opacity 0 | 1.05s transform, 0.75s opacity and blur |
| `card` (cards, the stage, the hero globe) | `translateY(24px)`, `scale(0.985)`, `blur(6px)`, opacity 0 | same |
| `head` (verdict and running headlines) | `translateY(14px)`, `blur(10px)`, opacity 0 | 1s |
| `pop` (chips) | `scale(0.86)`, `blur(4px)`, opacity 0 | 0.7s |
| `left` (verdict rule rows) | `translateX(-10px)`, `blur(4px)`, opacity 0 | 0.8s |

| Where | Sequence |
|---|---|
| First screen, on load | headline 0.05s, context line 0.22s, globe 0.25s, form 0.3s |
| Verdict, on mount | headline, reason 0.12s, "Listed by" 0.24s, chips from 0.32s every 0.08s, note 0.38s, rule card 0.3s, Explorer button 0.46s, parties 0.56s |
| Running, on mount | headline, wallet pill 0.08s, steps 0.14s, diagram 0.2s |

Status dot pulses (opacity 1 to 0.3, 1.8s). The globe and the check diagram are the only continuous motion.

Animate only `transform`, `opacity`, `filter` and `clip-path`; animated blur stays at 10px or less. `prefers-reduced-motion: reduce` shows every element in its final state from the first frame, pauses the diagram (`svg.pauseAnimations()`), and uses instant scrolling. For videos and GIFs of a demo, use the `newton-demo-motion` skill.

## 9. Copy

- **"Newton Protocol" or "the Newton testnet". Never "Newton's".** Name Newton prominently; the demo exists to show what it does.
- Split the check from the enforcement: a policy is a rule plus data that anyone can author; Newton Protocol operators run it and sign the result. A data limitation is the policy's, not Newton's.
- Plain words, short sentences, sentence case. No em dashes. No hyphens joining words where a rewrite works. No jargon the visitor has to look up.
- Name the data source with its version or commit and licence, in the repo README and wherever the policy is described.
- Only report matches that happened. No "no match on X" rows filling a gap with defaults.
- A timestamp on every verdict. "Was this clean" is not answerable; only "was it clean then".
- Fail-closed states are framed as the system working: "The policy treats that as a denial rather than guessing."
- Say where signing happens: Ethereum Sepolia.
- No numerals on panels ("01", "02") unless order is enforced.

## 10. Demo library and case study pages

These are the closest the demos get to marketing, and still not landing pages.

- One primary action per demo card: open the demo. Case study pages link to the demo and its attestations.
- Each card: demo name, one sentence on what it checks, the data source, a status (Live, or WIP as for Pool Guard), and a still or an 800×500 loop from `newton-demo-motion`.
- Only list published demos.
- Case studies go on the newt.foundation blog; the library links to them.

## 11. Ship checklist

- [ ] `<title>`, meta description, `og:image` and Twitter card. The `next/og` image is a still of the first screen as it looks now: the nav lockup, the headline in the display face, the context line, the rule pills in their default state and a simple drawn globe with its four callouts. Redraw it whenever the first screen changes.
- [ ] Favicon
- [ ] A plain branded 404 with a way back
- [ ] Skip to content link; semantic `<main>`, `<nav>`, `<section>`
- [ ] Alt text on meaningful images; the logo is `alt="Newton"`
- [ ] No dead links; every external link opens the real attestation, explorer or source
- [ ] `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, no `X-Powered-By`
- [ ] Rate limits on any route that submits a paid task; fixed visitor-facing error text
- [ ] Phone check at 390×844 and desktop at 1440×900: nothing clipped, headings aligned, nav logo visible on phones, verdict readable without scrolling on desktop
- [ ] Frames captured mid-animation (first screen entering, running, verdict landing) and with reduced motion
- [ ] Every verdict state rendered and looked at: allowed, each deny reason, no decision, error

## 12. Quick check before handing over

- [ ] Only the tokens above; no new colours, sizes or radii
- [ ] Black and white with tint: Coal page, Bone text, logo and accents, grain; colour only as a wash for blocked and allowed; Sand only on the picked sample wallet; nothing glows
- [ ] Red appears only on a Blocked verdict, a control set to Block and the globe's severe-tier dots (wash on `#9F3619`, text `#F2896B`); fail-closed is grey with no glow
- [ ] Glass nav, gradient headline, sparse first screen (headline, one line, rule pills, wallet with text-link samples, button), data globe with flat callouts, blur-in entrances and the check diagram present; globe counts and diagram boxes match the real data and the deployed policy
- [ ] GT Sectra Fine Regular on headlines only; Inter 400 and 500 plus JetBrains Mono for everything else; no italics
- [ ] Logo untouched and with clear space; partner lockup on one line
- [ ] Verdict panel order kept; address whole; timestamp present
- [ ] Unreadable responses show "No decision"
- [ ] Copy: Newton Protocol, no "Newton's", no em dashes, plain words

## Credits

The glass nav, states, ship checklist, nested radius and one-sided border rules adapt `landing-page-design` from [ai-design-skills](https://github.com/elayadesign/ai-design-skills) by Elaya, MIT licensed.