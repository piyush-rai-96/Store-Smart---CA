import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Brain,
  BarChart3,
  Image as ImageIcon,
  Zap,
  Send,
  Bot,
  User,
  FileText,
  ExternalLink,
  Upload,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  BookOpen,
  ClipboardList,
  X,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  Wrench,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import './AICopilot.css';

// ── Types ──
type SkillMode = 'knowledge' | 'analytics' | 'pog' | 'actions';

interface ComplianceAuditReport {
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  planogramName: string;
  storeInfo: string;
  auditDate: string;
  categories: {
    name: string;
    score: number;
    maxScore: number;
    status: 'pass' | 'warning' | 'fail';
    findings: string[];
  }[];
  deviations: {
    item: string;
    expected: string;
    actual: string;
    severity: 'critical' | 'warning' | 'info';
    impact: string;
  }[];
  recommendations: string[];
  comparisonImages: {
    expected: string;
    actual: string;
  };
}

interface OosItem {
  name: string;
  shelf: string;
  position: string;
}

interface ProcessingStep {
  step: string;
  status: 'pending' | 'active' | 'completed';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  skill: SkillMode;
  // Rich content
  sources?: { doc: string; section: string; page: string }[];
  kpiCards?: { label: string; value: string; delta: string; direction: 'up' | 'down' }[];
  chartData?: { type: 'bar' | 'line' | 'horizontal-bar'; title: string; labels: string[]; values: number[]; color?: string; secondaryValues?: number[]; secondaryLabel?: string }[];
  pogResults?: { status: 'pass' | 'fail'; item: string; detail: string }[];
  taskCreated?: { title: string; assignee: string; priority: string; due: string };
  isTyping?: boolean;
  imageUrl?: string;
  suggestedQueries?: string[];
  followUpQuestions?: string[];
  // ShelfIQ-style rich content
  complianceReport?: ComplianceAuditReport;
  oosItems?: OosItem[];
  oosImage?: string;
  processingSteps?: ProcessingStep[];
  isProcessing?: boolean;
  // POG planogram list
  pogPlanogramList?: { name: string; store: string; lastAudit: string; score: number; status: 'pass' | 'warning' | 'fail' }[];
}

// ── Shared Types ──

// ── Mock Knowledge Base ──
const knowledgeResponses: Record<string, { answer: string; sources: { doc: string; section: string; page: string }[]; followUpQuestions?: string[] }> = {
  'fire exit': {
    answer: '## 🔥 Fire Exit Blockage — Standard Operating Procedure\n\n**Classification:** Critical Safety Protocol · **SLA:** Immediate Response Required\n\n---\n\n### 1. Immediate Response (0–15 Minutes)\n\n| Step | Action | Owner |\n|------|--------|-------|\n| 1.1 | Identify and assess the blockage — determine if it can be safely removed by on-site personnel | Discovering Associate |\n| 1.2 | If removable, clear the obstruction immediately and restore full egress path width (minimum 44 inches per NFPA 101) | Floor Lead |\n| 1.3 | Log the incident in the **Safety Incident Tracker** with timestamp, location, blockage type, and photos | Discovering Associate |\n| 1.4 | Notify the Store Manager via radio and incident alert within **15 minutes** of discovery | Discovering Associate |\n\n### 2. Escalation Protocol (If Unresolvable On-Site)\n\n- **Escalate to Regional Safety Officer (RSO)** within 30 minutes if the blockage involves structural elements, locked fixtures, or requires equipment\n- RSO will initiate an **Emergency Evacuation Route Assessment** and may authorize temporary alternate egress\n- If the exit remains blocked beyond **1 hour**, the RSO must notify the **District Operations Director** and file a regulatory incident report\n\n### 3. Post-Incident Requirements\n\n- **Root Cause Analysis** — Store Manager must complete within 24 hours and submit via the Safety Portal\n- **Corrective Action Plan** — Must be documented and implemented within 48 hours\n- **Staff Re-briefing** — All associates on shift must be briefed on the incident and prevention measures\n\n### 4. Training & Prevention\n\n- All staff must complete **fire exit protocol training** during quarterly safety drills (Q1, Q2, Q3, Q4)\n- Monthly **walkthrough audits** must verify all emergency exits are clear, illuminated, and properly signposted\n- Exit route maps must be updated and posted within **72 hours** of any store layout change\n\n> ⚠️ **Compliance Note:** Failure to maintain clear fire exits is a **zero-tolerance violation** per OSHA 29 CFR 1910.37 and may result in regulatory penalties up to $15,625 per violation.',
    sources: [
      { doc: 'Store Operations SOP v4.2', section: 'Section 4.2 — Fire Safety Protocols', page: 'Pages 18–21' },
      { doc: 'Emergency Procedures Manual', section: 'Section 2.1 — Evacuation Routes', page: 'Pages 7–9' },
      { doc: 'OSHA Compliance Reference', section: '29 CFR 1910.37 — Means of Egress', page: 'Federal Register' },
    ],
    followUpQuestions: [
      'What are the OSHA penalties for blocked fire exits?',
      'How often should fire drills be conducted?',
      'What is the emergency evacuation route protocol?',
    ],
  },
  'planogram notice': {
    answer: '## 📋 Planogram Change Management — Notice Period & Implementation Protocol\n\n**Classification:** Visual Merchandising Compliance · **Effective:** All Store Formats\n\n---\n\n### 1. Notice Period & Acknowledgment\n\n| Milestone | Timeline | Responsible Party |\n|-----------|----------|-------------------|\n| Planogram change notice issued | **T-14 business days** before effective date | Category Manager / VM Team |\n| Store Manager acknowledgment required | Within **48 hours** of receipt | Store Manager |\n| Implementation materials & fixtures shipped | **T-7 business days** | Supply Chain |\n| Full implementation completed | Within **5 business days** of effective date | Store Team |\n| Post-implementation compliance photo uploaded | Within **24 hours** of completion | Department Lead |\n\n### 2. Change Classification & SLA Matrix\n\n- **Major Reset** (full aisle/department): 14 business days notice, dedicated reset crew required\n- **Minor Adjustment** (shelf/facing changes): 7 business days notice, in-store team execution\n- **Emergency Change** (recall/safety): Immediate execution, no notice period, override authorization from Regional VP\n\n### 3. Deviation Management\n\nAny deviation from the authorized planogram requires:\n1. **Written justification** submitted via the Planogram Exception Portal\n2. **Category Manager approval** — must be obtained before the deviation is implemented\n3. **Time-bound exception** — maximum 30 days, after which the standard planogram must be restored\n4. **Performance tracking** — deviated sections must be monitored for sales impact weekly\n\n### 4. Compliance Verification\n\n- **AI Vision Audit** — automated compliance check within 48 hours of implementation deadline\n- **Score Threshold** — minimum **85% planogram compliance** required to pass\n- **Non-compliance escalation** — scores below 70% auto-escalate to District Manager with 48-hour remediation SLA\n\n> 📌 **Key Policy:** Unauthorized planogram deviations are tracked as compliance violations and impact the store\'s DPI (District Performance Index) score.',
    sources: [
      { doc: 'Planogram Compliance SOP v3.1', section: 'Section 3.1 — Change Management', page: 'Pages 12–16' },
      { doc: 'Visual Merchandising Standards', section: 'Section 1.4 — Implementation Timelines', page: 'Pages 5–8' },
      { doc: 'Category Management Guidelines', section: 'Section 2.3 — Exception Handling', page: 'Page 22' },
    ],
    followUpQuestions: [
      'What happens if planogram compliance falls below 70%?',
      'How do I submit a planogram deviation request?',
      'What is the AI Vision Audit compliance check process?',
    ],
  },
  'product recall': {
    answer: '## ⚠️ Product Recall Execution — Step-by-Step Protocol\n\n**Classification:** Critical Compliance Action · **SLA:** Complete within 24 Hours of Notification\n\n---\n\n### Phase 1 — Immediate Containment (0–2 Hours)\n\n| Step | Action | Timeline | Owner |\n|------|--------|----------|-------|\n| 1.1 | **Stop Sale** — Disable affected SKUs at POS immediately upon recall notification | 0–15 min | Store Manager |\n| 1.2 | **Shelf Pull** — Remove all affected products from sales floor (all locations including endcaps, clip strips, impulse zones) | 0–30 min | Department Lead |\n| 1.3 | **Backroom Sweep** — Locate and pull all affected inventory from backroom, receiving area, and returns staging | 0–45 min | Inventory Associate |\n| 1.4 | **Quarantine** — Move all pulled units to the designated Recall Holding Area with recall tag and chain-of-custody log | 0–1 hr | Department Lead |\n| 1.5 | **Notification** — Alert District Manager via escalation hotline; confirm store-level containment status | Within 1 hr | Store Manager |\n\n### Phase 2 — Documentation & Reporting (2–8 Hours)\n\n| Step | Action | Timeline | Owner |\n|------|--------|----------|-------|\n| 2.1 | Log all affected SKUs with **batch numbers, quantities, and shelf locations** in the Recall Tracker system | 2 hr | Inventory Associate |\n| 2.2 | Upload photographic evidence of cleared shelf locations and quarantined inventory | 4 hr | Department Lead |\n| 2.3 | Place official **recall signage** at each former shelf location with customer information and return instructions | 4 hr | Floor Lead |\n| 2.4 | Notify Customer Service desk — enable **full refund processing** for affected items (no receipt required) | 2 hr | Store Manager |\n\n### Phase 3 — Verification & Closure (8–24 Hours)\n\n| Step | Action | Timeline | Owner |\n|------|--------|----------|-------|\n| 3.1 | Complete the **Recall Verification Checklist** — all 12 items must be marked complete | 24 hr | Store Manager |\n| 3.2 | Submit final recall report to **Regional Compliance Office** via the Safety Portal | 24 hr | Store Manager |\n| 3.3 | Coordinate with **Supply Chain** for return shipment or destruction of quarantined units | 48 hr | District Manager |\n| 3.4 | Conduct staff debrief on recall execution and document lessons learned | 72 hr | Store Manager |\n\n### Customer Communication Script\n\n> *"We have voluntarily recalled [Product Name] as a precautionary measure. If you purchased this item, please return it to any store location for a full refund. We apologize for any inconvenience and appreciate your understanding."*\n\n> 🔴 **Regulatory Note:** Product recall non-compliance may result in FDA/CPSC enforcement action. All recall actions are auditable and must maintain a complete chain-of-custody record.',
    sources: [
      { doc: 'Product Safety & Recall SOP v6.1', section: 'Section 6.1 — Recall Execution Protocol', page: 'Pages 31–38' },
      { doc: 'Quality Assurance Manual', section: 'Section 8.3 — Product Withdrawal Procedures', page: 'Pages 44–47' },
      { doc: 'Customer Service Standards', section: 'Section 5.2 — Recall & Return Handling', page: 'Page 19' },
      { doc: 'FDA Recall Guidance', section: 'Industry Guidance — Voluntary Recalls', page: 'Regulatory Reference' },
    ],
    followUpQuestions: [
      'What is the customer communication protocol during a recall?',
      'How do I handle a Class I vs Class II recall differently?',
      'What are the documentation requirements for FDA audit trail?',
    ],
  },
  'safety audit': {
    answer: '## 🛡️ Safety Audit Program — Comprehensive Guidelines\n\n**Classification:** Regulatory Compliance · **Frequency:** Weekly · **Owner:** Designated Safety Champion\n\n---\n\n### 1. Audit Schedule & Governance\n\n| Parameter | Requirement |\n|-----------|-------------|\n| **Frequency** | Weekly — must be completed between Monday 6:00 AM and Wednesday 11:59 PM |\n| **Auditor** | Designated Safety Champion (certified via Safety Champion Training Program) |\n| **Duration** | 60–90 minutes for standard format stores; 90–120 minutes for large format |\n| **Tool** | Digital Safety Audit Checklist via the Store Operations Mobile App |\n| **Submission Deadline** | Within 4 hours of audit completion |\n\n### 2. Audit Categories & Scoring Weights\n\n| Category | Weight | Key Inspection Points |\n|----------|--------|----------------------|\n| 🔥 **Fire Safety** | 20% | Exit clearance, extinguisher access/expiry, suppression systems, signage illumination |\n| ⚡ **Electrical Safety** | 15% | Exposed wiring, overloaded outlets, equipment grounding, panel access clearance |\n| 🦺 **Slip/Trip/Fall Hazards** | 15% | Floor condition, wet floor signs, cable management, mat placement, lighting levels |\n| 🧪 **Chemical Storage** | 15% | SDS availability, proper labeling, ventilation, secondary containment, PPE access |\n| 🧯 **Emergency Equipment** | 10% | First aid kits stocked, AED functional, eyewash stations operational, spill kits available |\n| 🥽 **PPE Compliance** | 10% | Correct PPE worn for task, PPE condition/replacement schedule, training verification |\n| 🧹 **General Housekeeping** | 15% | Aisle clearance, storage organization, waste management, restroom standards |\n\n### 3. Scoring & Pass/Fail Criteria\n\n| Score Range | Rating | Required Action |\n|-------------|--------|-----------------|\n| **90–100%** | ✅ Excellent | No action — share best practices with district |\n| **85–89%** | ✅ Pass | Minor findings — correct within 7 days |\n| **70–84%** | ⚠️ Conditional | Corrective Action Plan required within **48 hours** — re-audit in 7 days |\n| **Below 70%** | 🔴 Fail | **Immediate escalation** to District Manager — corrective action within **24 hours** — mandatory re-audit within 72 hours |\n\n### 4. Escalation Matrix\n\n- **Score 70–84%** → Store Manager owns CAP, District Manager notified\n- **Score 50–69%** → District Manager leads intervention, Regional Safety Officer notified\n- **Score below 50%** → Regional Safety Officer takes ownership, VP Operations notified, store may face **operational restrictions**\n- **3 consecutive failures** → Triggers **Safety Improvement Program** — 90-day intensive monitoring\n\n> 📊 **Performance Tracking:** Safety audit scores feed directly into the store\'s DPI composite and are weighted at 15% of the overall execution score.',
    sources: [
      { doc: 'Health & Safety Compliance Guide v5.2', section: 'Section 5.2 — Audit Schedule & Scoring', page: 'Pages 22–28' },
      { doc: 'Safety Champion Certification Manual', section: 'Section 1.1 — Roles & Responsibilities', page: 'Pages 3–5' },
      { doc: 'Escalation Framework', section: 'Section 3.4 — Safety Incidents', page: 'Page 14' },
    ],
    followUpQuestions: [
      'What happens if a store misses two consecutive weekly audits?',
      'How is the safety audit score calculated by category?',
      'What are the Safety Champion certification requirements?',
    ],
  },
  'store opening': {
    answer: '## 🏪 Store Opening Procedures — Daily Operations Protocol\n\n**Classification:** Standard Operating Procedure · **SLA:** Complete 30 Minutes Before Scheduled Open\n\n---\n\n### Pre-Opening Sequence (T-30 to T-0 Minutes)\n\n| Step | Time | Action | Owner | Verification |\n|------|------|--------|-------|--------------|\n| 1 | T-30 | **Arrival & Entry** — Arrive at store, disarm security system using authorized credentials, log entry time in the Workforce Management system | Opening Manager | Time-stamped entry log |\n| 2 | T-28 | **Security Walkthrough** — Complete perimeter check: verify no signs of forced entry, check all emergency exits are secure, review overnight security footage flags | Opening Manager | Security checklist |\n| 3 | T-25 | **Environment Check** — Verify HVAC is operational (target: 68–72°F), all lighting zones are functional, music system is active at correct volume level | Opening Manager | Environment checklist |\n| 4 | T-20 | **Floor Readiness** — Walk all aisles: check cleanliness standards, verify overnight stocking is complete, ensure no safety hazards (spills, boxes, loose fixtures) | Floor Lead | Morning walkthrough form |\n| 5 | T-15 | **POS & Systems** — Power on all POS terminals, verify network connectivity, confirm payment processing is active (test transaction), check self-checkout units | Cash Office Lead | System readiness report |\n| 6 | T-12 | **Cash Management** — Count and verify all cash drawer floats against closing report, load registers, prepare change fund | Cash Office Lead | Float verification form |\n| 7 | T-10 | **Receiving & Inventory** — Review overnight delivery receipts, prioritize stocking of high-velocity and promotional items, update inventory exceptions | Inventory Lead | Delivery reconciliation |\n| 8 | T-5 | **Team Briefing** — Conduct daily huddle: share sales targets, active promotions, staffing updates, safety reminders, and any operational alerts or broadcasts | Opening Manager | Huddle completion log |\n| 9 | T-0 | **Doors Open** — Unlock all customer entrances at the scheduled opening time, greet early customers, ensure all departments are staffed and ready | Opening Manager | Opening confirmation |\n\n### Critical Compliance Requirements\n\n- **Minimum staffing** must meet the published labor model before doors open — no exceptions\n- **Food safety** (if applicable): verify cold chain temperatures logged and within range before opening fresh departments\n- **Promotional signage** must be verified against the current promotional calendar — no expired offers displayed\n- **Opening Manager** must confirm readiness via the **Store Ops App** before unlocking doors\n\n### Contingency Protocols\n\n| Scenario | Action |\n|----------|--------|\n| POS system failure | Switch to backup registers; if total failure, delay opening and escalate to IT Helpdesk (SLA: 30 min response) |\n| Insufficient staff | Contact on-call associates; escalate to District Manager if below minimum threshold |\n| Security concern | Do not enter store — contact Security Operations Center and local authorities |\n| Utility outage | Assess safety; if lighting/HVAC non-functional, delay opening and notify District Manager |\n\n> 📌 **Accountability:** The Opening Manager is fully responsible for store readiness. Opening procedure compliance is audited monthly and contributes to the store\'s operational excellence score.',
    sources: [
      { doc: 'Daily Operations Manual v2.4', section: 'Section 1.1 — Opening Procedures', page: 'Pages 3–8' },
      { doc: 'Cash Handling & Reconciliation SOP', section: 'Section 2.1 — Float Procedures', page: 'Page 11' },
      { doc: 'Workforce Management Guidelines', section: 'Section 4.3 — Minimum Staffing Standards', page: 'Page 27' },
    ],
    followUpQuestions: [
      'What is the store closing procedure?',
      'What are the minimum staffing requirements for opening?',
      'How should the daily team huddle be structured?',
    ],
  },
  'miss': {
    answer: '## 🚫 Missed Consecutive Audits — Escalation & Remediation Protocol\n\n**Classification:** Compliance Escalation · **Trigger:** 2+ Consecutive Weekly Audit Misses\n\n---\n\n### 1. Escalation Framework\n\nMissing weekly audits triggers a progressive escalation process. The severity increases with each consecutive miss:\n\n| Consecutive Misses | Escalation Level | Notification | Required Action | Timeline |\n|--------------------|-----------------|--------------|-----------------|----------|\n| **1 miss** | ⚠️ Level 1 — Warning | Store Manager auto-notified via Operations App | Complete overdue audit within **24 hours** + submit written explanation | 24 hours |\n| **2 consecutive** | 🔴 Level 2 — Formal Escalation | District Manager notified · Store flagged in Compliance Dashboard | District Manager must conduct **on-site review** within 48 hours · Corrective Action Plan (CAP) required | 48 hours |\n| **3 consecutive** | 🔴 Level 3 — Critical | Regional Operations Director notified · Store placed on **Compliance Watch List** | Mandatory **Performance Improvement Plan (PIP)** · Bi-weekly executive reviews initiated · Safety Champion role reassigned | Immediate |\n| **4+ consecutive** | 🚨 Level 4 — Executive | VP Operations notified · Regulatory risk assessment triggered | Store may face **operational restrictions** · External audit commissioned · Store Manager placed on formal performance review | Immediate |\n\n### 2. Immediate Consequences (After 2nd Miss)\n\n| Consequence | Detail |\n|-------------|--------|\n| **DPI Impact** | Store DPI receives automatic **-10 point penalty** per missed audit — reflected in weekly district rankings |\n| **Compliance Flag** | Store appears in **red status** on the Regional Compliance Dashboard until 3 consecutive passing audits are completed |\n| **Insurance Implication** | Insurer is notified of audit gap — may trigger **premium review** or coverage conditions |\n| **Regulatory Exposure** | Missed safety audits create a documentation gap that could result in **OSHA penalties** ($15,625+ per violation) during any external inspection |\n\n### 3. Corrective Action Plan (CAP) Requirements\n\nThe District Manager must submit a CAP within 48 hours covering:\n\n| CAP Element | Requirement |\n|-------------|-------------|\n| **Root Cause Analysis** | Why were audits missed? (staffing, training, negligence, system issues) |\n| **Immediate Remediation** | Complete all overdue audits within 24 hours of CAP submission |\n| **Accountability** | Identify responsible individuals and corrective measures (retraining, reassignment, formal warning) |\n| **Prevention Plan** | Systemic changes to prevent recurrence (backup auditors, calendar alerts, manager oversight) |\n| **Monitoring Schedule** | Weekly check-ins with District Manager for minimum 30 days |\n\n### 4. Recovery Path\n\n| Milestone | Requirement | DPI Recovery |\n|-----------|-------------|-------------|\n| Complete overdue audits | All missed audits backdated and submitted with explanations | No recovery yet |\n| 2 consecutive on-time audits | Both scoring ≥ 70% | -5 point penalty restored |\n| 4 consecutive on-time audits | All scoring ≥ 85% | Full penalty restored · Compliance Watch removed |\n| 8 consecutive on-time audits | Sustained compliance | Store eligible for **Good Standing** certification |\n\n> ⚠️ **Critical Note:** There is **zero tolerance** for falsified or backdated audits. Any attempt to fabricate audit data is a **terminable offense** and may trigger regulatory reporting obligations.',
    sources: [
      { doc: 'Health & Safety Compliance Guide v5.2', section: 'Section 5.4 — Missed Audit Escalation', page: 'Pages 30–34' },
      { doc: 'Escalation Framework', section: 'Section 3.2 — Compliance Escalation Matrix', page: 'Pages 10–12' },
      { doc: 'Store Performance Management Policy', section: 'Section 7.1 — Corrective Action Plans', page: 'Pages 41–44' },
      { doc: 'OSHA Compliance Reference', section: '29 CFR 1903 — Inspections & Citations', page: 'Federal Register' },
    ],
    followUpQuestions: [
      'How do safety audits work and what is the scoring?',
      'What is the DPI penalty for missed audits?',
      'How do I create a Corrective Action Plan for audit gaps?',
    ],
  },
};

// ── Mock Analytics Responses ──
type AnalyticsChart = { type: 'bar' | 'line' | 'horizontal-bar'; title: string; labels: string[]; values: number[]; color?: string; secondaryValues?: number[]; secondaryLabel?: string };
const analyticsResponses: Record<string, { answer: string; kpiCards: { label: string; value: string; delta: string; direction: 'up' | 'down' }[]; chartData?: AnalyticsChart[]; followUpQuestions?: string[] }> = {
  'sales down': {
    answer: '## 📉 District Sales Performance — Weekly Decline Analysis\n\n**Report Period:** Current Week vs Prior Week · **Scope:** All 8 District Stores\n\n---\n\n### Executive Summary\n\nDistrict-wide sales declined **-3.2%** this week ($1.26M vs $1.30M prior week), driven primarily by underperformance at 3 stores. The decline is attributable to reduced weekend foot traffic, lower conversion rates, and smaller basket sizes.\n\n### Root Cause Breakdown\n\n| Factor | Impact | Affected Stores | Detail |\n|--------|--------|-----------------|--------|\n| Weekend Foot Traffic | **-12%** | All stores | Local events competition diverted weekend shoppers |\n| Conversion Rate | **-2.8pp** (34% → 31.2%) | Harbor View, Oak Street | Insufficient floor coverage during peak hours |\n| Average Basket Size | **-8%** ($41.70 → $38.40) | District-wide | Fewer promotional items in baskets — end-of-promo cycle effect |\n| Product Availability | **-4.2%** | Pine Grove, Maple Heights | OOS on 12 high-velocity SKUs across health & beauty |\n\n### Store-Level Performance\n\n| Store | Sales | vs Plan | vs LW | Status |\n|-------|-------|---------|-------|--------|\n| Downtown Plaza #2034 | $218K | +8.2% | +2.1% | ✅ On Track |\n| Riverside Mall #1876 | $195K | +5.4% | +1.8% | ✅ On Track |\n| Central Station #3421 | $172K | +2.1% | -0.4% | ✅ On Track |\n| Westfield Center #2198 | $164K | -1.2% | -3.1% | ⚠️ Watch |\n| Harbor View #4532 | $148K | -4.8% | -6.2% | 🔴 Below |\n| Oak Street #1234 | $132K | -6.8% | -8.4% | 🔴 Below |\n| Pine Grove #5678 | $118K | -9.2% | -11.1% | 🔴 Critical |\n| Maple Heights #9012 | $113K | -12.4% | -14.2% | 🔴 Critical |\n\n### Recommended Actions\n\n| Priority | Action | Owner | Timeline |\n|----------|--------|-------|----------|\n| 🔴 High | Deploy weekend promotional blitz — targeted offers at Harbor View & Oak Street | Marketing Manager | This weekend |\n| 🔴 High | Add 2 floor associates during Sat/Sun peak hours (11am–4pm) at underperforming stores | District Manager | This weekend |\n| ⚠️ Medium | Replenish 12 OOS high-velocity SKUs at Pine Grove & Maple Heights | Supply Chain | Within 48 hours |\n| ⚠️ Medium | Review end-of-promo transition plan — ensure new promotions launch by Wednesday | Category Manager | This week |\n\n> 📊 **Forecast:** If corrective actions are implemented, projected recovery of +1.5–2.0% by next week. Without intervention, the decline trend is expected to continue at -1.5% per week.',
    kpiCards: [
      { label: 'District Sales', value: '$1.26M', delta: '-3.2%', direction: 'down' },
      { label: 'Foot Traffic', value: '42.1K', delta: '-12%', direction: 'down' },
      { label: 'Conversion', value: '31.2%', delta: '-2.8pp', direction: 'down' },
      { label: 'Avg Basket', value: '$38.40', delta: '-8%', direction: 'down' },
    ],
    chartData: [
      { type: 'bar', title: 'Sales by Store ($K)', labels: ['Plaza', 'Riverside', 'Central', 'Westfield', 'Harbor', 'Oak St', 'Pine Gr', 'Maple'], values: [218, 195, 172, 164, 148, 132, 118, 113], color: '#6366f1' },
      { type: 'line', title: 'Weekly Sales Trend ($K)', labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'], values: [1280, 1310, 1295, 1340, 1320, 1300, 1280, 1260], color: '#ef4444' },
    ],
    followUpQuestions: [
      'Which stores are underperforming vs target this week?',
      'What is the gross margin % trend over the last 13 weeks?',
      'Show me the weekend foot traffic breakdown by store',
    ],
  },
  'underperforming': {
    answer: '## 🔴 Underperforming Stores — Intervention Report\n\n**Report Period:** Current Period · **Classification:** Escalation Required · **Stores Flagged:** 3 of 8\n\n---\n\n### Executive Summary\n\nThree stores are currently operating significantly below target thresholds. Combined, these stores represent a **$94K sales gap** vs plan and have declining DPI scores. All three have been escalated to the Escalation Command Center for intensive monitoring.\n\n### Store Performance Dashboard\n\n| Store | DPI | Sales vs Plan | Key Issue | Weeks Below Target | Escalation Level |\n|-------|-----|---------------|-----------|--------------------|-----------------|\n| Maple Heights #9012 | **58** 🔴 | -12.4% | Safety & Cleanliness critical — 4 audit categories below 40% | 6 weeks | **Level 3** — Regional VP notified |\n| Pine Grove #5678 | **65** 🔴 | -9.2% | Safety audit failed 3 consecutive weeks. Staff turnover at 34% | 4 weeks | **Level 2** — DM intervention |\n| Oak Street #1234 | **72** ⚠️ | -6.8% | Planogram compliance below 60%. Peak-hour understaffing | 3 weeks | **Level 2** — DM intervention |\n\n### Detailed Breakdown — Maple Heights #9012 (Most Critical)\n\n| Audit Category | Score | Target | Gap | Trend |\n|----------------|-------|--------|-----|-------|\n| Safety | 32% | 85% | -53pp | 📉 Declining 4 weeks |\n| Cleanliness | 38% | 85% | -47pp | 📉 Declining 3 weeks |\n| Product Availability | 41% | 90% | -49pp | ➡️ Flat |\n| Planogram Compliance | 44% | 85% | -41pp | 📉 Declining 2 weeks |\n| Customer Experience | 52% | 80% | -28pp | 📉 Declining 2 weeks |\n| Staff Execution | 61% | 80% | -19pp | ➡️ Flat |\n\n### Intervention Plan\n\n| Store | Action | Owner | Start Date | Review Date |\n|-------|--------|-------|------------|------------|\n| Maple Heights | Deploy safety task force — 3-day intensive remediation | Regional Safety Officer | Immediate | +72 hours |\n| Maple Heights | Emergency cleaning crew — daily deep clean for 2 weeks | Facilities Manager | Immediate | +14 days |\n| Pine Grove | Replace Safety Champion — retrain team on safety protocols | District Manager | This week | +7 days |\n| Pine Grove | Launch retention program — address 34% turnover | HR Business Partner | This week | +30 days |\n| Oak Street | Schedule planogram reset crew — full compliance reset | VM Team Lead | Within 48 hours | +5 days |\n| Oak Street | Adjust peak-hour staffing model — add 3 FTEs | Workforce Planning | This week | +7 days |\n\n> ⚠️ **Escalation Note:** Maple Heights has been in decline for 6 consecutive weeks. If DPI does not improve above 65 within 14 days, the store will be placed on the **Performance Improvement Program (PIP)** with bi-weekly executive reviews.',
    kpiCards: [
      { label: 'At-Risk Stores', value: '3', delta: '+1', direction: 'down' },
      { label: 'Avg DPI (Bottom 3)', value: '65', delta: '-8.4', direction: 'down' },
      { label: 'Sales Gap', value: '-$94K', delta: 'vs plan', direction: 'down' },
      { label: 'Escalations', value: '3', delta: 'active', direction: 'down' },
    ],
    chartData: [
      { type: 'horizontal-bar', title: 'DPI Score by Store', labels: ['Plaza #2034', 'Riverside #1876', 'Central #3421', 'Westfield #2198', 'Harbor #4532', 'Oak St #1234', 'Pine Gr #5678', 'Maple #9012'], values: [94, 91, 85, 79, 76, 72, 65, 58], color: '#6366f1' },
      { type: 'line', title: 'Bottom 3 — DPI Trend (8 Weeks)', labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'], values: [78, 76, 74, 72, 70, 68, 66, 65], color: '#ef4444', secondaryValues: [85, 85, 85, 85, 85, 85, 85, 85], secondaryLabel: 'Target' },
    ],
    followUpQuestions: [
      'Show total sales in the last 4 weeks for Maple Heights',
      'What are the VoC trends for underperforming stores?',
      'Which SKUs are likely to go out of stock at Pine Grove?',
    ],
  },
  'best performing': {
    answer: '## 🏆 Top Performing Stores — Excellence Report\n\n**Report Period:** Current Period · **Classification:** Best-in-Class · **Stores Recognized:** 3 of 8\n\n---\n\n### Executive Summary\n\nThree stores are significantly outperforming district targets, contributing a combined **+$132K sales surplus** vs plan. These stores demonstrate consistent execution excellence and provide best-practice models for the district.\n\n### Performance Leaders\n\n| Rank | Store | DPI | Sales vs Plan | VoC Score | Key Strength |\n|------|-------|-----|---------------|-----------|-------------|\n| 🥇 | Downtown Plaza #2034 | **94** | +8.2% (+$218K) | 92% | Perfect cleanliness scores · 98% planogram compliance |\n| 🥈 | Riverside Mall #1876 | **91** | +5.4% (+$195K) | 89% | Best product availability · Highest weekend conversion |\n| 🥉 | Central Station #3421 | **85** | +2.1% (+$172K) | 84% | Most consistent execution · No audit failures in 12 weeks |\n\n### Success Factor Analysis\n\n| Factor | Plaza #2034 | Riverside #1876 | Central #3421 | District Avg |\n|--------|-------------|-----------------|---------------|--------------|\n| Planogram Compliance | 98% | 94% | 91% | 78% |\n| Safety Audit Score | 96% | 93% | 90% | 82% |\n| Staff Availability | 99% | 97% | 95% | 88% |\n| OOS Rate | 1.2% | 1.8% | 2.4% | 4.8% |\n| Customer Wait Time | 2.1 min | 2.4 min | 2.8 min | 3.6 min |\n| Weekend Conversion | 41% | 38% | 35% | 31% |\n\n### Best Practices to Scale\n\n| Practice | Origin Store | Impact | Scalability |\n|----------|-------------|--------|-------------|\n| **Pre-shift planogram walkthrough** — 10-min compliance check before store open | Plaza #2034 | +12pp compliance | High — zero cost |\n| **Weekend warrior staffing** — dedicated weekend team with incentive bonus | Riverside #1876 | +7pp weekend conversion | Medium — requires budget |\n| **Real-time OOS alerts** — 30-min replenishment SLA on flagged items | Plaza #2034 | -3.6pp OOS rate | High — process change only |\n| **Daily safety micro-audits** — 5-min focused check per zone, rotating daily | Central #3421 | +8pp safety score | High — zero cost |\n\n> 🌟 **Recognition:** Downtown Plaza #2034 has maintained DPI above 90 for **12 consecutive weeks** — qualifying for the **District Excellence Award**. Recommend formal recognition at the next regional meeting.',
    kpiCards: [
      { label: 'Excellence Stores', value: '3', delta: 'stable', direction: 'up' },
      { label: 'Avg DPI (Top 3)', value: '90', delta: '+2.1', direction: 'up' },
      { label: 'Sales Surplus', value: '+$132K', delta: 'vs plan', direction: 'up' },
      { label: 'Avg VoC', value: '88.7%', delta: '+3.2pp', direction: 'up' },
    ],
    chartData: [
      { type: 'bar', title: 'DPI Scores — All Stores', labels: ['Plaza', 'Riverside', 'Central', 'Westfield', 'Harbor', 'Oak St', 'Pine Gr', 'Maple'], values: [94, 91, 85, 79, 76, 72, 65, 58], color: '#10b981' },
      { type: 'bar', title: 'Sales vs Plan (%)', labels: ['Plaza', 'Riverside', 'Central', 'Westfield', 'Harbor', 'Oak St', 'Pine Gr', 'Maple'], values: [108, 105, 102, 99, 95, 93, 91, 88], color: '#6366f1' },
    ],
    followUpQuestions: [
      'What is the gross margin % trend for Downtown Plaza?',
      'Show total sales in the last 4 weeks for top 3 stores',
      'What best practices can be scaled from Plaza to other stores?',
    ],
  },
  'voc trend': {
    answer: '## 💬 Voice of Customer (VoC) — Trend Analysis Report\n\n**Report Period:** Last 4 Weeks · **Data Source:** Customer Feedback Platform · **Total Responses:** 2,847\n\n---\n\n### Executive Summary\n\nOverall customer satisfaction has declined from **82% → 79%** over the past 4 weeks, a **-3 percentage point** drop. The primary driver is a surge in "messy aisles" complaints (+28%), concentrated in Pine Grove and Maple Heights. Checkout speed continues to improve as a bright spot.\n\n### Satisfaction Trend (4-Week View)\n\n| Week | Score | Change | Volume | Key Theme |\n|------|-------|--------|--------|-----------|\n| Week 1 | 82% | — | 684 responses | Baseline period |\n| Week 2 | 81% | -1pp | 712 responses | Early cleanliness complaints emerging |\n| Week 3 | 80% | -1pp | 738 responses | "Messy aisles" becomes top theme |\n| Week 4 (Current) | 79% | -1pp | 713 responses | Decline continues — intervention needed |\n\n### Theme Analysis — Top Issues\n\n| Rank | Theme | Mentions | Trend | Affected Stores | Severity |\n|------|-------|----------|-------|-----------------|----------|\n| 1 | 🧹 **Messy Aisles** | 134 | 📈 +28% | Pine Grove, Maple Heights, Oak Street | 🔴 Critical |\n| 2 | 📦 **Product Availability** | 76 | 📈 +15% | Pine Grove, Maple Heights | ⚠️ High |\n| 3 | ⏱️ **Wait Times** | 42 | 📉 -18% | Improving district-wide | ✅ Improving |\n| 4 | 👤 **Staff Helpfulness** | 38 | ➡️ Flat | Harbor View | ⚠️ Monitor |\n| 5 | 💲 **Pricing Concerns** | 29 | ➡️ Flat | District-wide | ℹ️ Low |\n\n### Store-Level VoC Breakdown\n\n| Store | VoC Score | vs LW | Top Complaint | Positive Feedback |\n|-------|-----------|-------|---------------|-------------------|\n| Downtown Plaza #2034 | 92% | +1pp | None significant | "Always clean and organized" |\n| Riverside Mall #1876 | 89% | +0pp | Minor wait times | "Great product selection" |\n| Central Station #3421 | 84% | -1pp | Product availability | "Friendly staff" |\n| Westfield Center #2198 | 80% | -2pp | Messy aisles | Checkout speed |\n| Harbor View #4532 | 76% | -1pp | Staff helpfulness | Product quality |\n| Oak Street #1234 | 72% | -3pp | Messy aisles | Pricing |\n| Pine Grove #5678 | 65% | -4pp | Messy aisles + OOS | None this period |\n| Maple Heights #9012 | 58% | -5pp | All categories declining | None this period |\n\n### Recommended Actions\n\n| Priority | Action | Target Stores | Owner | Impact Estimate |\n|----------|--------|---------------|-------|-----------------|\n| 🔴 Immediate | Deploy targeted cleaning protocol — hourly aisle walks during peak | Pine Grove, Maple Heights | Store Managers | +4–6pp VoC |\n| 🔴 Immediate | Increase stock-check frequency — every 2 hours on high-velocity SKUs | Pine Grove, Maple Heights | Inventory Leads | +2–3pp VoC |\n| ⚠️ This Week | Share Downtown Plaza cleaning SOP as best practice to all stores | District-wide | District Manager | +1–2pp VoC |\n| ⚠️ This Week | Customer recovery outreach — contact top 20 negative reviewers | Oak Street, Harbor View | CX Manager | Retention |\n\n> 📈 **Positive Signal:** Checkout speed improvements are driven by the new self-checkout rollout at 5 stores. Recommend accelerating rollout to remaining 3 stores to build on this momentum.',
    kpiCards: [
      { label: 'VoC Score', value: '79%', delta: '-3pp', direction: 'down' },
      { label: 'Top Issue', value: 'Cleanliness', delta: '+28%', direction: 'down' },
      { label: 'Positive Theme', value: 'Checkout', delta: 'improving', direction: 'up' },
      { label: 'Response Rate', value: '67%', delta: '+5%', direction: 'up' },
    ],
    chartData: [
      { type: 'line', title: 'VoC Score Trend (4 Weeks)', labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], values: [82, 81, 80, 79], color: '#f59e0b', secondaryValues: [85, 85, 85, 85], secondaryLabel: 'Target' },
      { type: 'horizontal-bar', title: 'VoC by Store', labels: ['Plaza', 'Riverside', 'Central', 'Westfield', 'Harbor', 'Oak St', 'Pine Gr', 'Maple'], values: [92, 89, 84, 80, 76, 72, 65, 58], color: '#6366f1' },
    ],
    followUpQuestions: [
      'Which stores are driving the cleanliness complaints?',
      'Show me the VoC breakdown for Pine Grove specifically',
      'What are the product availability issues at Maple Heights?',
    ],
  },
  'total sales': {
    answer: '## 💰 Store Sales Report — 4-Week Rolling Analysis\n\n**Report Period:** Last 4 Weeks (W1–W4) · **Store:** Downtown Plaza #2034 · **District:** 14\n\n---\n\n### Executive Summary\n\nDowntown Plaza #2034 generated **$872K** in total sales over the last 4 weeks, performing **+8.2% above plan** ($806K target). The store ranks **#1 in the district** and has exceeded target in all 4 weeks. Growth is driven by strong weekend conversion and effective promotional execution.\n\n### Weekly Sales Breakdown\n\n| Week | Sales | vs Plan | vs LY | Transactions | Avg Basket | Conversion |\n|------|-------|---------|-------|-------------|------------|------------|\n| Week 1 | $208K | +6.1% | +4.2% | 5,420 | $38.40 | 38% |\n| Week 2 | $215K | +7.8% | +5.1% | 5,580 | $38.50 | 39% |\n| Week 3 | $221K | +9.4% | +6.8% | 5,710 | $38.70 | 40% |\n| Week 4 | $228K | +9.6% | +7.2% | 5,860 | $38.90 | 41% |\n| **Total** | **$872K** | **+8.2%** | **+5.8%** | **22,570** | **$38.63** | **39.5%** |\n\n### Sales by Department\n\n| Department | 4-Week Sales | % of Total | vs Plan | Trend |\n|-----------|-------------|-----------|---------|-------|\n| Grocery & Staples | $314K | 36.0% | +5.2% | 📈 Growing |\n| Fresh & Produce | $183K | 21.0% | +12.4% | 📈 Strong |\n| Health & Beauty | $131K | 15.0% | +9.8% | 📈 Growing |\n| Household & Cleaning | $96K | 11.0% | +4.1% | ➡️ Stable |\n| Beverages | $79K | 9.1% | +7.3% | 📈 Growing |\n| Other | $69K | 7.9% | +3.6% | ➡️ Stable |\n\n### District Comparison (4-Week Total)\n\n| Rank | Store | 4-Week Sales | vs Plan | vs LY |\n|------|-------|-------------|---------|-------|\n| 🥇 | Downtown Plaza #2034 | $872K | +8.2% | +5.8% |\n| 🥈 | Riverside Mall #1876 | $784K | +5.4% | +3.9% |\n| 🥉 | Central Station #3421 | $692K | +2.1% | +1.4% |\n| 4 | Westfield Center #2198 | $648K | -1.2% | -0.8% |\n| 5 | Harbor View #4532 | $596K | -4.8% | -3.2% |\n| 6 | Oak Street #1234 | $532K | -6.8% | -5.1% |\n| 7 | Pine Grove #5678 | $476K | -9.2% | -7.8% |\n| 8 | Maple Heights #9012 | $448K | -12.4% | -10.1% |\n\n> 📈 **Growth Driver:** Fresh & Produce department is outperforming at +12.4% vs plan — driven by the new local sourcing initiative launched 6 weeks ago. This practice is a candidate for district-wide rollout.',
    kpiCards: [
      { label: '4-Week Sales', value: '$872K', delta: '+8.2%', direction: 'up' },
      { label: 'Avg Weekly', value: '$218K', delta: '+$16K', direction: 'up' },
      { label: 'Transactions', value: '22.6K', delta: '+6.4%', direction: 'up' },
      { label: 'Avg Basket', value: '$38.63', delta: '+2.1%', direction: 'up' },
    ],
    chartData: [
      { type: 'bar', title: 'Weekly Sales ($K)', labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], values: [208, 215, 221, 228], color: '#10b981' },
      { type: 'bar', title: '4-Week Sales by Store ($K)', labels: ['Plaza', 'Riverside', 'Central', 'Westfield', 'Harbor', 'Oak St', 'Pine Gr', 'Maple'], values: [872, 784, 692, 648, 596, 532, 476, 448], color: '#6366f1' },
    ],
    followUpQuestions: [
      'What is the gross margin % trend for this store?',
      'Which departments are driving the sales growth?',
      'How does this store compare to the district average?',
    ],
  },
  'margin': {
    answer: '## 📊 Gross Margin Trend — 13-Week Analysis\n\n**Report Period:** Last 13 Weeks (Q3 W1 – Q4 W1) · **Store:** Downtown Plaza #2034 · **District:** 14\n\n---\n\n### Executive Summary\n\nGross margin has trended from **28.4% → 31.2%** over the past 13 weeks, a **+2.8 percentage point improvement**. This outperforms the district average of 27.8% and puts the store in the **top quartile** nationally. The improvement is driven by reduced shrinkage, better promotional mix optimization, and improved fresh department waste management.\n\n### 13-Week Gross Margin Trend\n\n| Week | Gross Margin % | vs District Avg | vs Target (30%) | Key Event |\n|------|---------------|-----------------|-----------------|----------|\n| W1 | 28.4% | +0.2pp | -1.6pp | Baseline period |\n| W2 | 28.6% | +0.3pp | -1.4pp | — |\n| W3 | 28.9% | +0.5pp | -1.1pp | Shrink reduction program launched |\n| W4 | 29.1% | +0.7pp | -0.9pp | — |\n| W5 | 29.3% | +0.8pp | -0.7pp | Fresh waste protocol v2 deployed |\n| W6 | 29.6% | +1.0pp | -0.4pp | — |\n| W7 | 29.8% | +1.2pp | -0.2pp | Promo mix optimization started |\n| W8 | 30.0% | +1.3pp | 0.0pp | **Target achieved** |\n| W9 | 30.2% | +1.5pp | +0.2pp | — |\n| W10 | 30.5% | +1.7pp | +0.5pp | — |\n| W11 | 30.8% | +1.9pp | +0.8pp | Vendor rebate negotiation completed |\n| W12 | 31.0% | +2.1pp | +1.0pp | — |\n| W13 (Current) | **31.2%** | **+2.4pp** | **+1.2pp** | Sustained above target |\n\n### Margin by Department\n\n| Department | Current GM% | 13W Ago | Change | vs District |\n|-----------|------------|---------|--------|-------------|\n| Fresh & Produce | 34.8% | 30.2% | +4.6pp | +3.1pp above |\n| Health & Beauty | 38.2% | 37.1% | +1.1pp | +0.8pp above |\n| Grocery & Staples | 24.6% | 23.8% | +0.8pp | +0.4pp above |\n| Beverages | 29.4% | 28.2% | +1.2pp | +0.6pp above |\n| Household | 26.8% | 26.1% | +0.7pp | +0.2pp above |\n\n### Key Margin Drivers\n\n| Driver | Impact | Detail |\n|--------|--------|--------|\n| **Shrink Reduction** | +1.2pp | Shrinkage reduced from 2.8% → 1.6% through improved receiving verification and loss prevention |\n| **Fresh Waste Management** | +0.8pp | Produce waste cut by 34% through dynamic markdown and donation partnerships |\n| **Promo Mix Optimization** | +0.5pp | Shifted promotional spend toward higher-margin categories; maintained traffic |\n| **Vendor Rebate Negotiation** | +0.3pp | Secured improved terms on top 50 SKUs; effective Week 11 |\n\n> 🎯 **Outlook:** If current trajectory holds, projected to reach **32.0% GM** by end of Q4 — which would qualify for the **Margin Excellence Tier** and associated team bonus.',
    kpiCards: [
      { label: 'Current GM%', value: '31.2%', delta: '+2.8pp', direction: 'up' },
      { label: 'vs District', value: '+2.4pp', delta: 'above avg', direction: 'up' },
      { label: 'Shrink Rate', value: '1.6%', delta: '-1.2pp', direction: 'up' },
      { label: 'Fresh Waste', value: '-34%', delta: 'improved', direction: 'up' },
    ],
    chartData: [
      { type: 'line', title: 'Gross Margin % Trend (13 Weeks)', labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12', 'W13'], values: [28.4, 28.6, 28.9, 29.1, 29.3, 29.6, 29.8, 30.0, 30.2, 30.5, 30.8, 31.0, 31.2], color: '#10b981', secondaryValues: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30], secondaryLabel: 'Target' },
      { type: 'horizontal-bar', title: 'GM% by Department', labels: ['Health & Beauty', 'Fresh & Produce', 'Beverages', 'Household', 'Grocery'], values: [38.2, 34.8, 29.4, 26.8, 24.6], color: '#6366f1' },
    ],
    followUpQuestions: [
      'What is the shrink rate trend for bottom 3 stores?',
      'Show me the fresh department waste analysis',
      'Which vendor rebates are expiring this quarter?',
    ],
  },
  'out of stock': {
    answer: '## 🔮 Predictive OOS Risk — 7-Day Forecast\n\n**Report Period:** Next 7 Days · **Model:** AI Demand Forecasting v3.2 · **Confidence:** 87%\n\n---\n\n### Executive Summary\n\nBased on current inventory levels, sales velocity, replenishment schedules, and seasonal demand patterns, **18 SKUs** across 5 stores are predicted to go **out of stock within the next 7 days** if no intervention is taken. Estimated revenue at risk: **$42K**.\n\n### High-Risk SKUs — Immediate Action Required\n\n| Risk | SKU | Product | Store | Days to OOS | Current Stock | Daily Velocity | Revenue at Risk |\n|------|-----|---------|-------|-------------|---------------|----------------|----------------|\n| 🔴 | SKU-4821 | Organic Whole Milk 1gal | Pine Grove #5678 | **1.2 days** | 8 units | 6.5/day | $980 |\n| 🔴 | SKU-3392 | Pampers Swaddlers Size 3 | Maple Heights #9012 | **1.5 days** | 12 units | 8.2/day | $1,440 |\n| 🔴 | SKU-7156 | Tide Original 92oz | Oak Street #1234 | **1.8 days** | 6 units | 3.4/day | $720 |\n| 🔴 | SKU-2084 | Banana Bunch Organic | Pine Grove #5678 | **2.0 days** | 24 units | 12.1/day | $540 |\n| 🟡 | SKU-5531 | Colgate Total Whitening | Harbor View #4532 | **3.2 days** | 15 units | 4.7/day | $620 |\n| 🟡 | SKU-8943 | Coca-Cola 12pk Cans | Maple Heights #9012 | **3.5 days** | 18 units | 5.2/day | $890 |\n| 🟡 | SKU-1267 | Bounty Paper Towels 8ct | Oak Street #1234 | **3.8 days** | 9 units | 2.4/day | $480 |\n| 🟡 | SKU-6674 | Greek Yogurt Variety 12pk | Central Station #3421 | **4.1 days** | 22 units | 5.4/day | $660 |\n\n### Store-Level Risk Summary\n\n| Store | SKUs at Risk | Revenue at Risk | Avg Days to OOS | Primary Category |\n|-------|-------------|-----------------|-----------------|------------------|\n| Pine Grove #5678 | 6 SKUs | $14.2K | 2.4 days | Fresh & Dairy |\n| Maple Heights #9012 | 5 SKUs | $11.8K | 3.1 days | Baby & Household |\n| Oak Street #1234 | 4 SKUs | $8.4K | 3.6 days | Household & Cleaning |\n| Harbor View #4532 | 2 SKUs | $4.8K | 4.2 days | Health & Beauty |\n| Central Station #3421 | 1 SKU | $2.8K | 4.1 days | Dairy |\n\n### Root Cause Analysis\n\n| Factor | Affected SKUs | Detail |\n|--------|--------------|--------|\n| **Delayed DC shipment** | 8 SKUs | Distribution center backlog — next scheduled delivery pushed 2 days |\n| **Demand spike (seasonal)** | 5 SKUs | Summer demand uplift on beverages and fresh not reflected in auto-replenishment model |\n| **Vendor supply constraint** | 3 SKUs | Supplier allocation reduced 20% due to raw material shortage |\n| **Safety stock too low** | 2 SKUs | Safety stock parameters not updated after last demand review |\n\n> ⚠️ **Revenue Impact:** If all 18 SKUs go OOS for their predicted duration, estimated lost sales total **$42K** across 5 stores. Early intervention can prevent 80%+ of this loss.',
    kpiCards: [
      { label: 'At-Risk SKUs', value: '18', delta: '+5 vs LW', direction: 'down' },
      { label: 'Revenue at Risk', value: '$42K', delta: '7-day', direction: 'down' },
      { label: 'Stores Affected', value: '5 of 8', delta: '62.5%', direction: 'down' },
      { label: 'Avg Days to OOS', value: '3.1', delta: 'days', direction: 'down' },
    ],
    chartData: [
      { type: 'horizontal-bar', title: 'Revenue at Risk by Store ($K)', labels: ['Pine Grove', 'Maple Heights', 'Oak Street', 'Harbor View', 'Central Stn'], values: [14.2, 11.8, 8.4, 4.8, 2.8], color: '#ef4444' },
      { type: 'bar', title: 'At-Risk SKUs by Category', labels: ['Fresh', 'Baby', 'Household', 'Health', 'Dairy', 'Beverages'], values: [5, 3, 3, 2, 2, 3], color: '#f59e0b' },
    ],
    followUpQuestions: [
      'Show total sales impact of OOS items last week',
      'Which stores have the highest shrink rate?',
      'What is the replenishment SLA performance by store?',
    ],
  },
};


// ── Skill Config ──
const skills: { id: SkillMode; label: string; icon: React.ReactNode; description: string; placeholder: string; suggestions: string[] }[] = [
  {
    id: 'knowledge',
    label: 'Knowledge Center',
    icon: <Brain size={16} />,
    description: 'Ask SOP & policy questions — get cited answers',
    placeholder: 'Ask about SOPs, policies, procedures...',
    suggestions: ['What is the exact procedure if a fire exit is blocked?', 'How many days notice is required before a planogram change?', 'What steps should a store manager follow for a product recall?', 'What happens if a store misses two consecutive weekly audits?'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 size={16} />,
    description: 'Ask performance questions — get KPI insights',
    placeholder: 'Ask about sales, performance, trends...',
    suggestions: ['Show total sales in the last 4 weeks for Downtown Plaza', 'Which stores are underperforming vs target this week?', 'What is the gross margin % trend over the last 13 weeks?', 'Which SKUs are likely to go out of stock in the next 7 days?'],
  },
  {
    id: 'pog',
    label: 'POG Audit',
    icon: <ImageIcon size={16} />,
    description: 'Upload shelf images — detect OOS, check compliance, or create tasks',
    placeholder: 'Upload a shelf image to detect OOS, check compliance, or create tasks',
    suggestions: ['Detect OOS items', 'Check compliance'],
  },
  {
    id: 'actions',
    label: 'Actions',
    icon: <Zap size={16} />,
    description: 'Create tasks & assignments via natural language',
    placeholder: 'Tell me what task to create...',
    suggestions: ['Create a restocking task for Aisle 5', 'Assign safety audit follow-up to John', 'Schedule planogram reset for next Monday', 'Create urgent task for fire exit clearance'],
  },
];

// ── Helper: match query to response ──
const findKnowledgeResponse = (query: string) => {
  const q = query.toLowerCase();
  for (const [key, val] of Object.entries(knowledgeResponses)) {
    if (q.includes(key)) return val;
  }
  return {
    answer: '## 📄 Knowledge Center — Policy Reference\n\n**Classification:** General Operations · **Confidence:** High — Multiple Sources Found\n\n---\n\n### Standard Operating Procedure\n\nBased on the current store operations policy framework, the applicable procedure is as follows:\n\n| Step | Action | Owner | SLA |\n|------|--------|-------|-----|\n| 1 | **Identify & Document** — Log the issue in the Incident Management System with full details (time, location, description, photos if applicable) | Discovering Associate | Immediate |\n| 2 | **Notify Management** — Escalate to the Store Manager via the standard notification channel | Discovering Associate | Within 15 minutes |\n| 3 | **Assess & Classify** — Store Manager reviews the issue, assigns severity level (Critical / High / Medium / Low) | Store Manager | Within 1 hour |\n| 4 | **Execute Resolution** — Follow the relevant SOP checklist for the classified issue type | Assigned Owner | Per SLA matrix |\n| 5 | **Verify & Close** — Confirm resolution, update the incident log, and obtain sign-off | Store Manager | Within 24 hours |\n\n### Escalation Matrix\n\n- **Not resolved within SLA** → Auto-escalates to District Manager\n- **Repeated occurrence (3+ in 30 days)** → Root Cause Analysis required, Regional Ops notified\n- **Safety or compliance impact** → Immediate escalation to Safety Officer / Compliance Team\n\n> 💡 **Tip:** For more specific guidance, try asking about a particular topic such as "fire exit rules", "product recall steps", "safety audit process", or "planogram change notice period".',
    sources: [
      { doc: 'General Store Operations SOP v2.4', section: 'Section 1.1 — General Procedures', page: 'Pages 2–4' },
      { doc: 'Escalation Framework', section: 'Section 2.1 — Standard Escalation Matrix', page: 'Page 8' },
    ],
  };
};

const findAnalyticsResponse = (query: string) => {
  const q = query.toLowerCase();
  for (const [key, val] of Object.entries(analyticsResponses)) {
    if (q.includes(key)) return val;
  }
  return {
    answer: '## 📊 District Performance Overview — Executive Summary\n\n**Report Period:** Current Period · **Scope:** District 14 — All 8 Stores\n\n---\n\n### Key Performance Indicators\n\nThe district is operating within the **"Performing"** tier with a composite DPI of **81.2** (+0.8 vs prior period). Five of eight stores are meeting or exceeding their targets.\n\n### Store Performance Summary\n\n| Store | DPI | Sales vs Plan | Status |\n|-------|-----|---------------|--------|\n| Downtown Plaza #2034 | 94 | +8.2% | ✅ Exceeding |\n| Riverside Mall #1876 | 91 | +5.4% | ✅ Exceeding |\n| Central Station #3421 | 85 | +2.1% | ✅ On Target |\n| Westfield Center #2198 | 79 | -1.2% | ✅ On Target |\n| Harbor View #4532 | 76 | -4.8% | ✅ On Target |\n| Oak Street #1234 | 72 | -6.8% | ⚠️ Below |\n| Pine Grove #5678 | 65 | -9.2% | 🔴 At Risk |\n| Maple Heights #9012 | 58 | -12.4% | 🔴 Critical |\n\n### Opportunity Areas\n\n| Area | Current | Target | Gap | Recommendation |\n|------|---------|--------|-----|----------------|\n| Weekend Conversion | 31.2% | 36% | -4.8pp | Add floor associates during Sat/Sun peak |\n| Product Availability | 95.2% | 98% | -2.8pp | Increase stock-check frequency at bottom 3 stores |\n| VoC Satisfaction | 79% | 85% | -6pp | Deploy targeted cleaning protocol at Pine Grove & Maple Heights |\n\n> 💡 **Insight:** The district is trending positively overall. Focus intervention on the bottom 3 stores to close the performance gap. Would you like me to drill deeper into any specific metric or store?',
    kpiCards: [
      { label: 'District DPI', value: '81.2', delta: '+0.8', direction: 'up' as const },
      { label: 'On-Target Stores', value: '5/8', delta: '62.5%', direction: 'up' as const },
    ],
    chartData: [
      { type: 'bar' as const, title: 'DPI by Store', labels: ['Plaza', 'Riverside', 'Central', 'Westfield', 'Harbor', 'Oak St', 'Pine Gr', 'Maple'], values: [94, 91, 85, 79, 76, 72, 65, 58], color: '#6366f1' },
    ],
    followUpQuestions: [
      'Which stores are underperforming vs target this week?',
      'What are the VoC trends across the district?',
      'Show me the best performing stores',
    ],
  };
};

// ── VoC Action Plan Response ──
const vocActionPlanResponse = {
  content: '**Action Plan: "Messy Aisles" — VoC Rising Theme**\n\nBased on analysis of 134 customer mentions (+34% over 2 weeks) across 3 stores, here\'s the recommended action plan:\n\n**Root Cause Analysis:**\n• Reduced cleaning staff during peak hours (Hamburg South, Cologne East)\n• Delayed restocking creating aisle clutter (Brussels Nord)\n• Insufficient aisle-clear protocols during promotional resets\n\n**Recommended Actions:**',
  taskCreated: {
    title: 'Deploy Targeted Aisle Cleanliness Protocol — 3 Stores',
    assignee: '',
    priority: 'High',
    due: 'This Week',
  },
  suggestedQueries: ['Create follow-up audit task', 'View affected store details', 'Schedule team briefing'],
};

// ── Component ──
export const AICopilot: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSkill, setActiveSkill] = useState<SkillMode>('knowledge');
  const autoTriggeredRef = useRef(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStep, setInitStep] = useState(0);
  const [initMode, setInitMode] = useState<SkillMode | null>(null);
  const [initStepLabels, setInitStepLabels] = useState<string[]>([]);
  const [messages, setMessages] = useState<Record<SkillMode, ChatMessage[]>>({
    knowledge: [],
    analytics: [],
    pog: [],
    actions: [],
  });
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [pendingPogAction, setPendingPogAction] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  // Add to Operations Queue state
  const [taskPushOpen, setTaskPushOpen] = useState<string | null>(null); // message ID
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskPriority, setTaskPriority] = useState('High');
  const [taskPushed, setTaskPushed] = useState<Set<string>>(new Set());
  const [taskPushing, setTaskPushing] = useState<string | null>(null); // loading state
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMessages = messages[activeSkill];
  const currentSkill = skills.find(s => s.id === activeSkill)!;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeSkill]);

  // Agentic action processing — animated step-by-step
  const runAgenticActionFlow = async (
    processingId: string,
    steps: ProcessingStep[],
    finalResponse: ChatMessage,
  ) => {
    // Add processing message with steps
    const processingMsg: ChatMessage = {
      id: processingId,
      role: 'assistant',
      content: 'Analyzing request...',
      timestamp: new Date(),
      skill: 'actions',
      isProcessing: true,
      processingSteps: [...steps],
    };
    setMessages(prev => {
      if (prev.actions.some(m => m.id === processingId)) return prev;
      return { ...prev, actions: [...prev.actions, processingMsg] };
    });

    // Animate steps one by one
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 400));
      setMessages(prev => ({
        ...prev,
        actions: prev.actions.map(m =>
          m.id === processingId ? {
            ...m,
            processingSteps: m.processingSteps?.map((s, idx) => ({
              ...s,
              status: idx <= i ? 'completed' as const : idx === i + 1 ? 'active' as const : 'pending' as const,
            })),
          } : m
        ),
      }));
    }

    // Small pause after all steps complete, then show final response
    await new Promise(resolve => setTimeout(resolve, 600));
    setMessages(prev => ({
      ...prev,
      actions: prev.actions.filter(m => m.id !== processingId).concat(finalResponse),
    }));
    setIsProcessing(false);
  };

  // Auto-trigger from Home Screen VoC "Open in AI Copilot" button
  useEffect(() => {
    const mode = searchParams.get('mode');
    const context = searchParams.get('context');
    
    if (mode === 'actions' && context === 'voc-messy-aisles' && !autoTriggeredRef.current) {
      autoTriggeredRef.current = true;
      setActiveSkill('actions');
      setInitMode('actions');
      setSearchParams({}, { replace: true });

      // Phase 1: Show initializing screen for 2 seconds with animated steps
      setIsInitializing(true);
      setInitStep(0);
      setTimeout(() => setInitStep(1), 600);
      setTimeout(() => setInitStep(2), 1200);
      setTimeout(() => setInitStep(3), 1800);
      setTimeout(() => {
        setIsInitializing(false);
        setInitStep(0);

        // Phase 2: Show user message
        const userMsg: ChatMessage = {
          id: 'msg-auto-voc',
          role: 'user',
          content: 'Create an action plan for the "Messy Aisles" VoC theme trending across Hamburg South #2041, Cologne East #2034, and Brussels Nord #2038',
          timestamp: new Date(),
          skill: 'actions',
        };
        setMessages(prev => {
          if (prev.actions.some(m => m.id === 'msg-auto-voc')) return prev;
          return { ...prev, actions: [...prev.actions, userMsg] };
        });
        setIsProcessing(true);

        // Phase 3: After short pause, run agentic processing steps
        setTimeout(() => {
          const vocSteps: ProcessingStep[] = [
            { step: 'Receiving VoC theme context...', status: 'active' },
            { step: 'Analyzing 134 customer mentions across 3 stores...', status: 'pending' },
            { step: 'Cross-referencing with SEA Cleanliness scores...', status: 'pending' },
            { step: 'Identifying root causes and correlations...', status: 'pending' },
            { step: 'Generating action plan recommendations...', status: 'pending' },
            { step: 'Creating action item for Operations Queue...', status: 'pending' },
          ];

          const finalResponse: ChatMessage = {
            id: 'msg-resp-voc',
            role: 'assistant',
            content: vocActionPlanResponse.content,
            timestamp: new Date(),
            skill: 'actions',
            taskCreated: vocActionPlanResponse.taskCreated,
            suggestedQueries: vocActionPlanResponse.suggestedQueries,
          };

          runAgenticActionFlow('msg-processing-voc', vocSteps, finalResponse);
        }, 500);
      }, 2000);
    }

    // Deep-link: POG Self Audit from District Broadcasting
    if (mode === 'pog' && context === 'pog-self-audit' && !autoTriggeredRef.current) {
      autoTriggeredRef.current = true;
      setActiveSkill('pog');
      setInitMode('pog');
      setSearchParams({}, { replace: true });

      setIsInitializing(true);
      setInitStep(0);
      setTimeout(() => setInitStep(1), 600);
      setTimeout(() => setInitStep(2), 1200);
      setTimeout(() => setInitStep(3), 1800);
      setTimeout(() => {
        setIsInitializing(false);
        setInitStep(0);
        setInitMode(null);

        const pogListMsg: ChatMessage = {
          id: 'msg-pog-list',
          role: 'assistant',
          content: '**POG Self Audit — District 14 Planograms**\n\nI\'ve loaded all active planograms for your district. Select a planogram to begin the self-audit, or upload a shelf image to check compliance.',
          timestamp: new Date(),
          skill: 'pog',
          pogPlanogramList: [
            { name: 'C&A Accessories Endcap — Localized v2.1', store: 'Downtown Plaza #2034', lastAudit: '5 days ago', score: 76, status: 'warning' },
            { name: 'Seasonal Display — Summer Collection v1.3', store: 'Harbor View #3021', lastAudit: '12 days ago', score: 84, status: 'pass' },
            { name: 'Checkout Impulse Bay — Standard v4.0', store: 'Riverside Mall #1876', lastAudit: '3 days ago', score: 91, status: 'pass' },
            { name: 'Beverage Cooler Endcap — Promo Q2', store: 'Oak Street #1234', lastAudit: '8 days ago', score: 68, status: 'fail' },
            { name: 'Health & Beauty Aisle — Reset v2.0', store: 'Central Station #3421', lastAudit: '1 day ago', score: 88, status: 'pass' },
            { name: 'Fresh Produce Wall — Localized v3.1', store: 'Maple Heights #9012', lastAudit: '14 days ago', score: 72, status: 'warning' },
          ],
          suggestedQueries: ['Audit C&A Accessories Endcap', 'Audit Beverage Cooler Endcap', 'Detect OOS items', 'Check compliance'],
        };
        setMessages(prev => {
          if (prev.pog.some(m => m.id === 'msg-pog-list')) return prev;
          return { ...prev, pog: [...prev.pog, pogListMsg] };
        });
      }, 2200);
    }

    // Deep-link: Generic audit dimension from Heatmap
    if (context?.startsWith('audit-') && !autoTriggeredRef.current) {
      const skill = mode as SkillMode;
      const storeNum = searchParams.get('store') || '';
      const storeName = decodeURIComponent(searchParams.get('storeName') || '');
      const score = parseInt(searchParams.get('score') || '0');
      const dimension = context.replace('audit-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      if (['pog', 'knowledge', 'actions', 'analytics'].includes(skill)) {
        autoTriggeredRef.current = true;
        setActiveSkill(skill);
        setInitMode(skill === 'pog' ? 'pog' : skill === 'actions' ? 'actions' : null);
        setSearchParams({}, { replace: true });

        // Skill-specific init overlay steps
        const initStepsMap: Record<string, string[]> = {
          pog: ['Loading planogram data for store #' + storeNum, 'Connecting to AI Vision engine', 'Preparing compliance workspace'],
          knowledge: ['Loading SOPs and guidelines for ' + dimension, 'Indexing knowledge base documents', 'Preparing contextual answers'],
          actions: ['Analyzing ' + dimension.toLowerCase() + ' audit findings', 'Loading execution playbooks', 'Generating action recommendations'],
          analytics: ['Pulling ' + dimension.toLowerCase() + ' metrics for store #' + storeNum, 'Running trend analysis', 'Computing benchmark comparisons'],
        };
        const steps = initStepsMap[skill] || initStepsMap['analytics'];
        setInitStepLabels(steps);

        setIsInitializing(true);
        setInitStep(0);
        setTimeout(() => setInitStep(1), 600);
        setTimeout(() => setInitStep(2), 1200);
        setTimeout(() => setInitStep(3), 1800);
        setTimeout(() => {
          setIsInitializing(false);
          setInitStep(0);
          setInitMode(null);

          // Build skill-specific contextual response
          const msgId = `msg-audit-${storeNum}-${dimension.toLowerCase().replace(/ /g, '-')}`;
          const scoreLabel = score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : score >= 50 ? 'Needs Improvement' : 'Critical';
          const scoreEmoji = score >= 90 ? '🟢' : score >= 75 ? '🟡' : score >= 50 ? '🟠' : '🔴';

          const contentMap: Record<string, string> = {
            pog: `**📋 Planogram Compliance — Store #${storeNum} (${storeName})**\n\nCurrent Score: ${scoreEmoji} **${score}%** (${scoreLabel})\n\nI've loaded the planogram compliance data for this store. Here's what I found:\n\n**Key Findings:**\n- ${score < 75 ? 'Shelf facings deviate significantly from authorized planogram layout' : 'Most shelf sections align with planogram specifications'}\n- ${score < 60 ? 'Promotional endcap not set up per current cycle guidelines' : 'Promotional displays are mostly compliant'}\n- ${score < 50 ? 'Category flow disruptions detected in multiple aisles' : 'Category adjacency rules are being followed'}\n\n**Recommended Actions:**\n1. ${score < 75 ? 'Schedule immediate planogram reset for non-compliant sections' : 'Maintain current planogram adherence'}\n2. Upload a shelf photo for real-time compliance check\n3. Review specific aisle compliance breakdown`,
            knowledge: `**📖 ${dimension} Guidelines — Store #${storeNum} (${storeName})**\n\nCurrent Score: ${scoreEmoji} **${score}%** (${scoreLabel})\n\nI've loaded the relevant SOPs and guidelines for ${dimension.toLowerCase()} compliance.\n\n**Applicable Standards:**\n- **SOP-${dimension.replace(/ /g, '')}-001**: ${dimension} audit checklist and procedures\n- **Policy Ref**: District 14 ${dimension.toLowerCase()} compliance standards v2.3\n- **Last Updated**: 2 weeks ago\n\n**Key Gaps vs. Standards:**\n- ${score < 75 ? `Store is ${100 - score}% below target compliance for ${dimension.toLowerCase()}` : `Store meets most ${dimension.toLowerCase()} standards`}\n- ${score < 60 ? 'Multiple policy violations detected during last audit' : 'Minor deviations noted in last audit cycle'}\n\nAsk me about specific ${dimension.toLowerCase()} procedures, escalation protocols, or corrective action guidelines.`,
            actions: `**⚡ ${dimension} Action Plan — Store #${storeNum} (${storeName})**\n\nCurrent Score: ${scoreEmoji} **${score}%** (${scoreLabel})\n\nBased on the audit findings, here are the recommended actions:\n\n**Priority Actions:**\n${score < 50 ? `\n🔴 **CRITICAL — Immediate Intervention Required**\n1. Deploy ${dimension.toLowerCase()} correction team within 24 hours\n2. Escalate to Area Manager for oversight\n3. Schedule re-audit within 48 hours\n4. Document all corrective actions taken` : score < 75 ? `\n🟠 **HIGH — Action Required This Week**\n1. Review ${dimension.toLowerCase()} audit findings with store manager\n2. Create corrective action checklist\n3. Assign specific tasks to department leads\n4. Schedule follow-up audit in 5 days` : `\n🟢 **MAINTENANCE — Continue Monitoring**\n1. Acknowledge positive performance in ${dimension.toLowerCase()}\n2. Share best practices with underperforming stores\n3. Maintain current operational routines`}\n\nWould you like me to create tasks for the store manager or generate a detailed action plan?`,
            analytics: `**📊 ${dimension} Analytics — Store #${storeNum} (${storeName})**\n\nCurrent Score: ${scoreEmoji} **${score}%** (${scoreLabel})\n\n**Trend Analysis (12 weeks):**\n- Current: **${score}%** ${score < 75 ? '📉 Declining' : score < 90 ? '➡️ Stable' : '📈 Improving'}\n- District Avg: **79%**\n- ${score >= 79 ? `Store is **${score - 79}pts above** district average` : `Store is **${79 - score}pts below** district average`}\n\n**Benchmark Comparison:**\n- Best in District: **98%** (Downtown Plaza #2034)\n- Worst in District: **${Math.min(score, 28)}%** (Maple Heights #9012)\n- This Store Rank: **${score >= 90 ? 'Top 25%' : score >= 75 ? 'Mid 50%' : score >= 50 ? 'Bottom 25%' : 'Bottom 10%'}**\n\n**Key Metrics:**\n- Audit frequency: Weekly\n- Consecutive ${score >= 75 ? 'pass' : 'miss'} streak: ${score >= 75 ? Math.floor(score / 20) : Math.floor((100 - score) / 25)} weeks\n- Correlation with DPI: ${score >= 75 ? 'Positive' : 'Negative'} impact\n\nWould you like a deeper drill-down on specific sub-categories or week-over-week trends?`,
          };

          const suggestedMap: Record<string, string[]> = {
            pog: ['Check shelf compliance for Aisle 3', 'Upload shelf photo', `Compare with best store`, 'View planogram reset schedule'],
            knowledge: [`Show ${dimension} SOP`, `Escalation protocol for ${dimension.toLowerCase()}`, 'Corrective action guidelines', 'Audit checklist'],
            actions: [`Create action plan for store #${storeNum}`, 'Assign tasks to store manager', `Schedule re-audit`, 'Escalate to Area Manager'],
            analytics: [`Show ${dimension.toLowerCase()} trend chart`, `Compare store #${storeNum} vs district`, 'Week-over-week breakdown', 'Correlation analysis'],
          };

          const auditMsg: ChatMessage = {
            id: msgId,
            role: 'assistant',
            content: contentMap[skill] || contentMap['analytics'],
            timestamp: new Date(),
            skill: skill,
            suggestedQueries: suggestedMap[skill] || suggestedMap['analytics'],
          };

          setMessages(prev => {
            if (prev[skill].some(m => m.id === msgId)) return prev;
            return { ...prev, [skill]: [...prev[skill], auditMsg] };
          });
        }, 2200);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const addMessage = (msg: ChatMessage) => {
    setMessages(prev => ({
      ...prev,
      [activeSkill]: [...prev[activeSkill], msg],
    }));
  };

  const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const simulateResponse = (userQuery: string) => {
    setIsProcessing(true);

    // Add typing indicator
    const typingId = generateId();
    const typingMsg: ChatMessage = {
      id: typingId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      skill: activeSkill,
      isTyping: true,
    };
    setMessages(prev => ({
      ...prev,
      [activeSkill]: [...prev[activeSkill], typingMsg],
    }));

    setTimeout(() => {
      // Remove typing indicator and add real response
      setMessages(prev => {
        const filtered = prev[activeSkill].filter(m => m.id !== typingId);
        let response: ChatMessage;

        if (activeSkill === 'knowledge') {
          const result = findKnowledgeResponse(userQuery);
          response = {
            id: generateId(),
            role: 'assistant',
            content: result.answer,
            timestamp: new Date(),
            skill: 'knowledge',
            sources: result.sources,
            followUpQuestions: result.followUpQuestions,
          };
        } else if (activeSkill === 'analytics') {
          const result = findAnalyticsResponse(userQuery);
          response = {
            id: generateId(),
            role: 'assistant',
            content: result.answer,
            timestamp: new Date(),
            skill: 'analytics',
            kpiCards: result.kpiCards,
            chartData: result.chartData,
            followUpQuestions: result.followUpQuestions,
          };
        } else if (activeSkill === 'pog') {
          // POG skill handled by simulatePogAgentic — should not reach here
          response = { id: generateId(), role: 'assistant', content: '', timestamp: new Date(), skill: 'pog' };
        } else {
          // Actions skill — will be handled by agentic flow below
          response = { id: generateId(), role: 'assistant', content: '', timestamp: new Date(), skill: 'actions' };
        }

        return { ...prev, [activeSkill]: [...filtered, response] };
      });

      setIsProcessing(false);
    }, 1500 + Math.random() * 1000);
  };

  // Agentic flow for regular Actions skill user queries
  const simulateActionAgentic = (userQuery: string) => {
    setIsProcessing(true);

    const taskTitle = userQuery.replace(/^(create|assign|schedule)\s+(a\s+)?/i, '').replace(/\s+task\s+/i, ' ');
    const actionSteps: ProcessingStep[] = [
      { step: 'Parsing task request...', status: 'active' },
      { step: 'Identifying assignee and priority...', status: 'pending' },
      { step: 'Validating against Operations Queue...', status: 'pending' },
      { step: 'Creating action item...', status: 'pending' },
    ];

    const finalMsg: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: 'Action item created successfully. You can assign it and push to the Operations Queue below.',
      timestamp: new Date(),
      skill: 'actions',
      taskCreated: {
        title: taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1),
        assignee: '',
        priority: userQuery.toLowerCase().includes('urgent') || userQuery.toLowerCase().includes('fire') ? 'Critical' : 'Medium',
        due: userQuery.toLowerCase().includes('monday') ? 'Next Monday' : userQuery.toLowerCase().includes('today') ? 'Today' : 'Tomorrow',
      },
      suggestedQueries: ['Create another task', 'View all active tasks', 'Assign to a different team member'],
    };

    runAgenticActionFlow(`proc-${Date.now()}`, actionSteps, finalMsg);
  };

  const simulatePogAgentic = async (userQuery: string, userImage?: string) => {
    setIsProcessing(true);
    const q = userQuery.toLowerCase();
    const isOos = q.includes('oos') || q.includes('out of stock') || q.includes('detect oos');

    // Define processing steps based on type
    const steps: ProcessingStep[] = isOos ? [
      { step: 'Receiving shelf image...', status: 'active' },
      { step: 'AI Agent reviewing image...', status: 'pending' },
      { step: 'Scanning for empty shelf positions...', status: 'pending' },
      { step: 'Cross-referencing with store planogram...', status: 'pending' },
      { step: 'Identifying out-of-stock products...', status: 'pending' },
      { step: 'Generating OOS detection report...', status: 'pending' },
    ] : [
      { step: 'Receiving store shelf capture...', status: 'active' },
      { step: 'Loading reference planogram (C&A Accessories Endcap)...', status: 'pending' },
      { step: 'AI Vision analyzing product positions...', status: 'pending' },
      { step: 'Comparing facings and placement accuracy...', status: 'pending' },
      { step: 'Evaluating category adjacency rules...', status: 'pending' },
      { step: 'Checking price label alignment...', status: 'pending' },
      { step: 'Calculating compliance metrics...', status: 'pending' },
      { step: 'Generating audit report...', status: 'pending' },
    ];

    // Add processing message
    const processingId = generateId();
    const processingMsg: ChatMessage = {
      id: processingId,
      role: 'assistant',
      content: isOos ? 'Analyzing shelf for out-of-stock items...' : 'Running compliance audit...',
      timestamp: new Date(),
      skill: 'pog',
      isProcessing: true,
      processingSteps: [...steps],
    };
    setMessages(prev => ({ ...prev, pog: [...prev.pog, processingMsg] }));

    // Animate steps one by one
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 400));
      setMessages(prev => ({
        ...prev,
        pog: prev.pog.map(m =>
          m.id === processingId ? {
            ...m,
            processingSteps: m.processingSteps?.map((s, idx) => ({
              ...s,
              status: idx <= i ? 'completed' as const : idx === i + 1 ? 'active' as const : 'pending' as const,
            })),
          } : m
        ),
      }));
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    // Remove processing message and add result
    if (isOos) {
      const oosResult: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '🚨 **Critical Out-of-Stock Alert!**\n\nI detected **4 out-of-stock positions** requiring immediate replenishment:',
        timestamp: new Date(),
        skill: 'pog',
        oosImage: userImage || '/oos-case-1-detected.png',
        oosItems: [
          { name: 'V-Neck Basic Tee — White (M)', shelf: 'Section A', position: 'Rail 2, Position 3-4' },
          { name: 'Floral Print Dress — Navy (S)', shelf: 'Section B', position: 'Rail 1, Position 5-6' },
          { name: 'Slim Fit Denim — Dark Wash (L)', shelf: 'Section C', position: 'Rail 3, Position 1-2' },
          { name: 'Classic Fit Blouse — Cream (M)', shelf: 'Section A', position: 'Rail 1, Position 7-8' },
        ],
        suggestedQueries: ['Create replenishment task', 'Check backroom inventory', 'Schedule shelf restocking'],
      };
      setMessages(prev => ({ ...prev, pog: [...prev.pog.filter(m => m.id !== processingId), oosResult] }));
    } else {
      // Compliance report
      const report: ComplianceAuditReport = {
        overallScore: 76.4,
        grade: 'C',
        planogramName: 'C&A Accessories Endcap — Localized v2.1',
        storeInfo: 'Downtown Plaza #2034 — Urban Flagship Cluster',
        auditDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        categories: [
          { name: 'Product Placement Accuracy', score: 18, maxScore: 25, status: 'warning', findings: ['Scarves section shifted 2 positions left from planogram', 'Sunglasses display rotated incorrectly', 'Belt rack missing from designated hook position'] },
          { name: 'Facing Count Compliance', score: 15, maxScore: 20, status: 'warning', findings: ['Hair accessories: 4 facings vs. required 6 (-33%)', 'Jewelry display: 8 facings vs. required 10 (-20%)', 'Watch section: Compliant at 4 facings'] },
          { name: 'Category Adjacency', score: 20, maxScore: 20, status: 'pass', findings: ['All category groupings follow planogram sequence', 'Premium items correctly positioned at eye level', 'Impulse items properly placed near checkout zone'] },
          { name: 'Price Label Alignment', score: 12, maxScore: 15, status: 'warning', findings: ['3 missing price labels in jewelry section', '2 labels misaligned with product position', 'Promotional tags correctly displayed'] },
          { name: 'Fixture & Signage', score: 11.4, maxScore: 20, status: 'fail', findings: ['Header signage partially obscured', 'One shelf bracket needs replacement', 'Endcap topper missing promotional insert', 'LED strip lighting non-functional on shelf 2'] },
        ],
        deviations: [
          { item: 'Silk Scarves Collection', expected: 'Shelf 1, Position 1-4 (4 facings)', actual: 'Shelf 1, Position 3-6 (shifted right)', severity: 'warning', impact: 'Reduces visual flow, -5% category sales risk' },
          { item: 'Designer Sunglasses', expected: 'Shelf 2, Eye-level center', actual: 'Shelf 2, Left side (rotated 15°)', severity: 'critical', impact: 'Premium visibility reduced, -12% conversion risk' },
          { item: 'Leather Belt Display', expected: 'Hook Panel A, Position 1-8', actual: 'Missing from fixture', severity: 'critical', impact: 'Complete category gap, estimated $340/week lost sales' },
          { item: 'Hair Accessories Rack', expected: '6 facings minimum', actual: '4 facings displayed', severity: 'warning', impact: 'Reduced selection visibility, -8% category performance' },
          { item: 'Statement Jewelry', expected: 'Shelf 3, Positions 1-10', actual: 'Shelf 3, Positions 1-8 (2 short)', severity: 'warning', impact: 'Incomplete assortment display' },
          { item: 'Watch Display Case', expected: 'Locked case, 4 facings', actual: 'Compliant', severity: 'info', impact: 'No action required' },
        ],
        recommendations: [
          'IMMEDIATE: Reinstall leather belt display on Hook Panel A — Critical revenue impact',
          'HIGH: Reposition sunglasses to center eye-level per planogram — Premium category at risk',
          'HIGH: Add 2 facings to hair accessories rack — Stock from backroom',
          'MEDIUM: Realign scarves section 2 positions left to match planogram',
          'MEDIUM: Replace missing price labels in jewelry section (3 labels)',
          'LOW: Submit maintenance ticket for LED strip repair on shelf 2',
          'LOW: Request replacement shelf bracket from facilities',
        ],
        comparisonImages: {
          expected: '/localized-accessories-endcap.png',
          actual: userImage || '/compliance-usecase.png',
        },
      };

      const complianceResult: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '📋 **Compliance Audit Report Generated**',
        timestamp: new Date(),
        skill: 'pog',
        complianceReport: report,
        suggestedQueries: ['Create compliance reset task', 'View reference planogram', 'Re-audit after corrections'],
      };
      setMessages(prev => ({ ...prev, pog: [...prev.pog.filter(m => m.id !== processingId), complianceResult] }));
    }

    setIsProcessing(false);
  };

  const handleSend = (overrideText?: string) => {
    const text = (overrideText ?? inputValue).trim();
    if (!text && !uploadedImage) return;
    if (isProcessing) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text || 'Audit this shelf image',
      timestamp: new Date(),
      skill: activeSkill,
      imageUrl: uploadedImage || undefined,
    };

    addMessage(userMsg);
    const currentImage = uploadedImage;
    setInputValue('');
    setUploadedImage(null);

    if (activeSkill === 'pog') {
      simulatePogAgentic(text || 'audit shelf', currentImage || undefined);
    } else if (activeSkill === 'actions') {
      simulateActionAgentic(text || 'create task');
    } else {
      simulateResponse(text || 'audit shelf');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (query: string) => {
    // For POG skill — "Detect OOS items" and "Check compliance" should trigger image upload first
    if (activeSkill === 'pog' && (query === 'Detect OOS items' || query === 'Check compliance')) {
      setPendingPogAction(query);
      fileInputRef.current?.click();
      return;
    }

    setInputValue(query);
    setTimeout(() => {
      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: query,
        timestamp: new Date(),
        skill: activeSkill,
      };
      addMessage(userMsg);
      setInputValue('');
      simulateResponse(query);
    }, 100);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imageData = ev.target?.result as string;

        // If there's a pending POG action, auto-send with the image
        if (pendingPogAction) {
          const action = pendingPogAction;
          setPendingPogAction(null);
          const userMsg: ChatMessage = {
            id: generateId(),
            role: 'user',
            content: action,
            timestamp: new Date(),
            skill: activeSkill,
            imageUrl: imageData,
          };
          addMessage(userMsg);
          simulatePogAgentic(action, imageData);
        } else {
          setUploadedImage(imageData);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input so same file can be re-selected
    e.target.value = '';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getSkillLabel = (skill: SkillMode) => {
    const map: Record<SkillMode, string> = { knowledge: 'Searching knowledge base...', analytics: 'Analyzing performance data...', pog: 'Running planogram audit...', actions: 'Creating task...' };
    return map[skill];
  };

  const renderMessageContent = (msg: ChatMessage) => {
    if (msg.isTyping) {
      return (
        <div className="cop-thinking">
          <div className="cop-thinking-bar">
            <div className="cop-thinking-pulse" />
            <span>{getSkillLabel(msg.skill)}</span>
          </div>
          <div className="cop-typing-indicator">
            <span /><span /><span />
          </div>
        </div>
      );
    }

    // Agentic processing steps (ShelfIQ-style)
    if (msg.isProcessing && msg.processingSteps) {
      return (
        <div className="cop-agent-processing">
          <div className="cop-processing-header">
            <div className="cop-processing-spinner" />
            <span>{msg.skill === 'pog' ? 'Analyzing image...' : msg.skill === 'actions' ? 'Processing action request...' : 'Analyzing...'}</span>
          </div>
          <div className="cop-processing-steps">
            {msg.processingSteps.map((step, idx) => (
              <div key={idx} className={`cop-processing-step cop-step--${step.status}`}>
                <div className="cop-step-indicator">
                  {step.status === 'completed' && <span className="cop-step-check">✓</span>}
                  {step.status === 'active' && <span className="cop-step-dot cop-step-dot--active" />}
                  {step.status === 'pending' && <span className="cop-step-dot" />}
                </div>
                <span className="cop-step-text">{step.step}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <>
        {msg.content && (
          <div className="cop-msg-text" dangerouslySetInnerHTML={{
            __html: (() => {
              let text = msg.content;
              // Hide "Recommended Actions:" section once task is pushed
              if (msg.taskCreated && taskPushed.has(msg.id)) {
                text = text.split(/\*\*Recommended Actions:\*\*/)[0].trimEnd();
              }
              // Markdown-to-HTML conversion
              const lines = text.split('\n');
              const htmlParts: string[] = [];
              let inTable = false;
              let tableRows: string[] = [];

              const flushTable = () => {
                if (tableRows.length < 2) { htmlParts.push(...tableRows); tableRows = []; inTable = false; return; }
                const headerCells = tableRows[0].split('|').map(c => c.trim()).filter(Boolean);
                const dataRows = tableRows.slice(2); // skip separator row
                let t = '<table class="cop-md-table"><thead><tr>';
                headerCells.forEach(c => { t += `<th>${c.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</th>`; });
                t += '</tr></thead><tbody>';
                dataRows.forEach(row => {
                  const cells = row.split('|').map(c => c.trim()).filter(Boolean);
                  t += '<tr>';
                  cells.forEach(c => { t += `<td>${c.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</td>`; });
                  t += '</tr>';
                });
                t += '</tbody></table>';
                htmlParts.push(t);
                tableRows = [];
                inTable = false;
              };

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const trimmed = line.trim();

                // Detect table rows (lines containing pipes)
                if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                  if (!inTable) inTable = true;
                  tableRows.push(trimmed);
                  continue;
                } else if (inTable) {
                  flushTable();
                }

                // Horizontal rule
                if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
                  htmlParts.push('<hr class="cop-md-hr" />');
                  continue;
                }
                // H2
                if (trimmed.startsWith('## ')) {
                  htmlParts.push(`<h2 class="cop-md-h2">${trimmed.slice(3).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</h2>`);
                  continue;
                }
                // H3
                if (trimmed.startsWith('### ')) {
                  htmlParts.push(`<h3 class="cop-md-h3">${trimmed.slice(4).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</h3>`);
                  continue;
                }
                // Blockquote
                if (trimmed.startsWith('> ')) {
                  htmlParts.push(`<blockquote class="cop-md-bq">${trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</blockquote>`);
                  continue;
                }
                // Unordered list
                if (/^[-•] /.test(trimmed)) {
                  htmlParts.push(`<div class="cop-md-li">• ${trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>`);
                  continue;
                }
                // Ordered list
                if (/^\d+\.\s/.test(trimmed)) {
                  const match = trimmed.match(/^(\d+)\.\s(.*)/);
                  if (match) {
                    htmlParts.push(`<div class="cop-md-li"><span class="cop-md-li-num">${match[1]}.</span> ${match[2].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>`);
                    continue;
                  }
                }
                // Empty line
                if (trimmed === '') {
                  htmlParts.push('<div class="cop-md-spacer"></div>');
                  continue;
                }
                // Regular text with bold
                htmlParts.push(`<p class="cop-md-p">${trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code class="cop-md-code">$1</code>')}</p>`);
              }
              if (inTable) flushTable();
              return htmlParts.join('');
            })()
          }} />
        )}

        {msg.imageUrl && (
          <div className="cop-msg-image">
            <img src={msg.imageUrl} alt="Uploaded" />
          </div>
        )}

        {/* Knowledge Sources */}
        {msg.sources && msg.sources.length > 0 && (
          <div className="cop-sources">
            <div className="cop-sources-label"><BookOpen size={13} /> Sources</div>
            {msg.sources.map((src, i) => (
              <div key={i} className="cop-source-card">
                <FileText size={14} />
                <div className="cop-source-info">
                  <span className="cop-source-doc">{src.doc}</span>
                  <span className="cop-source-detail">{src.section} — {src.page}</span>
                </div>
                <ExternalLink size={12} className="cop-source-link" />
              </div>
            ))}
          </div>
        )}

        {/* Analytics KPI Cards */}
        {msg.kpiCards && msg.kpiCards.length > 0 && (
          <div className="cop-kpi-grid">
            {msg.kpiCards.map((kpi, i) => (
              <div key={i} className={`cop-kpi-card cop-kpi--${kpi.direction}`}>
                <span className="cop-kpi-label">{kpi.label}</span>
                <span className="cop-kpi-value">{kpi.value}</span>
                <span className={`cop-kpi-delta cop-kpi-delta--${kpi.direction}`}>
                  {kpi.direction === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.delta}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Charts */}
        {msg.chartData && msg.chartData.length > 0 && (
          <div className="cop-charts-grid">
            {msg.chartData.map((chart, ci) => {
              const maxVal = Math.max(...chart.values, ...(chart.secondaryValues || []));
              const W = 320;
              const H = 160;
              const pad = { top: 10, right: 12, bottom: 28, left: 8 };
              const cw = W - pad.left - pad.right;
              const ch = H - pad.top - pad.bottom;
              const color = chart.color || '#6366f1';

              return (
                <div key={ci} className="cop-chart-card">
                  <div className="cop-chart-title">{chart.title}</div>
                  <svg viewBox={`0 0 ${W} ${H}`} className="cop-chart-svg">
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((f, gi) => (
                      <line key={gi} x1={pad.left} y1={pad.top + ch * (1 - f)} x2={W - pad.right} y2={pad.top + ch * (1 - f)} stroke="#f1f5f9" strokeWidth="0.5" />
                    ))}

                    {chart.type === 'bar' && chart.values.map((v, i) => {
                      const barW = cw / chart.values.length * 0.6;
                      const gap = cw / chart.values.length;
                      const x = pad.left + gap * i + (gap - barW) / 2;
                      const barH = (v / maxVal) * ch;
                      const y = pad.top + ch - barH;
                      const barColor = v >= maxVal * 0.8 ? color : v >= maxVal * 0.5 ? color + 'bb' : color + '77';
                      return (
                        <g key={i}>
                          <rect x={x} y={y} width={barW} height={barH} rx={2} fill={barColor} />
                          <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize="7" fill="#64748b" fontWeight="600">{v}</text>
                          <text x={x + barW / 2} y={H - 4} textAnchor="middle" fontSize="6.5" fill="#94a3b8">{chart.labels[i]}</text>
                        </g>
                      );
                    })}

                    {chart.type === 'line' && (() => {
                      const points = chart.values.map((v, i) => {
                        const x = pad.left + (cw / (chart.values.length - 1)) * i;
                        const y = pad.top + ch - (v / maxVal) * ch;
                        return { x, y, v };
                      });
                      const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
                      const areaPath = linePath + ` L${points[points.length - 1].x},${pad.top + ch} L${points[0].x},${pad.top + ch} Z`;
                      return (
                        <g>
                          <path d={areaPath} fill={color} opacity="0.08" />
                          <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          {chart.secondaryValues && (() => {
                            const secPoints = chart.secondaryValues.map((v, i) => {
                              const x = pad.left + (cw / (chart.secondaryValues!.length - 1)) * i;
                              const y = pad.top + ch - (v / maxVal) * ch;
                              return { x, y };
                            });
                            const secPath = secPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
                            return (
                              <>
                                <path d={secPath} fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" />
                                <text x={W - pad.right} y={secPoints[secPoints.length - 1].y - 4} textAnchor="end" fontSize="6.5" fill="#94a3b8">{chart.secondaryLabel}</text>
                              </>
                            );
                          })()}
                          {points.map((p, i) => (
                            <g key={i}>
                              <circle cx={p.x} cy={p.y} r="3" fill="#fff" stroke={color} strokeWidth="1.5" />
                              <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="7" fill="#475569" fontWeight="600">{p.v}</text>
                              <text x={p.x} y={H - 4} textAnchor="middle" fontSize="6.5" fill="#94a3b8">{chart.labels[i]}</text>
                            </g>
                          ))}
                        </g>
                      );
                    })()}

                    {chart.type === 'horizontal-bar' && chart.values.map((v, i) => {
                      const rowH = ch / chart.values.length;
                      const barH = rowH * 0.55;
                      const y = pad.top + rowH * i + (rowH - barH) / 2;
                      const barW = (v / maxVal) * (cw * 0.6);
                      const labelX = pad.left;
                      const barX = pad.left + cw * 0.35;
                      const barColor = v >= 85 ? '#10b981' : v >= 70 ? '#f59e0b' : '#ef4444';
                      return (
                        <g key={i}>
                          <text x={labelX} y={y + barH / 2 + 1} dominantBaseline="middle" fontSize="6.5" fill="#475569" fontWeight="500">{chart.labels[i]}</text>
                          <rect x={barX} y={y} width={barW} height={barH} rx={2} fill={barColor} opacity="0.85" />
                          <text x={barX + barW + 4} y={y + barH / 2 + 1} dominantBaseline="middle" fontSize="7" fill="#334155" fontWeight="700">{v}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              );
            })}
          </div>
        )}

        {/* Follow-up Questions */}
        {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
          <div className="cop-followup">
            <div className="cop-followup-label">Follow-up questions</div>
            <div className="cop-followup-list">
              {msg.followUpQuestions.map((q, i) => (
                <button key={i} className="cop-followup-btn" onClick={() => { setInputValue(''); handleSend(q); }}>
                  <MessageSquare size={13} className="cop-followup-icon" />
                  <span>{q}</span>
                  <ChevronRight size={13} className="cop-followup-arrow" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* OOS Alert — ShelfIQ Style */}
        {msg.oosItems && msg.oosItems.length > 0 && (
          <div className="cop-oos-alert">
            <div className="cop-oos-header">
              <div className="cop-oos-badge">
                <span className="cop-oos-pulse" />
                Critical Alert
              </div>
              <span className="cop-oos-count">{msg.oosItems.length} Items Detected</span>
            </div>
            <h3 className="cop-oos-title">Out-of-Stock Detection Complete</h3>
            {msg.oosImage && (
              <div className="cop-oos-image">
                <img src={msg.oosImage} alt="Analyzed shelf" />
                <div className="cop-oos-image-overlay">
                  <Eye size={20} />
                  <span>Analyzed Image</span>
                </div>
              </div>
            )}
            <div className="cop-oos-items">
              {msg.oosItems.map((item, idx) => (
                <div key={idx} className="cop-oos-item">
                  <div className="cop-oos-item-num">{idx + 1}</div>
                  <div className="cop-oos-item-info">
                    <strong>{item.name}</strong>
                    <span>{item.shelf} • {item.position}</span>
                  </div>
                  <span className="cop-oos-item-badge">OOS</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POG Planogram List — Executive WOW Report Style */}
        {msg.pogPlanogramList && msg.pogPlanogramList.length > 0 && (
          <div className="cop-pog-report">
            <div className="cop-pog-report-header">
              <div className="cop-pog-report-badge">
                <ClipboardList size={16} />
                <span>District Planogram Catalog</span>
              </div>
              <span className="cop-pog-report-count">{msg.pogPlanogramList.length} Active Planograms</span>
            </div>
            <div className="cop-pog-report-summary">
              <div className="cop-pog-stat">
                <span className="cop-pog-stat-value">{msg.pogPlanogramList.filter(p => p.status === 'pass').length}</span>
                <span className="cop-pog-stat-label cop-pog-stat--pass">Compliant</span>
              </div>
              <div className="cop-pog-stat">
                <span className="cop-pog-stat-value">{msg.pogPlanogramList.filter(p => p.status === 'warning').length}</span>
                <span className="cop-pog-stat-label cop-pog-stat--warning">Needs Review</span>
              </div>
              <div className="cop-pog-stat">
                <span className="cop-pog-stat-value">{msg.pogPlanogramList.filter(p => p.status === 'fail').length}</span>
                <span className="cop-pog-stat-label cop-pog-stat--fail">Critical</span>
              </div>
              <div className="cop-pog-stat">
                <span className="cop-pog-stat-value">{Math.round(msg.pogPlanogramList.reduce((a, p) => a + p.score, 0) / msg.pogPlanogramList.length)}%</span>
                <span className="cop-pog-stat-label">Avg Score</span>
              </div>
            </div>
            <div className="cop-pog-list">
              {msg.pogPlanogramList.map((pog, idx) => (
                <div
                  key={idx}
                  className={`cop-pog-card cop-pog-card--${pog.status}`}
                  onClick={() => handleSuggestionClick(`Audit ${pog.name.split(' — ')[0]}`)}
                >
                  <div className="cop-pog-card-left">
                    <div className="cop-pog-card-rank">{idx + 1}</div>
                    <div className="cop-pog-card-info">
                      <span className="cop-pog-card-name">{pog.name}</span>
                      <span className="cop-pog-card-store">{pog.store} · Last audit: {pog.lastAudit}</span>
                    </div>
                  </div>
                  <div className="cop-pog-card-right">
                    <div className={`cop-pog-score-ring cop-pog-score--${pog.status}`}>
                      <span>{pog.score}%</span>
                    </div>
                    <span className={`cop-pog-status-badge cop-pog-badge--${pog.status}`}>
                      {pog.status === 'pass' ? 'Compliant' : pog.status === 'warning' ? 'Review' : 'Critical'}
                    </span>
                  </div>
                  <ChevronRight size={14} className="cop-pog-card-arrow" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compliance Audit Report — ShelfIQ Style */}
        {msg.complianceReport && (
          <div className="cop-audit-report">
            {/* Report Header */}
            <div className="cop-audit-header">
              <div className="cop-audit-header-top">
                <div className="cop-audit-badge">
                  <FileText size={16} />
                  <span>Compliance Audit Report</span>
                </div>
                <span className="cop-audit-date">{msg.complianceReport.auditDate}</span>
              </div>
              <h2 className="cop-audit-pog-name">{msg.complianceReport.planogramName}</h2>
              <p className="cop-audit-store">{msg.complianceReport.storeInfo}</p>
            </div>

            {/* Score Card */}
            <div className="cop-audit-score-card">
              <div className="cop-audit-score-main">
                <div className={`cop-audit-score-circle cop-grade-${msg.complianceReport.grade.toLowerCase()}`}>
                  <span className="cop-score-value">{msg.complianceReport.overallScore}</span>
                  <span className="cop-score-max">/100</span>
                </div>
                <div className="cop-audit-grade-info">
                  <span className={`cop-grade-badge cop-grade-${msg.complianceReport.grade.toLowerCase()}`}>
                    Grade {msg.complianceReport.grade}
                  </span>
                  <span className="cop-grade-label">
                    {msg.complianceReport.grade === 'A' ? 'Excellent' :
                     msg.complianceReport.grade === 'B' ? 'Good' :
                     msg.complianceReport.grade === 'C' ? 'Needs Improvement' :
                     msg.complianceReport.grade === 'D' ? 'Poor' : 'Critical'}
                  </span>
                </div>
              </div>
              <div className="cop-audit-score-breakdown">
                {msg.complianceReport.categories.map((cat, idx) => (
                  <div key={idx} className={`cop-category-bar-item cop-cat--${cat.status}`}>
                    <div className="cop-category-bar-info">
                      <span className="cop-category-bar-name">{cat.name}</span>
                      <span className="cop-category-bar-score">{cat.score}/{cat.maxScore}</span>
                    </div>
                    <div className="cop-category-bar">
                      <div className="cop-category-bar-fill" style={{ width: `${(cat.score / cat.maxScore) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Comparison */}
            <div className="cop-audit-comparison">
              <h3 className="cop-audit-section-title">
                <Eye size={16} />
                Visual Comparison
              </h3>
              <div className="cop-audit-comparison-grid">
                <div className="cop-audit-comparison-item">
                  <span className="cop-comparison-label">Reference Planogram</span>
                  <div className="cop-comparison-img-wrap">
                    <img src={msg.complianceReport.comparisonImages.expected} alt="Expected" />
                  </div>
                </div>
                <div className="cop-audit-comparison-arrow">
                  <ChevronRight size={24} />
                </div>
                <div className="cop-audit-comparison-item">
                  <span className="cop-comparison-label">Actual Store Capture</span>
                  <div className="cop-comparison-img-wrap">
                    <img src={msg.complianceReport.comparisonImages.actual} alt="Actual" />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="cop-audit-categories">
              <h3 className="cop-audit-section-title">
                <BarChart3 size={16} />
                Category Breakdown
              </h3>
              <div className="cop-audit-categories-grid">
                {msg.complianceReport.categories.map((cat, idx) => (
                  <div key={idx} className={`cop-audit-cat-card cop-cat--${cat.status}`}>
                    <div className="cop-cat-card-header">
                      <span className="cop-cat-card-name">{cat.name}</span>
                      <span className={`cop-cat-status-badge cop-cat-status--${cat.status}`}>
                        {cat.status === 'pass' ? '✓ Pass' : cat.status === 'warning' ? '⚠ Warning' : '✗ Fail'}
                      </span>
                    </div>
                    <div className="cop-cat-card-score">
                      <span className="cop-cat-score-num">{cat.score}</span>
                      <span className="cop-cat-score-denom">/{cat.maxScore} pts</span>
                    </div>
                    <ul className="cop-cat-findings">
                      {cat.findings.map((f, fIdx) => (
                        <li key={fIdx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Deviations Table */}
            <div className="cop-audit-deviations">
              <h3 className="cop-audit-section-title">
                <AlertCircle size={16} />
                Identified Deviations
              </h3>
              <div className="cop-audit-dev-table">
                <div className="cop-dev-table-header">
                  <span>Item</span>
                  <span>Expected</span>
                  <span>Actual</span>
                  <span>Impact</span>
                </div>
                {msg.complianceReport.deviations.map((dev, idx) => (
                  <div key={idx} className={`cop-dev-row cop-dev--${dev.severity}`}>
                    <div className="cop-dev-item-cell">
                      <span className={`cop-dev-severity cop-dev-sev--${dev.severity}`}>
                        {dev.severity === 'critical' ? <X size={14} /> :
                         dev.severity === 'warning' ? <AlertTriangle size={14} /> :
                         <CheckCircle size={14} />}
                      </span>
                      <span>{dev.item}</span>
                    </div>
                    <div className="cop-dev-cell">{dev.expected}</div>
                    <div className="cop-dev-cell">{dev.actual}</div>
                    <div className="cop-dev-cell">{dev.impact}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="cop-audit-recs">
              <h3 className="cop-audit-section-title">
                <Wrench size={16} />
                Recommended Actions
              </h3>
              <div className="cop-audit-recs-list">
                {msg.complianceReport.recommendations.map((rec, idx) => {
                  const priority = rec.startsWith('IMMEDIATE') ? 'critical' :
                                   rec.startsWith('HIGH') ? 'high' :
                                   rec.startsWith('MEDIUM') ? 'medium' : 'low';
                  return (
                    <div key={idx} className={`cop-audit-rec-item cop-rec--${priority}`}>
                      <span className="cop-rec-num">{idx + 1}</span>
                      <span className="cop-rec-text">{rec}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Action Item Card — Add to Operations Queue */}
        {msg.taskCreated && (
          <div className={`cop-task-card ${taskPushed.has(msg.id) ? 'cop-task-pushed' : ''}`}>
            <div className="cop-task-header">
              <ClipboardList size={15} />
              <span>{taskPushed.has(msg.id) ? 'Added to Operations Queue' : 'Action Item Created'}</span>
              {taskPushed.has(msg.id) && <CheckCircle2 size={14} className="cop-task-check" />}
            </div>
            <div className="cop-task-body">
              <div className="cop-task-row"><span className="cop-task-label">Title</span><span className="cop-task-value">{msg.taskCreated.title}</span></div>
              <div className="cop-task-row"><span className="cop-task-label">Due</span><span className="cop-task-value">{msg.taskCreated.due}</span></div>
              {taskPushed.has(msg.id) && (
                <>
                  <div className="cop-task-row"><span className="cop-task-label">Assigned To</span><span className="cop-task-value">{taskAssignee}</span></div>
                  <div className="cop-task-row"><span className="cop-task-label">Priority</span><span className={`cop-task-priority cop-pri--${taskPriority.toLowerCase()}`}>{taskPriority}</span></div>
                </>
              )}
            </div>

            {/* Add to Operations Queue — inline panel */}
            {!taskPushed.has(msg.id) && (
              <>
                {taskPushOpen === msg.id ? (
                  <div className="cop-task-push-panel">
                    <div className="cop-task-push-field">
                      <label>Assign To</label>
                      <div className="cop-custom-dropdown" onClick={() => setAssigneeDropdownOpen(!assigneeDropdownOpen)}>
                        <div className={`cop-dropdown-trigger ${taskAssignee ? 'has-value' : ''}`}>
                          {taskAssignee ? (
                            <div className="cop-dropdown-selected">
                              <div className="cop-dropdown-avatar">{taskAssignee.split(' ').map(n => n[0]).join('')}</div>
                              <div className="cop-dropdown-selected-info">
                                <span className="cop-dropdown-name">{taskAssignee}</span>
                                <span className="cop-dropdown-role">
                                  {taskAssignee === 'Sarah Chen' ? 'Store Manager' :
                                   taskAssignee === 'John Martinez' ? 'Ops Lead' :
                                   taskAssignee === 'Emily Davis' ? 'Area Supervisor' : 'Floor Manager'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="cop-dropdown-placeholder">Select team member...</span>
                          )}
                          <ChevronDown size={14} className={`cop-dropdown-chevron ${assigneeDropdownOpen ? 'open' : ''}`} />
                        </div>
                        {assigneeDropdownOpen && (
                          <div className="cop-dropdown-menu">
                            {[
                              { name: 'Sarah Chen', role: 'Store Manager', initials: 'SC' },
                              { name: 'John Martinez', role: 'Ops Lead', initials: 'JM' },
                              { name: 'Emily Davis', role: 'Area Supervisor', initials: 'ED' },
                              { name: 'James Wilson', role: 'Floor Manager', initials: 'JW' },
                            ].map(person => (
                              <div
                                key={person.name}
                                className={`cop-dropdown-option ${taskAssignee === person.name ? 'selected' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTaskAssignee(person.name);
                                  setAssigneeDropdownOpen(false);
                                }}
                              >
                                <div className="cop-dropdown-avatar">{person.initials}</div>
                                <div className="cop-dropdown-option-info">
                                  <span className="cop-dropdown-option-name">{person.name}</span>
                                  <span className="cop-dropdown-option-role">{person.role}</span>
                                </div>
                                {taskAssignee === person.name && <CheckCircle size={14} className="cop-dropdown-check" />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="cop-task-push-field">
                      <label>Priority</label>
                      <div className="cop-task-priority-pills">
                        {['Critical', 'High', 'Medium', 'Low'].map(p => (
                          <button
                            key={p}
                            className={`cop-priority-pill cop-pri--${p.toLowerCase()} ${taskPriority === p ? 'active' : ''}`}
                            onClick={() => setTaskPriority(p)}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="cop-task-push-actions">
                      <button
                        className="cop-task-push-confirm"
                        disabled={!taskAssignee || taskPushing === msg.id}
                        onClick={() => {
                          setTaskPushing(msg.id);
                          setAssigneeDropdownOpen(false);
                          setTimeout(() => {
                            setTaskPushed(prev => new Set(prev).add(msg.id));
                            setTaskPushOpen(null);
                            setTaskPushing(null);
                          }, 1200);
                        }}
                      >
                        {taskPushing === msg.id ? (
                          <><div className="cop-btn-spinner" /> Adding...</>
                        ) : (
                          <><Send size={13} /> Add to Operations Queue</>
                        )}
                      </button>
                      {taskPushing !== msg.id && (
                        <button className="cop-task-push-cancel" onClick={() => { setTaskPushOpen(null); setAssigneeDropdownOpen(false); }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button className="cop-task-push-btn" onClick={() => {
                    setTaskPushOpen(msg.id);
                    setTaskAssignee('');
                    setTaskPriority(msg.taskCreated?.priority || 'High');
                    setAssigneeDropdownOpen(false);
                  }}>
                    <Zap size={14} />
                    Add to Operations Queue
                  </button>
                )}
              </>
            )}

            {taskPushed.has(msg.id) && (
              <div className="cop-task-pushed-banner">
                <CheckCircle2 size={14} />
                <span>Added to Operations Queue — assigned to {taskAssignee}</span>
              </div>
            )}
          </div>
        )}

        {/* Suggested Follow-ups — hidden once task is pushed to Operations Queue */}
        {msg.suggestedQueries && msg.suggestedQueries.length > 0 && !(msg.taskCreated && taskPushed.has(msg.id)) && (
          <div className="cop-suggestions-inline">
            {msg.suggestedQueries.map((q, i) => (
              <button key={i} className="cop-suggestion-chip" onClick={() => handleSuggestionClick(q)}>
                {q}
              </button>
            ))}
          </div>
        )}
      </>
    );
  };

  // Build conversation history entries from all skills
  const historyEntries = Object.entries(messages)
    .flatMap(([skill, msgs]) =>
      msgs.filter(m => m.role === 'user').map(m => ({
        skill: skill as SkillMode,
        label: skills.find(s => s.id === skill)!.label,
        icon: skills.find(s => s.id === skill)!.icon,
        query: m.content.length > 50 ? m.content.slice(0, 50) + '…' : m.content,
        time: m.timestamp,
      }))
    )
    .sort((a, b) => b.time.getTime() - a.time.getTime());

  const totalConversations = historyEntries.length;

  return (
    <div className="cop-container">
      {/* Initializing overlay — shown for 2s when navigating from deep-links */}
      {isInitializing && (
        <div className="cop-initializing-overlay">
          <div className="cop-init-content">
            <div className="cop-init-spinner" />
            <h3>AI Copilot</h3>
            <p>
              {initMode === 'pog' ? 'Initializing POG Audit Mode...'
                : initMode === 'actions' ? 'Initializing Action Mode...'
                : initMode === 'knowledge' ? 'Initializing Knowledge Mode...'
                : initMode === 'analytics' ? 'Initializing Analytics Mode...'
                : 'Initializing...'}
            </p>
            <div className="cop-init-steps">
              {(initStepLabels.length > 0 ? initStepLabels : [
                initMode === 'pog' ? 'Loading district planogram catalog' : 'Loading VoC theme context',
                initMode === 'pog' ? 'Connecting to AI Vision engine' : 'Connecting to analytics engine',
                initMode === 'pog' ? 'Preparing compliance audit workspace' : 'Connect to AI Copilot Action Engine',
              ]).map((label, idx) => (
                <div key={idx} className={`cop-init-step ${initStep >= idx + 1 ? 'active' : ''}`}>
                  <span className="cop-init-dot" />
                  <span>{label}</span>
                  {initStep >= idx + 1 && <span className="cop-init-check">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header — Skill pills + actions */}
      <div className="cop-chat-header">
        <div className="cop-chat-header-left">
          <span className="cop-chat-header-icon"><Sparkles size={16} /></span>
          <h3>AI Copilot</h3>
        </div>

        <div className="cop-header-skills">
          {skills.map(s => (
            <button
              key={s.id}
              className={`cop-header-pill ${activeSkill === s.id ? 'cop-header-pill--active' : ''}`}
              onClick={() => setActiveSkill(s.id)}
            >
              {s.icon}
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        <div className="cop-header-actions">
          <button className="cop-clear-btn" onClick={() => setMessages(prev => ({ ...prev, [activeSkill]: [] }))}>
            <RefreshCw size={13} /> Clear
          </button>
        </div>
      </div>

      {/* Messages Area — Full screen */}
      <div className="cop-messages">
        {currentMessages.length === 0 ? (
          <div className="cop-welcome">
            <div className="cop-welcome-top">
              <div className="cop-welcome-logo">
                <Sparkles size={28} />
              </div>
              <h2>Hello, how can I help you today?</h2>
              <p>I'm your <strong>AI Copilot</strong> — I can answer SOP questions, analyze store performance, audit planograms, and create tasks. Select a skill or just start typing.</p>
            </div>

            <div className="cop-welcome-grid">
              {skills.map(skill => (
                <button
                  key={skill.id}
                  className={`cop-welcome-card ${activeSkill === skill.id ? 'cop-welcome-card--active' : ''}`}
                  onClick={() => setActiveSkill(skill.id)}
                >
                  <span className="cop-welcome-card-icon">{skill.icon}</span>
                  <span className="cop-welcome-card-name">{skill.label}</span>
                  <span className="cop-welcome-card-desc">{skill.description}</span>
                </button>
              ))}
            </div>

            <div className="cop-welcome-suggestions">
              <span className="cop-welcome-suggestions-label">Suggested prompts</span>
              <div className="cop-welcome-suggestions-grid">
                {currentSkill.suggestions.map((q, i) => (
                  <button key={i} className="cop-suggestion-btn" onClick={() => handleSuggestionClick(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          currentMessages.map(msg => (
            <div key={msg.id} className={`cop-msg cop-msg--${msg.role}`}>
              <div className="cop-msg-inner">
                <div className="cop-msg-avatar">
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="cop-msg-content">
                  <div className="cop-msg-meta">
                    <span className="cop-msg-sender">{msg.role === 'user' ? 'You' : 'AI Copilot'}</span>
                    <span className="cop-msg-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  {renderMessageContent(msg)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="cop-input-area">
        <div className="cop-input-inner">
          {uploadedImage && (
            <div className="cop-upload-preview">
              <img src={uploadedImage} alt="Upload preview" />
              <button className="cop-upload-remove" onClick={() => setUploadedImage(null)}>
                <X size={14} />
              </button>
            </div>
          )}
          <div className="cop-input-row">
            {activeSkill === 'pog' && (
              <>
                <button className="cop-upload-btn" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={18} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </>
            )}
            <textarea
              ref={inputRef}
              className="cop-input"
              placeholder={currentSkill.placeholder}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className={`cop-send-btn ${(inputValue.trim() || uploadedImage) && !isProcessing ? 'cop-send-btn--active' : ''}`}
              onClick={() => handleSend()}
              disabled={(!inputValue.trim() && !uploadedImage) || isProcessing}
            >
              <Send size={18} />
            </button>
          </div>
          <div className="cop-input-footer">
            AI Copilot uses retrieval-augmented generation. Responses are sourced from your organization's knowledge base.
          </div>
        </div>
      </div>

      {/* Bottom History Drawer */}
      {totalConversations > 0 && (
        <div className={`cop-drawer ${historyOpen ? 'cop-drawer--open' : ''}`}>
          <button className="cop-drawer-toggle" onClick={() => setHistoryOpen(!historyOpen)}>
            <Clock size={14} />
            <span>Recent ({totalConversations})</span>
            {historyOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          {historyOpen && (
            <div className="cop-drawer-body">
              {historyEntries.map((entry, i) => (
                <button
                  key={i}
                  className="cop-drawer-item"
                  onClick={() => { setActiveSkill(entry.skill); setHistoryOpen(false); }}
                >
                  <span className="cop-drawer-item-icon">{entry.icon}</span>
                  <div className="cop-drawer-item-text">
                    <span className="cop-drawer-item-query">{entry.query}</span>
                    <span className="cop-drawer-item-meta">{entry.label} · {entry.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
