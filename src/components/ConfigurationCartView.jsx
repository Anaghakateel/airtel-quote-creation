import { useState } from 'react'
import ConfigurationCartContent from './ConfigurationCartContent'
import LocationsTabContent from './LocationsTabContent'

function formatINR(num) {
  if (num == null) return '₹0.00'
  const n = Number(num)
  if (n === 0) return '₹0.00'
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function ConfigurationCartView({ row, onBack, locations = [], onUpdateLocation, onDeleteLocations, onAddProductsToQuote }) {
  const [mainTab, setMainTab] = useState('Configuration Cart')
  const [hasUpdates, setHasUpdates] = useState(false)
  const [selectedLocationCount, setSelectedLocationCount] = useState(0)
  const [selectedLocationIds, setSelectedLocationIds] = useState(new Set())
  const [configuredLocationIds, setConfiguredLocationIds] = useState(new Set())

  const oneTimeTotal = row?.oneTimeTotal ?? 10000
  const monthlyTotal = row?.recurringTotal ?? 0
  const onAssignServices = mainTab === 'Assign Configuration to locations'
  const updateCartEnabled = hasUpdates && !onAssignServices
  const addProductsLabel = 'Add configurations to quote'

  return (
    <div className="flex flex-col min-h-0 h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Tabs: Configuration Cart | Assign Configuration to locations */}
      <div className="border-b border-gray-200 shrink-0">
        <div className="flex gap-0">
          <button
            type="button"
            onClick={() => setMainTab('Configuration Cart')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 -mb-px transition-colors ${
              mainTab === 'Configuration Cart'
                ? 'text-airtel-red border-airtel-red'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Configuration Cart
          </button>
          <button
            type="button"
            onClick={() => setMainTab('Assign Configuration to locations')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 -mb-px transition-colors ${
              mainTab === 'Assign Configuration to locations'
                ? 'text-airtel-red border-airtel-red'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Assign Configuration to locations
          </button>
        </div>
      </div>

      {mainTab === 'Configuration Cart' ? (
        <ConfigurationCartContent
          row={row}
          onBack={onBack}
          onUpdateCart={() => setHasUpdates(false)}
          onDirtyChange={setHasUpdates}
          hideFooter
        />
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100vh - 14rem)' }}>
          <div className="pb-24">
            <LocationsTabContent
              locations={locations}
              configuredLocationIds={configuredLocationIds}
              onMarkLocationsConfigured={(ids) => setConfiguredLocationIds((prev) => new Set([...prev, ...ids]))}
              onUpdateLocation={onUpdateLocation}
              onDeleteLocations={onDeleteLocations}
              onSelectionChange={(count, ids) => {
                setSelectedLocationCount(count)
                setSelectedLocationIds(ids ?? new Set())
              }}
            />
          </div>
        </div>
      )}

      {/* Footer: same for both Configuration Cart and Assign Configuration to locations – fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between gap-4 p-4 border-t border-gray-200 bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div>
            <p className="text-gray-500">Location</p>
            <p className="font-medium text-gray-900">1</p>
          </div>
          <div>
            <p className="text-gray-500">One Time Total</p>
            <p className="font-semibold text-gray-900">{formatINR(oneTimeTotal)}</p>
          </div>
          <div>
            <p className="text-gray-500">Monthly Total</p>
            <p className="font-semibold text-gray-900">{formatINR(monthlyTotal)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => (mainTab === 'Assign Configuration to locations' ? setMainTab('Configuration Cart') : onBack())}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => {
              if (updateCartEnabled) {
                setHasUpdates(false)
                setMainTab('Assign Configuration to locations')
              }
            }}
            className={updateCartEnabled ? 'px-4 py-2 rounded-md border border-gray-300 bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg' : 'px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-500 text-xs font-medium cursor-not-allowed'}
            disabled={!updateCartEnabled}
          >
            Update Cart
          </button>
          <button
            type="button"
            onClick={() => {
              if (hasUpdates) return
              onAddProductsToQuote?.(Array.from(selectedLocationIds))
              setConfiguredLocationIds((prev) => new Set([...prev, ...selectedLocationIds]))
            }}
            className={hasUpdates ? 'px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-500 text-xs font-medium cursor-not-allowed' : 'px-4 py-2 rounded-md bg-airtel-red text-white text-xs font-medium hover:opacity-90'}
            disabled={hasUpdates}
          >
            {addProductsLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
