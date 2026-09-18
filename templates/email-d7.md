# Email D7 - Day 7 Close

Sent 4 days after D3 (7 days after D0). Last touch in the sequence. Gmail draft.

Subject format: `Re: [Business Name] - quick question`
No em dashes. No emoji.

---

## Template

**Subject:** Re: [Business Name] - quick question

Hi [First Name],

Last follow up from me.

I work with a small number of Northern California remodelers at a time and wanted to give [Business Name] first look before I move on. If timing is not right, no hard feelings at all.

If it ever makes sense to talk, you know where to find me.

Jennifer
RemodelerRank
925-940-9484
Book a call: https://calendly.com/hey-remodelerrank/review-meeting-15-minutes

---

## Copy Rules

- This is the close. Shorter is better.
- No new information. No pressure. No manipulation.
- "Last follow up" signals finality without being rude.
- "Small number of Northern California remodelers" is true - Jennifer works with a focused set of clients.
- "If timing is not right" removes pressure and often prompts a reply of "actually let's talk."
- Do not beg, extend deadlines, or manufacture urgency.
- Never auto-send. Gmail draft only.

## After D7

If no reply: mark status as "No Response." Move on.

If they reply at any point (D0, D3, D7, or after): mark status as "Replied." Move to meeting booking flow. No more automated sequence.

---

## Where This Lives in Code

`prompts.js` - `emailD7()` function.
The morning app flags D7 due when D3 was sent 4+ days ago and D7 has not been sent.
