# Task 04: Monitoring VPS

## 📋 Overview
Membuat halaman monitoring VPS dengan resource cards, network monitoring, service health, dan system health.

## ✅ Checklist

### 1. Create Monitoring Page
- [ ] Create `src/pages/Monitoring.jsx`
- [ ] Setup page layout dengan grid system
- [ ] Add page title dan description
- [ ] Add refresh button

### 2. Create Resource Cards
- [ ] Create `src/components/monitoring/ResourceCard.jsx`
- [ ] CPU Usage Card (percentage, graph)
- [ ] RAM Usage Card (used/total, percentage, graph)
- [ ] Disk Usage Card (used/total, percentage, graph)
- [ ] Load Average Card
- [ ] Add status badge (Healthy/Warning/Critical)

### 3. Create Network Monitoring Section
- [ ] Create `src/components/monitoring/NetworkCard.jsx`
- [ ] Incoming bandwidth display
- [ ] Outgoing bandwidth display
- [ ] Packet loss indicator
- [ ] Network latency display

### 4. Create Service Health Section
- [ ] Create `src/components/monitoring/ServiceHealthCard.jsx`
- [ ] IMUII Server status (up/down)
- [ ] API response time
- [ ] Error rate (5xx errors)
- [ ] Queue/job status (jika ada)

### 5. Create System Health Section
- [ ] Create `src/components/monitoring/SystemHealthCard.jsx`
- [ ] Uptime display
- [ ] Last reboot time
- [ ] OS info
- [ ] Time sync status

### 6. Add Real-time Updates
- [ ] Create `src/hooks/useMonitoring.js`
- [ ] Setup polling untuk update data
- [ ] Add auto-refresh toggle
- [ ] Add loading states
- [ ] Add error handling

## 🎨 Design Requirements

### Layout
- Grid layout: 2-3 columns untuk cards
- Card spacing: 1rem gap
- Card padding: 1.5rem
- Responsive: 1 column di mobile, 2-3 columns di desktop

### Resource Cards
- Background: Glass morphism
- Border: Subtle dengan status color
- Status badge: 
  - Healthy: Green
  - Warning: Yellow
  - Critical: Red
- Progress bar: Primary color dengan gradient
- Graph: Line chart dengan primary/accent colors

### Colors
- Card background: `bg-[--card]` dengan glass
- Healthy status: Green 500 (`bg-green-500/20 text-green-400`)
- Warning status: Yellow 500 (`bg-yellow-500/20 text-yellow-400`)
- Critical status: Red 500 (`bg-red-500/20 text-red-400`)

### Typography
- Card title: Medium, bold
- Value: Large, bold dengan gradient
- Label: Small, muted color
- Status: Small badge

## 📝 Files to Create

1. `src/pages/Monitoring.jsx` - Monitoring page
2. `src/components/monitoring/ResourceCard.jsx` - Resource card component
3. `src/components/monitoring/NetworkCard.jsx` - Network monitoring card
4. `src/components/monitoring/ServiceHealthCard.jsx` - Service health card
5. `src/components/monitoring/SystemHealthCard.jsx` - System health card
6. `src/hooks/useMonitoring.js` - Monitoring data hook

## 📐 Component Structure

```jsx
<Monitoring>
  <PageHeader>
    <Title>VPS Monitoring</Title>
    <RefreshButton />
  </PageHeader>
  <Grid>
    <ResourceCard type="cpu" />
    <ResourceCard type="ram" />
    <ResourceCard type="disk" />
    <ResourceCard type="load" />
    <NetworkCard />
    <ServiceHealthCard />
    <SystemHealthCard />
  </Grid>
</Monitoring>
```

## ✅ Acceptance Criteria

- [ ] Semua resource cards menampilkan data dengan benar
- [ ] Status badges sesuai threshold (Healthy/Warning/Critical)
- [ ] Network monitoring menampilkan bandwidth
- [ ] Service health menampilkan status imuii-server
- [ ] System health menampilkan uptime & OS info
- [ ] Auto-refresh bekerja dengan baik
- [ ] Loading states terlihat saat fetch data
- [ ] Error handling menampilkan pesan yang jelas
- [ ] Responsive untuk mobile & desktop

## 🔗 Dependencies

- Task 03: Dashboard Layout (harus selesai dulu)
- API endpoint: `GET /api/v1/admin/monitoring/*` (belum ada, perlu dibuat)

## 📚 References

- `COLOR_REFERENCE.md` - Colors untuk status badges
- `PRD.md` Section 5 - Monitoring VPS requirements

---

**Status**: ⏳ Pending  
**Estimated Time**: 6-8 hours  
**Dependencies**: Task 03
