import React, { useState, createContext, useContext } from 'react';
import Display from './components/Display';
import AdminPortal from './components/AdminPortal';

export interface DashboardItem {
  id: string;
  title: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  icon: string;
}

export interface DisplaySettings {
  companyTitle: string;
  companySubtitle: string;
  companyLogo?: string; // base64 or data URL
}

export interface ImagePage {
  type: 'image';
  enabled: boolean;
  imageData: string; // data URL
  size: 'small' | 'medium' | 'large';
  duration: number;
  aspectRatio: number;
}

export interface DashboardDataPage {
  type: 'dashboard';
  enabled: boolean;
  dashboardItems: DashboardItem[];
  selectedItems: string[];
  duration: number;
}

type AnyPage = DashboardDataPage | ImagePage;

interface DashboardContextType {
  pages: AnyPage[];
  setPages: React.Dispatch<React.SetStateAction<AnyPage[]>>;
  displaySettings: DisplaySettings;
  setDisplaySettings: React.Dispatch<React.SetStateAction<DisplaySettings>>;
  rotationInterval: number;
  setRotationInterval: (interval: number) => void;
  enabledPageOrder: number[];
  setEnabledPageOrder: React.Dispatch<React.SetStateAction<number[]>>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

const initialDisplaySettings: DisplaySettings = {
  companyTitle: 'Shalaka Connected Devices',
  companySubtitle: 'Real-Time Monitoring',
  companyLogo: undefined
};

const initialDashboardPage: DashboardDataPage = {
  type: 'dashboard',
  enabled: true,
  dashboardItems: [
    { id: '1', title: 'Production Rate', value: '1,247', unit: 'units/hr', status: 'normal' as const, icon: '⚙️' },
    { id: '2', title: 'Temperature', value: '78.5', unit: '°C', status: 'normal' as const, icon: '🌡️' },
    { id: '3', title: 'Pressure', value: '145.2', unit: 'PSI', status: 'warning' as const, icon: '📊' },
    { id: '4', title: 'Power Usage', value: '847.3', unit: 'kW', status: 'normal' as const, icon: '⚡' },
    { id: '5', title: 'Efficiency', value: '94.7', unit: '%', status: 'normal' as const, icon: '📈' },
    { id: '6', title: 'Downtime', value: '12', unit: 'min', status: 'critical' as const, icon: '⏰' },
    { id: '7', title: 'Quality Score', value: '98.2', unit: '%', status: 'normal' as const, icon: '✅' },
    { id: '8', title: 'Workers Active', value: '23', unit: 'people', status: 'normal' as const, icon: '👥' }
  ],
  selectedItems: ['1', '2', '3', '4', '5', '6', '7', '8'],
  duration: 5,
};

type AppMode = 'select' | 'display' | 'admin';

function App() {
  const [mode, setMode] = useState<AppMode>('select');
  const [pages, setPagesState] = useState<AnyPage[]>(
    Array.from({ length: 8 }, () => ({ ...initialDashboardPage, dashboardItems: initialDashboardPage.dashboardItems.map(item => ({ ...item })) }))
  );
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(initialDisplaySettings);
  const [rotationInterval, setRotationInterval] = useState<number>(5);
  const [enabledPageOrder, setEnabledPageOrder] = useState<number[]>(() => pages.map((_, i) => i).filter(i => pages[i].enabled));

  // Custom setPages to handle enabledPageOrder updates
  const setPages = (updater: React.SetStateAction<AnyPage[]>) => {
    setPagesState(prevPages => {
      const newPages = typeof updater === 'function' ? (updater as (prev: AnyPage[]) => AnyPage[])(prevPages) : updater;
      // Find which pages changed enabled status
      const prevEnabled = prevPages.map((p, i) => p.enabled ? i : null).filter(i => i !== null) as number[];
      const newEnabled = newPages.map((p, i) => p.enabled ? i : null).filter(i => i !== null) as number[];
      // Pages that were just enabled
      const justEnabled = newEnabled.filter(i => !prevEnabled.includes(i));
      // Pages that were just disabled
      const justDisabled = prevEnabled.filter(i => !newEnabled.includes(i));
      let newOrder = [...enabledPageOrder];
      // Add newly enabled pages to the end
      justEnabled.forEach(i => { if (!newOrder.includes(i)) newOrder.push(i); });
      // Remove newly disabled pages
      justDisabled.forEach(i => { newOrder = newOrder.filter(idx => idx !== i); });
      setEnabledPageOrder(newOrder);
      return newPages;
    });
  };

  const dashboardContextValue: DashboardContextType = {
    pages,
    setPages,
    displaySettings,
    setDisplaySettings,
    rotationInterval,
    setRotationInterval,
    enabledPageOrder,
    setEnabledPageOrder
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-8">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            {displaySettings.companyLogo && (
              <img
                src={displaySettings.companyLogo}
                alt="Company Logo"
                className="mx-auto mb-10 h-40 w-40 object-contain rounded-full shadow-2xl border-8 border-white/20 bg-white/10"
              />
            )}
            <h1 className="text-8xl font-extrabold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">
              {displaySettings.companyTitle}
            </h1>
            <p className="text-3xl text-slate-200 font-medium drop-shadow mb-2">{displaySettings.companySubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            <button
              onClick={() => setMode('display')}
              className="group bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-3xl p-16 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 shadow-2xl flex flex-col items-center focus:outline-none focus:ring-4 focus:ring-blue-400/40"
            >
              <span className="block text-7xl mb-8">📺</span>
              <h3 className="text-5xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">Display Mode</h3>
              <p className="text-2xl text-slate-200">Large screen dashboard for factory floor monitoring</p>
            </button>
            <button
              onClick={() => setMode('admin')}
              className="group bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-3xl p-16 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 shadow-2xl flex flex-col items-center focus:outline-none focus:ring-4 focus:ring-blue-400/40"
            >
              <span className="block text-7xl mb-8">🛠️</span>
              <h3 className="text-5xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">Admin Portal</h3>
              <p className="text-2xl text-slate-200">Configure display settings and manage dashboard items</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={dashboardContextValue}>
      {mode === 'display' && <Display onBack={() => setMode('select')} />}
      {mode === 'admin' && <AdminPortal onBack={() => setMode('select')} />}
    </DashboardContext.Provider>
  );
}

export default App;
