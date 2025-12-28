# API Documentation: Event Management

## Overview

Event Management System memungkinkan admin untuk membuat dan mengelola events, serta user untuk mendaftarkan projects mereka ke events. Sistem ini menggunakan many-to-many relationship antara Event dan Project melalui junction table `event_projects`.

## Authentication

### Admin Endpoints
Semua admin endpoints memerlukan admin authentication token:
- Header: `Authorization: Bearer <admin_token>`
- Token diperoleh dari `/api/v1/admin/auth/login`

### User Endpoints
Semua user endpoints memerlukan user authentication token:
- Header: `Authorization: Bearer <user_token>`
- Atau cookie: `imuii-token=<user_token>`

## Admin Endpoints

### 1. Get All Events

Mengambil daftar semua events dengan pagination dan filter status.

**Endpoint:** `GET /api/v1/admin/events/all`

**Query Parameters:**
- `page` (optional, default: 1) - Halaman yang diminta
- `limit` (optional, default: 25, max: 100) - Jumlah events per halaman
- `status` (optional) - Filter by status: "active", "upcoming", "ended"

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "events": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Hackathon 2024",
        "description": "Annual hackathon competition",
        "start_date": "2024-01-15T00:00:00Z",
        "end_date": "2024-01-20T23:59:59Z",
        "status": "active",
        "project_count": 15,
        "created_at": "2024-01-10T10:00:00Z",
        "updated_at": "2024-01-10T10:00:00Z"
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 25
  },
  "message": "Events retrieved successfully"
}
```

**Example:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/events/all?page=1&limit=25&status=active" \
  -H "Authorization: Bearer <admin_token>"
```

### 2. Get Event by ID

Mengambil detail event berdasarkan ID.

**Endpoint:** `GET /api/v1/admin/events/:id`

**Path Parameters:**
- `id` (required) - Event UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Hackathon 2024",
    "description": "Annual hackathon competition",
    "start_date": "2024-01-15T00:00:00Z",
    "end_date": "2024-01-20T23:59:59Z",
    "status": "active",
    "project_count": 15,
    "created_at": "2024-01-10T10:00:00Z",
    "updated_at": "2024-01-10T10:00:00Z"
  },
  "message": "Event retrieved successfully"
}
```

**Example:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/events/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <admin_token>"
```

### 3. Create Event

Membuat event baru.

**Endpoint:** `POST /api/v1/admin/events`

**Request Body:**
```json
{
  "name": "Hackathon 2024",
  "description": "Annual hackathon competition",
  "start_date": "2024-01-15T00:00:00Z",
  "end_date": "2024-01-20T23:59:59Z",
  "status": "active"
}
```

**Validation:**
- `name`: required, min=3, max=255
- `description`: optional, max=1000
- `start_date`: required, must be before end_date
- `end_date`: required, must be after start_date
- `status`: optional, oneof=active upcoming ended (default: active)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Hackathon 2024",
    "description": "Annual hackathon competition",
    "start_date": "2024-01-15T00:00:00Z",
    "end_date": "2024-01-20T23:59:59Z",
    "status": "active",
    "project_count": 0,
    "created_at": "2024-01-10T10:00:00Z",
    "updated_at": "2024-01-10T10:00:00Z"
  },
  "message": "Event created successfully"
}
```

**Example:**
```bash
curl -X POST "http://localhost:8080/api/v1/admin/events" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hackathon 2024",
    "description": "Annual hackathon competition",
    "start_date": "2024-01-15T00:00:00Z",
    "end_date": "2024-01-20T23:59:59Z",
    "status": "active"
  }'
```

### 4. Update Event

Mengupdate event yang sudah ada.

**Endpoint:** `PUT /api/v1/admin/events/:id`

**Path Parameters:**
- `id` (required) - Event UUID

**Request Body:**
```json
{
  "name": "Hackathon 2024 Updated",
  "description": "Updated description",
  "start_date": "2024-01-16T00:00:00Z",
  "end_date": "2024-01-21T23:59:59Z",
  "status": "upcoming"
}
```

**Validation:**
- Semua fields optional
- Jika start_date dan end_date diupdate, start_date harus sebelum end_date
- Status harus oneof: active, upcoming, ended

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Hackathon 2024 Updated",
    "description": "Updated description",
    "start_date": "2024-01-16T00:00:00Z",
    "end_date": "2024-01-21T23:59:59Z",
    "status": "upcoming",
    "project_count": 15,
    "created_at": "2024-01-10T10:00:00Z",
    "updated_at": "2024-01-11T10:00:00Z"
  },
  "message": "Event updated successfully"
}
```

**Example:**
```bash
curl -X PUT "http://localhost:8080/api/v1/admin/events/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hackathon 2024 Updated",
    "status": "upcoming"
  }'
```

### 5. Delete Event

Menghapus event. Semua registrations (event_projects) akan dihapus secara cascade.

**Endpoint:** `DELETE /api/v1/admin/events/:id`

**Path Parameters:**
- `id` (required) - Event UUID

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Event deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:8080/api/v1/admin/events/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <admin_token>"
```

### 6. Get Event Projects

Mengambil daftar semua projects yang terdaftar di event tertentu.

**Endpoint:** `GET /api/v1/admin/events/:id/projects`

**Path Parameters:**
- `id` (required) - Event UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "projects": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "name": "my-project",
        "description": "My awesome project",
        "status": "deployed",
        "domain": "my-project.imuii.id",
        "deploy_url": "https://my-project.imuii.id",
        "owner": {
          "id": "user-id-123",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "registered_at": "2024-01-12T08:00:00Z"
      }
    ]
  },
  "message": "Event projects retrieved successfully"
}
```

**Example:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/events/550e8400-e29b-41d4-a716-446655440000/projects" \
  -H "Authorization: Bearer <admin_token>"
```

## User Endpoints

### 1. Register Project to Event

Mendaftarkan project milik user ke event.

**Endpoint:** `POST /api/v1/events/:eventId/register`

**Path Parameters:**
- `eventId` (required) - Event UUID

**Request Body:**
```json
{
  "project_id": "660e8400-e29b-41d4-a716-446655440000"
}
```

**Validation:**
- `project_id`: required, must be valid UUID
- Project must belong to authenticated user
- Event status must be "active" or "upcoming"
- Project must not already be registered in the event

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Project registered successfully"
}
```

**Error Responses:**

**400 Bad Request - Project already registered:**
```json
{
  "success": false,
  "error": "project is already registered in this event"
}
```

**400 Bad Request - Event not accepting registrations:**
```json
{
  "success": false,
  "error": "event is not accepting registrations (status: ended)"
}
```

**403 Forbidden - Project does not belong to user:**
```json
{
  "success": false,
  "error": "Project does not belong to user"
}
```

**Example:**
```bash
curl -X POST "http://localhost:8080/api/v1/events/550e8400-e29b-41d4-a716-446655440000/register" \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "660e8400-e29b-41d4-a716-446655440000"
  }'
```

### 2. Unregister Project from Event

Menghapus project dari event.

**Endpoint:** `DELETE /api/v1/events/:eventId/projects/:projectId`

**Path Parameters:**
- `eventId` (required) - Event UUID
- `projectId` (required) - Project UUID

**Validation:**
- Project must belong to authenticated user

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Project unregistered successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:8080/api/v1/events/550e8400-e29b-41d4-a716-446655440000/projects/660e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <user_token>"
```

### 3. Get My Events

Mengambil daftar events yang memiliki projects milik user.

**Endpoint:** `GET /api/v1/events/my-events`

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "events": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Hackathon 2024",
        "description": "Annual hackathon competition",
        "start_date": "2024-01-15T00:00:00Z",
        "end_date": "2024-01-20T23:59:59Z",
        "status": "active",
        "my_projects": [
          {
            "id": "660e8400-e29b-41d4-a716-446655440000",
            "name": "my-project",
            "registered_at": "2024-01-12T08:00:00Z"
          }
        ]
      }
    ]
  },
  "message": "User events retrieved successfully"
}
```

**Example:**
```bash
curl -X GET "http://localhost:8080/api/v1/events/my-events" \
  -H "Authorization: Bearer <user_token>"
```

## Data Models

### Event

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "start_date": "datetime (ISO 8601)",
  "end_date": "datetime (ISO 8601)",
  "status": "active | upcoming | ended",
  "project_count": "integer",
  "created_at": "datetime (ISO 8601)",
  "updated_at": "datetime (ISO 8601)"
}
```

### EventProject (Junction Table)

```json
{
  "id": "uuid",
  "event_id": "uuid",
  "project_id": "uuid",
  "registered_at": "datetime (ISO 8601)"
}
```

### ProjectInfo (in Event Projects Response)

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "status": "string",
  "domain": "string",
  "deploy_url": "string",
  "owner": {
    "id": "string",
    "name": "string",
    "email": "string"
  },
  "registered_at": "datetime (ISO 8601)"
}
```

## Error Handling

### Status Codes

- `200 OK` - Request berhasil
- `400 Bad Request` - Invalid request body atau validation error
- `401 Unauthorized` - Missing atau invalid authentication token
- `403 Forbidden` - Project does not belong to user
- `404 Not Found` - Event atau Project tidak ditemukan
- `500 Internal Server Error` - Server error

### Error Response Format

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Validation Rules

### Event Creation/Update

1. **start_date < end_date**: Start date harus sebelum end date
2. **Status**: Harus salah satu dari: "active", "upcoming", "ended"
3. **Name**: Required, min 3 karakter, max 255 karakter
4. **Description**: Optional, max 1000 karakter

### Project Registration

1. **Project Ownership**: Project harus milik user yang melakukan request
2. **Event Status**: Event harus memiliki status "active" atau "upcoming"
3. **Duplicate Prevention**: Project tidak boleh terdaftar dua kali di event yang sama (unique constraint)

### Project Unregistration

1. **Project Ownership**: Project harus milik user yang melakukan request

## Notes

1. **Cascade Delete**: Ketika event dihapus, semua registrations (event_projects) akan dihapus secara otomatis oleh database
2. **Project Count**: Dihitung secara real-time dari event_projects table
3. **Status Auto-Update**: Status event bisa diupdate manual oleh admin. Future enhancement: auto-update status berdasarkan start_date dan end_date via cron job
4. **Performance**: Indexes pada event_id dan project_id di event_projects table untuk optimasi query
5. **Unique Constraint**: Database memiliki unique constraint pada (event_id, project_id) untuk mencegah duplicate registration

