/**
 * Technical Enrichment page - Technical Attributes with sub-tabs:
 * Configure Technical attributes | Assign configurations to locations.
 * Supports embedInModal + onClose when shown inside a modal (e.g. from Enrich Quote row overflow).
 */
import { useState } from 'react'
import ConfigureTechnicalAttributesContent from './ConfigureTechnicalAttributesContent'
import LocationsTabContent from './LocationsTabContent'

export default function TechnicalEnrichmentPage({ embedInModal, onClose }) {
  const [technicalSubTab, setTechnicalSubTab] = useState('Configure Technical attributes')
  const [configuredLocationIds, setConfiguredLocationIds] = useState(new Set())
  const [hasConfigureChanges, setHasConfigureChanges] = useState(false)
  const [compareWithAsset, setCompareWithAsset] = useState(false)

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Card: Technical Attributes sub-tabs */}
      <div className="flex flex-col flex-1 min-h-0 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Page heading row - heading left, Compare with Asset toggle right (Configure page only) */}
        <div className="px-20 pt-4 pb-2 shrink-0 border-b border-gray-200 flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-airtel-red">
            {technicalSubTab === 'Configure Technical attributes'
              ? 'Configure Technical attributes'
              : 'Assign configurations to locations'}
          </h2>
          {technicalSubTab === 'Configure Technical attributes' && (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-800">Compare with Asset</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={compareWithAsset}
                  onClick={() => setCompareWithAsset(!compareWithAsset)}
                  className={`relative inline-flex h-5 w-10 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-airtel-red/20 focus:ring-offset-1 ${compareWithAsset ? 'bg-airtel-red' : 'bg-gray-300'}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform ${compareWithAsset ? 'translate-x-5' : 'translate-x-0.5'}`}
                  />
                </button>
              </div>
              <span className="text-[10px] text-gray-500 mt-0.5">{compareWithAsset ? 'Active' : 'Inactive'}</span>
            </div>
          )}
        </div>

        {/* Page content - extra pb when Technical Attributes footer is shown */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-20">
          <div className="text-sm text-gray-600">
            {technicalSubTab === 'Configure Technical attributes' && (
              <div className="px-16">
                <ConfigureTechnicalAttributesContent onDirtyChange={setHasConfigureChanges} compareWithAsset={compareWithAsset} />
              </div>
            )}
            {technicalSubTab === 'Assign configurations to locations' && (
              <LocationsTabContent
                configuredLocationIds={configuredLocationIds}
                onMarkLocationsConfigured={(ids) => setConfiguredLocationIds((prev) => new Set([...prev, ...ids]))}
                onSelectionChange={() => {}}
                successBannerVariant="technicalEnrichment"
              />
            )}
          </div>
        </div>

        {/* Footer - fixed when full page; shrink-0 when in modal (stays visible on both tabs) */}
        <div className={`flex flex-wrap items-center justify-between gap-2 p-4 border-t border-gray-200 bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.08)] shrink-0 ${embedInModal ? '' : 'fixed bottom-0 left-0 right-0 z-50'}`}>
            <button
              type="button"
              onClick={() => technicalSubTab === 'Assign configurations to locations' && setTechnicalSubTab('Configure Technical attributes')}
              disabled={technicalSubTab === 'Configure Technical attributes'}
              className={technicalSubTab === 'Configure Technical attributes'
                ? 'px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-500 text-xs font-medium cursor-not-allowed'
                : 'px-4 py-2 rounded-md border border-gray-300 bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg'}
            >
              Back
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (hasConfigureChanges) {
                    setHasConfigureChanges(false)
                    setTechnicalSubTab('Assign configurations to locations')
                  }
                }}
                disabled={technicalSubTab !== 'Configure Technical attributes' || !hasConfigureChanges}
                className={(technicalSubTab !== 'Configure Technical attributes' || !hasConfigureChanges)
                  ? 'px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-500 text-xs font-medium cursor-not-allowed'
                  : 'px-4 py-2 rounded-md border border-gray-300 bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg'}
              >
                Update & Continue
              </button>
              <button
                type="button"
                onClick={() => onClose?.()}
                disabled={technicalSubTab === 'Configure Technical attributes' || configuredLocationIds.size === 0}
                className={(technicalSubTab === 'Configure Technical attributes' || configuredLocationIds.size === 0)
                  ? 'px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-500 text-xs font-medium cursor-not-allowed'
                  : 'px-4 py-2 rounded-md bg-airtel-red text-white text-xs font-medium hover:opacity-90'}
              >
                Save
              </button>
            </div>
          </div>
      </div>
    </div>
  )
}
