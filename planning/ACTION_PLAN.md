# 📋 Action Plan - IMUII Admin Development

Dokumen ini berisi action plan lengkap untuk pengembangan IMUII Admin sesuai dengan PRD dan COLOR_REFERENCE.md.

**Last Updated**: 2025-01-21 (Added Event Management - Phase 8)

---

## 🎯 Overview

IMUII Admin adalah aplikasi internal untuk mengelola dan memonitor infrastruktur IMUII. Aplikasi ini terdiri dari:

1. **Login Page** - Autentikasi admin
2. **Dashboard** - Admin panel dengan sub-menu:
   - Monitoring VPS
   - Subdomain Management
   - Project Management
   - Portfolio Management
   - Event Management

---

## 📦 Daftar Task

### Phase 1: Setup & Foundation
- [x] ✅ Task 01: Setup Project Foundation
- [ ] ⏳ Task 02: Setup Theme & Color System
- [ ] ⏳ Task 03: Setup Routing System
- [ ] ⏳ Task 04: Setup Authentication Context

### Phase 2: Login Page
- [ ] ⏳ Task 05: Create Login Page UI
- [ ] ⏳ Task 06: Implement Login Logic
- [ ] ⏳ Task 07: Add Form Validation
- [ ] ⏳ Task 08: Add Error Handling

### Phase 3: Dashboard Layout
- [ ] ⏳ Task 09: Create Dashboard Layout
- [ ] ⏳ Task 10: Create Sidebar Navigation
- [ ] ⏳ Task 11: Create Header Component
- [ ] ⏳ Task 12: Implement Protected Routes

### Phase 4: Monitoring VPS
- [ ] ⏳ Task 13: Create Monitoring Dashboard Page
- [ ] ⏳ Task 14: Create Resource Cards (CPU, RAM, Disk)
- [ ] ⏳ Task 15: Create Network Monitoring Section
- [ ] ⏳ Task 16: Create Service Health Section
- [ ] ⏳ Task 17: Create System Health Section
- [ ] ⏳ Task 18: Add Real-time Updates

### Phase 5: Subdomain Management
- [ ] ⏳ Task 19: Create Subdomain List Page
- [ ] ⏳ Task 20: Create Subdomain Table Component
- [ ] ⏳ Task 21: Add Search & Filter Functionality
- [ ] ⏳ Task 22: Add Sync with IMUII Server
- [ ] ⏳ Task 23: Create Subdomain Detail View

### Phase 6: Project Management
- [ ] ⏳ Task 24: Create Project List Page
- [ ] ⏳ Task 25: Create Project Table Component
- [ ] ⏳ Task 26: Add Project Search & Filter
- [ ] ⏳ Task 27: Create Project Detail View
- [ ] ⏳ Task 28: Add Project Status Management

### Phase 7: Portfolio Management
- [ ] ⏳ Task 29: Create Portfolio List Page
- [ ] ⏳ Task 30: Create Portfolio Table Component
- [ ] ⏳ Task 31: Add Portfolio Search & Filter
- [ ] ⏳ Task 32: Create Portfolio Detail View
- [ ] ⏳ Task 33: Add Portfolio Status Management

### Phase 8: Event Management
- [ ] ⏳ Task 34: Create Event Management Page
- [ ] ⏳ Task 35: Create Event Table Component
- [ ] ⏳ Task 36: Add Event Search & Filter
- [ ] ⏳ Task 37: Create Event Form Modal (Create/Edit)
- [ ] ⏳ Task 38: Create Event Detail Modal dengan Project List
- [ ] ⏳ Task 39: Add Event CRUD Operations
- [ ] ⏳ Task 40: Add Event Status Management

---

## 🎨 Design System

Semua komponen harus mengikuti **COLOR_REFERENCE.md**:

### Colors
- **Primary**: `#7C3AED` (Violet 600)
- **Accent**: `#0D9488` (Teal 600)
- **Background**: `#0B0B0E` (Dark) / `#ffffff` (Light)
- **Foreground**: `#E5E7EB` (Dark) / `#111827` (Light)

### Status Colors
- **Success**: `#10B981` (Green 500)
- **Error**: `#EF4444` (Red 500)
- **Warning**: `#F59E0B` (Yellow 500)
- **Info**: `#3B82F6` (Blue 500)

---

## 📁 File Structure

```
imuii-admin/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── auth/
│   │   │   └── LoginForm.jsx
│   │   ├── monitoring/
│   │   │   ├── ResourceCard.jsx
│   │   │   ├── NetworkCard.jsx
│   │   │   └── ServiceHealthCard.jsx
│   │   ├── subdomain/
│   │   │   ├── SubdomainTable.jsx
│   │   │   └── SubdomainFilters.jsx
│   │   ├── project/
│   │   │   ├── ProjectTable.jsx
│   │   │   ├── ProjectFilters.jsx
│   │   │   └── ProjectDetailModal.jsx
│   │   └── portfolio/
│   │       ├── PortfolioTable.jsx
│   │       ├── PortfolioFilters.jsx
│   │       └── PortfolioDetailModal.jsx
│   │   └── event/
│   │       ├── EventTable.jsx
│   │       ├── EventFilters.jsx
│   │       ├── EventDetailModal.jsx
│   │       └── EventFormModal.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Monitoring.jsx
│   │   ├── SubdomainManagement.jsx
│   │   ├── ProjectManagement.jsx
│   │   ├── PortfolioManagement.jsx
│   │   └── EventManagement.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useMonitoring.js
│   │   ├── useSubdomains.js
│   │   ├── useProjects.js
│   │   ├── usePortfolios.js
│   │   └── useEvents.js
│   ├── utils/
│   │   ├── api.js
│   │   └── validation.js
│   └── App.jsx
└── planning/
    ├── ACTION_PLAN.md (this file)
    ├── 01-setup.md
    ├── 02-login-page.md
    ├── 03-dashboard-layout.md
    ├── 04-monitoring-vps.md
    ├── 05-subdomain-management.md
    ├── 06-project-management.md
    ├── 07-portfolio-management.md
    └── 08-event-management.md
```

---

## 🚀 Development Order

1. **Setup Foundation** → Task 01-04
2. **Login Page** → Task 05-08
3. **Dashboard Layout** → Task 09-12
4. **Monitoring VPS** → Task 13-18
5. **Subdomain Management** → Task 19-23
6. **Project Management** → Task 24-28
7. **Portfolio Management** → Task 29-33
8. **Event Management** → Task 34-40

---

## 📝 Notes

- Semua komponen harus responsive (desktop-first sesuai PRD)
- Menggunakan Tailwind CSS dengan CSS variables dari COLOR_REFERENCE.md
- Dark mode sebagai default, light mode sebagai optional
- Semua API calls harus menggunakan error handling yang proper
- Authentication menggunakan JWT token (terpisah dari imuii-server user token)

---

**Status**: 🟡 In Progress  
**Current Phase**: Phase 1 - Setup & Foundation
