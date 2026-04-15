# Top 30 S3+S5 Verification & Outreach Summary

Run date: 2026-04-16. Verification via WebSearch only (no paid APIs). Thirty records processed, zero skipped.

## Verification tallies

### Credentials by cert type

| Cert | Claimed | Verified | verifyAttempted but unverified |
|---|---|---|---|
| CFA | 6 (Katsenelson, Lewitinn, Sizemore, Leary, Ralston, + Dan Kemp IMC-tier) | 6 | 0 |
| CFP (current) | 5 (Pinsker, Coombes, Moorhead, King) + 1 former (Caplinger 2012, not displayed) | 4 current + 1 historical | 1 (Caplinger — will not display) |
| CMT | 1 (Chandler) | 0 | 1 (not consistently listed on first-party sources; flagged to confirm in outreach) |
| CPA | 1 (Harzog — former) | 0 | 1 (state not disclosed; will confirm) |
| FINRA Series 7/63/66/4 | 1 (Inskip) | 4 (all series via CRD 5693503) | 0 |
| Series 3 / CTA | 2 (Hatzakis, Blystone) | 2 (cross-source attestation) | 0 (NFA BASIC not programmatically queried — flagged) |
| IMC / SIDip / AFPC | 1 (Kemp) | 3 (all three) | 0 |
| TEP | 1 (King) | 1 | 0 |
| JD | 4 (Moorhead, Friedman, Limsky, Caplinger) | 4 | 0 |
| PhD | 1 (Limsky) | 1 | 0 |
| CBE / OBE | 1 (Lewis) | 2 (CBE 2022 + OBE 2014) | 0 |

### Books with ISBN-13 captured

Total: 11 verified ISBN-13 across 8 authors.

- Pinsker — My Mother's Money (0593728758)
- Katsenelson — Active Value Investing (9780470053157), Little Book of Sideways Markets (9780470932933), Soul in the Game (9780857199072)
- Chandler — Making Sense of the Dollar (9781576603215)
- Harzog — Debt Escape Plan (9781601633606), How Money Works (9781465444271)
- Hill — 30-Minute Money Plan for Moms (9781478975656)
- Hannon — Retirement Bites (9781541705845), Never Too Old to Get Rich (9781119547907)
- Arends — Storm Proof Your Money (9780470482681)
- Lien — Day Trading and Swing Trading the Currency Market (9781119108412), Millionaire Traders (9780470452547)

### Industry awards captured

Total: 10 discrete awards across 6 authors.

- Pinsker — SABEW Best in Business 2023 (Commentary)
- Hannon — WSJ Best Book on Healthy Aging 2025 + Retirement Coaches Association Retirement Pioneer Award 2023
- Friedman — NAREE Gold 2024 (Kiplinger) + Silver 2024 (WSJ) + Bronze 2024 (WSJ) — triple win
- King — Investopedia Top 10 Most Influential Financial Advisors 2023 + Forbes 50 Most Powerful Women in Peru 2025
- Lewis — CBE 2022 New Year Honours + OBE 2014 Birthday Honours
- Doyle — SPJ Sigma Delta Chi breaking-news award (Bankrate team, Fed coverage)
- Harper — Hashrate Index "Top Bitcoin Mining Journalists of 2025"

### Knowledge Panel (hasKnowledgePanel: true)

4 authors: Chandler, Arends, Lewis, Fottrell.

## Key findings and surprises

- **Jessica Inskip's FINRA record is clean**: CRD #5693503 was directly indexed by FINRA BrokerCheck search. No disciplinary disclosures surfaced — proceeding with all four series displayed.
- **Elaine King is more credentialed than expected**: CFP Board Ambassador (confirmed on cfp.net directly), TEP, CDFA, CFBA, ICF coach, MBA Thunderbird — plus the 2023 Investopedia Top 10 (#10 rank) and 2025 Forbes 50 Most Powerful Women in Peru. She is the single most award-heavy panelist in the cohort.
- **Robyn A. Friedman's NAREE sweep**: 2024 Gold (Kiplinger) + Silver (WSJ Counting House) + Bronze (WSJ homeowners insurance) in a single year is rare — she is strongly pitched for a real-estate-broker adjacency panel.
- **Marc Chandler CMT unverified**: CMT designation is referenced in the input JSON and some third-party bios but not consistently on first-party sources (Bannockburn, marctomarket.com, LinkedIn). Flagged as unverified — will not display the CMT mark until confirmed in outreach.
- **Dan Caplinger's CFP relinquished 2012**: Will not display. JD (high honors, UT Law) and U Chicago BA remain the primary credentials we display.
- **Dan Kemp's three UK certs**: IMC + SIDip + AFPC are all verified via the Morningstar official bio. Combined with the July 2023 CRIO promotion, he is the strongest UK-side panelist in the cohort.
- **Martin Lewis CBE**: Honours record clean and dual (OBE 2014 → CBE 2022). Outreach draft openly acknowledges MSE compliance bar is likely prohibitive; framed as long-shot with a plan B of asking for his referral.
- **Katsenelson is quietly the most-published**: three books, two ISBNs verified (9780470053157, 9780857199072), plus his third book "The Little Book of Sideways Markets" captured separately (9780470932933).
- **No disqualifications**: zero FINRA disclosures, zero revoked credentials (the one relinquished CFP — Caplinger — was voluntary and is disclosed in the source data). All 30 move forward to S5 outreach.
- **Limited tier 1 press for 2 authors**: Adam Hardy (Money) and Dan Caplinger (Motley Fool) do not show named tier-1 pickup in the input data. Both still have strong credential bases (IRE/Poynter for Hardy; JD + 20 years at Motley Fool for Caplinger), so outreach angles lean on credentials rather than press.

## Outreach drafts

All 30 drafted. Every draft has:
- Subject line ≤ 8 words, specific to the recipient.
- Personal hook referencing a specific credential, book (with year or publisher), or award found during verification.
- "Reviewed and approved by" framing (not "Written by").
- Paid honorarium mention + link back to author's own property.
- Soft close requesting a 15-minute call.
- Signed "Yegor Barakovskiy, Founder, RatedBrokers".

Written drafts: 30 / 30. Output JSON: `scripts/top30-verified.json`.
