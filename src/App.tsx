import React, { useState, useEffect, useMemo } from 'react';
import {
  LabTest,
  OfferPackage,
  SelectedTestItem,
  PatientInfo,
  InvoiceRecord,
  DiscountContract,
  LabSettings,
  DailyOffer,
} from './types/lab';
import { storageService } from './services/storageService';
import { CONTRACT_DISCOUNTS } from './data/initialData';
import { Header } from './components/Header';
import { DailyOffersBanner } from './components/DailyOffersBanner';
import { DailyOffersModal } from './components/DailyOffersModal';
import { PatientForm } from './components/PatientForm';
import { TestSelector } from './components/TestSelector';
import { PricingSummary } from './components/PricingSummary';
import { BundleDetectorAlert } from './components/BundleDetectorAlert';
import { PackagesOffersModal } from './components/PackagesOffersModal';
import { EditTestModal } from './components/EditTestModal';
import { EditPackageModal } from './components/EditPackageModal';
import { WhatsAppPreviewModal } from './components/WhatsAppPreviewModal';
import { PrintQuotation } from './components/PrintQuotation';
import { CatalogManagerModal } from './components/CatalogManagerModal';
import { InvoiceHistoryModal } from './components/InvoiceHistoryModal';
import { LabSettingsModal } from './components/LabSettingsModal';
import { Check, Sparkles, Activity, FileCheck, Layers, AlertCircle, Flame, Plus } from 'lucide-react';

export default function App() {
  // App persistent states
  const [settings, setSettings] = useState<LabSettings>(() => storageService.getSettings());
  const [tests, setTests] = useState<LabTest[]>(() => storageService.getTests());
  const [packages, setPackages] = useState<OfferPackage[]>(() => storageService.getPackages());
  const [dailyOffers, setDailyOffers] = useState<DailyOffer[]>(() => storageService.getDailyOffers());
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => storageService.getInvoices());
  const [isCompactMode, setIsCompactMode] = useState<boolean>(() => storageService.getCompactMode());

  // Active quotation state
  const [invoiceNumber, setInvoiceNumber] = useState<string>(() => generateInvoiceNumber());
  const [patient, setPatient] = useState<PatientInfo>(() => ({
    name: '',
    phone: '',
    age: '',
    gender: 'male',
    referringDoctor: '',
    branch: settings.branches[0] || 'الفرع الرئيسي',
    notes: '',
    sampleCollectionType: 'lab',
  }));

  const [selectedItems, setSelectedItems] = useState<SelectedTestItem[]>([]);
  const [appliedPackage, setAppliedPackage] = useState<
    { id: string; nameAr: string; packagePrice: number } | undefined
  >(undefined);
  const [appliedDailyOffer, setAppliedDailyOffer] = useState<DailyOffer | null>(null);

  const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | 'contract' | 'none'>('none');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [contractName, setContractName] = useState<string | undefined>(undefined);
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // Modals state
  const [isDailyOffersOpen, setIsDailyOffersOpen] = useState(false);
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Editing Modals state
  const [activeEditingTest, setActiveEditingTest] = useState<LabTest | null>(null);
  const [activeEditingPackage, setActiveEditingPackage] = useState<OfferPackage | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  function generateInvoiceNumber() {
    const year = new Date().getFullYear().toString().slice(-2);
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `RT-${year}-${rand}`;
  }

  // Toggle Compact Mode
  const handleToggleCompactMode = () => {
    setIsCompactMode((prev) => {
      const next = !prev;
      storageService.saveCompactMode(next);
      showToast(next ? 'تم تفعيل النمط المصغر السريع' : 'تم تفعيل النمط العادي');
      return next;
    });
  };

  // Toggle Test selection
  const handleToggleTest = (test: LabTest) => {
    setSelectedItems((prev) => {
      const exists = prev.some((item) => item.test.id === test.id);
      if (exists) {
        return prev.filter((item) => item.test.id !== test.id);
      } else {
        return [...prev, { test }];
      }
    });
  };

  const handleRemoveItem = (testId: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.test.id !== testId));
  };

  const handleClearAll = () => {
    if (confirm('هل أنت متأكد من تفريغ كافة الفحوصات المختارة؟')) {
      setSelectedItems([]);
      setAppliedPackage(undefined);
      setAppliedDailyOffer(null);
      setDiscountType('none');
      setDiscountValue(0);
      setContractName(undefined);
      setPaidAmount(0);
      showToast('تم تفريغ الفاتورة بنجاح');
    }
  };

  // Daily Offers application
  const handleApplyDailyOffer = (offer: DailyOffer) => {
    setAppliedDailyOffer(offer);

    // If offer has an applicable package
    if (offer.applicablePackageId) {
      const pkg = packages.find((p) => p.id === offer.applicablePackageId);
      if (pkg) {
        const testIds = pkg.includedItems
          .filter((i) => i.isDefaultSelected)
          .map((i) => i.testId);
        const testsToSelect = testIds
          .map((id) => tests.find((t) => t.id === id))
          .filter((t): t is LabTest => t !== undefined);

        setSelectedItems(testsToSelect.map((test) => ({ test })));
        setAppliedPackage({
          id: pkg.id,
          nameAr: pkg.nameAr,
          packagePrice: offer.specialPrice || pkg.packagePrice,
        });
      }
    }

    // If offer is percentage discount
    if (offer.discountPercentage) {
      setDiscountType('percentage');
      setDiscountValue(offer.discountPercentage);
      setContractName(offer.title);
    }

    showToast(`🔥 تم تطبيق: ${offer.title}`);
  };

  const handleRemoveDailyOffer = () => {
    setAppliedDailyOffer(null);
    setDiscountType('none');
    setDiscountValue(0);
    setContractName(undefined);
    showToast('تم إلغاء العرض اليومي');
  };

  // Packages application
  const handleApplyPackage = (
    pkg: OfferPackage,
    selectedTestIds: string[],
    finalPackagePrice: number
  ) => {
    const testsToSelect = selectedTestIds
      .map((id) => tests.find((t) => t.id === id))
      .filter((t): t is LabTest => t !== undefined);

    setSelectedItems(testsToSelect.map((test) => ({ test })));
    setAppliedPackage({
      id: pkg.id,
      nameAr: pkg.nameAr,
      packagePrice: finalPackagePrice,
    });
    setDiscountType('none');
    setDiscountValue(0);
    setContractName(undefined);
    showToast(`تم تفعيل باقة: ${pkg.nameAr}`);
  };

  const handleDetachPackage = () => {
    setAppliedPackage(undefined);
    showToast('تم فك ارتباط الباقة وحساب التحاليل فردياً');
  };

  // Save / Update Test
  const handleSaveTest = (updatedTest: LabTest) => {
    const updated = storageService.updateTest(updatedTest);
    setTests(updated);
    setSelectedItems((prev) =>
      prev.map((item) => (item.test.id === updatedTest.id ? { ...item, test: updatedTest } : item))
    );
    showToast(`تم تحديث بيانات تحليل: ${updatedTest.nameAr}`);
  };

  const handleDeleteTest = (id: string) => {
    const updated = storageService.deleteTest(id);
    setTests(updated);
    setSelectedItems((prev) => prev.filter((item) => item.test.id !== id));
    showToast('تم حذف التحليل من قاعدة البيانات');
  };

  const handleResetTests = () => {
    const def = storageService.resetTestsToDefault();
    setTests(def);
    showToast('تمت استعادة الدليل الشامل لجميع التحاليل (+520 فحص طبي)');
  };

  // Save / Update Package
  const handleSavePackage = (updatedPkg: OfferPackage) => {
    const updated = storageService.updatePackage(updatedPkg);
    setPackages(updated);
    showToast(`تم حفظ باقة: ${updatedPkg.nameAr}`);
  };

  const handleDeletePackage = (id: string) => {
    const updated = storageService.deletePackage(id);
    setPackages(updated);
    showToast('تم حذف الباقة بنجاح');
  };

  // Daily Offer update
  const handleSaveDailyOffer = (offer: DailyOffer) => {
    const updated = storageService.updateDailyOffer(offer);
    setDailyOffers(updated);
    showToast(`تم حفظ العرض اليومي: ${offer.title}`);
  };

  const handleDeleteDailyOffer = (id: string) => {
    const updated = storageService.deleteDailyOffer(id);
    setDailyOffers(updated);
    showToast('تم حذف العرض اليومي');
  };

  // Start new empty invoice
  const handleNewInvoice = () => {
    if (selectedItems.length > 0) {
      if (!confirm('بدء حالة جديدة؟ سيتم تفريغ الفاتورة الحالية.')) {
        return;
      }
    }
    setInvoiceNumber(generateInvoiceNumber());
    setPatient({
      name: '',
      phone: '',
      age: '',
      gender: 'male',
      referringDoctor: '',
      branch: settings.branches[0] || 'الفرع الرئيسي',
      notes: '',
      sampleCollectionType: 'lab',
    });
    setSelectedItems([]);
    setAppliedPackage(undefined);
    setAppliedDailyOffer(null);
    setDiscountType('none');
    setDiscountValue(0);
    setContractName(undefined);
    setPaidAmount(0);
    showToast('جاهز لإدخال بيانات حالة جديدة');
  };

  // Financial calculations
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + (item.customPrice ?? item.test.price),
    0
  );
  const basePrice = appliedPackage ? appliedPackage.packagePrice : subtotal;

  let discountAmount = 0;
  if (discountType === 'percentage' || discountType === 'contract') {
    discountAmount = Math.round((basePrice * discountValue) / 100);
  } else if (discountType === 'fixed') {
    discountAmount = Math.min(basePrice, discountValue);
  }
  const netTotal = Math.max(0, basePrice - discountAmount);
  const remainingAmount = Math.max(0, netTotal - paidAmount);

  // Active invoice representation for modals
  const activeInvoice = useMemo<InvoiceRecord>(
    () => ({
      id: 'current-inv',
      invoiceNumber,
      date: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      patient: { ...patient },
      items: selectedItems.map((item) => ({
        testId: item.test.id,
        testNameAr: item.test.nameAr,
        testNameEn: item.test.nameEn,
        category: item.test.category,
        price: item.customPrice ?? item.test.price,
        sampleType: item.test.sampleType,
        fasting: item.test.fasting,
      })),
      appliedPackage,
      totalBeforeDiscount: basePrice,
      discountType,
      discountValue,
      discountAmount,
      contractName,
      netTotal,
      paidAmount,
      remainingAmount,
      status: 'draft',
      createdAt: Date.now(),
    }),
    [
      invoiceNumber,
      patient,
      selectedItems,
      appliedPackage,
      basePrice,
      discountType,
      discountValue,
      discountAmount,
      contractName,
      netTotal,
      paidAmount,
      remainingAmount,
    ]
  );

  // Save invoice record
  const handleSaveInvoiceRecord = (status: InvoiceRecord['status'] = 'draft') => {
    if (selectedItems.length === 0) {
      alert('يرجى اختيار التحاليل أولاً قبل الحفظ');
      return;
    }

    const record: InvoiceRecord = {
      ...activeInvoice,
      id: 'inv-' + Date.now(),
      status,
      createdAt: Date.now(),
    };

    const updatedInvoices = storageService.saveInvoice(record);
    setInvoices(updatedInvoices);
    showToast(`تم حفظ الفاتورة رقم ${invoiceNumber} في الأرشيف المحلي`);
  };

  const handleOpenHistoricalInvoice = (inv: InvoiceRecord) => {
    setInvoiceNumber(inv.invoiceNumber);
    setPatient({ ...inv.patient });

    const matchedTests: SelectedTestItem[] = inv.items.map((item) => {
      const found = tests.find((t) => t.id === item.testId);
      if (found) {
        return { test: found, customPrice: item.price };
      }
      const fallback: LabTest = {
        id: item.testId,
        code: 'PREV',
        nameAr: item.testNameAr,
        nameEn: item.testNameEn,
        category: (item.category as any) || 'custom',
        price: item.price,
        sampleType: item.sampleType,
        fasting: item.fasting,
        duration: 'تم الإنجاز',
      };
      return {
        test: fallback,
        customPrice: item.price,
      };
    });

    setSelectedItems(matchedTests);
    setAppliedPackage(inv.appliedPackage);
    setDiscountType(inv.discountType);
    setDiscountValue(inv.discountValue);
    setContractName(inv.contractName);
    setPaidAmount(inv.paidAmount);
    showToast(`تم فتح الفاتورة ${inv.invoiceNumber}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 py-2.5 rounded-2xl shadow-2xl shadow-red-950 flex items-center gap-2 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        settings={settings}
        packagesCount={packages.length}
        invoicesCount={invoices.length}
        dailyOffersCount={dailyOffers.length}
        isCompactMode={isCompactMode}
        onToggleCompactMode={handleToggleCompactMode}
        onOpenDailyOffers={() => setIsDailyOffersOpen(true)}
        onOpenPackages={() => setIsPackagesOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onOpenInvoices={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNewInvoice={handleNewInvoice}
      />

      {/* Daily Flash Offers Banner */}
      <DailyOffersBanner
        offers={dailyOffers}
        currency={settings.currency}
        onApplyOffer={handleApplyDailyOffer}
        onOpenManageModal={() => setIsDailyOffersOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-4">
        {/* Top Info: Patient Form & Fast Invoice Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <PatientForm
              patient={patient}
              branches={settings.branches}
              onChange={(partial) => setPatient((prev) => ({ ...prev, ...partial }))}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-br from-red-950/40 via-slate-900 to-blue-950/40 border border-red-500/30 shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>عروض وتخفيضات اليوم المباشرة</span>
                </span>
                <button
                  onClick={() => setIsDailyOffersOpen(true)}
                  className="text-[11px] text-amber-400 hover:text-white font-semibold cursor-pointer underline"
                >
                  تعديل العروض
                </button>
              </div>

              <div className="space-y-1.5">
                {dailyOffers.slice(0, 3).map((offer) => (
                  <button
                    key={offer.id}
                    onClick={() => handleApplyDailyOffer(offer)}
                    className="w-full p-2 rounded-xl bg-slate-950/70 hover:bg-red-950/50 border border-slate-800 hover:border-red-500/50 text-right transition flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div className="truncate flex-1">
                      <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded font-bold ml-1.5">
                        {offer.badgeText || 'عرض'}
                      </span>
                      <span className="text-slate-200 group-hover:text-white font-semibold">
                        {offer.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-bold font-mono mr-2 shrink-0">
                      تطبيق
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>الفهرس الطبي: <strong className="text-white font-mono">{tests.length}</strong> فحص</span>
              <span>الباقات: <strong className="text-white font-mono">{packages.length}</strong> باقة</span>
            </div>
          </div>
        </div>

        {/* Smart Bundle Detector Alert */}
        <BundleDetectorAlert
          packages={packages}
          selectedItems={selectedItems}
          currency={settings.currency}
          appliedPackage={appliedPackage}
          onApplyPackage={handleApplyPackage}
        />

        {/* Tests Selector & Pricing Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Tests Catalog Panel (Left / Main in RTL) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <TestSelector
              tests={tests}
              selectedItems={selectedItems}
              currency={settings.currency}
              isCompactMode={isCompactMode}
              onToggleTest={handleToggleTest}
              onEditTest={(test) => setActiveEditingTest(test)}
              onAddCustomTestPrompt={() => setIsCatalogOpen(true)}
            />
          </div>

          {/* Pricing Summary & Checkout Panel */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
            <PricingSummary
              selectedItems={selectedItems}
              currency={settings.currency}
              appliedPackage={appliedPackage}
              appliedDailyOffer={appliedDailyOffer}
              discountType={discountType}
              discountValue={discountValue}
              contractName={contractName}
              contracts={CONTRACT_DISCOUNTS}
              paidAmount={paidAmount}
              onRemoveItem={handleRemoveItem}
              onEditItem={(test) => setActiveEditingTest(test)}
              onClearAll={handleClearAll}
              onDetachPackage={handleDetachPackage}
              onRemoveDailyOffer={handleRemoveDailyOffer}
              onSetDiscountType={setDiscountType}
              onSetDiscountValue={setDiscountValue}
              onSetContract={(contract) => {
                if (contract) {
                  setDiscountType('contract');
                  setDiscountValue(contract.percentage);
                  setContractName(contract.name);
                } else {
                  setDiscountType('none');
                  setDiscountValue(0);
                  setContractName(undefined);
                }
              }}
              onSetPaidAmount={setPaidAmount}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              onPrint={() => setIsPrintOpen(true)}
              onSaveInvoice={() => handleSaveInvoiceRecord('draft')}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            {settings.labName} • {settings.doctorName} • {settings.doctorTitle}
          </p>
          <p className="font-mono text-slate-400">
            نظام متوافق مع PWA للعمل دون اتصال بالإنترنت (Offline First)
          </p>
        </div>
      </footer>

      {/* --- MODALS --- */}

      {/* Daily Offers Modal */}
      <DailyOffersModal
        isOpen={isDailyOffersOpen}
        onClose={() => setIsDailyOffersOpen(false)}
        offers={dailyOffers}
        packages={packages}
        currency={settings.currency}
        onUpdateOffer={handleSaveDailyOffer}
        onDeleteOffer={handleDeleteDailyOffer}
        onApplyOfferToQuotation={handleApplyDailyOffer}
      />

      {/* Packages / Offers Modal */}
      <PackagesOffersModal
        isOpen={isPackagesOpen}
        onClose={() => setIsPackagesOpen(false)}
        packages={packages}
        allTests={tests}
        currency={settings.currency}
        onApplyPackage={handleApplyPackage}
        onUpdatePackage={handleSavePackage}
        onDeletePackage={handleDeletePackage}
      />

      {/* Catalog Manager Modal */}
      <CatalogManagerModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        tests={tests}
        currency={settings.currency}
        onUpdateTest={handleSaveTest}
        onDeleteTest={handleDeleteTest}
        onResetDefaults={handleResetTests}
      />

      {/* Invoices Archive History Modal */}
      <InvoiceHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        invoices={invoices}
        settings={settings}
        onLoadInvoice={handleOpenHistoricalInvoice}
        onDeleteInvoice={(id) => {
          const updated = storageService.deleteInvoice(id);
          setInvoices(updated);
          showToast('تم حذف الفاتورة من الأرشيف');
        }}
      />

      {/* Lab Settings Modal */}
      <LabSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings: LabSettings) => {
          storageService.saveSettings(newSettings);
          setSettings(newSettings);
          showToast('تم حفظ إعدادات المعمل بنجاح');
        }}
      />

      {/* WhatsApp Preview & Send Modal */}
      <WhatsAppPreviewModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        invoice={activeInvoice}
        settings={settings}
        onUpdatePhone={(phone) => setPatient((prev) => ({ ...prev, phone }))}
        onMarkSent={() => handleSaveInvoiceRecord('sent_whatsapp')}
      />

      {/* Print View Modal */}
      <PrintQuotation
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        invoice={activeInvoice}
        settings={settings}
      />

      {/* Individual Test Edit Modal */}
      {activeEditingTest && (
        <EditTestModal
          isOpen={true}
          onClose={() => setActiveEditingTest(null)}
          test={activeEditingTest}
          currency={settings.currency}
          onSaveTest={handleSaveTest}
          onDeleteTest={handleDeleteTest}
        />
      )}

      {/* Individual Package Edit Modal */}
      {activeEditingPackage && (
        <EditPackageModal
          isOpen={true}
          onClose={() => setActiveEditingPackage(null)}
          pkg={activeEditingPackage}
          tests={tests}
          currency={settings.currency}
          onSavePackage={handleSavePackage}
          onDeletePackage={handleDeletePackage}
        />
      )}
    </div>
  );
}
