import { LabTest, OfferPackage, InvoiceRecord, LabSettings, DailyOffer } from '../types/lab';
import { INITIAL_TESTS, INITIAL_PACKAGES, INITIAL_SETTINGS, INITIAL_DAILY_OFFERS } from '../data/initialData';

const STORAGE_KEYS = {
  TESTS: 'rt_lab_tests_v2', // bumped to v2 for 520+ tests
  PACKAGES: 'rt_lab_packages_v2',
  DAILY_OFFERS: 'rt_lab_daily_offers_v1',
  INVOICES: 'rt_lab_invoices_v1',
  SETTINGS: 'rt_lab_settings_v1',
  COMPACT_MODE: 'rt_lab_compact_mode',
};

export const storageService = {
  // Tests
  getTests(): LabTest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TESTS);
      if (data) {
        const parsed: LabTest[] = JSON.parse(data);
        // Automatically upgrade if saved list is from older version with fewer tests
        if (Array.isArray(parsed) && parsed.length >= 500) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading tests from localStorage', e);
    }
    // Default to comprehensive catalog (520+ tests)
    this.saveTests(INITIAL_TESTS);
    return INITIAL_TESTS;
  },

  saveTests(tests: LabTest[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
    } catch (e) {
      console.error('Error saving tests to localStorage', e);
    }
  },

  updateTest(updatedTest: LabTest): LabTest[] {
    const tests = this.getTests();
    const index = tests.findIndex((t) => t.id === updatedTest.id);
    if (index >= 0) {
      tests[index] = updatedTest;
    } else {
      tests.unshift(updatedTest);
    }
    this.saveTests(tests);
    return tests;
  },

  deleteTest(id: string): LabTest[] {
    const tests = this.getTests().filter((t) => t.id !== id);
    this.saveTests(tests);
    return tests;
  },

  resetTestsToDefault(): LabTest[] {
    this.saveTests(INITIAL_TESTS);
    return INITIAL_TESTS;
  },

  // Daily Offers & Flash Discounts
  getDailyOffers(): DailyOffer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_OFFERS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading daily offers from localStorage', e);
    }
    this.saveDailyOffers(INITIAL_DAILY_OFFERS);
    return INITIAL_DAILY_OFFERS;
  },

  saveDailyOffers(offers: DailyOffer[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_OFFERS, JSON.stringify(offers));
    } catch (e) {
      console.error('Error saving daily offers to localStorage', e);
    }
  },

  updateDailyOffer(offer: DailyOffer): DailyOffer[] {
    const offers = this.getDailyOffers();
    const index = offers.findIndex((o) => o.id === offer.id);
    if (index >= 0) {
      offers[index] = offer;
    } else {
      offers.unshift(offer);
    }
    this.saveDailyOffers(offers);
    return offers;
  },

  deleteDailyOffer(id: string): DailyOffer[] {
    const offers = this.getDailyOffers().filter((o) => o.id !== id);
    this.saveDailyOffers(offers);
    return offers;
  },

  resetDailyOffers(): DailyOffer[] {
    this.saveDailyOffers(INITIAL_DAILY_OFFERS);
    return INITIAL_DAILY_OFFERS;
  },

  // Packages / Offers
  getPackages(): OfferPackage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading packages from localStorage', e);
    }
    this.savePackages(INITIAL_PACKAGES);
    return INITIAL_PACKAGES;
  },

  savePackages(packages: OfferPackage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
    } catch (e) {
      console.error('Error saving packages to localStorage', e);
    }
  },

  updatePackage(pkg: OfferPackage): OfferPackage[] {
    const packages = this.getPackages();
    const index = packages.findIndex((p) => p.id === pkg.id);
    if (index >= 0) {
      packages[index] = pkg;
    } else {
      packages.unshift(pkg);
    }
    this.savePackages(packages);
    return packages;
  },

  deletePackage(id: string): OfferPackage[] {
    const packages = this.getPackages().filter((p) => p.id !== id);
    this.savePackages(packages);
    return packages;
  },

  resetPackagesToDefault(): OfferPackage[] {
    this.savePackages(INITIAL_PACKAGES);
    return INITIAL_PACKAGES;
  },

  // Invoices & Quotations
  getInvoices(): InvoiceRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading invoices from localStorage', e);
    }
    return [];
  },

  saveInvoice(invoice: InvoiceRecord): InvoiceRecord[] {
    const list = this.getInvoices();
    const existingIndex = list.findIndex((i) => i.id === invoice.id);
    if (existingIndex >= 0) {
      list[existingIndex] = invoice;
    } else {
      list.unshift(invoice);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving invoice to localStorage', e);
    }
    return list;
  },

  deleteInvoice(id: string): InvoiceRecord[] {
    const list = this.getInvoices().filter((i) => i.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(list));
    } catch (e) {
      console.error('Error deleting invoice from localStorage', e);
    }
    return list;
  },

  // Settings
  getSettings(): LabSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Error reading settings from localStorage', e);
    }
    return INITIAL_SETTINGS;
  },

  saveSettings(settings: LabSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  },

  // Compact Mode preference
  getCompactMode(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.COMPACT_MODE) === 'true';
    } catch {
      return false;
    }
  },

  saveCompactMode(compact: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPACT_MODE, String(compact));
    } catch {
      // ignore
    }
  }
};
