# API Endpoints Reference

Dokumen ini berisi daftar lengkap semua API endpoints yang digunakan di IMUII Admin, sesuai dengan `catatan/INTEGRASI.md`.

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication

### Login
```
POST /api/v1/admin/auth/login
```

**Request:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "admin-uuid",
    "username": "admin",
    "role": "admin",
    "email": "admin@imuii.id"
  }
}
```

**Headers:**
- `Authorization: Bearer <admin_token>` (untuk semua request setelah login)

---

## Monitoring Endpoints

### Resources Monitoring
```
GET /api/v1/admin/monitoring/resources
```

**Response:**
```json
{
  "cpu": {
    "value": 45.5,
    "unit": "%",
    "used": 2.3,
    "total": 5.0,
    "loadAverage": [1.2, 1.5, 1.8]
  },
  "ram": {
    "value": 62.3,
    "unit": "%",
    "used": 8.1,
    "total": 13.0,
    "unit": "GB"
  },
  "disk": {
    "value": 78.5,
    "unit": "%",
    "used": 157.0,
    "total": 200.0,
    "unit": "GB"
  },
  "load": {
    "value": 1.5,
    "loadAverage": [1.2, 1.5, 1.8]
  }
}
```

### Network Monitoring
```
GET /api/v1/admin/monitoring/network
```

**Response:**
```json
{
  "incoming": 1024000,
  "outgoing": 512000,
  "packetLoss": 0.1,
  "latency": 15
}
```

### Service Health
```
GET /api/v1/admin/monitoring/services
```

**Response:**
```json
{
  "serverStatus": "up",
  "responseTime": 120,
  "errorRate": 0.5,
  "queueStatus": "healthy"
}
```

### System Health
```
GET /api/v1/admin/monitoring/system
```

**Response:**
```json
{
  "uptime": 86400,
  "lastReboot": "2024-01-15T10:00:00Z",
  "osInfo": {
    "name": "Ubuntu",
    "version": "22.04 LTS"
  },
  "timeSync": "synced"
}
```

---

## Subdomain Management

### Get Active Subdomains
```
GET /api/v1/admin/subdomains/active
```

**Response:**
```json
{
  "success": true,
  "subdomains": [
    {
      "subdomain": "my-project",
      "full_domain": "my-project.imuii.id",
      "source": "project",
      "source_id": "project-uuid",
      "source_name": "My Project",
      "status": "active",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Get All Subdomains (Including Reserved)
```
GET /api/v1/admin/subdomains/all
```

**Response:** (Same format as active, but includes reserved subdomains)

### Reserve Subdomain (Custom Feature)
```
POST /api/v1/admin/subdomains/reserve
```

**Request:**
```json
{
  "subdomain": "my-reserved-subdomain"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reserved-id",
    "subdomain": "my-reserved-subdomain",
    "full_domain": "my-reserved-subdomain.imuii.id",
    "source": "reserved",
    "status": "reserved",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

### Release Reserved Subdomain (Custom Feature)
```
DELETE /api/v1/admin/subdomains/:id/release
```

**Response:**
```json
{
  "success": true
}
```

---

## Project Management

### Get All Projects
```
GET /api/v1/admin/projects/all
```

**Query Parameters:**
- `page` - Page number (optional)
- `limit` - Items per page (optional)
- `status` - Filter by status (optional)
- `source` - Filter by source: cli/web (optional)
- `owner_id` - Filter by owner ID (optional)

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "id": "project-uuid",
      "name": "my-project",
      "description": "Project description",
      "repo_url": "https://github.com/user/my-project",
      "status": "deployed",
      "source": "cli",
      "owner": {
        "id": "user-id",
        "email": "user@example.com",
        "name": "User Name"
      },
      "deployments": [...],
      "created_at": "2024-01-10T08:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 25
}
```

---

## Portfolio Management

### Get All Portfolios
```
GET /api/v1/admin/portfolios/all
```

**Query Parameters:**
- `page` - Page number (optional)
- `limit` - Items per page (optional)
- `status` - Filter by status: draft/deployed (optional)
- `user_id` - Filter by user ID (optional)

**Response:**
```json
{
  "success": true,
  "portfolios": [
    {
      "id": "portfolio-uuid",
      "name": "John's Portfolio",
      "domain_name": "john-portfolio",
      "deploy_url": "https://john-portfolio.imuii.id",
      "status": "deployed",
      "user": {
        "id": "user-id",
        "email": "john@example.com",
        "name": "John Doe"
      },
      "template": {
        "id": "template-id",
        "name": "Modern Portfolio"
      },
      "cv_data_id": "cv-data-uuid",
      "created_at": "2024-01-10T08:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 25
}
```

---

## Event Management

### Get All Events
```
GET /api/v1/admin/events/all
```

**Query Parameters:**
- `page` - Page number (optional)
- `limit` - Items per page (optional)
- `status` - Filter by status (optional)

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "id": "event-uuid",
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
}
```

### Get Event Detail
```
GET /api/v1/admin/events/:id
```

**Response:**
```json
{
  "id": "event-uuid",
  "name": "Hackathon 2024",
  "description": "Annual hackathon competition",
  "start_date": "2024-01-15T00:00:00Z",
  "end_date": "2024-01-20T23:59:59Z",
  "status": "active",
  "created_at": "2024-01-10T10:00:00Z",
  "updated_at": "2024-01-10T10:00:00Z"
}
```

### Create Event
```
POST /api/v1/admin/events
```

**Request:**
```json
{
  "name": "Hackathon 2024",
  "description": "Annual hackathon competition",
  "start_date": "2024-01-15T00:00:00Z",
  "end_date": "2024-01-20T23:59:59Z",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "event": {
    "id": "event-uuid",
    "name": "Hackathon 2024",
    ...
  }
}
```

### Update Event
```
PUT /api/v1/admin/events/:id
```

**Request:** (Same as Create)

**Response:** (Same as Create)

### Delete Event
```
DELETE /api/v1/admin/events/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

### Get Event Projects
```
GET /api/v1/admin/events/:id/projects
```

**Response:**
```json
{
  "success": true,
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

---

## Template Uploader Management

### Get All Template Uploaders
```
GET /api/v1/admin/template-uploaders
```

**Query Parameters:**
- `page` - Page number (optional, default: 1)
- `limit` - Items per page (optional, default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "uploaders": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "uploader1",
        "email": "uploader@example.com",
        "name": "John Doe",
        "is_active": true,
        "last_login_at": "2024-01-20T10:00:00Z",
        "created_at": "2024-01-15T10:00:00Z"
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 10
  },
  "message": "Uploaders retrieved successfully"
}
```

### Get All Templates (For Filtering by Uploader)
```
GET /api/v1/admin/templates/all
```

**Query Parameters:**
- `page` - Page number (optional)
- `limit` - Items per page (optional)
- `uploader_id` - Filter by uploader ID (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "template123",
        "name": "Modern Portfolio",
        "description": "A modern portfolio template",
        "html_template": "<html>...</html>",
        "thumbnail_url": "https://example.com/thumb.jpg",
        "fields": {},
        "user_id": null,
        "user": null,
        "uploader_id": "550e8400-e29b-41d4-a716-446655440000",
        "uploader": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "username": "uploader1",
          "email": "uploader@example.com",
          "name": "John Doe",
          "is_active": true,
          "created_at": "2024-01-15T10:00:00Z"
        },
        "owner_type": "uploader",
        "sections": [],
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10
  },
  "message": "Templates retrieved successfully"
}
```

**Note:** Untuk melihat template yang diupload oleh uploader tertentu, filter response dengan `uploader_id` di frontend atau gunakan query parameter `uploader_id` jika backend mendukung.

---

## Notes

- Semua endpoint memerlukan authentication header: `Authorization: Bearer <admin_token>`
- Token disimpan di `localStorage.getItem('admin_token')`
- Response structures sudah disesuaikan dengan `catatan/INTEGRASI.md`
- Mock data tetap tersedia untuk development tanpa backend
