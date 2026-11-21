# Redline – Requirements (Lite SRS)

Nov 10, 2026 · @Aashutosh Chapagain

## Purpose, scope and users

Redline v1 lets field workers record safety incidents and inspections on their phone, offline, with AI help, and lets a supervisor see them once they sync.

**Users**

| User | Who they are | What they need | Device |
| --- | --- | --- | --- |
| Field worker | Miner, tradie, site technician, often wearing gloves, outdoors, with patchy signal | Report something fast and correctly, without typing much | Android or iPhone |
| Supervisor | Site or safety supervisor responsible for a team | See what was reported, with photos, soon after it syncs | Laptop browser |

**In scope for v1:** one organisation with a few sites, worker sign-in, incident and inspection reports, smart photo capture, voice notes, AI category suggestion, offline storage and sync, a read-only supervisor web view.

**Out of scope for v1:** multiple organisations, geofence check-in, push notifications, report approval workflows, analytics, editing reports after sync, admin user management (users and sites are seeded in the database).

**Priorities:** Must = needed for v1 to make sense; Should = planned for v1 but can slip; Could = only if time allows. Each story lists the plan week it belongs to.

## User stories, part 1

Each story has acceptance criteria you can turn straight into tests. FW = field worker, SV = supervisor.

### Epic 1: Sign-in

**US-01 Sign in** · Must · Week 4 As a FW, I want to sign in with my work email, so that my reports are linked to me.

- Sign-in uses an emailed one-time code (no passwords to remember)
- Only emails already registered in the system can sign in; others see a clear message
- After sign-in, the FW picks their current site from a list

**US-02 Stay signed in offline** · Must · Week 4 As a FW, I want to stay signed in when I have no signal, so that I can report on site.

- The session persists across app restarts
- With no signal, the app opens straight to the report list using local data
- An expired session never deletes local reports; the FW is asked to sign in again when online

**US-03 Sign out safely** · Should · Week 4 As a FW, I want to be warned before signing out with unsynced reports, so that I don't lose work.

- If unsynced reports exist, sign-out shows how many and asks to sync first or cancel
- Signing out after a full sync clears local data from the device

### Epic 2: Creating reports

**US-04 Create an incident report** · Must · Week 1–2 As a FW, I want to record an incident in a few taps, so that it's captured while details are fresh.

- Fields: category, severity, date and time (defaults to now), location, description, photos (0–5), people involved (optional free text)
- Category, severity and description are required; the form shows which are missing
- Large touch targets (at least 48 dp) for use with gloves
- Saving takes under 1 second and works with no signal

**US-05 Create an inspection report** · Should · Week 3 As a FW, I want to log a routine site inspection, so that checks are recorded even when nothing is wrong.

- Fields: area inspected, result (no issues / issues found), notes, photos (0–5)
- "Issues found" offers a one-tap shortcut to start an incident report with the area and photos copied over

**US-06 Auto-save drafts** · Must · Week 2 As a FW, I want my unfinished report saved automatically, so that a call or a crash doesn't lose it.

- Changes save locally within 2 seconds of each edit
- Reopening the app shows unfinished drafts at the top of the list
- Drafts can be deleted with a confirmation

**US-07 Capture location automatically** · Must · Week 2 As a FW, I want the report's location filled in for me, so that I don't have to describe where I am.

- GPS coordinates and accuracy are recorded when the report is created
- If location permission is denied or GPS is unavailable, the FW can type a location instead
- The map preview is optional and hidden when offline

**US-08 Attach photos from the gallery** · Should · Week 2 As a FW, I want to add photos I already took, so that earlier evidence isn't lost.

- Up to 5 photos per report in total
- Photos are compressed to a maximum of 1920 px on the long edge before saving

### Epic 3: Smart photo capture

**US-09 Live photo guidance** · Must · Week 5–6 As a FW, I want the camera to tell me what's wrong with the shot, so that my photos are usable the first time.

- Hints shown: Too dark, Too bright, Blurry, Hold still, Ready
- Hints update at least 5 times a second without making the preview stutter
- Analysis runs in a native frame processor (Kotlin, later Swift), not in JavaScript

**US-10 Auto-capture** · Must · Week 6 As a FW, I want the camera to take the photo when it's good, so that I don't have to tap with gloves on.

- When the state stays Ready for 0.5 seconds, the photo is taken automatically
- Auto-capture can be turned off in settings
- Each photo stores its quality scores (brightness, sharpness) with it

**US-11 Manual override** · Must · Week 6 As a FW, I want to take the photo anyway, so that I can still capture evidence in bad conditions.

- A shutter button is always available
- A photo taken while not Ready is saved with a "low quality" flag the supervisor can see

### Epic 4: Voice notes

**US-12 Dictate the description** · Should · Week 7 As a FW, I want to speak instead of typing, so that I can report quickly with gloves on.

- A microphone button on the description field starts dictation; tapping again stops it
- The transcript appears in the field and can be edited before saving
- Uses the platform's native speech recognition through a native module

**US-13 Dictation without signal** · Could · Week 7 As a FW, I want dictation to work offline where the phone supports it, so that I'm not stuck on remote sites.

- The app prefers on-device recognition when the phone supports it
- If dictation isn't available, the button is disabled with a short explanation

## User stories, part 2

### Epic 5: AI category suggestion

**US-14 Suggest a category with Redline's own model** · Must · Week 8 As a FW, I want the app to suggest the incident category, so that I pick the right one quickly.

- An on-device classifier, trained by the developer, reads the description plus ML Kit photo labels
- Works fully offline; a prediction takes under 100 ms
- The top suggestion appears as a highlighted chip with its confidence; below 60% confidence, the top two are shown
- The app never sets the category without the FW confirming
- The suggestion updates when the description or photos change

**US-15 Model quality is measured** · Must · Week 7–8 As the developer, I want the model evaluated on held-back data, so that I can state real accuracy and pick the right model.

- A fixed test set (20% of the data) is never used for training
- Report macro F1, per-category recall and a confusion matrix for the baseline and for any better model
- Results and limitations are recorded in the model card

**US-16 Track suggestion accuracy** · Could · Week 9 As the developer, I want to know how often suggestions are accepted, so that I can report a real accuracy number.

- Each report stores the suggested category and the final category
- The supervisor view shows the acceptance rate

### Epic 6: Offline and sync

**US-17 Queue reports offline** · Must · Week 4–5 As a FW, I want reports I submit offline to send later automatically, so that I don't have to remember.

- Submitting moves a report from Draft to Queued, even with no signal
- When the phone is back online, queued reports upload in the background, oldest first
- Photos upload separately and resume after interruptions

**US-18 See sync status** · Must · Week 5 As a FW, I want to see what has and hasn't been sent, so that I trust the app.

- Each report shows one of: Draft, Queued, Syncing, Synced, Failed
- A banner shows "Offline · 3 reports waiting" when relevant
- Pull to refresh triggers a sync attempt

**US-19 Retry failed syncs** · Must · Week 5 As a FW, I want failed uploads retried, so that a bad connection doesn't lose reports.

- Automatic retries with exponential backoff (for example 10 s, 30 s, 2 min, 10 min)
- After 5 failures the report shows Failed with a Retry button and the error in plain words
- A report is never deleted from the phone until the server confirms it

**US-20 No duplicates** · Must · Week 5 As a SV, I want each report to appear once, so that the records are accurate.

- Every report gets a UUID on the phone; the server ignores a second upload with the same UUID

### Epic 7: Report list and detail

**US-21 Browse my reports** · Must · Week 2 As a FW, I want to see my recent reports, so that I can check what I've logged.

- Newest first, showing category, severity, time and sync status
- Filter by status and by type (incident or inspection)
- Scrolls smoothly with 500 reports

**US-22 View a report** · Must · Week 2 As a FW, I want to open a report and see everything in it, so that I can confirm it's right.

- Shows all fields, photos full-screen, and the quality flag on photos
- Drafts and queued reports can be edited; synced reports are read-only

### Epic 8: Supervisor web view

**US-23 See synced reports** · Must · Week 9 As a SV, I want a list of reports from my sites, so that I know what's happening.

- Sign-in with the same email one-time code; only supervisor accounts can access it
- Table of reports: date, site, worker, type, category, severity
- Filter by site, date range and severity

**US-24 Open a report** · Must · Week 9 As a SV, I want to see a report's full detail and photos, so that I can act on it.

- Shows all fields, photos, location on a map, and low-quality flags

### Epic 9: Settings and privacy

**US-25 Change site** · Must · Week 4 As a FW, I want to change my current site, so that new reports are tagged correctly.

**US-26 Control smart features** · Should · Week 8 As a FW, I want to turn auto-capture and AI suggestions on or off, so that the app works the way I prefer.

**US-27 Understand data use** · Should · Week 10 As a FW, I want to see what data leaves my phone and why, so that I trust the AI features.

- A short privacy screen lists what is uploaded (reports, photos, location) and what stays on the device

## Report lifecycle

Every report moves through five states on the phone; this is the core of the sync engine (US-17 to US-20).

&#91;embedded content: Report lifecycle · 5 states\]

Only a server confirmation moves a report to Synced; until then it stays on the phone and can always be retried.

## Technical approach for smart features

All three smart features run on the phone, and the incident classifier is a model you train yourself, so no report text goes to an outside AI service.

### Photo quality (US-09 to US-11)

- `react-native-vision-camera` with your own frame processor plugin in Kotlin, then Swift
- Uses the Y (greyscale) plane of each camera frame, shrunk to about 160×120
- Darkness and brightness: average pixel value plus the share of clipped pixels
- Blur: variance of the Laplacian (a 3×3 edge filter); low variance means blurry
- Shake: average difference from the previous frame
- Analysis throttled to about 10 fps; thresholds tuned by logging scores on a real phone

### Voice to text (US-12, US-13)

- Your own Expo native module wrapping Android `SpeechRecognizer` and the iOS Speech framework
- Requests on-device recognition where the phone supports it
- `expo-speech-recognition` is the fallback if time runs short

### Incident classification (US-14 to US-16): your own model

The model reads the description plus on-device photo labels and predicts one of the 8 categories.

1. **Dataset:** start from a public set of real industrial incident descriptions (such as the Industrial Safety and Health Analytics Database on Kaggle, a few hundred mining and plant incidents; check its licence), relabelled into Redline's categories. Add LLM-generated descriptions in Australian site language, checked by hand. Aim for 150–200 examples per category. Hold back 20% as a test set that is never used for training.
2. **Baseline model:** TF-IDF features with logistic regression in scikit-learn. Export the vocabulary and weights to JSON and run it in TypeScript. This ships first because it's tiny, fast and easy to explain.
3. **Better model:** fine-tune a small transformer (such as MobileBERT) and convert it to TensorFlow Lite with int8 quantisation. Run it through a native module or `react-native-fast-tflite`.
4. **Photo labels:** Google ML Kit Image Labeling runs on the device; its top labels are added to the model input as extra words (for example `img_vehicle`).
5. **Evaluation:** macro F1, per-category recall and a confusion matrix, with extra attention to recall for Injury and Fire. Ship the transformer only if it clearly beats the baseline and stays under 30 MB and 100 ms per prediction on a mid-range phone.
6. **Model card:** `ml/README.md` records data sources, metrics, limitations and the model version.

Training code lives in an `ml/` folder (Python scripts or notebooks); each report stores the `model_version` that made its suggestion. As a stretch, compare your model with an LLM on the same test set and put both scores in the README.

## Non-functional requirements

These are the measurable targets. Record actual numbers in the README; they make strong interview material.

| Area | Requirement | How to check |
| --- | --- | --- |
| Offline | Every worker feature except sign-in and syncing works with no signal, including the AI features | Test in airplane mode |
| Data safety | No report is lost through crash, app kill, sign-out or failed sync | Kill the app mid-save and mid-sync in tests |
| Startup | Cold start to report list under 2 s on a mid-range Android phone | Measure with a release build |
| Save speed | Saving a report locally takes under 1 s | Timed in tests |
| Camera | Preview stays at least 30 fps while analysis runs; hints update at least 5 times a second | Performance overlay and logs |
| Lists | Smooth scrolling with 500 reports | FlashList and a profiler run |
| Battery and data | Photos compressed before upload; sync pauses below 15% battery unless charging | Manual test |
| Security | Tokens stored in secure storage; HTTPS only; database row-level security so workers see only their reports and supervisors only their sites | Supabase policy tests |
| Privacy | Classification runs on the device, so report text never goes to an outside AI service; the privacy screen explains data use | Code review |
| Accessibility | Screen reader labels on all controls; supports large text; touch targets at least 48 dp; readable in bright sunlight (high contrast) | Accessibility scanner, TalkBack and VoiceOver |
| Platforms | Android 10+ and iOS 16+ | Device testing |
| Quality | At least 70% unit test coverage on business logic (sync, validation, state); end-to-end tests for create, offline submit and sync | CI reports |

## Data model

Four tables, the same shape on the phone (SQLite) and the server (Postgres). IDs are UUIDs generated on the phone, so reports exist before they ever reach the server.

| Entity | Fields | Notes |
| --- | --- | --- |
| **User** | id, email, name, role (worker / supervisor), site\_ids | Seeded on the server; cached on the phone after sign-in |
| **Site** | id, name, latitude, longitude | Seeded; a few example WA sites |
| **Report** | id, type (incident / inspection), site\_id, user\_id, category, severity, occurred\_at, description, people\_involved, area, inspection\_result, latitude, longitude, location\_accuracy\_m, location\_text, suggested\_category, suggestion\_confidence, model\_version, status (draft / queued / syncing / synced / failed), sync\_attempts, last\_error, created\_at, updated\_at, synced\_at | Incident and inspection share one table; unused fields stay empty |
| **Photo** | id, report\_id, local\_uri, remote\_path, width, height, brightness\_score, sharpness\_score, low\_quality (yes / no), upload\_status, created\_at | Files live on the phone until uploaded to Supabase storage |

**Rules:**

- `status` exists only on the phone; the server stores synced reports, so everything there is "synced"
- `updated_at` decides which edit wins if a draft changes while a sync is in flight (last write wins locally; synced reports are read-only)
- Row-level security: workers read and write only their own reports; supervisors read reports for their sites

## Screens and navigation

Ten mobile screens plus two web pages. Routes are written as Expo Router file paths so they map straight to the `app/` folder.

| Route | Screen | What it does | Stories |
| --- | --- | --- | --- |
| `(auth)/sign-in` | Sign in | Email entry and one-time code | US-01 |
| `(auth)/select-site` | Select site | Pick the current site | US-01, US-25 |
| `(tabs)/reports` | Report list | Drafts on top, then reports with status; offline banner; filters | US-18, US-21 |
| `(tabs)/new` | New report chooser | Incident or inspection | US-04, US-05 |
| `report/incident` | Incident form | Fields, photos, voice, AI suggestion chip | US-04, US-06, US-07, US-12, US-14 |
| `report/inspection` | Inspection form | Area, result, notes, photos | US-05 |
| `camera` | Smart camera | Live hints, auto-capture, shutter | US-09 to US-11 |
| `report/[id]` | Report detail | Full report, photos, status, retry | US-19, US-22 |
| `(tabs)/settings` | Settings | Site, auto-capture and AI toggles, sign out | US-03, US-25, US-26 |
| `settings/privacy` | Privacy | What data leaves the phone | US-27 |
| Web `/reports` | Supervisor list | Filterable table of synced reports | US-23 |
| Web `/reports/[id]` | Supervisor detail | Full report, photos, map | US-24 |

## Reference lists

Fixed lists the app and the AI both use. They're simplified for a portfolio app; v1 does not decide whether an incident is legally notifiable to WorkSafe WA.

**Incident categories**

| Category | Use for |
| --- | --- |
| Injury | Someone was hurt, however minor |
| Near miss | Something nearly caused harm but didn't |
| Hazard | An unsafe condition spotted before anything happened |
| Equipment or property damage | Damage to tools, machinery, buildings |
| Vehicle or mobile plant | Incidents involving vehicles, trucks, loaders |
| Environmental | Spills, leaks, dust or emissions |
| Fire | Fire, smoke or explosion |
| Other | Anything that doesn't fit above |

**Severity levels**

| Level | Meaning |
| --- | --- |
| Low | No injury or minor first aid; easily fixed |
| Medium | Medical treatment needed, or damage that stops work briefly |
| High | Serious injury, or significant damage or environmental harm |
| Critical | Life-threatening, or a dangerous situation still active; also call the supervisor immediately |

## Development conventions and definition of done

Work like a team of one would in a real company; the repo history is part of the portfolio.

**Workflow**

- Track stories as GitHub Issues using the US numbers, grouped into a GitHub Project board (To do, In progress, Done)
- One branch per story (`feat/us-04-incident-form`), merged by pull request, even when working alone
- Conventional commit messages (`feat:`, `fix:`, `test:`, `docs:`)
- Record significant decisions as short notes in `docs/decisions/` (for example, why SQLite over WatermelonDB)

**Code structure**

- Feature folders: `src/features/reports`, `src/features/sync`, `src/features/camera`, `src/features/auth`
- Native modules in `modules/` (Expo Modules API), each with its own README
- No business logic in screens; keep it in hooks and services so it can be unit tested

**A story is done when:**

- [ ] Every acceptance criterion is met on a real Android device (and iOS from week 7)
- [ ] Unit tests cover the logic; CI is green
- [ ] It works in airplane mode where the story involves workers
- [ ] Screen reader labels are added for new controls
- [ ] The PR description explains what changed, with a screenshot or short video
- [ ] The issue is closed and linked to the PR

## Open questions

- [ ] Which classifier ships in the app: the TF-IDF baseline or a small transformer? (Decide by week 8, based on test results)
- [ ] Supervisor web view: build in Next.js, or a simple Expo web build? (Decide by week 8)
- [ ] Apple developer account: buy one for App Store release, or demo on the simulator and your own iPhone only? (Decide by week 9)
- [ ] Show the app to one real safety or site worker for feedback before launch? (Nice to have, week 10)
