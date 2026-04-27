# StoreHub Product Audit Findings

Living document for product review sessions and cumulative improvement ideas.

## Session 1 - Initial Expert PM Audit

Date: April 25, 2026  
App reviewed: https://store-smart-ca.vercel.app/  
Reference PRD: `/Users/niravparek/Downloads/StoreHub_PRD_v4_Final.docx.pdf`

### Access Summary

The webapp is accessible and authenticated access works with the provided demo credentials. The app contains the main shell and several modules: login, home, district intelligence, store deep dive, POG management, rule management, localization engine, AI Copilot, operations queue, communications, and user access management.

The current product has a strong visual foundation, especially in Store Ops Home, District Intelligence, Store Deep Dive, Operations Queue, and the Localization flow. However, the experience still reads as a curated prototype rather than a reliable sales-demo-ready product. Several core PRD promises are incomplete, disconnected, or not yet interactive.

### Highest Priority Issues

1. Deep links are broken. Directly opening `/home`, `/store-operations/district-intelligence`, `/command-center/ai-copilot`, and other app routes returns Vercel `404: NOT_FOUND`. The app only works when entered through `/` and navigated client-side. This will break sales-call links, refreshes, shared URLs, and browser recovery.

2. Auth is not sales-demo ready. Sign Up and Forgot Password links route to 404 pages. The PRD calls for SSO, MFA, first-time setup, account lockout, and session expiry behavior; none of these were visible.

3. Credentials/auth appear hardcoded client-side. This may be acceptable for a disposable prototype, but it is risky for an externally shared sales-demo URL. Move demo auth behind a safer demo backend or disposable auth provider.

4. Two different Home experiences exist. `/home` is a placeholder with “Welcome to Store Smart,” while Store Operations > Home contains the real AI Daily Brief. The real daily brief should be the default post-login landing page.

5. Branding is inconsistent. The PRD says `StoreHub`, the app says `Store Smart`, the URL says `store-smart-ca`, and sample data mixes Tennessee with European cities. This weakens credibility during sales calls.

6. Several top-nav controls appear clickable but do nothing useful. Help, Message, Notifications, Ask Alan, and Logo either do not open panels or do not navigate to meaningful destinations.

7. Create Broadcast does not open a broadcast composition workflow. Broadcasting is a core PRD differentiator, so this is a major demo gap.

8. Upload POG does nothing, and POG Workspace is disabled. For a POG-heavy sales story, this needs a polished flow.

9. AI Copilot mode behavior is misleading. Asking an analytics question returned a generic Knowledge Center SOP response. Analytics, POG Audit, and Actions modes need clear routing and mode-specific responses.

10. Data credibility issue: Store Deep Dive shows impossible dates such as `Mar 38`, `Mar 45`, and `Mar 52`.

### Functional Gaps Against PRD

- Add a real global search or command palette with `Ctrl/Cmd+K`.
- Add persistent date and period filters that actually control page data.
- Add working PDF and CSV export with branded report output.
- Add cross-module annotation: hover `+`, comments, @mentions, resolve/archive, action item conversion, and annotation history.
- Add Broadcast compose, schedule, target audience, priority, read receipts, analytics, non-compliance export, and follow-up message workflows.
- Add true Store Leaderboard drill-down from district rows into Store Deep Dive.
- Add Inbound Delivery Intelligence as a real Store Deep Dive tab: 7-day timeline, SKU manifests, receipt confirmation, partial receipt logic, and OOS risk.
- Add Field Intelligence Log: `+ Log Signal`, urgency, taxonomy, photo attachment, routing to DM/HQ, and contextual annotations.
- Add HQ Communication toggle inside Co-Pilot. Current Communications is a separate chat surface, not the unified PRD flow.
- Add Camera Shelf Audit flow: aisle selection, active POG reference, image capture/upload, compliance score, delta task list, partial completion, and re-scan.
- Add Comp Store Benchmarking rank card, peer group definition, KPI gap radar, evidence-backed prescriptive actions, and comp trend history.
- Complete Admin Console; User Access Management is currently “Coming Soon.”
- Add role-based access views for HQ Admin, DM, Store Manager, and Associate.
- Add session management behavior: timeout, extend session, logout, and forced logout if this is part of the demo story.

### UX/UI Improvements

- Make one “golden demo path” obvious: Daily Brief -> risky store -> root cause -> AI recommendation -> task/broadcast -> communications/closed loop.
- Reduce sidebar clutter or group modules more cleanly. The current navigation is long and can become cognitively heavy.
- Make active states and expanded/collapsed sidebar sections clearer.
- Add intentional empty, loading, and error states.
- Add confirmation and toast feedback for actions like Nudge, Create Broadcast, Upload POG, Export, and task creation.
- Use consistent retail terminology across the product: DPI/SPI, VoC, SEA, POG, Inbound, and Field Intel. Some screens use NPS, Google Reviews, or generic terms that do not match the PRD.
- Improve accessibility: many icon-only buttons lack useful labels, several generic buttons are unnamed, and interactive table row controls are hard to understand.
- Make charts visibly analytical. Several areas currently rely on text and tables where polished trends, radar charts, heatmaps, before/after POG visuals, and explainable drilldowns would sell the value better.
- Ensure app-level navigation does not leave users stranded on placeholder pages.
- Add visible breadcrumbs or context labels so the user knows whether they are in StoreHub Home, Store Ops Home, District Intelligence, or Command Center.

### Strategic 10X Demo Upgrades

- Build a scripted narrative around one crisis: stable sales masking VoC decline, inbound delay, POG gap, and field intel confirmation. Show StoreHub detecting the risk before revenue drops.
- Add a Demo Mode toggle with preloaded story states: Morning Brief, Silent Risk, OOS Imminent, Field Intel Confirmed, Broadcast Compliance, and Closed Loop.
- Add an executive value panel: revenue protected, hours saved, escalations avoided, compliance risk reduced.
- Add “why this matters” evidence on AI recommendations: peer-store comparison, top-tercile behavior, estimated impact, and confidence.
- Make every AI insight end with a next action button.
- Add a sales-safe role switcher: HQ Admin, District Manager, Store Manager, and Associate.
- Clean all sample data so it matches one client story, one geography, one hierarchy, and one terminology set.
- Build a guided demo checklist or internal presenter mode so sales can reliably traverse the strongest path.
- Add a “reset demo data” action so each sales call starts from the same pristine state.

### Quality And Credibility Issues

- Direct route refresh breaks with Vercel 404s.
- Forgot Password and Sign Up links are broken.
- Default `/home` route is a placeholder.
- Top nav actions are visually clickable but mostly inert.
- Broadcast creation does not open compose.
- POG upload does not open upload.
- AI Analytics query returned Knowledge Center/SOP output.
- Impossible calendar labels appear in Store Deep Dive.
- Sample data mixes geography and brand context.
- Some interactions appear to mutate visual state only without connected workflow state.
- Search/filter behavior needs stronger validation. Store Leaderboard search did not clearly filter when combined with At Risk.
- User Access Management is “Coming Soon,” despite being listed in PRD scope.

### Product Manager Recommendation

Before a live sales call, prioritize:

1. Fix SPA routing and broken auth links.
2. Make Store Ops Home the default authenticated landing page.
3. Wire the top 5 demo CTAs: Create Broadcast, Upload POG, Export, AI Analytics, and Store Leaderboard drill-down.
4. Clean demo data and branding to a single coherent story.
5. Add a guided demo path with one complete closed-loop workflow.

The product has the right shape and many promising screens, but the current prototype needs stronger workflow continuity and credibility polish before it can carry a high-stakes sales demo.

## Session 2 - Pure UX/UI Review

Date: April 25, 2026  
Review mode: Visual UX/UI review of the deployed app. Computer Use was requested, but the Computer Use plugin was not available in this session, so this pass used the available in-app browser visual surface.

### Overall UX Verdict

The product has a polished enterprise-dashboard skin, but the UX does not yet feel like a premium, sales-demo-ready operating system. The strongest screens show good structure and credible retail concepts, but the experience is diluted by inert controls, inconsistent routing, uneven hierarchy, placeholder pages, mismatched terminology, and too many disconnected dashboard fragments.

The biggest UX problem is not visual styling; it is confidence. A sales buyer should feel, within 60 seconds, that StoreHub knows what happened, why it happened, who needs to act, and what the next action is. Today the UI often shows many impressive blocks, but it does not consistently guide the user through a complete operational decision.

### Top UX/UI Fixes Before A Sales Demo

1. Create one unmistakable default landing experience. After login, land directly on the rich Store Operations Home daily brief, not the placeholder `/home`.

2. Make all visible CTAs work or remove them. Inert buttons damage trust faster than missing buttons. Prioritize Help, Message, Notifications, Ask Alan, Create Broadcast, Upload POG, Export, Nudge, and View Details.

3. Introduce a guided demo path. Add a visible "Start Demo" or "Today" flow that moves through: Daily Brief -> Risk Detail -> Store Deep Dive -> AI Recommendation -> Create Task/Broadcast -> Communication/Closed Loop.

4. Reduce visual noise in the sidebar. The current sidebar is long, dark, and dense. It competes with the actual work area and makes the app feel larger than it is. Collapse groups more clearly, improve nesting, and separate primary workflows from admin/configuration.

5. Standardize page anatomy. Every major page should have the same structure: page title, scope selector, date/data freshness, primary actions, summary insight, then supporting evidence. Today the page layouts feel bespoke.

6. Improve hierarchy inside dense cards. Many cards use similar weights, badges, pills, and small text. Important actions and critical risks should visually dominate; secondary metadata should recede.

7. Replace generic dashboard blocks with decision-oriented modules. Instead of just tables and KPIs, use "What changed," "Why it matters," "Recommended action," and "Owner/SLA."

8. Clean all demo data and copy. The mix of Tennessee, European store names, NPS, Google Reviews, Store Smart, and StoreHub feels stitched together. Choose one narrative and make every label support it.

9. Add purposeful feedback for every action. Buttons should produce a modal, panel, toast, route change, or visible state update. No silent clicks.

10. Make the AI experience mode-specific and visually distinct. Knowledge, Analytics, POG Audit, Actions, HQ Message, and Field Intel should each have different prompts, output templates, and action buttons.

### Navigation And IA

- Problem: The sidebar is overloaded and mixes modules, submodules, command center tools, and admin functions at the same visual level.
  - Improvement: Reorganize into four top-level sections: Home, Store Operations, Planogram Intelligence, Command Center, Admin. Keep only one section expanded by default.

- Problem: Store Operations Hub is a parent item, but it also behaves like a selectable item. This creates confusion because clicking it can reveal nested items without changing the page meaningfully.
  - Improvement: Make parent items purely expandable, or give them a meaningful overview page. Do not mix both behaviors.

- Problem: Top navigation icons are not self-explanatory and do not open useful surfaces.
  - Improvement: Add real popovers for Help, Messages, Notifications, and User Menu. Add tooltips on hover and accessible labels.

- Problem: There is no breadcrumb or scope trail.
  - Improvement: Add a compact breadcrumb such as `Store Operations / District Intelligence / District 14` and keep district/store/date scope visible.

- Problem: Deep app areas feel disconnected.
  - Improvement: Add cross-links from every insight to its relevant workflow: "Open Store," "Create Task," "Message SM," "Broadcast to Stores," "Open POG Variant."

### Visual Design And Hierarchy

- Problem: The UI uses many cards, pills, badges, shadows, and tinted surfaces at once. It looks polished, but the eye has to work too hard to know where to start.
  - Improvement: Use one dominant insight card per page. Limit high-emphasis color to critical state, active selection, and primary action.

- Problem: The purple sidebar is visually heavy and pulls attention away from the analytics workspace.
  - Improvement: Reduce sidebar saturation or use a quieter dark neutral. Keep active item color strong, but let inactive navigation recede.

- Problem: Critical items are not always visually louder than non-critical items. Some important alerts appear as small badges inside busy cards.
  - Improvement: Use a consistent critical alert pattern: red left border, clear title, owner/SLA, and one primary action.

- Problem: Cards have inconsistent density. Some have generous spacing, others pack too much copy.
  - Improvement: Define card types: KPI card, insight card, action card, table card, message card. Use consistent spacing, title size, metadata placement, and action placement.

- Problem: Several headings are too generic: "AI Summary," "Insights," "Overall situation," "Root Cause."
  - Improvement: Use outcome-based headings: "Why Hamburg South Is Critical," "What Changed Overnight," "Recommended First Move."

- Problem: Dashboard pages feel like they scroll into many unrelated sections.
  - Improvement: Add section anchors or sticky subnav for long pages: Executive Pulse, Triage, KPIs, Leaderboard, Compliance, Broadcasts.

### Home Screen UX

- What works: The Store Operations Home has the best demo potential. It has greeting, data freshness, daily brief, broadcasts, metrics, issue summary, and action queue.

- Problem: The top AI Daily Brief is visually compelling but cramped. The most important sentence competes with badges, timestamps, stream count, and nested mini-cards.
  - Improvement: Lead with a concise executive headline: "Messy aisles are now a district-level risk." Put the supporting metrics below.

- Problem: The HQ Broadcasts panel is useful but visually similar to the daily brief card.
  - Improvement: Treat broadcasts as an inbox with clear read/unread state, priority, sender, SLA, and acknowledge action.

- Problem: The Action Queue is below the fold on common desktop viewports.
  - Improvement: Pull top 3 actions into the first viewport. Sales demos should show immediate actionability without scrolling.

- Problem: The KPI tiles show values but not enough operational meaning.
  - Improvement: Add micro-copy under each KPI: "1 overdue task," "3 stores behind," "trend improving," etc.

- Problem: The floating chat button overlaps the lower-right content area.
  - Improvement: Offset it from scrollable cards or integrate it as a persistent right rail action.

### District Intelligence UX

- What works: The District Intelligence page has strong content blocks: performance index, triage summary, AI summary, broadcasts, escalations, KPIs, leaderboard, and heatmap.

- Problem: The page tries to be executive summary, command center, analytics workspace, and broadcast manager all at once.
  - Improvement: Add tabs or a sticky section nav: Executive Pulse, Triage, Stores, Compliance, Broadcasts.

- Problem: The triage summary "View Details" buttons are repeated and generic.
  - Improvement: Rename each action: "Open VoC Theme," "Open Safety Escalation," "Open Inbound Risk."

- Problem: The performance index is visually strong but not explanatory enough.
  - Improvement: Add the formula or expandable "Why 87?" drawer with Sales, SEA, VoC contribution and trend.

- Problem: The leaderboard table has unlabeled action buttons in the last column.
  - Improvement: Use clear row actions: "Open Store," "Create Task," "Message SM." Add accessible labels and visible text where space allows.

- Problem: Filter/search behavior is hard to trust. Search and status filters can coexist without clearly showing active query and result count.
  - Improvement: Add filter chips above the table: `At Risk`, `Search: Pine`, `4 results`. Provide "Clear filters."

- Problem: Heatmap appears below a long page and is not connected to action.
  - Improvement: Let heatmap cells open a store/category drilldown with recommended task creation.

- Problem: Broadcast panel is informational, not operational.
  - Improvement: Add sender workflow, schedule, audience selection, acknowledgement tracking, and "Nudge non-responders."

### Store Deep Dive UX

- What works: The store selector, KPI strip, operational compliance view, audit lens, AI insight, VoC analysis, inbound inventory table, and benchmarking tabs give the page a strong operations feel.

- Problem: The top store page does not clearly answer "what should I do first?"
  - Improvement: Add a store-level action banner under the KPI strip: "Next best action: replenish WOM-DRS-008 before Saturday traffic."

- Problem: The KPI cards open small panels but the relationship between metric, cause, and action is weak.
  - Improvement: KPI drilldown should include trend, benchmark, root cause, and one recommended action.

- Problem: Store Deep Dive is overloaded with multiple concepts in one vertical scroll.
  - Improvement: Convert major areas into tabs: Summary, SEA, VoC, Inbound, POG, Shelf Audit, Comp Benchmark, Alerts.

- Problem: Dates in the 8-week audit lens show impossible values.
  - Improvement: Fix date generation and use week ranges instead: `Mar 3-9`, `Mar 10-16`.

- Problem: The audit lens numbers appear to change between refreshes, which undermines trust.
  - Improvement: Keep demo data deterministic for the session. Buyers notice metric drift.

- Problem: The "Show Causal Chain" output is too abstract: category percentages without a visible causal path.
  - Improvement: Show a chain: `Staffing dip -> Long queues in VoC -> Checkout score decline -> Sales risk`. Make each node clickable.

- Problem: Comp Benchmarking is mostly a comparison table.
  - Improvement: Add the PRD's prominent rank card, radar chart, top-tercile actions, peer group composition, and "why these stores are peers."

- Problem: Inventory & Inbound lacks timeline and receipt actions.
  - Improvement: Add a 7-day shipment timeline, delayed shipment badge, SKU risk ranking, and "Confirm receipt" action.

### AI Copilot UX

- Problem: The mode selector does not reliably change the behavior of the assistant.
  - Improvement: Each mode should have a distinctive placeholder, suggested prompts, response format, and actions.

- Problem: Analytics questions can return Knowledge Center content.
  - Improvement: Add intent classification and a visible mode lock: "Analytics mode: querying store performance data."

- Problem: Suggested prompts are mostly policy/SOP prompts even when analytics or POG modes exist.
  - Improvement: Suggested prompts should update by mode:
    - Analytics: "Which stores have high sales but declining VoC?"
    - POG Audit: "Audit this shelf photo against POG v2.1."
    - Actions: "Create tasks for all stores below 70% POG compliance."
    - HQ Message: "Send this insight to the DM."

- Problem: AI answers do not consistently end in action.
  - Improvement: Every answer should include action buttons: Open Store, Create Task, Add Annotation, Message HQ, Export Summary.

- Problem: The chat UI does not show data provenance strongly enough for analytics.
  - Improvement: Add source chips: POS, SEA, VoC, Inbound, Field Intel, timestamp, confidence.

- Problem: The product has both "Ask Alan" and "AI Copilot."
  - Improvement: Pick one name, or make Ask Alan a global launcher that opens AI Copilot with current page context.

### Communications UX

- What works: The chat page has a familiar messaging layout and useful segmentation between direct, groups, and broadcasts.

- Problem: Communications feels generic and not uniquely StoreHub.
  - Improvement: Add contextual entities to threads: store, POG, broadcast, task, KPI, audit issue, SLA.

- Problem: Broadcast channels are mixed with chat threads.
  - Improvement: Separate "Inbox," "Broadcasts," and "Escalations" or use strong badges and filters.

- Problem: There is no visible SLA/routing layer.
  - Improvement: Add thread status, priority, owner, due time, escalation path, and "Mark resolved."

- Problem: New Broadcast in Communications can create a broadcast shell, but the District page Create Broadcast does not open a compose workflow.
  - Improvement: Consolidate broadcast creation into one robust composer.

- Problem: Message actions use icon-only controls.
  - Improvement: Add tooltips and accessible labels. For sales demos, include visible text for high-value actions like "Attach KPI" or "Escalate."

### Planogram UX

- What works: The Localization Engine has a promising step-by-step flow: category -> corporate standard -> store group -> engine. This is one of the clearer UX patterns in the product.

- Problem: Master POG Management looks like a library but lacks meaningful preview/action affordances.
  - Improvement: Each POG card should expose Preview, Version History, Assign to Cluster, Generate Variant, and Publish.

- Problem: Upload POG is visible but inert.
  - Improvement: Either wire it to a modal/file upload or hide it until ready.

- Problem: POG Workspace is disabled without explanation.
  - Improvement: Add a tooltip or badge: "Coming soon" or "Select a POG to enable workspace."

- Problem: Localization Engine cards are image-driven but not visually rich enough to sell planogram intelligence.
  - Improvement: Add before/after POG previews, highlighted constraint changes, product movement overlays, and revenue impact.

- Problem: Rule Management is dense and table-heavy.
  - Improvement: Add rule health summary: active rules, conflicting rules, unmapped rules, draft rules. Make "Draft - Kids Age Grouping 2/4" clearer.

- Problem: Delete actions are visible in rule rows.
  - Improvement: Move destructive actions into a kebab menu with confirmation. Keep primary actions as View/Edit.

### Operations Queue UX

- What works: The board view is concrete and demo-friendly. Tasks, assignees, priority, due dates, and status buckets are easy to grasp.

- Problem: Task cards are dense and repetitive.
  - Improvement: Emphasize task title, priority, due date, owner, and linked entity. Collapse long descriptions until expanded.

- Problem: "Create Task" modal is functional but generic.
  - Improvement: Add linked source context: created from broadcast, AI insight, shelf audit, VoC issue, or manual.

- Problem: Due dates are plain inputs.
  - Improvement: Use a date picker and quick choices: Today, Tomorrow, This Friday, Custom.

- Problem: No task detail view is apparent.
  - Improvement: Clicking a task should open a right panel with full history, comments, attachments, linked store, and completion checklist.

- Problem: Board/List toggle is useful but could be more prominent.
  - Improvement: Preserve view state and show counts by priority inside each status bucket.

### Admin And Configuration UX

- Problem: User Access Management is a "Coming Soon" page, but the sidebar presents it as a real module.
  - Improvement: For a sales demo, either hide it or make it a polished static preview with credible user table, roles, permissions, and audit log.

- Problem: The PRD promises white-label branding, labels, roles, and data connections, but the UI does not yet show that.
  - Improvement: Add an Admin Console preview with Branding, Labels, Users, Roles, Data Connections, and Audit Log tabs.

### Accessibility And Trust

- Add accessible names to all icon-only buttons.
- Add visible focus states that are not only color-based.
- Ensure all badges meet contrast requirements, especially low-saturation pills on tinted cards.
- Avoid relying on color alone for critical/high/medium/low priority.
- Make all tables keyboard navigable with clear row actions.
- Add alt text or descriptive labels for POG images.
- Add predictable modal focus behavior and Escape-close support.
- Make disabled controls explain why they are disabled.

### Copy And Terminology

- Replace generic labels with operational labels:
  - "View Details" -> "Open VoC Theme," "Open Safety Issue," "Open Inbound Risk."
  - "Insights" -> "Broadcast Performance Insights" or "Risk Pattern."
  - "Root Cause" -> "Likely Root Cause."
  - "Analytics" -> "Performance Analytics."

- Use one product name everywhere: StoreHub or Store Smart, not both.
- Use one customer geography and store taxonomy.
- Use one customer feedback terminology set: VoC, CSAT, or NPS, not all mixed.
- Make AI copy more decisive and less generic. Sales buyers want specificity.

### Recommended Visual Polish Pass

1. Normalize spacing across all cards and page sections.
2. Reduce the number of simultaneous badge styles.
3. Define one primary button style and reserve it for the next best action.
4. Add consistent right-side detail panels for drilldowns.
5. Add skeleton loading states instead of generic "Loading next step."
6. Use deterministic demo data so metrics do not drift between refreshes.
7. Improve chart surfaces: real axes, legends, hover states, benchmarks, and empty states.
8. Add a small "Data refreshed" chip consistently across pages.
9. Make high-risk stores visually traceable across Home, District, Store Deep Dive, Queue, and Communications.
10. Create a clean demo reset state.

### UX/UI Priority Roadmap

#### P0 - Fix Before Any Sales Demo

- Fix direct route refresh/deep-link 404 behavior.
- Make the rich daily brief the post-login landing page.
- Remove or wire inert top-nav and primary CTA buttons.
- Fix broken Forgot Password and Sign Up links.
- Fix impossible dates and inconsistent sample data.
- Make AI modes return mode-appropriate answers.
- Add visible feedback for Create Broadcast, Upload POG, Export, Nudge, and View Details.

#### P1 - Make The Demo Feel Premium

- Add guided demo flow and role switcher.
- Add real Broadcast composer and acknowledgement tracking.
- Add POG upload/preview/version workflow.
- Add Store Leaderboard row drilldown.
- Add Store Deep Dive tabs for Summary, SEA, VoC, Inbound, POG, Shelf Audit, Benchmarking.
- Add action-oriented AI answers with source chips and next steps.
- Add a right-side detail drawer pattern across KPI, table, and alert drilldowns.

#### P2 - Make The Product Feel 10X

- Add cross-module annotations.
- Add field intel capture and routing.
- Add real inbound timeline and receipt confirmation.
- Add camera shelf audit upload and delta task generation.
- Add comp-store radar and evidence-backed prescriptive actions.
- Add admin branding/labels/users/data connection preview.
- Add exportable executive report with annotations and action status.

### Final UX Takeaway

The UI has enough polish to suggest a serious enterprise product, but the experience needs a stronger spine. For sales, the app should not feel like "many dashboards." It should feel like a command center that notices an issue, explains it, assigns action, follows up, and proves closure. The fastest path to a stronger demo is to wire fewer workflows more completely, reduce visual clutter, and make every screen answer: what changed, why it matters, what to do next, and who owns it.
