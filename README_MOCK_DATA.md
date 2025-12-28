# Mock Data untuk MVP Development

Dokumen ini menjelaskan penggunaan mock data untuk development MVP sebelum backend API siap.

## Cara Menggunakan

### Otomatis (Development Mode)
Mock data **otomatis aktif** ketika aplikasi berjalan di development mode (`npm run dev`).

Tidak perlu konfigurasi tambahan!

### Manual (via Environment Variable)
Untuk mengontrol penggunaan mock data, buat file `.env.local`:

```env
# Gunakan mock data
NEXT_PUBLIC_USE_MOCK_DATA=true

# Atau gunakan real API
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

## Fitur Mock Data

### 1. Login
- **Username & Password**: Bisa menggunakan **apa saja** (misal: `admin` / `admin`)
- Mock token akan disimpan di localStorage
- Login akan selalu berhasil dengan mock data

### 2. Monitoring VPS
- CPU Usage: 45.2%
- RAM Usage: 8.5GB / 16GB (53.1%)
- Disk Usage: 120GB / 500GB (24%)
- Load Average: 1.2
- Network: Incoming/Outgoing bandwidth dengan realistic values
- Service Health: IMUII Server status, API response time, error rate
- System Health: Uptime, last reboot, OS info

### 3. Subdomain Management
- 4 subdomains contoh
- Mix dari Projects dan Portfolios
- Status: Active/Inactive
- Format: `{name}.imuii.id`

### 4. Project Management
- 5 projects contoh
- Berbagai status: pending, initialized, building, deployed, failed
- Mix of CLI dan Web sources
- 4 different owners

### 5. Portfolio Management
- 3 portfolios contoh
- Status: Draft/Deployed
- 3 different templates
- 3 different owners

### 6. Event Management
- 4 events contoh
- Berbagai status: active, inactive, upcoming, completed
- CRUD operations bekerja (disimpan di memory)
- Event projects bisa dilihat di detail modal

## Mock API Behavior

### Network Delay
- Simulasi delay 300-800ms untuk realistic feel
- Random delay untuk setiap request

### CRUD Operations
- **Create Event**: Menambahkan event baru ke memory storage
- **Update Event**: Update event yang ada di memory
- **Delete Event**: Hapus event dari memory storage
- **Get Event Projects**: Return projects yang terdaftar di event

### Data Persistence
⚠️ **Penting**: Mock data disimpan di **memory**, jadi akan **reset** saat:
- Page refresh
- Browser restart
- Aplikasi restart

## Testing dengan Mock Data

### 1. Login
```
Username: admin (atau apa saja)
Password: admin (atau apa saja)
```
Login akan selalu berhasil!

### 2. Monitoring
- Buka `/dashboard/monitoring`
- Data monitoring akan muncul otomatis
- Auto-refresh akan bekerja dengan mock data

### 3. Projects/Portfolios/Subdomains
- Buka halaman management masing-masing
- Data akan muncul di table
- Filtering dan search akan bekerja
- Detail modal akan menampilkan data

### 4. Events
- Buka `/dashboard/events`
- List events akan muncul
- Bisa **Create** event baru
- Bisa **Edit** event yang ada
- Bisa **Delete** event
- Detail modal akan menampilkan projects yang terdaftar

## File Structure

```
src/
├── utils/
│   ├── api.js          # API utility dengan mock support
│   └── mockData.js     # Semua mock data
```

## Update Mock Data

Untuk menambah atau mengubah mock data, edit file `src/utils/mockData.js`:

```javascript
export const mockProjects = [
  // ... existing projects
  {
    id: 'proj-new',
    name: 'new-project',
    description: 'New project description',
    status: 'pending',
    // ... other fields
  },
];
```

## Disable Mock Data

Untuk menggunakan real API:

1. Set environment variable:
   ```env
   NEXT_PUBLIC_USE_MOCK_DATA=false
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
   ```

2. Pastikan backend API sudah running dan accessible

3. Restart development server

## Troubleshooting

### Mock data tidak muncul
1. Check console untuk error messages
2. Pastikan `src/utils/mockData.js` sudah ada
3. Check `NEXT_PUBLIC_USE_MOCK_DATA` environment variable

### Real API tidak digunakan
1. Set `NEXT_PUBLIC_USE_MOCK_DATA=false`
2. Pastikan `NEXT_PUBLIC_API_BASE_URL` mengarah ke backend yang benar
3. Check network tab untuk melihat request yang dikirim

### Event CRUD tidak bekerja
- Pastikan menggunakan mock data mode
- Check console untuk error messages
- Data akan reset saat page refresh (ini normal untuk mock data)

---

**Status**: ✅ Ready untuk MVP Development
