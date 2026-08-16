# ODI User Testing — Task Scenarios & Observations

This document defines user testing tasks for ODI and provides a framework for collecting and analyzing findings.

## Test Overview

**Objective**: Validate that ODI's core features are intuitive, functional, and support the claimed use cases.

**Participants**: 3-5 users (ideally with varying technical backgrounds)

**Duration**: ~15 minutes per session

**Environment**: Participant uses their own phone or provided test device on shared Wi-Fi

---

## Pre-Test Setup

1. **Device Preparation**
   - Install Expo Go on test device
   - Open ODI via Expo Go QR or link
   - Verify app loads without errors

2. **Participant Brief**
   - "ODI is a network diagnostic tool. We want to see if the features make sense and work as expected."
   - "Please think aloud as you try each task."
   - "There are no right/wrong answers; we're testing the app, not you."

3. **Observation Notes**
   - Record time per task
   - Note hesitations, confusion, or unexpected clicks
   - Capture exact quotes of frustration or praise

---

## Task 1: Perform a Reachability Check

**Task Statement**
> "Use ODI to check whether google.com is reachable. Tell me what the result means."

**Acceptance Criteria**
- ✅ User navigates to Tools tab
- ✅ User taps "Reachability Check"
- ✅ User enters "google.com" (or similar hostname)
- ✅ User taps "Check Reachability"
- ✅ Result appears with status and response time
- ✅ User can articulate what "reachable" means in this context

**Observation Notes Template**
```
Participant: ___
Time to complete: ___ seconds

Did user need help to navigate? Yes / No / Partial
Clicks before finding tool: ___
Did user read the "HTTP/HTTPS" note? Yes / No / Unsure
Confusion points: _______________

User quote: "__________________"
```

**Expected Outcome**
- Most users find the tool quickly via Tab 2 (Tools)
- Some may need clarification that this is not ICMP ping
- Successful checks show HTTP 2xx or timeout gracefully

---

## Task 2: Perform a DNS Lookup

**Task Statement**
> "Look up the IP addresses for example.com. What addresses did you find?"

**Acceptance Criteria**
- ✅ User navigates to Tools → DNS Lookup
- ✅ User enters "example.com"
- ✅ User taps "Lookup"
- ✅ Result displays IPv4 or IPv6 addresses
- ✅ User reports at least one IP address

**Observation Notes Template**
```
Participant: ___
Time to complete: ___ seconds

Found IPv4? Yes / No
Found IPv6? Yes / No
User able to explain result? Yes / No / Partially

Clicks/attempts: ___
Did "Lookup" button position confuse user? Yes / No

User quote: "__________________"
```

**Expected Outcome**
- DNS lookup should resolve to 93.184.216.34 (example.com IPv4)
- Some domains may not have IPv6
- Lookup API may fail if internet is poor; error message should be clear

---

## Task 3: Check Port Availability

**Task Statement**
> "Check whether port 80 is open on your router (use 192.168.1.1 or your gateway IP). Is the port accessible?"

**Acceptance Criteria**
- ✅ User navigates to Tools → Port Check
- ✅ User enters a gateway or local IP (e.g., 192.168.1.1)
- ✅ User enters or selects port 80
- ✅ User taps "Check Port"
- ✅ Result shows OPEN or CLOSED
- ✅ User understands what the result means for their network

**Observation Notes Template**
```
Participant: ___
Time to complete: ___ seconds

Did user use preset ports? Yes / No
Which preset (if any)? ___
Difficulty entering custom port? Easy / Medium / Hard

Understood OPEN/CLOSED badge? Yes / No / Partially
Did response time help understanding? Yes / No / Unsure

User quote: "__________________"
```

**Expected Outcome**
- Port 80 on gateway likely closed (secure setup)
- User may try HTTPS (443) instead
- Presets dropdown saves time and improves UX
- Clear color-coded badges (green OPEN, red CLOSED) help comprehension

---

## Task 4: Save a Diagnostic Result

**Task Statement**
> "After running any diagnostic, save the result. Then navigate to the 'Saved' tab and verify it appears there."

**Acceptance Criteria**
- ✅ User completes one of Tasks 1-3
- ✅ User sees "Save Result" button and taps it
- ✅ Confirmation appears ("Result saved!")
- ✅ User taps "Saved" tab
- ✅ The saved result appears in the list with timestamp

**Observation Notes Template**
```
Participant: ___
Time to complete: ___ seconds

Found "Save Result" button? Yes / No
Tapped without instruction? Yes / No / Asked where

Found Saved tab? Immediately / After searching / With help
Result visible in list? Yes / No

Did timestamp help verify persistence? Yes / No / Unsure
Did user try deleting? Yes / No

User quote: "__________________"
```

**Expected Outcome**
- Save button is obvious after a result
- Saved Results tab should show clear, timestamped history
- This demonstrates AsyncStorage persistence working
- User should feel confident results are stored locally

---

## Task 5: Use the Subnet Calculator

**Task Statement**
> "Use the Subnet Calculator to find the network range for 192.168.1.0/24. How many usable hosts are in this subnet?"

**Acceptance Criteria**
- ✅ User navigates to More → Subnet Calculator
- ✅ User enters IP "192.168.1.0" and CIDR "24"
- ✅ User taps "Calculate"
- ✅ Results display network, broadcast, usable hosts
- ✅ User reports "254" or similar usable host count

**Observation Notes Template**
```
Participant: ___
Time to complete: ___ seconds

Found Subnet Calculator easily? Yes / No
Input fields clear? Yes / No / Confusing

Understood the output? Fully / Partially / Not at all
Most useful output row: _______________
Least useful output row: _______________

Would use again? Yes / No / Maybe

User quote: "__________________"
```

**Expected Outcome**
- Tool correctly calculates 254 usable hosts
- Results layout is clean and scannable
- Users with subnetting experience find it instantly useful
- Users new to subnetting may need learning content first

---

## Task 6: Explore Learning Hub

**Task Statement**
> "Open the Learning Hub under 'More'. Read one topic of your choice and summarize it for me in your own words."

**Acceptance Criteria**
- ✅ User navigates to More → Learning Hub
- ✅ User taps on one topic card
- ✅ User reads the content
- ✅ User returns to list or closes
- ✅ User can provide a 1-2 sentence summary

**Observation Notes Template**
```
Participant: ___
Time to complete: ___ seconds

Topics explored: ____________________
Most interesting topic: ____________________
Topic difficulty: Too Easy / Just Right / Too Hard

Content readable? Yes / No
Text size adequate? Yes / No / Too small / Too large

Would recommend to someone learning networking? Yes / No
User understanding level before vs after? Improved / Same / Confused

User quote: "__________________"
```

**Expected Outcome**
- Content is accessible and educational
- Topics are relevant to diagnostic use (OSI, TCP/UDP, etc.)
- Users appreciate having reference material in-app
- Some users may skip; that's okay (not a core feature)

---

## Post-Test Interview

After completing all tasks, ask:

1. **Overall Impression**
   - "What was your first impression of ODI?"
   - "What worked well?"
   - "What was frustrating or confusing?"

2. **Use Case Fit**
   - "Would you use this app to troubleshoot your Wi-Fi at home?"
   - "What feature would make it more useful?"

3. **Comparison**
   - "Have you used other network tools? How does ODI compare?"

4. **Likelihood to Recommend**
   - "On a scale of 1-5, how likely are you to recommend ODI to a friend?"

---

## Data Analysis Framework

### Quantitative Metrics

**Task Success Rate**
```
Calculation: (Tasks completed successfully / Total tasks) × 100%
Target: ≥80% success on core tasks (1-4)
Learning tasks (5-6) can be lower
```

**Time on Task**
```
Record median time per task:
- Task 1 (Reachability): Target <30s
- Task 2 (DNS): Target <30s
- Task 3 (Port): Target <40s
- Task 4 (Save): Target <20s
- Task 5 (Subnet): Target <45s
- Task 6 (Learning): Target <60s
```

**Navigation Errors**
```
Count clicks before reaching tool:
- 1 click: optimal
- 2 clicks: acceptable
- 3+: suboptimal
```

### Qualitative Insights

**Confusion Points**
- Reachability not being ICMP → Solution: make method more prominent
- Port check vs Port scan terminology → Solution: clarify in descriptions
- Where to find More section → Solution: make tab names bold in tutorial

**Positive Feedback Patterns**
- "This is cleaner than I expected"
- "Nice that results are saved automatically"
- "Learning hub is helpful"

**Improvement Requests**
- Continuous ping feature
- Export results as CSV
- Comparison between two IPs
- Bookmarks for frequent hosts

---

## Recommended Test Session Script

```
[5 min] Intro & consent
[2 min] App tour (tabs, Home screen)
[3 min] Task 1 (Reachability) + observation
[3 min] Task 2 (DNS) + observation
[3 min] Task 3 (Port Check) + observation
[2 min] Task 4 (Save Result) + observation
[3 min] Task 5 (Subnet Calculator) + observation
[2 min] Task 6 (Learning Hub) + observation
[5 min] Post-test interview
[2 min] Wrap-up & thank you

TOTAL: ~30 minutes
```

---

## Sample Observation Template (Blank)

```markdown
# ODI User Testing Session

**Date**: _______________
**Participant**: _______________ (e.g., User A, User B)
**Device**: _______________ (phone model)
**Network**: _______________ (home Wi-Fi, mobile hotspot, etc.)

## Task 1: Reachability Check
- Time: ___ seconds
- Success: Yes / No
- Observations: _______________

## Task 2: DNS Lookup
- Time: ___ seconds
- Success: Yes / No
- Observations: _______________

## Task 3: Port Check
- Time: ___ seconds
- Success: Yes / No
- Observations: _______________

## Task 4: Save Result
- Time: ___ seconds
- Success: Yes / No
- Observations: _______________

## Task 5: Subnet Calculator
- Time: ___ seconds
- Success: Yes / No
- Observations: _______________

## Task 6: Learning Hub
- Time: ___ seconds
- Success: Yes / No
- Observations: _______________

## Post-Test Interview
**Impression**: _______________
**Strengths**: _______________
**Weaknesses**: _______________
**Recommendation (1-5)**: ___

## Key Quote
\"_______________\"

## Analysis
**Patterns noted**: _______________
**Follow-up questions**: _______________
```

---

## Reporting Template

After 3-5 sessions, compile findings:

```markdown
# ODI User Testing Report

## Executive Summary
- Sessions conducted: ___
- Overall success rate: ___%
- Key finding: _______________

## Task-by-Task Analysis
| Task | Success | Avg Time | Issue |
|------|---------|----------|-------|
| 1. Reachability | ___ | ___ | ___ |
| 2. DNS | ___ | ___ | ___ |
| 3. Port Check | ___ | ___ | ___ |
| 4. Save | ___ | ___ | ___ |
| 5. Subnet | ___ | ___ | ___ |
| 6. Learning | ___ | ___ | ___ |

## Common Observations
1. Positive: _______________
2. Negative: _______________
3. Unexpected: _______________

## Recommendations for v1.1
- [ ] Improve _______________ based on feedback
- [ ] Add tutorial for _______________
- [ ] Clarify wording in _______________

## Participant Quotes
> \"_______________ \" – User A
> \"_______________ \" – User B

## Conclusion
ODI demonstrated [strong / moderate / weak] product-market fit for network diagnostics. Recommended next steps: _______________
```

---

## Success Criteria (Overall)

✅ **Ideal Outcome**
- 80%+ task completion across 3-5 participants
- Most users complete core tasks (1-4) in <2 minutes
- Positive sentiment about persistence and UI
- At least 1 participant wants to use it for real

⚠️ **Acceptable Outcome**
- 60-80% task completion
- Some navigation confusion, resolved with prompts
- Mixed feedback on learning content
- Majority understand the value

❌ **Needs Redesign**
- <60% task completion
- Consistent confusion on same feature
- Negative sentiment about reliability
- Users would not use for real problems

---

End of User Testing Framework
