export type Subscription = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  serviceLevel: 'Self-Support' | 'Standard' | 'Premium';
  supportType: string;
  capacity?: string | null;
  virtualGuestLimit?: string | null;
  contracts: Array<{
    contractNumber: string;
    quantity: number;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
  }>;
};

export const subscriptionsData: Subscription[] = [
  {
    id: '1',
    name: '1 Year Product Trial of Red Hat Insights for Red Hat Enterprise Linux, Self‑Supported',
    sku: 'SER0482',
    quantity: 10,
    serviceLevel: 'Self-Support',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [
      { contractNumber: '12864984', quantity: 10, startDate: '2024-01-01', endDate: '2025-01-01' }
    ]
  },
  {
    id: '2',
    name: '30 Day Product Trial Developer Sandbox for Red Hat OpenShift, Self‑Supported',
    sku: 'SER0772',
    quantity: 2,
    serviceLevel: 'Self-Support',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [
      { contractNumber: '22994510', quantity: 1, startDate: '2024-05-01', endDate: '2024-06-01' },
      { contractNumber: '22994511', quantity: 1, startDate: '2024-05-01', endDate: '2024-06-01' }
    ]
  },
  {
    id: '3',
    name: '30 Day Product Trial of Red Hat JBoss Enterprise Application Platform, Self‑Supported',
    sku: 'MW0150761',
    quantity: 100,
    serviceLevel: 'Self-Support',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [
      { contractNumber: '55770123', quantity: 60, startDate: '2022-01-01', endDate: '2026-12-31' },
      { contractNumber: '55770124', quantity: 40, startDate: '2022-01-01', endDate: '2026-12-31' }
    ]
  },
  {
    id: '4',
    name: '60 Day Product Trial of Red Hat AI Inference Server, Self‑Support',
    sku: 'SER0861',
    quantity: 6,
    serviceLevel: 'Self-Support',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [
      { contractNumber: '77881234', quantity: 6, startDate: '2024-02-15', endDate: '2024-04-15' }
    ]
  },
  {
    id: '5',
    name: '60 Day Product Trial of Red Hat Advanced Cluster Management for Kubernetes, Self‑Supported',
    sku: 'SER0599',
    quantity: 1,
    serviceLevel: 'Self-Support',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [
      { contractNumber: '66990123', quantity: 1, startDate: '2024-05-01', endDate: '2024-07-01' }
    ]
  },
  {
    id: '6',
    name: '60 Day Product Trial of Red Hat Advanced Cluster Security Cloud Service, Self‑Supported',
    sku: 'SER0798',
    quantity: 0,
    serviceLevel: 'Self-Support',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: []
  },
  {
    id: '7',
    name: '60 Day Product Trial of Red Hat Advanced Cluster Security for Kubernetes, Self‑Support',
    sku: 'SER0720',
    quantity: 1,
    serviceLevel: 'Self-Support',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [
      { contractNumber: '33110022', quantity: 1, startDate: '2024-06-01', endDate: '2024-08-01' }
    ]
  },
  {
    id: '8',
    name: '60 Day Product Trial of Red Hat Ansible Automation Platform, Self‑Supported (100 Managed Nodes)',
    sku: 'SER0569',
    quantity: 3,
    serviceLevel: 'Self-Support',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [
      { contractNumber: '99887766', quantity: 2, startDate: '2024-05-10', endDate: '2024-07-10' },
      { contractNumber: '99887767', quantity: 1, startDate: '2024-05-10', endDate: '2024-07-10' }
    ]
  },
  {
    id: '9',
    name: 'Red Hat Enterprise Linux Server, Premium (Physical or Virtual Nodes)',
    sku: 'SER1200',
    quantity: 50,
    serviceLevel: 'Premium',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90010001', quantity: 50, startDate: '2024-01-01', endDate: '2025-01-01' }]
  },
  {
    id: '10',
    name: 'Extended Lifecycle Support (ELS) Add-on',
    sku: 'SER1201',
    quantity: 50,
    serviceLevel: 'Premium',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90010002', quantity: 50, startDate: '2024-01-01', endDate: '2025-01-01' }]
  },
  {
    id: '11',
    name: 'Red Hat Smart Management',
    sku: 'SER1202',
    quantity: 50,
    serviceLevel: 'Standard',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90010003', quantity: 50, startDate: '2024-01-01', endDate: '2025-01-01' }]
  },
  {
    id: '12',
    name: 'OpenShift Container Platform, Standard (2 Cores)',
    sku: 'SER2100',
    quantity: 10,
    serviceLevel: 'Standard',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90020001', quantity: 10, startDate: '2024-02-01', endDate: '2025-02-01' }]
  },
  {
    id: '13',
    name: 'OpenShift Cluster Subscription',
    sku: 'SER2101',
    quantity: 1,
    serviceLevel: 'Standard',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90020002', quantity: 1, startDate: '2024-02-01', endDate: '2025-02-01' }]
  },
  {
    id: '14',
    name: 'Subscription Support Registration',
    sku: 'SER3100',
    quantity: 1,
    serviceLevel: 'Standard',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90030001', quantity: 1, startDate: '2024-03-01', endDate: '2025-03-01' }]
  },
  {
    id: '15',
    name: 'Red Hat Enterprise Linux 9, Premium (Marketplace)',
    sku: 'SER1290',
    quantity: 20,
    serviceLevel: 'Premium',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90012900', quantity: 20, startDate: '2024-04-01', endDate: '2025-04-01' }]
  },
  {
    id: '16',
    name: 'RHEL Add-ons Pack',
    sku: 'SER1295',
    quantity: 20,
    serviceLevel: 'Standard',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90012950', quantity: 20, startDate: '2024-04-01', endDate: '2025-04-01' }]
  },
  {
    id: '17',
    name: 'RHEL for Azure, Standard',
    sku: 'SER1400',
    quantity: 30,
    serviceLevel: 'Standard',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90014000', quantity: 30, startDate: '2024-04-08', endDate: '2025-04-08' }]
  },
  {
    id: '18',
    name: 'OpenShift for Azure, Premium',
    sku: 'SER2102',
    quantity: 5,
    serviceLevel: 'Premium',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90021020', quantity: 5, startDate: '2024-04-08', endDate: '2025-04-08' }]
  },
  {
    id: '19',
    name: 'OpenShift Integration Tools',
    sku: 'MW0152001',
    quantity: 5,
    serviceLevel: 'Standard',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90021021', quantity: 5, startDate: '2024-04-08', endDate: '2025-04-08' }]
  },
  {
    id: '20',
    name: 'RHEL 9, Standard',
    sku: 'SER1280',
    quantity: 40,
    serviceLevel: 'Standard',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90012800', quantity: 40, startDate: '2024-02-29', endDate: '2025-02-28' }]
  },
  {
    id: '21',
    name: 'RHEL on Google Cloud, Standard',
    sku: 'SER1410',
    quantity: 25,
    serviceLevel: 'Standard',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90014100', quantity: 25, startDate: '2024-01-02', endDate: '2025-01-01' }]
  },
  {
    id: '22',
    name: 'Usage metering',
    sku: 'SER5002',
    quantity: 25,
    serviceLevel: 'Standard',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90050020', quantity: 25, startDate: '2024-01-02', endDate: '2025-01-01' }]
  },
  {
    id: '23',
    name: 'RHEL for IBM Cloud Paks',
    sku: 'SER1420',
    quantity: 10,
    serviceLevel: 'Standard',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90014200', quantity: 10, startDate: '2023-10-31', endDate: '2024-10-31' }]
  },
  {
    id: '24',
    name: 'OpenShift Container Platform (AWS)',
    sku: 'SER2103',
    quantity: 6,
    serviceLevel: 'Standard',
    supportType: 'L1‑L3',
    capacity: 'Not Available',
    virtualGuestLimit: 'Not Available',
    contracts: [{ contractNumber: '90021030', quantity: 6, startDate: '2023-10-28', endDate: '2024-10-28' }]
  }
];

