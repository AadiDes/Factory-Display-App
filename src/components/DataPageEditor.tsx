import React from 'react';
import { Edit3, Save, X } from 'lucide-react';
import type { DashboardDataPage, DashboardItem } from '../App';

interface DataPageEditorProps {
  page: DashboardDataPage;
  editingItemId: string | null;
  tempItemData: Partial<DashboardItem>;
  onEditItem: (item: DashboardItem) => void;
  onSaveItem: () => void;
  onCancelEdit: () => void;
  onItemToggle: (itemId: string) => void;
  onResetPage: () => void;
  onUpdate: () => void;
  updateButtonText: string;
  setTempItemData: React.Dispatch<React.SetStateAction<Partial<DashboardItem>>>;
  setPageDuration: (duration: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal': return 'text-green-600 bg-green-50 border-green-200';
    case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'critical': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-blue-600 bg-blue-50 border-blue-200';
  }
};

const DataPageEditor: React.FC<DataPageEditorProps> = ({
  page,
  editingItemId,
  tempItemData,
  onEditItem,
  onSaveItem,
  onCancelEdit,
  onItemToggle,
  onResetPage,
  onUpdate,
  updateButtonText,
  setTempItemData,
  setPageDuration,
}) => (
  <>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Display Duration (seconds)</label>
      <input
        type="number"
        min={1}
        value={page.duration}
        onChange={e => setPageDuration(Number(e.target.value))}
        className="px-3 py-2 border border-gray-300 rounded-lg w-32"
      />
    </div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Dashboard Items Configuration</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{page.selectedItems.length} / 8 selected</span>
        <button
          onClick={onResetPage}
          className="ml-4 px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300 text-xs font-medium"
        >
          Reset Page
        </button>
      </div>
    </div>
    <div
      className="grid gap-4 mb-8"
      style={{
        gridTemplateColumns:
          page.dashboardItems.length <= 4
            ? 'repeat(1, minmax(0, 1fr))'
            : page.dashboardItems.length <= 8
            ? 'repeat(2, minmax(0, 1fr))'
            : `repeat(${Math.ceil(Math.sqrt(page.dashboardItems.length))}, minmax(0, 1fr))`,
        gridTemplateRows:
          page.dashboardItems.length <= 4
            ? `repeat(${page.dashboardItems.length}, minmax(0, 1fr))`
            : page.dashboardItems.length <= 8
            ? 'repeat(4, minmax(0, 1fr))'
            : `repeat(${Math.ceil(page.dashboardItems.length / Math.ceil(Math.sqrt(page.dashboardItems.length)))}, minmax(0, 1fr))`,
      }}
    >
      {page.dashboardItems.map((item) => (
        <div
          key={item.id}
          className={`border-2 rounded-lg p-4 transition-all ${
            page.selectedItems.includes(item.id)
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200'
          }`}
        >
          {editingItemId === item.id ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={tempItemData.icon}
                  onChange={e => setTempItemData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-12 text-center text-2xl border border-gray-300 rounded"
                  placeholder="🔧"
                />
                <select
                  value={tempItemData.status}
                  onChange={e => setTempItemData(prev => ({ ...prev, status: e.target.value as DashboardItem['status'] }))}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="normal">Normal</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <input
                type="text"
                value={tempItemData.title}
                onChange={e => setTempItemData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-sm font-semibold border border-gray-300 rounded px-2 py-1"
                placeholder="Title"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempItemData.value}
                  onChange={e => setTempItemData(prev => ({ ...prev, value: e.target.value }))}
                  className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                  placeholder="Value"
                />
                <input
                  type="text"
                  value={tempItemData.unit}
                  onChange={e => setTempItemData(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-16 text-sm border border-gray-300 rounded px-2 py-1"
                  placeholder="Unit"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onSaveItem}
                  className="flex-1 bg-green-600 text-white text-xs py-1 px-2 rounded hover:bg-green-700 flex items-center justify-center gap-1"
                >
                  <Save className="h-3 w-3" />
                  Save
                </button>
                <button
                  onClick={onCancelEdit}
                  className="flex-1 bg-gray-600 text-white text-xs py-1 px-2 rounded hover:bg-gray-700 flex items-center justify-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditItem(item)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.toUpperCase()}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-lg font-bold text-gray-900">{item.value}</span>
                <span className="text-sm text-gray-500">{item.unit}</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={page.selectedItems.includes(item.id)}
                  onChange={() => onItemToggle(item.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {page.selectedItems.includes(item.id) ? 'Selected' : 'Select'}
                </span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  </>
);

export default DataPageEditor; 