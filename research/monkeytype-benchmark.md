# Monkeytype benchmark for NYC Metro

Date: 15 October 2026

## Recommendation

Make typing feel immediate and repeatable, with the subway journey providing the reward. Use Monkeytype as the reference for typing interaction and session flow, and Metro Typing for the connection between station names and map progression.

This is a product design recommendation, not proof of US market fit. No US audience, conversion, revenue or retention data was obtained. A familiar interaction can reduce learning effort; whether the NYC theme motivates repeat use needs testing.

## Evidence and method

Inspected [Monkeytype](https://monkeytype.com/) on desktop, selected a 15-second test, typed a sequence of displayed words, and inspected the resulting screen. The automated input was much faster than ordinary human input and followed by idle time; the site marked the result invalid with AFK detected. Its speed result is not a benchmark of human performance or input latency. Reviewed the [official project documentation](https://github.com/monkeytypegame/monkeytype). Mobile, account history and all settings were not tested.

## What to take from the reference

| Area | Observed in the live session | Application to NYC Metro |
| --- | --- | --- |
| First use | Test text is available without signing in. | Open directly into a ready-to-type journey. Keep route setup lightweight. |
| Input | Typed letters appear within the prompt. Spaces advance between words. | Keep a single station-name text layer, without boxes or a duplicate input field. Preserve spaces inside station names. |
| Focus | During typing, navigation and configuration recede, leaving text and a timer prominent. | Dim secondary map detail and controls. Keep the map visible but avoid constant camera movement. |
| Session options | Time presets and several test modes are exposed together. | Begin with Journey and a short timed mode, rather than a large settings screen. |
| Keyboard flow | The interface advertises Tab then Enter to restart and Escape for commands. | Give restart an accessible keyboard path, preserve normal Tab focus, and show a compact shortcut hint. |
| Results | Speed and accuracy are prominent; more detail and repeat/next actions follow. | Lead with WPM, accuracy and route progress; make replay immediate and optional details secondary. |
| Identity | The active test feels quiet and text-led. | Keep the NYC identity in route colours, signage and the map, while letting the typing text lead during play. |

The official documentation also lists customisation such as themes and a smooth caret. These are useful later options; the prototype needs a reliable input loop first.

## Changes to the prototype brief

1. Start the timer on the first typed character, not on page load.
2. Keep station-name feedback inline, using distinct correct, pending and error states plus a caret.
3. Journey mode: Enter submits a station, preserving spaces within names. This consciously differs from Monkeytype's word-by-word flow.
4. Test automatic advancement after an exact complete station name as an alternative. Do not treat each space as a station boundary.
5. Keep the user's typography-led stats and thin progress bars. Add a focus treatment that quiets peripheral controls while typing.
6. Use WPM as the speed measure and document its formula. Scores for station names, which contain digits and repeated abbreviations, should not be presented as equivalent to a common-word typing test.
7. Finish with replay and a readable summary. Save personal bests locally without requiring an account.
8. Use permissive matching for a casual journey: case-insensitive with a documented punctuation policy. Keep strict and casual scores separate if strict mode is added.

## Positioning hypothesis

"Type your way through New York" is a proposed positioning direction. Start by testing two plausible audiences: people who enjoy typing games, and people who enjoy NYC or transit. These are hypotheses, not validated market segments.

The differentiator is route discovery and completion. A generic typing-test copy with a decorative map would give players less reason to choose this game.

## Validation plan

Run small moderated sessions with US-based participants from those two audiences. Ask each to start unassisted, complete a short journey, make and correct an error, and replay. Observe hesitation around numbers, punctuation and submission. Compare explicit Enter submission with automatic advancement, and a quiet map with a more animated map.

Record whether participants start successfully, complete the journey and voluntarily replay; collect their stated reason for returning. A later opt-in return test is needed to assess retention. Set acceptance criteria before evaluating the prototype. Do not infer US appeal from the reference's feature set alone.

## Current implementation status

Prototype generation was interrupted before application code was created. The project still has its README and design boards; this benchmark updates the implementation direction. An empty temporary staging tree may exist outside the project and is not application code.

## Sources

- [Monkeytype live product](https://monkeytype.com/), directly inspected on 15 October 2026.
- [Monkeytype official repository](https://github.com/monkeytypegame/monkeytype), used for stated product features.
- [Metro Typing](https://metrotyping.kr/single), previously inspected for journey mechanics; see the companion Metro Typing benchmark.
