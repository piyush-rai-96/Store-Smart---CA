import { DistrictIntelligence } from '../types/district';

// District 14 - Tennessee Mock Data
export const DISTRICT_14_DATA: DistrictIntelligence = {
  context: {
    districtNumber: '14',
    districtName: 'Tennessee Central',
    state: 'Tennessee',
    period: 'Last 7 Days',
    lastUpdated: new Date(),
  },
  
  dpi: {
    current: 86,
    trend: 'stable',
    trendValue: 1.2,
    nationalAvg: 83,
    vsNational: 3,
  },
  
  narrative: '',
  unreadBroadcasts: 0,
  metrics: {
    netSalesComp: {
      value: '',
      yoyPercent: 0,
    },
    vocSatisfied: {
      value: 0,
      change: 0,
    },
    seaScore: {
      value: 0,
      qoqChange: 0,
    },
    salesVsLY: {
      value: 0,
    },
    gmBpsVsLY: {
      value: 0,
    },
  },
  exceptions: [],
  topStores: [],
  strugglingStores: [],
  allStores: [],
  vocDistribution: {
    satisfied: 0,
    neutral: 0,
    dissatisfied: 0,
    topIssues: [],
  },
  triageIssues: [],
  broadcastSummary: {
    active: 0,
    scheduled: 0,
    pendingAcknowledgements: 0,
  },
  clusters: [],
};

// Sales 2x2 Matrix Data
export const SALES_2X2_DATA: any[] = [
  {
    storeNumber: '1142',
    storeName: 'Gallatin',
    x: 95,
    y: 8.2,
    size: 312,
    quadrant: 'growth-engines',
  },
  {
    storeNumber: '2034',
    storeName: 'Clarksville',
    x: 92,
    y: 6.5,
    size: 289,
    quadrant: 'growth-engines',
  },
  {
    storeNumber: '1022',
    storeName: 'Nashville Central',
    x: 85,
    y: -8.0,
    size: 180,
    quadrant: 'critical',
  },
  {
    storeNumber: '1150',
    storeName: 'Murfreesboro East',
    x: 68,
    y: -8.5,
    size: 91,
    quadrant: 'struggling',
  },
  {
    storeNumber: '1876',
    storeName: 'Hendersonville South',
    x: 88,
    y: 5.8,
    size: 271,
    quadrant: 'stable',
  },
];

// SEA Risk Grid Data
export const SEA_RISK_DATA: any[] = [
  {
    storeNumber: '1150',
    storeName: 'Murfreesboro East',
    riskLevel: 'chronic',
    seaScore: 69,
    failureCount: 5,
  },
  {
    storeNumber: '1188',
    storeName: 'Franklin West',
    riskLevel: 'chronic',
    seaScore: 72,
    failureCount: 4,
  },
  {
    storeNumber: '1022',
    storeName: 'Nashville Central',
    riskLevel: 'one-time-dip',
    seaScore: 75,
    failureCount: 2,
  },
  {
    storeNumber: '1142',
    storeName: 'Gallatin',
    riskLevel: 'strong',
    seaScore: 91,
    failureCount: 0,
  },
  {
    storeNumber: '2034',
    storeName: 'Clarksville',
    riskLevel: 'strong',
    seaScore: 88,
    failureCount: 0,
  },
];

// Populate all stores (combining top, middle, and struggling)
DISTRICT_14_DATA.allStores = [
  ...DISTRICT_14_DATA.topStores,
  {
    id: 's-1345',
    storeNumber: '1345',
    name: 'Spring Hill',
    city: 'Spring Hill',
    state: 'TN',
    dpi: 85.3,
    sales: '$245K',
    salesValue: 245000,
    seaScore: 84,
    vocScore: 86,
    alertCount: 0,
    rank: 4,
    yoyGrowth: 4.2,
    momGrowth: 0.8,
    gmPercent: 33.5,
  },
  {
    id: 's-1567',
    storeNumber: '1567',
    name: 'Smyrna',
    city: 'Smyrna',
    state: 'TN',
    dpi: 83.7,
    sales: '$228K',
    salesValue: 228000,
    seaScore: 82,
    vocScore: 85,
    alertCount: 0,
    rank: 5,
    yoyGrowth: 3.8,
    momGrowth: 0.5,
    gmPercent: 32.8,
  },
  {
    id: 's-1789',
    storeNumber: '1789',
    name: 'Lebanon',
    city: 'Lebanon',
    state: 'TN',
    dpi: 81.2,
    sales: '$215K',
    salesValue: 215000,
    seaScore: 80,
    vocScore: 83,
    alertCount: 1,
    rank: 6,
    yoyGrowth: 2.5,
    momGrowth: 0.2,
    gmPercent: 32.1,
  },
  {
    id: 's-1234',
    storeNumber: '1234',
    name: 'Mount Juliet',
    city: 'Mount Juliet',
    state: 'TN',
    dpi: 79.5,
    sales: '$198K',
    salesValue: 198000,
    seaScore: 78,
    vocScore: 81,
    alertCount: 0,
    rank: 7,
    yoyGrowth: 1.8,
    momGrowth: -0.1,
    gmPercent: 31.5,
  },
  DISTRICT_14_DATA.strugglingStores[2], // Franklin West
  DISTRICT_14_DATA.strugglingStores[1], // Nashville Central
  DISTRICT_14_DATA.strugglingStores[0], // Murfreesboro East
];
