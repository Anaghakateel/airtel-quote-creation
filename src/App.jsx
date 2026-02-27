import { useState, useRef, useCallback } from 'react'
import Header from './components/Header'
import QuoteSection from './components/QuoteSection'
import emptystateImg from './components/emptystate.png'
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
  const [extractionInProgress, setExtractionInProgress] = useState(false)
  const [hasUpdatedQuoteNotification, setHasUpdatedQuoteNotification] = useState(false)
  const [showMatchedResults, setShowMatchedResults] = useState(false)
  const [showAttributesPrefilledNotification, setShowAttributesPrefilledNotification] = useState(false)
  const [revealMatchedResultsInProgress, setRevealMatchedResultsInProgress] = useState(false)
  const [hasUpdatedQuoteProposal2Notification, setHasUpdatedQuoteProposal2Notification] = useState(false)
  const [hasUpdatedQuoteProposal3Notification, setHasUpdatedQuoteProposal3Notification] = useState(false)
  const [hasUpdatedQuoteProposal4Notification, setHasUpdatedQuoteProposal4Notification] = useState(false)
  const [hasAttributesUpdatedNotification, setHasAttributesUpdatedNotification] = useState(false)
  const [showMatchAllOverlay, setShowMatchAllOverlay] = useState(false)
  const [showValidateOverlay, setShowValidateOverlay] = useState(false)
  const [showContinueValidOverlay, setShowContinueValidOverlay] = useState(false)
  const [showContinueSummaryOverlay, setShowContinueSummaryOverlay] = useState(false)
  const [attributesViewLoadingInProgress, setAttributesViewLoadingInProgress] = useState(false)

  const activeNavTab = currentPage === 'Accounts' ? 'Accounts' : 'Quote'
  const onNavClick = (label) => {
    if (label === 'Quote' || label === 'Accounts') setCurrentPage(label)
  }
  const onNavigateToQuoteExtractedInfo = useCallback(() => {
    setCurrentPage('Quote')
    setActiveTab('Extracted Information')
    setExtractionInProgress(true)
    setTimeout(() => setExtractionInProgress(false), 2000)
  }, [])

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
    setHasUpdatedQuoteProposal3Notification(true)
    setShowContinueValidOverlay(true)
    setContinuedRecordIds((prev) => new Set([...prev, ...validatedRecordIds]))
    setLocationsForDownstreamTabs(locationsData)
    setExtractedRecordCount((prev) => Math.max(0, prev - validatedRecordCount))
  }, [locationsData, validatedRecordCount, validatedRecordIds])

  const handleContinueToSummary = useCallback(() => {
    setHasUpdatedQuoteProposal4Notification(true)
    setShowContinueSummaryOverlay(true)
    setLocationsForSummaryTab(locationsForDownstreamTabs)
  }, [locationsForDownstreamTabs])

  const onRevealComplete = useCallback(() => {
    setRevealMatchedResultsInProgress(false)
    setShowMatchedResults(true)
    setShowAttributesPrefilledNotification(true)
  }, [])

  const onNavigateToUpdatedQuote = useCallback(() => {
    setHasUpdatedQuoteNotification(false)
    setShowMatchAllOverlay(false)
    setRevealMatchedResultsInProgress(true)
    setCurrentPage('Quote')
    setActiveTab('Extracted Information')
  }, [])

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      <Header
        activeNavTab={activeNavTab}
        onNavClick={onNavClick}
        onNavigateToQuoteExtractedInfo={onNavigateToQuoteExtractedInfo}
        onNavigateToUpdatedQuote={onNavigateToUpdatedQuote}
        updatedQuoteNotification={hasUpdatedQuoteNotification}
        updatedQuoteProposal2Notification={hasUpdatedQuoteProposal2Notification}
        onNavigateToUpdatedQuote2={() => {
          setHasUpdatedQuoteProposal2Notification(false)
          setShowValidateOverlay(false)
          setCurrentPage('Quote')
          setActiveTab('Extracted Information')
          setTimeout(() => quoteActionsRef.current?.runValidation?.(), 0)
        }}
        updatedQuoteProposal3Notification={hasUpdatedQuoteProposal3Notification}
        updatedQuoteProposal4Notification={hasUpdatedQuoteProposal4Notification}
        onNavigateToUpdatedQuote3={() => {
          setHasUpdatedQuoteProposal3Notification(false)
          setShowContinueValidOverlay(false)
          setCurrentPage('Quote')
          setSummaryLoadingInProgress(true)
          setTimeout(() => {
            setSummaryLoadingInProgress(false)
            setActiveTab('Locations')
          }, 2000)
        }}
        onNavigateToUpdatedQuote4={() => {
          setHasUpdatedQuoteProposal4Notification(false)
          setShowContinueSummaryOverlay(false)
          setCurrentPage('Quote')
          setSummaryLoadingInProgress(true)
          setTimeout(() => {
            setSummaryLoadingInProgress(false)
            setActiveTab('Summary')
          }, 2000)
        }}
        attributesUpdatedNotification={hasAttributesUpdatedNotification}
        onAttributesUpdated={() => setHasAttributesUpdatedNotification(true)}
        onNavigateToAttributesUpdatedView={(productName) => {
          setHasAttributesUpdatedNotification(false)
          setCurrentPage('Quote')
          setActiveTab('Extracted Information')
          if (productName != null && productName !== '') {
            setAttributesViewLoadingInProgress(true)
            setTimeout(() => {
              setAttributesViewLoadingInProgress(false)
              quoteActionsRef.current?.setRequestedProductFilter?.(productName)
            }, 1000)
          }
        }}
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
              {showMatchAllOverlay && currentPage === 'Quote' && activeTab === 'Extracted Information' && (
                <div className="absolute inset-0 z-20 bg-black/20 pointer-events-auto" aria-hidden="true" />
              )}
              {showValidateOverlay && currentPage === 'Quote' && activeTab === 'Extracted Information' && (
                <div className="absolute inset-0 z-20 bg-white/40 pointer-events-auto" aria-hidden="true" />
              )}
              {showContinueValidOverlay && currentPage === 'Quote' && activeTab === 'Extracted Information' && (
                <div className="absolute inset-0 z-20 bg-white/40 pointer-events-auto" aria-hidden="true" />
              )}
              {showContinueSummaryOverlay && currentPage === 'Quote' && activeTab === 'Locations' && (
                <div className="absolute inset-0 z-20 bg-white/40 pointer-events-auto" aria-hidden="true" />
              )}
              {(addressValidationInProgress || summaryLoadingInProgress || attributesViewLoadingInProgress) && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-white/90" aria-live="polite">
                  <div className="flex gap-1" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Data is getting validated</p>
                </div>
              )}
              {activeTab === 'Summary' ? (
                <SummaryTabContent locations={locationsForSummaryTab} onTotalsChange={setSummaryTotals} />
              ) : activeTab === 'Locations' ? (
                <LocationsTabContent locations={locationsForDownstreamTabs} />
              ) : extractionInProgress ? (
                <div className="flex flex-col items-center justify-center flex-1 min-h-0 w-full bg-white rounded-lg border border-gray-100 shadow-sm absolute inset-0">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <img src={emptystateImg} alt="" className="w-40 h-auto object-contain" />
                    <p className="text-gray-700 font-bold">Data is getting extracted....</p>
                    <div className="flex gap-1" aria-hidden>
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
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
                  showMatchedResults={showMatchedResults}
                  onMatchValidationComplete={() => {
                    setHasUpdatedQuoteNotification(true)
                    setShowMatchedResults(false)
                    setShowMatchAllOverlay(true)
                  }}
                  showAttributesPrefilledNotification={showAttributesPrefilledNotification}
                  onDismissAttributesPrefilled={() => setShowAttributesPrefilledNotification(false)}
                  revealMatchedResultsInProgress={revealMatchedResultsInProgress}
                  onRevealComplete={onRevealComplete}
                />
              )}
            </div>
            {activeTab === 'Extracted Information' && !extractionInProgress && (
              <FooterActions
                onValidate={() => {
          setHasUpdatedQuoteProposal2Notification(true)
          setShowValidateOverlay(true)
        }}
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
