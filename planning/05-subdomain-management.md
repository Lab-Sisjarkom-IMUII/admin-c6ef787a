# Task 05: Subdomain Management

## 📋 Overview
Membuat halaman management subdomain untuk melihat dan mengelola subdomain aktif dari Projects dan Portfolios.

## ✅ Checklist

### 1. Create Subdomain Management Page
- [ ] Create `src/pages/SubdomainManagement.jsx`
- [ ] Setup page layout
- [ ] Add page title dan description
- [ ] Add sync button untuk pull data dari imuii-server

### 2. Create Subdomain Table Component
- [ ] Create `src/components/subdomain/SubdomainTable.jsx`
- [ ] Display columns:
  - Subdomain (e.g., "my-project")
  - Full Domain (e.g., "my-project.imuii.id")
  - Source (Project/Portfolio)
  - Source Name
  - Status (Active/Inactive)
  - Created At
- [ ] Add pagination
- [ ] Add sorting functionality

### 3. Add Search & Filter Functionality
- [ ] Create `src/components/subdomain/SubdomainFilters.jsx`
- [ ] Search by subdomain name
- [ ] Filter by source (Project/Portfolio)
- [ ] Filter by status (Active/Inactive)
- [ ] Filter by domain (jika multi-domain)

### 4. Add Sync with IMUII Server
- [ ] Create API function untuk fetch subdomains
- [ ] Endpoint: `GET /api/v1/admin/subdomains/active`
- [ ] Parse response (Projects + Portfolios)
- [ ] Update local state
- [ ] Show sync status (success/error)

### 5. Create Subdomain Detail View
- [ ] Create modal atau detail panel
- [ ] Show subdomain details:
  - Full domain
  - Source type & ID
  - Source name
  - Status
  - Created/Updated dates
- [ ] Add action buttons (jika ada)

## 🎨 Design Requirements

### Layout
- Full width table dengan card container
- Filters di atas table
- Search bar dengan icon
- Sync button di header

### Table
- Background: Glass morphism
- Header: Bold, dengan border bottom
- Rows: Hover effect dengan subtle background
- Status badge: Green (active), Gray (inactive)
- Source badge: Primary color (project), Accent color (portfolio)

### Colors
- Table background: `bg-[--card]` dengan glass
- Header background: `bg-[--muted]`
- Active status: Green 500 (`bg-green-500/20 text-green-400`)
- Inactive status: Gray 500 (`bg-gray-500/20 text-gray-400`)
- Source badge: Primary/Accent colors

### Typography
- Table header: Medium, bold
- Table cell: Regular
- Status badge: Small, uppercase
- Source badge: Small

## 📝 Files to Create

1. `src/pages/SubdomainManagement.jsx` - Subdomain management page
2. `src/components/subdomain/SubdomainTable.jsx` - Table component
3. `src/components/subdomain/SubdomainFilters.jsx` - Filters component
4. `src/components/subdomain/SubdomainDetailModal.jsx` - Detail modal (optional)

## 📐 Component Structure

```jsx
<SubdomainManagement>
  <PageHeader>
    <Title>Subdomain Management</Title>
    <SyncButton />
  </PageHeader>
  <SubdomainFilters>
    <SearchInput />
    <SourceFilter />
    <StatusFilter />
  </SubdomainFilters>
  <SubdomainTable>
    <TableHeader />
    <TableRow />
    <Pagination />
  </SubdomainTable>
</SubdomainManagement>
```

## 📊 Data Structure

```javascript
{
  subdomain: "my-project",
  full_domain: "my-project.imuii.id",
  source: "project", // atau "portfolio"
  source_id: "uuid",
  source_name: "My Project",
  status: "active",
  created_at: "2024-01-15T10:30:00Z"
}
```

## ✅ Acceptance Criteria

- [ ] Table menampilkan semua subdomain aktif
- [ ] Search functionality bekerja dengan baik
- [ ] Filter by source bekerja
- [ ] Filter by status bekerja
- [ ] Sync button pull data dari imuii-server
- [ ] Pagination bekerja dengan benar
- [ ] Sorting bekerja untuk semua columns
- [ ] Detail view menampilkan informasi lengkap
- [ ] Responsive untuk mobile & desktop

## 🔗 Dependencies

- Task 03: Dashboard Layout (harus selesai dulu)
- API endpoint: `GET /api/v1/admin/subdomains/active` (perlu dibuat di imuii-server)

## 📚 References

- `COLOR_REFERENCE.md` - Colors untuk badges
- `PRD.md` Section 6 - Subdomain Management requirements

---

**Status**: ⏳ Pending  
**Estimated Time**: 5-6 hours  
**Dependencies**: Task 03
