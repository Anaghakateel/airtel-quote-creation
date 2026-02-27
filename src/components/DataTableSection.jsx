import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

// 50 streets/roads/areas across India (used to build 2500 unique locations)
const INDIAN_STREETS = [
  'MG Road', 'Park Street', 'Anna Salai', 'Linking Road', 'Brigade Road', 'FC Road', 'Connaught Place',
  'Jubilee Hills', 'Marine Drive', 'Commercial Street', 'T Nagar', 'Hauz Khas', 'Banjara Hills',
  'Indiranagar', 'Koramangala', 'Salt Lake', 'Andheri West', 'Adyar', 'Sector 17', 'Ballygunge',
  'Whitefield', 'Powai', 'Velachery', 'Karol Bagh', 'Gachibowli', 'Jayanagar', 'Salt Lake Sector V',
  'Bandra West', 'Nungambakkam', 'Saket', 'Madhapur', 'HSR Layout', 'New Town', 'OMR', 'Dwarka',
  'Kukatpally', 'Electronic City', 'Lajpat Nagar', 'Rajouri Garden', 'Nehru Place', 'Connaught Circus',
  'BTM Layout', 'Marathahalli', 'Silk Board', 'Hebbal', 'Malleshwaram', 'Shivaji Nagar', 'Gandhi Bazaar',
  'Jayanagar 4th Block', 'JP Nagar',
]

// 50 city–state pairs across India (different parts of the country)
const INDIAN_CITY_STATE = [
  { city: 'Bengaluru', state: 'Karnataka' }, { city: 'Kolkata', state: 'West Bengal' }, { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Mumbai', state: 'Maharashtra' }, { city: 'Pune', state: 'Maharashtra' }, { city: 'Hyderabad', state: 'Telangana' },
  { city: 'New Delhi', state: 'Delhi' }, { city: 'Chandigarh', state: 'Punjab' }, { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' }, { city: 'Lucknow', state: 'Uttar Pradesh' }, { city: 'Bhopal', state: 'Madhya Pradesh' },
  { city: 'Indore', state: 'Madhya Pradesh' }, { city: 'Coimbatore', state: 'Tamil Nadu' }, { city: 'Kochi', state: 'Kerala' },
  { city: 'Thiruvananthapuram', state: 'Kerala' }, { city: 'Nagpur', state: 'Maharashtra' }, { city: 'Surat', state: 'Gujarat' },
  { city: 'Vadodara', state: 'Gujarat' }, { city: 'Ludhiana', state: 'Punjab' }, { city: 'Kanpur', state: 'Uttar Pradesh' },
  { city: 'Allahabad', state: 'Uttar Pradesh' }, { city: 'Varanasi', state: 'Uttar Pradesh' }, { city: 'Patna', state: 'Bihar' },
  { city: 'Ranchi', state: 'Jharkhand' }, { city: 'Bhubaneswar', state: 'Odisha' }, { city: 'Guwahati', state: 'Assam' },
  { city: 'Shillong', state: 'Meghalaya' }, { city: 'Imphal', state: 'Manipur' }, { city: 'Aizawl', state: 'Mizoram' },
  { city: 'Kohima', state: 'Nagaland' }, { city: 'Gangtok', state: 'Sikkim' }, { city: 'Shimla', state: 'Himachal Pradesh' },
  { city: 'Dehradun', state: 'Uttarakhand' }, { city: 'Srinagar', state: 'Jammu and Kashmir' }, { city: 'Jammu', state: 'Jammu and Kashmir' },
  { city: 'Raipur', state: 'Chhattisgarh' }, { city: 'Jabalpur', state: 'Madhya Pradesh' }, { city: 'Gwalior', state: 'Madhya Pradesh' },
  { city: 'Mysuru', state: 'Karnataka' }, { city: 'Mangaluru', state: 'Karnataka' }, { city: 'Vijayawada', state: 'Andhra Pradesh' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh' }, { city: 'Tiruchirappalli', state: 'Tamil Nadu' }, { city: 'Madurai', state: 'Tamil Nadu' },
  { city: 'Kozhikode', state: 'Kerala' }, { city: 'Thrissur', state: 'Kerala' }, { city: 'Nashik', state: 'Maharashtra' },
  { city: 'Aurangabad', state: 'Maharashtra' }, { city: 'Rajkot', state: 'Gujarat' }, { city: 'Jodhpur', state: 'Rajasthan' },
  { city: 'Udaipur', state: 'Rajasthan' }, { city: 'Amritsar', state: 'Punjab' }, { city: 'Noida', state: 'Uttar Pradesh' },
  { city: 'Ghaziabad', state: 'Uttar Pradesh' },
]

// 2500 unique locations: each a different part of India (street + city + state). Format: "number, Street, City, State, India"
function buildUniqueAddresses() {
  const out = []
  for (let i = 0; i < 2500; i++) {
    const street = INDIAN_STREETS[i % INDIAN_STREETS.length]
    const { city, state } = INDIAN_CITY_STATE[Math.floor(i / INDIAN_STREETS.length) % INDIAN_CITY_STATE.length]
    const num = (i % 500) + 1
    out.push(`${num}, ${street}, ${city}, ${state}, India`)
  }
  return out
}
const UNIQUE_LOCATION_ADDRESSES = buildUniqueAddresses()

const REQUESTED_PRODUCTS = ['MPLS', 'SD WAN', 'Internet']

const CONFIDENCE_LEVEL_OPTIONS = [
  { value: 'below30', label: 'Below 30%', min: 0, max: 29 },
  { value: '30-50', label: '30-50%', min: 30, max: 49 },
  { value: '50-70', label: '50-70%', min: 50, max: 69 },
  { value: '70-85', label: '70-85%', min: 70, max: 85 },
  { value: 'above85', label: 'Above 85%', min: 86, max: 100 },
]

const OTHER_FIELDS = {
  postalCodes: ['110021', '600070', '110045', '110078', '110023', '600090', '110015', '600056', '110034', '600067', '400001', '500032', '560001', '700001', '600001'],
  statuses: ['Done', 'Partial', 'Pending'],
  technology: ['Copper', 'Fiber'],
}

// Matched product options per requested product (for "Match All Products")
const MATCHED_PRODUCTS_OPTIONS = {
  'SD WAN': ['Managed SD-WAN', 'SD-WAN Branch', 'SD-WAN Lite'],
  Internet: ['Internet Leased Line', 'Dedicated Internet', 'Business Broadband'],
  MPLS: ['MPLS VPN', 'Global MPLS', 'VPN'],
}
const MATCHING_STATUSES = ['Done', 'Partial', 'Pending']

// When user edits Matched Products: Partial → Done or Pending; Pending → Partial or Done; Done → Partial or Pending
function getNextMatchingStatus(currentStatus) {
  const transitions = {
    Done: ['Partial', 'Pending'],
    Partial: ['Done', 'Pending'],
    Pending: ['Partial', 'Done'],
  }
  const options = transitions[currentStatus] || MATCHING_STATUSES
  return options[Math.floor(Math.random() * options.length)]
}

// Confidence level range by matching status (used to update Confidence Level column when Matching Status is set)
// Done = highest, Partial = medium, Pending = lowest
function getConfidenceLevelForMatchingStatus(status) {
  switch (status) {
    case 'Done':
      return 70 + Math.floor(Math.random() * 31)   // 70–100%
    case 'Partial':
      return 40 + Math.floor(Math.random() * 30)   // 40–69%
    case 'Pending':
      return Math.floor(Math.random() * 40)        // 0–39%
    default:
      return 40 + Math.floor(Math.random() * 59)   // fallback 40–98%
  }
}

// Product-specific attributes and values (per user spec)
const PRODUCT_ATTRIBUTES = {
  Internet: {
    Bandwidth: ['10 Mbps', '50 Mbps', '100 Mbps', '150 Mbps', '200 Mbps', '1 Gbps'],
    Media: ['Fiber Optics', 'FTTH', 'Copper'],
  },
  MPLS: {
    Bandwidth: ['2 Mbps', '10 Mbps', '50 Mbps', '100 Mbps', '1 Gbps'],
    Media: ['Fiber', 'Ethernet', 'ATM', 'Frame Relay', 'Transport over IP'],
    'Circuit Type': ['Layer 2 (VPLS)', 'Layer 3 (IP VPN)'],
  },
  'SD WAN': {
    'Service Type': ['Managed SD-WAN', 'Co-Managed', 'DIY'],
    'SDWAN Deployment Type': ['On-Premises', 'Cloud-Based', 'Hybrid'],
    'SDWAN Controller Platform': ['Cisco Meraki (MX Series)', 'Cisco Viptela', 'Airtel Cloud Dashboard'],
  },
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getAttributesForProduct(requestedProduct) {
  const attrs = PRODUCT_ATTRIBUTES[requestedProduct]
  if (!attrs) return '—'
  const values = []
  for (const key of Object.keys(attrs)) {
    values.push(pick(attrs[key]))
  }
  return values.join(', ')
}

// Parse row.attributes string (e.g. "2 Mbps, Transport over IP, Layer 2 (VPLS)") into { attrName: value } by product key order
function parseAttributesToObject(attributesString, requestedProduct) {
  const attrs = PRODUCT_ATTRIBUTES[requestedProduct]
  if (!attrs) return {}
  const keys = Object.keys(attrs)
  if (!attributesString || attributesString === '—') {
    const obj = {}
    keys.forEach((k) => { obj[k] = attrs[k][0] ?? '' })
    return obj
  }
  const parts = attributesString.split(',').map((s) => s.trim())
  const obj = {}
  keys.forEach((k, i) => { obj[k] = parts[i] ?? (attrs[k][0] ?? '') })
  return obj
}

// Format { attrName: value } back to display string in key order
function formatAttributesFromObject(obj, requestedProduct) {
  const attrs = PRODUCT_ATTRIBUTES[requestedProduct]
  if (!attrs) return '—'
  const values = Object.keys(attrs).map((k) => obj[k] ?? attrs[k][0] ?? '')
  return values.join(', ')
}

function createRow(id, streetAddress, requestedProduct) {
  return {
    id,
    streetAddress,
    postalCode: pick(OTHER_FIELDS.postalCodes),
    requestedProducts: requestedProduct,
    matchedProducts: '',
    matchingStatus: '',
    technology: pick(OTHER_FIELDS.technology),
    attributes: getAttributesForProduct(requestedProduct),
    confidenceLevel: 40 + Math.floor(Math.random() * 59), // 40% to 98%
  }
}

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildAllRows() {
  const rows = []
  let id = 1

  // 1000 locations × 3 requested products each (MPLS, SD WAN, Internet) = 3000 records
  for (let i = 0; i < 1000; i++) {
    const address = UNIQUE_LOCATION_ADDRESSES[i]
    for (const product of REQUESTED_PRODUCTS) {
      rows.push(createRow(id++, address, product))
    }
  }
  // 500 locations × 2 requested products each (MPLS, SD WAN) = 1000 records
  for (let i = 0; i < 500; i++) {
    const address = UNIQUE_LOCATION_ADDRESSES[1000 + i]
    rows.push(createRow(id++, address, 'MPLS'))
    rows.push(createRow(id++, address, 'SD WAN'))
  }
  // 1000 locations × 1 requested product each = 1000 records. Total = 3000 + 1000 + 1000 = 5000 records
  for (let i = 0; i < 1000; i++) {
    const address = UNIQUE_LOCATION_ADDRESSES[1500 + i]
    const product = REQUESTED_PRODUCTS[Math.floor(Math.random() * REQUESTED_PRODUCTS.length)]
    rows.push(createRow(id++, address, product))
  }

  // Shuffle so repeated locations appear mixed, not grouped
  const shuffled = shuffleArray(rows)
  return shuffled.map((row, index) => ({ ...row, id: index + 1 }))
}

const ALL_ROWS = buildAllRows()
// 2500 unique locations; 5000 total records (1000×3 + 500×2 + 1000×1)
const TOTAL_LOCATIONS = 2500

const VALIDATION_FAILURE_REASONS = [
  'Missing required attribute',
  'Postal code out of service area',
  'Technology not available at location',
  'Confidence below threshold',
  'Invalid product combination',
]

function StatusPill({ status }) {
  if (!status) return null
  const styles = {
    Done: 'bg-emerald-100 text-teal-700 border border-transparent',
    Partial: 'bg-gray-50 text-gray-600 border border-gray-300',
    Pending: 'bg-amber-100 text-amber-800 border border-transparent',
  }
  return (
    <span className={`inline-flex px-1.5 py-0.5 rounded-md text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  )
}

// Scoped notification bar: success (blue), error (red), warning (yellow). Optional onDismiss shows close icon.
function ScopedNotificationBar({ variant = 'success', locationsCount, productsCount, onDismiss }) {
  const config = {
    success: {
      bg: 'bg-[#E4EDFC]',
      icon: (
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1976D2] text-white text-xs font-bold shrink-0">i</span>
      ),
      textColor: 'text-[#1976D2]',
      closeColor: 'text-[#1976D2] hover:bg-[#1976D2]/10',
    },
    error: {
      bg: 'bg-red-600',
      icon: (
        <svg className="w-4 h-4 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      ),
      textColor: 'text-white',
      closeColor: 'text-white hover:bg-white/20',
    },
    warning: {
      bg: 'bg-amber-400',
      icon: (
        <svg className="w-4 h-4 text-amber-900 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
      ),
      textColor: 'text-amber-900',
      closeColor: 'text-amber-900 hover:bg-amber-900/10',
    },
  }
  const { bg, icon, textColor, closeColor } = config[variant] || config.success
  const message = `${locationsCount} locations were successfully extracted and ${productsCount} required products are successfully provided for each location based on the requirement.`
  return (
    <div className="px-4 pt-4 pb-2">
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${bg}`} role="status">
        <span className="flex items-center justify-center shrink-0" aria-hidden="true">
          {icon}
        </span>
        <p className={`text-sm font-medium flex-1 min-w-0 ${textColor}`}>{message}</p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className={`shrink-0 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current ${closeColor}`}
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

function DataTableSection({
  continuedRecordIds: continuedRecordIdsProp,
  validationByRowId: validationByRowIdProp,
  validationResult: validationResultProp,
  onRecordCountChange,
  onValidationComplete,
  onSelectionChange,
  onSelectedIdsChange,
  onLocationsData,
  notificationVariant: notificationVariantProp,
  quoteActionsRef,
}) {
  const continuedRecordIds = continuedRecordIdsProp ?? new Set()
  const [displayedCount, setDisplayedCount] = useState(10)
  const [notificationVariantState, setNotificationVariantState] = useState('success')
  const notificationVariant = notificationVariantProp ?? notificationVariantState // 'success' | 'error' | 'warning'
  const [scopedNotificationDismissed, setScopedNotificationDismissed] = useState(false)
  const [attributesModalRow, setAttributesModalRow] = useState(null) // { rowId, product } when open
  const [attributesFormValues, setAttributesFormValues] = useState(null) // { [attrName]: value } for modal form
  const [openMenuRowId, setOpenMenuRowId] = useState(null)
  const [deletedIds, setDeletedIds] = useState(new Set())
  const [deleteModalRow, setDeleteModalRow] = useState(null)
  const [viewByOpen, setViewByOpen] = useState(false)
  const [viewByValue, setViewByValue] = useState('All')
  const [viewBySortDirection, setViewBySortDirection] = useState('asc') // 'asc' | 'desc' – toggled when clicking the column sort icon
  const [confidenceSortDirection, setConfidenceSortDirection] = useState(null) // null | 'asc' | 'desc' – toggled when clicking Confidence Level sort icon
  const [filterByOpen, setFilterByOpen] = useState(false)
  const [requestedProductFilter, setRequestedProductFilter] = useState(null) // null = All Products
  const [confidenceLevelFilter, setConfidenceLevelFilter] = useState(null) // null = All; or value from CONFIDENCE_LEVEL_OPTIONS
  const [matchedProductFilter, setMatchedProductFilter] = useState(null) // null = All Matched Products
  const [matchingStatusFilter, setMatchingStatusFilter] = useState(null) // null = All; or 'Done' | 'Partial' | 'Pending'
  const [requestedProductDropdownOpen, setRequestedProductDropdownOpen] = useState(false)
  const [confidenceLevelDropdownOpen, setConfidenceLevelDropdownOpen] = useState(false)
  const [matchedProductDropdownOpen, setMatchedProductDropdownOpen] = useState(false)
  const [matchingStatusDropdownOpen, setMatchingStatusDropdownOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchFilter, setSearchFilter] = useState(null) // applied when user clicks Search button
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [selectedRowIds, setSelectedRowIds] = useState(() => new Set())
  const [viewSelectedOnly, setViewSelectedOnly] = useState(false)
  const [validationInProgress, setValidationInProgress] = useState(false)
  const [validationResultLocal, setValidationResultLocal] = useState(null) // { validatedCount, totalCount }
  const [validationByRowIdLocal, setValidationByRowIdLocal] = useState(null) // { [id]: { valid: boolean, reasoning?: string } }
  const [viewInvalidOnly, setViewInvalidOnly] = useState(false)
  const [viewValidOnly, setViewValidOnly] = useState(false)
  const [validationNotificationDismissed, setValidationNotificationDismissed] = useState(false)
  // Use lifted state from App when provided (so Data Reasoning is prefilled when returning to tab)
  const validationByRowId = validationByRowIdProp !== undefined && validationByRowIdProp !== null ? validationByRowIdProp : validationByRowIdLocal
  const validationResult = validationResultProp !== undefined && validationResultProp !== null ? validationResultProp : validationResultLocal
  const setValidationByRowId = (v) => {
    if (validationByRowIdProp !== undefined && validationByRowIdProp !== null) return // parent owns it
    setValidationByRowIdLocal(v)
  }
  const setValidationResult = (v) => {
    if (validationResultProp !== undefined && validationResultProp !== null) return
    setValidationResultLocal(v)
  }
  const [editingCell, setEditingCell] = useState(null) // { rowId, column: 'technology' | 'requestedProducts' | 'postalCode' }
  const [cellEdits, setCellEdits] = useState(() => ({})) // { [rowId]: { technology?, requestedProducts?, postalCode? } }
  const [matchResults, setMatchResults] = useState(() => ({})) // { [rowId]: { matchedProducts, matchingStatus, confidenceLevel? } } from "Match All Products"
  const [isMatchLoading, setIsMatchLoading] = useState(false)
  const [rowsWithStatusChange, setRowsWithStatusChange] = useState(() => new Set()) // row IDs to show "Updated" badge
  const statusChangeTimeoutsRef = useRef({})
  const [applyPostalCodeToSelected, setApplyPostalCodeToSelected] = useState(true) // "Update N selected items" when bulk editing postal code
  const [postalCodePopoverPosition, setPostalCodePopoverPosition] = useState(null) // { top, left } for popover when bulk editing
  const postalCodeInputRef = useRef(null)
  const postalCodeEditAnchorRef = useRef(null)
  const [applyBulkEditToSelected, setApplyBulkEditToSelected] = useState(true) // "Update N selected items" for Requested Products / Matched Products / Technology
  const [bulkEditPopoverPosition, setBulkEditPopoverPosition] = useState(null) // { top, left } for bulk edit popover
  const bulkEditAnchorRef = useRef(null)
  const bulkEditRequestedProductsRef = useRef(null)
  const bulkEditMatchedProductsRef = useRef(null)
  const bulkEditTechnologyRef = useRef(null)
  const menuAnchorRef = useRef(null)
  const viewByAnchorRef = useRef(null)
  const filterByAnchorRef = useRef(null)
  const searchAnchorRef = useRef(null)
  const selectAllCheckboxRef = useRef(null)
  const validationRowsRef = useRef([])

  const dataRows = ALL_ROWS.filter(
    (r) => !deletedIds.has(r.id) && !(continuedRecordIds && continuedRecordIds.has(r.id))
  )
  const dataRowsWithEdits = dataRows.map((row) => ({ ...row, ...cellEdits[row.id], ...matchResults[row.id] }))

  // All matched product options for filter dropdown (flatten MATCHED_PRODUCTS_OPTIONS)
  const ALL_MATCHED_PRODUCT_OPTIONS = Object.values(MATCHED_PRODUCTS_OPTIONS).flat()

  // Apply Requested Products, Confidence Level, Matched Products, and Matching Status filters
  const filteredRows = dataRowsWithEdits.filter((row) => {
    if (requestedProductFilter != null && row.requestedProducts !== requestedProductFilter) return false
    if (confidenceLevelFilter != null) {
      const opt = CONFIDENCE_LEVEL_OPTIONS.find((o) => o.value === confidenceLevelFilter)
      if (opt && (row.confidenceLevel < opt.min || row.confidenceLevel > opt.max)) return false
    }
    if (matchedProductFilter != null && row.matchedProducts !== matchedProductFilter) return false
    if (matchingStatusFilter != null && row.matchingStatus !== matchingStatusFilter) return false
    return true
  })

  // Parse city and state from streetAddress ("number, Street, City, State, India")
  const getCityAndState = (streetAddress) => {
    if (!streetAddress || typeof streetAddress !== 'string') return { city: '', state: '' }
    const parts = streetAddress.split(',').map((p) => p.trim())
    return { city: parts[2] || '', state: parts[3] || '' }
  }

  // Search filter: rows where any searchable field contains the term; city/state match from address
  const searchFilteredRows = (() => {
    if (searchFilter == null || String(searchFilter).trim() === '') return filteredRows
    const term = String(searchFilter).trim().toLowerCase()
    return filteredRows.filter((row) => {
      const { city, state } = getCityAndState(row.streetAddress)
      const fields = [
        row.streetAddress,
        city,
        state,
        row.requestedProducts,
        row.postalCode,
        row.technology,
        row.attributes,
      ]
      return fields.some((v) => String(v || '').toLowerCase().includes(term))
    })
  })()

  // Auto-suggestions: include city and state so user can type "Chennai" or "Tamil Nadu" and pick them
  const searchSuggestions = (() => {
    const q = searchInput.trim().toLowerCase()
    if (q.length === 0) return []
    const seen = new Set()
    const out = []
    for (const row of filteredRows) {
      const { city, state } = getCityAndState(row.streetAddress)
      const candidates = [city, state, row.streetAddress, row.requestedProducts, row.postalCode, row.technology]
      for (const v of candidates) {
        const s = String(v || '').trim()
        if (s && s.toLowerCase().includes(q) && !seen.has(s)) {
          seen.add(s)
          out.push(s)
          if (out.length >= 15) return out
        }
      }
    }
    return out
  })()

  // Apply Confidence Level sort (when active) or View By grouping
  const groupedRows = (() => {
    const copy = [...searchFilteredRows]
    if (confidenceSortDirection != null) {
      return copy.sort((a, b) =>
        confidenceSortDirection === 'asc'
          ? a.confidenceLevel - b.confidenceLevel
          : b.confidenceLevel - a.confidenceLevel
      )
    }
    if (viewByValue === 'All') return searchFilteredRows
    if (viewByValue === 'Technology') {
      const order = viewBySortDirection === 'asc' ? ['Copper', 'Fiber'] : ['Fiber', 'Copper']
      return copy.sort((a, b) => {
        const i = order.indexOf(a.technology)
        const j = order.indexOf(b.technology)
        return (i === -1 ? order.length : i) - (j === -1 ? order.length : j) || 0
      })
    }
    if (viewByValue === 'Requested Products') {
      const order = viewBySortDirection === 'asc' ? ['MPLS', 'SD WAN', 'Internet'] : ['Internet', 'SD WAN', 'MPLS']
      return copy.sort((a, b) => {
        const i = order.indexOf(a.requestedProducts)
        const j = order.indexOf(b.requestedProducts)
        return (i === -1 ? order.length : i) - (j === -1 ? order.length : j) || 0
      })
    }
    return searchFilteredRows
  })()

  validationRowsRef.current = groupedRows

  // When "View Selected" is on, show only selected rows; when validation filter is on, show only invalid or only valid rows
  let rowsToDisplay = viewSelectedOnly
    ? groupedRows.filter((r) => selectedRowIds.has(r.id))
    : groupedRows
  if (viewInvalidOnly && validationByRowId) {
    rowsToDisplay = rowsToDisplay.filter((r) => validationByRowId[r.id] && !validationByRowId[r.id].valid)
  }
  if (viewValidOnly && validationByRowId) {
    rowsToDisplay = rowsToDisplay.filter((r) => validationByRowId[r.id] && validationByRowId[r.id].valid)
  }
  const visibleRows = viewSelectedOnly ? rowsToDisplay : rowsToDisplay.slice(0, displayedCount)
  const hasMore = !viewSelectedOnly && displayedCount < groupedRows.length

  // Extra status line text for filtering, grouping, or search
  const statusExtras = (() => {
    const parts = []
    const rows = searchFilteredRows
    if (viewByValue === 'Technology' && confidenceSortDirection == null) {
      const copper = rows.filter((r) => r.technology === 'Copper').length
      const fiber = rows.filter((r) => r.technology === 'Fiber').length
      if (copper > 0) parts.push(`Shows ${copper} of Copper Technology`)
      if (fiber > 0) parts.push(`Shows ${fiber} of Fiber Technology`)
    }
    if (viewByValue === 'Requested Products' && confidenceSortDirection == null && requestedProductFilter == null) {
      const mpls = rows.filter((r) => r.requestedProducts === 'MPLS').length
      const sdwan = rows.filter((r) => r.requestedProducts === 'SD WAN').length
      const internet = rows.filter((r) => r.requestedProducts === 'Internet').length
      if (mpls > 0) parts.push(`Shows ${mpls} MPLS products`)
      if (sdwan > 0) parts.push(`Shows ${sdwan} SD WAN products`)
      if (internet > 0) parts.push(`Shows ${internet} Internet products`)
    }
    if (requestedProductFilter != null) {
      parts.push(`Shows ${rows.length} ${requestedProductFilter} products`)
    }
    if (confidenceLevelFilter != null) {
      const opt = CONFIDENCE_LEVEL_OPTIONS.find((o) => o.value === confidenceLevelFilter)
      const label = opt ? opt.label : confidenceLevelFilter
      parts.push(`Shows ${rows.length} ${label} confidence`)
    }
    if (matchedProductFilter != null) {
      parts.push(`Shows ${rows.length} ${matchedProductFilter}`)
    }
    if (matchingStatusFilter != null) {
      parts.push(`Shows ${rows.length} ${matchingStatusFilter} status`)
    }
    if (searchFilter != null && String(searchFilter).trim() !== '') {
      parts.push(`Shows ${rows.length} matching search`)
    }
    return parts
  })()

  // When grouped by Technology or Requested Products (and not sorting by Confidence), insert section header rows
  const TABLE_COLUMN_COUNT = 11
  const tbodyItems = (() => {
    if (viewByValue === 'All' || confidenceSortDirection != null) return visibleRows.map((row) => ({ type: 'row', row }))
    const key = viewByValue === 'Technology' ? 'technology' : 'requestedProducts'
    const items = []
    let lastGroup = null
    for (const row of visibleRows) {
      const group = row[key]
      if (group !== lastGroup) {
        items.push({ type: 'group', label: group })
        lastGroup = group
      }
      items.push({ type: 'row', row })
    }
    return items
  })()

  useEffect(() => {
    onRecordCountChange?.(searchFilteredRows.length)
  }, [searchFilteredRows.length, onRecordCountChange])

  useEffect(() => {
    onSelectionChange?.(selectedRowIds.size)
  }, [selectedRowIds, onSelectionChange])

  useEffect(() => {
    onSelectedIdsChange?.(selectedRowIds)
  }, [selectedRowIds, onSelectedIdsChange])

  // Unique locations (one per streetAddress) for Locations tab
  useEffect(() => {
    if (!onLocationsData) return
    const seen = new Set()
    const list = []
    for (const row of dataRows) {
      if (!seen.has(row.streetAddress)) {
        seen.add(row.streetAddress)
        const parts = (row.streetAddress || '').split(',').map((p) => p.trim())
        list.push({
          id: row.id,
          streetAddress: row.streetAddress,
          postalCode: row.postalCode,
          city: parts[2] || '',
          state: parts[3] || '',
          country: parts[4] || 'India',
        })
      }
    }
    onLocationsData(list)
  }, [dataRows, onLocationsData])

  useEffect(() => {
    const el = selectAllCheckboxRef.current
    if (!el) return
    const n = groupedRows.length
    const s = selectedRowIds.size
    el.indeterminate = n > 0 && s > 0 && s < n
  }, [groupedRows.length, selectedRowIds.size])

  useEffect(() => {
    const isBulkPostal = editingCell?.column === 'postalCode' && selectedRowIds.size >= 2
    if (!isBulkPostal) {
      setPostalCodePopoverPosition(null)
      return
    }
    const tick = requestAnimationFrame(() => {
      const el = postalCodeEditAnchorRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setPostalCodePopoverPosition({ top: rect.bottom + 4, left: rect.left })
    })
    return () => cancelAnimationFrame(tick)
  }, [editingCell?.rowId, editingCell?.column, selectedRowIds.size])

  const isBulkEditColumn = ['requestedProducts', 'matchedProducts', 'technology'].includes(editingCell?.column)
  const isBulkEditActive = isBulkEditColumn && selectedRowIds.size >= 2
  useEffect(() => {
    if (!isBulkEditActive) {
      setBulkEditPopoverPosition(null)
      return
    }
    const tick = requestAnimationFrame(() => {
      const el = bulkEditAnchorRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setBulkEditPopoverPosition({ top: rect.bottom + 4, left: rect.left })
    })
    return () => cancelAnimationFrame(tick)
  }, [editingCell?.rowId, editingCell?.column, selectedRowIds.size, isBulkEditActive])

  useEffect(() => {
    if (openMenuRowId === null) return
    const handleClickOutside = (e) => {
      if (menuAnchorRef.current && !menuAnchorRef.current.contains(e.target)) {
        setOpenMenuRowId(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openMenuRowId])

  useEffect(() => {
    if (!viewByOpen) return
    const handleClickOutside = (e) => {
      if (viewByAnchorRef.current && !viewByAnchorRef.current.contains(e.target)) {
        setViewByOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [viewByOpen])

  useEffect(() => {
    if (!filterByOpen) return
    const handleClickOutside = (e) => {
      if (filterByAnchorRef.current && !filterByAnchorRef.current.contains(e.target)) {
        setFilterByOpen(false)
        setRequestedProductDropdownOpen(false)
        setConfidenceLevelDropdownOpen(false)
        setMatchedProductDropdownOpen(false)
        setMatchingStatusDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [filterByOpen])

  useEffect(() => {
    if (!showSearchSuggestions) return
    const handleClickOutside = (e) => {
      if (searchAnchorRef.current && !searchAnchorRef.current.contains(e.target)) {
        setShowSearchSuggestions(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showSearchSuggestions])

  const uniqueLocationsCount = new Set(dataRows.map((r) => r.streetAddress)).size
  const productsCount = dataRows.length
  const editingRowForPostal = editingCell?.column === 'postalCode' ? dataRowsWithEdits.find((r) => r.id === editingCell.rowId) : null
  const editingRowForBulk = isBulkEditColumn && editingCell?.rowId ? dataRowsWithEdits.find((r) => r.id === editingCell.rowId) : null

  const handleMatchAllProducts = () => {
    setIsMatchLoading(true)
    setTimeout(() => {
      const next = {}
      dataRows.forEach((row) => {
        const requested = cellEdits[row.id]?.requestedProducts ?? row.requestedProducts
        const options = MATCHED_PRODUCTS_OPTIONS[requested]
        const matched = options ? pick(options) : ''
        const status = pick(MATCHING_STATUSES)
        next[row.id] = { matchedProducts: matched, matchingStatus: status, confidenceLevel: getConfidenceLevelForMatchingStatus(status) }
      })
      setMatchResults(next)
      setIsMatchLoading(false)
    }, 2000)
  }

  const applyBulkPostalCode = (postalCode) => {
    const ids = Array.from(selectedRowIds)
    if (ids.length === 0) return false
    const v = String(postalCode || '').trim()
    if (!v) return false
    setCellEdits((prev) => {
      const next = { ...prev }
      ids.forEach((id) => { next[id] = { ...next[id], postalCode: v } })
      return next
    })
    return true
  }

  const applyBulkAttributes = (productName, attributesObject, applyToAllRowsWithProduct = false) => {
    if (!attributesObject || !PRODUCT_ATTRIBUTES[productName]) return { applied: 0, message: 'Invalid product or attributes.' }
    const str = formatAttributesFromObject(attributesObject, productName)
    const ids = applyToAllRowsWithProduct
      ? dataRows.filter((row) => (cellEdits[row.id]?.requestedProducts ?? row.requestedProducts) === productName).map((r) => r.id)
      : Array.from(selectedRowIds).filter((id) => {
          const row = dataRows.find((r) => r.id === id)
          const requested = cellEdits[id]?.requestedProducts ?? row?.requestedProducts
          return requested === productName
        })
    if (ids.length === 0) {
      return {
        applied: 0,
        message: applyToAllRowsWithProduct
          ? `No rows have Requested Product: ${productName}.`
          : `No selected rows have Requested Product: ${productName}. Select rows on the table first, then save attributes.`,
      }
    }
    setCellEdits((prev) => { const next = { ...prev }; ids.forEach((id) => { next[id] = { ...next[id], attributes: str } }); return next })
    setMatchResults((prev) => { const next = { ...prev }; ids.forEach((id) => { next[id] = { ...next[id], attributes: str } }); return next })
    return {
      applied: ids.length,
      message: `Successfully changed the attributes of ${productName}. ${ids.length} row(s) updated in the table.`,
    }
  }

  const runValidation = () => {
    setValidationInProgress(true)
    setValidationNotificationDismissed(false)
    setViewInvalidOnly(false)
    setViewValidOnly(false)
    const rows = validationRowsRef.current || []
    setTimeout(() => {
      const byRowId = {}
      const validatedRowIds = new Set()
      let validatedCount = 0
      for (const row of rows) {
        const valid = Math.random() < 0.8
        if (valid) {
          validatedCount++
          validatedRowIds.add(row.id)
          byRowId[row.id] = { valid: true }
        } else {
          byRowId[row.id] = {
            valid: false,
            reasoning: VALIDATION_FAILURE_REASONS[Math.floor(Math.random() * VALIDATION_FAILURE_REASONS.length)],
          }
        }
      }
      const result = { validatedCount, totalCount: rows.length }
      setValidationByRowId(byRowId)
      setValidationResult(result)
      setValidationInProgress(false)
      onValidationComplete?.(validatedCount, validatedRowIds, { validationByRowId: byRowId, validationResult: result })
    }, 2000)
  }

  useEffect(() => {
    if (!quoteActionsRef) return
    quoteActionsRef.current = {
      matchAllProducts: handleMatchAllProducts,
      runValidation,
      setRequestedProductFilter,
      setConfidenceLevelFilter,
      setMatchedProductFilter,
      setMatchingStatusFilter,
      setViewByValue,
      setSearchFilter,
      setViewSelectedOnly,
      setFilterByOpen: (open) => setFilterByOpen(!!open),
      applyBulkPostalCode,
      applyBulkAttributes,
      getProductAttributes: (productName) => {
        const attrs = PRODUCT_ATTRIBUTES[productName]
        if (!attrs) return null
        return { productName, attributes: attrs }
      },
      clearFilters: () => {
        setRequestedProductFilter(null)
        setConfidenceLevelFilter(null)
        setMatchedProductFilter(null)
        setMatchingStatusFilter(null)
      },
    }
    return () => { quoteActionsRef.current = {} }
  })

  const postalCodePopover =
    postalCodePopoverPosition &&
    editingCell?.column === 'postalCode' &&
    selectedRowIds.size >= 2 &&
    editingRowForPostal
      ? createPortal(
          <div
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[14rem]"
            style={{
              position: 'fixed',
              top: postalCodePopoverPosition.top,
              left: postalCodePopoverPosition.left,
              zIndex: 9999,
            }}
            role="dialog"
            aria-label="Edit postal code for selected items"
          >
            <input
              ref={postalCodeInputRef}
              type="text"
              defaultValue={editingRowForPostal.postalCode}
              placeholder="Postal code"
              autoFocus
              className="w-full px-2 py-1.5 text-xs border border-blue-600 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setEditingCell(null)
              }}
            />
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={applyPostalCodeToSelected}
                onChange={(e) => setApplyPostalCodeToSelected(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span className="text-xs text-gray-700">Update {selectedRowIds.size} selected items</span>
            </label>
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md bg-white text-blue-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const v = (postalCodeInputRef.current?.value ?? '').trim() || editingRowForPostal.postalCode
                  setCellEdits((prev) => {
                    const next = { ...prev }
                    const ids = applyPostalCodeToSelected ? Array.from(selectedRowIds) : [editingCell.rowId]
                    ids.forEach((id) => {
                      next[id] = { ...next[id], postalCode: v }
                    })
                    return next
                  })
                  setEditingCell(null)
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                Save
              </button>
            </div>
          </div>,
          document.body
        )
      : null

  const bulkEditPopover =
    bulkEditPopoverPosition &&
    isBulkEditActive &&
    editingRowForBulk &&
    editingCell?.column
      ? createPortal(
          <div
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[14rem]"
            style={{
              position: 'fixed',
              top: bulkEditPopoverPosition.top,
              left: bulkEditPopoverPosition.left,
              zIndex: 9999,
            }}
            role="dialog"
            aria-label={`Bulk edit ${editingCell.column === 'requestedProducts' ? 'Requested Products' : editingCell.column === 'matchedProducts' ? 'Matched Products' : 'Technology'}`}
          >
            {editingCell.column === 'requestedProducts' && (
              <select
                ref={bulkEditRequestedProductsRef}
                defaultValue={editingRowForBulk.requestedProducts}
                className="w-full px-2 py-1.5 text-xs border border-blue-600 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {REQUESTED_PRODUCTS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {editingCell.column === 'matchedProducts' && (
              <select
                ref={bulkEditMatchedProductsRef}
                defaultValue={editingRowForBulk.matchedProducts || (MATCHED_PRODUCTS_OPTIONS[editingRowForBulk.requestedProducts]?.[0] ?? '')}
                className="w-full px-2 py-1.5 text-xs border border-blue-600 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {(MATCHED_PRODUCTS_OPTIONS[editingRowForBulk.requestedProducts] || []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {editingCell.column === 'technology' && (
              <select
                ref={bulkEditTechnologyRef}
                defaultValue={editingRowForBulk.technology}
                className="w-full px-2 py-1.5 text-xs border border-blue-600 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {OTHER_FIELDS.technology.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={applyBulkEditToSelected}
                onChange={(e) => setApplyBulkEditToSelected(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span className="text-xs text-gray-700">Update {selectedRowIds.size} selected items</span>
            </label>
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md bg-white text-blue-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const ids = applyBulkEditToSelected ? Array.from(selectedRowIds) : [editingCell.rowId]
                  if (editingCell.column === 'requestedProducts') {
                    const v = bulkEditRequestedProductsRef.current?.value ?? editingRowForBulk.requestedProducts
                    setCellEdits((prev) => {
                      const next = { ...prev }
                      ids.forEach((id) => { next[id] = { ...next[id], requestedProducts: v } })
                      return next
                    })
                  }
                  if (editingCell.column === 'matchedProducts') {
                    const v = bulkEditMatchedProductsRef.current?.value ?? editingRowForBulk.matchedProducts
                    setMatchResults((prev) => {
                      const next = { ...prev }
                      ids.forEach((id) => {
                        const row = dataRowsWithEdits.find((r) => r.id === id)
                        const currentStatus = row?.matchingStatus || ''
                        const status = getNextMatchingStatus(currentStatus)
                        next[id] = { ...prev[id], matchedProducts: v, matchingStatus: status, confidenceLevel: getConfidenceLevelForMatchingStatus(status), attributes: getAttributesForProduct(row?.requestedProducts ?? '') }
                      })
                      return next
                    })
                    setRowsWithStatusChange((prev) => { const n = new Set(prev); ids.forEach((id) => n.add(id)); return n })
                    ids.forEach((id) => {
                      if (statusChangeTimeoutsRef.current[id]) clearTimeout(statusChangeTimeoutsRef.current[id])
                      statusChangeTimeoutsRef.current[id] = setTimeout(() => {
                        setRowsWithStatusChange((p) => { const s = new Set(p); s.delete(id); return s })
                        delete statusChangeTimeoutsRef.current[id]
                      }, 3000)
                    })
                  }
                  if (editingCell.column === 'technology') {
                    const v = bulkEditTechnologyRef.current?.value ?? editingRowForBulk.technology
                    setCellEdits((prev) => {
                      const next = { ...prev }
                      ids.forEach((id) => { next[id] = { ...next[id], technology: v } })
                      return next
                    })
                  }
                  setEditingCell(null)
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                Save
              </button>
            </div>
          </div>,
          document.body
        )
      : null

  const attributesModalOpen = attributesModalRow != null && PRODUCT_ATTRIBUTES[attributesModalRow.product]

  const attributesModal =
    attributesModalOpen && attributesModalRow && attributesFormValues
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
            role="dialog"
            aria-modal="true"
            aria-labelledby="attributes-modal-title"
            onClick={(e) => { if (e.target === e.currentTarget) { setAttributesModalRow(null); setAttributesFormValues(null) } }}
          >
            <div
              className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="attributes-modal-title" className="text-base font-bold text-[#032d60] px-5 py-4 border-b border-gray-200">
                Requested Product : {attributesModalRow.product}
              </h2>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(PRODUCT_ATTRIBUTES[attributesModalRow.product]).map((attrName) => (
                    <div key={attrName}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">{attrName}</label>
                      <select
                        value={attributesFormValues[attrName] ?? ''}
                        onChange={(e) =>
                          setAttributesFormValues((prev) => ({ ...prev, [attrName]: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="">All Products</option>
                        {(PRODUCT_ATTRIBUTES[attributesModalRow.product][attrName] || []).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="shrink-0 border-t border-gray-200 px-5 py-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const str = formatAttributesFromObject(attributesFormValues, attributesModalRow.product)
                    const rowId = attributesModalRow.rowId
                    setCellEdits((prev) => ({ ...prev, [rowId]: { ...prev[rowId], attributes: str } }))
                    setMatchResults((prev) => ({ ...prev, [rowId]: { ...prev[rowId], attributes: str } }))
                    setAttributesModalRow(null)
                    setAttributesFormValues(null)
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  Save
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null

  const openAttributesModal = (rowId, product, currentAttributesString) => {
    if (!PRODUCT_ATTRIBUTES[product]) return
    setAttributesModalRow({ rowId, product })
    setAttributesFormValues(parseAttributesToObject(currentAttributesString, product))
  }

  return (
    <>
      {postalCodePopover}
      {bulkEditPopover}
      {attributesModal}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Scoped notification: validation result (same position as extraction notification) or extraction success */}
      {validationResult != null && !validationNotificationDismissed ? (
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FDF1DB]" role="status">
            <span className="flex items-center justify-center shrink-0" aria-hidden="true">
              <svg className="w-5 h-5 text-amber-800 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </span>
            <p className="text-sm font-medium flex-1 min-w-0 text-amber-900">
              {validationResult.validatedCount} records of {validationResult.totalCount} records are validated and is successful{' '}
              <button
                type="button"
                onClick={() => { setViewValidOnly(true); setViewInvalidOnly(false) }}
                className="underline text-amber-900 hover:text-amber-950 focus:outline-none"
              >
                Show validated records
              </button>
              {' · '}
              <button
                type="button"
                onClick={() => { setViewInvalidOnly(true); setViewValidOnly(false) }}
                className="underline text-amber-900 hover:text-amber-950 focus:outline-none"
              >
                Show Invalid Records
              </button>
            </p>
            <button
              type="button"
              onClick={() => setValidationNotificationDismissed(true)}
              className="shrink-0 p-1 rounded-full text-amber-900 hover:bg-amber-900/10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : !scopedNotificationDismissed ? (
        <ScopedNotificationBar
          variant={notificationVariant}
          locationsCount={uniqueLocationsCount}
          productsCount={productsCount}
          onDismiss={() => setScopedNotificationDismissed(true)}
        />
      ) : null}
      {/* Table toolbar */}
      <div className="flex flex-col gap-3 p-4 border-b border-gray-200 bg-gray-50/50">
        {/* Row 1: View By & Filter by (left) | Search group (right) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex items-center" ref={viewByAnchorRef}>
              <span className="text-xs text-gray-600 mr-2">View By</span>
              <button
                type="button"
                onClick={() => setViewByOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full bg-white text-xs text-blue-600"
                aria-expanded={viewByOpen}
                aria-haspopup="listbox"
              >
                {viewByValue}
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {viewByOpen && (
                <div
                  className="absolute left-0 top-full mt-1 min-w-[8rem] py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                  role="listbox"
                >
                  {['All', 'Technology', 'Requested Products'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="option"
                      onClick={() => {
                        setViewByValue(option)
                        setViewByOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-gray-800 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative flex items-center" ref={filterByAnchorRef}>
              <span className="text-xs text-gray-600 mr-2">Filter by</span>
              <button
                type="button"
                onClick={() => setFilterByOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full bg-white text-xs text-blue-600"
                aria-expanded={filterByOpen}
              >
                All
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {filterByOpen && (
                <div className="absolute left-0 top-full mt-1 z-30 w-72 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-xs">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Requested Products</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setConfidenceLevelDropdownOpen(false); setMatchedProductDropdownOpen(false); setMatchingStatusDropdownOpen(false); setRequestedProductDropdownOpen((o) => !o) }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-left text-xs text-gray-600"
                        >
                          <span>{requestedProductFilter == null ? 'All Products' : requestedProductFilter}</span>
                          <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {requestedProductDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-0.5 py-0.5 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button type="button" onClick={() => { setRequestedProductFilter(null); setRequestedProductDropdownOpen(false) }} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">All Products</button>
                            {REQUESTED_PRODUCTS.map((p) => (
                              <button key={p} type="button" onClick={() => { setRequestedProductFilter(p); setRequestedProductDropdownOpen(false) }} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">{p}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Confidence Level</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setRequestedProductDropdownOpen(false); setMatchedProductDropdownOpen(false); setMatchingStatusDropdownOpen(false); setConfidenceLevelDropdownOpen((o) => !o) }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-left text-xs text-gray-600"
                        >
                          <span>
                            {confidenceLevelFilter == null
                              ? 'All Confidence Levels'
                              : CONFIDENCE_LEVEL_OPTIONS.find((o) => o.value === confidenceLevelFilter)?.label ?? 'All Confidence Levels'}
                          </span>
                          <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {confidenceLevelDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-0.5 py-0.5 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button type="button" onClick={() => { setConfidenceLevelFilter(null); setConfidenceLevelDropdownOpen(false) }} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">All Confidence Levels</button>
                            {CONFIDENCE_LEVEL_OPTIONS.map((o) => (
                              <button key={o.value} type="button" onClick={() => { setConfidenceLevelFilter(o.value); setConfidenceLevelDropdownOpen(false) }} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">{o.label}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Matched Products</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setRequestedProductDropdownOpen(false); setConfidenceLevelDropdownOpen(false); setMatchingStatusDropdownOpen(false); setMatchedProductDropdownOpen((o) => !o) }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-left text-xs text-gray-600"
                        >
                          <span>{matchedProductFilter == null ? 'All Matched Products' : matchedProductFilter}</span>
                          <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {matchedProductDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-0.5 py-0.5 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                            <button type="button" onClick={() => { setMatchedProductFilter(null); setMatchedProductDropdownOpen(false) }} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">All Matched Products</button>
                            {ALL_MATCHED_PRODUCT_OPTIONS.map((p) => (
                              <button key={p} type="button" onClick={() => { setMatchedProductFilter(p); setMatchedProductDropdownOpen(false) }} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">{p}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Matching Status</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setRequestedProductDropdownOpen(false); setConfidenceLevelDropdownOpen(false); setMatchedProductDropdownOpen(false); setMatchingStatusDropdownOpen((o) => !o) }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-left text-xs text-gray-600"
                        >
                          <span>{matchingStatusFilter == null ? 'All Matching Status' : matchingStatusFilter}</span>
                          <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {matchingStatusDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-0.5 py-0.5 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button type="button" onClick={() => { setMatchingStatusFilter(null); setMatchingStatusDropdownOpen(false) }} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">All Matching Status</button>
                            {MATCHING_STATUSES.map((s) => (
                              <button key={s} type="button" onClick={() => { setMatchingStatusFilter(s); setMatchingStatusDropdownOpen(false) }} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">{s}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48" ref={searchAnchorRef}>
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setShowSearchSuggestions(true) }}
                onFocus={() => { if (searchInput.trim()) setShowSearchSuggestions(true) }}
                placeholder="Search this list"
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-full text-xs w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                aria-autocomplete="list"
                aria-expanded={showSearchSuggestions && searchSuggestions.length > 0}
              />
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                  {searchSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setSearchInput(s); setShowSearchSuggestions(false) }}
                      className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 truncate"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => { setSearchFilter(searchInput.trim() || null); setShowSearchSuggestions(false) }}
              className="p-1.5 border border-blue-600 rounded-full bg-white text-blue-600 hover:bg-blue-50 flex items-center justify-center w-9 h-9"
              aria-label="Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleMatchAllProducts}
              className="px-4 py-1.5 border border-gray-300 rounded-full bg-white text-blue-600 text-xs font-medium hover:bg-gray-50"
            >
              Match All Products
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs border-b border-gray-100">
        <p className="text-gray-600">
          Show 1 to {viewSelectedOnly ? rowsToDisplay.length : Math.min(displayedCount, groupedRows.length)} of {viewSelectedOnly ? rowsToDisplay.length : searchFilteredRows.length} records for {TOTAL_LOCATIONS} locations • {selectedRowIds.size} Records selected
          {viewInvalidOnly && validationByRowId && (
            <span> • Showing only unvalidated records</span>
          )}
          {viewValidOnly && validationByRowId && (
            <span> • Showing only validated records</span>
          )}
          {statusExtras.length > 0 && !viewSelectedOnly && statusExtras.map((extra) => <span key={extra}> • {extra}</span>)}
        </p>
        {(viewInvalidOnly || viewValidOnly) && validationByRowId ? (
          <button type="button" onClick={() => { setViewInvalidOnly(false); setViewValidOnly(false) }} className="text-blue-600 hover:underline font-medium">
            Show all records
          </button>
        ) : viewSelectedOnly ? (
          <button type="button" onClick={() => setViewSelectedOnly(false)} className="text-blue-600 hover:underline font-medium">
            Show all
          </button>
        ) : (
          <button
            type="button"
            onClick={() => selectedRowIds.size > 0 && setViewSelectedOnly(true)}
            className={`font-medium ${selectedRowIds.size > 0 ? 'text-blue-600 hover:underline cursor-pointer' : 'text-gray-400 cursor-default'}`}
          >
            View Selected({selectedRowIds.size})
          </button>
        )}
      </div>

      {/* Table: first 10 rows in scrollable area; row 11 (Load more) fixed at bottom; no blank row space */}
      <div className="overflow-x-auto flex flex-col min-h-0" style={{ height: '24rem' }}>
        {/* Scrollable: fixed height for 10 rows so all 10 visible without scrolling */}
        <div className="relative overflow-y-auto border-b border-gray-100 min-h-0" style={{ height: '22rem' }}>
          {validationInProgress && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/90" aria-live="polite">
              <div className="flex gap-1" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-700">Validation in progress...</p>
            </div>
          )}
          <table className="w-full text-xs leading-tight table-fixed">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-10 pl-4 pr-2 py-1 text-left">
                  <input
                    type="checkbox"
                    ref={selectAllCheckboxRef}
                    checked={groupedRows.length > 0 && selectedRowIds.size === groupedRows.length}
                    onChange={() => {
                      if (selectedRowIds.size === groupedRows.length) {
                        setSelectedRowIds(new Set())
                      } else {
                        setSelectedRowIds(new Set(groupedRows.map((r) => r.id)))
                      }
                    }}
                    className="rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    aria-label="Select all"
                  />
                </th>
                <th className="w-40 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs" title="Street Address">Street Address</th>
                <th className="w-24 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs" title="Postal Code">Postal Code</th>
                <th className="w-28 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs" title="Requested Products">
                  <span className="inline-flex items-center gap-0.5 truncate max-w-full">
                    Requested Products
                    {viewByValue === 'Requested Products' && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setViewBySortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc')) }}
                        className="p-0.5 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        title={viewBySortDirection === 'asc' ? 'Show descending order (click to toggle)' : 'Show ascending order (click to toggle)'}
                        aria-label={`Sort by Requested Products ${viewBySortDirection === 'asc' ? 'descending' : 'ascending'}`}
                      >
                        <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          {viewBySortDirection === 'asc' ? (
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      </button>
                    )}
                  </span>
                </th>
                <th className="w-28 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs" title="Matched Products">Matched Products</th>
                <th className="w-28 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs" title="Matching Status">Matching Status</th>
                <th className="w-24 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs" title="Technology">
                  <span className="inline-flex items-center gap-0.5 truncate max-w-full">
                    Technology
                    {viewByValue === 'Technology' && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setViewBySortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc')) }}
                        className="p-0.5 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        title={viewBySortDirection === 'asc' ? 'Show Fiber first (click to show Copper first)' : 'Show Copper first (click to show Fiber first)'}
                        aria-label={`Sort by Technology ${viewBySortDirection === 'asc' ? 'descending' : 'ascending'}`}
                      >
                        <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          {viewBySortDirection === 'asc' ? (
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                      </button>
                    )}
                  </span>
                </th>
                <th className="w-40 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs" title="Attributes">Attributes</th>
                <th className="w-24 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs" title="Confidence Level">
                  <span className="inline-flex items-center gap-0.5 truncate max-w-full">
                    Confidence Level
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setConfidenceSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'))
                      }}
                      className="p-0.5 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
                      title={confidenceSortDirection === 'desc' ? 'Sort ascending (low to high)' : 'Sort descending (high to low)'}
                      aria-label={`Sort by Confidence Level ${confidenceSortDirection === 'desc' ? 'ascending' : 'descending'}`}
                    >
                      <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        {confidenceSortDirection === 'asc' ? (
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        )}
                      </svg>
                    </button>
                  </span>
                </th>
                <th className="w-32 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs" title="Data Reasoning">Data Reasoning</th>
                <th className="w-9 px-2 py-1" aria-label="Row actions" />
              </tr>
            </thead>
            <tbody>
              {tbodyItems.map((item, idx) =>
                item.type === 'group' ? (
                  <tr key={`group-${item.label}-${idx}`} className="bg-gray-100 border-b border-gray-200">
                    <td colSpan={TABLE_COLUMN_COUNT} className="pl-4 py-2 text-xs font-semibold text-gray-700">
                      {item.label}
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={item.row.id}
                    className={`border-b border-gray-100 hover:bg-gray-50/50 ${idx % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                  >
<td className="pl-4 pr-2 py-1 align-middle">
                  <input
                    type="checkbox"
                    checked={selectedRowIds.has(item.row.id)}
                    onChange={() => {
                      setSelectedRowIds((prev) => {
                        const next = new Set(prev)
                        if (next.has(item.row.id)) next.delete(item.row.id)
                        else next.add(item.row.id)
                        return next
                      })
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    aria-label={`Select row ${item.row.id}`}
                  />
                </td>
                  <td className="px-2 py-1 text-gray-800 align-middle min-w-0">
                    <div className="truncate" title={item.row.streetAddress}>{item.row.streetAddress}</div>
                  </td>
                  <td
                    ref={editingCell?.rowId === item.row.id && editingCell?.column === 'postalCode' && selectedRowIds.size >= 2 ? postalCodeEditAnchorRef : null}
                    className="px-2 py-1 text-gray-800 align-middle min-w-0 group"
                  >
                    {editingCell?.rowId === item.row.id && editingCell?.column === 'postalCode' ? (
                      selectedRowIds.size >= 2 ? (
                        <div className="truncate" title={item.row.postalCode}>{item.row.postalCode}</div>
                      ) : (
                        <input
                          ref={postalCodeInputRef}
                          type="text"
                          defaultValue={item.row.postalCode}
                          className="w-full min-w-[5rem] px-2 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          onBlur={(e) => {
                            const v = e.target.value.trim()
                            setCellEdits((prev) => ({ ...prev, [item.row.id]: { ...prev[item.row.id], postalCode: v || item.row.postalCode } }))
                            setEditingCell(null)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.target.blur()
                            if (e.key === 'Escape') { setEditingCell(null); e.target.value = item.row.postalCode }
                          }}
                          autoFocus
                        />
                      )
                    ) : (
                      <div className="inline-flex items-center gap-1 min-w-0 max-w-full">
                        <span className="truncate" title={item.row.postalCode}>{item.row.postalCode}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setApplyPostalCodeToSelected(true); setEditingCell({ rowId: item.row.id, column: 'postalCode' }) }}
                          className="shrink-0 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-200 focus:outline-none"
                          aria-label="Edit postal code"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                  <td
                    ref={editingCell?.rowId === item.row.id && editingCell?.column === 'requestedProducts' && selectedRowIds.size >= 2 ? bulkEditAnchorRef : null}
                    className="px-2 py-1 text-gray-800 align-middle min-w-0 group"
                  >
                    {editingCell?.rowId === item.row.id && editingCell?.column === 'requestedProducts' ? (
                      selectedRowIds.size >= 2 ? (
                        <div className="truncate" title={item.row.requestedProducts}>{item.row.requestedProducts}</div>
                      ) : (
                        <select
                          value={item.row.requestedProducts}
                          onChange={(e) => {
                            const v = e.target.value
                            setCellEdits((prev) => ({ ...prev, [item.row.id]: { ...prev[item.row.id], requestedProducts: v } }))
                            setEditingCell(null)
                          }}
                          onBlur={() => setEditingCell(null)}
                          className="w-full min-w-[6rem] px-2 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          autoFocus
                        >
                          {REQUESTED_PRODUCTS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )
                    ) : (
                      <div className="inline-flex items-center gap-1 min-w-0 max-w-full">
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); if (PRODUCT_ATTRIBUTES[item.row.requestedProducts]) openAttributesModal(item.row.id, item.row.requestedProducts, item.row.attributes) }}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (PRODUCT_ATTRIBUTES[item.row.requestedProducts]) openAttributesModal(item.row.id, item.row.requestedProducts, item.row.attributes) } }}
                          className="truncate cursor-pointer hover:text-blue-600 hover:underline"
                          title={`${item.row.requestedProducts} (click to edit attributes)`}
                        >
                          {item.row.requestedProducts}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setApplyBulkEditToSelected(true); setEditingCell({ rowId: item.row.id, column: 'requestedProducts' }) }}
                          className="shrink-0 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-200 focus:outline-none"
                          aria-label="Edit requested products"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                  <td
                    ref={editingCell?.rowId === item.row.id && editingCell?.column === 'matchedProducts' && selectedRowIds.size >= 2 ? bulkEditAnchorRef : null}
                    className="px-2 py-1 text-gray-800 align-middle min-w-0 group"
                  >
                    {isMatchLoading ? (
                      <span className="inline-flex items-center justify-center text-gray-400" aria-hidden="true">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </span>
                    ) : editingCell?.rowId === item.row.id && editingCell?.column === 'matchedProducts' ? (
                      selectedRowIds.size >= 2 ? (
                        <div className="truncate" title={item.row.matchedProducts || '---'}>{item.row.matchedProducts || '---'}</div>
                      ) : (
                      <select
                        value={item.row.matchedProducts || (MATCHED_PRODUCTS_OPTIONS[item.row.requestedProducts]?.[0] ?? '')}
                        onChange={(e) => {
                          const v = e.target.value
                          // Current status from merged row (same rule when filter by Matching Status is Partial/Pending: use this row’s status for transition)
                          const currentStatus = item.row.matchingStatus || matchResults[item.row.id]?.matchingStatus || ''
                          const status = getNextMatchingStatus(currentStatus)
                          const confidenceLevel = getConfidenceLevelForMatchingStatus(status)
                          const requestedProduct = item.row.requestedProducts
                          const attributes = getAttributesForProduct(requestedProduct)
                          // Row-level update only: by row id. Applies the same whether or not Filter by (e.g. Matching Status = Partial/Pending) is active; no other rows change.
                          setMatchResults((prev) => ({ ...prev, [item.row.id]: { ...prev[item.row.id], matchedProducts: v, matchingStatus: status, confidenceLevel, attributes } }))
                          setEditingCell(null)
                          // Show "Updated" badge on Matching Status (and confidence) for a few seconds
                          const rowId = item.row.id
                          setRowsWithStatusChange((prev) => new Set(prev).add(rowId))
                          if (statusChangeTimeoutsRef.current[rowId]) clearTimeout(statusChangeTimeoutsRef.current[rowId])
                          statusChangeTimeoutsRef.current[rowId] = setTimeout(() => {
                            setRowsWithStatusChange((prev) => { const n = new Set(prev); n.delete(rowId); return n })
                            delete statusChangeTimeoutsRef.current[rowId]
                          }, 3000)
                        }}
                        onBlur={() => setEditingCell(null)}
                        className="w-full min-w-[8rem] px-2 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        autoFocus
                      >
                        {(MATCHED_PRODUCTS_OPTIONS[item.row.requestedProducts] || []).map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      )
                    ) : (
                      <div className="inline-flex items-center gap-1 min-w-0 max-w-full">
                        <span className="truncate" title={item.row.matchedProducts || '---'}>{item.row.matchedProducts || '---'}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setApplyBulkEditToSelected(true); setEditingCell({ rowId: item.row.id, column: 'matchedProducts' }) }}
                          className="shrink-0 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-200 focus:outline-none"
                          aria-label="Edit matched products"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-1 align-middle min-w-0">
                    {isMatchLoading ? (
                      <span className="inline-flex items-center justify-center text-gray-400" aria-hidden="true">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        {item.row.matchingStatus ? <StatusPill status={item.row.matchingStatus} /> : '---'}
                        {rowsWithStatusChange.has(item.row.id) && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700 shrink-0" title="Matching status updated">Updated</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td
                    ref={editingCell?.rowId === item.row.id && editingCell?.column === 'technology' && selectedRowIds.size >= 2 ? bulkEditAnchorRef : null}
                    className="px-2 py-1 text-gray-800 align-middle min-w-0 group"
                  >
                    {editingCell?.rowId === item.row.id && editingCell?.column === 'technology' ? (
                      selectedRowIds.size >= 2 ? (
                        <div className="truncate" title={item.row.technology}>{item.row.technology}</div>
                      ) : (
                        <select
                          value={item.row.technology}
                          onChange={(e) => {
                            const v = e.target.value
                            setCellEdits((prev) => ({ ...prev, [item.row.id]: { ...prev[item.row.id], technology: v } }))
                            setEditingCell(null)
                          }}
                          onBlur={() => setEditingCell(null)}
                          className="w-full min-w-[5rem] px-2 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          autoFocus
                        >
                          {OTHER_FIELDS.technology.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )
                    ) : (
                      <div className="inline-flex items-center gap-1 min-w-0 max-w-full">
                        <span className="truncate" title={item.row.technology}>{item.row.technology}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setApplyBulkEditToSelected(true); setEditingCell({ rowId: item.row.id, column: 'technology' }) }}
                          className="shrink-0 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-200 focus:outline-none"
                          aria-label="Edit technology"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-1 text-gray-800 align-middle min-w-0 group">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); if (PRODUCT_ATTRIBUTES[item.row.requestedProducts]) openAttributesModal(item.row.id, item.row.requestedProducts, item.row.attributes) }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (PRODUCT_ATTRIBUTES[item.row.requestedProducts]) openAttributesModal(item.row.id, item.row.requestedProducts, item.row.attributes) } }}
                      className="truncate cursor-pointer hover:text-blue-600 hover:underline"
                      title={item.row.attributes ? `${item.row.attributes} (click to edit)` : 'Click to edit attributes'}
                    >
                      {item.row.attributes}
                    </div>
                  </td>
                  <td className="px-2 py-1 text-gray-800 align-middle min-w-0">
                    <div className="truncate flex items-center gap-1" title={item.row.matchingStatus ? `${item.row.confidenceLevel}% (${item.row.matchingStatus}: ${item.row.matchingStatus === 'Done' ? 'highest' : item.row.matchingStatus === 'Partial' ? 'medium' : 'lowest'} confidence)` : `${item.row.confidenceLevel}%`}>
                      <span>{item.row.confidenceLevel}%</span>
                      {rowsWithStatusChange.has(item.row.id) && (
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500" title="Updated with status" aria-hidden />
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-1 text-gray-800 align-middle min-w-0">
                    {validationByRowId && validationByRowId[item.row.id] ? (
                      validationByRowId[item.row.id].valid ? (
                        <div className="inline-flex items-center gap-1.5">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white shrink-0" aria-hidden>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-gray-700">Success</span>
                        </div>
                      ) : (
                        <span className="truncate block text-gray-700" title={validationByRowId[item.row.id].reasoning}>
                          {validationByRowId[item.row.id].reasoning}
                        </span>
                      )
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-2 py-1 align-middle">
                    <div
                      className="relative inline-block"
                      ref={openMenuRowId === item.row.id ? menuAnchorRef : null}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuRowId((prev) => (prev === item.row.id ? null : item.row.id))
                        }}
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 shrink-0"
                        aria-label="Row actions"
                        aria-expanded={openMenuRowId === item.row.id}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {openMenuRowId === item.row.id && (
                        <div className="absolute right-0 top-full mt-1 z-20 min-w-[6rem] py-1 bg-white border border-gray-300 rounded-lg shadow-sm">
                          <button
                            type="button"
                            className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                            onClick={() => setOpenMenuRowId(null)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                            onClick={() => {
                              setDeleteModalRow({ id: item.row.id, streetAddress: item.row.streetAddress })
                              setOpenMenuRowId(null)
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
              )}
            </tbody>
          </table>
        </div>
        {/* Fixed 11th row: Load more (not scrollable) */}
        {hasMore && (
          <div className="flex-shrink-0 flex items-center justify-center w-full px-2 min-h-[1.75rem] py-1 bg-white border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => setDisplayedCount((prev) => Math.min(prev + 10, groupedRows.length))}
              className="text-blue-600 hover:underline font-medium text-xs"
            >
              Load more
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation modal - styled to match screenshot */}
      {deleteModalRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50" aria-modal="true" role="dialog">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative">
            <div className="px-6 pt-8 pb-4 text-center border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#003366]">Delete this record</h2>
              <button
                type="button"
                onClick={() => setDeleteModalRow(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white text-[#003366] hover:bg-gray-100 focus:outline-none"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="px-6 py-4 text-base text-[#444444] text-center leading-relaxed border-b border-gray-200">
              Are you sure you want to delete the requested product for {deleteModalRow.streetAddress}?
            </p>
            <div className="flex justify-end gap-3 px-6 py-6">
              <button
                type="button"
                onClick={() => setDeleteModalRow(null)}
                className="px-5 py-2.5 text-base font-normal text-[#003366] bg-transparent border border-gray-500 rounded-full hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeletedIds((prev) => new Set(prev).add(deleteModalRow.id))
                  setDeleteModalRow(null)
                }}
                className="px-5 py-2.5 text-base font-normal text-[#C74872] bg-[#F9E0E6] border border-[#C74872] rounded-full hover:bg-[#F5D4DC]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default DataTableSection
