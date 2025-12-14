# Task 08: Event Management

## 📋 Overview
Membuat halaman management event untuk admin membuat dan mengelola event. Event digunakan untuk mengelompokkan project-project. Admin dapat membuat event, melihat detail event beserta project yang terdaftar di event tersebut. Mapping project ke event dilakukan oleh user di imuii-portal (admin hanya melihat/memeta).

## 🎯 Konsep Event Management

### Fungsi Event
- Event adalah kategori/kelompok untuk mengorganisir project
- Contoh: "Hackathon 2024", "Final Project Semester 1", "Competition 2025", dll
- Admin dapat membuat, mengedit, dan menghapus event
- Admin dapat melihat project-project yang terdaftar di setiap event (read-only)
- Mapping project ke event dilakukan oleh user di imuii-portal

### Fitur Admin
1. **CRUD Event** - Create, Read, Update, Delete event
2. **View Event Details** - Melihat detail event dan list project yang terdaftar
3. **Filter & Search** - Mencari event berdasarkan nama, status, tanggal
4. **Event Status** - Active, Inactive, Upcoming, Completed
5. **Event Metadata** - Nama, deskripsi, tanggal mulai, tanggal akhir, status

## ✅ Checklist

### 1. Create Event Management Page
- [ ] Create `src/pages/EventManagement.jsx`
- [ ] Setup page layout dengan header
- [ ] Add page title dan description
- [ ] Add "Create Event" button
- [ ] Add refresh button

### 2. Create Event Table Component
- [ ] Create `src/components/event/EventTable.jsx`
- [ ] Display columns:
  - Event Name (sortable, clickable untuk detail)
  - Description (truncated dengan tooltip)
  - Start Date (formatted date)
  - End Date (formatted date)
  - Status (badge: Active/Inactive/Upcoming/Completed)
  - Project Count (jumlah project yang terdaftar)
  - Created At (formatted date)
  - Actions (View, Edit, Delete buttons)
- [ ] Use shared Table component
- [ ] Add row click untuk open detail modal
- [ ] Add action buttons dengan icons

### 3. Create Event Filters Component
- [ ] Create `src/components/event/EventFilters.jsx`
- [ ] Search input untuk event name
- [ ] Filter by status (All/Active/Inactive/Upcoming/Completed)
- [ ] Filter by date range (optional, bisa di phase 2)
- [ ] Apply filters dengan debounce untuk search
- [ ] Clear all filters button

### 4. Create Event Detail Modal
- [ ] Create `src/components/event/EventDetailModal.jsx`
- [ ] Display event details:
  - Event Name
  - Description
  - Start Date & End Date
  - Status dengan badge
  - Created/Updated dates
- [ ] Display list project yang terdaftar (read-only):
  - Project Name (link ke project detail jika perlu)
  - Owner
  - Status
  - Registered At (kapan project terdaftar ke event)
- [ ] Action buttons: Edit, Delete
- [ ] Empty state jika belum ada project terdaftar

### 5. Create Event Form Modal (Create/Edit)
- [ ] Create `src/components/event/EventFormModal.jsx`
- [ ] Form fields:
  - Event Name (required, text input)
  - Description (textarea, optional)
  - Start Date (date picker, required)
  - End Date (date picker, required, harus >= start date)
  - Status (dropdown: Active/Inactive/Upcoming/Completed)
- [ ] Form validation:
  - Name tidak boleh kosong
  - End date harus >= start date
  - Status harus dipilih
- [ ] Submit button dengan loading state
- [ ] Cancel button
- [ ] Support untuk create dan edit mode

### 6. Create Event API Hook
- [ ] Create `src/hooks/useEvents.js`
- [ ] Fetch events dari GET `/api/v1/admin/events/all`
- [ ] Create event: POST `/api/v1/admin/events`
- [ ] Update event: PUT `/api/v1/admin/events/:id`
- [ ] Delete event: DELETE `/api/v1/admin/events/:id`
- [ ] Get event detail: GET `/api/v1/admin/events/:id`
- [ ] Get event projects: GET `/api/v1/admin/events/:id/projects`
- [ ] Loading dan error states
- [ ] Refresh function

### 7. Create Event Status Utility
- [ ] Update `src/utils/status.js` untuk event status
- [ ] Add `getEventStatus()` function
- [ ] Status color mapping:
  - Active: success (green)
  - Inactive: default (gray)
  - Upcoming: info (blue)
  - Completed: default (gray) atau warning (yellow)

### 8. Update Event Management Page
- [ ] Replace placeholder dengan full implementation
- [ ] Page header dengan title, description, dan create button
- [ ] EventFilters component
- [ ] EventTable component
- [ ] EventDetailModal dengan state management
- [ ] EventFormModal untuk create/edit
- [ ] Loading dan error states
- [ ] Success notifications (toast) untuk create/update/delete
- [ ] Confirmation dialog untuk delete

## 📁 File Structure

```
src/
├── components/
│   └── event/
│       ├── EventTable.jsx (new)
│       ├── EventFilters.jsx (new)
│       ├── EventDetailModal.jsx (new)
│       └── EventFormModal.jsx (new)
├── hooks/
│   └── useEvents.js (new)
├── pages/
│   └── EventManagement.jsx (new)
└── utils/
    └── status.js (update - add event status)
```

## 🎨 Design Requirements

### Event Status Badges
- **Active**: Green badge (success variant)
- **Inactive**: Gray badge (default variant)
- **Upcoming**: Blue badge (info variant)
- **Completed**: Gray badge (default variant) atau yellow (warning variant)

### Event Table
- Event name dengan hover effect (primary color)
- Project count dengan badge atau number display
- Date columns dengan formatted date (formatAbsoluteDate)
- Action buttons dengan icons (Eye, Edit, Trash2 dari lucide-react)

### Event Form
- Glass morphism card untuk modal
- Date picker menggunakan HTML5 date input atau custom date picker
- Form validation dengan error messages
- Loading state pada submit button

### Event Detail Modal
- Sections:
  1. Basic Info (name, description, dates, status)
  2. Project List (table atau list dengan project info)
- Empty state untuk project list jika kosong
- Read-only project list (tidak bisa edit dari admin)

## 🔌 API Endpoints (to be created in imuii-server)

### Event CRUD
- `GET /api/v1/admin/events/all` - Get all events dengan pagination
- `GET /api/v1/admin/events/:id` - Get event detail
- `POST /api/v1/admin/events` - Create new event
- `PUT /api/v1/admin/events/:id` - Update event
- `DELETE /api/v1/admin/events/:id` - Delete event

### Event Projects (Read-only)
- `GET /api/v1/admin/events/:id/projects` - Get projects yang terdaftar di event

### Request/Response Format

#### Create Event Request
```json
{
  "name": "Hackathon 2024",
  "description": "Annual hackathon competition",
  "start_date": "2024-01-15T00:00:00Z",
  "end_date": "2024-01-20T23:59:59Z",
  "status": "active"
}
```

#### Event Response
```json
{
  "id": "uuid",
  "name": "Hackathon 2024",
  "description": "Annual hackathon competition",
  "start_date": "2024-01-15T00:00:00Z",
  "end_date": "2024-01-20T23:59:59Z",
  "status": "active",
  "project_count": 15,
  "created_at": "2024-01-10T10:00:00Z",
  "updated_at": "2024-01-10T10:00:00Z"
}
```

#### Event Detail with Projects Response
```json
{
  "id": "uuid",
  "name": "Hackathon 2024",
  "description": "Annual hackathon competition",
  "start_date": "2024-01-15T00:00:00Z",
  "end_date": "2024-01-20T23:59:59Z",
  "status": "active",
  "created_at": "2024-01-10T10:00:00Z",
  "updated_at": "2024-01-10T10:00:00Z",
  "projects": [
    {
      "id": "project-uuid",
      "name": "my-project",
      "owner": {
        "id": "user-id",
        "email": "user@example.com",
        "name": "User Name"
      },
      "status": "deployed",
      "registered_at": "2024-01-12T08:00:00Z"
    }
  ]
}
```

## 🔄 State Management

### Local State
- `events` - Array of events
- `selectedEvent` - Currently selected event untuk detail modal
- `isDetailModalOpen` - Boolean untuk detail modal
- `isFormModalOpen` - Boolean untuk form modal
- `formMode` - 'create' atau 'edit'
- `filters` - Object dengan search, status filter
- `currentPage` - Current page untuk pagination
- `pageSize` - Items per page

### Filtering Logic
- Search: Filter by event name (case-insensitive)
- Status: Filter by event status
- Date range: Optional, bisa ditambahkan di phase 2

### Pagination
- Client-side pagination untuk events
- Page size options: 10, 25, 50, 100

## 🎯 Implementation Order

1. **Update status.js** - Add event status utility
2. **Create useEvents.js hook** - API integration
3. **Create EventFormModal.jsx** - Form untuk create/edit
4. **Create EventTable.jsx** - Table component
5. **Create EventFilters.jsx** - Filter component
6. **Create EventDetailModal.jsx** - Detail view dengan project list
7. **Create EventManagement.jsx page** - Full page implementation

## 📝 Notes

### Admin Permissions
- Admin dapat membuat, mengedit, dan menghapus event
- Admin **TIDAK** dapat mengubah mapping project ke event (read-only)
- Mapping project ke event dilakukan oleh user di imuii-portal

### Event Status Logic
- **Active**: Event sedang berlangsung (current date antara start_date dan end_date)
- **Inactive**: Event dinonaktifkan oleh admin
- **Upcoming**: Event belum dimulai (current date < start_date)
- **Completed**: Event sudah selesai (current date > end_date)

### Future Enhancements (Phase 2)
- Date range filter
- Export event data (CSV/Excel)
- Bulk operations (activate/deactivate multiple events)
- Event statistics (total projects, active projects, dll)
- Event timeline view

## ✅ Dependencies

### Components
- Shared Table component
- Shared Filters component
- Shared Pagination component
- Modal component
- Badge component
- Button component
- Input component
- Date utilities dari `utils/date.js`
- Status utilities dari `utils/status.js`

### Icons (lucide-react)
- Calendar (untuk date display)
- Plus (untuk create button)
- Eye (untuk view action)
- Edit (untuk edit action)
- Trash2 (untuk delete action)
- RefreshCw (untuk refresh button)

### Libraries
- framer-motion (untuk animations)
- react-router-dom (untuk routing, jika perlu link ke project detail)
