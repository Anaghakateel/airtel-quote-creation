import { useState, useRef, useEffect } from 'react'
import agentforceIcon from './AgentforceIcon.png'
import AgentforceSidePanel from './AgentforceSidePanel'

function getStoredQuoteRestore(key) {
  if (!key) return null
  try {
    const s = localStorage.getItem(key)
    if (!s) return null
    const j = JSON.parse(s)
    if (j?.tab === 'Quote' && j?.panelOpen === true) return j
    return null
  } catch (_) {
    return null
  }
}

// Default "Quote" panel state (screenshot instant: Create a Quote flow after upload + extraction complete)
const DEFAULT_QUOTE_PANEL_SNAPSHOT = {
  isConversationView: true,
  messages: [
    { id: 'create-quote-welcome', role: 'agent', text: 'Hi! I can assist you with that. You can upload the document directly. Would you like to proceed with uploading a document or another type of document?' },
    { id: 'upload-quote', role: 'user', text: 'Uploaded "Quote Proposal Data.pdf"' },
    { id: 'extraction-done', role: 'agent', text: 'Your file is being processed, you will be notified once done, or you can check the status here' },
  ],
  hasNotification: true,
}

function Header({ activeNavTab = 'Quote', onNavClick, onNavigateToQuoteExtractedInfo, onNavigateToUpdatedQuote, updatedQuoteNotification = false, onNavigateToUpdatedQuote2, updatedQuoteProposal2Notification = false, onNavigateToUpdatedQuote3, updatedQuoteProposal3Notification = false, onNavigateToUpdatedQuote4, updatedQuoteProposal4Notification = false, attributesUpdatedNotification = false, onAttributesUpdated, onNavigateToAttributesUpdatedView, restoreQuoteAgentforceKey, quoteActionsRef }) {
  const stored = restoreQuoteAgentforceKey ? getStoredQuoteRestore(restoreQuoteAgentforceKey) : null
  const [agentforcePanelOpen, setAgentforcePanelOpen] = useState(!!(stored?.panelOpen))
  const [bellNotification, setBellNotification] = useState(false)
  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false)
  const panelStateRef = useRef(null)
  const notificationPopoverRef = useRef(null)

  useEffect(() => {
    if (!notificationPopoverOpen) return
    const handleClickOutside = (e) => {
      if (notificationPopoverRef.current && !notificationPopoverRef.current.contains(e.target)) {
        setNotificationPopoverOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notificationPopoverOpen])
  const hadRestoreFromStorageRef = useRef(!!(stored?.panelOpen))
  const initialRestoreSnapshotRef = useRef(
    stored?.snapshot && typeof stored.snapshot.isConversationView === 'boolean' && Array.isArray(stored.snapshot.messages)
      ? stored.snapshot
      : stored?.panelOpen
        ? DEFAULT_QUOTE_PANEL_SNAPSHOT
        : null
  )
  // When on Quote and opening the panel (not from refresh), show "Extraction is complete" instant
  const snapshotToPass =
    hadRestoreFromStorageRef.current ? initialRestoreSnapshotRef.current : (activeNavTab === 'Quote' && agentforcePanelOpen ? DEFAULT_QUOTE_PANEL_SNAPSHOT : null)

  useEffect(() => {
    if (restoreQuoteAgentforceKey && activeNavTab !== 'Quote') {
      try { localStorage.removeItem(restoreQuoteAgentforceKey) } catch (_) {}
    }
  }, [restoreQuoteAgentforceKey, activeNavTab])

  const navItems = [
    { label: 'Home', hasChevron: false },
    { label: 'Quote', hasChevron: true },
    { label: 'Contacts', hasChevron: true },
    { label: 'Service', hasChevron: true },
    { label: 'Sales', hasChevron: true },
    { label: 'Accounts', hasChevron: true },
    { label: 'Dashboards', hasChevron: true },
    { label: 'Reports', hasChevron: true },
    { label: 'More', hasChevron: true },
  ]

  return (
    <>
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[60]">
      {/* Top row: logo (left), search (center), utility icons (right) */}
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <div className="shrink-0 w-[120px]">
          <a href="/" className="inline-block focus:outline-none" aria-label="Airtel home">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/18/Airtel_logo.svg"
              alt="Airtel"
              className="h-8 w-auto object-contain object-left"
            />
          </a>
        </div>

        <div className="flex-1 flex justify-center max-w-xl mx-4">
          <div className="relative w-full">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-11 pr-5 py-2.5 border border-gray-300 rounded-full bg-white text-xs placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setAgentforcePanelOpen(true)}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
            aria-label="Agentforce"
          >
            <img src={agentforceIcon} alt="Agentforce" className="w-5 h-5 object-contain" />
          </button>
          <button type="button" className="flex items-center rounded-full overflow-hidden border border-gray-200 hover:bg-gray-50" aria-label="Favorites">
            <span className="p-2 bg-gray-50 border-r border-gray-200">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
            <span className="p-1.5 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          <button type="button" className="p-2 rounded-full text-gray-600 hover:bg-gray-100" aria-label="Add">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button type="button" className="p-2 rounded-full text-gray-600 hover:bg-gray-100" aria-label="Module">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 18l4-6 3 4 3-6 4 8H4z" />
            </svg>
          </button>
          <button type="button" className="p-2 rounded-full text-gray-600 hover:bg-gray-100" aria-label="Help">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button type="button" className="p-2 rounded-full text-gray-600 hover:bg-gray-100" aria-label="Settings">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <div className="relative" ref={notificationPopoverRef}>
            <button
              type="button"
              onClick={() => setNotificationPopoverOpen((prev) => !prev)}
              className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100"
              aria-label="Notifications"
              aria-expanded={notificationPopoverOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {(bellNotification || updatedQuoteNotification || updatedQuoteProposal2Notification || updatedQuoteProposal3Notification || updatedQuoteProposal4Notification || attributesUpdatedNotification) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true" />
              )}
            </button>
            {notificationPopoverOpen && (
              <div className="absolute right-0 top-full mt-1 z-[70] w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45" aria-hidden="true" />
                <div className="relative bg-white rounded-lg">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { setBellNotification(false); setNotificationPopoverOpen(false) }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        Mark all as read
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotificationPopoverOpen(false)}
                        className="p-1 rounded text-gray-500 hover:bg-gray-100"
                        aria-label="Close notifications"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-2">
                    {(() => {
                      const mostRecent = attributesUpdatedNotification ? 'attributes' : updatedQuoteProposal4Notification ? 'proposal4' : updatedQuoteProposal3Notification ? 'proposal3' : updatedQuoteProposal2Notification ? 'proposal2' : updatedQuoteNotification ? 'proposal1' : 'new'
                      const linkClass = (isRecent) => isRecent ? 'text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline text-left w-full' : 'text-sm font-semibold text-gray-400 hover:text-gray-600 text-left w-full'
                      const timeClass = (isRecent) => isRecent ? 'text-xs text-gray-600 mt-0.5' : 'text-xs text-gray-400 mt-0.5'
                      return (
                        <>
                    {attributesUpdatedNotification && (
                      <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                        <button
                          type="button"
                          onClick={() => {
                            onNavigateToAttributesUpdatedView?.()
                            setNotificationPopoverOpen(false)
                            setAgentforcePanelOpen(false)
                          }}
                          className={linkClass(mostRecent === 'attributes')}
                        >
                          Attributes updated
                        </button>
                        <p className={timeClass(mostRecent === 'attributes')}>Just now</p>
                      </div>
                    )}
                    {updatedQuoteProposal4Notification && (
                      <div className={`px-4 py-3 hover:bg-gray-50 ${(updatedQuoteProposal3Notification || attributesUpdatedNotification) ? 'border-b border-gray-100' : ''}`}>
                        <button
                          type="button"
                          onClick={() => {
                            onNavigateToUpdatedQuote4?.()
                            setNotificationPopoverOpen(false)
                            setAgentforcePanelOpen(false)
                          }}
                          className={linkClass(mostRecent === 'proposal4')}
                        >
                          Updated Quote Proposal 4
                        </button>
                        <p className={timeClass(mostRecent === 'proposal4')}>Just now</p>
                      </div>
                    )}
                    {(updatedQuoteProposal3Notification || updatedQuoteProposal4Notification) && (
                      <div className={`px-4 py-3 hover:bg-gray-50 ${updatedQuoteProposal4Notification ? 'border-b border-gray-100' : 'border-b border-gray-100'}`}>
                        <button
                          type="button"
                          onClick={() => {
                            onNavigateToUpdatedQuote3?.()
                            setNotificationPopoverOpen(false)
                            setAgentforcePanelOpen(false)
                          }}
                          className={linkClass(mostRecent === 'proposal3')}
                        >
                          Updated Quote Proposal 3
                        </button>
                        <p className={timeClass(mostRecent === 'proposal3')}>Just now</p>
                      </div>
                    )}
                    {(updatedQuoteProposal2Notification || updatedQuoteProposal3Notification || updatedQuoteProposal4Notification) && (
                      <div className={`px-4 py-3 hover:bg-gray-50 ${(updatedQuoteProposal3Notification || updatedQuoteProposal4Notification) ? 'border-b border-gray-100' : ''}`}>
                        <button
                          type="button"
                          onClick={() => {
                            onNavigateToUpdatedQuote2?.()
                            setNotificationPopoverOpen(false)
                            setAgentforcePanelOpen(false)
                          }}
                          className={linkClass(mostRecent === 'proposal2')}
                        >
                          Updated Quote Proposal 2
                        </button>
                        <p className={timeClass(mostRecent === 'proposal2')}>Just now</p>
                      </div>
                    )}
                    {(updatedQuoteNotification || updatedQuoteProposal2Notification || updatedQuoteProposal3Notification || updatedQuoteProposal4Notification || attributesUpdatedNotification) && (
                      <div className={`px-4 py-3 hover:bg-gray-50 ${updatedQuoteProposal2Notification ? 'border-b border-gray-100' : ''}`}>
                        <button
                          type="button"
                          onClick={() => {
                            onNavigateToUpdatedQuote?.()
                            setNotificationPopoverOpen(false)
                            setAgentforcePanelOpen(false)
                          }}
                          className={linkClass(mostRecent === 'proposal1')}
                        >
                          Updated Quote Proposal
                        </button>
                        <p className={timeClass(mostRecent === 'proposal1')}>Just now</p>
                      </div>
                    )}
                    <div className={`px-4 py-3 hover:bg-gray-50 ${(updatedQuoteNotification || updatedQuoteProposal2Notification || updatedQuoteProposal3Notification || updatedQuoteProposal4Notification || attributesUpdatedNotification) ? 'border-b border-gray-100' : ''} last:border-b-0`}>
                      <button
                        type="button"
                        onClick={() => {
                          onNavigateToQuoteExtractedInfo?.()
                          setNotificationPopoverOpen(false)
                          setBellNotification(false)
                          setAgentforcePanelOpen(false)
                        }}
                        className={linkClass(mostRecent === 'new')}
                      >
                        New Quote Proposal created
                      </button>
                      <p className={timeClass(mostRecent === 'new')}>15 seconds ago</p>
                    </div>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button type="button" className="p-1 rounded-full overflow-hidden hover:ring-2 hover:ring-gray-200 focus:outline-none" aria-label="User menu">
            <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center overflow-hidden border-2 border-amber-300">
              <svg className="w-6 h-6 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Second row: Global nav - App launcher + Sales Console, then nav links */}
      <div className="border-t border-gray-100 bg-white">
        <nav className="flex items-center gap-1 px-6 py-2 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0 mr-2">
            <button type="button" className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100" aria-label="App launcher">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
              </svg>
            </button>
            <span className="text-xs font-bold text-[#032d60]">Sales Console</span>
          </div>
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavClick?.(item.label)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${
                item.label === activeNavTab
                  ? 'text-[#0176d3] border-b-2 border-[#0176d3] pb-2 -mb-0.5 bg-transparent'
                  : 'text-[#032d60] hover:bg-gray-100'
              }`}
            >
              {item.label}
              {item.hasChevron && (
                <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
    <AgentforceSidePanel
        open={agentforcePanelOpen}
        quoteActionsRef={quoteActionsRef}
        activeNavTab={activeNavTab}
        onNavigateToQuote={() => {
          onNavigateToQuoteExtractedInfo?.()
          setAgentforcePanelOpen(false)
        }}
        onNavigateToUpdatedQuote={() => {
          onNavigateToUpdatedQuote?.()
          setAgentforcePanelOpen(false)
        }}
        onClose={() => {
          setAgentforcePanelOpen(false)
          if (restoreQuoteAgentforceKey && activeNavTab === 'Quote') {
            try { localStorage.removeItem(restoreQuoteAgentforceKey) } catch (_) {}
          }
        }}
        onAnalysisComplete={() => setBellNotification(true)}
        onAttributesUpdated={onAttributesUpdated}
        onNavigateToQuoteView={(productName) => {
          onNavigateToAttributesUpdatedView?.(productName)
          setAgentforcePanelOpen(false)
        }}
        initialRestoreSnapshot={snapshotToPass}
        onPanelStateChange={(snapshot) => {
          panelStateRef.current = snapshot
          if (restoreQuoteAgentforceKey && activeNavTab === 'Quote' && agentforcePanelOpen && snapshot) {
            try {
              localStorage.setItem(restoreQuoteAgentforceKey, JSON.stringify({
                tab: 'Quote',
                panelOpen: true,
                snapshot: { isConversationView: snapshot.isConversationView, messages: snapshot.messages || [], hasNotification: snapshot.hasNotification ?? false },
              }))
            } catch (_) {}
          }
        }}
      />
    </>
  )
}

export default Header
