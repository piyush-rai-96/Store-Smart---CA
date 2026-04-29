# StoreHub Modules: Purpose and Screen Interaction Script

## 1. Document Purpose

This document is a detailed functional script for the current `StoreHub` application as implemented in code.

It is intended to help you with:

- product walkthroughs
- stakeholder demos
- onboarding new team members
- documenting module responsibilities
- understanding how screens hand off work to one another
- identifying which roles can access which modules

This document is based on the current routed application structure in `src/App.tsx`, the shared layout and access-control system, and the primary screen components under `src/pages`.

## 2. Application at a Glance

`StoreHub` is organized into four top-level product areas shown in the sidebar:

- **Store Operations Hub**
- **Planogram Intelligence**
- **Command Center**
- **Application Configuration**

These are delivered inside a shared shell made up of:

- `MainLayout`
- `SidebarNew`
- `AppHeader`
- `Breadcrumb`
- `ProtectedRoute`
- `AuthContext`
- `ExecutionTasksContext`
- `ToastContext`

## 3. Shared Platform Behavior

### 3.1 Authentication and Session Model

The application uses `AuthContext` to manage:

- authenticated session state
- current logged-in user
- user directory
- add/update/remove user operations
- local storage persistence

### 3.2 Default Demo Users

The current seeded users are:

- **ADMIN**: Clarke T
- **DM**: John Doe
- **SM**: Marco Rossi
- **HQ**: Elena Fischer

These users are loaded from `src/constants/auth.ts` and mapped to route access through `ROLE_ACCESS`.

### 3.3 Route Protection

`ProtectedRoute` enforces:

- user must be authenticated
- user may only access screens included in `user.accessRoutes`
- unauthorized access redirects to `/store-operations/home`

`PublicRoute` prevents logged-in users from revisiting the login screen and redirects them to the Store Operations home route.

### 3.4 Shared Navigation Experience

Across the product, the shell behaves consistently:

- **Sidebar** exposes top-level modules and submodules
- **Header** exposes notifications, help/support, and logout
- **Breadcrumb** shows section and page location
- **Role access** filters the visible sidebar entries

### 3.5 Shared Task Handoff Layer

`ExecutionTasksContext` is one of the most important cross-module connectors.

It stores and exposes:

- execution tasks
- task assignment
- task status updates
- tasks grouped by localization result
- shared team members

This is what allows modules such as:

- `POGLocalizationEngine`
- `AICopilot`
- `StoreCenter`
- `TaskCenter`

to feel connected operationally.

## 4. Role-to-Screen Access Matrix

### 4.1 Admin

Admin has access to all routed screens:

- Home
- District Intelligence
- Store Deep Dive
- Master POG Management
- POG Rule Management
- POG Localization Engine
- AI Copilot
- Operations Queue
- Communications
- User Access Management

### 4.2 District Manager (DM)

DM can access:

- Home
- District Intelligence
- Store Deep Dive
- AI Copilot
- Operations Queue
- Communications

### 4.3 Store Manager (SM)

SM can access:

- Home
- Store Deep Dive
- AI Copilot
- Operations Queue
- Communications

### 4.4 HQ Merchandising (HQ)

HQ can access:

- Home
- District Intelligence
- Master POG Management
- POG Rule Management
- POG Localization Engine
- AI Copilot
- Operations Queue
- Communications

## 5. Routed Screen Inventory

### 5.1 Public Screens

- `/login` → `Login`

### 5.2 Store Operations Hub

- `/store-operations/home` → `StoreOpsHome`
- `/store-operations/district-intelligence` → `DistrictIntelligence`
- `/store-operations/store-deep-dive` → `StoreCenter` (this is the active Store Deep Dive route)

### 5.3 Planogram Intelligence

- `/planogram/master-pog` → `MasterPOGManagement`
- `/planogram/rule-management` → `POGRuleManagement`
- `/planogram/localization-engine` → `POGLocalizationEngine`

### 5.4 Command Center

- `/command-center/ai-copilot` → `AICopilot`
- `/command-center/operations-queue` → `TaskCenter`
- `/command-center/communications` → `MessageCenter`

### 5.5 Application Configuration

- `/app-config/user-access` → `UserAccessManagement`

## 6. Module-by-Module Detailed Script

---

# 6A. Public Access Module

## Screen: Login

### Route

- `/login`

### Primary Purpose

This is the application entry point.
It authenticates the user and routes them into the protected product experience.

### Main UI Elements

- IA branding/logo panel
- email input
- password input
- password visibility toggle
- sign-in button
- inline validation and error display
- disabled forgot-password affordance
- contact-admin guidance for new access

### Key Interactions

- **Enter email/password**
  - user types credentials
  - local validation ensures both fields are filled

- **Toggle password visibility**
  - flips between masked and plain-text password state

- **Submit sign-in**
  - calls `login(email, password)` from `AuthContext`
  - on success, navigates to `/store-operations/home`
  - on failure, shows invalid credentials error

### Downstream Effect

Successful login unlocks the entire protected shell and filters module access based on role.

---

# 6B. Store Operations Hub

## Screen: Home (`StoreOpsHome`)

### Route

- `/store-operations/home`

### Primary Purpose

This is the operational landing page for non-HQ roles.
It surfaces the most important daily issues, recommended actions, broadcasts, and quick workflows in one place.

### Role Variant

- if the logged-in user is `HQ`, this route renders `HQHome` instead of the standard Store Ops Home

### Main UI Responsibilities

- daily operational briefing
- prioritization of issues
- execution follow-up
- broadcast awareness
- drill-in via detail panels and modal workflows

### Main UI Areas

- greeting / context header
- AI-style insight cards
- action item list
- broadcast strip/list
- right-side detail panel
- multiple modal workflows for approvals, assignments, SKU review, checklists, shipment validation, and VoC escalations

### Important Interaction Patterns

- **Refresh dashboard state**
  - simulates data refresh
  - updates last refresh timestamp

- **Open action item**
  - clicking an action opens a right-side detail panel
  - detail content changes based on source module and task type

- **Approve or reject action**
  - action items can be approved/rejected
  - approved/rejected items are archived out of the active list
  - confirmation toasts are shown

- **Assign work to a person**
  - assignment modal uses a premium assignee dropdown
  - selected assignee is stored and confirmation is shown

- **Review SKUs / reorder flow**
  - low-stock flows let the user select affected SKUs
  - user can send reorder actions or reorder all

- **Broadcast drill-in**
  - clicking a broadcast marks it read
  - opens enriched broadcast details with dates, attachments, and action items

- **Regional / top performer drill-ins**
  - insight cards can open regional or top-performer experiences

### Cross-Module Handoffs

- planogram-related actions conceptually connect to Planogram Intelligence flows
- execution actions map into Operations Queue concepts
- broadcasts align with Communications and district/store compliance follow-through

## Screen Variant: HQ Home (`HQHome`)

### When It Appears

Rendered automatically for `HQ` users who open `/store-operations/home`.

### Primary Purpose

This is the executive/strategic version of the home dashboard.
It summarizes district-level performance, enterprise risk, execution priorities, and communication reach.

### Main UI Areas

- KPI strip with click-through destinations
- AI brief / strategic insights
- priority action queue
- district leaderboard/table
- broadcast panel
- execution overview
- workflow modal for acting on priority items
- district multi-select broadcasting

### Main Interactions

- **Sort districts** by DPI or risk level
- **Select multiple districts** and send a broadcast
- **Open priority workflow** and act on selected items
- **Open broadcast details** and mark as read
- **Send kudos / raise concern** from insight cards
- **Navigate to target module** from KPI cards

### Cross-Module Handoffs

- KPI cards route into District Intelligence, Operations Queue, Communications, or Master POG
- strategic insights route into Communications or District Intelligence
- workflow actions simulate enterprise-level orchestration

## Screen: District Intelligence

### Route

- `/store-operations/district-intelligence`

### Primary Purpose

District Intelligence is the district command-and-diagnose screen.
It helps leaders understand district health, store ranking, KPI movement, compliance heatmaps, broadcast effectiveness, and issue triage.

### Role Behavior

- **DM view** works directly on the district dataset
- **HQ/Admin view** gets a district selector and can pivot across multiple districts

### Main UI Areas

- district header with period controls
- district KPI / DPI hero card
- AI Daily Brief
- KPI tiles with drill-in panels
- triage cards
- VoC and SEA detail panels
- compliance heatmap
- leaderboard
- broadcast analytics section
- broadcast creation wizard

### Primary Interactions

#### A. District and period selection

- HQ/Admin can switch districts using a dropdown
- users can switch between week, month, and quarter views
- calendar logic prevents selecting invalid future/current incomplete periods
- the KPI tiles and leaderboard data adapt to the chosen period

#### B. KPI exploration

- KPI tiles are clickable
- clicking a tile opens a detailed side/panel view for that KPI
- panel content changes with metric selection

#### C. Store drill-down

- leaderboard rows and store references can navigate to Store Deep Dive
- route used:
  - `/store-operations/store-deep-dive?store=<storeNumber>&name=<storeName>`

#### D. Triage workflows

- triage items can be opened for more detail
- issues are framed as operational, customer, safety, inventory, or compliance problems

#### E. Heatmap investigation

- hover reveals compliance tooltip context
- clicking a cell opens a detailed modal/panel
- from that detail, user can:
  - investigate in AI Copilot
  - navigate to Store Deep Dive

#### F. Broadcast analytics and wizard

- broadcast analytics track:
  - active broadcasts
  - sent this week
  - acknowledgement rate
  - average acknowledgement time
  - store-level compliance
  - repeat defaulters
- user can open a 3-step broadcast wizard to:
  - choose audience
  - define priority/category
  - write and send message

### Cross-Module Handoffs

- **to Store Deep Dive** via store rows or heatmap detail
- **to AI Copilot** via heatmap issue investigation
- **to Communications** through broadcast-related action patterns

## Screen: Store Deep Dive (`StoreCenter`)

### Route

- `/store-operations/store-deep-dive`

### Important Note

This route currently renders `StoreCenter.tsx`, which is the active Store Deep Dive implementation.
A separate `StoreDeepDive.tsx` file still exists in the repo but is not the routed screen.

### Primary Purpose

This page is the store-level operational cockpit.
It converts district intelligence into a store-specific performance, compliance, inventory, inbound, customer, and action story.

### Main UI Areas

- store selector header
- SPI hero gauge / rank / score breakdown
- AI Daily Brief with root cause and ranked actions
- Store KPI section
- Operational Compliance View (OCV)
- 8-week audit lens
- Operational Breakdown section
- tabbed lower-deck analysis areas including inventory, inbound, VoC, and competitive benchmarking

### Main Interaction Script

#### A. Store selection and header operations

- users can change store from the selector
- header contains search, export, and refresh affordances
- query params determine which store is loaded

#### B. Hero pulse interaction

- the SPI card visualizes store performance index
- the AI Daily Brief merges tier-based narrative with root-cause analysis and ranked actions
- users get immediate context on:
  - why the store is performing the way it is
  - what to do next
  - which modules are implicated

#### C. KPI cards

- KPI section mirrors District Intelligence styling
- KPI cards display six major categories:
  - Sales Performance
  - VoC Satisfaction
  - VoC Issue Rate
  - Shelf Audit Compliance
  - OOS Rate
  - Margin Health
- clicking a KPI opens a 52-week trend detail panel
- status pills summarize:
  - On Track
  - Watch
  - Needs Attention

#### D. Operational Compliance View (OCV)

This section visualizes the execution chain from broadcast to store action completion.

Key interactions:

- choose an active broadcast from tabs
- inspect broadcast metadata and instructions
- inspect action mapping and completion progress
- click **View Operation Queue** to open the filtered Operations Queue for that broadcast

Route handoff:

- `/command-center/operations-queue?broadcast=<broadcastId>`

#### E. Audit Lens

The audit lens gives historical store execution visibility over recent weeks.
It supports diagnostic exploration of compliance categories and trend deterioration or recovery.

#### F. Operational Breakdown

This section was renamed from the older Tactical Deep Dive concept.
It behaves as the deeper store-level operational analysis zone and is designed to match District Intelligence’s card-title treatment.

#### G. Lower tabbed analysis areas

The current Store Deep Dive emphasizes the following major deep-dive topics:

- **Inventory**
- **Inbound**
- **VoC**
- **Comp Benchmarking**

Key behaviors across these tab areas include:

- inventory and inbound investigation
- VoC decision-support cards and action framing
- benchmarking using relative performance rather than duplicated absolute KPIs
- operational insights routed back into tasking and analysis flows

#### H. Benchmarking behavior

Comp Benchmarking focuses on:

- rank
- quartile
- rank movement
- distribution positioning
- strengths and gaps

This is designed as intelligence, not just metric duplication.

### Cross-Module Handoffs

- **to Operations Queue** through OCV broadcast drill-ins
- **to AI Copilot** from deep diagnostic flows
- **from District Intelligence** when a district user drills into a store

---

# 6C. Planogram Intelligence

## Screen: Master POG Management

### Route

- `/planogram/master-pog`

### Primary Purpose

This is the authoritative library and workspace for corporate planograms.
It lets users search, filter, inspect, and select master POG templates.

### Main UI Areas

- page header
- two-tab layout:
  - POG Library
  - POG Workspace
- search bar
- upload button
- multi-filter stripe
- POG card grid
- workspace detail view for selected planogram

### Primary Interactions

- **Search planograms** by name/category
- **Filter** by category, status, fixture type, cluster, date, and creator
- **Clear all filters**
- **Select a POG card**
  - stores the selected planogram
  - switches the user into Workspace tab
- **Inspect rule and cluster mappings**
  - workspace presents rule summaries and applicable cluster logic

### Cross-Module Role

This module is the starting point for understanding the corporate standard before moving into:

- POG Rule Management for rule definitions
- POG Localization Engine for cluster/store-group adaptation

## Screen: POG Rule Management

### Route

- `/planogram/rule-management`

### Primary Purpose

This module is the planogram rules authoring and maintenance console.
It manages the logic layer behind planogram behavior.

### Main UI Areas

- library/builder tabs
- searchable rule list
- filters
- rule detail view
- rule delete modal
- multi-step rule builder wizard

### Rule Builder Steps

1. **Basic Info**
2. **Mapping**
3. **Rule Types**
4. **Rule Definition**

### Primary Interactions

- **Search rules**
- **Filter rules** by type/category/status/mapping
- **Open rule details**
- **Edit existing rule**
- **Delete rule** with confirmation
- **Create new rule** through builder workflow
- **Save draft** mid-way through builder flow
- **Publish/save full rule** after completing all steps

### Special Integration Behavior

This screen accepts deep-linked rule creation from AI Copilot via URL params:

- `newRuleName`
- `newRuleType`
- `newRuleCategory`

That means AI Copilot can effectively propose a rule and send the user into this module with pre-created content.

### Cross-Module Handoffs

- receives suggested/generated rules from AI Copilot
- supports rule authoring that later influences Localization Engine outputs

## Screen: POG Localization Engine

### Route

- `/planogram/localization-engine`

### Primary Purpose

This screen transforms corporate planograms into cluster/store-group-specific variants.
It acts like an agentic localization workflow with explainability.

### Main UI Areas

- run/results tabs
- 4-step workflow:
  - Category
  - Corporate Standard
  - Store Group
  - Localization Engine
- engine stage visualization
- result explanation panels
- publish modal
- results filters/search
- rollback support

### Engine Stages

- Geometry & Localization
- Demand Rebalancing
- Policy Validation
- Execution Packaging

### Primary Interaction Script

#### A. Run workflow

- user picks a category
- user picks a corporate POG
- user picks a store group
- user optionally adds custom prompt guidance
- user launches localization engine

#### B. Engine simulation and reasoning

The screen animates through the engine stages and generates:

- reasoning text
- supporting details
- cluster-specific changes
- why-changed explanations
- diff highlights
- generated task count
- confidence-style outcome summary

#### C. Result management

Users can:

- inspect ready results
- search/filter prior results
- expand explanation reasons
- publish a result
- rollback a published result

#### D. Publish handoff to execution

Publishing a localization result generates human-readable execution tasks and writes them into `ExecutionTasksContext`.
This is a critical operational bridge from planning to store execution.

### Cross-Module Handoffs

- **to Operations Queue / Task ecosystem** by generating execution tasks
- **from Master POG** conceptually, since localization starts from corporate standards
- **from POG Rule Management** because rule definitions govern localization constraints

---

# 6D. Command Center

## Screen: AI Copilot

### Route

- `/command-center/ai-copilot`

### Primary Purpose

AI Copilot is a multi-skill assistant interface that supports policy lookup, analytics, shelf/POG audit, and action creation.

### Skill Modes

- **Knowledge Center**
- **Analytics**
- **POG Audit**
- **Actions**

### Main UI Responsibilities

- chat-style interaction
- context-aware responses
- citations and source attribution
- KPI cards and charts
- image-based compliance/OOS auditing
- action/task generation
- rule proposal generation

### Skill-by-Skill Interaction Script

#### A. Knowledge Center

Purpose:

- answer SOP, policy, and procedural questions with citations

Interactions:

- user enters a policy question
- copilot returns structured answer
- cited sources are attached
- follow-up questions are suggested

Example outcomes:

- fire exit procedures
- planogram notice periods
- product recall protocol
- safety audit process

#### B. Analytics

Purpose:

- answer business-performance questions with KPI cards and visualizations

Interactions:

- user asks about sales, VoC, margin, underperforming stores, etc.
- copilot responds with:
  - narrative explanation
  - KPI cards
  - charts
  - follow-up prompts

#### C. POG Audit

Purpose:

- analyze shelf images for compliance and out-of-stock conditions

Interactions:

- user uploads an image
- runs an agentic processing sequence
- for compliance flow, returns:
  - audit grade
  - category breakdown
  - top deviations
  - recommendations
- for OOS flow, returns:
  - detected empty positions
  - product/section/location table
  - recommended replenishment next steps

#### D. Actions

Purpose:

- turn natural language into executable operations

Interactions:

- user requests a task or operational action
- copilot parses intent
- simulates agentic creation flow
- returns either:
  - `taskCreated` payload
  - `pogRuleCreated` payload

### Special Integration Behavior

AI Copilot has two especially important downstream integrations:

- **POG Rule Management**
  - generated rule ideas can be pushed there via URL params
- **Operations Queue**
  - generated action items conceptually feed the task system

### Cross-Module Handoffs

- receives investigation requests from District Intelligence and Store Deep Dive
- proposes rules for POG Rule Management
- produces actions for Operations Queue
- supports operational investigation across the entire product

## Screen: Operations Queue (`TaskCenter`)

### Route

- `/command-center/operations-queue`

### Primary Purpose

This is the execution management workspace.
It tracks operational tasks generated manually or by upstream systems.

### Main UI Areas

- board/list view toggle
- search
- status filters
- create-task modal
- task cards / task table
- task detail modal/panel
- broadcast-prefill banner

### Sources of Tasks

Tasks can originate from:

- seeded operational data
- AI POG Audit
- Localization Engine
- Broadcast workflows
- manual creation
- alert-driven prefill flows

### Primary Interactions

#### A. View management

- switch between board and list view
- filter by status
- search by title/description/assignee

#### B. Broadcast deep-link behavior

If user lands with `?broadcast=<id>`:

- queue auto-switches to list view
- applies search highlighting tied to that broadcast
- shows relevant tasks only more clearly

#### C. Alert-to-task prefill behavior

If navigation state includes `prefillFromAlert`:

- queue auto-generates one task per impacted store
- tasks are assigned to store managers where possible
- banner explains what was created

#### D. Manual task creation

- user opens create modal
- sets title, description, priority, assignee, due date, and type
- task is written to shared task context

#### E. Task drill-down

- click a card or row to inspect details
- task cards show source badges, confidence, due dates, assignee initials, and status

### Cross-Module Handoffs

This is the main operational receiving system for work generated by:

- Store Deep Dive OCV
- Localization Engine publish flows
- AI Copilot actions
- alert/broadcast workflows
- manual operations management

## Screen: Communications (`MessageCenter`)

### Route

- `/command-center/communications`

### Primary Purpose

This is the collaboration and operational messaging layer.
It supports direct messages, groups, and broadcast-style conversation channels.

### Main UI Areas

- conversation list sidebar
- tab filters:
  - All
  - Direct
  - Groups
  - Broadcast
- conversation search
- chat pane
- new chat / group / broadcast modal
- message composer
- context chips on messages

### Primary Interactions

- **Filter chats** by type
- **Search conversations**
- **Open a thread** and clear unread count
- **Send a message**
  - enter to send
  - delivery state simulates progression
- **Create direct message**
- **Create group**
- **Create broadcast thread**

### Context-Chip Behavior

A standout feature here is contextual message chips that deep-link to product screens.
Messages can include action links into:

- District Intelligence
- Store Deep Dive
- Master POG Management
- POG Rule Management
- POG Localization Engine
- AI Copilot
- Operations Queue

This makes Communications a collaboration layer that is tightly connected to operational systems instead of acting as a standalone chat tool.

---

# 6E. Application Configuration

## Screen: User Access Management

### Route

- `/app-config/user-access`

### Primary Purpose

This is the admin-facing user administration console.
It manages users, roles, scope assignment, invite status, and effective screen access.

### Main UI Areas

- DI-styled header and stats strip
- user search toolbar
- user table with expandable rows
- create-user modal
- delete confirmation modal
- success toasts

### Primary Interactions

#### A. User directory exploration

- search by name, email, or role
- expand a user row to inspect more detail
- review scope and count of screens granted

#### B. Create-user wizard

The modal is a 3-step flow:

1. **Identity**
2. **Role & Scope**
3. **Screen Access**

Behavior includes:

- validation at each step
- duplicate email prevention
- scope assignment that changes by role
- optional screen-access customization
- invite creation with `invited` status

#### C. Delete user

- opens confirmation modal
- removes user from stored directory
- protects current logged-in user from deleting themself

### Cross-Module Role

This module controls who can see and navigate to the rest of the application.
It is the operational gatekeeper for module availability.

---

# 7. Cross-Module Interaction Map

## 7.1 District Intelligence → Store Deep Dive

This is the core district-to-store investigation path.

Triggers:

- leaderboard row click
- store identity click
- heatmap detail drill-down

Result:

- navigates to Store Deep Dive with selected store query params

## 7.2 District Intelligence / Store Deep Dive → AI Copilot

Used for deeper diagnosis.

Triggers:

- heatmap investigation button
- operational issue investigation action

Result:

- opens AI Copilot in a context-specific mode
- carries store/category/score context in query params

## 7.3 Store Deep Dive OCV → Operations Queue

Used to inspect action execution behind a broadcast.

Trigger:

- user clicks `View Operation Queue`

Result:

- queue opens with `broadcast` query param
- relevant broadcast tasks are highlighted

## 7.4 AI Copilot → POG Rule Management

Used when natural language should become a formal planogram rule.

Trigger:

- user creates a rule in AI Copilot `Actions` mode

Result:

- POG Rule Management can receive prebuilt rule information through URL params

## 7.5 POG Localization Engine → Operations Queue

Used when localized POGs are ready for operational rollout.

Trigger:

- user publishes a localization result

Result:

- execution tasks are generated into shared task state
- these tasks are then visible in Operations Queue

## 7.6 Communications → Operational Screens

Used for collaborative follow-through.

Trigger:

- user clicks a context chip inside a message

Result:

- deep-links into DI, Store Deep Dive, AI Copilot, POG modules, or Operations Queue

## 7.7 Alerts / Operational Issues → Operations Queue Prefill

Used when a multi-store issue should become actionable work immediately.

Trigger:

- navigation into Operations Queue with `prefillFromAlert` state

Result:

- one task per impacted store is auto-generated
- assignment is inferred from store manager context when available

---

# 8. Shared System Components and Their Purpose

## MainLayout

Purpose:

- frame all protected screens inside a consistent shell

Interactions:

- renders sidebar, header, breadcrumb, and page outlet

## SidebarNew

Purpose:

- expose module navigation
- hide inaccessible screens based on user role/access

Interactions:

- expand/collapse modules
- route to submodules
- reflect active page

## AppHeader

Purpose:

- present product identity, notifications, support, and user menu

Interactions:

- open notifications drawer
- open help/support external link
- open user dropdown
- logout

## Breadcrumb

Purpose:

- maintain context of where the user is inside the application

Interactions:

- click home crumb to return to Store Operations Home

## ToastContext

Purpose:

- show global feedback for successful, warning, or error events

## ExecutionTasksContext

Purpose:

- act as the shared execution layer across modules

It is the backbone for operational continuity.

---

# 9. Legacy / Non-Routed Screens Still Present in Code

These files exist in the repo but are not the current routed screens in `App.tsx`.
They are still worth documenting so no one confuses them with active product routes.

## Legacy Screen: `StoreDeepDive.tsx`

Purpose:

- older, alternate Store Deep Dive implementation with store metrics, SPI tiering, actions, diagnostics, and localized POG content

Status:

- present in codebase
- not used by the active route
- active routed Store Deep Dive is `StoreCenter.tsx`

## Legacy Screen: `StoreExecution.tsx`

Purpose:

- older execution/task screen that groups tasks by localization result and supports assignment/status updates

Status:

- present in codebase
- not used by `App.tsx`
- current active execution route is `TaskCenter.tsx`

## Legacy Screen: `Home.tsx`

Purpose:

- older blank home container with header

Status:

- present in codebase
- not part of the active user-facing route flow

## Dormant Public Screens: `SignUp.tsx` and `ForgotPassword.tsx`

Purpose:

- standard public auth flows

Status:

- components exist
- routes are commented out in `App.tsx`
- current live public entry point is only `Login`

---

# 10. Recommended Demo / Walkthrough Order

If you want to present the full product coherently, this is the best script order:

1. **Login**
   - show authentication and role entry point

2. **Store Operations Home / HQ Home**
   - show how the landing page changes by role
   - frame the daily decision context

3. **District Intelligence**
   - show district diagnosis, period selection, rankings, heatmaps, broadcast analytics

4. **Store Deep Dive**
   - show how district issues convert into store-level action and KPI interpretation

5. **Operations Queue**
   - show execution follow-through and how tasks are created from upstream systems

6. **AI Copilot**
   - show policy lookup, analytics Q&A, shelf audit, and task/rule generation

7. **Master POG Management**
   - show corporate planogram source of truth

8. **POG Rule Management**
   - show how rule logic is authored and maintained

9. **POG Localization Engine**
   - show how standards become localized, explainable variants and execution tasks

10. **Communications**
   - show collaboration and deep-link context chips

11. **User Access Management**
   - show admin control over role-based access

---

# 11. Executive Summary

At a system level, `StoreHub` works as a connected decision-and-execution platform:

- **Store Operations Hub** identifies issues and performance context
- **Planogram Intelligence** defines and localizes merchandising standards
- **Command Center** diagnoses, coordinates, and executes work
- **Application Configuration** governs who can do what

The most important operational loop in the current application is:

- detect a problem
- diagnose it at district/store level
- investigate it in AI Copilot if needed
- convert it into execution work
- track completion in Operations Queue
- collaborate through Communications

That loop is the core interaction model of the product.
