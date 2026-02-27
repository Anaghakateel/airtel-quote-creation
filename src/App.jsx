import { useState, useRef, useCallback } from 'react'
import Header from './components/Header'
import QuoteSection from './components/QuoteSection'
import TabsSection from './components/TabsSection'
import DataTableSection from './components/DataTableSection'
import LocationsTabContent from './components/LocationsTabContent'
import SummaryTabContent from './components/SummaryTabContent'
import FooterActions from './components/FooterActions'
import AccountsPage from './components/AccountsPage'

const AGENTFORCE_QUOTE_RESTORE_KEY = 'airtel_esm_agentforce_quote_restore'

function getStoredQuoteRestore() {
  try {
    const s = localStorage.getItem(AGENTFORCE_QUOTE_RESTORE_KEY)
    if (!s) return null
    const j = JSON.parse(s)
    if (j?.tab === 'Quote' && j?.panelOpen === true) return j
    return null
  } catch (_) {
    return null
  }
}

function App() {
  const quoteActionsRef = useRef({})
  const [extractedRecordCount, setExtractedRecordCount] = useState(5000)
  const [validationComplete, setValidationComplete] = useState(false)
  const [validatedRecordCount, setValidatedRecordCount] = useState(0) // number of validated records (for "Continue with Valid Records")
  const [validatedRecordIds, setValidatedRecordIds] = useState(() => new Set()) // IDs of validated rows (for Continue with Valid Records)
  const [selectedRecordCount, setSelectedRecordCount] = useState(0)
  const [selectedRecordIds, setSelectedRecordIds] = useState(() => new Set()) // IDs of selected rows (for Continue with Selected)
  const [continuedRecordIds, setContinuedRecordIds] = useState(() => new Set()) // IDs of rows moved to Locations; hidden in Extracted Information
  const [validationByRowId, setValidationByRowId] = useState(null) // { [id]: { valid, reasoning? } } so Data Reasoning is prefilled when returning to tab
  const [validationResult, setValidationResult] = useState(null) // { validatedCount, totalCount }
  const [activeTab, setActiveTab] = useState('Extracted Information')
  const [addressValidationInProgress, setAddressValidationInProgress] = useState(false)
  const [summaryLoadingInProgress, setSummaryLoadingInProgress] = useState(false)
  const [locationsData, setLocationsData] = useState([])
  // Locations tab gets data after Continue from Extracted Information; Summary tab gets data after Continue from Locations
  const [locationsForDownstreamTabs, setLocationsForDownstreamTabs] = useState([])
  const [locationsForSummaryTab, setLocationsForSummaryTab] = useState([]) // populated only when user clicks Continue on Locations tab
  const [summaryTotals, setSummaryTotals] = useState({ oneTimeTotal: 0, monthlyTotal: 0, quoteTotal: 0 })
  const [currentPage, setCurrentPage] = useState(() => {
    const stored = getStoredQuoteRestore()
    return stored?.tab === 'Quote' ? 'Quote' : 'Accounts'
  })

  const activeNavTab = currentPage === 'Accounts' ? 'Accounts' : 'Quote'
  const onNavClick = (label) => {
    if (label === 'Quote' || label === 'Accounts') setCurrentPage(label)
  }

  const handleContinueWithSelected = useCallback(() => {
    setContinuedRecordIds((prev) => new Set([...prev, ...selectedRecordIds]))
    setLocationsForDownstreamTabs(locationsData)
    setExtractedRecordCount((prev) => Math.max(0, prev - selectedRecordCount))
    setAddressValidationInProgress(true)
    setTimeout(() => {
      setAddressValidationInProgress(false)
      setActiveTab('Locations')
    }, 2000)
  }, [locationsData, selectedRecordCount, selectedRecordIds])

  const handleContinueWithValidRecords = useCallback(() => {
    setContinuedRecordIds((prev) => new Set([...prev, ...validatedRecordIds]))
    setLocationsForDownstreamTabs(locationsData)
    setExtractedRecordCount((prev) => Math.max(0, prev - validatedRecordCount))
    setAddressValidationInProgress(true)
    setTimeout(() => {
      setAddressValidationInProgress(false)
      setActiveTab('Locations')
    }, 2000)
  }, [locationsData, validatedRecordCount, validatedRecordIds])

  const handleContinueToSummary = useCallback(() => {
    setLocationsForSummaryTab(locationsForDownstreamTabs)
    setSummaryLoadingInProgress(true)
    setTimeout(() => {
      setSummaryLoadingInProgress(false)
      setActiveTab('Summary')
    }, 2000)
  }, [locationsForDownstreamTabs])

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      <Header
        activeNavTab={activeNavTab}
        onNavClick={onNavClick}
        restoreQuoteAgentforceKey={AGENTFORCE_QUOTE_RESTORE_KEY}
        quoteActionsRef={quoteActionsRef}
      />
      <main className="flex-1 flex flex-col p-6 max-w-[1920px] w-full mx-auto pb-4 min-h-0">
        {currentPage === 'Quote' && (
          <>
            <QuoteSection
              oneTimeTotal={summaryTotals.oneTimeTotal}
              monthlyTotal={summaryTotals.monthlyTotal}
              quoteTotal={summaryTotals.quoteTotal}
            />
            <TabsSection
              extractedInfoCount={extractedRecordCount}
              locationsCount={locationsForDownstreamTabs.length}
              summaryCount={locationsForSummaryTab.length}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div className="flex-1 min-h-0 relative">
              {(addressValidationInProgress || summaryLoadingInProgress) && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-white/90" aria-live="polite">
                  <div className="flex gap-1" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {summaryLoadingInProgress ? 'Loading...' : 'Address Validation in progress...'}
                  </p>
                </div>
              )}
              {activeTab === 'Summary' ? (
                <SummaryTabContent locations={locationsForSummaryTab} onTotalsChange={setSummaryTotals} />
              ) : activeTab === 'Locations' ? (
                <LocationsTabContent locations={locationsForDownstreamTabs} />
              ) : (
                <DataTableSection
                  continuedRecordIds={continuedRecordIds}
                  validationByRowId={validationByRowId}
                  validationResult={validationResult}
                  onRecordCountChange={setExtractedRecordCount}
                  onValidationComplete={(validatedCount, validatedIds, validationState) => {
                    setValidationComplete(true)
                    setValidatedRecordCount(validatedCount ?? 0)
                    if (validatedIds) setValidatedRecordIds(validatedIds)
                    if (validationState) {
                      setValidationByRowId(validationState.validationByRowId ?? null)
                      setValidationResult(validationState.validationResult ?? null)
                    }
                  }}
                  onSelectionChange={setSelectedRecordCount}
                  onSelectedIdsChange={setSelectedRecordIds}
                  onLocationsData={setLocationsData}
                  quoteActionsRef={quoteActionsRef}
                />
              )}
            </div>
            {activeTab === 'Extracted Information' && (
              <FooterActions
                onValidate={() => quoteActionsRef.current?.runValidation?.()}
                validationComplete={validationComplete}
                hasSelection={selectedRecordCount > 0}
                onContinueWithSelected={handleContinueWithSelected}
                onContinueWithValidRecords={handleContinueWithValidRecords}
              />
            )}
            {activeTab === 'Locations' && (
              <div className="flex justify-end gap-2 mt-2 pt-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleContinueToSummary}
                  className="px-4 py-1.5 rounded-full text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            )}
          </>
        )}
        {currentPage === 'Accounts' && <AccountsPage />}
      </main>
    </div>
  )
}

export default App
