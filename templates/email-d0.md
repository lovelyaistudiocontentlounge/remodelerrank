# Email D0 - Initial Outreach

Sent the same day the lead is approved. Generated automatically as a Gmail draft.

Subject line format: `[Business Name] - quick question`
No em dashes anywhere. No emoji.

---

## Template

**Subject:** [Business Name] - quick question

Hi [First Name],

Do you have capacity for a kitchen remodel right now, or are you booked out?

I ask because I put together a quick audit of [Business Name]'s web presence and found something worth sharing. [best_hook - one specific observation from the score]

I put together a free report showing exactly what I found and what I'd fix. Worth a look?

[If score >= 6: include the Drive link to the grader report]

Jennifer
RemodelerRank
925-940-9484
Book a call: https://calendly.com/hey-remodelerrank/review-meeting-15-minutes

---

## Copy Rules

- First name only. If owner name is unknown, use "there" (not "Hello," or "Hi there,")
- The hook is the sentence that references one true, specific thing about their business
- Never fabricate or exaggerate the hook. Use the `best_hook` field from the score output exactly
- The report link is included for HOT (8-10) and WARM (6-7) leads only
- MEDIUM leads (4-5) get the generic version (email-generic.md) - no report, no hook
- Never auto-send. Always stage as Gmail draft for Jennifer's review

## Hook Examples (good)

- "Your project photos are impressive - they are buried where most homeowners never find them."
- "[Business Name] has 47 reviews but none from the past 8 months - new homeowners notice that gap."
- "You are the top result on Yelp in Danville but your website isn't indexed by Google."

## Hook Examples (bad - do not write these)

- "Your online presence needs work." (too vague)
- "I found some issues with your digital marketing strategy." (corporate, not specific)
- "I noticed your website could be improved." (meaningless)

---

## Where This Lives in Code

`prompts.js` - `emailD0()` function generates this dynamically.
`gmail.js` - `createDraft()` sends it to Gmail drafts.
`server.js` - triggered when Jennifer clicks Approve in the morning app.
