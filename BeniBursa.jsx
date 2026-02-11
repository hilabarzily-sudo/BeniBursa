const { useState, useEffect } = React;

// ============================================================
// DATA - STOCKS
// ============================================================

const stocksData = [
  { 
    id: 1, name: 'אפל', symbol: 'AAPL', score: 85, risk: 'low', price: 178.52, change: 1.2,
    exchange: 'NASDAQ', type: 'stock',
    history: [165, 168, 172, 169, 175, 178, 176, 180, 177, 178.52],
    reason: 'החברה מרוויחה הרבה כסף ואנשים אוהבים את המוצרים שלה',
    good: ['רווחים יציבים', 'מותג חזק', 'מוצרים פופולריים'],
    bad: ['תחרות מסין', 'מחירים גבוהים']
  },
  { 
    id: 2, name: 'טסלה', symbol: 'TSLA', score: 55, risk: 'high', price: 245.30, change: -2.8,
    exchange: 'NASDAQ', type: 'stock',
    history: [220, 260, 240, 280, 250, 230, 270, 255, 240, 245.30],
    reason: 'המחיר קופץ הרבה למעלה ולמטה, קשה לדעת מה יקרה',
    good: ['טכנולוגיה מתקדמת', 'מנהיג בשוק'],
    bad: ['תנודתיות גבוהה', 'תחרות גוברת']
  },
  { 
    id: 3, name: 'מיקרוסופט', symbol: 'MSFT', score: 88, risk: 'low', price: 378.91, change: 0.8,
    exchange: 'NASDAQ', type: 'stock',
    history: [350, 355, 360, 358, 365, 370, 368, 375, 377, 378.91],
    reason: 'החברה גדלה בקצב יציב והרבה עסקים משתמשים במוצרים שלה',
    good: ['צמיחה יציבה', 'מובילה בענן', 'AI חזק'],
    bad: ['מחיר גבוה כבר']
  },
  { 
    id: 4, name: 'אמזון', symbol: 'AMZN', score: 78, risk: 'medium', price: 178.25, change: 1.5,
    exchange: 'NASDAQ', type: 'stock',
    history: [160, 165, 162, 170, 168, 175, 172, 176, 177, 178.25],
    reason: 'אנשים קונים הרבה באינטרנט והחברה ממשיכה לגדול',
    good: ['שליטה במסחר', 'AWS חזק'],
    bad: ['רווחים נמוכים', 'תחרות']
  },
  { 
    id: 5, name: 'גוגל', symbol: 'GOOGL', score: 82, risk: 'low', price: 141.80, change: 0.5,
    exchange: 'NASDAQ', type: 'stock',
    history: [130, 132, 135, 134, 138, 137, 140, 139, 141, 141.80],
    reason: 'כמעט כולם משתמשים בגוגל והחברה מרוויחה טוב',
    good: ['שליטה בחיפוש', 'יוטיוב', 'ענן'],
    bad: ['תלות בפרסום']
  },
  { 
    id: 6, name: 'נבידיה', symbol: 'NVDA', score: 80, risk: 'medium', price: 495.00, change: 2.1,
    exchange: 'NASDAQ', type: 'stock',
    history: [420, 440, 460, 450, 480, 470, 490, 485, 500, 495.00],
    reason: 'מובילה בשבבים לבינה מלאכותית, ביקוש גבוה מאוד',
    good: ['מובילה ב-AI', 'צמיחה מהירה'],
    bad: ['מחיר גבוה', 'תחרות צפויה']
  },
];

// ============================================================
// DATA - CRYPTO
// ============================================================

const cryptoData = [
  { 
    id: 101, name: 'ביטקוין', symbol: 'BTC', score: 70, risk: 'high', price: 43250, change: 2.5,
    exchange: 'Crypto', type: 'crypto',
    history: [38000, 40000, 42000, 41000, 44000, 43000, 45000, 42500, 43500, 43250],
    reason: 'המטבע הדיגיטלי הראשון והכי מוכר בעולם, אבל מאוד תנודתי',
    good: ['הכי מוכר', 'מוגבל בכמות', 'מקובל בהרבה מקומות'],
    bad: ['תנודתיות קיצונית', 'לא מגובה בכלום', 'רגולציה לא ברורה']
  },
  { 
    id: 102, name: 'את\'ריום', symbol: 'ETH', score: 65, risk: 'high', price: 2280, change: 1.8,
    exchange: 'Crypto', type: 'crypto',
    history: [2000, 2100, 2200, 2150, 2300, 2250, 2350, 2200, 2300, 2280],
    reason: 'פלטפורמה לבניית אפליקציות, אבל התחרות גוברת',
    good: ['טכנולוגיה חכמה', 'הרבה שימושים', 'קהילה חזקה'],
    bad: ['עמלות גבוהות', 'תחרות', 'מסובך להבנה']
  },
  { 
    id: 103, name: 'סולנה', symbol: 'SOL', score: 50, risk: 'high', price: 98.50, change: -3.2,
    exchange: 'Crypto', type: 'crypto',
    history: [80, 90, 100, 95, 110, 105, 100, 95, 100, 98.50],
    reason: 'מהיר וזול אבל היו בעיות טכניות בעבר',
    good: ['מהיר מאוד', 'עמלות זולות'],
    bad: ['בעיות יציבות', 'פחות מבוזר', 'סיכון גבוה']
  },
  { 
    id: 104, name: 'קרדאנו', symbol: 'ADA', score: 45, risk: 'high', price: 0.58, change: -1.5,
    exchange: 'Crypto', type: 'crypto',
    history: [0.50, 0.55, 0.60, 0.58, 0.62, 0.55, 0.58, 0.56, 0.59, 0.58],
    reason: 'פיתוח איטי והרבה הבטחות שעוד לא התממשו',
    good: ['גישה מדעית', 'צוות חזק'],
    bad: ['פיתוח איטי', 'פחות שימושים', 'תחרות חזקה']
  },
];

// ============================================================
// DATA - EXCHANGES
// ============================================================

const exchangesData = [
  {
    id: 'nasdaq', name: 'נאסד"ק', nameEn: 'NASDAQ', country: '🇺🇸', score: 90,
    icon: '💻', color: '#3b82f6', type: 'stock',
    description: 'הבורסה של חברות הטכנולוגיה הגדולות',
    forWho: 'למי שרוצה טכנולוגיה',
    companies: ['אפל', 'מיקרוסופט', 'גוגל', 'אמזון'],
    pros: ['חברות מובילות', 'צמיחה'], cons: ['תנודתיות', 'צריך דולרים'],
    minInvest: '$100', hours: '16:30-23:00'
  },
  {
    id: 'nyse', name: 'וול סטריט', nameEn: 'NYSE', country: '🇺🇸', score: 88,
    icon: '🏛️', color: '#1e3a8a', type: 'stock',
    description: 'הבורסה הכי גדולה בעולם',
    forWho: 'למי שרוצה יציבות',
    companies: ['קוקה קולה', 'דיסני', 'ויזה'],
    pros: ['יציבות', 'דיבידנדים'], cons: ['צמיחה איטית'],
    minInvest: '$100', hours: '16:30-23:00'
  },
  {
    id: 'tase', name: 'בורסת ת"א', nameEn: 'TASE', country: '🇮🇱', score: 75,
    icon: '🇮🇱', color: '#10b981', type: 'stock',
    description: 'הבורסה הישראלית - קל להתחיל',
    forWho: 'למתחילים, בשקלים',
    companies: ['בנק לאומי', 'טבע', 'אלביט'],
    pros: ['בשקלים', 'קל להתחיל'], cons: ['פחות חברות'],
    minInvest: '₪100', hours: '09:45-17:25'
  },
  {
    id: 'binance', name: 'ביננס', nameEn: 'Binance', country: '🌐', score: 65,
    icon: '🪙', color: '#f59e0b', type: 'crypto',
    description: 'הבורסה הכי גדולה לקריפטו',
    forWho: 'למי שרוצה קריפטו',
    companies: ['ביטקוין', 'את\'ריום', 'מאות מטבעות'],
    pros: ['הרבה מטבעות', 'נזילות גבוהה'], cons: ['מסוכן', 'רגולציה'],
    minInvest: '$10', hours: '24/7'
  },
  {
    id: 'coinbase', name: 'קוינבייס', nameEn: 'Coinbase', country: '🇺🇸', score: 60,
    icon: '💰', color: '#8b5cf6', type: 'crypto',
    description: 'בורסת קריפטו אמריקאית מפוקחת',
    forWho: 'למתחילים בקריפטו',
    companies: ['ביטקוין', 'את\'ריום', 'מטבעות נבחרים'],
    pros: ['קל לשימוש', 'מפוקח'], cons: ['עמלות גבוהות', 'פחות מטבעות'],
    minInvest: '$1', hours: '24/7'
  },
];

// ============================================================
// DATA - LESSONS
// ============================================================

const lessonsData = [
  {
    id: 'what-is-money', icon: '💵', title: 'מה זה כסף?', subtitle: 'ההתחלה של הכל',
    content: [
      { q: 'מה זה בעצם כסף?', a: 'כסף זה דרך להחליף דברים. פעם החליפו תרנגולות בלחם. היום יש לנו שטרות ומטבעות.' },
      { q: 'למה צריך כסף?', a: 'כסף עוזר לקנות אוכל, בגדים וצעצועים. בלי כסף היינו צריכים להחליף דברים ישירות.' },
      { q: 'מאיפה מגיע כסף?', a: 'הממשלה מדפיסה כסף, אבל רוב הכסף שלנו מגיע מעבודה.' }
    ]
  },
  {
    id: 'what-is-stock', icon: '📈', title: 'מה זה מניה?', subtitle: 'חלק מחברה',
    content: [
      { q: 'מה זה מניה?', a: 'מניה זה כמו חתיכה קטנה מחברה. אם קונים מניה של אפל, אתה בעלים של חלק קטנטן מאפל!' },
      { q: 'איך מרוויחים ממניות?', a: 'אם החברה מצליחה, המניה עולה במחיר. מוכרים ביותר ממה שקנית = רווח!' },
      { q: 'מה הסיכון?', a: 'אם החברה לא מצליחה, המניה יורדת. אפשר להפסיד כסף.' }
    ]
  },
  {
    id: 'what-is-crypto', icon: '🪙', title: 'מה זה קריפטו?', subtitle: 'כסף דיגיטלי',
    content: [
      { q: 'מה זה קריפטו?', a: 'קריפטו זה כסף שקיים רק במחשב, בלי בנק או ממשלה מאחוריו. הכי מפורסם הוא ביטקוין.' },
      { q: 'איך זה עובד?', a: 'במקום בנק, מחשבים ברחבי העולם עוקבים אחרי מי שולח כסף למי. זה נקרא בלוקצ\'יין.' },
      { q: 'למה אנשים קונים?', a: 'יש שחושבים שזה העתיד של הכסף. אחרים רוצים להרוויח מעליית המחיר.' }
    ]
  },
  {
    id: 'stock-vs-crypto', icon: '⚖️', title: 'מניות VS קריפטו', subtitle: 'מה ההבדל?',
    content: [
      { q: 'מה עומד מאחורי?', a: 'מניה = חברה אמיתית עם עובדים ומוצרים.\nקריפטו = רק קוד מחשב ואמונה של אנשים.' },
      { q: 'מי שולט?', a: 'מניות = יש רגולציה וחוקים.\nקריפטו = כמעט בלי פיקוח, "פרא מערב".' },
      { q: 'כמה מסוכן?', a: 'מניות = יכולות לרדת 20-50% בשנה רעה.\nקריפטו = יכול לרדת 80% בחודש!' },
    ]
  },
  {
    id: 'risk', icon: '⚠️', title: 'מה זה סיכון?', subtitle: 'חשוב להבין',
    content: [
      { q: 'מה זה סיכון?', a: 'סיכון = הסיכוי להפסיד כסף. ככל שהסיכון גבוה, אפשר להרוויח יותר אבל גם להפסיד יותר.' },
      { q: 'איך מפחיתים סיכון?', a: 'פיזור! לא לשים את כל הכסף במקום אחד. קצת במניות, קצת בבנק, אולי קצת בקריפטו.' },
      { q: 'מה עדיף?', a: 'תלוי בך! צעירים יכולים לקחת יותר סיכון. מי שצריך את הכסף בקרוב - עדיף בטוח.' }
    ]
  },
  {
    id: 'tips', icon: '💡', title: 'טיפים חשובים', subtitle: 'כללי זהב',
    content: [
      { q: 'התחל בקטן', a: 'לא צריך הרבה כסף. אפשר להתחיל עם 100 ש"ח! העיקר ללמוד.' },
      { q: 'אל תשקיע כסף שאתה צריך', a: 'רק כסף שאתה לא צריך בקרוב. אם יורד - לא נורא.' },
      { q: 'תהיה סבלני', a: 'השקעות טובות לוקחות זמן. אל תצפה להתעשר מחר.' },
    ]
  }
];

// ============================================================
// HELPERS
// ============================================================

const getScoreInfo = (score) => {
  if (score >= 75) return { label: 'מומלץ', emoji: '👍', color: '#10b981' };
  if (score >= 50) return { label: 'אפשרי', emoji: '🤔', color: '#f59e0b' };
  return { label: 'לא מומלץ', emoji: '👎', color: '#ef4444' };
};

const formatPrice = (price, type) => {
  if (type === 'crypto' && price < 1) return `$${price.toFixed(2)}`;
  if (price >= 1000) return `$${(price/1000).toFixed(1)}K`;
  return `$${price.toLocaleString()}`;
};

// ============================================================
// RESPONSIVE HOOK
// ============================================================

const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
};

// ============================================================
// COMPONENTS
// ============================================================

const Sparkline = ({ data, color, height = 40, width = 100 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 8) - 4}`).join(' ');

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id={`g-${color.replace('#','')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill={`url(#g-${color.replace('#','')})`} points={`0,${height} ${points} ${width},${height}`} />
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
};

const AnimatedScore = ({ score, size = 100 }) => {
  const [display, setDisplay] = useState(0);
  const info = getScoreInfo(score);
  
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 3;
      if (current >= score) { setDisplay(score); clearInterval(interval); }
      else setDisplay(Math.round(current));
    }, 20);
    return () => clearInterval(interval);
  }, [score]);

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (display / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={40} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="8" />
        <circle cx={size/2} cy={size/2} r={40} fill="none" stroke={info.color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.1s' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.3, fontWeight: '700', color: '#1e3a8a' }}>{display}</span>
      </div>
    </div>
  );
};

// ============================================================
// ONBOARDING
// ============================================================

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [fade, setFade] = useState(true);

  const steps = [
    { emoji: '👋', title: 'שלום!', sub: 'בוא נלמד על השקעות' },
    { emoji: '📊', title: 'מניות', sub: 'קונים חלק מחברה אמיתית' },
    { emoji: '🪙', title: 'קריפטו', sub: 'מטבעות דיגיטליים' },
    { emoji: '🚀', title: 'מוכן?', sub: 'בוא נתחיל!' },
  ];

  const next = () => {
    setFade(false);
    setTimeout(() => {
      if (step < steps.length - 1) { setStep(step + 1); setFade(true); }
      else onComplete();
    }, 150);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #1e3a8a 0%, #3b82f6 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px', zIndex: 1000
    }}>
      <button onClick={onComplete} style={{
        position: 'absolute', top: '24px', left: '24px', background: 'rgba(255,255,255,0.15)',
        border: 'none', borderRadius: '20px', padding: '10px 20px', color: 'rgba(255,255,255,0.9)',
        fontSize: '14px', cursor: 'pointer', backdropFilter: 'blur(10px)'
      }}>דלג</button>

      <div style={{ opacity: fade ? 1 : 0, transform: fade ? 'translateY(0)' : 'translateY(10px)', transition: 'all 0.2s', textAlign: 'center' }}>
        <div style={{ fontSize: '100px', marginBottom: '24px' }}>{steps[step].emoji}</div>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>{steps[step].title}</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '20px', marginBottom: '48px' }}>{steps[step].sub}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: i === step ? '32px' : '10px', height: '10px', borderRadius: '5px',
            background: i === step ? 'white' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s'
          }} />
        ))}
      </div>

      <button onClick={next} style={{
        background: 'white', border: 'none', borderRadius: '20px', padding: '18px 56px',
        color: '#1e3a8a', fontSize: '18px', fontWeight: '600', cursor: 'pointer',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)', transition: 'transform 0.2s'
      }}
      onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
      >{step === steps.length - 1 ? 'התחל!' : 'המשך'}</button>
    </div>
  );
};

// ============================================================
// FLOATING TAB BAR
// ============================================================

const FloatingTabBar = ({ active, onChange, isDesktop }) => {
  const tabs = [
    { id: 'stocks', icon: '📊', label: 'מניות' },
    { id: 'crypto', icon: '🪙', label: 'קריפטו' },
    { id: 'compare', icon: '⚖️', label: 'השוואה' },
    { id: 'exchanges', icon: '🏛️', label: 'בורסות' },
    { id: 'learn', icon: '📚', label: 'למד' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: isDesktop ? '24px' : '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '28px',
      boxShadow: '0 8px 32px rgba(30, 58, 138, 0.15), 0 0 0 1px rgba(255,255,255,0.8)',
      display: 'flex',
      padding: isDesktop ? '8px 12px' : '6px 8px',
      gap: isDesktop ? '8px' : '4px',
      zIndex: 100
    }}>
      {tabs.map(tab => (
        <button 
          key={tab.id} 
          onClick={() => onChange(tab.id)} 
          style={{
            background: active === tab.id 
              ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' 
              : 'transparent',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: isDesktop ? 'row' : 'column',
            alignItems: 'center',
            gap: isDesktop ? '8px' : '2px',
            padding: isDesktop ? '12px 20px' : '10px 14px',
            transition: 'all 0.2s ease',
            minWidth: isDesktop ? 'auto' : '56px'
          }}
          onMouseEnter={e => { if (active !== tab.id) e.target.style.background = 'rgba(59,130,246,0.1)' }}
          onMouseLeave={e => { if (active !== tab.id) e.target.style.background = 'transparent' }}
        >
          <span style={{ 
            fontSize: isDesktop ? '20px' : '22px', 
            filter: active === tab.id ? 'none' : 'grayscale(0.4)',
            transition: 'filter 0.2s'
          }}>{tab.icon}</span>
          <span style={{ 
            fontSize: isDesktop ? '14px' : '10px', 
            fontWeight: active === tab.id ? '600' : '500', 
            color: active === tab.id ? 'white' : '#64748b'
          }}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

// ============================================================
// HEADER
// ============================================================

const Header = ({ title, showBack, onBack, isDesktop }) => (
  <header style={{
    padding: isDesktop ? '20px 32px' : '14px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(20px)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    borderBottom: '1px solid rgba(0,0,0,0.04)'
  }}>
    {showBack && (
      <button onClick={onBack} style={{
        position: 'absolute', right: isDesktop ? '32px' : '16px',
        background: 'rgba(59,130,246,0.1)', border: 'none', borderRadius: '12px',
        padding: '8px 16px', fontSize: '14px', color: '#3b82f6', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500'
      }}>
        <span>←</span> חזרה
      </button>
    )}
    <h1 style={{ fontSize: isDesktop ? '20px' : '17px', fontWeight: '600', color: '#1e3a8a', margin: 0 }}>{title}</h1>
  </header>
);

// ============================================================
// ASSET CARD
// ============================================================

const AssetCard = ({ asset, index, onClick, isDesktop }) => {
  const info = getScoreInfo(asset.score);
  const isUp = asset.change >= 0;
  const isCrypto = asset.type === 'crypto';

  return (
    <div onClick={onClick} style={{
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: isDesktop ? '20px' : '16px',
      cursor: 'pointer',
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      transition: 'all 0.25s ease'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(59,130,246,0.12)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? '16px' : '12px' }}>
        <div style={{
          width: isDesktop ? '36px' : '28px', 
          height: isDesktop ? '36px' : '28px', 
          borderRadius: '10px',
          background: index < 3 
            ? (isCrypto ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'linear-gradient(135deg, #1e3a8a, #3b82f6)') 
            : 'rgba(0,0,0,0.05)',
          color: index < 3 ? 'white' : '#64748b',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: isDesktop ? '14px' : '12px', fontWeight: '700'
        }}>{index + 1}</div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: isDesktop ? '17px' : '15px', fontWeight: '600', color: '#1e3a8a' }}>{asset.name}</span>
            <span style={{ fontSize: isDesktop ? '18px' : '16px' }}>{info.emoji}</span>
            <span style={{
              fontSize: '10px', padding: '3px 8px', borderRadius: '6px',
              background: isCrypto ? 'rgba(245,158,11,0.12)' : 'rgba(59,130,246,0.1)',
              color: isCrypto ? '#d97706' : '#3b82f6', fontWeight: '500'
            }}>{isCrypto ? '🪙 קריפטו' : '📊 מניה'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: isDesktop ? '14px' : '12px', color: '#64748b' }}>
            <span style={{ fontWeight: '500' }}>{formatPrice(asset.price, asset.type)}</span>
            <span style={{ color: isUp ? '#10b981' : '#ef4444', fontWeight: '600' }}>
              {isUp ? '↑' : '↓'} {Math.abs(asset.change)}%
            </span>
          </div>
        </div>

        <Sparkline data={asset.history} color={isUp ? '#10b981' : '#ef4444'} width={isDesktop ? 80 : 60} height={isDesktop ? 36 : 28} />

        <div style={{
          width: isDesktop ? '52px' : '42px', 
          height: isDesktop ? '52px' : '42px', 
          borderRadius: '50%',
          background: `${info.color}15`, 
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: isDesktop ? '18px' : '15px', fontWeight: '700', color: info.color }}>{asset.score}</span>
        </div>

        <span style={{ color: '#cbd5e1', fontSize: '16px' }}>←</span>
      </div>
    </div>
  );
};

// ============================================================
// STOCKS SCREEN
// ============================================================

const StocksScreen = ({ onSelect, isDesktop }) => {
  const sorted = [...stocksData].sort((a, b) => b.score - a.score);

  return (
    <div style={{ 
      padding: isDesktop ? '32px 48px' : '20px', 
      paddingBottom: '120px',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: isDesktop ? '32px' : '24px' }}>
        <h2 style={{ fontSize: isDesktop ? '32px' : '22px', color: '#1e3a8a', fontWeight: '700', marginBottom: '8px' }}>
          📊 מניות
        </h2>
        <p style={{ color: '#64748b', fontSize: isDesktop ? '16px' : '14px' }}>חלק מחברות אמיתיות</p>
      </div>

      <div style={{
        background: 'rgba(59,130,246,0.08)', borderRadius: '16px', padding: isDesktop ? '16px 24px' : '14px',
        marginBottom: isDesktop ? '28px' : '20px', fontSize: isDesktop ? '15px' : '13px', color: '#3b82f6', textAlign: 'center'
      }}>
        💡 מניה = קונים חלק קטן מחברה. אם החברה מצליחה - מרוויחים!
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isDesktop ? '12px' : '10px' 
      }}>
        {sorted.map((asset, i) => (
          <AssetCard key={asset.id} asset={asset} index={i} onClick={() => onSelect(asset)} isDesktop={isDesktop} />
        ))}
      </div>
    </div>
  );
};

// ============================================================
// CRYPTO SCREEN
// ============================================================

const CryptoScreen = ({ onSelect, isDesktop }) => {
  const sorted = [...cryptoData].sort((a, b) => b.score - a.score);

  return (
    <div style={{ 
      padding: isDesktop ? '32px 48px' : '20px', 
      paddingBottom: '120px',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: isDesktop ? '32px' : '24px' }}>
        <h2 style={{ fontSize: isDesktop ? '32px' : '22px', color: '#1e3a8a', fontWeight: '700', marginBottom: '8px' }}>
          🪙 קריפטו
        </h2>
        <p style={{ color: '#64748b', fontSize: isDesktop ? '16px' : '14px' }}>מטבעות דיגיטליים</p>
      </div>

      <div style={{
        background: 'rgba(239,68,68,0.08)', borderRadius: '16px', padding: isDesktop ? '16px 24px' : '14px',
        marginBottom: isDesktop ? '28px' : '20px', fontSize: isDesktop ? '15px' : '13px', color: '#dc2626', textAlign: 'center'
      }}>
        ⚠️ קריפטו מאוד מסוכן! רק כסף שמוכנים להפסיד
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: isDesktop ? '12px' : '10px' }}>
        {sorted.map((asset, i) => (
          <AssetCard key={asset.id} asset={asset} index={i} onClick={() => onSelect(asset)} isDesktop={isDesktop} />
        ))}
      </div>
    </div>
  );
};

// ============================================================
// COMPARE SCREEN
// ============================================================

const CompareScreen = ({ isDesktop }) => {
  const comparisons = [
    { topic: 'מה זה?', stock: 'חלק מחברה אמיתית', crypto: 'קוד מחשב דיגיטלי' },
    { topic: 'מה מאחורי?', stock: 'עובדים, מוצרים, רווחים', crypto: 'אמונה של אנשים בלבד' },
    { topic: 'מי שולט?', stock: 'יש חוקים ורגולציה', crypto: 'כמעט בלי פיקוח' },
    { topic: 'סיכון', stock: 'בינוני - עד 30%', crypto: 'גבוה מאוד - עד 80%!' },
    { topic: 'שעות מסחר', stock: 'רק בשעות הבורסה', crypto: '24/7 כל הזמן' },
    { topic: 'מינימום', stock: 'בד"כ $100', crypto: 'אפילו $1' },
    { topic: 'היסטוריה', stock: '100+ שנים', crypto: '15 שנים בלבד' },
  ];

  return (
    <div style={{ 
      padding: isDesktop ? '32px 48px' : '20px', 
      paddingBottom: '120px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: isDesktop ? '32px' : '24px' }}>
        <h2 style={{ fontSize: isDesktop ? '32px' : '22px', color: '#1e3a8a', fontWeight: '700', marginBottom: '8px' }}>
          ⚖️ מניות VS קריפטו
        </h2>
        <p style={{ color: '#64748b', fontSize: isDesktop ? '16px' : '14px' }}>מה ההבדל ביניהם?</p>
      </div>

      <div style={{ display: 'flex', gap: isDesktop ? '16px' : '10px', marginBottom: isDesktop ? '28px' : '20px' }}>
        <div style={{
          flex: 1, background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          borderRadius: '20px', padding: isDesktop ? '24px' : '18px', textAlign: 'center', color: 'white'
        }}>
          <div style={{ fontSize: isDesktop ? '48px' : '36px', marginBottom: '8px' }}>📊</div>
          <div style={{ fontSize: isDesktop ? '20px' : '16px', fontWeight: '700' }}>מניות</div>
          <div style={{ fontSize: isDesktop ? '14px' : '12px', opacity: 0.9, marginTop: '4px' }}>יותר בטוח</div>
        </div>
        <div style={{
          flex: 1, background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
          borderRadius: '20px', padding: isDesktop ? '24px' : '18px', textAlign: 'center', color: 'white'
        }}>
          <div style={{ fontSize: isDesktop ? '48px' : '36px', marginBottom: '8px' }}>🪙</div>
          <div style={{ fontSize: isDesktop ? '20px' : '16px', fontWeight: '700' }}>קריפטו</div>
          <div style={{ fontSize: isDesktop ? '14px' : '12px', opacity: 0.9, marginTop: '4px' }}>יותר מסוכן</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: isDesktop ? '12px' : '10px' }}>
        {comparisons.map((row, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)',
            borderRadius: '16px', padding: isDesktop ? '20px' : '16px',
            border: '1px solid rgba(255,255,255,0.9)'
          }}>
            <div style={{ 
              fontSize: isDesktop ? '14px' : '12px', 
              fontWeight: '600', 
              color: '#1e3a8a', 
              marginBottom: '12px', 
              textAlign: 'center' 
            }}>{row.topic}</div>
            <div style={{ display: 'flex', gap: isDesktop ? '12px' : '8px' }}>
              <div style={{
                flex: 1, background: 'rgba(59,130,246,0.08)', borderRadius: '12px',
                padding: isDesktop ? '14px' : '10px', fontSize: isDesktop ? '14px' : '12px', 
                color: '#334155', textAlign: 'center'
              }}>
                <span style={{ color: '#3b82f6', marginLeft: '6px' }}>📊</span>{row.stock}
              </div>
              <div style={{
                flex: 1, background: 'rgba(245,158,11,0.08)', borderRadius: '12px',
                padding: isDesktop ? '14px' : '10px', fontSize: isDesktop ? '14px' : '12px', 
                color: '#334155', textAlign: 'center'
              }}>
                <span style={{ color: '#f59e0b', marginLeft: '6px' }}>🪙</span>{row.crypto}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: isDesktop ? '24px' : '20px', 
        background: 'rgba(16,185,129,0.1)', 
        borderRadius: '16px',
        padding: isDesktop ? '20px' : '16px', 
        textAlign: 'center'
      }}>
        <span style={{ fontSize: isDesktop ? '16px' : '14px', color: '#10b981', fontWeight: '500' }}>
          💡 טיפ: רוב הכסף במניות, קצת בקריפטו (אם בכלל)
        </span>
      </div>
    </div>
  );
};

// ============================================================
// EXCHANGES SCREEN
// ============================================================

const ExchangesScreen = ({ onSelect, isDesktop }) => {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? exchangesData : exchangesData.filter(e => e.type === filter);

  return (
    <div style={{ 
      padding: isDesktop ? '32px 48px' : '20px', 
      paddingBottom: '120px',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: isDesktop ? '32px' : '24px' }}>
        <h2 style={{ fontSize: isDesktop ? '32px' : '22px', color: '#1e3a8a', fontWeight: '700', marginBottom: '8px' }}>
          🏛️ בורסות
        </h2>
        <p style={{ color: '#64748b', fontSize: isDesktop ? '16px' : '14px' }}>איפה קונים?</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: isDesktop ? '28px' : '20px' }}>
        {[
          { id: 'all', label: 'הכל' },
          { id: 'stock', label: '📊 מניות' },
          { id: 'crypto', label: '🪙 קריפטו' }
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: isDesktop ? '12px 24px' : '10px 18px', 
            border: 'none', 
            borderRadius: '24px',
            background: filter === f.id ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)' : 'rgba(255,255,255,0.8)',
            color: filter === f.id ? 'white' : '#64748b',
            fontSize: isDesktop ? '15px' : '13px', 
            fontWeight: '500', 
            cursor: 'pointer',
            boxShadow: filter === f.id ? '0 4px 15px rgba(30,58,138,0.3)' : 'none',
            transition: 'all 0.2s'
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr', 
        gap: isDesktop ? '16px' : '12px' 
      }}>
        {filtered.map(exchange => (
          <div key={exchange.id} onClick={() => onSelect(exchange)} style={{
            background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)',
            borderRadius: '20px', padding: isDesktop ? '24px' : '18px', cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.9)',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(59,130,246,0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: isDesktop ? '56px' : '48px', 
                height: isDesktop ? '56px' : '48px', 
                borderRadius: '16px',
                background: `${exchange.color}15`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isDesktop ? '28px' : '24px'
              }}>{exchange.icon}</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: isDesktop ? '18px' : '16px', fontWeight: '600', color: '#1e3a8a' }}>{exchange.name}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{exchange.country}</span>
                </div>
                <p style={{ fontSize: isDesktop ? '14px' : '12px', color: '#64748b', margin: 0 }}>{exchange.forWho}</p>
              </div>

              <div style={{
                width: isDesktop ? '48px' : '40px', 
                height: isDesktop ? '48px' : '40px', 
                borderRadius: '50%',
                background: `${exchange.color}20`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: isDesktop ? '16px' : '14px', fontWeight: '700', color: exchange.color }}>{exchange.score}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// LEARN SCREEN
// ============================================================

const LearnScreen = ({ onSelect, isDesktop }) => (
  <div style={{ 
    padding: isDesktop ? '32px 48px' : '20px', 
    paddingBottom: '120px',
    maxWidth: '800px',
    margin: '0 auto'
  }}>
    <div style={{ textAlign: 'center', marginBottom: isDesktop ? '32px' : '24px' }}>
      <h2 style={{ fontSize: isDesktop ? '32px' : '22px', color: '#1e3a8a', fontWeight: '700', marginBottom: '8px' }}>
        📚 למד
      </h2>
      <p style={{ color: '#64748b', fontSize: isDesktop ? '16px' : '14px' }}>הכל בשפה פשוטה</p>
    </div>

    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr', 
      gap: isDesktop ? '16px' : '12px' 
    }}>
      {lessonsData.map((lesson, i) => (
        <div key={lesson.id} onClick={() => onSelect(lesson)} style={{
          background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)',
          borderRadius: '20px', padding: isDesktop ? '24px' : '18px', cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.9)',
          transition: 'all 0.25s ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(59,130,246,0.12)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: isDesktop ? '56px' : '48px', 
              height: isDesktop ? '56px' : '48px', 
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: isDesktop ? '26px' : '22px'
            }}>{lesson.icon}</div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: isDesktop ? '18px' : '16px', fontWeight: '600', color: '#1e3a8a', marginBottom: '4px' }}>{lesson.title}</div>
              <p style={{ fontSize: isDesktop ? '14px' : '12px', color: '#64748b', margin: 0 }}>{lesson.subtitle}</p>
            </div>

            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6' }}>{i + 1}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================
// ASSET DETAIL
// ============================================================

const AssetDetail = ({ asset, onBack, isDesktop }) => {
  const [tab, setTab] = useState(0);
  const info = getScoreInfo(asset.score);
  const isUp = asset.change >= 0;
  const isCrypto = asset.type === 'crypto';

  return (
    <div style={{ paddingBottom: '120px' }}>
      <Header title={asset.name} showBack onBack={onBack} isDesktop={isDesktop} />

      <div style={{ 
        padding: isDesktop ? '32px 48px' : '20px',
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        {/* Hero */}
        <div style={{
          background: isCrypto 
            ? 'linear-gradient(160deg, #f59e0b, #fbbf24)' 
            : 'linear-gradient(160deg, #1e3a8a, #3b82f6)',
          borderRadius: '24px', padding: isDesktop ? '32px' : '24px', marginBottom: '20px', color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: isDesktop ? '32px' : '26px', fontWeight: '700', marginBottom: '4px' }}>{asset.name}</div>
              <div style={{ opacity: 0.9, fontSize: '14px' }}>
                {asset.symbol} · {isCrypto ? '🪙 קריפטו' : '📊 מניה'}
              </div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: isDesktop ? '32px' : '26px', fontWeight: '700' }}>{formatPrice(asset.price, asset.type)}</div>
              <div style={{ fontSize: '16px', color: isUp ? '#86efac' : '#fca5a5', fontWeight: '600' }}>
                {isUp ? '↑' : '↓'} {Math.abs(asset.change)}%
              </div>
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Sparkline data={asset.history} color="rgba(255,255,255,0.9)" width={isDesktop ? 160 : 120} height={50} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '40px' }}>{info.emoji}</span>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>ציון</div>
                <div style={{ fontSize: '28px', fontWeight: '700' }}>{asset.score}</div>
              </div>
            </div>
          </div>
        </div>

        {isCrypto && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', borderRadius: '14px', padding: '14px',
            marginBottom: '20px', textAlign: 'center'
          }}>
            <span style={{ fontSize: '14px', color: '#dc2626' }}>⚠️ קריפטו מאוד מסוכן - רק כסף שמוכנים להפסיד!</span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.04)', borderRadius: '14px', padding: '4px', marginBottom: '20px' }}>
          {['סקירה', 'למה?', 'מסקנה'].map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              flex: 1, padding: '12px', border: 'none', borderRadius: '12px',
              background: tab === i ? 'white' : 'transparent',
              color: tab === i ? '#1e3a8a' : '#64748b',
              fontSize: '14px', fontWeight: tab === i ? '600' : '400', cursor: 'pointer',
              boxShadow: tab === i ? '0 2px 10px rgba(0,0,0,0.06)' : 'none'
            }}>{t}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ 
          background: 'rgba(255,255,255,0.85)', 
          borderRadius: '20px', 
          padding: isDesktop ? '28px' : '22px', 
          minHeight: '200px' 
        }}>
          {tab === 0 && (
            <div style={{ textAlign: 'center' }}>
              <AnimatedScore score={asset.score} size={isDesktop ? 130 : 110} />
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { label: 'סוג', value: isCrypto ? '🪙 קריפטו' : '📊 מניה' },
                  { label: 'סיכון', value: asset.risk === 'low' ? 'נמוך' : asset.risk === 'medium' ? 'בינוני' : 'גבוה!', color: asset.risk === 'high' ? '#ef4444' : undefined },
                ].map(item => (
                  <div key={item.label} style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{item.label}</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: item.color || '#1e3a8a' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 1 && (
            <div>
              <p style={{ fontSize: '16px', lineHeight: '1.9', color: '#334155', marginBottom: '20px', paddingRight: '14px', borderRight: `4px solid ${isCrypto ? '#f59e0b' : '#3b82f6'}` }}>
                {asset.reason}
              </p>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#10b981', marginBottom: '10px' }}>✓ יתרונות</div>
                {asset.good.map((item, i) => (
                  <div key={i} style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.08)', borderRadius: '12px', marginBottom: '8px', fontSize: '14px' }}>{item}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#ef4444', marginBottom: '10px' }}>✗ חסרונות</div>
                {asset.bad.map((item, i) => (
                  <div key={i} style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', borderRadius: '12px', marginBottom: '8px', fontSize: '14px' }}>{item}</div>
                ))}
              </div>
            </div>
          )}

          {tab === 2 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>{info.emoji}</div>
              <h3 style={{ fontSize: '24px', color: info.color, fontWeight: '700', marginBottom: '16px' }}>
                {asset.score >= 75 ? 'נראה טוב!' : asset.score >= 50 ? 'אפשרי, אבל בזהירות' : 'לא מומלץ כרגע'}
              </h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7', margin: '0 auto 24px', maxWidth: '320px' }}>
                {asset.score >= 75 
                  ? (isCrypto ? 'ציון גבוה לקריפטו, אבל עדיין מסוכן! רק סכום קטן.' : 'נראה טוב להשקעה. עדיין חשוב לפזר!')
                  : asset.score >= 50 ? 'יש פוטנציאל אבל גם סיכונים. זהירות.'
                  : 'עדיף לחכות או לחפש אפשרויות אחרות.'
                }
              </p>
              <div style={{ padding: '16px', background: `${info.color}15`, borderRadius: '16px', display: 'inline-block' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>ציון סופי</div>
                <div style={{ fontSize: '36px', fontWeight: '700', color: info.color }}>{asset.score}/100</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>⚠️ המידע להעשרה בלבד ואינו ייעוץ השקעות</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// EXCHANGE DETAIL
// ============================================================

const ExchangeDetail = ({ exchange, onBack, isDesktop }) => (
  <div style={{ paddingBottom: '120px' }}>
    <Header title={exchange.name} showBack onBack={onBack} isDesktop={isDesktop} />

    <div style={{ 
      padding: isDesktop ? '32px 48px' : '20px',
      maxWidth: '700px',
      margin: '0 auto'
    }}>
      <div style={{
        background: `linear-gradient(160deg, ${exchange.color}, ${exchange.color}cc)`,
        borderRadius: '24px', padding: isDesktop ? '32px' : '24px', marginBottom: '20px', color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'
          }}>{exchange.icon}</div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>{exchange.name}</div>
            <div style={{ opacity: 0.9, fontSize: '14px' }}>{exchange.country} · {exchange.nameEn}</div>
          </div>
        </div>
        <p style={{ fontSize: '16px', lineHeight: '1.7', margin: 0, opacity: 0.95 }}>{exchange.description}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '16px', padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>מינימום</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#1e3a8a' }}>{exchange.minInvest}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '16px', padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>שעות</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>{exchange.hours}</div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '20px', padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1e3a8a', marginBottom: '14px' }}>🏢 מה אפשר לקנות</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {exchange.companies.map(c => (
            <span key={c} style={{ padding: '8px 16px', background: `${exchange.color}15`, borderRadius: '20px', fontSize: '14px', color: exchange.color, fontWeight: '500' }}>{c}</span>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '20px', padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#10b981', marginBottom: '10px' }}>✓ יתרונות</div>
          {exchange.pros.map((p, i) => (
            <div key={i} style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.08)', borderRadius: '12px', marginBottom: '8px', fontSize: '14px' }}>{p}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#ef4444', marginBottom: '10px' }}>✗ חסרונות</div>
          {exchange.cons.map((c, i) => (
            <div key={i} style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', borderRadius: '12px', marginBottom: '8px', fontSize: '14px' }}>{c}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// LESSON DETAIL
// ============================================================

const LessonDetail = ({ lesson, onBack, isDesktop }) => (
  <div style={{ paddingBottom: '120px' }}>
    <Header title={lesson.title} showBack onBack={onBack} isDesktop={isDesktop} />

    <div style={{ 
      padding: isDesktop ? '32px 48px' : '20px',
      maxWidth: '700px',
      margin: '0 auto'
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #1e3a8a, #3b82f6)',
        borderRadius: '24px', padding: isDesktop ? '36px' : '28px', marginBottom: '24px', color: 'white', textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{lesson.icon}</div>
        <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>{lesson.title}</h2>
        <p style={{ opacity: 0.9, fontSize: '16px', margin: 0 }}>{lesson.subtitle}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {lesson.content.map((item, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.85)', borderRadius: '18px', padding: '20px',
            border: '1px solid rgba(255,255,255,0.9)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '14px', fontWeight: '700', flexShrink: 0
              }}>{i + 1}</div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a8a', margin: '0 0 10px 0' }}>{item.q}</h4>
                <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.8', margin: 0, whiteSpace: 'pre-line' }}>{item.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================
// MAIN APP
// ============================================================

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState('stocks');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  const { width } = useWindowSize();
  const isDesktop = width >= 768;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedAsset(null);
    setSelectedExchange(null);
    setSelectedLesson(null);
  };

  const renderContent = () => {
    if (selectedAsset) return <AssetDetail asset={selectedAsset} onBack={() => setSelectedAsset(null)} isDesktop={isDesktop} />;
    if (selectedExchange) return <ExchangeDetail exchange={selectedExchange} onBack={() => setSelectedExchange(null)} isDesktop={isDesktop} />;
    if (selectedLesson) return <LessonDetail lesson={selectedLesson} onBack={() => setSelectedLesson(null)} isDesktop={isDesktop} />;

    switch (activeTab) {
      case 'stocks': return <StocksScreen onSelect={setSelectedAsset} isDesktop={isDesktop} />;
      case 'crypto': return <CryptoScreen onSelect={setSelectedAsset} isDesktop={isDesktop} />;
      case 'compare': return <CompareScreen isDesktop={isDesktop} />;
      case 'exchanges': return <ExchangesScreen onSelect={setSelectedExchange} isDesktop={isDesktop} />;
      case 'learn': return <LearnScreen onSelect={setSelectedLesson} isDesktop={isDesktop} />;
      default: return <StocksScreen onSelect={setSelectedAsset} isDesktop={isDesktop} />;
    }
  };

  return (
    <div dir="rtl" style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 50%, #f8fafc 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      {renderContent()}
      <FloatingTabBar active={activeTab} onChange={handleTabChange} isDesktop={isDesktop} />
    </div>
  );
};


ReactDOM.createRoot(document.getElementById('root')).render(<App />);
