# 📚 API Documentation: Subdomain Management

Dokumentasi lengkap untuk API endpoints Subdomain Management yang mengintegrasikan subdomain dari Projects, Portfolios, dan Reserved Subdomains.

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Base Information](#base-information)
3. [Authentication](#authentication)
4. [Endpoints](#endpoints)
   - [Get Active Subdomains](#1-get-active-subdomains)
   - [Reserve Subdomain](#2-reserve-subdomain)
   - [Get Reserved Subdomains](#3-get-reserved-subdomains)
   - [Delete Reserved Subdomain](#4-delete-reserved-subdomain)
   - [Check Subdomain Availability](#5-check-subdomain-availability)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Examples](#examples)

---

## Overview

Subdomain Management API memungkinkan admin untuk:
- Melihat semua subdomain aktif dari Projects (status deployed), Portfolios (status deployed), dan Reserved Subdomains
- Reserve subdomain terlebih dahulu sebelum digunakan
- Mengelola reserved subdomains (list, delete)
- Mengecek ketersediaan subdomain dari 3 sumber sekaligus

### Sumber Subdomain

Subdomain aktif diambil dari 3 sumber:
1. **Projects** - Hanya projects dengan status `deployed`
2. **Portfolios** - Hanya portfolios dengan status `deployed`
3. **Reserved Subdomains** - Semua subdomain yang di-reserve oleh admin

---

## Base Information

### Base URL
```
http://localhost:8080/api/v1
```

### Base Domain
Default base domain adalah `imuii.id`. Dapat dikonfigurasi melalui environment variable `BASE_DOMAIN`.

---

## Authentication

### Admin Authentication

Semua endpoint subdomain management (kecuali Check Availability) memerlukan **Admin JWT Token**.

**Header:**
```http
Authorization: Bearer <admin_jwt_token>
```

Token diperoleh melalui endpoint:
```http
POST /api/v1/admin/auth/login
```

### Public Endpoint

Endpoint **Check Subdomain Availability** adalah public dan tidak memerlukan authentication.

---

## Endpoints

### 1. Get Active Subdomains

Mendapatkan semua subdomain aktif dari Projects, Portfolios, dan Reserved Subdomains.

**Endpoint:**
```http
GET /api/v1/admin/subdomains/active
```

**Authentication:** Required (Admin)

**Response:**
```json
{
  "success": true,
  "message": "Active subdomains retrieved successfully",
  "data": {
    "success": true,
    "subdomains": [
      {
        "subdomain": "my-project",
        "full_domain": "my-project.imuii.id",
        "source": "project",
        "source_id": "550e8400-e29b-41d4-a716-446655440000",
        "source_name": "My Project",
        "status": "active",
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
      },
      {
        "subdomain": "portfolio-demo",
        "full_domain": "portfolio-demo.imuii.id",
        "source": "portfolio",
        "source_id": "portfolio-123",
        "source_name": "Portfolio Demo",
        "status": "active",
        "created_at": "2024-01-14T08:00:00Z",
        "updated_at": "2024-01-14T08:00:00Z"
      },
      {
        "subdomain": "reserved-domain",
        "full_domain": "reserved-domain.imuii.id",
        "source": "reserved",
        "source_id": "660e8400-e29b-41d4-a716-446655440001",
        "source_name": "Reserved",
        "status": "active",
        "created_at": "2024-01-13T12:00:00Z",
        "updated_at": "2024-01-13T12:00:00Z"
      }
    ]
  }
}
```

**Response Fields:**
- `subdomain` (string) - Subdomain tanpa base domain (e.g., "my-project")
- `full_domain` (string) - Full domain dengan base domain (e.g., "my-project.imuii.id")
- `source` (string) - Sumber subdomain: `"project"`, `"portfolio"`, atau `"reserved"`
- `source_id` (string) - ID dari source (Project ID, Portfolio ID, atau Reserved Subdomain ID)
- `source_name` (string) - Nama dari source (Project name, Portfolio name, atau "Reserved")
- `status` (string) - Status subdomain, selalu `"active"`
- `created_at` (datetime) - Waktu dibuat
- `updated_at` (datetime) - Waktu terakhir diupdate

**Notes:**
- Subdomains diurutkan berdasarkan `created_at` (newest first)
- Hanya projects dengan status `deployed` yang ditampilkan
- Hanya portfolios dengan status `deployed` yang ditampilkan
- Semua reserved subdomains dianggap aktif

---

### 2. Reserve Subdomain

Reserve subdomain untuk digunakan di masa depan. Subdomain yang di-reserve tidak bisa digunakan oleh project atau portfolio.

**Endpoint:**
```http
POST /api/v1/admin/subdomains/reserve
```

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "subdomain": "my-reserved-domain",
  "reason": "Reserved for special project"
}
```

**Request Fields:**
- `subdomain` (string, required) - Subdomain yang ingin di-reserve (1-63 karakter, alphanumeric + hyphen, lowercase)
- `reason` (string, optional) - Alasan reserve subdomain

**Validation Rules:**
- Subdomain harus 1-63 karakter
- Hanya boleh mengandung lowercase alphanumeric dan hyphen
- Tidak boleh dimulai atau diakhiri dengan hyphen
- Harus unique (tidak boleh sudah digunakan oleh project/portfolio/reserved)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Subdomain reserved successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "subdomain": "my-reserved-domain",
    "full_domain": "my-reserved-domain.imuii.id",
    "reserved_by": "550e8400-e29b-41d4-a716-446655440000",
    "reason": "Reserved for special project",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

**Error Responses:**

**400 Bad Request - Subdomain already exists:**
```json
{
  "success": false,
  "message": "Subdomain already exists or is reserved",
  "code": 400
}
```

**400 Bad Request - Invalid format:**
```json
{
  "success": false,
  "message": "Validation failed",
  "code": 400,
  "error": "subdomain must contain only lowercase alphanumeric characters and hyphens"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Admin authentication required",
  "code": 401
}
```

---

### 3. Get Reserved Subdomains

Mendapatkan semua subdomain yang di-reserve oleh admin.

**Endpoint:**
```http
GET /api/v1/admin/subdomains/reserved
```

**Authentication:** Required (Admin)

**Response:**
```json
{
  "success": true,
  "message": "Reserved subdomains retrieved successfully",
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "subdomain": "my-reserved-domain",
      "full_domain": "my-reserved-domain.imuii.id",
      "reserved_by": "550e8400-e29b-41d4-a716-446655440000",
      "reason": "Reserved for special project",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "subdomain": "another-reserved",
      "full_domain": "another-reserved.imuii.id",
      "reserved_by": "550e8400-e29b-41d4-a716-446655440000",
      "reason": null,
      "created_at": "2024-01-14T08:00:00Z",
      "updated_at": "2024-01-14T08:00:00Z"
    }
  ]
}
```

**Response Fields:**
- `id` (string) - UUID reserved subdomain
- `subdomain` (string) - Subdomain tanpa base domain
- `full_domain` (string) - Full domain dengan base domain
- `reserved_by` (string) - UUID admin yang me-reserve
- `reason` (string|null) - Alasan reserve (optional)
- `created_at` (datetime) - Waktu dibuat
- `updated_at` (datetime) - Waktu terakhir diupdate

---

### 4. Delete Reserved Subdomain

Menghapus reserved subdomain. Setelah dihapus, subdomain tersebut bisa digunakan oleh project atau portfolio.

**Endpoint:**
```http
DELETE /api/v1/admin/subdomains/reserved/:id
```

**Authentication:** Required (Admin)

**Path Parameters:**
- `id` (string, required) - UUID reserved subdomain yang ingin dihapus

**Success Response (200):**
```json
{
  "success": true,
  "message": "Reserved subdomain deleted successfully"
}
```

**Error Responses:**

**400 Bad Request - Invalid ID format:**
```json
{
  "success": false,
  "message": "Invalid reserved subdomain ID format",
  "code": 400
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Reserved subdomain not found",
  "code": 404
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Admin authentication required",
  "code": 401
}
```

---

### 5. Check Subdomain Availability

Mengecek ketersediaan subdomain dari 3 sumber: Projects (deployed), Portfolios (deployed), dan Reserved Subdomains.

**Endpoint:**
```http
GET /api/v1/subdomain/check?subdomain=my-domain
```

**Authentication:** Not Required (Public)

**Query Parameters:**
- `subdomain` (string, required) - Subdomain yang ingin dicek

**Success Response (200) - Available:**
```json
{
  "success": true,
  "message": "Subdomain availability checked",
  "data": {
    "available": true,
    "subdomain": "my-domain",
    "message": "Subdomain 'my-domain' is available"
  }
}
```

**Success Response (200) - Not Available:**
```json
{
  "success": true,
  "message": "Subdomain availability checked",
  "data": {
    "available": false,
    "subdomain": "my-domain",
    "message": "Subdomain 'my-domain' is already taken"
  }
}
```

**Error Responses:**

**400 Bad Request - Missing parameter:**
```json
{
  "success": false,
  "message": "subdomain parameter is required",
  "code": 400
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to check subdomain availability",
  "code": 500
}
```

**Notes:**
- Endpoint ini mengecek dari 3 sumber:
  1. Projects dengan status `deployed` (generate domain dari `project.Name`)
  2. Portfolios dengan status `deployed` (generate domain dari `portfolio.DomainName`)
  3. Reserved Subdomains table
- Subdomain dinormalisasi menjadi lowercase dan trimmed sebelum dicek
- Return `available: false` jika subdomain ditemukan di salah satu sumber

---

## Data Models

### SubdomainInfo
```typescript
{
  subdomain: string;      // Subdomain tanpa base domain
  full_domain: string;    // Full domain dengan base domain
  source: "project" | "portfolio" | "reserved";
  source_id: string;      // UUID atau ID dari source
  source_name: string;    // Nama dari source
  status: "active";       // Selalu "active"
  created_at: datetime;
  updated_at: datetime;
}
```

### ReservedSubdomainInfo
```typescript
{
  id: string;            // UUID
  subdomain: string;     // Subdomain tanpa base domain
  full_domain: string;   // Full domain dengan base domain
  reserved_by: string;    // UUID admin
  reason: string | null;  // Alasan reserve (optional)
  created_at: datetime;
  updated_at: datetime;
}
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
- `400 Bad Request` - Request tidak valid (validation error, duplicate, dll)
- `401 Unauthorized` - Tidak terautentikasi atau token tidak valid
- `404 Not Found` - Resource tidak ditemukan
- `500 Internal Server Error` - Server error

---

## Examples

### Example 1: Reserve Subdomain

**Request:**
```bash
curl -X POST http://localhost:8080/api/v1/admin/subdomains/reserve \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "special-project",
    "reason": "Reserved for upcoming special project"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Subdomain reserved successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "subdomain": "special-project",
    "full_domain": "special-project.imuii.id",
    "reserved_by": "550e8400-e29b-41d4-a716-446655440000",
    "reason": "Reserved for upcoming special project",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

### Example 2: Get All Active Subdomains

**Request:**
```bash
curl -X GET http://localhost:8080/api/v1/admin/subdomains/active \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "success": true,
  "message": "Active subdomains retrieved successfully",
  "data": {
    "success": true,
    "subdomains": [
      {
        "subdomain": "my-project",
        "full_domain": "my-project.imuii.id",
        "source": "project",
        "source_id": "550e8400-e29b-41d4-a716-446655440000",
        "source_name": "My Project",
        "status": "active",
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

### Example 3: Check Subdomain Availability (Public)

**Request:**
```bash
curl -X GET "http://localhost:8080/api/v1/subdomain/check?subdomain=my-new-project"
```

**Response (Available):**
```json
{
  "success": true,
  "message": "Subdomain availability checked",
  "data": {
    "available": true,
    "subdomain": "my-new-project",
    "message": "Subdomain 'my-new-project' is available"
  }
}
```

**Response (Not Available):**
```json
{
  "success": true,
  "message": "Subdomain availability checked",
  "data": {
    "available": false,
    "subdomain": "my-new-project",
    "message": "Subdomain 'my-new-project' is already taken"
  }
}
```

### Example 4: Delete Reserved Subdomain

**Request:**
```bash
curl -X DELETE http://localhost:8080/api/v1/admin/subdomains/reserved/660e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "success": true,
  "message": "Reserved subdomain deleted successfully"
}
```

---

## Implementation Notes

### Domain Generation

Subdomain di-generate menggunakan utility `GenerateDomain()` yang:
- Mengkonversi ke lowercase
- Mengganti spasi dan underscore dengan hyphen
- Menghapus karakter khusus (hanya alphanumeric + hyphen)
- Menghapus hyphen berurutan
- Membatasi panjang maksimal 63 karakter (DNS label limit)
- Format: `{clean-name}.{baseDomain}`

### Subdomain Validation

Subdomain yang valid harus:
- Panjang 1-63 karakter
- Hanya mengandung lowercase alphanumeric dan hyphen
- Tidak dimulai atau diakhiri dengan hyphen
- Unique (tidak duplicate dengan project/portfolio/reserved)

### Status Filtering

- **Projects**: Hanya yang memiliki status `deployed`
- **Portfolios**: Hanya yang memiliki status `deployed`
- **Reserved Subdomains**: Semua dianggap aktif

### Performance Considerations

- Query bisa lambat jika banyak projects/portfolios
- Pertimbangkan pagination di future untuk Get Active Subdomains
- Check Availability sudah dioptimasi dengan query langsung ke database

---

## Related Documentation

- [Admin Authentication API](../API_DOCUMENTATION.md#admin-authentication)
- [Project Management API](../API_DOCUMENTATION.md#project-apis)
- [Portfolio Management API](../API_DOCUMENTATION.md#portfolio-apis)

---

**Last Updated:** 2024-01-15  
**Version:** 1.0.0

