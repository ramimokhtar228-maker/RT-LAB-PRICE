import { LabTest, OfferPackage, InvoiceRecord, LabSettings, DailyOffer, FullBackupPayload } from '../types/lab';
import { INITIAL_TESTS, INITIAL_PACKAGES, INITIAL_SETTINGS, INITIAL_DAILY_OFFERS } from '../data/initialData';

const STORAGE_KEYS = {
  TESTS: 'rt_lab_tests_v2', // bumped to v2 for 520+ tests
  PACKAGES: 'rt_lab_packages_v2',
  DAILY_OFFERS: 'rt_lab_daily_offers_v1',
  INVOICES: 'rt_lab_invoices_v1',
  SETTINGS: 'rt_lab_settings_v1',
  COMPACT_MODE: 'rt_lab_compact_mode',
  SNAPSHOT: 'rt_lab_backup_snapshot_v2',
};

export const storageService = {
  // Tests
  getTests(): LabTest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TESTS);
      if (data) {
        const parsed: LabTest[] = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
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
  },

  // --- COMPREHENSIVE BACKUP, EXPORT, IMPORT & PERSISTENCE ---

  /**
   * Immediately persist all modified data to localStorage and save snapshot
   */
  persistAllData(
    tests: LabTest[],
    packages: OfferPackage[],
    dailyOffers: DailyOffer[],
    settings: LabSettings,
    invoices?: InvoiceRecord[]
  ): { success: boolean; timestamp: string } {
    try {
      const timestamp = new Date().toISOString();
      this.saveTests(tests);
      this.savePackages(packages);
      this.saveDailyOffers(dailyOffers);
      this.saveSettings(settings);
      if (invoices) {
        localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
      }

      // Save a comprehensive snapshot
      const snapshot: FullBackupPayload = {
        version: '2.1.0',
        exportDate: timestamp,
        labName: settings.labName,
        settings,
        tests,
        packages,
        dailyOffers,
        invoices: invoices || this.getInvoices(),
        stats: {
          totalTests: tests.length,
          totalPackages: packages.length,
          totalDailyOffers: dailyOffers.length,
          totalInvoices: (invoices || this.getInvoices()).length,
        },
      };
      localStorage.setItem(STORAGE_KEYS.SNAPSHOT, JSON.stringify(snapshot));

      // Trigger cross-component sync event
      window.dispatchEvent(new CustomEvent('rt-lab-data-persisted', { detail: { timestamp } }));

      return { success: true, timestamp };
    } catch (err) {
      console.error('Failed to persist all lab data', err);
      return { success: false, timestamp: new Date().toISOString() };
    }
  },

  /**
   * Get full backup payload object
   */
  getFullBackupPayload(
    testsParam?: LabTest[],
    packagesParam?: OfferPackage[],
    dailyOffersParam?: DailyOffer[],
    settingsParam?: LabSettings,
    invoicesParam?: InvoiceRecord[]
  ): FullBackupPayload {
    const tests = testsParam || this.getTests();
    const packages = packagesParam || this.getPackages();
    const dailyOffers = dailyOffersParam || this.getDailyOffers();
    const settings = settingsParam || this.getSettings();
    const invoices = invoicesParam || this.getInvoices();
    const timestamp = new Date().toISOString();

    return {
      version: '2.1.0',
      exportDate: timestamp,
      labName: settings.labName,
      settings,
      tests,
      packages,
      dailyOffers,
      invoices,
      stats: {
        totalTests: tests.length,
        totalPackages: packages.length,
        totalDailyOffers: dailyOffers.length,
        totalInvoices: invoices.length,
      },
    };
  },

  /**
   * Download full JSON backup file for RT Lab Price System
   */
  downloadFullBackupJSON(
    testsParam?: LabTest[],
    packagesParam?: OfferPackage[],
    dailyOffersParam?: DailyOffer[],
    settingsParam?: LabSettings,
    invoicesParam?: InvoiceRecord[]
  ): string {
    const payload = this.getFullBackupPayload(
      testsParam,
      packagesParam,
      dailyOffersParam,
      settingsParam,
      invoicesParam
    );
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `نسخة_احتياطية_معامل_RT_للاسعار_${dateStr}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return filename;
  },

  /**
   * Export tests list to Excel CSV with Arabic UTF-8 BOM
   */
  exportTestsCSV(testsParam?: LabTest[]): string {
    const tests = testsParam || this.getTests();
    if (tests.length === 0) return '';

    const headers = [
      'كود التحليل',
      'اسم التحليل بالعربية',
      'اسم التحليل بالإنجليزية',
      'التصنيف الطبي',
      'السعر الرسمي (ج.م)',
      'نوع العينة المطلوبة',
      'تعليمات الصيام والشروط',
      'وقت ظهور النتيجة',
      'فحص شائع ومميز',
    ];

    const categoryNames: Record<string, string> = {
      all: 'الكل',
      hematology: 'أمراض الدم',
      coagulation: 'التجلط والسيولة',
      liver: 'وظائف الكبد',
      kidney: 'وظائف الكلى',
      lipids: 'الدهون والكوليسترول',
      cardiac: 'إنزيمات القلب',
      diabetes: 'السكر ومقاومة الإنسولين',
      thyroid: 'الغدة الدرقية',
      hormones: 'الهرمونات والخصوبة',
      vitamins: 'الفيتامينات والمعادن',
      immunology: 'المناعة والأجسام المضادة',
      allergy: 'الحساسية',
      serology: 'السيرولوجي والفيروسات',
      pcr: 'البيولوجيا الجزيئية PCR',
      tumors: 'دلالات الأورام',
      tdm: 'أدوية علاجية TDM',
      microbiology: 'الميكروبيولوجي والمزارع',
      custom: 'مخصص',
    };

    const rows = tests.map((t) => [
      t.code || '',
      `"${t.nameAr.replace(/"/g, '""')}"`,
      `"${(t.nameEn || '').replace(/"/g, '""')}"`,
      `"${categoryNames[t.category] || t.category}"`,
      t.price,
      `"${(t.sampleType || '').replace(/"/g, '""')}"`,
      `"${(t.fasting || '').replace(/"/g, '""')}"`,
      `"${(t.duration || '').replace(/"/g, '""')}"`,
      t.isPopular ? 'نعم' : 'لا',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `كشف_أسعار_تحاليل_معامل_RT_${dateStr}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return filename;
  },

  /**
   * Export packages to Excel CSV
   */
  exportPackagesCSV(packagesParam?: OfferPackage[]): string {
    const packages = packagesParam || this.getPackages();
    if (packages.length === 0) return '';

    const headers = [
      'اسم الباقة بالعربية',
      'الاسم بالإنجليزية',
      'الشعار اللفظي',
      'سعر الباقة بعد الخصم (ج.م)',
      'السعر الأصلي قبل الخصم (ج.م)',
      'قيمة الوفر للمريض (ج.م)',
      'نسبة الخصم',
      'التصنيف',
      'عدد الفحوصات المشمولة',
      'الوصف',
    ];

    const rows = packages.map((p) => {
      const savings = Math.max(0, p.originalPrice - p.packagePrice);
      const discountPct =
        p.originalPrice > 0 ? Math.round((savings / p.originalPrice) * 100) : 0;

      return [
        `"${p.nameAr.replace(/"/g, '""')}"`,
        `"${(p.nameEn || '').replace(/"/g, '""')}"`,
        `"${(p.tagline || '').replace(/"/g, '""')}"`,
        p.packagePrice,
        p.originalPrice,
        savings,
        `${discountPct}%`,
        `"${p.category}"`,
        p.includedItems.length,
        `"${(p.description || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `باقات_وعروض_معامل_RT_${dateStr}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return filename;
  },

  /**
   * Import JSON backup data with Merge or Replace mode
   */
  importBackupData(
    rawData: string | object,
    mode: 'merge' | 'replace' = 'merge'
  ): {
    success: boolean;
    message: string;
    tests: LabTest[];
    packages: OfferPackage[];
    dailyOffers: DailyOffer[];
    settings: LabSettings;
    importedTestsCount: number;
    importedPackagesCount: number;
  } {
    try {
      let parsed: any;
      if (typeof rawData === 'string') {
        parsed = JSON.parse(rawData);
      } else {
        parsed = rawData;
      }

      if (!parsed || typeof parsed !== 'object') {
        return {
          success: false,
          message: 'الملف المرفوع لا يحتوي على بنية بيانات صحيحة.',
          tests: this.getTests(),
          packages: this.getPackages(),
          dailyOffers: this.getDailyOffers(),
          settings: this.getSettings(),
          importedTestsCount: 0,
          importedPackagesCount: 0,
        };
      }

      // 1. Tests handling
      let incomingTests: LabTest[] = [];
      if (Array.isArray(parsed.tests)) {
        incomingTests = parsed.tests;
      } else if (Array.isArray(parsed)) {
        // file is just array of tests
        incomingTests = parsed;
      }

      const validTests: LabTest[] = incomingTests
        .filter((t) => t && (t.nameAr || t.code) && typeof t.price === 'number')
        .map((t, idx) => ({
          id: t.id || `test-imp-${Date.now()}-${idx}`,
          code: String(t.code || `T${idx + 1}`).trim().toUpperCase(),
          nameAr: String(t.nameAr).trim(),
          nameEn: String(t.nameEn || '').trim(),
          category: t.category || 'custom',
          price: Number(t.price) || 0,
          sampleType: t.sampleType || 'عينة دم',
          fasting: t.fasting || 'لا يشترط صيام',
          duration: t.duration || 'خلال ساعتين',
          description: t.description,
          isPopular: !!t.isPopular,
        }));

      // 2. Packages handling
      const incomingPackages: OfferPackage[] = Array.isArray(parsed.packages) ? parsed.packages : [];
      const validPackages: OfferPackage[] = incomingPackages
        .filter((p) => p && p.nameAr && typeof p.packagePrice === 'number')
        .map((p, idx) => ({
          id: p.id || `pkg-imp-${Date.now()}-${idx}`,
          nameAr: String(p.nameAr).trim(),
          nameEn: String(p.nameEn || '').trim(),
          tagline: String(p.tagline || '').trim(),
          category: p.category || 'عام',
          includedItems: Array.isArray(p.includedItems) ? p.includedItems : [],
          packagePrice: Number(p.packagePrice) || 0,
          originalPrice: Number(p.originalPrice) || Number(p.packagePrice) || 0,
          badge: p.badge,
          description: p.description || '',
          icon: p.icon,
        }));

      // 3. Daily offers handling
      const incomingOffers: DailyOffer[] = Array.isArray(parsed.dailyOffers) ? parsed.dailyOffers : [];
      const validOffers: DailyOffer[] = incomingOffers.filter((o) => o && o.title);

      // 4. Settings handling
      let currentSettings = this.getSettings();
      if (parsed.settings && typeof parsed.settings === 'object') {
        currentSettings = { ...currentSettings, ...parsed.settings };
      }

      // Calculate final collections based on mode
      let finalTests: LabTest[] = [];
      let finalPackages: OfferPackage[] = [];
      let finalOffers: DailyOffer[] = [];

      if (mode === 'replace') {
        finalTests = validTests.length > 0 ? validTests : this.getTests();
        finalPackages = validPackages.length > 0 ? validPackages : this.getPackages();
        finalOffers = validOffers.length > 0 ? validOffers : this.getDailyOffers();
      } else {
        // Merge mode:
        // Tests merge: map by id, code, or nameAr
        const testMap = new Map<string, LabTest>();
        const existingTests = this.getTests();
        for (const t of existingTests) {
          testMap.set(t.id, t);
          if (t.code) testMap.set(`code_${t.code.toUpperCase()}`, t);
        }
        for (const t of validTests) {
          // match existing
          let match = testMap.get(t.id) || (t.code ? testMap.get(`code_${t.code.toUpperCase()}`) : undefined);
          if (match) {
            Object.assign(match, t);
          } else {
            existingTests.push(t);
            testMap.set(t.id, t);
          }
        }
        finalTests = existingTests;

        // Packages merge
        const existingPackages = this.getPackages();
        const pkgMap = new Map<string, OfferPackage>();
        for (const p of existingPackages) {
          pkgMap.set(p.id, p);
        }
        for (const p of validPackages) {
          const match = pkgMap.get(p.id);
          if (match) {
            Object.assign(match, p);
          } else {
            existingPackages.push(p);
            pkgMap.set(p.id, p);
          }
        }
        finalPackages = existingPackages;

        // Daily offers merge
        const existingOffers = this.getDailyOffers();
        const offerMap = new Map<string, DailyOffer>();
        for (const o of existingOffers) {
          offerMap.set(o.id, o);
        }
        for (const o of validOffers) {
          const match = offerMap.get(o.id);
          if (match) {
            Object.assign(match, o);
          } else {
            existingOffers.push(o);
            offerMap.set(o.id, o);
          }
        }
        finalOffers = existingOffers;
      }

      // Invoices
      if (Array.isArray(parsed.invoices) && parsed.invoices.length > 0) {
        if (mode === 'replace') {
          localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(parsed.invoices));
        } else {
          const currentInvoices = this.getInvoices();
          const invMap = new Map<string, InvoiceRecord>();
          for (const inv of currentInvoices) invMap.set(inv.id, inv);
          for (const inv of parsed.invoices) invMap.set(inv.id, inv);
          localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(Array.from(invMap.values())));
        }
      }

      // Persist all data
      this.persistAllData(finalTests, finalPackages, finalOffers, currentSettings);

      const msg =
        mode === 'replace'
          ? `تم استبدال واسترجاع ${validTests.length} فحص و${validPackages.length} باقة بنجاح وتثبيت الأسعار!`
          : `تم دمج وتحديث ${validTests.length} فحص و${validPackages.length} باقة بنجاح وتثبيت التعديلات!`;

      return {
        success: true,
        message: msg,
        tests: finalTests,
        packages: finalPackages,
        dailyOffers: finalOffers,
        settings: currentSettings,
        importedTestsCount: validTests.length,
        importedPackagesCount: validPackages.length,
      };
    } catch (err) {
      console.error('Failed to import backup data', err);
      return {
        success: false,
        message: 'حدث خطأ أثناء قراءة الملف أو استيراد البيانات. يرجى التأكد من صحة الملف.',
        tests: this.getTests(),
        packages: this.getPackages(),
        dailyOffers: this.getDailyOffers(),
        settings: this.getSettings(),
        importedTestsCount: 0,
        importedPackagesCount: 0,
      };
    }
  },

  /**
   * Import tests from CSV
   */
  importTestsFromCSV(
    csvText: string,
    mode: 'merge' | 'replace' = 'merge'
  ): {
    success: boolean;
    message: string;
    tests: LabTest[];
    importedTestsCount: number;
  } {
    try {
      const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        return {
          success: false,
          message: 'الملف فارغ أو لا يحتوي على صفوف بيانات صالحة.',
          tests: this.getTests(),
          importedTestsCount: 0,
        };
      }

      const dataLines = lines.slice(1);
      const parsedTests: LabTest[] = [];

      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i];
        const cols: string[] = [];
        let inQuote = false;
        let current = '';

        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"' && (j === 0 || line[j - 1] !== '\\')) {
            inQuote = !inQuote;
          } else if (char === ',' && !inQuote) {
            cols.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        cols.push(current.trim());

        const cleanCols = cols.map((c) => c.replace(/^"|"$/g, '').trim());
        const code = cleanCols[0] || `T${i + 1}`;
        const nameAr = cleanCols[1] || '';
        const nameEn = cleanCols[2] || '';
        const price = Number(cleanCols[4]) || 0;

        if (!nameAr) continue;

        parsedTests.push({
          id: `csv-test-${Date.now()}-${i}`,
          code: code.toUpperCase(),
          nameAr,
          nameEn,
          category: 'custom',
          price,
          sampleType: cleanCols[5] || 'عينة دم',
          fasting: cleanCols[6] || 'لا يشترط صيام',
          duration: cleanCols[7] || 'خلال ساعتين',
          isPopular: cleanCols[8] === 'نعم',
        });
      }

      if (parsedTests.length === 0) {
        return {
          success: false,
          message: 'لم يتم العثور على أي تحاليل صالحة في ملف CSV.',
          tests: this.getTests(),
          importedTestsCount: 0,
        };
      }

      let finalTests: LabTest[] = [];
      if (mode === 'replace') {
        finalTests = parsedTests;
      } else {
        const existing = this.getTests();
        const testMap = new Map<string, LabTest>();
        for (const t of existing) {
          testMap.set(t.code.toUpperCase(), t);
          testMap.set(t.nameAr.toLowerCase(), t);
        }
        for (const t of parsedTests) {
          const match =
            testMap.get(t.code.toUpperCase()) || testMap.get(t.nameAr.toLowerCase());
          if (match) {
            match.price = t.price;
            if (t.nameEn) match.nameEn = t.nameEn;
            if (t.sampleType) match.sampleType = t.sampleType;
            if (t.fasting) match.fasting = t.fasting;
            if (t.duration) match.duration = t.duration;
          } else {
            existing.push(t);
          }
        }
        finalTests = existing;
      }

      this.saveTests(finalTests);
      this.persistAllData(
        finalTests,
        this.getPackages(),
        this.getDailyOffers(),
        this.getSettings()
      );

      return {
        success: true,
        message: `تم استيراد وتحديث ${parsedTests.length} فحص بنجاح من ملف CSV وتثبيت الأسعار!`,
        tests: finalTests,
        importedTestsCount: parsedTests.length,
      };
    } catch (err) {
      console.error('Failed to import tests from CSV', err);
      return {
        success: false,
        message: 'حدث خطأ أثناء معالجة ملف CSV.',
        tests: this.getTests(),
        importedTestsCount: 0,
      };
    }
  },
};

