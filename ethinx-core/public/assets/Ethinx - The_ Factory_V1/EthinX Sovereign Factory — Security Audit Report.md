| Port | Service | Purpose |
|---|---|---|
| 22/tcp | SSH | Remote administration (key-only, fail2ban protected) |
| 80/tcp | Nginx | HTTP redirect to HTTPS |
| 443/tcp | Nginx | HTTPS reverse proxy (all services accessed through here) |

---

## 8. Recommended Follow-Up Actions

Beyond the immediate credential rotation, the following measures are recommended for ongoing security posture:

1. **Install rkhunter** for rootkit detection: `apt-get install rkhunter && rkhunter --check`
2. **Enable automatic security updates**: `apt-get install unattended-upgrades && dpkg-reconfigure -plow unattended-upgrades`
3. **Set up SSH key for Manus sandbox** so future automation does not require password transmission
4. **Consider a non-root user** for daily operations with sudo privileges, keeping root for emergencies only
5. **Audit the Ollama Docker binding** — it is currently exposed on `0.0.0.0:11434` (all interfaces). Bind it to `127.0.0.1:11434` to prevent external access to the LLM engine
6. **Enable Supabase Row Level Security (RLS)** on all tables to limit damage if the service key is ever compromised again
7. **Never paste credentials into browser-based AI chat interfaces** — use a dedicated secrets manager or environment variables instead
8. **Run a full malware scan** on the local workstation using Malwarebytes or similar, beyond what Defender has already caught. The Trojan may have remnant artifacts.

---

## 9. Deployment Resumption Criteria

Cromenix and Vegas territory deployment is **PAUSED** until the following conditions are met:

| # | Condition | Verified By |
|---|---|---|
| 1 | All 6 credentials in Section 6 have been rotated | TDog confirms |
| 2 | Firewall hardening commands from Section 7 have been executed | `ufw status verbose` shows only ports 22, 80, 443 |
| 3 | Local workstation has passed a full malware scan (clean bill of health) | Defender + secondary scanner |
| 4 | GCP key file permissions fixed to 600 | `ls -la /root/gcp-key.json` shows `-rw-------` |
| 5 | New credentials are stored securely (not in browser-based chat) | TDog confirms |

Once all five conditions are satisfied, deployment of Cromenix and Vegas can resume with the new sanitized credentials.

---

**End of Report**

> *"Speed is the standard, but commercial-grade security is the foundation. We do not build an empire on compromised soil."*
> — EthinX Prime Directive
