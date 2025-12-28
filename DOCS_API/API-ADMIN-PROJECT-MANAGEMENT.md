# 📚 API Documentation: Admin Project Management

Dokumentasi lengkap untuk API endpoints Admin Project Management yang memungkinkan admin melihat semua projects dengan filtering dan pagination support.

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Base Information](#base-information)
3. [Authentication](#authentication)
4. [Endpoints](#endpoints)
   - [Get All Projects](#1-get-all-projects)
5. [Data Models](#data-models)
6. [Filtering & Pagination](#filtering--pagination)
7. [Error Handling](#error-handling)
8. [Examples](#examples)

---

## Overview

Admin Project Management API memungkinkan admin untuk:
- Melihat semua projects tanpa filter owner (admin bisa lihat semua projects)
- Filter projects berdasarkan status, source, dan owner_id
- Melihat informasi owner untuk setiap project
- Melihat deployment history untuk setiap project
- Pagination support untuk handle large datasets

### Perbedaan dengan User Endpoint

- **User Endpoint** (`GET /api/v1/projects?owner_id=xxx`): Hanya menampilkan projects milik user tersebut
- **Admin Endpoint** (`GET /api/v1/admin/projects/all`): Menampilkan semua projects dari semua users

---

## Base Information

### Base URL
```
http://localhost:8080/api/v1
```

### Project Status Values

- `pending` - Baru dibuat, belum di-deploy
- `initialized` - Webhook pertama sudah di-skip, siap untuk auto-deploy
- `building` - Sedang build
- `deployed` - Berhasil di-deploy
- `failed` - Gagal build/deploy
- `inactive` - Nonaktif

### Project Source Values

- `cli` - Created via CLI
- `web` - Imported via Web

---

## Authentication

### Admin Authentication Required

Semua endpoint admin project management memerlukan **Admin JWT Token**.

**Header:**
```http
Authorization: Bearer <admin_jwt_token>
```

Token diperoleh melalui endpoint:
```http
POST /api/v1/admin/auth/login
```

---

## Endpoints

### 1. Get All Projects

Mendapatkan semua projects dengan filtering dan pagination support. Admin bisa melihat semua projects dari semua users.

**Endpoint:**
```http
GET /api/v1/admin/projects/all
```

**Authentication:** Required (Admin)

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (min: 1) |
| `limit` | integer | No | 25 | Items per page (min: 1, max: 100) |
| `status` | string | No | - | Filter by status: `pending`, `initialized`, `building`, `deployed`, `failed`, `inactive` |
| `source` | string | No | - | Filter by source: `cli`, `web` |
| `owner_id` | string | No | - | Filter by owner ID (user ID) |

**Query Parameter Notes:**
- Semua filter optional dan bisa dikombinasikan
- `page` dan `limit` digunakan untuk pagination
- Jika `limit` > 100, akan di-set ke 100
- Jika `page` < 1, akan di-set ke 1

**Success Response (200):**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": {
    "success": true,
    "projects": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "my-project",
        "description": "Project description here",
        "repo_url": "https://github.com/user/my-project.git",
        "status": "deployed",
        "source": "cli",
        "domain": "my-project.imuii.id",
        "deploy_url": "https://my-project.imuii.id",
        "owner": {
          "id": "user-id-123",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "deployments": [
          {
            "id": "660e8400-e29b-41d4-a716-446655440001",
            "status": "success",
            "created_at": "2024-01-15T10:00:00Z"
          },
          {
            "id": "660e8400-e29b-41d4-a716-446655440002",
            "status": "success",
            "created_at": "2024-01-14T08:00:00Z"
          }
        ],
        "showcase_title": "My Awesome Project",
        "showcase_description": "This is an awesome project",
        "team_members": [
          {
            "name": "John Doe",
            "email": "john@example.com",
            "role": "Developer"
          }
        ],
        "youtube_link": "https://youtube.com/watch?v=xxx",
        "thumbnail_url": "https://example.com/thumbnail.jpg",
        "tags": ["web", "react", "nodejs"],
        "is_showcased": true,
        "created_at": "2024-01-10T08:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 25
  }
}
```

**Response Fields:**

**Project Fields:**
- `id` (string) - UUID project
- `name` (string) - Nama project
- `description` (string) - Deskripsi project
- `repo_url` (string) - URL repository GitHub
- `status` (string) - Status project (pending, initialized, building, deployed, failed, inactive)
- `source` (string) - Source project (cli, web)
- `domain` (string, optional) - Domain project (jika deployed)
- `deploy_url` (string, optional) - Deploy URL (jika deployed)
- `owner` (object) - Informasi owner:
  - `id` (string) - User ID
  - `name` (string) - Nama user
  - `email` (string) - Email user
- `deployments` (array) - Deployment history (limit 5 terbaru):
  - `id` (string) - Deployment ID
  - `status` (string) - Deployment status
  - `created_at` (datetime) - Waktu deployment
- `showcase_title` (string, optional) - Judul untuk showcase
- `showcase_description` (string, optional) - Deskripsi untuk showcase
- `team_members` (array, optional) - Array of {name, email, role}
- `youtube_link` (string, optional) - Link YouTube
- `thumbnail_url` (string, optional) - URL thumbnail
- `tags` (array, optional) - Array of strings
- `is_showcased` (boolean) - Apakah project di-showcase
- `created_at` (datetime) - Waktu dibuat
- `updated_at` (datetime) - Waktu terakhir diupdate

**Pagination Fields:**
- `total` (integer) - Total jumlah projects (setelah filter)
- `page` (integer) - Current page number
- `limit` (integer) - Items per page

**Error Responses:**

**401 Unauthorized - Missing Token:**
```json
{
  "success": false,
  "message": "Authorization header required",
  "code": 401
}
```

**401 Unauthorized - Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired admin token",
  "code": 401
}
```

**400 Bad Request - Invalid Query Parameters:**
```json
{
  "success": false,
  "message": "Invalid query parameters",
  "code": 400,
  "error": "limit must be between 1 and 100"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to retrieve projects",
  "code": 500
}
```

**Notes:**
- Projects diurutkan berdasarkan `created_at` DESC (newest first)
- Deployment history dibatasi 5 terbaru untuk performance
- Owner information selalu di-include
- Filter bisa dikombinasikan (contoh: `?status=deployed&source=cli&owner_id=xxx`)

---

## Data Models

### AdminProjectListResponse
```typescript
{
  success: boolean;
  projects: AdminProjectResponse[];
  total: number;      // Total projects after filters
  page: number;       // Current page
  limit: number;     // Items per page
}
```

### AdminProjectResponse
```typescript
{
  id: string;                    // UUID
  name: string;
  description: string;
  repo_url: string;
  status: "pending" | "initialized" | "building" | "deployed" | "failed" | "inactive";
  source: "cli" | "web";
  domain?: string;               // Optional, if deployed
  deploy_url?: string;           // Optional, if deployed
  owner: OwnerInfo;
  deployments: DeploymentInfo[];  // Max 5 latest
  showcase_title?: string;
  showcase_description?: string;
  team_members?: Array<{name: string, email: string, role: string}>;
  youtube_link?: string;
  thumbnail_url?: string;
  tags?: string[];
  is_showcased: boolean;
  created_at: datetime;
  updated_at: datetime;
}
```

### OwnerInfo
```typescript
{
  id: string;      // User ID
  name: string;    // User name
  email: string;   // User email
}
```

### DeploymentInfo
```typescript
{
  id: string;           // Deployment ID
  status: string;       // Deployment status
  created_at: datetime; // Deployment time
}
```

---

## Filtering & Pagination

### Filtering

Filter bisa dikombinasikan untuk mendapatkan hasil yang lebih spesifik:

**Filter by Status:**
```
?status=deployed
```

**Filter by Source:**
```
?source=cli
```

**Filter by Owner:**
```
?owner_id=user-id-123
```

**Multiple Filters:**
```
?status=deployed&source=cli&owner_id=user-id-123
```

### Pagination

Pagination menggunakan `page` dan `limit`:

**Basic Pagination:**
```
?page=1&limit=25
```

**Next Page:**
```
?page=2&limit=25
```

**Pagination Rules:**
- `page` minimum: 1 (default: 1)
- `limit` minimum: 1, maximum: 100 (default: 25)
- Jika `limit` > 100, akan di-set ke 100
- Jika `page` < 1, akan di-set ke 1
- Total pages dapat dihitung: `Math.ceil(total / limit)`

### Combining Filters and Pagination

```
?status=deployed&source=cli&page=1&limit=10
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "code": 400,
  "error": "Detailed error information (optional)"
}
```

### HTTP Status Codes

- `200 OK` - Request berhasil
- `400 Bad Request` - Request tidak valid (invalid query parameters)
- `401 Unauthorized` - Tidak terautentikasi atau token tidak valid
- `500 Internal Server Error` - Server error

---

## Examples

### Example 1: Get All Projects (No Filters)

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/projects/all?page=1&limit=25" \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": {
    "success": true,
    "projects": [...],
    "total": 100,
    "page": 1,
    "limit": 25
  }
}
```

### Example 2: Filter by Status

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/projects/all?status=deployed" \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": {
    "success": true,
    "projects": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "my-project",
        "status": "deployed",
        ...
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 25
  }
}
```

### Example 3: Filter by Source

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/projects/all?source=cli" \
  -H "Authorization: Bearer <admin_token>"
```

### Example 4: Filter by Owner

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/projects/all?owner_id=user-id-123" \
  -H "Authorization: Bearer <admin_token>"
```

### Example 5: Multiple Filters with Pagination

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/projects/all?status=deployed&source=cli&page=1&limit=10" \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": {
    "success": true,
    "projects": [...],
    "total": 30,
    "page": 1,
    "limit": 10
  }
}
```

### Example 6: Access Without Token (401)

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/projects/all"
```

**Response:**
```json
{
  "success": false,
  "message": "Authorization header required",
  "code": 401
}
```

### Example 7: Invalid Limit (400)

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/projects/all?limit=200" \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "success": false,
  "message": "Invalid query parameters",
  "code": 400,
  "error": "limit must be between 1 and 100"
}
```

---

## Implementation Notes

### Performance Considerations

1. **Database Indexing**
   - Disarankan membuat index pada kolom `status`, `source`, dan `owner_id` untuk performa query yang lebih baik
   - Index pada `created_at` untuk sorting

2. **Deployment History Limiting**
   - Deployment history dibatasi 5 terbaru untuk menghindari response yang terlalu besar
   - Jika perlu semua deployments, gunakan endpoint detail project

3. **Pagination**
   - Default limit 25 untuk balance antara performance dan usability
   - Maximum limit 100 untuk prevent abuse

### Filtering Logic

- Semua filter optional
- Filter bisa dikombinasikan dengan AND logic
- Filter case-sensitive untuk status dan source
- Owner ID harus exact match

### Owner Information

- Owner information selalu di-include untuk admin view
- Hanya include minimal info (id, name, email) untuk avoid circular reference
- Owner di-preload dari users table

---

## Related Documentation

- [Admin Authentication API](./API-ADMIN-AUTHENTICATION.md)
- [Subdomain Management API](./API-SUBDOMAIN-MANAGEMENT.md)
- [Admin Portfolio Management API](./API-ADMIN-PORTFOLIO-MANAGEMENT.md)

---

**Last Updated:** 2024-01-15  
**Version:** 1.0.0

