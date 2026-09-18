# Email D3 - Day 3 Follow-Up

Sent 3 days after D0. Reply-threaded to the original email. Generated as a Gmail draft.

Subject format: `Re: [Business Name] - quick question`
No em dashes. No emoji.

---

## Template

**Subject:** Re: [Business Name] - quick question

Hi [First Name],

Just bumping this up in case it got buried.

The report is ready whenever you want it. Takes about 3 minutes to read and shows exactly where [Business Name] is losing homeowners before they ever call.

Jennifer
925-940-9484
Book a call: https://calendly.com/hey-remodelerrank/review-meeting-15-minutes

---

## Copy Rules

- Keep it short. This is a bump, not a second pitch.
- Do not repeat the hook from D0. The report does the work.
- Do not add urgency or pressure. "Ready whenever you want it" is the tone.
- "Buried" refers to emails, not their portfolio (different use from the hook).
- Thread as a reply to the original email - same subject line with "Re:" prefix.
- Never auto-send. Gmail draft only.

---

## When This Fires

The morning app follow-up panel shows D3 due when:
- Lead status is "Contacted"
- Email D0 was sent 3+ days ago
- Email D3 has not been sent yet

Jennifer sends the draft manually after reviewing in the morning app.

---

## Where This Lives in Code

`prompts.js` - `emailD3()` function.
The morning app (`server.js`) flags it in the follow-up bar: "Day 3 follow-ups due today."
