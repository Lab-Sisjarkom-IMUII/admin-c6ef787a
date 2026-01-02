import { 
  mockMonitoringData, 
  mockSubdomains, 
  getAllSubdomains,
  reserveSubdomain as reserveSubdomainMock,
  releaseSubdomain as releaseSubdomainMock,
  mockProjects, 
  mockPortfolios, 
  mockEvents, 
  mockEventProjects,
  delay 
} from './mockData';

// Helper to get reserved subdomains from mock data
const getReservedSubdomains = () => {
  const all = getAllSubdomains();
  return all.filter(s => s.status === 'reserved' || s.source === 'reserved');
};

// API Configuration - Langsung menggunakan production API
const API_BASE_URL = 'https://api.imuii.id/api/v1';

// Langsung menggunakan API sebenarnya, tidak menggunakan mock data
const USE_MOCK_DATA = false;

// In-memory storage untuk mock CRUD operations
let mockEventsStorage = [...mockEvents];

// Simulate API delay
const simulateDelay = () => delay(300 + Math.random() * 500);

// Mock API handlers
const mockApiHandlers = {
  '/admin/auth/login': async (options) => {
    await simulateDelay();
    const { username, password } = JSON.parse(options.body || '{}');
    if (username && password) {
      return {
        success: true,
        token: 'mock_jwt_token_' + Date.now(),
        user: { username, role: 'admin' }
      };
    }
    throw new Error('Invalid credentials');
  },
  
  // Monitoring endpoints sesuai INTEGRASI.md
  '/admin/monitoring/resources': async () => {
    await simulateDelay();
    return {
      cpu: {
        value: mockMonitoringData.cpu.percentage,
        unit: '%',
        used: 2.3,
        total: 5.0,
        loadAverage: [1.2, 1.5, 1.8]
      },
      ram: {
        value: mockMonitoringData.ram.percentage,
        unit: '%',
        used: mockMonitoringData.ram.used,
        total: mockMonitoringData.ram.total,
        unit: 'GB'
      },
      disk: {
        value: mockMonitoringData.disk.percentage,
        unit: '%',
        used: mockMonitoringData.disk.used,
        total: mockMonitoringData.disk.total,
        unit: 'GB'
      },
      load: {
        value: mockMonitoringData.load_average.value,
        loadAverage: [1.2, 1.5, 1.8]
      }
    };
  },
  
  '/admin/monitoring/network': async () => {
    await simulateDelay();
    return {
      incoming: mockMonitoringData.network.incoming,
      outgoing: mockMonitoringData.network.outgoing,
      packetLoss: mockMonitoringData.network.packet_loss,
      latency: mockMonitoringData.network.latency
    };
  },
  
  '/admin/monitoring/services': async () => {
    await simulateDelay();
    return {
      serverStatus: mockMonitoringData.service.imuii_server.status,
      responseTime: mockMonitoringData.service.api_response_time,
      errorRate: mockMonitoringData.service.error_rate,
      queueStatus: mockMonitoringData.service.queue_status.toLowerCase()
    };
  },
  
  '/admin/monitoring/system': async () => {
    await simulateDelay();
    return {
      uptime: mockMonitoringData.system.uptime,
      lastReboot: mockMonitoringData.system.last_reboot,
      osInfo: {
        name: 'Ubuntu',
        version: '22.04 LTS'
      },
      timeSync: mockMonitoringData.system.time_sync
    };
  },
  
  // Legacy endpoint untuk backward compatibility
  '/admin/monitoring': async () => {
    await simulateDelay();
    return { data: mockMonitoringData };
  },
  
  '/admin/subdomains/active': async (options, endpoint) => {
    await simulateDelay();
    const [path, queryString] = endpoint.split('?');
    const params = new URLSearchParams(queryString || '');
    const page = parseInt(params.get('page') || '1', 10);
    const limit = parseInt(params.get('limit') || '25', 10);
    const start = (page - 1) * limit;
    const end = start + limit;
    return { 
      success: true,
      subdomains: mockSubdomains.slice(start, end),
      total: mockSubdomains.length,
      page,
      limit
    };
  },
  
  '/admin/subdomains/all': async (options, endpoint) => {
    await simulateDelay();
    const [path, queryString] = endpoint.split('?');
    const params = new URLSearchParams(queryString || '');
    const page = parseInt(params.get('page') || '1', 10);
    const limit = parseInt(params.get('limit') || '25', 10);
    const all = getAllSubdomains();
    const start = (page - 1) * limit;
    const end = start + limit;
    return { 
      success: true,
      subdomains: all.slice(start, end),
      total: all.length,
      page,
      limit
    };
  },
  
  '/admin/subdomains/reserve': async (options) => {
    await simulateDelay();
    if (options.method === 'POST') {
      const { subdomain } = JSON.parse(options.body || '{}');
      if (!subdomain) {
        throw new Error('Subdomain name is required');
      }
      
      // Check if subdomain already exists
      const allSubdomains = getAllSubdomains();
      const exists = allSubdomains.some(s => s.subdomain === subdomain);
      if (exists) {
        throw new Error(`Subdomain "${subdomain}" already exists`);
      }
      
      const reserved = reserveSubdomainMock(subdomain);
      return { success: true, data: reserved };
    }
    return { data: getAllSubdomains() };
  },
  
  // Get Reserved Subdomains: GET /admin/subdomains/reserved
  '/admin/subdomains/reserved': async () => {
    await simulateDelay();
    // Return reserved subdomains from mock data
    const reserved = getReservedSubdomains();
    return { 
      success: true,
      subdomains: reserved 
    };
  },
  
  // Delete Reserved Subdomain: DELETE /admin/subdomains/reserved/:id
  '/admin/subdomains/reserved/:id': async (options, endpoint) => {
    await simulateDelay();
    if (options.method === 'DELETE') {
      const match = endpoint.match(/\/admin\/subdomains\/reserved\/(.+)/);
      const id = match?.[1];
      const released = releaseSubdomainMock(id);
      if (released) {
        return { success: true };
      }
      throw new Error('Subdomain not found or not reserved');
    }
  },
  
  '/admin/projects/all': async (options, endpoint) => {
    await simulateDelay();
    const [path, queryString] = endpoint.split('?');
    const params = new URLSearchParams(queryString || '');
    const page = parseInt(params.get('page') || '1', 10);
    const limit = parseInt(params.get('limit') || '25', 10);
    const start = (page - 1) * limit;
    const end = start + limit;
    return { 
      success: true,
      projects: mockProjects.slice(start, end),
      total: mockProjects.length,
      page,
      limit
    };
  },
  
  '/admin/portfolios/all': async (options, endpoint) => {
    await simulateDelay();
    const [path, queryString] = endpoint.split('?');
    const params = new URLSearchParams(queryString || '');
    const page = parseInt(params.get('page') || '1', 10);
    const limit = parseInt(params.get('limit') || '25', 10);
    const start = (page - 1) * limit;
    const end = start + limit;
    return { 
      success: true,
      portfolios: mockPortfolios.slice(start, end),
      total: mockPortfolios.length,
      page,
      limit
    };
  },
  
  '/admin/events/all': async () => {
    await simulateDelay();
    return { 
      success: true,
      events: mockEventsStorage,
      total: mockEventsStorage.length,
      page: 1,
      limit: 25
    };
  },
  
  '/admin/events': async (options) => {
    await simulateDelay();
    if (options.method === 'POST') {
      const newEvent = {
        id: 'event-' + Date.now(),
        ...JSON.parse(options.body),
        project_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockEventsStorage.push(newEvent);
      return { 
        success: true, 
        event: newEvent 
      };
    }
    return { 
      success: true,
      events: mockEventsStorage,
      total: mockEventsStorage.length,
      page: 1,
      limit: 25
    };
  },
  
  '/admin/events/:id': async (options, endpoint) => {
    await simulateDelay();
    const id = endpoint.match(/\/admin\/events\/(.+)/)?.[1];
    const event = mockEventsStorage.find(e => e.id === id);
    
    if (options.method === 'PUT') {
      const updatedData = JSON.parse(options.body || '{}');
      const index = mockEventsStorage.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEventsStorage[index] = {
          ...mockEventsStorage[index],
          ...updatedData,
          updated_at: new Date().toISOString(),
        };
        return { 
          success: true, 
          event: mockEventsStorage[index] 
        };
      }
      throw new Error('Event not found');
    }
    
    if (options.method === 'DELETE') {
      const index = mockEventsStorage.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEventsStorage.splice(index, 1);
        return { 
          success: true,
          message: 'Event deleted successfully'
        };
      }
      throw new Error('Event not found');
    }
    
    if (event) {
      return event; // Return event object directly sesuai INTEGRASI.md
    }
    throw new Error('Event not found');
  },
  
  '/admin/events/:id/projects': async (options, endpoint) => {
    await simulateDelay();
    const match = endpoint.match(/\/admin\/events\/([^/]+)\/projects/);
    const id = match?.[1];
    const projects = mockEventProjects[id] || [];
    return { 
      success: true,
      projects: projects 
    };
  },
  
  '/admin/dashboard/stats': async () => {
    await simulateDelay();
    // Calculate stats from mock data
    const projects = mockProjects;
    const portfolios = mockPortfolios;
    const events = mockEventsStorage;
    const subdomains = mockSubdomains;
    const monitoring = mockMonitoringData;

    const projectsByStatus = projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    
    const projectsBySource = projects.reduce((acc, p) => {
      acc[p.source] = (acc[p.source] || 0) + 1;
      return acc;
    }, {});

    const portfoliosByStatus = portfolios.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});

    const eventsByStatus = events.reduce((acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    }, {});

    const subdomainsBySource = subdomains.reduce((acc, s) => {
      acc[s.source] = (acc[s.source] || 0) + 1;
      return acc;
    }, {});

    const activeSubdomains = subdomains.filter(s => s.status === 'active').length;

    return {
      data: {
        monitoring: {
          cpu: monitoring.cpu.percentage,
          ram: monitoring.ram.percentage,
          disk: monitoring.disk.percentage,
          serviceStatus: monitoring.service.imuii_server.status,
        },
        projects: {
          total: projects.length,
          byStatus: projectsByStatus,
          bySource: projectsBySource,
          recent: projects.slice(0, 5).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        },
        portfolios: {
          total: portfolios.length,
          byStatus: portfoliosByStatus,
          recent: portfolios.slice(0, 5).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        },
        events: {
          total: events.length,
          byStatus: eventsByStatus,
          upcoming: events.filter(e => e.status === 'upcoming' || e.status === 'active').slice(0, 3),
          topEvents: events.sort((a, b) => (b.project_count || 0) - (a.project_count || 0)).slice(0, 3),
        },
        subdomains: {
          total: subdomains.length,
          active: activeSubdomains,
          bySource: subdomainsBySource,
          recent: subdomains.slice(0, 5).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        },
      },
    };
  },
};

/**
 * Helper function untuk extract data dari nested response API sebenarnya
 * API sebenarnya menggunakan format: { success: true, message: "...", data: {...} }
 * Mock data menggunakan format flat: { success: true, ... }
 * Function ini akan normalize kedua format ke format yang konsisten
 */
function extractApiResponse(response) {
  // Jika response null atau undefined, return as is
  if (!response || typeof response !== 'object') {
    return response;
  }

  // API sebenarnya menggunakan nested structure: { success: true, message: "...", data: {...} }
  if (response.data && typeof response.data === 'object') {
    // Jika data.data ada, berarti double nested (seperti di beberapa docs API)
    if (response.data.data && typeof response.data.data === 'object') {
      return response.data.data;
    }
    
    // Check untuk login response yang memiliki token dan admin field
    if (response.data.token || response.data.admin) {
      return response.data;
    }
    
    // Jika data langsung berisi struktur yang diharapkan (success, items, dll)
    // Check untuk struktur list response: { success: true, items: [...], total: ..., page: ..., limit: ... }
    if (response.data.success !== undefined || 
        response.data.projects || 
        response.data.portfolios || 
        response.data.events || 
        response.data.subdomains) {
      return response.data;
    }
    
    // Jika data adalah object biasa (seperti event detail), return data
    return response.data;
  }
  
  // Fallback: return response langsung jika format tidak sesuai (mock data format)
  return response;
}

export async function apiRequest(endpoint, options = {}) {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    const [endpointPath] = endpoint.split('?');
    // Check for dynamic routes
    for (const [pattern, handler] of Object.entries(mockApiHandlers)) {
      if (pattern.includes(':id')) {
        const regex = new RegExp('^' + pattern.replace(':id', '([^/]+)') + '$');
        if (regex.test(endpointPath)) {
          try {
            return await handler(options, endpoint);
          } catch (error) {
            throw error;
          }
        }
      } else if (endpointPath === pattern) {
        try {
          return await handler(options, endpoint);
        } catch (error) {
          throw error;
        }
      }
    }
    
    // Fallback: return empty data
    await simulateDelay();
    return { data: [] };
  }
  
  // Real API call
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    console.log('[API Request] Calling:', `${API_BASE_URL}${endpoint}`, options.method || 'GET');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
      console.error('[API Request] Error:', response.status, errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const jsonResponse = await response.json();
    console.log('[API Request] Raw response:', jsonResponse);
    
    // Extract data dari response format API sebenarnya
    const extracted = extractApiResponse(jsonResponse);
    console.log('[API Request] Extracted response:', extracted);
    return extracted;
  } catch (error) {
    // Tidak ada fallback ke mock data - langsung throw error
    // Jika ingin menggunakan mock data, set NEXT_PUBLIC_USE_MOCK_DATA=true
    throw error;
  }
}

export async function login(username, password) {
  // Pastikan menggunakan API sebenarnya, bukan mock data
  console.log('[Login] Calling API:', `${API_BASE_URL}/admin/auth/login`);
  console.log('[Login] USE_MOCK_DATA:', USE_MOCK_DATA);
  
  const response = await apiRequest('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  
  console.log('[Login] Response received:', response);
  
  // API sebenarnya: response = { success: true, token: "...", admin: {...} } (setelah extractApiResponse)
  // Mock data: response = { success: true, token: "...", user: {...} }
  // Normalize ke format yang diharapkan oleh AuthContext
  if (response.success && response.token) {
    return {
      success: true,
      token: response.token,
      user: response.admin || response.user, // Support both admin (API sebenarnya) and user (mock data)
    };
  }
  
  // Jika format tidak sesuai, return response as is
  return response;
}
