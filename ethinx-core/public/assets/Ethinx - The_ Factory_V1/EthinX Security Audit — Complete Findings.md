## Credential Exposure Assessment

The Trojan:JS/ChatGPTStealer.GVA!MTB is designed to exfiltrate browser cookies and API tokens from AI-centric workflows. Because the following credentials were handled in the infected browser session, they must all be treated as **BURNED** and rotated immediately. The table below catalogs every credential that was exposed during the compromised session, along with its current storage location and the required rotation action.

### Compromised Credentials Catalog

| # | Credential | Type | Exposure Vector | Storage Location | Risk Level | Rotation Action |
|---|---|---|---|---|---|---|
| 1 | **Cloudflare API Token** (`cfat_6l8JZ...`) | API Token | Handled in infected browser session | Manus chat context | **CRITICAL** | Revoke immediately via Cloudflare dashboard, generate new token |
| 2 | **Supabase Service Role Key** (`eyJhbGci...`) | JWT Service Key | Handled in infected browser session | Manus chat context | **CRITICAL** | Regenerate via Supabase dashboard (Settings > API) |
| 3 | **Stripe Webhook Secret** (`whsec_7s6B...`) | Webhook Signing Secret | Handled in infected browser, stored on Hetzner | `/var/www/empire-os-relay/secrets.json` | **CRITICAL** | Rotate in Stripe Dashboard, update Hetzner relay |
| 4 | **Hetzner SSH Password** (`tdogga141`) | Root Password | Handled in infected browser session | Manus chat context | **CRITICAL** | Change immediately via `passwd` or Hetzner Console |
| 5 | **Dashboard Webhook HMAC Secret** (`0af348ea...`) | HMAC Signing Key | Stored on Hetzner relay | `/var/www/empire-os-relay/secrets.json` | **HIGH** | Regenerate and update both relay and dashboard |
| 6 | **GCP Service Account Key** (project: ethinx) | Private Key (RSA) | Stored on Hetzner with **world-readable** 644 permissions | `/root/gcp-key.json` | **CRITICAL** | Revoke key in GCP Console, generate new key, set 600 permissions |
| 7 | **Supabase URL** (`kgaceqsoinqyfpebewjo.supabase.co`) | Database Endpoint | Handled in infected browser session | Manus chat context | **MEDIUM** | URL itself is not secret, but combined with service key = full DB access |

### Additional Exposure Vectors

The **PM2 dump file** (`/root/.pm2/dump.pm2`) contains serialized process configurations that may include environment variables from when services were first started. While the relay loads secrets from the external `secrets.json` file (good practice), the dump file should be regenerated after credential rotation.

The **GCP service account key** at `/root/gcp-key.json` has **incorrect file permissions** (644 = world-readable). This is a standalone vulnerability independent of the Trojan — any process on the server can read this private key. It must be immediately restricted to 600 (root-only).

### Firewall Exposure Analysis

The UFW firewall is active but has **overly permissive rules**. The following ports are open to the entire internet when they should be restricted:

| Port | Service | Should Be Public? | Recommendation |
|---|---|---|---|
| 22/tcp | SSH | Yes, but restrict | Limit to TDog's IP range (120.20.0.0/16) + Manus sandbox IPs |
| 80/tcp | Nginx HTTP | Yes | Keep (redirects to HTTPS) |
| 443/tcp | Nginx HTTPS | Yes | Keep (primary entry point) |
| 3000/tcp | Unused? | **No** | Remove rule |
| 3001/tcp | ethinx-billing | **No** | Remove — should only be accessed via Nginx |
| 3002/tcp | empire-os-relay | **No** | Remove — should only be accessed via Nginx |
| 3005/tcp | vega-bridge | **No** | Remove — should only be accessed via Nginx |
| 3021/tcp | content-spark | **No** | Remove — should only be accessed via Nginx |
| 5005/tcp | Unknown | **No** | Remove rule |
| 8001/tcp | Unknown | **No** | Remove rule |
| 8080/tcp | Unknown | **No** | Remove rule |
| 11434 | Ollama (Docker) | **No** | Restrict to localhost only |

**Key Finding:** Ports 3001, 3002, 3005, 3021, and 11434 are all accessible directly from the internet, bypassing Nginx's SSL and any authentication layers. This means an attacker with the stolen credentials could directly access these services without going through the reverse proxy.
