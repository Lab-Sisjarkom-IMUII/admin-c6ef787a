# Mock Data untuk Development

Dokumen ini menjelaskan sistem mock data yang digunakan untuk development dan testing sebelum backend API siap.

**Last Updated**: 2025-01-21

---

## Overview

Mock data system memungkinkan development dan testing tanpa backend API. Sistem ini otomatis aktif di development mode atau bisa diaktifkan via environment variable.

---

## Cara Menggunakan

### Mode Otomatis (Development)

Mock data otomatis aktif ketika:
- `import.meta.env.MODE === 'development'` (default Vite development mode)

Tidak perlu konfigurasi tambahan, langsung jalankan:
```bash
npm run dev
```

### Mode Manual (via Environment Variable)

Tambahkan di `.env` atau `.env.local`:
```env
VITE_USE_MOCK_DATA=true
```

Atau untuk disable mock data (gunakan real API):
```env
VITE_USE_MOCK_DATA=false
```

---

## Fitur Mock Data

### 1. Monitoring Data
- **Resources**: CPU (45%), RAM (62%), Disk (78%), Load (1.5)
- **Network**: Incoming/outgoing bandwidth, packet loss, latency
- **Services**: Server status, response time, error rate
- **System**: Uptime, last reboot, OS info, time sync

### 2. Projects (12 items)
- Berbagai status: pending, initialized, building, deployed, failed, inactive
- Mix of CLI dan Web sources
- 4 different owners
- Beberapa dengan deployment history

### 3. Portfolios (8 items)
- Mix of draft dan deployed status
- 3 different templates
- 4 different owners
- Beberapa dengan CV data

### 4. Subdomains (20 items)
- Combine dari projects dan portfolios
- Berbagai status (active/inactive)
- Format: `{name}.imuii.id`

### 5. Events (6 items)
- Berbagai status: active, inactive, upcoming, completed
- Berbagai date ranges
- Beberapa dengan registered projects (3-5 projects per event)

---

## Mock API Behavior

### Network Delay Simulation
- **GET requests**: 300-800ms delay
- **POST/PUT/DELETE requests**: 500-1000ms delay
- Random delay untuk simulate real network conditions

### CRUD Operations

#### Events
- **Create**: Menambahkan event baru ke mock data
- **Update**: Update event yang ada
- **Delete**: Hapus event dari mock data
- **Get Projects**: Return projects yang terdaftar di event

#### Login
- Accept **any username/password** untuk development
- Return mock token dan user data

---

## File Structure

```
src/
├── data/
│   └── mockData.js          # Semua dummy data
├── utils/
│   ├── api.js               # Updated dengan mock support
│   ├── mockApi.js           # Mock API service
│   └── mockAuth.js          # Mock authentication (optional)
```

---

## Data yang Tersedia

### Monitoring
- `/api/v1/admin/monitoring/resources`
- `/api/v1/admin/monitoring/network`
- `/api/v1/admin/monitoring/services`
- `/api/v1/admin/monitoring/system`

### Subdomains
- `/api/v1/admin/subdomains/active` - 20 subdomains

### Projects
- `/api/v1/admin/projects/all` - 12 projects
- Support filtering: status, source, owner_id

### Portfolios
- `/api/v1/admin/portfolios/all` - 8 portfolios
- Support filtering: status, user_id

### Events
- `/api/v1/admin/events/all` - 6 events
- `/api/v1/admin/events/:id` - Event detail
- `/api/v1/admin/events/:id/projects` - Event projects
- `POST /api/v1/admin/events` - Create event
- `PUT /api/v1/admin/events/:id` - Update event
- `DELETE /api/v1/admin/events/:id` - Delete event

### Authentication
- `POST /api/v1/admin/auth/login` - Accept any credentials

---

## Fallback Behavior

Jika real API call gagal (network error), sistem akan otomatis fallback ke mock data jika:
- `VITE_USE_MOCK_DATA === 'true'` atau
- `MODE === 'development'`

Ini memungkinkan graceful degradation saat backend belum siap.

---

## Testing dengan Mock Data

### Login
1. Buka halaman login
2. Masukkan **username dan password apa saja** (misal: `admin` / `admin`)
3. Login akan berhasil dengan mock token

### Monitoring
- Data monitoring akan otomatis muncul dengan realistic values
- Auto-refresh akan tetap bekerja (dengan mock data)

### Projects/Portfolios/Subdomains
- Semua data akan muncul di table
- Filtering dan search akan bekerja dengan mock data
- Pagination akan bekerja

### Events
- List events akan muncul
- Bisa create, edit, delete event (akan tersimpan di memory)
- Event projects akan muncul di detail modal

---

## Catatan Penting

1. **Data Persistence**: Mock data disimpan di memory, jadi akan reset saat page refresh
2. **CRUD Operations**: Create/Update/Delete untuk events akan bekerja, tapi hanya di memory
3. **Realistic Data**: Mock data dirancang untuk cover berbagai scenarios (different statuses, dates, etc.)
4. **Easy Disable**: Set `VITE_USE_MOCK_DATA=false` untuk disable mock mode

---

## Update Mock Data

Untuk menambah atau mengubah mock data, edit file `src/data/mockData.js`:

```javascript
// Tambah project baru
export const mockProjects = [
  // ... existing projects
  {
    id: generateUUID(),
    name: 'new-project',
    // ... other fields
  },
];
```

---

## Troubleshooting

### Mock data tidak muncul
1. Check `VITE_USE_MOCK_DATA` environment variable
2. Check console untuk error messages
3. Pastikan `src/data/mockData.js` dan `src/utils/mockApi.js` sudah ada

### Real API tidak digunakan
1. Set `VITE_USE_MOCK_DATA=false`
2. Pastikan `VITE_API_BASE_URL` mengarah ke backend yang benar
3. Check network tab untuk melihat request yang dikirim

---

**Status**: ✅ Ready untuk Development
