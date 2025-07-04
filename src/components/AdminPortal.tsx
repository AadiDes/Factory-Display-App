import React, { useState } from 'react';
import { ArrowLeft, Lock, User, Eye, EyeOff, RefreshCw, Edit3, Save, X } from 'lucide-react';
import { useDashboard, DashboardDataPage, ImagePage } from '../App';
import type { DashboardItem, DisplaySettings } from '../App';
import LogoCropper from './LogoCropper';
import DataPageEditor from './DataPageEditor';
import ImagePageEditor from './ImagePageEditor';

interface AdminPortalProps {
  onBack: () => void;
}

function AdminPortal({ onBack }: AdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { pages, setPages, displaySettings, setDisplaySettings, rotationInterval, setRotationInterval, enabledPageOrder, setEnabledPageOrder } = useDashboard();
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const page = pages[selectedPageIndex];
  const [logoCropImage, setLogoCropImage] = useState<string | null>(null);
  const [imageCropImage, setImageCropImage] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempItemData, setTempItemData] = useState<Partial<DashboardItem>>({});
  const [updateButtonText, setUpdateButtonText] = useState('Update Display');

  // Default values for reset
  const defaultDisplaySettings: DisplaySettings = {
    companyTitle: 'Shalaka Connected Devices',
    companySubtitle: 'Real-Time Monitoring',
    companyLogo: undefined
  };
  const defaultDashboardPage: DashboardDataPage = {
    type: 'dashboard',
    enabled: true,
    dashboardItems: [
      { id: '1', title: 'Production Rate', value: '1,247', unit: 'units/hr', status: 'normal', icon: '⚙️' },
      { id: '2', title: 'Temperature', value: '78.5', unit: '°C', status: 'normal', icon: '🌡️' },
      { id: '3', title: 'Pressure', value: '145.2', unit: 'PSI', status: 'warning', icon: '📊' },
      { id: '4', title: 'Power Usage', value: '847.3', unit: 'kW', status: 'normal', icon: '⚡' },
      { id: '5', title: 'Efficiency', value: '94.7', unit: '%', status: 'normal', icon: '📈' },
      { id: '6', title: 'Downtime', value: '12', unit: 'min', status: 'critical', icon: '⏰' },
      { id: '7', title: 'Quality Score', value: '98.2', unit: '%', status: 'normal', icon: '✅' },
      { id: '8', title: 'Workers Active', value: '23', unit: 'people', status: 'normal', icon: '👥' }
    ],
    selectedItems: ['1', '2', '3', '4', '5', '6', '7', '8'],
    duration: 5,
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === 'manager' && password === 'password1') {
      setIsAuthenticated(true);
    } else {
      setError('Invalid username or password');
    }
    setIsLoading(false);
  };

  const handleItemToggle = (itemId: string) => {
    setPages((prev: any[]) => prev.map((p, i) =>
      i === selectedPageIndex && p.type === 'dashboard'
        ? {
            ...p,
            selectedItems: p.selectedItems.includes(itemId)
              ? p.selectedItems.filter((id: string) => id !== itemId)
              : [...p.selectedItems, itemId].slice(0, 8)
          }
        : p
    ));
  };

  const handleEditItem = (item: DashboardItem) => {
    setEditingItemId(item.id);
    setTempItemData({ ...item });
  };

  const handleSaveItem = () => {
    setPages((prev: any[]) => prev.map((p, i) =>
      i === selectedPageIndex && p.type === 'dashboard'
        ? {
            ...p,
            dashboardItems: p.dashboardItems.map((item: DashboardItem) =>
              item.id === editingItemId ? { ...item, ...tempItemData } as DashboardItem : item
            )
          }
        : p
    ));
    setEditingItemId(null);
    setTempItemData({});
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setTempItemData({});
  };

  const handleUpdate = () => {
    setUpdateButtonText('Updated!');
    setTimeout(() => setUpdateButtonText('Update Display'), 2000);
  };

  const handleResetPage = () => {
    setPages((prev: any[]) => prev.map((p, i) =>
      i === selectedPageIndex && p.type === 'dashboard'
        ? {
            ...p,
            dashboardItems: [
              { id: '1', title: 'Production Rate', value: '1,247', unit: 'units/hr', status: 'normal', icon: '⚙️' },
              { id: '2', title: 'Temperature', value: '78.5', unit: '°C', status: 'normal', icon: '🌡️' },
              { id: '3', title: 'Pressure', value: '145.2', unit: 'PSI', status: 'warning', icon: '📊' },
              { id: '4', title: 'Power Usage', value: '847.3', unit: 'kW', status: 'normal', icon: '⚡' },
              { id: '5', title: 'Efficiency', value: '94.7', unit: '%', status: 'normal', icon: '📈' },
              { id: '6', title: 'Downtime', value: '12', unit: 'min', status: 'critical', icon: '⏰' },
              { id: '7', title: 'Quality Score', value: '98.2', unit: '%', status: 'normal', icon: '✅' },
              { id: '8', title: 'Workers Active', value: '23', unit: 'people', status: 'normal', icon: '👥' }
            ],
            selectedItems: ['1', '2', '3', '4']
          }
        : p
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  // Add Image Page
  const handleAddImagePage = (position: number) => {
    const newImagePage: ImagePage = {
      type: 'image',
      enabled: true,
      imageData: '',
      size: 'medium',
      duration: 5,
      aspectRatio: 1,
    };
    setPages(prev => {
      const newPages = [...prev];
      newPages.splice(position, 0, newImagePage);
      return newPages;
    });
    setSelectedPageIndex(position);
  };

  // Remove current page
  const handleRemovePage = () => {
    if (pages.length <= 1) return;
    setPages(prev => prev.filter((_, i) => i !== selectedPageIndex));
    setSelectedPageIndex(i => (i > 0 ? i - 1 : 0));
  };

  // Move page up/down
  const handleMovePage = (dir: 'up' | 'down') => {
    setPages(prev => {
      const newPages = [...prev];
      const idx = selectedPageIndex;
      if (dir === 'up' && idx > 0) {
        [newPages[idx - 1], newPages[idx]] = [newPages[idx], newPages[idx - 1]];
        setSelectedPageIndex(idx - 1);
      } else if (dir === 'down' && idx < newPages.length - 1) {
        [newPages[idx + 1], newPages[idx]] = [newPages[idx], newPages[idx + 1]];
        setSelectedPageIndex(idx + 1);
      }
      return newPages;
    });
  };

  const handleResetDisplay = () => {
    if (!window.confirm('Are you sure you want to reset all pages and settings to default?')) return;
    setPages(Array.from({ length: 8 }, () => ({ ...defaultDashboardPage, dashboardItems: defaultDashboardPage.dashboardItems.map(item => ({ ...item })) })));
    setDisplaySettings(defaultDisplaySettings);
    setEnabledPageOrder([0,1,2,3,4,5,6,7]);
    setSelectedPageIndex(0);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Menu
          </button>
          
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h2>
              <p className="text-gray-600">Sign in to manage dashboard settings</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Demo credentials:</p>
              <p>Username: <code className="bg-gray-100 px-1 rounded">manager</code></p>
              <p>Password: <code className="bg-gray-100 px-1 rounded">password1</code></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Menu
            </button>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, Manager</span>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto w-full px-2 md:px-8 py-6 md:py-8 space-y-8">
        {/* Display Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Display Settings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Title
              </label>
              <input
                type="text"
                value={displaySettings.companyTitle}
                onChange={e => setDisplaySettings(ds => ({ ...ds, companyTitle: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter company title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Subtitle
              </label>
              <input
                type="text"
                value={displaySettings.companySubtitle}
                onChange={e => setDisplaySettings(ds => ({ ...ds, companySubtitle: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter company subtitle"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo (PNG)
              </label>
              {displaySettings.companyLogo && !logoCropImage && (
                <div className="flex items-center gap-4 mb-2">
                  <img
                    src={displaySettings.companyLogo}
                    alt="Logo Preview"
                    className="h-20 w-20 object-contain rounded-full border border-gray-300 bg-gray-100 shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setDisplaySettings(ds => ({ ...ds, companyLogo: undefined }))}
                    className="text-red-600 hover:text-red-800 text-xs font-medium border border-red-200 rounded px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              )}
              {logoCropImage && (
                <LogoCropper
                  image={logoCropImage}
                  onComplete={croppedDataUrl => {
                    setDisplaySettings(ds => ({ ...ds, companyLogo: croppedDataUrl }));
                    setLogoCropImage(null);
                  }}
                  onCancel={() => setLogoCropImage(null)}
                />
              )}
              {!displaySettings.companyLogo && !logoCropImage && (
                <input
                  type="file"
                  accept="image/png"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setLogoCropImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              )}
              <p className="text-xs text-gray-400 mt-1">Recommended: Square PNG, max 256x256px</p>
            </div>
          </div>
        </div>

        {/* Page Selector & Add Image Page */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Page</label>
              <select
                value={selectedPageIndex}
                onChange={e => setSelectedPageIndex(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                {(() => {
                  let imagePageCount = 0;
                  return pages.map((p, i) => {
                    if (p.type === 'dashboard') {
                      return (
                        <option key={i} value={i}>
                          📄 Data Page {i + 1}
                        </option>
                      );
                    } else {
                      imagePageCount++;
                      return (
                        <option key={i} value={i}>
                          📷 Image Page {imagePageCount}
                        </option>
                      );
                    }
                  });
                })()}
              </select>
            </div>
            {/* Enable/disable toggle next to select page */}
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={page.enabled}
                onChange={e => setPages(prev => prev.map((p, i) => i === selectedPageIndex ? { ...p, enabled: e.target.checked } : p))}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                id="enable-page-toggle"
              />
              <label htmlFor="enable-page-toggle" className="text-sm text-gray-700 font-medium">Enable this page</label>
            </div>
            {page.type === 'image' && (
              <button
                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200"
                onClick={() => {
                  if (window.confirm('Are you sure you want to remove this image page?')) handleRemovePage();
                }}
                disabled={pages.length <= 1}
              >
                Remove This Image Page
              </button>
            )}
            <button
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200"
              onClick={() => handleAddImagePage(selectedPageIndex + 1)}
            >
              + Add Image Page After
            </button>
          </div>

          {/* Data Page Section */}
          {pages[selectedPageIndex]?.type === 'dashboard' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Display Page</h2>
              <DataPageEditor
                page={pages[selectedPageIndex]}
                editingItemId={editingItemId}
                tempItemData={tempItemData}
                onEditItem={handleEditItem}
                onSaveItem={handleSaveItem}
                onCancelEdit={handleCancelEdit}
                onItemToggle={handleItemToggle}
                onResetPage={handleResetPage}
                setTempItemData={setTempItemData}
                setPageDuration={duration => setPages(prev => prev.map((p, i) => i === selectedPageIndex ? { ...p, duration } : p))}
              />
            </>
          )}

          {/* Image Page Section */}
          {pages[selectedPageIndex]?.type === 'image' && (
            <>
              <h2 className="text-2xl font-bold mb-4">Image Page</h2>
              <ImagePageEditor
                page={pages[selectedPageIndex]}
                imageCropImage={imageCropImage}
                setImageCropImage={setImageCropImage}
                onSetImageData={data => setPages(prev => prev.map((p, i) => i === selectedPageIndex ? { ...p, imageData: data } : p))}
                setPageDuration={duration => setPages(prev => prev.map((p, i) => i === selectedPageIndex ? { ...p, duration } : p))}
                setPageSize={(size, aspectRatio) => setPages(prev => prev.map((p, i) => i === selectedPageIndex ? { ...p, size, aspectRatio } : p))}
              />
            </>
          )}

          {/* Single Common Update Button */}
          <div className="flex justify-end pt-6 border-t mt-8">
            <button
              id="update-button"
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              {updateButtonText}
            </button>
          </div>
        </div>

        {/* Display Page Scheduler */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Display Page Scheduler</h3>
          <p className="text-xs text-gray-500 mb-2">Change the order of enabled pages for display rotation.</p>
          <ul className="space-y-2">
            {(() => {
              let imagePageCount = 0;
              return enabledPageOrder.map((pageIdx, idx) => {
                const p = pages[pageIdx];
                let label = '';
                if (p.type === 'dashboard') {
                  label = `Data Page ${pageIdx + 1}`;
                } else {
                  imagePageCount++;
                  label = `Image Page ${imagePageCount}`;
                }
                return (
                  <li key={pageIdx} className="flex items-center gap-3 bg-gray-50 rounded px-3 py-2 border border-gray-200">
                    <span className="text-xl">{p.type === 'dashboard' ? '📄' : '📷'}</span>
                    <span className="font-medium text-gray-700">{label}</span>
                    {/* Thumbnail for image pages */}
                    {p.type === 'image' && p.imageData && (
                      <img
                        src={p.imageData}
                        alt="thumb"
                        className="h-8 w-8 object-cover rounded border border-gray-300 bg-white/50"
                      />
                    )}
                    {/* Duration indicator */}
                    <span className="text-xs text-gray-500 ml-2">⏱ {p.duration}s</span>
                    <button
                      disabled={idx === 0}
                      onClick={() => setEnabledPageOrder(order => {
                        if (idx === 0) return order;
                        const newOrder = [...order];
                        [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
                        return newOrder;
                      })}
                      className="ml-2 px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                      title="Move Up"
                    >↑</button>
                    <button
                      disabled={idx === enabledPageOrder.length - 1}
                      onClick={() => setEnabledPageOrder(order => {
                        if (idx === enabledPageOrder.length - 1) return order;
                        const newOrder = [...order];
                        [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
                        return newOrder;
                      })}
                      className="px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                      title="Move Down"
                    >↓</button>
                  </li>
                );
              });
            })()}
          </ul>
        </div>
      </div>

      {/* Reset Display Button */}
      <div className="max-w-screen-xl mx-auto w-full px-2 md:px-8 pb-8 flex flex-col items-end">
        <button
          onClick={handleResetDisplay}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold shadow-lg border border-red-700 transition-colors"
        >
          Reset Display
        </button>
        {resetSuccess && (
          <div className="mt-4 text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2 font-medium shadow">
            Display has been reset to default!
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPortal;