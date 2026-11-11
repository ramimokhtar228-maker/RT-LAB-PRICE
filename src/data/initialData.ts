import { LabTest, OfferPackage, DiscountContract, LabSettings, DailyOffer } from '../types/lab';
import { ALL_COMPREHENSIVE_TESTS } from './allTestsCatalogue';

export const INITIAL_SETTINGS: LabSettings = {
  labName: 'معامل RT للتحاليل التشخيصية',
  labSubtitle: 'دقة التشخيص .. رعاية متكاملة لأجل صحتك',
  doctorName: 'معامل د. رامي مختار',
  doctorTitle: 'استشاري التحاليل الطبية والباثولوجيا الإكلينيكية',
  hotline: '01099887766',
  whatsappNumber: '201099887766',
  address: 'الفرع الرئيسي: تقاطع شارع النصر مع اللاسلكي - المعادي',
  branches: [
    'الفرع الرئيسي - المعادي (شارع النصر)',
    'فرع التجمع الخامس (شارع التسعين الشمالي - CMC)',
    'فرع مصر الجديدة (شارع الميرغني - ميدان السبع عمارات)',
    'فرع مدينة نصر (شارع عباس العقاد)',
    'خدمة السحب المنزلي (متنقل لجميع المناطق)'
  ],
  homeVisitAvailable: true,
  currency: 'ج.م'
};

// All 520+ clinical tests from comprehensive catalogue
export const INITIAL_TESTS: LabTest[] = ALL_COMPREHENSIVE_TESTS;

export const INITIAL_DAILY_OFFERS: DailyOffer[] = [
  {
    id: 'do-flash-25',
    title: 'عرض اليوم الذهبي: خصم 25% على كافة الفحوصات',
    description: 'خصم فوري 25% يطبق تلقائياً على إجمالي الفاتورة لجميع المرضى اليوم بمناسبة العرض الخاص',
    discountPercentage: 25,
    isActive: true,
    badgeText: 'خصم 25% اليوم'
  },
  {
    id: 'do-comprehensive-850',
    title: 'عرض باقة الفحص الطبي الشامل VIP بـ 850 ج.م فقط',
    description: 'يشمل صورة الدم الكاملة ووظائف الكبد والكلى والسكر التراكمي والدهون الكاملة وفحص البول',
    specialPrice: 850,
    applicablePackageId: 'pkg-comprehensive-vip',
    isActive: true,
    badgeText: 'سعر خاص 850 ج.م'
  },
  {
    id: 'do-vitamins-30',
    title: 'عرض اليوم: خصم 30% على فيتامين د وب12 والحديد والمناعة',
    description: 'فحص فيتامين د3 وفيتامين ب12 والحديد ومخزون الحديد بخصم فوري 30%',
    discountPercentage: 30,
    applicableTestIds: ['t-234', 't-235', 't-238', 't-239'],
    isActive: true,
    badgeText: 'خصم 30% على الفيتامينات'
  },
  {
    id: 'do-thyroid-diabetes-20',
    title: 'عرض متابعة السكري والغدة الدرقية (خصم 20%)',
    description: 'يشمل السكر الصائم والسكر التراكمي وهرمون الغدة الدرقية TSH مع الدهون بخصم 20%',
    discountPercentage: 20,
    applicableTestIds: ['t-151', 't-154', 't-171', 't-121'],
    isActive: true,
    badgeText: 'خصم 20% سكر وغدة'
  },
  {
    id: 'do-athletes-gym-25',
    title: 'عرض الرياضيين والچيم: خصم 25% على باقة أبطال اللياقة',
    description: 'تحاليل الكرياتينين وإنزيمات الكبد والتستوستيرون واليوريك أسيد للأبطال الرياضيين',
    discountPercentage: 25,
    applicablePackageId: 'pkg-athletes-gym',
    isActive: true,
    badgeText: 'أبطال الچيم 25%'
  }
];

export const INITIAL_PACKAGES: OfferPackage[] = [
  {
    id: 'pkg-comprehensive-vip',
    nameAr: 'باقة الفحص الطبي الشامل VIP (اطمئنان متكامل)',
    nameEn: 'Comprehensive VIP Health Checkup',
    tagline: 'الفحص الدوري الأوسع نطاقاً لتقييم الصحة العامة ووظائف الأعضاء الحيوية',
    category: 'general',
    packagePrice: 850,
    originalPrice: 1650,
    badge: 'الأكثر طلباً - وفّر 800 ج.م',
    description: 'تشمل صورة دم كاملة، وظائف كبد وكلى، السكر التراكمي، دهون الدم الكاملة، حمض اليوريك، فحص بول وبراز، وفيتامين د3.',
    icon: 'ShieldCheck',
    includedItems: [
      { testId: 't-1', isRequired: true, isDefaultSelected: true },    // CBC
      { testId: 't-2', isRequired: true, isDefaultSelected: true },    // ESR
      { testId: 't-66', isRequired: true, isDefaultSelected: true },   // SGOT
      { testId: 't-67', isRequired: true, isDefaultSelected: true },   // SGPT
      { testId: 't-91', isRequired: true, isDefaultSelected: true },   // Creatinine
      { testId: 't-92', isRequired: true, isDefaultSelected: true },   // Urea
      { testId: 't-93', isRequired: true, isDefaultSelected: true },   // Uric Acid
      { testId: 't-121', isRequired: true, isDefaultSelected: true },  // Complete Lipid Profile
      { testId: 't-151', isRequired: true, isDefaultSelected: true },  // FBS
      { testId: 't-154', isRequired: true, isDefaultSelected: true },  // HbA1c
      { testId: 't-502', isRequired: true, isDefaultSelected: true },  // Urine Analysis
      { testId: 't-503', isRequired: true, isDefaultSelected: true },  // Stool Analysis
      { testId: 't-234', isRequired: false, isDefaultSelected: false } // Vitamin D3 (اختياري)
    ]
  },
  {
    id: 'pkg-liver-hepatitis',
    nameAr: 'باقة وظائف الكبد والفيروسات الكبدية الشاملة',
    nameEn: 'Complete Liver & Hepatitis Panel',
    tagline: 'فحص كفاءة أنسجة الكبد والصفراء والكشف عن فيروسات B و C',
    category: 'liver',
    packagePrice: 590,
    originalPrice: 1120,
    badge: 'وفّر 530 ج.م',
    description: 'فحص إنزيمات الكبد SGOT و SGPT، الصفراء الكلية والمباشرة، الزلال، البروتين الكلي، مع الأجسام المضادة لفيروس C وفيروس B.',
    icon: 'Activity',
    includedItems: [
      { testId: 't-66', isRequired: true, isDefaultSelected: true },   // SGOT
      { testId: 't-67', isRequired: true, isDefaultSelected: true },   // SGPT
      { testId: 't-68', isRequired: true, isDefaultSelected: true },   // Total Bilirubin
      { testId: 't-69', isRequired: true, isDefaultSelected: true },   // Direct Bilirubin
      { testId: 't-70', isRequired: true, isDefaultSelected: true },   // Albumin
      { testId: 't-71', isRequired: true, isDefaultSelected: true },   // Total Protein
      { testId: 't-72', isRequired: true, isDefaultSelected: true },   // Alkaline Phosphatase
      { testId: 't-336', isRequired: true, isDefaultSelected: true },  // HCV Ab
      { testId: 't-337', isRequired: true, isDefaultSelected: true }   // HBsAg
    ]
  },
  {
    id: 'pkg-kidney-gout',
    nameAr: 'باقة صحة الكلى والأملاح والنقرس والمسالك',
    nameEn: 'Renal Function, Uric Acid & Urinary Panel',
    tagline: 'اطمئنان دوري على ترشيح الكلى وضغط الدم وترسبات الحصوات',
    category: 'kidney',
    packagePrice: 420,
    originalPrice: 780,
    badge: 'وفّر 360 ج.م',
    description: 'تشمل كرياتينين الدم، بولينا، حمض اليوريك (النقرس)، تحليل البول الكامل، والأملاح والصوديوم والبوتاسيوم.',
    icon: 'Droplets',
    includedItems: [
      { testId: 't-91', isRequired: true, isDefaultSelected: true },   // Creatinine
      { testId: 't-92', isRequired: true, isDefaultSelected: true },   // Urea
      { testId: 't-93', isRequired: true, isDefaultSelected: true },   // Uric acid
      { testId: 't-95', isRequired: false, isDefaultSelected: false }, // Microalbuminuria
      { testId: 't-502', isRequired: true, isDefaultSelected: true },  // Urinalysis
      { testId: 't-101', isRequired: true, isDefaultSelected: true },  // Sodium
      { testId: 't-102', isRequired: true, isDefaultSelected: true }   // Potassium
    ]
  },
  {
    id: 'pkg-cardiac-lipids',
    nameAr: 'باقة صحة القلب والشرايين والدهون والكوليسترول',
    nameEn: 'Comprehensive Cardio-Lipid Profile',
    tagline: 'تقييم مخاطر تصلب الشرايين واحتشاء عضلة القلب ونسب الدهون الضارة والنافعة',
    category: 'cardiac',
    packagePrice: 620,
    originalPrice: 1190,
    badge: 'حماية القلب - وفّر 570 ج.م',
    description: 'الكوليسترول الكلي، الدهون الثلاثية، الكوليسترول الضار والنافع، hs-CRP، وإنزيمات القلب.',
    icon: 'Heart',
    includedItems: [
      { testId: 't-116', isRequired: true, isDefaultSelected: true },  // Total Cholesterol
      { testId: 't-117', isRequired: true, isDefaultSelected: true },  // Triglycerides
      { testId: 't-118', isRequired: true, isDefaultSelected: true },  // HDL
      { testId: 't-119', isRequired: true, isDefaultSelected: true },  // LDL
      { testId: 't-136', isRequired: true, isDefaultSelected: true },  // hs-Troponin I
      { testId: 't-138', isRequired: true, isDefaultSelected: true },  // CK-MB
      { testId: 't-151', isRequired: true, isDefaultSelected: true }   // FBS
    ]
  },
  {
    id: 'pkg-diabetic-annual',
    nameAr: 'باقة متابعة مريض السكري السنوية المتكاملة',
    nameEn: 'Annual Comprehensive Diabetes Care Panel',
    tagline: 'متابعة انتظام السكر، وقاية شبكية العين، الكلى، والأعصاب الطرفية',
    category: 'diabetes',
    packagePrice: 550,
    originalPrice: 980,
    badge: 'وفّر 430 ج.م',
    description: 'سكر صائم، سكر بعد الأكل بساعتين، سكر تراكمي HbA1c، زلال البول الدقيق، وظائف كلى، ودهون كاملة.',
    icon: 'Activity',
    includedItems: [
      { testId: 't-151', isRequired: true, isDefaultSelected: true },  // FBS
      { testId: 't-152', isRequired: true, isDefaultSelected: true },  // 2hr PP
      { testId: 't-154', isRequired: true, isDefaultSelected: true },  // HbA1c
      { testId: 't-95', isRequired: true, isDefaultSelected: true },   // Microalbuminuria ACR
      { testId: 't-91', isRequired: true, isDefaultSelected: true },   // Creatinine
      { testId: 't-121', isRequired: true, isDefaultSelected: true }   // Lipid Profile
    ]
  },
  {
    id: 'pkg-thyroid-metabolism',
    nameAr: 'باقة الغدة الدرقية والأيض ومعدل حرق الدهون',
    nameEn: 'Thyroid & Metabolic Full Panel',
    tagline: 'كشف الخمول أو النشاط الزائد للغدة، علاج ثبات الوزن وتساقط الشعر والشعور بالبرد',
    category: 'thyroid',
    packagePrice: 480,
    originalPrice: 860,
    badge: 'وفّر 380 ج.م',
    description: 'الهرمون المنشط TSH، الثيروكسين الحر Free T4، وثلاثي يود الثيرونين الحر Free T3 مع الأجسام المضادة Anti-TPO.',
    icon: 'Flame',
    includedItems: [
      { testId: 't-171', isRequired: true, isDefaultSelected: true },  // TSH
      { testId: 't-172', isRequired: true, isDefaultSelected: true },  // Free T4
      { testId: 't-174', isRequired: true, isDefaultSelected: true },  // Free T3
      { testId: 't-181', isRequired: false, isDefaultSelected: false } // Anti-TPO
    ]
  },
  {
    id: 'pkg-anemia-hairloss',
    nameAr: 'باقة تساقط الشعر والإرهاق والأنيميا والفيتامينات',
    nameEn: 'Hair Loss, Fatigue & Anemia Screen',
    tagline: 'العلاج الجذري لتساقط الشعر وشحوب الوجه ونقص الطاقة والتركيز',
    category: 'vitamins',
    packagePrice: 890,
    originalPrice: 1540,
    badge: 'العناية بالشعر - وفّر 650 ج.م',
    description: 'صورة دم كاملة، مخزون الحديد فيريتين، الحديد الكلي، فيتامين د3، فيتامين ب12، الزنك، والغدة الدرقية TSH.',
    icon: 'Sparkles',
    includedItems: [
      { testId: 't-1', isRequired: true, isDefaultSelected: true },    // CBC
      { testId: 't-238', isRequired: true, isDefaultSelected: true },  // Ferritin
      { testId: 't-239', isRequired: true, isDefaultSelected: true },  // Serum Iron & TIBC
      { testId: 't-234', isRequired: true, isDefaultSelected: true },  // Vitamin D3
      { testId: 't-235', isRequired: true, isDefaultSelected: true },  // Vitamin B12
      { testId: 't-245', isRequired: true, isDefaultSelected: true },  // Zinc
      { testId: 't-171', isRequired: true, isDefaultSelected: true }   // TSH
    ]
  },
  {
    id: 'pkg-men-40',
    nameAr: 'باقة صحة الرجل والبروستاتا والنشاط (فوق الأربعين)',
    nameEn: 'Men 40+ Vitality & Prostate Panel',
    tagline: 'اطمئنان دوري لصحة البروستاتا، هرمون الذكورة، والقلب والأعضاء الحيوية',
    category: 'men',
    packagePrice: 750,
    originalPrice: 1340,
    badge: 'وفّر 590 ج.م',
    description: 'تشمل دلالات أورام البروستاتا Total PSA و Free PSA، هرمون التستوستيرون، وظائف الكلى، الكبد، السكر، والدهون.',
    icon: 'UserCheck',
    includedItems: [
      { testId: 't-424', isRequired: true, isDefaultSelected: true },  // Total PSA
      { testId: 't-425', isRequired: true, isDefaultSelected: true },  // Free PSA
      { testId: 't-197', isRequired: true, isDefaultSelected: true },  // Total Testosterone
      { testId: 't-1', isRequired: true, isDefaultSelected: true },    // CBC
      { testId: 't-91', isRequired: true, isDefaultSelected: true },   // Creatinine
      { testId: 't-93', isRequired: true, isDefaultSelected: true },   // Uric acid
      { testId: 't-121', isRequired: true, isDefaultSelected: true },  // Lipid Profile
      { testId: 't-151', isRequired: true, isDefaultSelected: true }   // FBS
    ]
  },
  {
    id: 'pkg-women-hormones',
    nameAr: 'باقة صحة المرأة والهرمونات والخصوبة وتكيس المبايض',
    nameEn: 'Women Hormones, Fertility & PCOS Panel',
    tagline: 'تنظيم الدورة الشهرية، تشخيص تكيس المبايض، واستقرار هرمونات الأنوثة',
    category: 'women',
    packagePrice: 990,
    originalPrice: 1680,
    badge: 'وفّر 690 ج.م',
    description: 'فحص هرمونات الخصوبة FSH, LH، هرمون الحليب البرولاكتين، الإستراديول E2، التستوستيرون، والغدة الدرقية TSH.',
    icon: 'Smile',
    includedItems: [
      { testId: 't-189', isRequired: true, isDefaultSelected: true },  // FSH
      { testId: 't-190', isRequired: true, isDefaultSelected: true },  // LH
      { testId: 't-191', isRequired: true, isDefaultSelected: true },  // Prolactin
      { testId: 't-192', isRequired: true, isDefaultSelected: true },  // Estradiol E2
      { testId: 't-197', isRequired: true, isDefaultSelected: true },  // Testosterone Total
      { testId: 't-171', isRequired: true, isDefaultSelected: true },  // TSH
      { testId: 't-200', isRequired: false, isDefaultSelected: false } // AMH مخزون المبيض (اختياري)
    ]
  },
  {
    id: 'pkg-athletes-gym',
    nameAr: 'باقة الرياضيين واللياقة وبناء الأجسام (أبطال الچيم)',
    nameEn: 'Athletes & Gym Bodybuilding Matrix',
    tagline: 'متابعة تأثير المكملات والتمارين الرياضية المكثفة على الكبد والكلى والقلب وهرمون الذكورة',
    category: 'athletes',
    packagePrice: 790,
    originalPrice: 1390,
    badge: 'أبطال الچيم - وفّر 600 ج.م',
    description: 'فحص مخصص لرواد الصالات الرياضية لتقييم الكرياتينين، إنزيمات الكبد، هرمون الذكورة، إنزيم العضلات CPK، والدهون.',
    icon: 'Dumbbell',
    includedItems: [
      { testId: 't-1', isRequired: true, isDefaultSelected: true },    // CBC
      { testId: 't-91', isRequired: true, isDefaultSelected: true },   // Creatinine
      { testId: 't-67', isRequired: true, isDefaultSelected: true },   // SGPT
      { testId: 't-197', isRequired: true, isDefaultSelected: true },  // Testosterone Total
      { testId: 't-121', isRequired: true, isDefaultSelected: true },  // Lipid Profile
      { testId: 't-93', isRequired: true, isDefaultSelected: true },   // Uric acid
      { testId: 't-137', isRequired: true, isDefaultSelected: true },  // Total CPK
      { testId: 't-195', isRequired: false, isDefaultSelected: false } // Cortisol Morning
    ]
  },
  {
    id: 'pkg-premarital-safety',
    nameAr: 'باقة فحص ما قبل الزواج الوراثية والمعدية الشاملة',
    nameEn: 'Advanced Premarital Health & Genetics Screen',
    tagline: 'بداية آمنة لحياة أسرية وصحية مطمئنة لسلامة الأجيال القادمة',
    category: 'marriage',
    packagePrice: 850,
    originalPrice: 1480,
    badge: 'وفّر 630 ج.م',
    description: 'فحص فصائل الدم، صورة الدم وفحص الثلاسيميا والأنيميا الوراثية، الفيروسات الكبدية B و C، والإيدز، وسكر الدم.',
    icon: 'HeartHandshake',
    includedItems: [
      { testId: 't-1', isRequired: true, isDefaultSelected: true },    // CBC
      { testId: 't-3', isRequired: true, isDefaultSelected: true },    // ABO & Rh
      { testId: 't-9', isRequired: true, isDefaultSelected: true },    // Hemoglobin Electrophoresis
      { testId: 't-336', isRequired: true, isDefaultSelected: true },  // HCV Ab
      { testId: 't-337', isRequired: true, isDefaultSelected: true },  // HBsAg
      { testId: 't-338', isRequired: true, isDefaultSelected: true },  // HIV 1&2
      { testId: 't-151', isRequired: true, isDefaultSelected: true },  // FBS
      { testId: 't-515', isRequired: false, isDefaultSelected: false } // Semen Analysis
    ]
  },
  {
    id: 'pkg-pregnancy-prenatal',
    nameAr: 'باقة متابعة الحمل ورعاية الأم الحامل والجنين',
    nameEn: 'Prenatal & Pregnancy Care Panel',
    tagline: 'اطمئنان دوري على صحة الأم ونمو الجنين والوقاية من الميكروبات',
    category: 'pregnancy',
    packagePrice: 720,
    originalPrice: 1250,
    badge: 'صحة الأم والجنين',
    description: 'صورة دم كاملة، فصيلة الدم وعامل ريسس، تحليل بول كامل، ميكروب القطط Toxoplasma، الحصبة الألمانية Rubella، والسكر.',
    icon: 'Baby',
    includedItems: [
      { testId: 't-1', isRequired: true, isDefaultSelected: true },    // CBC
      { testId: 't-3', isRequired: true, isDefaultSelected: true },    // ABO & Rh
      { testId: 't-502', isRequired: true, isDefaultSelected: true },  // Urinalysis
      { testId: 't-151', isRequired: true, isDefaultSelected: true },  // FBS
      { testId: 't-340', isRequired: true, isDefaultSelected: true },  // Toxoplasma IgG
      { testId: 't-341', isRequired: true, isDefaultSelected: true },  // Toxoplasma IgM
      { testId: 't-342', isRequired: true, isDefaultSelected: true },  // Rubella IgG
      { testId: 't-171', isRequired: true, isDefaultSelected: true }   // TSH
    ]
  },
  {
    id: 'pkg-immunity-rheumatology',
    nameAr: 'باقة المناعة والروماتيزم والتهاب المفاصل',
    nameEn: 'Autoimmunity & Rheumatology Profile',
    tagline: 'التشخيص الدقيق لآلام المفاصل والتهابات الغضاريف والأمراض المناعية',
    category: 'immunity',
    packagePrice: 890,
    originalPrice: 1560,
    badge: 'وفّر 670 ج.م',
    description: 'سرعة الترسيب ESR، بروتين C التفاعلي CRP، عامل الروماتويد RF، الأجسام المضادة للنواة ANA، و Anti-CCP.',
    icon: 'Shield',
    includedItems: [
      { testId: 't-2', isRequired: true, isDefaultSelected: true },    // ESR
      { testId: 't-286', isRequired: true, isDefaultSelected: true },  // CRP Quantitative
      { testId: 't-287', isRequired: true, isDefaultSelected: true },  // Rheumatoid Factor RF
      { testId: 't-288', isRequired: true, isDefaultSelected: true },  // Anti-CCP
      { testId: 't-289', isRequired: true, isDefaultSelected: true },  // ANA IFA
      { testId: 't-93', isRequired: true, isDefaultSelected: true }    // Uric Acid
    ]
  },
  {
    id: 'pkg-gastro-stomach',
    nameAr: 'باقة الجهاز الهضمي والمعدة وجرثومة المعدة الحلزونية',
    nameEn: 'Gastrointestinal & H. Pylori Complete Panel',
    tagline: 'علاج الحموضة وعسر الهضم والانتفاخات والتهابات جدار المعدة والقولون',
    category: 'stomach',
    packagePrice: 490,
    originalPrice: 890,
    badge: 'وفّر 400 ج.م',
    description: 'تحليل أنتيجين جرثومة المعدة في البراز H. Pylori Stool Ag، تحليل براز كامل، فحص الدم الخفي FOBT، وإنزيمات الكبد.',
    icon: 'Stethoscope',
    includedItems: [
      { testId: 't-503', isRequired: true, isDefaultSelected: true },  // Stool Complete
      { testId: 't-504', isRequired: true, isDefaultSelected: true },  // Occult Blood in Stool
      { testId: 't-348', isRequired: true, isDefaultSelected: true },  // H. Pylori Stool Antigen
      { testId: 't-66', isRequired: true, isDefaultSelected: true },   // SGOT
      { testId: 't-67', isRequired: true, isDefaultSelected: true }    // SGPT
    ]
  },
  {
    id: 'pkg-bone-vitamins',
    nameAr: 'باقة صحة العظام وفيتامين د والكالسيوم والهشاشة',
    nameEn: 'Bone Density & Calcium Metabolism Panel',
    tagline: 'الوقاية من هشاشة العظام، آلام الظهر والمفاصل، ونقص امتصاص المعادن',
    category: 'bones',
    packagePrice: 650,
    originalPrice: 1140,
    badge: 'وفّر 490 ج.م',
    description: 'فيتامين د3، الكالسيوم الكلي والحر، الفوسفور، إنزيم الفوسفاتاز القلوي، والمغنيسيوم وهرمون الغدة الجار درقية PTH.',
    icon: 'Activity',
    includedItems: [
      { testId: 't-234', isRequired: true, isDefaultSelected: true },  // Vitamin D3
      { testId: 't-241', isRequired: true, isDefaultSelected: true },  // Total Calcium
      { testId: 't-242', isRequired: true, isDefaultSelected: true },  // Ionized Calcium
      { testId: 't-243', isRequired: true, isDefaultSelected: true },  // Phosphorus
      { testId: 't-72', isRequired: true, isDefaultSelected: true },   // Alkaline Phosphatase
      { testId: 't-244', isRequired: true, isDefaultSelected: true },  // Magnesium
      { testId: 't-185', isRequired: false, isDefaultSelected: false } // PTH (اختياري)
    ]
  },
  {
    id: 'pkg-pediatric-growth',
    nameAr: 'باقة صحة ونمو الأطفال والديدان والأنيميا',
    nameEn: 'Pediatric Growth & Wellness Panel',
    tagline: 'اطمئنان دوري على نمو الطفل وتركيزه والقضاء على سوء التغذية والديدان',
    category: 'pediatric',
    packagePrice: 380,
    originalPrice: 690,
    badge: 'صحة أطفالنا',
    description: 'صورة دم كاملة للأطفال، فحص بول كامل، فحص براز كامل، اختبار شريط الديدان الدبوسية، وفحص الحديد ومخزونه.',
    icon: 'Smile',
    includedItems: [
      { testId: 't-1', isRequired: true, isDefaultSelected: true },    // CBC
      { testId: 't-502', isRequired: true, isDefaultSelected: true },  // Urinalysis
      { testId: 't-503', isRequired: true, isDefaultSelected: true },  // Stool Examination
      { testId: 't-514', isRequired: true, isDefaultSelected: true },  // Scotch Tape Pinworm
      { testId: 't-238', isRequired: true, isDefaultSelected: true }   // Ferritin
    ]
  },
  {
    id: 'pkg-tumor-markers-early',
    nameAr: 'باقة الفحص المبكر لدلالات الأورام (كشف وقائي)',
    nameEn: 'Early Cancer Tumor Markers Screen',
    tagline: 'اطمئنان وقائي مبكر لسرطان القولون، الكبد، البنكرياس، والبروستاتا / الثدي',
    category: 'tumors',
    packagePrice: 1100,
    originalPrice: 1950,
    badge: 'فحص وقائي - وفّر 850 ج.م',
    description: 'تشمل CEA (القولون)، AFP (الكبد)، CA 19-9 (البنكرياس)، و PSA (للرجال) أو CA 15-3 (للسيدات)، مع فحص الدم الخفي.',
    icon: 'ShieldAlert',
    includedItems: [
      { testId: 't-421', isRequired: true, isDefaultSelected: true },  // CEA
      { testId: 't-422', isRequired: true, isDefaultSelected: true },  // AFP
      { testId: 't-423', isRequired: true, isDefaultSelected: true },  // CA 19-9
      { testId: 't-424', isRequired: true, isDefaultSelected: true },  // Total PSA
      { testId: 't-504', isRequired: true, isDefaultSelected: true }   // FOBT Occult Blood
    ]
  },
  {
    id: 'pkg-fever-infection',
    nameAr: 'باقة تشخيص الحمى والحرارة والعدوى الحادة',
    nameEn: 'Acute Fever & Infection Screen',
    tagline: 'التشخيص السريع لسبب السخونة وارتفاع درجات الحرارة والأمراض المعدية',
    category: 'fever',
    packagePrice: 490,
    originalPrice: 940,
    badge: 'طوارئ الحمى - وفّر 450 ج.م',
    description: 'صورة دم كاملة، سرعة الترسيب، بروتين الالتهاب CRP، فحص التيفود Widal، فحص البول الكامل، ومزرعة البول وحساسية المضادات.',
    icon: 'Thermometer',
    includedItems: [
      { testId: 't-1', isRequired: true, isDefaultSelected: true },    // CBC
      { testId: 't-2', isRequired: true, isDefaultSelected: true },    // ESR
      { testId: 't-286', isRequired: true, isDefaultSelected: true },  // CRP
      { testId: 't-343', isRequired: true, isDefaultSelected: true },  // Widal Test
      { testId: 't-502', isRequired: true, isDefaultSelected: true },  // Urinalysis
      { testId: 't-477', isRequired: false, isDefaultSelected: false } // Urine Culture
    ]
  }
];

export const CONTRACT_DISCOUNTS: DiscountContract[] = [
  { id: 'c-doctors', name: 'نقابة الأطباء البشريين', percentage: 30, type: 'syndicate' },
  { id: 'c-pharmacists', name: 'نقابة الصيادلة', percentage: 25, type: 'syndicate' },
  { id: 'c-engineers', name: 'نقابة المهندسين', percentage: 25, type: 'syndicate' },
  { id: 'c-teachers', name: 'نقابة المعلمين', percentage: 20, type: 'syndicate' },
  { id: 'c-lawyers', name: 'نقابة المحامين', percentage: 20, type: 'syndicate' },
  { id: 'c-takafol', name: 'بطاقة تكافل ورعاية طبية', percentage: 25, type: 'insurance' },
  { id: 'c-seniors', name: 'كبار السن وذوي الهمم (رعاية خاصة)', percentage: 35, type: 'special' },
  { id: 'c-opening', name: 'عرض افتتاح الفرع الجديد (20% خصم فوري)', percentage: 20, type: 'campaign' },
  { id: 'c-referral', name: 'كوبون خصم الإحالة والعيادات المتعاقدة', percentage: 15, type: 'special' }
];
