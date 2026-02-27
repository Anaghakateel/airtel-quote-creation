import { useState, useRef, useEffect } from 'react'
import agentforceIllustration from './agentforceillustration.png'
import agentforceIcon from './AgentforceIcon.png'

const PANEL_MIN_WIDTH = 288   // 18rem
const PANEL_MAX_WIDTH = 640   // 40rem
const PANEL_DEFAULT_WIDTH = 411 // 3.5x (reduced by 0.5x from 4x)

const CREATE_QUOTE_AGENT_MESSAGE = {
  id: 'create-quote-welcome',
  role: 'agent',
  text: 'Hi! I can assist you with that. You can upload the document directly. Would you like to proceed with uploading a document or another type of document?',
}

const UPLOAD_FORM_MESSAGE_ID = 'upload-doc-form'

const PROCESSING_COMPLETE_TEXT = 'Your file is being processed, you will be notified once done, or you can check the status here'

const VALIDATION_IN_PROGRESS_TEXT = 'Validation is in progress, you will be notified once done, or you can check the status here'

const ANALYZING_STAGES = [
  'Working',
  'Understanding your request',
  'Identifying Next Steps',
  'Finishing Up',
]

// Map user utterance to Quote page actions (only when activeNavTab === 'Quote' and quoteActionsRef is set)
function interpretQuoteUtterance(utterance, actions) {
  if (!utterance || typeof utterance !== 'string' || !actions || typeof actions.matchAllProducts !== 'function') {
    return { success: false, message: 'Quote actions are not available. Make sure you\'re on the Quote page.' }
  }
  const t = utterance.toLowerCase().trim()
  const words = t.split(/\s+/)

  if (
    /\bmatch\s+all\s*(products?)?\b/.test(t) ||
    t === 'match all' ||
    /\bmatching\s+of\s+products?\b/.test(t) ||
    /\bmatch\s+(all\s+)?products?\b/.test(t)
  ) {
    actions.matchAllProducts()
    return { success: true, message: VALIDATION_IN_PROGRESS_TEXT }
  }

  if (/\bclear\s*filters?\b/.test(t) || /\breset\s*filters?\b/.test(t)) {
    actions.clearFilters?.()
    return { success: true, message: 'All filters have been cleared.' }
  }

  if (/\bview\s+by\s+all\b/.test(t) || /\bgroup\s+by\s+all\b/.test(t)) {
    actions.setViewByValue?.('All')
    return { success: true, message: 'View By is set to All.' }
  }
  if (/\bview\s+by\s+(requested\s+)?products?\b/.test(t) || /\bgroup\s+by\s+(requested\s+)?products?\b/.test(t)) {
    actions.setViewByValue?.('Requested Products')
    return { success: true, message: 'View By is set to Requested Products.' }
  }
  if (/\bview\s+by\s+technology\b/.test(t) || /\bgroup\s+by\s+technology\b/.test(t)) {
    actions.setViewByValue?.('Technology')
    return { success: true, message: 'View By is set to Technology.' }
  }

  if (/\bfilter\s*(by)?\s*matching\s*status\s*(to\s*)?(partial|done|pending)\b/.test(t)) {
    const m = t.match(/(partial|done|pending)/)
    const status = m ? m[1].charAt(0).toUpperCase() + m[1].slice(1) : null
    if (status) { actions.setMatchingStatusFilter?.(status); return { success: true, message: `Filter set to Matching Status: ${status}.` } }
  }
  if (/\bmatching\s*status\s*(partial|done|pending)\b/.test(t)) {
    const m = t.match(/(partial|done|pending)/)
    const status = m ? m[1].charAt(0).toUpperCase() + m[1].slice(1) : null
    if (status) { actions.setMatchingStatusFilter?.(status); return { success: true, message: `Filter set to Matching Status: ${status}.` } }
  }

  // Any utterance related to "Attribute" MUST be checked before "filter by product" so "Change attribute for MPLS" shows attributes, not filter
  const attributeProductMatch = t.match(/(mpls|sd\s*wan|internet)/i)
  const mentionsAttribute = /\battributes?\b/.test(t) || /\battribute\s+/.test(t)
  if (mentionsAttribute && actions.getProductAttributes) {
    let product = attributeProductMatch
      ? attributeProductMatch[1].replace(/\s+/g, ' ').trim().toLowerCase()
      : 'mpls'
    product = product === 'sd wan' ? 'SD WAN' : product === 'mpls' ? 'MPLS' : product === 'internet' ? 'Internet' : product
    const data = actions.getProductAttributes(product)
    if (data && data.attributes) {
      const preSelectedValues = {}
      Object.entries(data.attributes).forEach(([attrName, values]) => {
        const opts = Array.isArray(values) ? values : [values]
        preSelectedValues[attrName] = opts[0] ?? ''
      })
      return {
        success: true,
        message: `Attributes for ${data.productName}:`,
        showAttributesBulletList: true,
        productName: data.productName,
        attributes: data.attributes,
        preSelectedValues,
      }
    }
    if (attributeProductMatch) {
      return { success: false, message: `No attributes found for product "${product}". Valid products are: MPLS, SD WAN, Internet.` }
    }
  }

  if (/\bfilter\s*(by)?\s*requested\s*product(s)?\s*(to\s*)?(mpls|sd\s*wan|internet)\b/.test(t) || /\b(show\s+only\s+)?(mpls|sd\s*wan|internet)\b/.test(t)) {
    const m = t.match(/(mpls|sd\s*wan|internet)/)
    let product = m ? m[1].replace(/\s+/, ' ') : null
    if (product === 'sd wan') product = 'SD WAN'
    else if (product === 'mpls') product = 'MPLS'
    else if (product === 'internet') product = 'Internet'
    if (product) { actions.setRequestedProductFilter?.(product); return { success: true, message: `Filter set to Requested Product: ${product}.` } }
  }

  if (/\bfilter\s*(by)?\s*confidence\s*(\d+)\s*[-–]\s*(\d+)\b/.test(t) || /\bconfidence\s*(\d+)\s*[-–]\s*(\d+)\b/.test(t)) {
    const m = t.match(/(\d+)\s*[-–]\s*(\d+)/)
    if (m) {
      const a = parseInt(m[1], 10)
      const b = parseInt(m[2], 10)
      const map = { '0-29': 'below30', '30-49': '30-50', '50-69': '50-70', '70-85': '70-85', '86-100': 'above85' }
      const key = `${a}-${b}` in map ? `${a}-${b}` : (a < 30 && b <= 29 ? 'below30' : a >= 30 && a < 50 ? '30-50' : a >= 50 && a < 70 ? '50-70' : a >= 70 && a <= 85 ? '70-85' : 'above85')
      const value = map[key] || (key === '50-70' ? '50-70' : key === '30-50' ? '30-50' : key === '70-85' ? '70-85' : key === 'below30' ? 'below30' : 'above85')
      actions.setConfidenceLevelFilter?.(value)
      return { success: true, message: `Filter set to Confidence Level: ${value}.` }
    }
  }

  if (/\b(update|set|change)\s*postal\s*code\s*(to\s*)?(\d{5,6})\b/.test(t) || /\bpostal\s*code\s*(to\s*)?(\d{5,6})\b/.test(t)) {
    const m = t.match(/(\d{5,6})/)
    if (m) {
      const applied = actions.applyBulkPostalCode?.(m[1])
      return { success: !!applied, message: applied ? `Postal code updated to ${m[1]} for selected rows.` : 'No rows selected. Select rows first, then ask to update postal code.' }
    }
  }

  if (/\bview\s*selected\s*(only)?\b/.test(t) || /\bshow\s*selected\s*(only)?\b/.test(t)) {
    actions.setViewSelectedOnly?.(true)
    return { success: true, message: 'Showing only selected records.' }
  }
  if (/\bshow\s*all\s*records?\b/.test(t) || /\bview\s*all\b/.test(t)) {
    actions.setViewSelectedOnly?.(false)
    return { success: true, message: 'Showing all records.' }
  }

  if (/\bsearch\s+(?:for\s+)?(.+)/.test(t)) {
    const m = t.match(/search\s+(?:for\s+)?(.+)/)
    const term = m ? m[1].trim() : ''
    if (term) { actions.setSearchFilter?.(term); return { success: true, message: `Search applied for "${term}".` } }
  }

  return { success: false, message: 'I didn\'t understand that. Try "Match all products", "Matching of products", "Match products", "Show attributes of product (SD WAN)", "Filter by matching status Partial", "View by Requested Products", "Clear filters", or "Update postal code to 500032" (after selecting rows).' }
}

// Parse follow-up utterance after attributes were shown as bullets: e.g. "Managed SD Wan, On premises, Cisco Meraki"
function interpretAttributeChange(text, context, actions) {
  if (!text || !context || !actions?.applyBulkAttributes) return null
  const { productName, attributes, preSelectedValues } = context
  if (!attributes || !preSelectedValues) return null
  const tNorm = text.toLowerCase().trim().replace(/-/g, ' ')
  const newValues = { ...preSelectedValues }
  let changed = false
  for (const [attrName, options] of Object.entries(attributes)) {
    const opts = Array.isArray(options) ? options : [options]
    for (const opt of opts) {
      const optStrNorm = String(opt).toLowerCase().replace(/-/g, ' ')
      const match = tNorm.includes(optStrNorm) || (optStrNorm.includes('(') && tNorm.includes(optStrNorm.split('(')[0].trim()))
      if (match) {
        newValues[attrName] = opt
        changed = true
        break
      }
    }
  }
  if (!changed) return null
  const result = actions.applyBulkAttributes(productName, newValues, true)
  return { success: true, message: result?.message ?? 'Attributes updated successfully.' }
}

function AgentforceSidePanel({ open, onClose, onAnalysisComplete, onNavigateToQuote, onNavigateToUpdatedQuote, onAttributesUpdated, onNavigateToQuoteView, initialRestoreSnapshot, onPanelStateChange, quoteActionsRef, activeNavTab }) {
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT_WIDTH)
  const [isPinned, setIsPinned] = useState(false)
  const [isConversationView, setIsConversationView] = useState(false)
  const [messages, setMessages] = useState([])
  const [hasNotification, setHasNotification] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [attributesFormValuesByMessageId, setAttributesFormValuesByMessageId] = useState({})
  const chatEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const uploadFormFileInputRef = useRef(null)
  const [uploadFormFile, setUploadFormFile] = useState(null) // file selected in the in-chat "Upload Files" form
  const analyzingIntervalRef = useRef(null)
  const dragRef = useRef({ startX: 0, startWidth: 0 })
  const hasAppliedRestoreRef = useRef(false)

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { if (messages.length) scrollToBottom() }, [messages.length])

  // When opening from Quote page with a snapshot, show it immediately (before useEffect) to avoid welcome-screen flash
  const effectiveMessages = open && initialRestoreSnapshot?.messages?.length && messages.length === 0
    ? initialRestoreSnapshot.messages
    : messages
  const effectiveIsConversationView = open && initialRestoreSnapshot?.messages?.length && messages.length === 0
    ? !!initialRestoreSnapshot.isConversationView
    : isConversationView

  // Reset restore flag when panel closes so next open can apply snapshot again (e.g. open from Quote page)
  useEffect(() => {
    if (!open) hasAppliedRestoreRef.current = false
  }, [open])

  // Restore from persisted "Quote" snapshot or "Extraction complete" when opening from Quote page
  useEffect(() => {
    if (!open || !initialRestoreSnapshot || hasAppliedRestoreRef.current) return
    hasAppliedRestoreRef.current = true
    const s = initialRestoreSnapshot
    if (s.isConversationView != null) setIsConversationView(!!s.isConversationView)
    if (Array.isArray(s.messages) && s.messages.length > 0) setMessages(s.messages)
    if (s.hasNotification != null) setHasNotification(!!s.hasNotification)
    onPanelStateChange?.({ isConversationView: !!s.isConversationView, messages: s.messages || [], hasNotification: !!s.hasNotification })
  }, [open, initialRestoreSnapshot, onPanelStateChange])

  // Report state to parent for persistence (Quote tab + panel open)
  useEffect(() => {
    if (!open) return
    onPanelStateChange?.({ isConversationView, messages, hasNotification })
  }, [open, isConversationView, messages, hasNotification, onPanelStateChange])

  const startConversation = () => {
    setIsConversationView(true)
    setMessages([CREATE_QUOTE_AGENT_MESSAGE])
    setHasNotification(false)
  }

  const goBackToWelcome = () => {
    if (analyzingIntervalRef.current) clearInterval(analyzingIntervalRef.current)
    analyzingIntervalRef.current = null
    setIsConversationView(false)
    setMessages([])
    setHasNotification(false)
  }

  // Detect "Yes" / proceed (after PO upload question) – show upload form in chat
  const isYesIntent = (t) => {
    const s = (t || '').toLowerCase().trim()
    return /^\s*(yes|yeah|yep|sure|ok|okay|proceed|please|i would|i\'d like)\s*\.?!?\s*$/i.test(s) || s === 'yes' || s === 'yeah' || s === 'sure' || s === 'proceed'
  }

  // Detect if user is asking to create a quote (from welcome screen) – same outcome as clicking "Create a quote" button
  const isCreateQuoteIntent = (t) => {
    const s = (t || '').toLowerCase().trim()
    return (
      /\bcreate\s*(a)?\s*quote\b/.test(s) ||
      /\bcreating\s*(a)?\s*quote\b/.test(s) ||
      /\bquote\s*creation\b/.test(s) ||
      /\bwant\s+to\s+create\s*(a)?\s*quote\b/.test(s) ||
      /\bwould\s+like\s+to\s+create\s*(a)?\s*quote\b/.test(s) ||
      /\bhelp\s+me\s+create\s*(a)?\s*quote\b/.test(s) ||
      /\bi\s+want\s+(a)?\s*quote\b/.test(s) ||
      s === 'create quote' || s === 'creating a quote' || s === 'create a quote'
    )
  }

  const sendChatMessage = () => {
    const text = (chatInput || '').trim()
    if (!text) return
    setChatInput('')

    // From welcome screen: any utterance (or "Create a quote" button) → show assist/upload prompt, then same flow
    if (!isConversationView) {
      setIsConversationView(true)
      setMessages([
        { id: `user-${Date.now()}`, role: 'user', text },
        CREATE_QUOTE_AGENT_MESSAGE,
      ])
      return
    }

    // After "Would you like to proceed with uploading a PO document?" → user says Yes → show upload form in chat
    const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null
    if (lastMsg?.id === CREATE_QUOTE_AGENT_MESSAGE.id && isYesIntent(text)) {
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, role: 'user', text },
        { id: UPLOAD_FORM_MESSAGE_ID, role: 'agent', text: 'Upload document', showUploadForm: true },
      ])
      return
    }

    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: 'user', text }])
    if (!isConversationView) setIsConversationView(true)

    const actions = activeNavTab === 'Quote' && quoteActionsRef?.current ? quoteActionsRef.current : null
    const lastAgentMsg = [...messages].reverse().find((m) => m.role === 'agent' && (m.attributesForm || m.showAttributesBulletList))
    const attributesContext = lastAgentMsg?.attributesForm || (lastAgentMsg?.showAttributesBulletList && lastAgentMsg?.productName ? { productName: lastAgentMsg.productName, attributes: lastAgentMsg.attributes, preSelectedValues: lastAgentMsg.preSelectedValues } : null)
    const attributeResult = attributesContext ? interpretAttributeChange(text, attributesContext, actions) : null
    if (attributeResult?.success) {
      const productName = attributesContext.productName
      onAttributesUpdated?.()
      setMessages((prev) => [...prev, {
        id: `agent-${Date.now()}`,
        role: 'agent',
        text: `Changes for required product ${productName} have been successfully incorporated.`,
        showAttributesSuccessLink: true,
        productName,
      }])
      return
    }

    const result = interpretQuoteUtterance(text, actions)
    const agentId = `agent-${Date.now()}`
    const newMsg = {
      id: agentId,
      role: 'agent',
      text: result.message,
      ...(result.showAttributesForm && {
        attributesForm: {
          productName: result.productName,
          attributes: result.attributes,
          preSelectedValues: result.preSelectedValues,
        },
      }),
      ...(result.showAttributesBulletList && {
        showAttributesBulletList: true,
        productName: result.productName,
        attributes: result.attributes,
        preSelectedValues: result.preSelectedValues,
        attributesForm: {
          productName: result.productName,
          attributes: result.attributes,
          preSelectedValues: result.preSelectedValues,
        },
      }),
    }
    setMessages((prev) => [...prev, newMsg])
  }

  // Run analysis after in-chat "Upload Files" + "Submit" (adds "Uploaded document (name)" then analyzing stages)
  const runAnalysisAfterUpload = (displayName) => {
    setUploadFormFile(null)
    if (uploadFormFileInputRef.current) uploadFormFileInputRef.current.value = ''
    setMessages((prev) => [
      ...prev,
      { id: `upload-${Date.now()}`, role: 'user', text: `Uploaded document (${displayName})` },
    ])
    if (analyzingIntervalRef.current) clearInterval(analyzingIntervalRef.current)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `analyzing-${Date.now()}`, role: 'agent', text: ANALYZING_STAGES[0], isAnalyzing: true, analyzingStage: 0 },
      ])
      let step = 0
      analyzingIntervalRef.current = setInterval(() => {
        step += 1
        if (step < ANALYZING_STAGES.length) {
          setMessages((prev) =>
            prev.map((m) =>
              m.isAnalyzing && m.analyzingStage !== undefined
                ? { ...m, text: ANALYZING_STAGES[step], analyzingStage: step }
                : m
            )
          )
        } else {
          if (analyzingIntervalRef.current) clearInterval(analyzingIntervalRef.current)
          analyzingIntervalRef.current = null
          setMessages((prev) =>
            prev.map((m) => (m.isAnalyzing ? { ...m, isAnalyzing: false, text: PROCESSING_COMPLETE_TEXT } : m))
          )
          setHasNotification(true)
          onAnalysisComplete?.()
        }
      }, 1500)
    }, 1000)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const name = file.name || 'document.pdf'
    const displayName = name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`
    setMessages((prev) => [
      ...prev,
      { id: `upload-${Date.now()}`, role: 'user', text: `Uploaded "${displayName}"`, fileName: name },
    ])
    e.target.value = ''
    if (analyzingIntervalRef.current) clearInterval(analyzingIntervalRef.current)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `analyzing-${Date.now()}`, role: 'agent', text: ANALYZING_STAGES[0], isAnalyzing: true, analyzingStage: 0 },
      ])
      let step = 0
      analyzingIntervalRef.current = setInterval(() => {
        step += 1
        if (step < ANALYZING_STAGES.length) {
          setMessages((prev) =>
            prev.map((m) =>
              m.isAnalyzing && m.analyzingStage !== undefined
                ? { ...m, text: ANALYZING_STAGES[step], analyzingStage: step }
                : m
            )
          )
        } else {
          if (analyzingIntervalRef.current) clearInterval(analyzingIntervalRef.current)
          analyzingIntervalRef.current = null
          setMessages((prev) =>
            prev.map((m) => (m.isAnalyzing ? { ...m, isAnalyzing: false, text: PROCESSING_COMPLETE_TEXT } : m))
          )
          setHasNotification(true)
          onAnalysisComplete?.()
        }
      }, 1500)
    }, 1000)
  }

  const handleResizeMouseDown = (e) => {
    if (isPinned) return
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = { startX: e.clientX, startWidth: panelWidth }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const onMouseMove = (e) => {
      const { startX, startWidth } = dragRef.current
      const delta = startX - e.clientX
      const newWidth = Math.min(PANEL_MAX_WIDTH, Math.max(PANEL_MIN_WIDTH, startWidth + delta))
      setPanelWidth(newWidth)
    }
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  if (!open) return null

  return (
      <aside
        className="fixed top-[7rem] right-0 bottom-0 bg-gray-100 border-l border-gray-200 shadow-xl z-50 flex flex-col"
        style={{ width: panelWidth, maxWidth: '90vw' }}
        aria-label="Agentforce panel"
      >
        {/* Resize handle: center-left, solid blue left-pointing arrow; when pinned, width is locked */}
        <div
          role="button"
          tabIndex={isPinned ? -1 : 0}
          onMouseDown={handleResizeMouseDown}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.preventDefault() }}
          className={`absolute left-0 top-1/2 -translate-y-1/2 py-3 px-1 flex items-center justify-center focus:outline-none focus:ring-0 z-[60] ${isPinned ? 'cursor-default opacity-60' : 'cursor-col-resize'}`}
          aria-label={isPinned ? 'Panel width locked' : 'Resize panel'}
        >
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 12L18 4v16L6 12z" />
          </svg>
        </div>
        {/* Header: left = Agentforce + information; right = Chat history, Pin, Close (dark blue icons) */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-[#032d60]">Agentforce</span>
            <button
              type="button"
              className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 focus:outline-none shrink-0"
              aria-label="Information"
            >
              <span className="text-xs font-bold">i</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setHasNotification(false)}
              className="relative p-1.5 rounded-full text-[#032d60] hover:bg-gray-100 focus:outline-none"
              aria-label="Chat history"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
                <circle cx="7.5" cy="10" r="1" />
                <circle cx="12" cy="10" r="1" />
                <circle cx="16.5" cy="10" r="1" />
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" d="M17.5 16.5L19 18M19 16.5L17.5 18" />
              </svg>
              {hasNotification && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsPinned((p) => !p)}
              className={`p-1.5 rounded-full focus:outline-none ${isPinned ? 'bg-blue-100 text-blue-600' : 'text-[#032d60] hover:bg-gray-100'}`}
              aria-label={isPinned ? 'Unpin panel width' : 'Pin panel width'}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-[#032d60] hover:bg-gray-100 focus:outline-none"
              aria-label="Close panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content: Welcome panel or Conversation panel */}
        {!effectiveIsConversationView ? (
          <div className="flex-1 min-h-0 overflow-y-auto pt-8 px-4 pb-4 flex flex-col items-center">
            <img
              src={agentforceIllustration}
              alt=""
              className="w-40 h-40 rounded-full object-cover object-center shrink-0"
            />
            <h2 className="text-lg font-bold text-[#032d60] mt-4">Let&apos;s Chat!</h2>
          <p className="text-sm text-gray-700 mt-2 text-center max-w-[85%]">
            Hi, I&apos;m Agentforce! I can do things like search for information, summarize records, and draft and revise emails. What can I help you with?
          </p>
            <div className="flex flex-col gap-2 w-full mt-6 max-w-[90%]">
              <button
                type="button"
                onClick={startConversation}
                className="flex items-center justify-between w-full px-6 py-4 rounded-full border border-gray-400 bg-white text-blue-600 text-sm font-medium hover:bg-gray-50"
              >
                &quot;Create a quote&quot;
                <span className="flex items-center shrink-0 py-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
              {['Summarise Account', 'Show related Opportunities'].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center justify-between w-full px-6 py-4 rounded-full border border-gray-400 bg-white text-blue-600 text-sm font-medium hover:bg-gray-50"
                >
                  &quot;{label}&quot;
                  <span className="flex items-center shrink-0 py-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col bg-white">
            {/* Conversation messages - scrollable, newest at bottom */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col justify-end gap-4">
              {effectiveMessages.map((msg) => (
                <div key={msg.id} className="flex gap-3 items-start">
                  {msg.role === 'agent' ? (
                    <>
                      <img src={agentforceIcon} alt="" className="w-9 h-9 rounded-full object-cover object-center shrink-0" />
                      <div className="flex-1 min-w-0">
                        {msg.text === PROCESSING_COMPLETE_TEXT && onNavigateToQuote ? (
                          <p className="text-sm text-gray-800 whitespace-pre-line">
                            Your file is being processed, you will be notified once done, or you can check the status{' '}
                            <button
                              type="button"
                              onClick={() => onNavigateToQuote()}
                              className="text-blue-600 underline hover:text-blue-800 focus:outline-none focus:underline"
                            >
                              here
                            </button>
                          </p>
                        ) : msg.text === VALIDATION_IN_PROGRESS_TEXT && onNavigateToUpdatedQuote ? (
                          <p className="text-sm text-gray-800 whitespace-pre-line">
                            Validation is in progress, you will be notified once done, or you can check the status{' '}
                            <button
                              type="button"
                              onClick={() => onNavigateToUpdatedQuote()}
                              className="text-blue-600 underline hover:text-blue-800 focus:outline-none focus:underline"
                            >
                              here
                            </button>
                          </p>
                        ) : msg.showAttributesSuccessLink && msg.productName && onNavigateToQuoteView ? (
                          <p className="text-sm text-gray-800 whitespace-pre-line">
                            Changes for required product {msg.productName} have been successfully incorporated. Click{' '}
                            <button
                              type="button"
                              onClick={() => onNavigateToQuoteView(msg.productName)}
                              className="text-blue-600 underline hover:text-blue-800 focus:outline-none focus:underline"
                            >
                              here
                            </button>
                            {' '}to see it
                          </p>
                        ) : (
                          <p className="text-sm text-gray-800 whitespace-pre-line">{msg.text}</p>
                        )}
                        {msg.showAttributesBulletList && msg.attributesForm && msg.attributesForm.attributes && (
                          <div className="mt-3 p-3 rounded-lg border border-gray-200 bg-gray-50/80">
                            <p className="text-xs font-semibold text-[#032d60] mb-2">Requested Product : {msg.attributesForm.productName}</p>
                            <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-800">
                              {Object.entries(msg.attributesForm.attributes).map(([attrName, options]) => {
                                const opts = Array.isArray(options) ? options : [options]
                                const currentValue = msg.attributesForm.preSelectedValues[attrName] ?? opts[0]
                                return (
                                  <li key={attrName}>
                                    <span className="font-medium">{attrName}:</span> {currentValue}
                                    <span className="text-gray-500 ml-1">(options: {opts.join(', ')})</span>
                                  </li>
                                )
                              })}
                            </ul>
                            <p className="text-xs text-gray-600 mt-2">Tell me which attributes you want to change, e.g. &quot;Change Service Type to Co-Managed&quot;.</p>
                          </div>
                        )}
                        {msg.attributesForm && msg.attributesForm.attributes && !msg.showAttributesBulletList && (
                          <div className="mt-3 p-3 rounded-lg border border-gray-200 bg-gray-50/80">
                            <p className="text-xs font-semibold text-[#032d60] mb-3">Requested Product : {msg.attributesForm.productName}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {Object.entries(msg.attributesForm.attributes).map(([attrName, options]) => {
                                const opts = Array.isArray(options) ? options : [options]
                                const currentValue = attributesFormValuesByMessageId[msg.id]?.[attrName] ?? msg.attributesForm.preSelectedValues[attrName] ?? opts[0]
                                return (
                                  <div key={attrName}>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">{attrName}</label>
                                    <select
                                      value={currentValue}
                                      onChange={(e) => {
                                        setAttributesFormValuesByMessageId((prev) => ({
                                          ...prev,
                                          [msg.id]: { ...(prev[msg.id] ?? msg.attributesForm.preSelectedValues), [attrName]: e.target.value },
                                        }))
                                      }}
                                      className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                      {opts.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                  </div>
                                )
                              })}
                            </div>
                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  const actions = quoteActionsRef?.current
                                  if (!actions?.applyBulkAttributes) return
                                  const currentValues = attributesFormValuesByMessageId[msg.id] ?? msg.attributesForm.preSelectedValues
                                  const result = actions.applyBulkAttributes(msg.attributesForm.productName, currentValues, true)
                                  setMessages((prev) => [...prev, { id: `agent-${Date.now()}`, role: 'agent', text: result.message }])
                                }}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        )}
                        {msg.isAnalyzing && (
                          <span className="inline-flex gap-1 mt-2" aria-hidden="true">
                            {[1, 2, 3].map((i) => (
                              <span key={i} className="w-1.5 h-1.5 rounded-sm bg-blue-600 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                          </span>
                        )}
                        {msg.showUploadForm && (
                          <div className="mt-3 space-y-3">
                            <p className="text-xs text-gray-700">* Upload PO Document</p>
                            <input
                              ref={uploadFormFileInputRef}
                              type="file"
                              accept=".pdf,.csv,.xlsx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                setUploadFormFile(file || null)
                              }}
                              aria-label="Upload PO document"
                            />
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-wrap items-center gap-2 bg-gray-50/50">
                              <button
                                type="button"
                                disabled={!!uploadFormFile}
                                onClick={() => !uploadFormFile && uploadFormFileInputRef.current?.click()}
                                className="px-4 py-2 rounded-lg border border-blue-600 bg-white text-blue-600 text-xs font-medium hover:bg-blue-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Upload Files
                              </button>
                              <span className="text-xs text-gray-500">Or drop files</span>
                            </div>
                            {uploadFormFile && (
                              <div className="mt-3">
                                <p className="text-xs font-semibold text-gray-800 mb-1">Uploaded Files:</p>
                                <ul className="list-none text-xs text-gray-700 space-y-0.5">
                                  <li className="flex items-center gap-1.5">
                                    <span className="text-gray-500" aria-hidden="true">•</span>
                                    {uploadFormFile.name || 'document'}
                                  </li>
                                </ul>
                              </div>
                            )}
                            <button
                              type="button"
                              disabled={!uploadFormFile}
                              onClick={() => uploadFormFile && runAnalysisAfterUpload(uploadFormFile.name || 'document')}
                              className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Submit
                            </button>
                            <div className="flex gap-2 mt-2">
                              <button type="button" className="p-1 text-blue-600 hover:bg-blue-50 rounded" aria-label="Thumbs up">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                              </button>
                              <button type="button" className="p-1 text-blue-600 hover:bg-blue-50 rounded" aria-label="Thumbs down">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>
                              </button>
                            </div>
                          </div>
                        )}
                        {!msg.isAnalyzing && msg.id === CREATE_QUOTE_AGENT_MESSAGE.id && !msg.showUploadForm && (
                          <div className="flex gap-2 mt-2">
                            <button type="button" className="p-1 text-blue-600 hover:bg-blue-50 rounded" aria-label="Thumbs up">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                            </button>
                            <button type="button" className="p-1 text-blue-600 hover:bg-blue-50 rounded" aria-label="Thumbs down">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>
                            </button>
                            <button type="button" className="p-1 text-blue-600 hover:bg-blue-50 rounded" aria-label="Copy or save">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </div>
                      <p className="text-sm text-gray-800 flex-1">{msg.text}</p>
                    </>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}

        {/* Input bar - "+" hidden when in-chat upload form is shown (upload via "Upload Files" in chat only) */}
        <div className="shrink-0 p-4 bg-white border-t border-gray-200">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileUpload}
            aria-label="Upload PDF"
          />
          <div className="flex items-end gap-2 rounded-lg border border-gray-300 bg-white pl-3 pr-2 py-3 min-h-[4.5rem]">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendChatMessage() } }}
              placeholder="Describe your task or ask a question... (e.g. Match all products, Filter by Partial)"
              className="flex-1 min-w-0 py-2 px-1 text-sm text-gray-800 placeholder-gray-500 focus:outline-none bg-transparent placeholder:text-gray-500"
              aria-label="Chat input"
            />
            <button
              type="button"
              onClick={() => sendChatMessage()}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 focus:outline-none shrink-0 mb-0.5"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
  )
}

export default AgentforceSidePanel
