# El Mouloukia BC - Quick Reference Card

## Project At A Glance

| Item | Value |
|------|-------|
| **Project Name** | El Mouloukia Business Centre |
| **Live URL** | https://el-mouloukia-bc-39f12.web.app/ |
| **Tech Stack** | React 19 + Vite + Firebase + Tailwind CSS |
| **Status** | ✅ Production Live (awaiting Firebase Auth config) |
| **Last Updated** | April 27, 2026 |

---

## What Gets Built Here?

🎯 **Purpose:** Expert directory connecting Constantine's consultants with businesses seeking solutions.

🔧 **Features:**
- Browse experts by 8 expertise domains
- Search experts by name/problem
- Register as new expert (pending admin verification)
- Admin panel to approve expert listings
- Direct WhatsApp/phone contact with experts
- Real-time Firestore sync

---

## Critical Issues Fixed Today

| # | Issue | Status | Fix |
|----|-------|--------|-----|
| 1 | Black screen on deploy | ✅ FIXED | Added firebase/lucide-react to dependencies |
| 2 | Unstyled (black/white) | ✅ FIXED | Configured Tailwind CSS + PostCSS |
| 3 | Stale browser cache | ✅ FIXED | Hardened firebase.json cache headers |
| 4 | IT & Digital label clipped | ✅ FIXED | Changed flex-wrap, added shrink-0 |
| 5 | No domain visibility | ✅ FIXED | Added Expertise Domains grid panel |

---

## Stack Diagram

```
User Browser
    ↓
Firebase Hosting CDN
    ↓
[index.html] → React App Entry
    ↓
[React 19 Components]
    ↓
[Tailwind CSS Styling]
    ↓
[Firebase Auth] ← Anonymous SignIn
    ↓
[Firestore] ← Real-time Expert Data
    ↓
[Lucide Icons] ← Category Icons
    ↓
Rendered UI
```

---

## File Structure

```
src/App.jsx          ← Main component (all logic here)
src/main.jsx         ← React DOM root
src/index.css        ← Tailwind @directives
tailwind.config.js   ← Scan ./src/**/*.jsx for classes
postcss.config.js    ← CSS transformation pipeline
firebase.json        ← Hosting cache headers + SPA rewrites
vite.config.js       ← Build settings (default, unchanged)
index.html           ← HTML shell with #root div
```

---

## Key Commands

```bash
npm run dev                                    # Local dev (localhost:5173)
npm run build                                  # Production build
npm run build && npx firebase deploy --only hosting   # Build + Deploy
npm run lint                                   # ESLint check
npm run preview                                # Preview build locally
```

---

## Expertise Domains (All 8)

| ID | Domain | Icon | Color |
|----|--------|------|-------|
| agri | Agriculture | 🌱 Sprout | Emerald |
| const | Construction | 🏗️ Building | Orange |
| manuf | Manufacturing | 🏭 Factory | Stone |
| admin | Administrative | 🏢 Building2 | Sky |
| it | IT & Digital | 💻 Cpu | Teal |
| biz | Business & Finance | 💼 Briefcase | Amber |
| log | Logistics | 🚚 Truck | Slate |
| vault | The Vault | ❓ HelpCircle | Rose |

---

## Data Model (Firestore)

```
artifacts/
  el-mouloukia-bc/
    public/
      data/
        experts/
          [expertId]: {
            name: string
            sector: 'agri'|'const'|'manuf'|'admin'|'it'|'biz'|'log'|'vault'
            phone: string (WhatsApp-enabled)
            bio: string
            bottleneck: string (case study)
            status: 'active'|'pending'
            createdAt: timestamp
            userId: string
          }
```

---

## Firebase Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Project ID | el-mouloukia-bc-39f12 | Unique identifier |
| Auth | Anonymous (NEEDS ENABLING) | Allow users without account |
| Database | Firestore | NoSQL data store |
| Hosting | Firebase Hosting | CDN + SSL |
| Cache (HTML) | no-cache, no-store, must-revalidate | Always fetch latest |
| Cache (Assets) | max-age=31536000, immutable | Cache 1 year |

---

## Blocking Issue 🔴

**Anonymous Auth Not Enabled**

```
Error: auth/configuration-not-found
Impact: Expert data won't load, all counts = 0
Fix: Firebase Console → Authentication → Enable Anonymous
Time: 1 minute
```

---

## Build Output

```
0.46 KB  index.html (HTML shell)
23.08 KB index-[hash].css (Tailwind rules)
557.75 KB index-[hash].js (React + Firebase bundle)
─────────────────────────────────
Total: 581 KB uncompressed, 177 KB gzipped
```

---

## Component Hierarchy

```
App (Main component, 860+ lines)
├── Nav (Navigation bar + logo)
├── Hero Section (Search bar + tagline)
├── Category Filter Strip
│   ├── All Expertise button
│   └── 8 Category buttons
├── Expertise Domains Panel (when filter='all')
│   └── 8 Domain grid items (clickable)
├── Expert Cards Grid
│   ├── Expert Card
│   │   ├── Category badge + icon
│   │   ├── Expert name
│   │   ├── Case study quote
│   │   ├── WhatsApp button (link)
│   │   ├── Phone button (tel link)
│   │   └── [Admin] Verify button
│   └── Empty state (if no matches)
├── Register Form (conditional view)
│   ├── Name input
│   ├── Sector select
│   ├── Phone input
│   ├── Bio textarea
│   ├── Bottleneck textarea
│   └── Submit button
├── Admin Login (conditional view)
│   ├── Password input
│   └── Authorize button
└── Footer (branding)
```

---

## State Tree (React)

**UI State:**
```
view: 'directory' | 'register' | 'admin'
filter: 'all' | 'agri' | 'const' | ... (category ID)
search: string (free-text)
isMenuOpen: boolean
```

**Auth State:**
```
user: null | { uid, email, ... }
isAdminAuthenticated: boolean (password verified)
adminKey: string
```

**Data State:**
```
experts: [{ id, name, sector, phone, bio, bottleneck, status, createdAt, userId }, ...]
```

**Computed State (Memoized):**
```
visibleExperts: filtered by status + admin view
categoriesWithCounts: categories with [count] from visibleExperts
filteredExperts: filtered by category + search + status
```

---

## Performance Optimizations

✅ Done:
- Memoized category counting (prevents recalc on every render)
- Memoized category map (O(1) category lookups)
- Firestore real-time listener (sync only changed records)

🔄 Should Add:
- Code splitting by route (register/admin forms lazy-loaded)
- Firestore offline persistence
- Pagination for large expert lists
- Service Worker for offline support

---

## Known Bugs & Workarounds

| Bug | Workaround | Status |
|-----|-----------|--------|
| Old bundle cached in browser | Hard refresh (Ctrl+F5) | By design, see firebase.json cache strategy |
| Expert counts all 0 | Enable Firebase Anonymous Auth | Needs backend config |
| Admin password hardcoded | Use password: constantine-2026 | TODO: move to env var |

---

## Deployment Checklist

Before deploying code changes:

- [ ] `npm run build` completes without errors
- [ ] `npm run preview` loads correctly
- [ ] Tested in multiple browsers
- [ ] No console errors/warnings
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] All Tailwind classes applied (no plain text)
- [ ] Firebase auth still works (if modified auth code)
- [ ] Ready to commit + push

Deploy:
```bash
npm run build && npx firebase deploy --only hosting
# Wait ~30 seconds for deployment
# Verify at: https://el-mouloukia-bc-39f12.web.app/
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module 'firebase'` | Missing package | `npm install firebase` |
| `Tailwind classes not applied` | Missing config | Check tailwind.config.js + postcss.config.js |
| Black screen on deploy | Stale cache | Hard refresh (Ctrl+F5) or use incognito |
| Experts count 0 | Auth not enabled | Enable Anonymous in Firebase Console |
| Build fails: "tailwindcss not found" | Dev deps not installed | `npm install -D tailwindcss postcss autoprefixer` |

---

## URLs Reference

| URL | Purpose |
|-----|---------|
| https://el-mouloukia-bc-39f12.web.app/ | Production site (preferred) |
| https://el-mouloukia-bc-39f12.firebaseapp.com/ | Alternate domain (same site) |
| https://console.firebase.google.com/project/el-mouloukia-bc-39f12 | Firebase Console |
| localhost:5173 | Local dev server |

---

## Admin Access

**Login:**
- Navigate to Admin icon (shield) in top nav
- Enter password: `constantine-2026`
- Grants ability to:
  - View pending expert registrations
  - Verify and activate experts
  - See all experts (including pending)

**⚠️ TODO:** Move password to environment variable before production.

---

## Next Steps (Priority Order)

1. **CRITICAL:** Enable Firebase Anonymous Auth
2. Populate initial expert data in Firestore
3. Test admin verification workflow
4. Monitor Firebase Console for errors
5. Add loading states during Firestore sync
6. Implement error boundaries
7. Setup analytics

---

## Contact & Questions

**Deployment Issues?**
- Check Firebase Hosting console for errors
- Review browser console (F12)
- Verify Firestore data exists

**Code Changes?**
- Modify src/App.jsx
- Run `npm run build`
- Deploy with `npx firebase deploy --only hosting`

**New Features?**
- Add to backlog
- Estimate effort
- Implement + test locally
- Deploy when ready

---

**Document Version:** 1.0  
**Last Updated:** April 27, 2026  
**Ready for:** Gemini LLM or any AI coder following this project
