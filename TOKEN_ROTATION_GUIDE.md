# IBM Quantum Token Rotation Guide

**© 2025 AI4U, LLC. All Rights Reserved.**  
**AI4Utech.com | Lee Hanna, Owner**  
**Project Chimera™**

---

## 🔐 Overview

IBM Quantum API tokens must be rotated regularly for security. This guide explains the automated system and manual steps.

---

## ⏰ Rotation Schedule

### Quarterly (Every 3 Months)
- **January 1** - Q1 rotation
- **April 1** - Q2 rotation
- **July 1** - Q3 rotation
- **October 1** - Q4 rotation

### On-Demand
- If token is exposed in logs/docs
- If token is compromised
- If IBM Quantum notifies you
- If weekly health check fails

---

## 🤖 Automated Systems

### 1. Quarterly Reminder (GitHub Actions)

**Workflow:** `.github/workflows/quarterly-token-reminder.yml`

**What it does:**
- Runs automatically on Jan 1, Apr 1, Jul 1, Oct 1 at 09:00 AM Chicago time
- Opens a GitHub Issue with rotation checklist
- You receive email notification (if enabled)

**Manual trigger:**
```bash
# Go to GitHub → Actions → "Quarterly IBM Token Reminder" → Run workflow
```

### 2. Weekly Health Check (GitHub Actions)

**Workflow:** `.github/workflows/ibm-token-watch.yml`

**What it does:**
- Runs every Monday at 06:00 UTC
- Validates token by pinging IBM Quantum API
- If token fails: opens GitHub Issue automatically
- If token works: passes silently

**Manual trigger:**
```bash
# Go to GitHub → Actions → "IBM Token Watch (Weekly)" → Run workflow
```

### 3. One-Command Rotation Script

**Script:** `ops/rotate_ibm_token.sh`

**What it does:**
- Prompts for new token (secure input, not echoed)
- Updates GitHub Actions secret `IBM_QUANTUM_TOKEN`
- Updates Vercel environment variable (production & preview)
- Sets rotation timestamp in GitHub variable
- Provides confirmation and next steps

---

## 📝 Rotation Procedure (5 Minutes)

### Step 1: Generate New Token

1. Go to https://quantum.cloud.ibm.com/account
2. Click **"API Token"** in the left sidebar
3. Click **"Generate new token"** button
4. **Copy the token** (you'll only see it once!)
5. Save it temporarily in a secure location (password manager, not a file)

### Step 2: Run Rotation Script

```bash
cd /home/ubuntu/chimera-web
./ops/rotate_ibm_token.sh
```

**What happens:**
- Script prompts: `Paste NEW IBM_QUANTUM_TOKEN:`
- Paste your token (won't be visible)
- Press Enter
- Script updates GitHub & Vercel automatically
- You'll see: `✅ Done. Rotated at 2025-01-15T14:30:00Z`

### Step 3: Revoke Old Token

1. Go back to https://quantum.cloud.ibm.com/account
2. Find the **old token** in the list
3. Click **"Revoke"** next to it
4. Confirm revocation

### Step 4: Verify (Optional)

Test the new token locally:

```bash
cd /home/ubuntu/chimera-web
export IBM_QUANTUM_TOKEN="your-new-token"
python3 ops/verify_ibm_token.py
```

Expected output:
```json
{"ok": true, "checked_at": "2025-01-15T14:35:00Z"}
```

### Step 5: Close GitHub Issue

If rotation was triggered by a reminder issue:
1. Go to GitHub Issues
2. Find the "Rotate IBM_QUANTUM_TOKEN" issue
3. Add a comment: "✅ Rotated successfully on [date]"
4. Close the issue

---

## 🚨 Emergency Rotation

If you suspect the token is compromised:

1. **Immediately generate a new token** (Step 1 above)
2. **Run rotation script** (Step 2 above)
3. **Revoke old token** (Step 3 above)
4. **Check logs** for unauthorized usage in IBM Quantum dashboard
5. **Review recent commits** for accidental token exposure
6. **Notify team** if applicable

**Do not wait for the quarterly reminder.**

---

## 🔍 Troubleshooting

### Error: "gh: command not found"

**Solution:** Install GitHub CLI
```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Or download from: https://cli.github.com
```

### Error: "vercel: command not found"

**Solution:** Install Vercel CLI
```bash
npm install -g vercel
```

### Error: "gh secret set: not authorized"

**Solution:** Authenticate GitHub CLI
```bash
gh auth login
# Follow prompts, select repo scope
```

### Error: "vercel env add: not linked"

**Solution:** Link to Vercel project
```bash
cd /home/ubuntu/chimera-web
vercel link --project project-chimera
```

### Error: "qiskit-ibm-runtime not found" (verify script)

**Solution:** Install Qiskit
```bash
pip3 install qiskit-ibm-runtime==0.25.0
```

### Weekly Health Check Fails

**Possible causes:**
- Token expired or revoked
- IBM Quantum API is down
- Network connectivity issue
- Token not set in GitHub secrets

**Solution:**
1. Check IBM Quantum dashboard: https://quantum.cloud.ibm.com
2. Verify token in GitHub → Settings → Secrets
3. Run rotation script to refresh token
4. Manually trigger health check workflow to verify fix

---

## 📊 Rotation History

Track your rotations:

| Date | Rotated By | Reason | Notes |
|------|------------|--------|-------|
| 2025-01-15 | Lee Hanna | Initial setup | First token |
| 2025-04-01 | Lee Hanna | Quarterly | Automated reminder |
| 2025-07-01 | Lee Hanna | Quarterly | Automated reminder |
| 2025-10-01 | Lee Hanna | Quarterly | Automated reminder |

(GitHub variable `IBM_TOKEN_ROTATED_AT` tracks timestamp automatically)

---

## 🛡️ Security Best Practices

### DO:
✅ Rotate quarterly (minimum)  
✅ Use the rotation script (keeps GitHub & Vercel in sync)  
✅ Revoke old tokens immediately  
✅ Store tokens in password manager  
✅ Monitor weekly health check results  
✅ Rotate immediately if exposed  

### DON'T:
❌ Commit tokens to git  
❌ Share tokens in Slack/email  
❌ Reuse old tokens  
❌ Skip quarterly rotations  
❌ Ignore health check failures  
❌ Store tokens in plain text files  

---

## 📚 Related Documentation

- **Deployment Guide:** `/DEPLOYMENT_GUIDE.md`
- **IBM Quantum Docs:** https://quantum.cloud.ibm.com/docs
- **GitHub Secrets:** https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Vercel Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables

---

## 🆘 Support

**Issues with rotation:**
- Check this guide's troubleshooting section
- Review GitHub Actions logs
- Contact: contact@ai4utech.com

**IBM Quantum issues:**
- IBM Support: https://quantum.cloud.ibm.com/support
- Check service status: https://quantum.cloud.ibm.com/status

---

## ✅ Quick Reference

**Rotation command:**
```bash
./ops/rotate_ibm_token.sh
```

**Verify token:**
```bash
python3 ops/verify_ibm_token.py
```

**Manual workflow trigger:**
- GitHub → Actions → Select workflow → Run workflow

**Token location:**
- IBM Dashboard: https://quantum.cloud.ibm.com/account
- GitHub Secrets: Repo → Settings → Secrets and variables → Actions
- Vercel: Project → Settings → Environment Variables

---

**© 2025 AI4U, LLC. All Rights Reserved.**  
**AI4Utech.com | Lee Hanna, Owner**  
**Project Chimera™**

