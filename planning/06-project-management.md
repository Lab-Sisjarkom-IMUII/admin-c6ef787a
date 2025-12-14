# Task 06: Project Management

## 📋 Overview
Membuat halaman management project untuk melihat dan mengelola semua projects dari imuii-server.

## ✅ Checklist

### 1. Create Project Management Page
- [ ] Create `src/pages/ProjectManagement.jsx`
- [ ] Setup page layout
- [ ] Add page title dan description
- [ ] Add refresh button

### 2. Create Project Table Component
- [ ] Create `src/components/project/ProjectTable.jsx`
- [ ] Display columns:
  - Project Name (subdomain)
  - Description
  - Owner (user email/name)
  - Status (Pending/Initialized/Building/Deployed/Failed/Inactive)
  - Source (CLI/Web)
  - Created At
  - Actions (View/Edit/Delete)
- [ ] Add pagination
- [ ] Add sorting functionality

### 3. Add Project Search & Filter
- [ ] Create `src/components/project/ProjectFilters.jsx`
- [ ] Search by project name
- [ ] Filter by status
- [ ] Filter by source (CLI/Web)
- [ ] Filter by owner

### 4. Create Project Detail View
- [ ] Create `src/components/project/ProjectDetailModal.jsx`
- [ ] Show project details:
  - Project Name
  - Description
  - Repository URL
  - Status
  - Owner info
  - Deployments history
  - Created/Updated dates
- [ ] Add action buttons (Deploy/Delete)

### 5. Add Project Status Management
- [ ] Add status badge dengan color coding
- [ ] Add status change functionality (jika admin bisa)
- [ ] Show deployment history

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

### Status Colors
- **Pending**: Blue (`bg-blue-500/20 text-blue-400`)
- **Initialized**: Info blue (`bg-blue-500/20 text-blue-400`)
- **Building**: Yellow (`bg-yellow-500/20 text-yellow-400`)
- **Deployed**: Green (`bg-green-500/20 text-green-400`)
- **Failed**: Red (`bg-red-500/20 text-red-400`)
- **Inactive**: Gray (`bg-gray-500/20 text-gray-400`)

### Colors
- Table background: `bg-[--card]` dengan glass
- Header background: `bg-[--muted]`
- Action buttons: Primary color

### Typography
- Table header: Medium, bold
- Table cell: Regular
- Status badge: Small, uppercase

## 📝 Files to Create

1. `src/pages/ProjectManagement.jsx` - Project management page
2. `src/components/project/ProjectTable.jsx` - Table component
3. `src/components/project/ProjectFilters.jsx` - Filters component
4. `src/components/project/ProjectDetailModal.jsx` - Detail modal

## 📐 Component Structure

```jsx
<ProjectManagement>
  <PageHeader>
    <Title>Project Management</Title>
    <RefreshButton />
  </PageHeader>
  <ProjectFilters>
    <SearchInput />
    <StatusFilter />
    <SourceFilter />
    <OwnerFilter />
  </ProjectFilters>
  <ProjectTable>
    <TableHeader />
    <TableRow />
    <Pagination />
  </ProjectTable>
  <ProjectDetailModal />
</ProjectManagement>
```

## 📊 Data Structure

```javascript
{
  id: "uuid",
  name: "my-project",
  description: "Project description",
  repo_url: "https://github.com/...",
  status: "deployed",
  source: "cli",
  owner: {
    id: "user-id",
    email: "user@example.com",
    name: "User Name"
  },
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-01-15T10:30:00Z"
}
```

## ✅ Acceptance Criteria

- [ ] Table menampilkan semua projects
- [ ] Search functionality bekerja dengan baik
- [ ] Filter by status bekerja
- [ ] Filter by source bekerja
- [ ] Filter by owner bekerja
- [ ] Pagination bekerja dengan benar
- [ ] Sorting bekerja untuk semua columns
- [ ] Detail modal menampilkan informasi lengkap
- [ ] Status badges sesuai dengan color coding
- [ ] Responsive untuk mobile & desktop

## 🔗 Dependencies

- Task 03: Dashboard Layout (harus selesai dulu)
- API endpoint: `GET /api/v1/admin/projects/all` (perlu dibuat di imuii-server)

## 📚 References

- `COLOR_REFERENCE.md` - Colors untuk status badges
- `PRD.md` - Project management requirements

---

**Status**: ⏳ Pending  
**Estimated Time**: 5-6 hours  
**Dependencies**: Task 03
