# AI Kickoff Prompt  -  First Draft Slides

Copy the prompt below and paste it into your AI agent (Cursor, Copilot, Claude Code, etc.) to generate a first draft of your presentation from the template.

Adjust the lines marked `← CHANGE THIS` before pasting.

---

```
You are building a technical presentation slide deck using the mobb-deck-template Slidev framework.

## Your reference material (read-only  -  do not modify)

The template lives at `references/mobb-deck-template/`. Read these two files before writing a single slide:

1. `references/mobb-deck-template/AGENTS.md`  -  authoring rules, Mermaid constraints,
   component API, known pitfalls, and the mandatory review checklist.
2. `references/mobb-deck-template/slides.md`  -  all 15 example slide formats with
   speaker notes. Use this as a pattern library, not a starting point to edit.

## Output location                         ← CHANGE THIS

<!-- For a standalone presentation repo (this repo IS the talk): -->
Output directory: the repo root (`./`)
Slides file: `slides.md`
Components: `components/`
Styles: `styles/`
Assets: `public/`

<!-- For an existing project repo (e.g. an operator, Terraform module, or tool): -->
Output directory: `slides/`
Slides file: `slides/slides.md`
Components: `slides/components/`
Styles: `slides/styles/`
Assets: `slides/public/`

Copy `references/mobb-deck-template/package.json` and
`references/mobb-deck-template/Makefile` to the output directory.
Copy `references/mobb-deck-template/styles/` and
`references/mobb-deck-template/components/` to the output directory.

## Talk brief                              ← CHANGE THIS

Audience: [e.g. KubeCon attendees / internal Red Hat / customer workshop]
Tone: [e.g. technical deep-dive / executive overview / hands-on tutorial]
Talk length: [e.g. 30 minutes / 45 minutes / lightning talk 10 minutes]
Core thesis (one sentence): [What is the single most important thing the audience
  should leave knowing or believing?]
Key sections (optional): [e.g. problem → approach → findings → takeaways]

## What to study before writing

Before writing any slides, read the following files from this repository to
understand the subject matter. Extract: the problem being solved, the key technical
decisions, any interesting debugging stories, surprising findings, and the
outcome/artifacts.

- README.md
- ARCHITECTURE.md (if present)
- KNOWLEDGE.md (if present)
- AGENTS.md (repo root, if present)
- Any docs/ or runbooks/ relevant to the talk topic
- Any CHANGELOG entries from the relevant period

If the audience or thesis is unclear after reading, ask one clarifying question
before proceeding.

## Authoring rules (summary  -  full rules in references/mobb-deck-template/AGENTS.md)

- Use the frontmatter from the template (theme, fonts, highlighter).
- Match each content type to the closest slide format in the template:
    title → slide 1, speaker bio → slide 2, agenda → slide 3,
    section landmark → slide 4, compare/contrast → slide 5,
    bullets → slide 6, code → slide 7, table → slide 8,
    flowchart → slide 9, lifecycle → slide 10, image → slide 11,
    big quote/stat → slide 12, spectrum → slide 13, timeline → slide 14,
    closing CTA → slide 15.
- Every slide must have a speaker note (HTML comment block).
- Mermaid blocks must be in plain slide Markdown  -  NOT inside Vue component slots.
- Keep bullets to 4–5 items per slide. Split rather than scroll.
- Use `<RhTwoColumn>`, `<RhTable>`, `<RhTimeline>`, `<RhSpectrum>` where they
  fit naturally  -  don't force them.

## Deliverable

A complete `slides.md` at the output location described above, ready to run with
`make dev`. Also copy the supporting files (components, styles, package.json,
Makefile) so the output directory is self-contained.

After writing, run `npm install && npm run build` in the output directory and fix
any reported errors before declaring the draft ready.
```

---

## Tips for a better first draft

**Give context generously.** The more you tell the agent about the audience and thesis, the less it will default to a generic technical overview. A one-sentence thesis is the single most valuable input.

**Point at specific files.** If the repo has a particularly rich `KNOWLEDGE.md` or an `ARCHITECTURE.md` with a good diagram, call them out explicitly in the prompt. The agent will weight them higher.

**Expect two passes.** The first draft usually gets the structure right but the story wrong  -  too much "what we built" and not enough "why it matters" or "what you should steal." Add a follow-up: *"Reread slides 3–8 and reframe them around the audience's problem, not our solution."*

**Section count.** A 30-minute talk fits 6–8 sections comfortably (1–2 min per section header + 2–3 content slides each). For a 45-minute talk, go to 8–10 sections. For a lightning talk, skip section headers entirely and aim for 8–12 content slides total.

**Speaker notes drive the story.** Ask the agent to write speaker notes first (one paragraph per slide), then derive the slide content from them. This produces a more coherent narrative than writing slide bullets first.
