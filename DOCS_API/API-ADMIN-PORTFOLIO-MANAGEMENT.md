# 📚 API Documentation: Admin Portfolio Management

Dokumentasi lengkap untuk API endpoints Admin Portfolio Management yang memungkinkan admin melihat semua portfolios dengan filtering dan pagination support.

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Base Information](#base-information)
3. [Authentication](#authentication)
4. [Endpoints](#endpoints)
   - [Get All Portfolios](#1-get-all-portfolios)
5. [Data Models](#data-models)
6. [Filtering & Pagination](#filtering--pagination)
7. [Error Handling](#error-handling)
8. [Examples](#examples)

---

## Overview

Admin Portfolio Management API memungkinkan admin untuk:
- Melihat semua portfolios tanpa filter user (admin bisa lihat semua portfolios)
- Filter portfolios berdasarkan status dan user_id
- Melihat informasi user untuk setiap portfolio
- Melihat template information untuk setiap portfolio
- Pagination support untuk handle large datasets

### Perbedaan dengan User Endpoint

- **User Endpoint** (`GET /api/v1/portfolios?user_id=xxx`): Hanya menampilkan portfolios milik user tersebut
- **Admin Endpoint** (`GET /api/v1/admin/portfolios/all`): Menampilkan semua portfolios dari semua users

---

## Base Information

### Base URL
```
http://localhost:8080/api/v1
```

### Portfolio Status Values

- `draft` - Portfolio masih dalam draft, belum di-deploy
- `deployed` - Portfolio sudah di-deploy

---

## Authentication

### Admin Authentication Required

Semua endpoint admin portfolio management memerlukan **Admin JWT Token**.

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

### 1. Get All Portfolios

Mendapatkan semua portfolios dengan filtering dan pagination support. Admin bisa melihat semua portfolios dari semua users.

**Endpoint:**
```http
GET /api/v1/admin/portfolios/all
```

**Authentication:** Required (Admin)

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (min: 1) |
| `limit` | integer | No | 25 | Items per page (min: 1, max: 100) |
| `status` | string | No | - | Filter by status: `draft`, `deployed` |
| `user_id` | string | No | - | Filter by user ID |

**Query Parameter Notes:**
- Semua filter optional dan bisa dikombinasikan
- `page` dan `limit` digunakan untuk pagination
- Jika `limit` > 100, akan di-set ke 100
- Jika `page` < 1, akan di-set ke 1

**Success Response (200):**
```json
{
  "success": true,
  "message": "Portfolios retrieved successfully",
  "data": {
    "success": true,
    "portfolios": [
      {
        "id": "portfolio-123",
        "name": "John's Portfolio",
        "domain_name": "john-portfolio",
        "deploy_url": "https://john-portfolio.imuii.id",
        "status": "deployed",
        "user": {
          "id": "user-id-123",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "template": {
          "id": "template-456",
          "name": "Modern Portfolio"
        },
        "cv_data_id": "cv-data-789",
        "showcase_title": "John's Professional Portfolio",
        "showcase_description": "A modern portfolio showcasing my work",
        "team_members": [
          {
            "name": "John Doe",
            "email": "john@example.com",
            "role": "Developer"
          }
        ],
        "youtube_link": "https://youtube.com/watch?v=xxx",
        "thumbnail_url": "https://example.com/thumbnail.jpg",
        "tags": ["portfolio", "web", "design"],
        "is_showcased": true,
        "created_at": "2024-01-10T08:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 25
  }
}
```

**Response Fields:**

**Portfolio Fields:**
- `id` (string) - Portfolio ID
- `name` (string) - Nama portfolio
- `domain_name` (string, optional) - Custom domain name (tanpa .imuii.id)
- `deploy_url` (string, optional) - Deploy URL (jika deployed)
- `status` (string) - Status portfolio (draft, deployed)
- `user` (object) - Informasi user:
  - `id` (string) - User ID
  - `name` (string) - Nama user
  - `email` (string) - Email user
- `template` (object) - Informasi template:
  - `id` (string) - Template ID
  - `name` (string) - Nama template
- `cv_data_id` (string, optional) - CV Data ID yang digunakan (jika ada)
- `showcase_title` (string, optional) - Judul untuk showcase
- `showcase_description` (string, optional) - Deskripsi untuk showcase
- `team_members` (array, optional) - Array of {name, email, role}
- `youtube_link` (string, optional) - Link YouTube
- `thumbnail_url` (string, optional) - URL thumbnail
- `tags` (array, optional) - Array of strings
- `is_showcased` (boolean) - Apakah portfolio di-showcase
- `created_at` (datetime) - Waktu dibuat
- `updated_at` (datetime) - Waktu terakhir diupdate

**Pagination Fields:**
- `total` (integer) - Total jumlah portfolios (setelah filter)
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
  "message": "Failed to retrieve portfolios",
  "code": 500
}
```

**Notes:**
- Portfolios diurutkan berdasarkan `created_at` DESC (newest first)
- User information selalu di-include
- Template information selalu di-include
- Filter bisa dikombinasikan (contoh: `?status=deployed&user_id=xxx`)

---

## Data Models

### AdminPortfolioListResponse
```typescript
{
  success: boolean;
  portfolios: AdminPortfolioResponse[];
  total: number;      // Total portfolios after filters
  page: number;       // Current page
  limit: number;      // Items per page
}
```

### AdminPortfolioResponse
```typescript
{
  id: string;
  name: string;
  domain_name?: string;        // Optional, custom domain
  deploy_url?: string;          // Optional, if deployed
  status: "draft" | "deployed";
  user: UserInfo;
  template: TemplateInfo;
  cv_data_id?: string;         // Optional, CV data ID
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

### UserInfo
```typescript
{
  id: string;      // User ID
  name: string;    // User name
  email: string;   // User email
}
```

### TemplateInfo
```typescript
{
  id: string;      // Template ID
  name: string;    // Template name
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

**Filter by User:**
```
?user_id=user-id-123
```

**Multiple Filters:**
```
?status=deployed&user_id=user-id-123
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
?status=deployed&user_id=user-id-123&page=1&limit=10
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

### Example 1: Get All Portfolios (No Filters)

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/portfolios/all?page=1&limit=25" \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolios retrieved successfully",
  "data": {
    "success": true,
    "portfolios": [...],
    "total": 50,
    "page": 1,
    "limit": 25
  }
}
```

### Example 2: Filter by Status

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/portfolios/all?status=deployed" \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolios retrieved successfully",
  "data": {
    "success": true,
    "portfolios": [
      {
        "id": "portfolio-123",
        "name": "John's Portfolio",
        "status": "deployed",
        "deploy_url": "https://john-portfolio.imuii.id",
        ...
      }
    ],
    "total": 30,
    "page": 1,
    "limit": 25
  }
}
```

### Example 3: Filter by User

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/portfolios/all?user_id=user-id-123" \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolios retrieved successfully",
  "data": {
    "success": true,
    "portfolios": [
      {
        "id": "portfolio-123",
        "name": "John's Portfolio",
        "user": {
          "id": "user-id-123",
          "name": "John Doe",
          "email": "john@example.com"
        },
        ...
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 25
  }
}
```

### Example 4: Multiple Filters with Pagination

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/portfolios/all?status=deployed&user_id=user-id-123&page=1&limit=10" \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolios retrieved successfully",
  "data": {
    "success": true,
    "portfolios": [...],
    "total": 3,
    "page": 1,
    "limit": 10
  }
}
```

### Example 5: Access Without Token (401)

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/portfolios/all"
```

**Response:**
```json
{
  "success": false,
  "message": "Authorization header required",
  "code": 401
}
```

### Example 6: Invalid Limit (400)

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/admin/portfolios/all?limit=200" \
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
   - Disarankan membuat index pada kolom `status` dan `user_id` untuk performa query yang lebih baik
   - Index pada `created_at` untuk sorting

2. **Pagination**
   - Default limit 25 untuk balance antara performance dan usability
   - Maximum limit 100 untuk prevent abuse

3. **Preloading Relations**
   - User dan Template di-preload untuk menghindari N+1 query problem
   - Preload dilakukan dengan GORM Preload

### Filtering Logic

- Semua filter optional
- Filter bisa dikombinasikan dengan AND logic
- Filter case-sensitive untuk status
- User ID harus exact match

### User and Template Information

- User information selalu di-include untuk admin view
- Template information selalu di-include untuk admin view
- Hanya include minimal info (id, name, email untuk user; id, name untuk template) untuk avoid circular reference
- User dan Template di-preload dari related tables

### Domain and Deploy URL

- `domain_name` adalah custom domain name tanpa base domain (e.g., "john-portfolio")
- `deploy_url` adalah full URL jika portfolio sudah deployed (e.g., "https://john-portfolio.imuii.id")
- Jika portfolio status `draft`, `deploy_url` akan null

---

## Related Documentation

- [Admin Authentication API](./API-ADMIN-AUTHENTICATION.md)
- [Subdomain Management API](./API-SUBDOMAIN-MANAGEMENT.md)
- [Admin Project Management API](./API-ADMIN-PROJECT-MANAGEMENT.md)

---

**Last Updated:** 2024-01-15  
**Version:** 1.0.0

