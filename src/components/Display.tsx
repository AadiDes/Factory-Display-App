import React, { useState, useEffect } from 'react';
import { useDashboard } from '../App';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface DisplayProps {
  onBack: () => void;
}

function Display({ onBack }: DisplayProps) {
  const { pages, displaySettings, rotationInterval, enabledPageOrder } = useDashboard();
  const enabledPages = enabledPageOrder.map(idx => pages[idx]);
  const [pageIdx, setPageIdx] = useState(0);

  // Cycle through enabled pages using each page's duration
  useEffect(() => {
    if (enabledPages.length === 0) return;
    const duration = enabledPages[pageIdx]?.duration || 5;
    const timeout = setTimeout(() => {
      setPageIdx(idx => (idx + 1) % enabledPages.length);
    }, duration * 1000);
    return () => clearTimeout(timeout);
  }, [enabledPages, pageIdx]);

  // Reset index if enabledPages changes
  useEffect(() => {
    setPageIdx(0);
  }, [enabledPages.length, enabledPageOrder]);

  if (enabledPages.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <h1 className="text-4xl font-bold mb-4">No Display Pages Enabled</h1>
        <p className="text-lg text-slate-300">Enable at least one page in the Admin Portal to show the dashboard.</p>
        <button onClick={onBack} className="mt-8 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Back to Menu</button>
      </div>
    );
  }

  const currentPage = enabledPages[pageIdx];
  // For dashboard pages
  const displayedItems = currentPage.type === 'dashboard'
    ? currentPage.dashboardItems.filter(item => currentPage.selectedItems.includes(item.id))
    : [];
  
  const getColumnClass = (itemCount: number) => {
    if (itemCount <= 2) return 'grid-cols-1';
    if (itemCount <= 4) return 'grid-cols-2';
    if (itemCount <= 6) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400 bg-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      default: return 'text-blue-400 bg-blue-400/20';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-auto">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-screen-xl mx-auto w-full px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Menu
            </button>
            <div className="flex items-center gap-2 text-green-400 font-medium">
              <CheckCircle className="w-5 h-5 text-green-400" />
              System Online
            </div>
          </div>
        </div>
      </div>

      {/* Company Header */}
      <div className="text-center pt-6 md:pt-10 pb-8 md:pb-12">
        {displaySettings.companyLogo && (
          <img
            src={displaySettings.companyLogo}
            alt="Company Logo"
            className="mx-auto mb-8 h-32 w-32 object-contain rounded-full shadow-lg border-4 border-white/20 bg-white/10"
          />
        )}
        <h1 className="text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          {displaySettings.companyTitle}
        </h1>
        <p className="text-2xl text-slate-300">{displaySettings.companySubtitle}</p>
      </div>

      {/* Dashboard Grid - Vertical Layout */}
      <div className="max-w-screen-xl mx-auto w-full px-2 md:px-8 pb-8">
        {currentPage.type === 'image' ? (
          <div className="flex flex-col items-center min-h-[40vh] pt-2 md:pt-4">
            {currentPage.imageData ? (
              <img
                src={currentPage.imageData}
                alt="Display Page"
                className={
                  currentPage.size === 'small'
                    ? 'max-w-xs max-h-64 rounded-xl shadow-lg border border-white/20 bg-white/10'
                    : currentPage.size === 'medium'
                    ? 'max-w-2xl max-h-[60vh] md:max-h-[70vh] rounded-2xl shadow-2xl border border-white/20 bg-white/10'
                    : 'max-w-5xl max-h-[70vh] md:max-h-[80vh] rounded-3xl shadow-2xl border-4 border-white/20 bg-white/10'
                }
                style={{ objectFit: 'contain', marginTop: 0 }}
              />
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🖼️</div>
                <h3 className="text-2xl font-semibold mb-2">No Image Set</h3>
                <p className="text-slate-400">Use the Admin Portal to upload an image for this page</p>
              </div>
            )}
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold mb-2">No Items Selected</h3>
            <p className="text-slate-400">Use the Admin Portal to select items to display</p>
          </div>
        ) : (
          <div
            className={`grid gap-6 w-full h-full`}
            style={{
              gridTemplateColumns:
                displayedItems.length <= 4
                  ? 'repeat(1, minmax(0, 1fr))'
                  : displayedItems.length <= 8
                  ? 'repeat(2, minmax(0, 1fr))'
                  : `repeat(${Math.ceil(Math.sqrt(displayedItems.length))}, minmax(0, 1fr))`,
              gridTemplateRows:
                displayedItems.length <= 4
                  ? `repeat(${displayedItems.length}, minmax(0, 1fr))`
                  : displayedItems.length <= 8
                  ? 'repeat(4, minmax(0, 1fr))'
                  : `repeat(${Math.ceil(displayedItems.length / Math.ceil(Math.sqrt(displayedItems.length)))}, minmax(0, 1fr))`,
              minHeight: '40vh',
            }}
          >
            {displayedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 flex flex-col justify-center items-center h-full w-full min-h-[180px] min-w-[180px]"
                style={{ minHeight: 0, minWidth: 0 }}
              >
                <div className={`px-3 py-1 rounded-full text-2sm font-medium ${getStatusColor(item.status)}`}>{item.status.toUpperCase()}</div>
                <h3 className="text-4xl font-semibold text-slate-300 mb-2 mt-4">{item.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{item.value}</span>
                  <span className="text-xl text-slate-400">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Display;
