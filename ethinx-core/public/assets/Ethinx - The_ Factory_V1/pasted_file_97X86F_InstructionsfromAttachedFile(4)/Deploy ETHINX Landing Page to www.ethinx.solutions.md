# Deploy ETHINX Landing Page to www.ethinx.solutions

## Overview

You have 3 main deployment options for your custom domain. Each has different DNS records and setup processes.

---

## Option 1: Manus Built-In Hosting (RECOMMENDED)

### Why Manus?
- ✅ One-click publishing
- ✅ Integrated dashboard
- ✅ Automatic SSL/HTTPS
- ✅ Built-in analytics
- ✅ Zero DevOps overhead
- ✅ Custom domain support

### How It Works

1. **Save a Checkpoint** (if not already done)
   - In Manus Management UI
   - Click "Save Checkpoint"
   - Add description: "ETHINX Landing Page - Production"

2. **Publish to Manus**
   - Click "Publish" button in Management UI
   - Choose custom domain option
   - Enter: `www.ethinx.solutions`

3. **Add DNS Records**
   - Manus will provide you with DNS records
   - You'll get either:
     - **CNAME Record** (most common)
     - **A Record** (if needed)

4. **Update Your Domain Registrar**
   - Log into your domain registrar (GoDaddy, Namecheap, etc.)
   - Go to DNS settings
   - Add the records Manus provides
   - Wait for DNS propagation (5-30 minutes)

### DNS Records You'll Receive from Manus

**Typical CNAME Record:**
```
Host: www
Type: CNAME
Value: your-manus-domain.manus.space
TTL: 3600
```

**Or A Record (if applicable):**
```
Host: www
Type: A
Value: [IP address provided by Manus]
TTL: 3600
```

### Steps to Add DNS Records (Example: GoDaddy)

1. Go to GoDaddy.com → Sign in
2. Click "Manage" next to your domain
3. Go to DNS settings
4. Find "CNAME Records" or "A Records" section
5. Click "Add" or "Edit"
6. Enter the record Manus provides
7. Click "Save"
8. Wait for propagation (5-30 minutes)

---

## Option 2: Vercel Deployment

### DNS Records for Vercel

**CNAME Record:**
```
Host: www
Type: CNAME
Value: cname.vercel-dns.com
TTL: 3600
```

**A Record (for root domain):**
```
Host: @ (or leave blank)
Type: A
Value: 76.76.19.165
TTL: 3600
```

### Steps

1. Push code to GitHub
2. Connect to Vercel
3. Go to Vercel Settings → Domains
4. Add `www.ethinx.solutions`
5. Vercel will show you the DNS records to add
6. Add records to your domain registrar
7. Verify domain in Vercel

---

## Option 3: Netlify Deployment

### DNS Records for Netlify

**CNAME Record:**
```
Host: www
Type: CNAME
Value: [netlify-domain].netlify.app
TTL: 3600
```

### Steps

1. Push code to GitHub
2. Connect to Netlify
3. Go to Netlify Settings → Domain management
4. Add `www.ethinx.solutions`
5. Netlify will show DNS records
6. Add records to your domain registrar
7. Verify domain

---

## RECOMMENDED: Manus Deployment

### Why Manus is Best for You

1. **Integrated** — Everything in one dashboard
2. **No GitHub Required** — Direct deployment
3. **Custom Domains** — Built-in support
4. **Analytics** — Track visitors and conversions
5. **One-Click** — Publish instantly
6. **Support** — Manus team handles infrastructure

### Complete Manus Deployment Steps

#### Step 1: Save Checkpoint (if not done)
```
1. Go to Manus Management UI
2. Click "Save Checkpoint"
3. Description: "ETHINX Landing Page - Production Ready"
4. Click "Save"
```

#### Step 2: Publish to Custom Domain
```
1. Click "Publish" button (top right)
2. Select "Custom Domain"
3. Enter: www.ethinx.solutions
4. Click "Continue"
5. Manus will show you DNS records
```

#### Step 3: Copy DNS Records
Manus will provide you with:
- **Host name** (usually "www")
- **Record type** (CNAME or A)
- **Record value** (Manus domain or IP)
- **TTL** (usually 3600)

#### Step 4: Add Records to Your Domain Registrar

**Example: GoDaddy**
1. Go to GoDaddy.com
2. Sign in to your account
3. Click "Manage" next to `ethinx.solutions`
4. Click "DNS" tab
5. Find "CNAME Records" section
6. Click "Add" or "Edit"
7. Enter:
   - **Host:** www
   - **Points to:** [value from Manus]
   - **TTL:** 3600
8. Click "Save"

**Example: Namecheap**
1. Go to Namecheap.com
2. Sign in to your account
3. Click "Manage" next to `ethinx.solutions`
4. Click "Advanced DNS" tab
5. Find "CNAME Record" section
6. Click "Add New Record"
7. Enter:
   - **Type:** CNAME Record
   - **Host:** www
   - **Value:** [value from Manus]
   - **TTL:** 3600
8. Click "Save"

**Example: Cloudflare**
1. Go to Cloudflare.com
2. Sign in to your account
3. Select `ethinx.solutions` domain
4. Click "DNS" tab
5. Click "Add Record"
6. Enter:
   - **Type:** CNAME
   - **Name:** www
   - **Content:** [value from Manus]
   - **TTL:** Auto
7. Click "Save"

#### Step 5: Verify DNS Propagation
```
1. Wait 5-30 minutes for DNS to propagate
2. Visit www.ethinx.solutions in your browser
3. You should see your landing page
4. Check that SSL/HTTPS is working (green lock)
```

#### Step 6: Monitor in Manus
```
1. Go to Manus Management UI → Dashboard
2. View analytics and traffic
3. Monitor conversions
4. Check performance metrics
```

---

## DNS Record Types Explained

### CNAME Record
- **What it does:** Points your domain to another domain
- **Best for:** Most hosting platforms (Manus, Vercel, Netlify)
- **Example:** `www.ethinx.solutions` → `manus-domain.manus.space`
- **Pros:** Easy to set up, works with most platforms
- **Cons:** Can't use for root domain (@)

### A Record
- **What it does:** Points your domain to an IP address
- **Best for:** Direct server hosting
- **Example:** `www.ethinx.solutions` → `76.76.19.165`
- **Pros:** Works for root domain
- **Cons:** Requires IP address

---

## Troubleshooting

### Domain Not Resolving?
1. Check DNS records were added correctly
2. Wait 24 hours for full propagation
3. Use `nslookup` or `dig` to verify:
   ```bash
   nslookup www.ethinx.solutions
   dig www.ethinx.solutions
   ```

### SSL/HTTPS Not Working?
1. Wait 15-30 minutes for SSL certificate to generate
2. Clear browser cache
3. Try incognito/private window
4. Contact support if still not working

### Slow Loading?
1. Check DNS propagation
2. Clear CDN cache
3. Check server status
4. Monitor performance in dashboard

---

## Next Steps

**To deploy your site:**

1. **Choose deployment option** (Manus recommended)
2. **Save checkpoint** in Manus
3. **Click Publish** and select custom domain
4. **Copy DNS records** Manus provides
5. **Add records** to your domain registrar
6. **Wait for propagation** (5-30 minutes)
7. **Visit www.ethinx.solutions** to verify
8. **Monitor analytics** in Manus dashboard

---

## Questions?

If you need help:
- **Manus Support:** https://help.manus.im
- **Domain Registrar Support:** Contact your registrar's support team
- **DNS Help:** Use online DNS checker tools

---

**Ready to deploy? Let me know which option you choose and I'll provide the exact DNS records you need to add!**
