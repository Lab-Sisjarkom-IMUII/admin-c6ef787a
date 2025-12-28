# Integration Guide - IMUII Admin

Dokumen ini menjelaskan bagaimana IMUII Admin terintegrasi dengan imuii-server sesuai dengan `catatan/INTEGRASI.md`.

## Environment Variables

Buat file `.env.local` di root project dengan konfigurasi berikut:

```env
# API Base URL (sesuai INTEGRASI.md)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# Use Mock Data (untuk development tanpa backend)
# Set ke 'true' untuk menggunakan mock data
# Set ke 'false' untuk menggunakan real API dari imuii-server
NEXT_PUBLIC_USE_MOCK_DATA=true
```

## API Endpoints

Semua endpoint mengikuti struktur dari `catatan/INTEGRASI.md`:

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication
- **Endpoint**: `POST /api/v1/admin/auth/login`
- **Token Storage**: `localStorage.getItem('admin_token')`
- **Header**: `Authorization: Bearer <admin_token>`

### Monitoring Endpoints
- `GET /api/v1/admin/monitoring/resources` - CPU, RAM, Disk, Load
- `GET /api/v1/admin/monitoring/network` - Network metrics
- `GET /api/v1/admin/monitoring/services` - Service health
- `GET /api/v1/admin/monitoring/system` - System info

### Subdomain Management
- `GET /api/v1/admin/subdomains/active` - Get active subdomains
- `GET /api/v1/admin/subdomains/all` - Get all subdomains (including reserved)
- `POST /api/v1/admin/subdomains/reserve` - Reserve subdomain (custom feature)
- `DELETE /api/v1/admin/subdomains/:id/release` - Release reserved subdomain (custom feature)

### Project Management
- `GET /api/v1/admin/projects/all` - Get all projects (admin view)

### Portfolio Management
- `GET /api/v1/admin/portfolios/all` - Get all portfolios (admin view)

### Event Management
- `GET /api/v1/admin/events/all` - Get all events
- `GET /api/v1/admin/events/:id` - Get event detail
- `POST /api/v1/admin/events` - Create event
- `PUT /api/v1/admin/events/:id` - Update event
- `DELETE /api/v1/admin/events/:id` - Delete event
- `GET /api/v1/admin/events/:id/projects` - Get event projects

## Response Structures

### Login Response
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

### Projects Response
```json
{
  "success": true,
  "projects": [...],
  "total": 100,
  "page": 1,
  "limit": 25
}
```

### Portfolios Response
```json
{
  "success": true,
  "portfolios": [...],
  "total": 50,
  "page": 1,
  "limit": 25
}
```

### Events Response
```json
{
  "success": true,
  "events": [...],
  "total": 10,
  "page": 1,
  "limit": 25
}
```

### Subdomains Response
```json
{
  "success": true,
  "subdomains": [...]
}
```

### Event Detail Response
```json
{
  "id": "event-uuid",
  "name": "Hackathon 2024",
  "description": "...",
  "start_date": "...",
  "end_date": "...",
  "status": "active",
  "created_at": "...",
  "updated_at": "..."
}
```

### Event Projects Response
```json
{
  "success": true,
  "projects": [...]
}
```

## Mock Data

Saat `NEXT_PUBLIC_USE_MOCK_DATA=true`, aplikasi akan menggunakan mock data dari `src/utils/mockData.js`. Mock data ini akan otomatis digunakan jika:
1. Environment variable di-set ke `true`
2. API request gagal (fallback)

## Integration Checklist

Sebelum menghubungkan ke imuii-server, pastikan:

- [ ] Environment variable `NEXT_PUBLIC_API_BASE_URL` sudah di-set
- [ ] Environment variable `NEXT_PUBLIC_USE_MOCK_DATA` di-set ke `false`
- [ ] imuii-server sudah running di `http://localhost:8080`
- [ ] Semua endpoint di imuii-server sudah dibuat sesuai `catatan/INTEGRASI.md`
- [ ] Admin authentication sudah diimplementasikan di imuii-server
- [ ] CORS sudah dikonfigurasi di imuii-server untuk allow imuii-admin domain

## Testing

1. **Dengan Mock Data** (Development):
   ```env
   NEXT_PUBLIC_USE_MOCK_DATA=true
   ```
   Aplikasi akan menggunakan mock data tanpa perlu backend.

2. **Dengan Real API** (Integration):
   ```env
   NEXT_PUBLIC_USE_MOCK_DATA=false
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
   ```
   Aplikasi akan menghubungkan ke imuii-server.

## Notes

- Semua endpoint paths sudah disesuaikan dengan `catatan/INTEGRASI.md`
- Response structures sudah disesuaikan dengan format yang dijelaskan
- Mock data tetap tersedia untuk development tanpa backend
- Automatic fallback ke mock data jika API request gagal (development mode)
