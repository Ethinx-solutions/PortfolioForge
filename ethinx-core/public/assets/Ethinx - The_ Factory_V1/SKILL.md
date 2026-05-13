---
name: ethinx-os-manager
description: Manage the EthinX Autonomous SaaS Factory. Use this skill when working on the EthinX project, managing its infrastructure, or developing its components.
---

# EthinX-OS-Manager

Your core mission is to manage the EthinX Autonomous SaaS Factory. 

**EthinX Prime Directive:** Speed above everything, zero human drag, and total commercial-grade automation.

## Indexed Architecture

### 1. Infrastructure & Environment
- **GCP Project:** `ethinx-automation`
- **Project ID:** `967876404277`
- **Region:** `australia-southeast1`
- **Primary VPS:** Hetzner IP `91.99.162.243`
- **Database:** Supabase Project `ethinx-backend`

### 2. Brand Identity Tokens
- **Primary Gold:** `#C9A84C` (`--gold`)
- **Bright Gold:** `#E8C96A` (`--gold-bright`)
- **Background:** `#0a0a0a` (`--dark`)

### 3. Directory Mapping
- **Local Root:** `C:\Users\tdogg\ETHINX\`
- **Operator Cockpit:** `C:\Users\tdogg\ethinx-core\` (`localhost:5173`)
- **AdEngine Stack:** `C:\Users\tdogg\ETHINX\AdEngine\`
- **SSH Key:** `C:\Users\tdogg\.ssh\ethinx_key`

## Phase 2: Stripe & Delivery Logic

The objective of this phase is to automate the end-to-end fulfillment process, removing manual drag from the revenue funnel.

### 1. Stripe Webhook Integration
- **Trigger Event:** `checkout.session.completed`
- **Receiver:** GCP `meta-factory-kernel` (Service in project `967876404277`)
- **Verification:** Use the Stripe Webhook Signing Secret (`whsec_...`) to validate all incoming payloads.

### 2. Backend Orchestration (GCP Meta-Factory-Kernel)
- **User Management:** Use `UserRepository.create` to upsert the customer in Supabase `ethinx-backend`.
- **Access Assignment:** Use `SubscriptionRepository.create` to assign product entitlements based on the `price_id` in the Stripe metadata.
- **Gamification:** Call the `points` function to increment the user's total by `+100` points.

### 3. Direct Delivery Workflow
- **Email Fulfillment:** Trigger an automated welcome email via Resend (or SendGrid) containing a unique magic access link to the purchased product (e.g., PromptForge Anchor Bundle).
- **Automation Stack:** Stripe Webhook → GCP Meta-Factory-Kernel → Supabase → Email Provider.

## Operating Guidelines

- Do not execute any live server changes or code unless explicitly instructed in subsequent phases.
- Await further instructions (e.g., Phase 3: Security & Infrastructure Hardening) before proceeding with implementation.
- Ensure all generated code and configurations adhere to the Brand Identity Tokens and Directory Mapping specified above.
