# Catatan Integrasi IMUII Admin

Dokumen ini menjelaskan integrasi IMUII Admin dengan sistem lain (imuii-server dan imuii-portal) serta hal-hal yang perlu dibuat/diintegrasikan.

**Last Updated**: 2025-01-21

---

## 📋 Overview

IMUII Admin berkomunikasi dengan:
1. **imuii-server** - Backend API untuk data dan operasi
2. **imuii-portal** - Frontend user yang juga menggunakan imuii-server (tidak langsung, tapi share data)

### Arsitektur Integrasi

```
┌─────────────────┐
│  imuii-admin    │ (Frontend Admin)
│  (React + Vite) │
└────────┬────────┘
         │ API Calls
         │ (JWT Admin Token)
         ▼
┌─────────────────┐
│  imuii-server   │ (Backend API)
│  (Go + Fiber)   │
└────────┬────────┘
         │
         ├──► Admin DB (admin, events, monitoring)
         │
         └──► Main DB (projects, portfolios, users)
                │
                │ (Shared Data)
                ▼
         ┌─────────────────┐
         │  imuii-portal    │ (Frontend User)
         │  (React + Vite)  │
         └─────────────────┘
```

---

## 🔌 Integrasi dengan imuii-server

### Base URL
```
http://localhost:8080/api/v1
```
*(Atau sesuai environment variable `VITE_API_BASE_URL`)*

### Authentication
- **Method**: JWT Bearer Token
- **Header**: `Authorization: Bearer <admin_token>`
- **Token Storage**: `localStorage.getItem('admin_token')`
- **Token Key**: `admin_token` (terpisah dari user token di imuii-portal)

### API Endpoints yang Perlu Dibuat di imuii-server

#### 1. Admin Authentication

**Status**: ⚠️ **PERLU DIBUAT**

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

**Catatan:**
- Admin authentication terpisah dari user authentication
- Admin memiliki database sendiri (tabel `admin`)
- Password harus di-hash (bcrypt)

---

#### 2. Monitoring VPS

**Status**: ⚠️ **PERLU DIBUAT**

##### 2.1 Resources Monitoring
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

##### 2.2 Network Monitoring
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

##### 2.3 Service Health
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

##### 2.4 System Health
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

**Catatan:**
- Data monitoring bisa diambil dari system metrics (prometheus, node_exporter, atau custom script)
- Polling interval: 30 detik (configurable di frontend)

---

#### 3. Subdomain Management

**Status**: ⚠️ **PERLU DIBUAT**

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
    },
    {
      "subdomain": "john-portfolio",
      "full_domain": "john-portfolio.imuii.id",
      "source": "portfolio",
      "source_id": "portfolio-uuid",
      "source_name": "John's Portfolio",
      "status": "active",
      "created_at": "2024-01-16T08:00:00Z",
      "updated_at": "2024-01-16T08:00:00Z"
    }
  ]
}
```

**Catatan:**
- Subdomain berasal dari:
  - **Projects**: `Project.Name` → `{name}.imuii.id`
  - **Portfolios**: `Portfolio.DeployURL` atau `Portfolio.DomainName` → `{domain}.imuii.id`
- Endpoint ini harus combine data dari Projects dan Portfolios
- Gunakan utility function `GenerateDomain()` yang sudah ada

---

#### 4. Project Management

**Status**: ⚠️ **PERLU DIBUAT** (atau extend endpoint yang ada)

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
      "deployments": [
        {
          "id": "deployment-uuid",
          "status": "success",
          "created_at": "2024-01-15T10:00:00Z"
        }
      ],
      "created_at": "2024-01-10T08:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 25
}
```

**Catatan:**
- Endpoint ini mirip dengan `GET /api/v1/projects` tapi untuk admin (bisa lihat semua projects)
- Bisa extend endpoint yang sudah ada dengan role-based filtering

---

#### 5. Portfolio Management

**Status**: ⚠️ **PERLU DIBUAT** (atau extend endpoint yang ada)

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

**Catatan:**
- Endpoint ini mirip dengan portfolio endpoints yang ada tapi untuk admin (bisa lihat semua portfolios)

---

#### 6. Event Management

**Status**: ⚠️ **PERLU DIBUAT** (Fitur Baru)

##### 6.1 Get All Events
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

##### 6.2 Get Event Detail
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

##### 6.3 Create Event
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

##### 6.4 Update Event
```
PUT /api/v1/admin/events/:id
```

**Request:** (Same as Create)

**Response:** (Same as Create)

##### 6.5 Delete Event
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

##### 6.6 Get Event Projects
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

**Catatan:**
- Event adalah fitur baru untuk mengelompokkan project
- Perlu membuat tabel `events` di database
- Perlu membuat tabel `event_projects` untuk mapping project ke event (many-to-many)
- Mapping project ke event dilakukan oleh user di imuii-portal (admin hanya melihat)

---

### Database Schema yang Perlu Dibuat

#### 1. Admin Table (Sudah ada di PRD)
```sql
CREATE TABLE admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. Events Table (Baru)
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Event Projects Table (Baru - Many-to-Many)
```sql
CREATE TABLE event_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, project_id)
);
```

**Catatan:**
- Mapping project ke event dilakukan oleh user di imuii-portal
- Admin hanya bisa melihat mapping (read-only)
- Perlu endpoint di imuii-server untuk user register project ke event (di imuii-portal)

---

## 🔗 Integrasi dengan imuii-portal

### Hubungan Tidak Langsung

IMUII Admin **tidak berkomunikasi langsung** dengan imuii-portal. Mereka berbagi data melalui imuii-server:

```
┌──────────────┐         ┌──────────────┐
│ imuii-admin  │         │ imuii-portal │
│   (Admin)    │         │    (User)     │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │ API Calls              │ API Calls
       │ (Admin Token)          │ (User Token)
       ▼                        ▼
       ┌────────────────────────┐
       │    imuii-server        │
       │   (Shared Database)    │
       └────────────────────────┘
```

### Data yang Dibagi

1. **Projects** - Admin melihat semua, User melihat miliknya sendiri
2. **Portfolios** - Admin melihat semua, User melihat miliknya sendiri
3. **Events** - Admin mengelola event, User mendaftarkan project ke event

### Endpoint yang Perlu Dibuat untuk imuii-portal

#### Register Project to Event (User)
```
POST /api/v1/events/:eventId/register
```

**Authentication**: User JWT Token (bukan admin token)

**Request:**
```json
{
  "project_id": "project-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project registered to event successfully"
}
```

**Catatan:**
- User hanya bisa register project miliknya sendiri
- Validasi: project harus exist dan belong to user
- Validasi: event harus exist dan status = "active" atau "upcoming"

#### Unregister Project from Event (User)
```
DELETE /api/v1/events/:eventId/projects/:projectId
```

**Authentication**: User JWT Token

**Response:**
```json
{
  "success": true,
  "message": "Project unregistered from event successfully"
}
```

**Catatan:**
- User hanya bisa unregister project miliknya sendiri

#### Get User's Events (User)
```
GET /api/v1/events/my-events
```

**Authentication**: User JWT Token

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "id": "event-uuid",
      "name": "Hackathon 2024",
      "description": "...",
      "start_date": "...",
      "end_date": "...",
      "status": "active",
      "my_projects": [
        {
          "id": "project-uuid",
          "name": "my-project",
          "registered_at": "..."
        }
      ]
    }
  ]
}
```

**Catatan:**
- Endpoint ini untuk user melihat event yang tersedia dan project mereka yang sudah terdaftar

---

## 📝 Checklist Implementasi

### imuii-server

#### Authentication & Authorization
- [ ] Buat tabel `admin` di database
- [ ] Buat endpoint `POST /api/v1/admin/auth/login`
- [ ] Implementasi JWT token generation untuk admin
- [ ] Buat middleware untuk admin authentication
- [ ] Buat role-based access control (admin vs user)

#### Monitoring
- [ ] Buat endpoint `GET /api/v1/admin/monitoring/resources`
- [ ] Buat endpoint `GET /api/v1/admin/monitoring/network`
- [ ] Buat endpoint `GET /api/v1/admin/monitoring/services`
- [ ] Buat endpoint `GET /api/v1/admin/monitoring/system`
- [ ] Implementasi system metrics collection (CPU, RAM, Disk, Load)
- [ ] Implementasi network metrics collection
- [ ] Implementasi service health check

#### Subdomain Management
- [ ] Buat endpoint `GET /api/v1/admin/subdomains/active`
- [ ] Implementasi logic untuk combine Projects + Portfolios
- [ ] Generate full domain dari Project.Name dan Portfolio.DomainName

#### Project Management
- [ ] Buat/extend endpoint `GET /api/v1/admin/projects/all`
- [ ] Tambahkan pagination support
- [ ] Tambahkan filtering support (status, source, owner)
- [ ] Include owner information dan deployment history

#### Portfolio Management
- [ ] Buat/extend endpoint `GET /api/v1/admin/portfolios/all`
- [ ] Tambahkan pagination support
- [ ] Tambahkan filtering support (status, user)
- [ ] Include user information dan template info

#### Event Management
- [ ] Buat tabel `events` di database
- [ ] Buat tabel `event_projects` di database
- [ ] Buat endpoint `GET /api/v1/admin/events/all`
- [ ] Buat endpoint `GET /api/v1/admin/events/:id`
- [ ] Buat endpoint `POST /api/v1/admin/events`
- [ ] Buat endpoint `PUT /api/v1/admin/events/:id`
- [ ] Buat endpoint `DELETE /api/v1/admin/events/:id`
- [ ] Buat endpoint `GET /api/v1/admin/events/:id/projects`
- [ ] Implementasi CRUD operations untuk events
- [ ] Implementasi project count calculation

#### Event Registration (untuk imuii-portal)
- [ ] Buat endpoint `POST /api/v1/events/:eventId/register` (user endpoint)
- [ ] Buat endpoint `DELETE /api/v1/events/:eventId/projects/:projectId` (user endpoint)
- [ ] Buat endpoint `GET /api/v1/events/my-events` (user endpoint)
- [ ] Implementasi validasi: project belong to user
- [ ] Implementasi validasi: event status

---

### imuii-portal

#### Event Features
- [ ] Buat halaman/list events yang tersedia
- [ ] Buat UI untuk register project ke event
- [ ] Buat UI untuk unregister project dari event
- [ ] Integrasi dengan API endpoints event registration
- [ ] Tampilkan event di project detail page
- [ ] Tampilkan project yang terdaftar di event detail page

---

## 🔐 Security Considerations

### Admin Authentication
- Admin password harus di-hash menggunakan bcrypt
- JWT token untuk admin harus terpisah dari user token
- Admin token harus memiliki expiration time
- Implementasi refresh token (optional, untuk future)

### API Security
- Semua admin endpoints harus protected dengan admin authentication
- Validasi role: hanya admin yang bisa akses admin endpoints
- Rate limiting untuk prevent brute force
- CORS configuration untuk allow imuii-admin domain only

### Data Access
- Admin bisa melihat semua data (projects, portfolios, users)
- User hanya bisa melihat data miliknya sendiri
- Event registration: user hanya bisa register project miliknya sendiri

---

## 🚀 Deployment Notes

### Environment Variables

#### imuii-admin
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

#### imuii-server
```env
ADMIN_JWT_SECRET=<secret_key_for_admin_tokens>
ADMIN_DB_HOST=localhost
ADMIN_DB_PORT=5432
ADMIN_DB_NAME=imuii_admin
ADMIN_DB_USER=admin_user
ADMIN_DB_PASSWORD=<password>
```

### Database Migration
- Buat migration untuk tabel `admin`
- Buat migration untuk tabel `events`
- Buat migration untuk tabel `event_projects`
- Seed initial admin user (jika perlu)

---

## 📚 Referensi

- [PRD.md](../PRD.md) - Product Requirements Document
- [API_DOCUMENTATION.md](../../imuii-server/API_DOCUMENTATION.md) - imuii-server API docs
- [planning/08-event-management.md](../planning/08-event-management.md) - Event Management planning

---

**Status**: 📝 Draft - Perlu review dan update sesuai implementasi
