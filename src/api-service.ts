// api-service.ts
// This file simulates an API service that would fetch data from a backend

// Define TypeScript interfaces for type safety
export interface DashboardStats {
  devices: number;
  accounts: number;
  corporateEmails: number;
  combolist: number;
}

export interface TimelineData {
  year: string;
  value: number;
}

export interface LeakData {
  country: string;
  count: number;
  riskLevel?: string;
  lastDetected?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  accountsTimelineData: TimelineData[];
  emailsTimelineData: TimelineData[];
  leakMapData: LeakData[];
}

export interface SearchResult {
  type: string;
  domain: string;
  count: number;
  lastSeen: string;
}

export interface SearchResponse {
  results: SearchResult[];
  relatedDomains: string[];
}

export interface SubscriptionInfo {
  plan: string;
  status: string;
  expiresAt: string;
  features: string[];
}

/**
 * Simulates an API call to fetch dashboard data
 * In a real application, this would make an actual API request
 */
export const fetchDashboardData = async (): Promise<DashboardData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulated response data
  return {
    stats: {
      devices: 89,
      accounts: 1452,
      corporateEmails: 297,
      combolist: 1405
    },
    // Data for the account incidents timeline chart
    accountsTimelineData: [
      { year: '2021', value: 10 },
      { year: '2022', value: 120 },
      { year: '2023', value: 600 },
      { year: '2024', value: 800 },
      { year: '2025', value: 30 }
    ],
    // Data for the corporate emails timeline chart
    emailsTimelineData: [
      { year: '2021', value: 20 },
      { year: '2022', value: 60 },
      { year: '2023', value: 100 },
      { year: '2024', value: 130 },
      { year: '2025', value: 40 }
    ],
    // Map data for leak visualization
    leakMapData: [
      { country: 'US', count: 531, riskLevel: 'high', lastDetected: '2025-02-28' },
      { country: 'SA', count: 123, riskLevel: 'medium', lastDetected: '2025-01-15' },
      { country: 'AK', count: 89, riskLevel: 'medium', lastDetected: '2024-12-22' }
    ]
  };
};

/**
 * Function to search for specific domain or keyword
 * This would normally connect to a real API endpoint
 */
export const searchIntelligence = async (query: string): Promise<SearchResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock search results with dynamically generated data
  return {
    results: [
      { 
        type: 'account', 
        domain: query, 
        count: Math.floor(Math.random() * 50) + 10, 
        lastSeen: '2025-02-14' 
      },
      { 
        type: 'email', 
        domain: query, 
        count: Math.floor(Math.random() * 30) + 5, 
        lastSeen: '2025-01-22' 
      },
      { 
        type: 'combolist', 
        domain: query, 
        count: Math.floor(Math.random() * 15) + 1, 
        lastSeen: '2024-11-30' 
      }
    ],
    relatedDomains: [
      `${query}.com`,
      `mail.${query}.net`,
      `secure.${query}.org`,
      `api.${query}.io`,
      `cdn.${query}.cloud`
    ]
  };
};

/**
 * Function to fetch user subscription info
 */
export const fetchUserSubscription = async (): Promise<SubscriptionInfo> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    plan: 'Professional',
    status: 'Active',
    expiresAt: '2025-09-01',
    features: [
      'Unlimited searches',
      'API access',
      'Export capabilities',
      'Priority support'
    ]
  };
};