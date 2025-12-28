# API Documentation: Portal Event Endpoints

## Overview

Dokumentasi ini mendefinisikan **endpoint public/user scope** untuk fitur Events yang digunakan oleh **IMUII Portal** (frontend user).  
Endpoint di sini melengkapi dokumentasi `API-EVENT-MANAGEMENT.md` yang berfokus pada admin dan user action (register/unregister).

Tujuan utama:
- Menyediakan **list events** yang dapat diakses portal (publik).
- Menyediakan **detail event** untuk halaman event detail di portal.
- Menyediakan **list project di dalam event** untuk ditampilkan di portal.

Semua response mengikuti pola umum imuii-server:

```json
{
  "success": true,
  "data": { ... },
  "message": "..."
}
```

Kecuali disebutkan lain.

---

## Authentication

- Sebagian endpoint **dapat diakses tanpa login** (public read-only).
- Beberapa endpoint memberikan informasi tambahan jika user login (misalnya `my_projects`).

### User Token

- Header: `Authorization: Bearer <user_token>`
- Atau cookie: `imuii-token=<user_token>`

---

## 1. Get Public Events List

Mengambil daftar events untuk ditampilkan di halaman `Events` pada portal.

### Endpoint

`GET /api/v1/events`

### Auth

- **Optional**
  - Tanpa token: tetap bisa mendapatkan list events.
  - Dengan token user: struktur sama, bisa ditambah metadata di masa depan jika diperlukan.

### Query Parameters

- `page` (optional, default: 1)  
  Halaman yang diminta.

- `limit` (optional, default: 25, max: 100)  
  Jumlah events per halaman.

- `status` (optional)  
  Filter berdasarkan status event:
  - `active`
  - `upcoming`
  - `ended`
  - `all` (opsional, berarti tidak filter status)

Jika `status` tidak diberikan:
- Disarankan default: tampilkan **active + upcoming**.

### Response

```json
{
  "success": true,
  "data": {
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

### Example

```bash
curl -X GET "http://localhost:8080/api/v1/events?page=1&limit=25&status=active"
```

Backend boleh mengembalikan langsung array events (tanpa pagination) selama konsisten, namun struktur di atas disarankan agar sama dengan admin.

---

## 2. Get Public Event Detail

Mengambil detail satu event untuk halaman detail event di portal.

### Endpoint

`GET /api/v1/events/:id`

### Path Parameters

- `id` (required) – Event UUID

### Auth

- **Optional**
  - Tanpa token: mengembalikan detail event umum.
  - Dengan token user: boleh menambahkan informasi tambahan terkait user (misalnya `my_projects`).

### Response (basic)

Struktur dasar mengikuti admin `GET /api/v1/admin/events/:id`:

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

### Response (disarankan, ketika user login)

Untuk mempermudah portal menentukan project user yang sudah terdaftar di event ini, disarankan menambahkan field `my_projects` di dalam data jika terdapat user token yang valid:

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
    "my_projects": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "name": "my-project",
        "registered_at": "2024-01-12T08:00:00Z"
      }
    ],
    "created_at": "2024-01-10T10:00:00Z",
    "updated_at": "2024-01-10T10:00:00Z"
  },
  "message": "Event retrieved successfully"
}
```

Field `my_projects` berisi hanya project yang:
- Dimiliki oleh user yang sedang login.
- Terdaftar di event ini.

---

## 3. Get Event Projects (Portal Scope)

Mengambil daftar semua projects yang terdaftar di event tertentu untuk ditampilkan di portal (bukan admin panel).

### Endpoint

`GET /api/v1/events/:id/projects`

### Path Parameters

- `id` (required) – Event UUID

### Auth

Pilihan implementasi:

- **Opsi A (lebih terbuka)**: Public, bisa diakses tanpa login.
- **Opsi B (lebih ketat)**: Hanya bisa diakses jika user login.

Keduanya dapat digunakan oleh portal; saat ini implementasi di frontend tidak membutuhkan field sensitif, hanya informasi project publik yang sudah didefinisikan di `ProjectInfo`.

### Response

Menggunakan model `ProjectInfo` yang sudah ada di dokumentasi `API-EVENT-MANAGEMENT.md`:

```json
{
  "success": true,
  "data": {
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

Frontend portal akan menampilkan:
- `name`, `description`, `status`, `domain`, `deploy_url`
- `owner.name` / `owner.email`
- `registered_at`

### Example

```bash
curl -X GET "http://localhost:8080/api/v1/events/550e8400-e29b-41d4-a716-446655440000/projects"
```

---

## 4. Get My Events (Existing)

Endpoint ini **sudah ada** di dokumentasi utama event management, namun disebutkan di sini untuk konteks portal.

Digunakan di **Dashboard > My Events** untuk menampilkan daftar event yang berisi project milik user.

### Endpoint

`GET /api/v1/events/my-events`

### Auth

- **Required** – user token harus valid.

### Response (sudah didefinisikan)

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

Portal menggunakan field:
- `name`, `description`, `start_date`, `end_date`, `status`
- `my_projects.length` untuk menampilkan jumlah project user di event tersebut.

---

## 5. Register & Unregister Project (Referensi)

Endpoint berikut **sudah didefinisikan** di `API-EVENT-MANAGEMENT.md` dan digunakan portal untuk aksi register/unregister:

### Register Project to Event

- `POST /api/v1/events/:eventId/register`
- Body:

```json
{
  "project_id": "660e8400-e29b-41d4-a716-446655440000"
}
```

### Unregister Project from Event

- `DELETE /api/v1/events/:eventId/projects/:projectId`

Portal akan:
- Menangani error message yang sudah didokumentasikan (project sudah terdaftar, event status ended, project bukan milik user, dll).
- Melakukan refresh data detail event setelah aksi berhasil.

