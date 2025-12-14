# Task 07: Portfolio Management

## 📋 Overview
Membuat halaman management portfolio untuk melihat dan mengelola semua portfolios dari imuii-server.

## ✅ Checklist

### 1. Create Portfolio Management Page
- [ ] Create `src/pages/PortfolioManagement.jsx`
- [ ] Setup page layout
- [ ] Add page title dan description
- [ ] Add refresh button

### 2. Create Portfolio Table Component
- [ ] Create `src/components/portfolio/PortfolioTable.jsx`
- [ ] Display columns:
  - Portfolio Name
  - Domain Name (subdomain)
  - Deploy URL
  - Owner (user email/name)
  - Status (Draft/Deployed)
  - Template Name
  - Created At
  - Actions (View/Edit/Delete)
- [ ] Add pagination
- [ ] Add sorting functionality

### 3. Add Portfolio Search & Filter
- [ ] Create `src/components/portfolio/PortfolioFilters.jsx`
- [ ] Search by portfolio name
- [ ] Search by domain name
- [ ] Filter by status (Draft/Deployed)
- [ ] Filter by owner

### 4. Create Portfolio Detail View
- [ ] Create `src/components/portfolio/PortfolioDetailModal.jsx`
- [ ] Show portfolio details:
  - Portfolio Name
  - Domain Name
  - Deploy URL (clickable link)
  - Status
  - Template info
  - Owner info
  - CV Data info (jika ada)
  - Created/Updated dates
- [ ] Add action buttons (Deploy/Delete)
- [ ] Add preview link (jika deployed)

### 5. Add Portfolio Status Management
- [ ] Add status badge dengan color coding
- [ ] Add status change functionality (jika admin bisa)
- [ ] Show deployment info

## 🎨 Design Requirements

### Layout
- Full width table dengan card container
- Filters di atas table
- Search bar dengan icon
- Refresh button di header

### Table
- Background: Glass morphism
- Header: Bold, dengan border bottom
- Rows: Hover effect dengan subtle background
- Status badge: Color coded sesuai status
- Deploy URL: Link dengan accent color

### Status Colors
- **Draft**: Blue (`bg-blue-500/20 text-blue-400`)
- **Deployed**: Green (`bg-green-500/20 text-green-400`)

### Colors
- Table background: `bg-[--card]` dengan glass
- Header background: `bg-[--muted]`
- Deploy URL link: Accent color (`text-accent`)
- Action buttons: Primary color

### Typography
- Table header: Medium, bold
- Table cell: Regular
- Status badge: Small, uppercase
- Deploy URL: Small, dengan link styling

## 📝 Files to Create

1. `src/pages/PortfolioManagement.jsx` - Portfolio management page
2. `src/components/portfolio/PortfolioTable.jsx` - Table component
3. `src/components/portfolio/PortfolioFilters.jsx` - Filters component
4. `src/components/portfolio/PortfolioDetailModal.jsx` - Detail modal

## 📐 Component Structure

```jsx
<PortfolioManagement>
  <PageHeader>
    <Title>Portfolio Management</Title>
    <RefreshButton />
  </PageHeader>
  <PortfolioFilters>
    <SearchInput />
    <StatusFilter />
    <OwnerFilter />
  </PortfolioFilters>
  <PortfolioTable>
    <TableHeader />
    <TableRow />
    <Pagination />
  </PortfolioTable>
  <PortfolioDetailModal />
</PortfolioManagement>
```

## 📊 Data Structure

```javascript
{
  id: "portfolio-id",
  name: "My Portfolio",
  domain_name: "daffatest", // atau null
  deploy_url: "https://daffatest.imuii.id", // atau null
  status: "deployed",
  template: {
    id: "template-id",
    name: "Modern Portfolio"
  },
  user: {
    id: "user-id",
    email: "user@example.com",
    name: "User Name"
  },
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-01-15T10:30:00Z"
}
```

## ✅ Acceptance Criteria

- [ ] Table menampilkan semua portfolios
- [ ] Search functionality bekerja dengan baik
- [ ] Filter by status bekerja
- [ ] Filter by owner bekerja
- [ ] Pagination bekerja dengan benar
- [ ] Sorting bekerja untuk semua columns
- [ ] Detail modal menampilkan informasi lengkap
- [ ] Status badges sesuai dengan color coding
- [ ] Deploy URL bisa di-click dan open di new tab
- [ ] Responsive untuk mobile & desktop

## 🔗 Dependencies

- Task 03: Dashboard Layout (harus selesai dulu)
- API endpoint: `GET /api/v1/admin/portfolios/all` (perlu dibuat di imuii-server)

## 📚 References

- `COLOR_REFERENCE.md` - Colors untuk status badges
- `PRD.md` - Portfolio management requirements

---

**Status**: ⏳ Pending  
**Estimated Time**: 5-6 hours  
**Dependencies**: Task 03
