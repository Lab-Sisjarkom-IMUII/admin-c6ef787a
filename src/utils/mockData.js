// Mock Data untuk MVP Development

export const mockMonitoringData = {
  cpu: {
    usage: 45.2,
    percentage: 45.2,
    status: 'healthy',
  },
  ram: {
    used: 8.5,
    total: 16,
    percentage: 53.1,
    status: 'healthy',
  },
  disk: {
    used: 120,
    total: 500,
    percentage: 24,
    status: 'healthy',
  },
  load_average: {
    value: 1.2,
    status: 'healthy',
  },
  network: {
    incoming: 1024000, // bytes per second
    outgoing: 512000,
    incoming_percentage: 30,
    outgoing_percentage: 15,
    packet_loss: 0.1,
    latency: 12,
  },
  service: {
    imuii_server: {
      status: 'up',
    },
    api_response_time: 45,
    error_rate: 0.5,
    queue_status: 'Running',
  },
  system: {
    uptime: 2592000, // seconds (30 days)
    last_reboot: '2024-01-01T00:00:00Z',
    os_info: 'Ubuntu 22.04 LTS',
    time_sync: 'synced',
  },
};

// In-memory storage untuk reserved subdomains
let mockReservedSubdomains = [
  {
    id: 'reserved-1',
    subdomain: 'admin-reserved',
    full_domain: 'admin-reserved.imuii.id',
    source: 'reserved',
    source_id: null,
    source_name: null,
    status: 'reserved',
    created_at: '2024-01-05T08:00:00Z',
  },
  {
    id: 'reserved-2',
    subdomain: 'event-2025',
    full_domain: 'event-2025.imuii.id',
    source: 'reserved',
    source_id: null,
    source_name: null,
    status: 'reserved',
    created_at: '2024-01-12T10:00:00Z',
  },
];

export const mockSubdomains = [
  {
    id: '1',
    subdomain: 'my-project',
    full_domain: 'my-project.imuii.id',
    source: 'project',
    source_id: 'proj-1',
    source_name: 'My Awesome Project',
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    subdomain: 'portfolio-john',
    full_domain: 'portfolio-john.imuii.id',
    source: 'portfolio',
    source_id: 'port-1',
    source_name: "John's Portfolio",
    status: 'active',
    created_at: '2024-01-20T14:20:00Z',
  },
  {
    id: '3',
    subdomain: 'hackathon-2024',
    full_domain: 'hackathon-2024.imuii.id',
    source: 'project',
    source_id: 'proj-2',
    source_name: 'Hackathon 2024 Project',
    status: 'active',
    created_at: '2024-02-01T09:15:00Z',
  },
  {
    id: '4',
    subdomain: 'portfolio-jane',
    full_domain: 'portfolio-jane.imuii.id',
    source: 'portfolio',
    source_id: 'port-2',
    source_name: "Jane's Portfolio",
    status: 'inactive',
    created_at: '2024-01-10T11:00:00Z',
  },
];

// Get all subdomains including reserved
export function getAllSubdomains() {
  return [...mockSubdomains, ...mockReservedSubdomains];
}

// Reserve a new subdomain
export function reserveSubdomain(subdomainName) {
  const newReserved = {
    id: 'reserved-' + Date.now(),
    subdomain: subdomainName,
    full_domain: `${subdomainName}.imuii.id`,
    source: 'reserved',
    source_id: null,
    source_name: null,
    status: 'reserved',
    created_at: new Date().toISOString(),
  };
  mockReservedSubdomains.push(newReserved);
  return newReserved;
}

// Release a reserved subdomain
export function releaseSubdomain(subdomainId) {
  const index = mockReservedSubdomains.findIndex(s => s.id === subdomainId);
  if (index !== -1) {
    mockReservedSubdomains.splice(index, 1);
    return true;
  }
  return false;
}

export const mockProjects = [
  {
    id: 'proj-1',
    name: 'my-project',
    description: 'A full-stack web application built with React and Node.js',
    repo_url: 'https://github.com/user/my-project',
    status: 'deployed',
    source: 'cli',
    owner: {
      id: 'user-1',
      email: 'john@example.com',
      name: 'John Doe',
    },
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T15:45:00Z',
  },
  {
    id: 'proj-2',
    name: 'hackathon-2024',
    description: 'Hackathon project for 2024 competition',
    repo_url: 'https://github.com/user/hackathon-2024',
    status: 'building',
    source: 'web',
    owner: {
      id: 'user-2',
      email: 'jane@example.com',
      name: 'Jane Smith',
    },
    created_at: '2024-02-01T09:15:00Z',
    updated_at: '2024-02-01T09:15:00Z',
  },
  {
    id: 'proj-3',
    name: 'ecommerce-app',
    description: 'E-commerce platform with payment integration',
    repo_url: 'https://github.com/user/ecommerce-app',
    status: 'pending',
    source: 'cli',
    owner: {
      id: 'user-3',
      email: 'bob@example.com',
      name: 'Bob Johnson',
    },
    created_at: '2024-02-05T14:20:00Z',
    updated_at: '2024-02-05T14:20:00Z',
  },
  {
    id: 'proj-4',
    name: 'api-server',
    description: 'RESTful API server for mobile app',
    repo_url: 'https://github.com/user/api-server',
    status: 'failed',
    source: 'web',
    owner: {
      id: 'user-1',
      email: 'john@example.com',
      name: 'John Doe',
    },
    created_at: '2024-01-25T16:30:00Z',
    updated_at: '2024-01-26T10:15:00Z',
  },
  {
    id: 'proj-5',
    name: 'blog-platform',
    description: 'Modern blog platform with CMS',
    repo_url: 'https://github.com/user/blog-platform',
    status: 'initialized',
    source: 'cli',
    owner: {
      id: 'user-4',
      email: 'alice@example.com',
      name: 'Alice Williams',
    },
    created_at: '2024-02-10T11:00:00Z',
    updated_at: '2024-02-10T11:00:00Z',
  },
];

export const mockPortfolios = [
  {
    id: 'port-1',
    name: "John's Portfolio",
    domain_name: 'portfolio-john',
    deploy_url: 'https://portfolio-john.imuii.id',
    status: 'deployed',
    template: {
      id: 'template-1',
      name: 'Modern Portfolio',
    },
    user: {
      id: 'user-1',
      email: 'john@example.com',
      name: 'John Doe',
    },
    created_at: '2024-01-20T14:20:00Z',
    updated_at: '2024-01-25T10:30:00Z',
  },
  {
    id: 'port-2',
    name: "Jane's Portfolio",
    domain_name: 'portfolio-jane',
    deploy_url: null,
    status: 'draft',
    template: {
      id: 'template-2',
      name: 'Creative Portfolio',
    },
    user: {
      id: 'user-2',
      email: 'jane@example.com',
      name: 'Jane Smith',
    },
    created_at: '2024-01-10T11:00:00Z',
    updated_at: '2024-01-15T09:20:00Z',
  },
  {
    id: 'port-3',
    name: "Bob's Portfolio",
    domain_name: 'portfolio-bob',
    deploy_url: 'https://portfolio-bob.imuii.id',
    status: 'deployed',
    template: {
      id: 'template-1',
      name: 'Modern Portfolio',
    },
    user: {
      id: 'user-3',
      email: 'bob@example.com',
      name: 'Bob Johnson',
    },
    created_at: '2024-02-01T08:15:00Z',
    updated_at: '2024-02-05T14:40:00Z',
  },
];

export const mockEvents = [
  {
    id: 'event-1',
    name: 'Hackathon 2024',
    description: 'Annual hackathon competition for students',
    start_date: '2024-03-01T00:00:00Z',
    end_date: '2024-03-05T23:59:59Z',
    status: 'upcoming',
    project_count: 15,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: 'event-2',
    name: 'Final Project Semester 1',
    description: 'Final project submission for semester 1',
    start_date: '2024-01-15T00:00:00Z',
    end_date: '2024-01-20T23:59:59Z',
    status: 'completed',
    project_count: 8,
    created_at: '2024-01-05T09:00:00Z',
    updated_at: '2024-01-20T23:59:59Z',
  },
  {
    id: 'event-3',
    name: 'Competition 2025',
    description: 'Programming competition for 2025',
    start_date: '2024-02-15T00:00:00Z',
    end_date: '2024-02-28T23:59:59Z',
    status: 'active',
    project_count: 12,
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
  },
  {
    id: 'event-4',
    name: 'Workshop Project',
    description: 'Projects from web development workshop',
    start_date: '2024-04-01T00:00:00Z',
    end_date: '2024-04-30T23:59:59Z',
    status: 'upcoming',
    project_count: 0,
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
  },
];

export const mockEventProjects = {
  'event-1': [
    {
      id: 'proj-1',
      name: 'my-project',
      owner: {
        id: 'user-1',
        email: 'john@example.com',
        name: 'John Doe',
      },
      status: 'deployed',
      registered_at: '2024-02-15T10:00:00Z',
    },
    {
      id: 'proj-2',
      name: 'hackathon-2024',
      owner: {
        id: 'user-2',
        email: 'jane@example.com',
        name: 'Jane Smith',
      },
      status: 'building',
      registered_at: '2024-02-16T14:30:00Z',
    },
  ],
  'event-2': [
    {
      id: 'proj-3',
      name: 'ecommerce-app',
      owner: {
        id: 'user-3',
        email: 'bob@example.com',
        name: 'Bob Johnson',
      },
      status: 'deployed',
      registered_at: '2024-01-16T09:00:00Z',
    },
  ],
  'event-3': [
    {
      id: 'proj-1',
      name: 'my-project',
      owner: {
        id: 'user-1',
        email: 'john@example.com',
        name: 'John Doe',
      },
      status: 'deployed',
      registered_at: '2024-02-10T11:00:00Z',
    },
  ],
};

// Helper untuk simulate API delay
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
