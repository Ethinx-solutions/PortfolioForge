# IVCE MONETIZATION BUILD SPECIFICATION
## For Claude Code Implementation

**Document Version:** 1.0  
**Date:** 2025-02-18  
**Author:** ETHINX Systems Architect  
**Target:** Claude Code Agent  

---

## EXECUTIVE SUMMARY

This document provides complete build instructions to transform the existing IVCE-KERNEL.html into a monetizable product with Stripe payment integration. The existing product is COMPLETE and WORKING. This specification covers ONLY the monetization wrapper.

**Existing Asset Location:** `/mnt/project/IVCE-KERNEL.html`  
**Existing Asset Status:** Fully functional content generation tool  
**Goal:** Add landing page, Stripe checkout, and access gating  
**Timeline:** 48 hours to revenue-capable state  

---

## SECTION 1: PROJECT CONTEXT

### 1.1 What Already Exists

The IVCE-KERNEL.html is a complete, standalone HTML application that:
- Generates viral content (hooks, captions, reel scripts, carousel prompts)
- Supports multiple niches (fitness, lifestyle, coaching, beauty, generic)
- Has session history with timestamps
- Includes copy-to-clipboard functionality
- Has keyboard shortcuts (H/C/R/P)
- Downloads session as .txt file
- Uses ETHINX brand colors (gold #f8d57a, dark backgrounds)

**DO NOT MODIFY the core IVCE-KERNEL functionality. Wrap it, don't rewrite it.**

### 1.2 What Needs To Be Built

1. Landing page with pricing and value proposition
2. Stripe Checkout integration (Payment Links approach - simplest)
3. Access gating (password/code system post-purchase)
4. Success page with access delivery
5. Simple admin mechanism to generate access codes

### 1.3 Tech Stack Requirements

- **Frontend:** Static HTML/CSS/JS (no framework required)
- **Payments:** Stripe Payment Links (no backend required for MVP)
- **Hosting:** Vercel, Cloudflare Pages, or Netlify (free tier)
- **Access Control:** Client-side code validation (MVP) OR Supabase (if already configured)

---

## SECTION 2: FILE STRUCTURE

Create the following file structure:

```
/ivce-pro/
├── index.html          # Landing page with pricing
├── checkout.html       # Redirect handler (optional)
├── success.html        # Post-purchase access delivery
├── app.html            # The IVCE tool (gated)
├── css/
│   └── styles.css      # Shared styles
├── js/
│   └── access.js       # Access validation logic
└── assets/
    └── (any images/icons)
```

---

## SECTION 3: LANDING PAGE (index.html)

### 3.1 Purpose
Convert visitors into paying customers. Single page, no navigation complexity.

### 3.2 Required Sections

1. **Hero Section**
   - Headline: "Stop Staring at a Blank Screen. Start Creating Viral Content in Seconds."
   - Subheadline: "Generate scroll-stopping hooks, captions, and reel scripts on demand. Built for creators who are tired of content burnout."
   - Primary CTA button: "Get Instant Access - $29"

2. **Problem Section**
   - Address content burnout
   - "You know you need to post. But the ideas won't come."
   - "You spend hours on one caption that gets 12 likes."

3. **Solution Demo**
   - Show screenshot or GIF of the tool in action
   - "One click. Instant content. Every time."

4. **Features List** (use the existing tool capabilities)
   - Viral hooks that stop the scroll
   - Caption formulas that convert
   - Reel scripts ready to film
   - Carousel prompts that save
   - 5 niches pre-loaded (fitness, lifestyle, coaching, beauty, generic)
   - Session history - never lose an idea
   - Keyboard shortcuts for power users

5. **Pricing Section**
   - Single tier for MVP: $29 one-time (or $19/month if you prefer recurring)
   - "Lifetime access" badge for one-time
   - List what's included
   - CTA button linking to Stripe

6. **FAQ Section**
   - "Is this a subscription?" - No, one-time payment.
   - "What niches are supported?" - List them.
   - "Can I request new niches?" - Yes, email support.
   - "What if it doesn't work for me?" - 7-day refund, no questions.

7. **Footer**
   - Copyright
   - Link to Terms of Service
   - Link to Privacy Policy
   - Contact email

### 3.3 Design Requirements

- Use ETHINX brand colors:
  - Primary accent: #f8d57a (gold)
  - Background: #05070b to #0e1118 (dark gradient)
  - Text: #f5f5f5 (light)
  - Secondary text: #a6b0d4 (muted)
  - Success/signal: #2de38a (green)
  - Borders: #232838
- Mobile responsive
- Fast loading (no heavy frameworks)
- Single page, no navigation

### 3.4 Code Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IVCE Pro - Instant Viral Content Engine</title>
    <meta name="description" content="Generate scroll-stopping hooks, captions, and reel scripts in seconds. Built for creators tired of content burnout.">
    <style>
        :root {
            --bg: #05070b;
            --bg-secondary: #0e1118;
            --accent: #f8d57a;
            --accent-soft: rgba(248, 213, 122, 0.18);
            --signal: #2de38a;
            --border: #232838;
            --text: #f5f5f5;
            --text-soft: #a6b0d4;
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: linear-gradient(180deg, var(--bg) 0%, var(--bg-secondary) 100%);
            color: var(--text);
            line-height: 1.6;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 24px;
        }
        
        /* HERO */
        .hero {
            padding: 80px 0 60px;
            text-align: center;
        }
        
        .hero h1 {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 800;
            color: var(--accent);
            margin-bottom: 20px;
            line-height: 1.2;
        }
        
        .hero .subtitle {
            font-size: 1.25rem;
            color: var(--text-soft);
            max-width: 600px;
            margin: 0 auto 40px;
        }
        
        .cta-button {
            display: inline-block;
            background: var(--accent);
            color: var(--bg);
            padding: 18px 48px;
            font-size: 1.2rem;
            font-weight: 700;
            border-radius: 999px;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(248, 213, 122, 0.3);
        }
        
        /* PROBLEM */
        .problem {
            padding: 60px 0;
            background: var(--bg-secondary);
        }
        
        .problem h2 {
            font-size: 1.8rem;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .problem-list {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .problem-item {
            padding: 16px 0;
            border-bottom: 1px solid var(--border);
            color: var(--text-soft);
            font-size: 1.1rem;
        }
        
        /* FEATURES */
        .features {
            padding: 80px 0;
        }
        
        .features h2 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 50px;
            color: var(--accent);
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
        }
        
        .feature-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 24px;
        }
        
        .feature-card h3 {
            color: var(--accent);
            margin-bottom: 12px;
            font-size: 1.1rem;
        }
        
        .feature-card p {
            color: var(--text-soft);
            font-size: 0.95rem;
        }
        
        /* PRICING */
        .pricing {
            padding: 80px 0;
            text-align: center;
            background: var(--bg-secondary);
        }
        
        .pricing h2 {
            font-size: 2rem;
            margin-bottom: 40px;
        }
        
        .price-card {
            max-width: 400px;
            margin: 0 auto;
            background: linear-gradient(135deg, #0b0d12 0%, #151925 100%);
            border: 2px solid var(--accent);
            border-radius: 20px;
            padding: 40px;
        }
        
        .price-amount {
            font-size: 4rem;
            font-weight: 800;
            color: var(--accent);
        }
        
        .price-period {
            color: var(--text-soft);
            margin-bottom: 30px;
        }
        
        .price-features {
            text-align: left;
            margin: 30px 0;
        }
        
        .price-features li {
            padding: 8px 0;
            color: var(--text);
            list-style: none;
        }
        
        .price-features li::before {
            content: "✓ ";
            color: var(--signal);
            font-weight: bold;
        }
        
        /* FAQ */
        .faq {
            padding: 80px 0;
        }
        
        .faq h2 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 40px;
        }
        
        .faq-item {
            max-width: 700px;
            margin: 0 auto 24px;
            padding: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 12px;
        }
        
        .faq-item h3 {
            color: var(--accent);
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        
        .faq-item p {
            color: var(--text-soft);
        }
        
        /* FOOTER */
        footer {
            padding: 40px 0;
            text-align: center;
            border-top: 1px solid var(--border);
            color: var(--text-soft);
            font-size: 0.9rem;
        }
        
        footer a {
            color: var(--text-soft);
            margin: 0 10px;
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>Stop Staring at a Blank Screen.</h1>
            <p class="subtitle">Generate scroll-stopping hooks, captions, and reel scripts in seconds. Built for creators tired of content burnout.</p>
            <a href="YOUR_STRIPE_PAYMENT_LINK_HERE" class="cta-button">Get Instant Access — $29</a>
        </div>
    </section>
    
    <section class="problem">
        <div class="container">
            <h2>Sound familiar?</h2>
            <div class="problem-list">
                <div class="problem-item">You know you need to post. But the ideas won't come.</div>
                <div class="problem-item">You spend hours on one caption that gets 12 likes.</div>
                <div class="problem-item">You've tried "content batching" but it just feels like more work.</div>
                <div class="problem-item">You watch other creators pump out viral content while you're stuck.</div>
            </div>
        </div>
    </section>
    
    <section class="features">
        <div class="container">
            <h2>What You Get</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <h3>🎯 Viral Hooks</h3>
                    <p>Scroll-stopping opening lines that make people pause and pay attention.</p>
                </div>
                <div class="feature-card">
                    <h3>✍️ Caption Formulas</h3>
                    <p>Proven structures that convert followers into fans (and customers).</p>
                </div>
                <div class="feature-card">
                    <h3>🎬 Reel Scripts</h3>
                    <p>Ready-to-film scripts for short-form video. Just hit record.</p>
                </div>
                <div class="feature-card">
                    <h3>📱 Carousel Prompts</h3>
                    <p>Multi-slide concepts that get saved and shared.</p>
                </div>
                <div class="feature-card">
                    <h3>🎨 5 Niches Built-In</h3>
                    <p>Fitness, Lifestyle, Coaching, Beauty, and Generic templates ready to go.</p>
                </div>
                <div class="feature-card">
                    <h3>⚡ Instant Generation</h3>
                    <p>One click. New content. No waiting, no AI typing animations.</p>
                </div>
            </div>
        </div>
    </section>
    
    <section class="pricing">
        <div class="container">
            <h2>Simple Pricing</h2>
            <div class="price-card">
                <div class="price-amount">$29</div>
                <div class="price-period">One-time payment. Lifetime access.</div>
                <ul class="price-features">
                    <li>All content generators (Hooks, Captions, Reels, Carousels)</li>
                    <li>5 niches included</li>
                    <li>Session history - never lose an idea</li>
                    <li>Download sessions as text files</li>
                    <li>Keyboard shortcuts for power users</li>
                    <li>Future niche updates included</li>
                    <li>7-day money-back guarantee</li>
                </ul>
                <a href="YOUR_STRIPE_PAYMENT_LINK_HERE" class="cta-button">Get IVCE Pro Now</a>
            </div>
        </div>
    </section>
    
    <section class="faq">
        <div class="container">
            <h2>Questions? Answers.</h2>
            <div class="faq-item">
                <h3>Is this a subscription?</h3>
                <p>No. Pay once, use forever. No monthly fees, no hidden costs.</p>
            </div>
            <div class="faq-item">
                <h3>What niches are supported?</h3>
                <p>Fitness, Lifestyle, Coaching, Beauty, and a Generic option that works for any niche. More coming based on customer requests.</p>
            </div>
            <div class="faq-item">
                <h3>Is this AI-generated content?</h3>
                <p>The templates are human-crafted formulas proven to perform on social media. You customize them to your voice and audience.</p>
            </div>
            <div class="faq-item">
                <h3>What if it doesn't work for me?</h3>
                <p>Full refund within 7 days, no questions asked. Email support@yourdomain.com.</p>
            </div>
        </div>
    </section>
    
    <footer>
        <div class="container">
            <p>© 2025 IVCE Pro. All rights reserved.</p>
            <p>
                <a href="/terms.html">Terms of Service</a>
                <a href="/privacy.html">Privacy Policy</a>
                <a href="mailto:support@yourdomain.com">Contact</a>
            </p>
        </div>
    </footer>
</body>
</html>
```

---

## SECTION 4: STRIPE SETUP

### 4.1 Approach: Payment Links (Simplest)

Use Stripe Payment Links - no backend code required.

### 4.2 Setup Steps

1. **Log into Stripe Dashboard** (https://dashboard.stripe.com)

2. **Create Product**
   - Go to Products → Add Product
   - Name: "IVCE Pro - Instant Viral Content Engine"
   - Description: "Lifetime access to the IVCE content generation tool"
   - Image: Upload a screenshot or logo

3. **Create Price**
   - One-time: $29.00 USD
   - (Alternative: Recurring $19/month if preferred)

4. **Create Payment Link**
   - Go to Payment Links → Create
   - Select the IVCE Pro product
   - After payment: Redirect to custom URL
   - Set redirect URL to: `https://yourdomain.com/success.html?session_id={CHECKOUT_SESSION_ID}`
   - Copy the payment link URL

5. **Update Landing Page**
   - Replace `YOUR_STRIPE_PAYMENT_LINK_HERE` with the actual payment link

### 4.3 Stripe Payment Link URL Format

Your payment link will look like:
```
https://buy.stripe.com/xxxxxxxxxxxxxxxx
```

Replace all instances of `YOUR_STRIPE_PAYMENT_LINK_HERE` in index.html with this URL.

---

## SECTION 5: SUCCESS PAGE (success.html)

### 5.1 Purpose

After payment, deliver access to the tool. For MVP, use a simple access code system.

### 5.2 Access Code Strategy (MVP)

For simplest implementation:
1. Generate a list of 100 unique access codes
2. Store them in a simple JSON file or hardcode a master code
3. On success page, display the access code
4. User enters code on app.html to access tool

### 5.3 Code Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to IVCE Pro!</title>
    <style>
        :root {
            --bg: #05070b;
            --accent: #f8d57a;
            --signal: #2de38a;
            --text: #f5f5f5;
            --text-soft: #a6b0d4;
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        
        .success-card {
            max-width: 500px;
            background: linear-gradient(135deg, #0b0d12 0%, #151925 100%);
            border: 2px solid var(--signal);
            border-radius: 20px;
            padding: 50px 40px;
            text-align: center;
        }
        
        .success-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        
        h1 {
            color: var(--signal);
            margin-bottom: 20px;
        }
        
        .message {
            color: var(--text-soft);
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .access-code-box {
            background: var(--bg);
            border: 1px solid var(--accent);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .access-code-label {
            font-size: 0.85rem;
            color: var(--text-soft);
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        
        .access-code {
            font-size: 2rem;
            font-weight: 800;
            color: var(--accent);
            font-family: monospace;
            letter-spacing: 0.2em;
        }
        
        .instructions {
            font-size: 0.9rem;
            color: var(--text-soft);
            margin-bottom: 30px;
        }
        
        .cta-button {
            display: inline-block;
            background: var(--accent);
            color: var(--bg);
            padding: 16px 40px;
            font-size: 1.1rem;
            font-weight: 700;
            border-radius: 999px;
            text-decoration: none;
            transition: transform 0.2s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .save-notice {
            margin-top: 20px;
            font-size: 0.85rem;
            color: var(--text-soft);
        }
    </style>
</head>
<body>
    <div class="success-card">
        <div class="success-icon">🎉</div>
        <h1>You're In!</h1>
        <p class="message">Your payment was successful. Welcome to IVCE Pro - your content creation just got a whole lot easier.</p>
        
        <div class="access-code-box">
            <div class="access-code-label">Your Access Code</div>
            <div class="access-code" id="accessCode">IVCE-PRO-2025</div>
        </div>
        
        <p class="instructions">
            Save this code somewhere safe. You'll need it to access the tool.
            <br>A copy has also been sent to your email.
        </p>
        
        <a href="app.html" class="cta-button">Launch IVCE Pro →</a>
        
        <p class="save-notice">
            Bookmark the app page for quick access anytime.
        </p>
    </div>
    
    <script>
        // For MVP: Use a single master code
        // For production: Generate unique codes per customer via Stripe webhook
        
        // You can customize the code display based on URL params if needed
        // const urlParams = new URLSearchParams(window.location.search);
        // const sessionId = urlParams.get('session_id');
        
        // For now, display the master access code
        // This code should match what's checked in app.html
    </script>
</body>
</html>
```

---

## SECTION 6: GATED APP PAGE (app.html)

### 6.1 Purpose

Wrap the IVCE-KERNEL with an access gate. User must enter valid code to use.

### 6.2 Implementation Approach

1. Show access code input form
2. Validate against stored code(s)
3. If valid, show the IVCE tool
4. Store validation in localStorage for convenience

### 6.3 Code Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IVCE Pro</title>
    <style>
        :root {
            --bg: #05070b;
            --accent: #f8d57a;
            --signal: #2de38a;
            --error: #ff4444;
            --text: #f5f5f5;
            --text-soft: #a6b0d4;
            --border: #232838;
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
        }
        
        /* ACCESS GATE */
        .access-gate {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        
        .access-form {
            max-width: 400px;
            background: linear-gradient(135deg, #0b0d12 0%, #151925 100%);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
        }
        
        .access-form h1 {
            color: var(--accent);
            margin-bottom: 10px;
        }
        
        .access-form p {
            color: var(--text-soft);
            margin-bottom: 30px;
        }
        
        .access-form input {
            width: 100%;
            padding: 16px;
            font-size: 1.2rem;
            text-align: center;
            background: var(--bg);
            border: 2px solid var(--border);
            border-radius: 12px;
            color: var(--text);
            font-family: monospace;
            letter-spacing: 0.1em;
            margin-bottom: 20px;
        }
        
        .access-form input:focus {
            outline: none;
            border-color: var(--accent);
        }
        
        .access-form button {
            width: 100%;
            padding: 16px;
            font-size: 1.1rem;
            font-weight: 700;
            background: var(--accent);
            color: var(--bg);
            border: none;
            border-radius: 999px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .access-form button:hover {
            transform: translateY(-2px);
        }
        
        .error-message {
            color: var(--error);
            margin-top: 15px;
            display: none;
        }
        
        .purchase-link {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid var(--border);
            font-size: 0.9rem;
            color: var(--text-soft);
        }
        
        .purchase-link a {
            color: var(--accent);
        }
        
        /* HIDE TOOL UNTIL VALIDATED */
        .ivce-container {
            display: none;
        }
        
        .ivce-container.active {
            display: block;
        }
        
        /* LOGOUT BUTTON */
        .logout-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 8px 16px;
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-soft);
            border-radius: 999px;
            font-size: 0.85rem;
            cursor: pointer;
            z-index: 1000;
        }
        
        .logout-btn:hover {
            border-color: var(--accent);
            color: var(--accent);
        }
    </style>
</head>
<body>
    <!-- ACCESS GATE -->
    <div class="access-gate" id="accessGate">
        <div class="access-form">
            <h1>🔐 IVCE Pro</h1>
            <p>Enter your access code to continue</p>
            <input type="text" id="codeInput" placeholder="IVCE-XXX-XXXX" autocomplete="off">
            <button onclick="validateAccess()">Unlock</button>
            <p class="error-message" id="errorMsg">Invalid access code. Please try again.</p>
            <div class="purchase-link">
                Don't have a code? <a href="index.html">Get access here</a>
            </div>
        </div>
    </div>
    
    <!-- IVCE TOOL (hidden until validated) -->
    <div class="ivce-container" id="ivceContainer">
        <button class="logout-btn" onclick="logout()">Logout</button>
        
        <!-- 
        =====================================================
        PASTE THE ENTIRE CONTENTS OF IVCE-KERNEL.html HERE
        Starting from <div class="shell"> and including all
        the CSS and JavaScript.
        
        OR use an iframe:
        <iframe src="ivce-kernel.html" style="width:100%;height:100vh;border:none;"></iframe>
        =====================================================
        -->
        
        <!-- IFRAME APPROACH (simpler): -->
        <iframe id="ivceFrame" src="ivce-kernel.html" style="width:100%;height:100vh;border:none;"></iframe>
    </div>
    
    <script>
        // ===========================================
        // ACCESS CODE VALIDATION
        // ===========================================
        
        // VALID ACCESS CODES
        // For MVP: Single master code
        // For production: Fetch from server or use unique codes
        const VALID_CODES = [
            'IVCE-PRO-2025',
            'IVCE-FOUNDER-001',
            'IVCE-BETA-TEST'
            // Add more codes as needed
        ];
        
        // Check if already validated
        function checkExistingAccess() {
            const savedCode = localStorage.getItem('ivce_access_code');
            if (savedCode && VALID_CODES.includes(savedCode.toUpperCase())) {
                showTool();
            }
        }
        
        // Validate entered code
        function validateAccess() {
            const input = document.getElementById('codeInput');
            const code = input.value.trim().toUpperCase();
            const errorMsg = document.getElementById('errorMsg');
            
            if (VALID_CODES.includes(code)) {
                localStorage.setItem('ivce_access_code', code);
                showTool();
            } else {
                errorMsg.style.display = 'block';
                input.style.borderColor = '#ff4444';
            }
        }
        
        // Show the tool
        function showTool() {
            document.getElementById('accessGate').style.display = 'none';
            document.getElementById('ivceContainer').classList.add('active');
        }
        
        // Logout
        function logout() {
            localStorage.removeItem('ivce_access_code');
            location.reload();
        }
        
        // Enter key support
        document.getElementById('codeInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                validateAccess();
            }
        });
        
        // Check on load
        checkExistingAccess();
    </script>
</body>
</html>
```

---

## SECTION 7: IVCE-KERNEL INTEGRATION

### 7.1 Option A: Iframe (Recommended for Speed)

1. Copy IVCE-KERNEL.html to the project folder as `ivce-kernel.html`
2. The app.html template above uses an iframe to load it
3. No modifications needed to IVCE-KERNEL.html

### 7.2 Option B: Direct Embed

1. Copy all CSS from IVCE-KERNEL.html `<style>` tags into app.html
2. Copy all HTML from `<body>` into the ivceContainer div
3. Copy all JavaScript from `<script>` tags into app.html
4. Ensure no ID/class conflicts

**Recommendation: Use Option A (iframe) for fastest implementation.**

---

## SECTION 8: TERMS OF SERVICE (terms.html)

### 8.1 Required Sections

Create a basic Terms of Service page covering:

1. **Service Description**
   - IVCE Pro is a content generation tool
   - Provides templates and formulas, not AI-generated content

2. **Payment Terms**
   - One-time payment of $29 USD
   - Processed via Stripe

3. **Refund Policy**
   - 7-day money-back guarantee
   - Email support@yourdomain.com to request

4. **Usage Rights**
   - User may use generated content commercially
   - User may not resell or redistribute the tool itself

5. **Limitations**
   - Tool provided "as is"
   - No guarantee of specific results

6. **Contact**
   - Email address for support

### 8.2 Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service - IVCE Pro</title>
    <style>
        body {
            font-family: system-ui, sans-serif;
            background: #05070b;
            color: #f5f5f5;
            line-height: 1.8;
            padding: 40px 24px;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 { color: #f8d57a; margin-bottom: 30px; }
        h2 { color: #f8d57a; margin-top: 40px; margin-bottom: 15px; font-size: 1.3rem; }
        p { color: #a6b0d4; margin-bottom: 15px; }
        a { color: #f8d57a; }
    </style>
</head>
<body>
    <h1>Terms of Service</h1>
    <p>Last updated: February 2025</p>
    
    <h2>1. Service Description</h2>
    <p>IVCE Pro ("the Service") is a content generation tool that provides templates, formulas, and prompts for creating social media content. The Service is provided by ETHINX ("we", "us", "our").</p>
    
    <h2>2. Payment</h2>
    <p>Access to IVCE Pro requires a one-time payment of $29 USD, processed securely through Stripe. Upon successful payment, you will receive an access code to use the Service.</p>
    
    <h2>3. Refund Policy</h2>
    <p>We offer a 7-day money-back guarantee. If you are not satisfied with the Service, email support@yourdomain.com within 7 days of purchase for a full refund.</p>
    
    <h2>4. Usage Rights</h2>
    <p>You may use the content generated through IVCE Pro for any commercial or personal purpose. You may not resell, redistribute, or share access to the tool itself.</p>
    
    <h2>5. Limitations</h2>
    <p>The Service is provided "as is" without warranties of any kind. We do not guarantee specific results from using the content generated.</p>
    
    <h2>6. Contact</h2>
    <p>For questions or support, email: <a href="mailto:support@yourdomain.com">support@yourdomain.com</a></p>
    
    <p><a href="index.html">← Back to Home</a></p>
</body>
</html>
```

---

## SECTION 9: PRIVACY POLICY (privacy.html)

### 9.1 Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - IVCE Pro</title>
    <style>
        body {
            font-family: system-ui, sans-serif;
            background: #05070b;
            color: #f5f5f5;
            line-height: 1.8;
            padding: 40px 24px;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 { color: #f8d57a; margin-bottom: 30px; }
        h2 { color: #f8d57a; margin-top: 40px; margin-bottom: 15px; font-size: 1.3rem; }
        p { color: #a6b0d4; margin-bottom: 15px; }
        a { color: #f8d57a; }
        ul { color: #a6b0d4; margin-left: 20px; }
    </style>
</head>
<body>
    <h1>Privacy Policy</h1>
    <p>Last updated: February 2025</p>
    
    <h2>1. Information We Collect</h2>
    <p>When you purchase IVCE Pro, we collect:</p>
    <ul>
        <li>Email address (for delivery of access code and support)</li>
        <li>Payment information (processed by Stripe - we do not store card details)</li>
    </ul>
    
    <h2>2. How We Use Your Information</h2>
    <p>We use your email to:</p>
    <ul>
        <li>Deliver your access code</li>
        <li>Provide customer support</li>
        <li>Send important product updates (rare)</li>
    </ul>
    
    <h2>3. Data Storage</h2>
    <p>Your content generation activity within IVCE Pro is stored locally in your browser. We do not collect, store, or transmit the content you generate.</p>
    
    <h2>4. Third Parties</h2>
    <p>We use Stripe for payment processing. Their privacy policy applies to payment data: <a href="https://stripe.com/privacy" target="_blank">stripe.com/privacy</a></p>
    
    <h2>5. Your Rights</h2>
    <p>You may request deletion of your data at any time by emailing support@yourdomain.com.</p>
    
    <h2>6. Contact</h2>
    <p>For privacy questions, email: <a href="mailto:support@yourdomain.com">support@yourdomain.com</a></p>
    
    <p><a href="index.html">← Back to Home</a></p>
</body>
</html>
```

---

## SECTION 10: DEPLOYMENT INSTRUCTIONS

### 10.1 Option A: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to project folder**
   ```bash
   cd ivce-pro
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow prompts**
   - Link to new project
   - Accept defaults

5. **Get production URL**
   - Vercel provides a URL like: `https://ivce-pro.vercel.app`

6. **Add custom domain** (optional)
   - In Vercel dashboard, go to Settings → Domains
   - Add your domain and update DNS

### 10.2 Option B: Cloudflare Pages

1. **Push to GitHub**
   - Create a repo with your files
   - Push to GitHub

2. **Connect Cloudflare Pages**
   - Log into Cloudflare dashboard
   - Go to Pages → Create a project
   - Connect GitHub repo
   - Select branch to deploy

3. **Deploy**
   - Cloudflare builds and deploys automatically

### 10.3 Option C: Manual Hosting

If you have existing hosting:
1. Upload all files to your web server
2. Ensure index.html is the default page
3. Update all URLs in the code to match your domain

---

## SECTION 11: POST-DEPLOYMENT CHECKLIST

### 11.1 Before Going Live

- [ ] Replace `YOUR_STRIPE_PAYMENT_LINK_HERE` with actual Stripe link
- [ ] Replace `support@yourdomain.com` with actual email
- [ ] Test payment flow in Stripe test mode
- [ ] Verify success page displays correctly
- [ ] Verify access code works on app.html
- [ ] Test on mobile devices
- [ ] Update Stripe redirect URL to production domain

### 11.2 Stripe Production Checklist

- [ ] Switch Stripe from test mode to live mode
- [ ] Create live mode product and price
- [ ] Create new payment link in live mode
- [ ] Update all payment link URLs in code
- [ ] Test with a real $1 payment (refund after)

### 11.3 Marketing Launch

- [ ] Prepare 3-5 tweets announcing the product
- [ ] Prepare LinkedIn post
- [ ] Create "launch offer" (e.g., first 10 customers get 50% off)
- [ ] DM 10 creators who might benefit

---

## SECTION 12: FUTURE ENHANCEMENTS (POST-MVP)

These are NOT required for launch but can be added later:

1. **Unique Access Codes per Customer**
   - Use Stripe webhooks to generate unique codes
   - Store in Supabase database
   - Validate against database instead of hardcoded list

2. **Email Delivery**
   - Use Resend/SendGrid to email access code
   - Include receipt and welcome message

3. **More Niches**
   - Add e-commerce, real estate, B2B, etc.
   - Charge for premium niche packs

4. **Subscription Model**
   - Monthly access with recurring billing
   - Cancel anytime via Stripe portal

5. **Usage Analytics**
   - Track which generators are most popular
   - A/B test different content templates

---

## SECTION 13: SUMMARY

### What Claude Code Needs to Build:

1. **index.html** - Landing page with pricing (template provided)
2. **success.html** - Post-purchase access delivery (template provided)
3. **app.html** - Gated tool wrapper (template provided)
4. **terms.html** - Terms of Service (template provided)
5. **privacy.html** - Privacy Policy (template provided)
6. **ivce-kernel.html** - Copy of existing IVCE-KERNEL.html (no changes)

### Integration Steps:

1. Copy all files to project folder
2. Create Stripe Payment Link
3. Update payment link URLs in code
4. Deploy to Vercel/Cloudflare
5. Test full flow
6. Go live

### Time Estimate:

- File creation: 1-2 hours
- Stripe setup: 30 minutes
- Deployment: 30 minutes
- Testing: 1 hour
- **Total: 3-4 hours**

---

## END OF SPECIFICATION

This document contains everything needed to transform IVCE-KERNEL.html into a revenue-generating product. Execute in order, test thoroughly, and launch.

**Document prepared for:** T-Dog / ETHINX  
**Prepared by:** Claude (Systems Architect)  
**Ready for:** Claude Code execution
