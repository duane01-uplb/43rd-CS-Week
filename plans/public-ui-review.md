# Public registration journey

Playwright CLI exercised the local CASC4D3 site in Chromium at 1440 × 900, 390 × 844, and 320 × 740. The walkthrough followed the homepage, schedule filters, Games Day detail, registration form, and return to the schedule. Screenshots used reduced motion for repeatability.

## Findings and recommendations

| Surface | Browser observation | Change or recommendation |
| --- | --- | --- |
| Homepage | The mobile header and hero both spell out “43rd Computer Science Week.” Two full-width actions sit above the next-event link. | Keep the wordmark, petal artwork, and rose registration button. Remove the repeated hero label and render the in-page schedule link as a quieter text action. |
| Schedule | At 390 px, the first event description takes seven lines in the narrow column beside the time. Its registration link falls below the initial viewport. | On phones, place time and status on one wrapping line, then give the title and action the full row width. Keep full descriptions on detail and preserve day headings and Manila times. |
| Event detail | Desktop shows the form beside the event title. Mobile puts it after the description and guidelines. The detail page also overflowed at 320 px. | Implemented a mobile registration shortcut, a shrinkable grid column, and wrapping for narrow content. Removed the repeated event-series badge so registration status stands alone. |
| Registration | At 320 px the consent label spans several lines before the first select. | Give the disclosure body regular weight and the question a short, associated label when the form schema supports separate help text. Preserve the full disclosure and required response. |

## Reproduce

Start the public web app with its configured development data and the seeded Games Day event open and upcoming. From the repository root, open its URL and run the test.

```powershell
bunx --package @playwright/cli playwright-cli -s=csweek-ui open http://127.0.0.1:5182/
bunx --package @playwright/cli playwright-cli -s=csweek-ui run-code --filename=scripts/public-ui.playwright.js
```

## Implemented and verified

The homepage now leads from the hero into a three-event agenda. The same date-led rows appear on the full schedule with capacity and filters. At 390 × 844 the first registration link fits in the initial viewport. Event titles lead to detail, while internal registration links land at the form. The privacy select has a short accessible label and keeps the full disclosure as its description.

The walkthrough passed at all three widths. It checks keyboard activation of the agenda link, mobile navigation, filters, overflow, registration anchors, native consent validation, and closed and external destinations using a local response fixture. Five screenshots per viewport are saved to `test-results/program-first/`. The original screenshots remain in `test-results/public-ui/` for comparison. The walkthrough ends before submission.
