export type TestCategory =
  | 'all'
  | 'hematology'
  | 'coagulation'
  | 'liver'
  | 'kidney'
  | 'lipids'
  | 'cardiac'
  | 'diabetes'
  | 'thyroid'
  | 'hormones'
  | 'vitamins'
  | 'immunology'
  | 'allergy'
  | 'serology'
  | 'pcr'
  | 'tumors'
  | 'tdm'
  | 'microbiology'
  | 'custom';

export interface DailyOffer {
  id: string;
  title: string;
  description: string;
  discountPercentage?: number;
  specialPrice?: number;
  applicablePackageId?: string;
  applicableTestIds?: string[];
  isActive: boolean;
  badgeText?: string;
}

export interface LabTest {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  category: TestCategory;
  price: number;
  sampleType: string;
  fasting: string;
  duration: string;
  description?: string;
  isPopular?: boolean;
}

export interface SelectedTestItem {
  test: LabTest;
  customPrice?: number;
  notes?: string;
}

export interface OfferPackage {
  id: string;
  nameAr: string;
  nameEn: string;
  tagline: string;
  category: string;
  includedItems: {
    testId: string;
    isRequired: boolean; // if required or variable/optional
    isDefaultSelected: boolean;
  }[];
  packagePrice: number;
  originalPrice: number;
  badge?: string;
  description: string;
  icon?: string;
}

export interface DiscountContract {
  id: string;
  name: string;
  percentage: number;
  type: 'syndicate' | 'insurance' | 'special' | 'campaign';
}

export interface PatientInfo {
  name: string;
  phone: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  referringDoctor: string;
  branch: string;
  notes: string;
  sampleCollectionType: 'lab' | 'home';
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  date: string;
  patient: PatientInfo;
  items: {
    testId: string;
    testNameAr: string;
    testNameEn: string;
    category: string;
    price: number;
    sampleType: string;
    fasting: string;
  }[];
  appliedPackage?: {
    id: string;
    nameAr: string;
    packagePrice: number;
  };
  totalBeforeDiscount: number;
  discountType: 'percentage' | 'fixed' | 'contract' | 'none';
  discountValue: number;
  discountAmount: number;
  contractName?: string;
  netTotal: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'draft' | 'paid' | 'partial' | 'sent_whatsapp';
  createdAt: number;
}

export interface LabSettings {
  labName: string;
  labSubtitle: string;
  doctorName: string;
  doctorTitle: string;
  hotline: string;
  whatsappNumber: string;
  address: string;
  branches: string[];
  homeVisitAvailable: boolean;
  currency: string;
}
