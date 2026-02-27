import { useState, useMemo, useEffect, useRef } from 'react'

const PRODUCTS = ['MPLS', 'SD WAN', 'Internet']
const FEASIBILITY_STATUSES = ['Progress', 'Complete', 'Failure']

// Build summary rows from locations; ensure exactly 50 are MPLS + Failure for the warning
function buildSummaryRows(locations) {
  if (!locations || locations.length === 0) return []
  const rows = locations.map((loc, i) => {
    const product = PRODUCTS[i % PRODUCTS.length]
    const feasibility = FEASIBILITY_STATUSES[i % FEASIBILITY_STATUSES.length]
    return {
      id: loc.id,
      memberGroup: loc.streetAddress,
      product,
      feasibilityStatus: feasibility,
      quantity: 1,
      oneTimeTotal: 100 + Math.floor(Math.random() * 400),
      recurringTotal: 50 + Math.floor(Math.random() * 150),
      billingAccount: '—',
      serviceId: '—',
      connectDate: '—',
    }
  })
  // Set exactly 50 rows to MPLS + Failure (use first 50 indices)
  for (let i = 0; i < 50 && i < rows.length; i++) {
    rows[i].product = 'MPLS'
    rows[i].feasibilityStatus = 'Failure'
  }
  return rows
}

function SortIcon({ column, sortColumn, sortDirection, onClick }) {
  const isActive = sortColumn === column
  const asc = isActive && sortDirection === 'asc'
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-0.5 rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 mr-0.5 shrink-0 inline-flex"
      title={isActive ? `Sort ${sortDirection === 'desc' ? 'ascending' : 'descending'}` : 'Sort'}
      aria-label={`Sort by ${column}`}
    >
      <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        {asc ? (
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        ) : (
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        )}
      </svg>
    </button>
  )
}

function FeasibilityBadge({ status }) {
  const styles = {
    Progress: 'bg-amber-100 text-amber-800 border border-amber-300',
    Complete: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    Failure: 'bg-red-100 text-red-800 border border-red-300',
  }
  return (
    <span className={`inline-flex px-1.5 py-0.5 rounded-md text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  )
}

function SummaryTabContent({ locations = [], onTotalsChange }) {
  const summaryRows = useMemo(() => buildSummaryRows(locations), [locations])
  const [displayedCount, setDisplayedCount] = useState(10)
  const [showFeasibilityErrorOnly, setShowFeasibilityErrorOnly] = useState(false)
  const [notificationDismissed, setNotificationDismissed] = useState(false)
  const [filterByOpen, setFilterByOpen] = useState(false)
  const [productFilter, setProductFilter] = useState(null)
  const [feasibilityFilter, setFeasibilityFilter] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [searchFilter, setSearchFilter] = useState(null)
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [productDropdownOpen, setProductDropdownOpen] = useState(false)
  const [feasibilityDropdownOpen, setFeasibilityDropdownOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState(null) // 'memberGroup' | 'product' | 'feasibilityStatus' | 'quantity' | 'oneTimeTotal' | 'recurringTotal'
  const [sortDirection, setSortDirection] = useState('asc') // 'asc' | 'desc'
  const [openMenuRowId, setOpenMenuRowId] = useState(null)
  const [deletedIds, setDeletedIds] = useState(() => new Set())
  const [deleteModalRow, setDeleteModalRow] = useState(null) // { id, memberGroup }
  const filterByRef = useRef(null)
  const searchAnchorRef = useRef(null)
  const menuAnchorRef = useRef(null)

  // Close row overflow menu when clicking outside
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

  // Close Filter by popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterByRef.current && !filterByRef.current.contains(e.target)) {
        setFilterByOpen(false)
        setProductDropdownOpen(false)
        setFeasibilityDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close search suggestions when clicking outside (same as Extracted Information tab)
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

  let rowsToDisplay = summaryRows.filter((r) => !deletedIds.has(r.id))
  if (showFeasibilityErrorOnly) rowsToDisplay = rowsToDisplay.filter((r) => r.feasibilityStatus === 'Failure')
  if (productFilter) rowsToDisplay = rowsToDisplay.filter((r) => r.product === productFilter)
  if (feasibilityFilter) rowsToDisplay = rowsToDisplay.filter((r) => r.feasibilityStatus === feasibilityFilter)

  // Search suggestions from current data (same pattern as Extracted Information tab)
  const searchSuggestions = useMemo(() => {
    const q = searchInput.trim().toLowerCase()
    if (q.length === 0) return []
    const seen = new Set()
    const out = []
    for (const row of rowsToDisplay) {
      const candidates = [
        row.memberGroup,
        row.product,
        row.feasibilityStatus,
        String(row.oneTimeTotal ?? ''),
        String(row.recurringTotal ?? ''),
      ]
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
  }, [searchInput, rowsToDisplay])

  if (searchFilter != null && String(searchFilter).trim() !== '') {
    const term = String(searchFilter).trim().toLowerCase()
    rowsToDisplay = rowsToDisplay.filter((r) => {
      const searchable = [r.memberGroup, r.product, r.feasibilityStatus, String(r.oneTimeTotal), String(r.recurringTotal)].join(' ')
      return searchable.toLowerCase().includes(term)
    })
  }
  if (sortColumn) {
    const dir = sortDirection === 'asc' ? 1 : -1
    rowsToDisplay = [...rowsToDisplay].sort((a, b) => {
      let va = a[sortColumn]
      let vb = b[sortColumn]
      if (sortColumn === 'memberGroup' || sortColumn === 'product' || sortColumn === 'feasibilityStatus') {
        va = String(va ?? '').toLowerCase()
        vb = String(vb ?? '').toLowerCase()
        return dir * (va < vb ? -1 : va > vb ? 1 : 0)
      }
      if (sortColumn === 'quantity' || sortColumn === 'oneTimeTotal' || sortColumn === 'recurringTotal') {
        return dir * ((Number(va) || 0) - (Number(vb) || 0))
      }
      return 0
    })
  }
  const visibleRows = rowsToDisplay.slice(0, displayedCount)
  const hasMore = displayedCount < rowsToDisplay.length

  // Totals from summary rows excluding deleted
  const totals = useMemo(() => {
    const activeRows = summaryRows.filter((r) => !deletedIds.has(r.id))
    const oneTime = activeRows.reduce((s, r) => s + (r.oneTimeTotal || 0), 0)
    const monthly = activeRows.reduce((s, r) => s + (r.recurringTotal || 0), 0)
    return { oneTimeTotal: oneTime, monthlyTotal: monthly, quoteTotal: oneTime + monthly }
  }, [summaryRows, deletedIds])
  useEffect(() => {
    onTotalsChange?.(totals)
  }, [totals.oneTimeTotal, totals.monthlyTotal, totals.quoteTotal, onTotalsChange])

  const feasibilityErrorCount = summaryRows.filter((r) => r.product === 'MPLS' && r.feasibilityStatus === 'Failure').length

  const handleSort = (column) => {
    const nextDir = sortColumn === column ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc'
    setSortColumn(column)
    setSortDirection(nextDir)
  }

  return (
    <div className="flex flex-col min-h-0 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Warning scoped notification */}
      {feasibilityErrorCount > 0 && !notificationDismissed && (
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FDF1DB]" role="status">
            <span className="flex items-center justify-center shrink-0" aria-hidden="true">
              <svg className="w-5 h-5 text-amber-800 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </span>
            <p className="text-sm font-medium flex-1 min-w-0 text-amber-900">
              {feasibilityErrorCount} locations with the specific MPLS product have feasibility errors that needs to be sorted{' '}
              <button
                type="button"
                onClick={() => setShowFeasibilityErrorOnly(true)}
                className="underline text-amber-900 hover:text-amber-950 focus:outline-none"
              >
                show records with feasibility error
              </button>
            </p>
            <button
              type="button"
              onClick={() => setNotificationDismissed(true)}
              className="shrink-0 p-1 rounded-full text-amber-900 hover:bg-amber-900/10 focus:outline-none"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toolbar: Filter by (left) | Search (right) */}
      <div className="flex flex-col gap-3 p-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex items-center" ref={filterByRef}>
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
                <div className="absolute left-0 top-full mt-1 z-30 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-xs">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Products</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setFeasibilityDropdownOpen(false); setProductDropdownOpen((o) => !o) }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-left text-xs text-gray-600"
                        >
                          <span>{productFilter == null ? 'All Products' : productFilter}</span>
                          <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {productDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-0.5 py-0.5 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button type="button" onClick={() => { setProductFilter(null); setProductDropdownOpen(false) }} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">All Products</button>
                            {PRODUCTS.map((p) => (
                              <button key={p} type="button" onClick={() => { setProductFilter(p); setProductDropdownOpen(false) }} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">{p}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Feasibility status</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setProductDropdownOpen(false); setFeasibilityDropdownOpen((o) => !o) }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-left text-xs text-gray-600"
                        >
                          <span>{feasibilityFilter == null ? 'All Status' : feasibilityFilter}</span>
                          <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {feasibilityDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-0.5 py-0.5 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button type="button" onClick={() => { setFeasibilityFilter(null); setFeasibilityDropdownOpen(false) }} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">All Status</button>
                            {FEASIBILITY_STATUSES.map((s) => (
                              <button key={s} type="button" onClick={() => { setFeasibilityFilter(s); setFeasibilityDropdownOpen(false) }} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50">{s}</button>
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
                onKeyDown={(e) => { if (e.key === 'Enter') { setSearchFilter(searchInput.trim() || null); setShowSearchSuggestions(false) } }}
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
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs border-b border-gray-100">
        <p className="text-gray-600">
          Showing 1 to {Math.min(displayedCount, rowsToDisplay.length)} of {rowsToDisplay.length} records
          {showFeasibilityErrorOnly && <span> • Showing only records with feasibility error</span>}
          {searchFilter != null && String(searchFilter).trim() !== '' && <span> • Matching search</span>}
        </p>
        {showFeasibilityErrorOnly ? (
          <button type="button" onClick={() => setShowFeasibilityErrorOnly(false)} className="text-blue-600 hover:underline font-medium">
            Show all records
          </button>
        ) : null}
      </div>

      <div className="overflow-x-auto flex flex-col min-h-0" style={{ height: '24rem' }}>
        <div className="overflow-y-auto border-b border-gray-100 min-h-0" style={{ height: '22rem' }}>
          <table className="w-full text-xs leading-tight table-fixed">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-10 pl-4 pr-2 py-1 text-left">
                  <input type="checkbox" className="rounded-md border-gray-300 text-blue-600 w-3.5 h-3.5" aria-label="Select all" />
                </th>
                <th className="w-40 px-2 py-1 text-left font-semibold text-gray-700 text-xs">
                  <span className="inline-flex items-center gap-0.5 truncate max-w-full">
                    <SortIcon column="memberGroup" sortColumn={sortColumn} sortDirection={sortDirection} onClick={() => handleSort('memberGroup')} />
                    <span className="truncate">Member/Group</span>
                  </span>
                </th>
                <th className="w-24 px-2 py-1 text-left font-semibold text-gray-700 text-xs">
                  <span className="inline-flex items-center gap-0.5 truncate max-w-full">
                    <SortIcon column="product" sortColumn={sortColumn} sortDirection={sortDirection} onClick={() => handleSort('product')} />
                    <span className="truncate">Product</span>
                  </span>
                </th>
                <th className="w-28 px-2 py-1 text-left font-semibold text-gray-700 text-xs">
                  <span className="inline-flex items-center gap-0.5 truncate max-w-full">
                    <SortIcon column="feasibilityStatus" sortColumn={sortColumn} sortDirection={sortDirection} onClick={() => handleSort('feasibilityStatus')} />
                    <span className="truncate">Feasibility Status</span>
                  </span>
                </th>
                <th className="w-20 px-2 py-1 text-left font-semibold text-gray-700 text-xs">
                  <span className="inline-flex items-center gap-0.5 truncate max-w-full">
                    <SortIcon column="quantity" sortColumn={sortColumn} sortDirection={sortDirection} onClick={() => handleSort('quantity')} />
                    <span className="truncate">Quantity</span>
                  </span>
                </th>
                <th className="w-24 px-2 py-1 text-left font-semibold text-gray-700 text-xs">
                  <span className="inline-flex items-center gap-0.5 truncate max-w-full">
                    <SortIcon column="oneTimeTotal" sortColumn={sortColumn} sortDirection={sortDirection} onClick={() => handleSort('oneTimeTotal')} />
                    <span className="truncate">One Time Total</span>
                  </span>
                </th>
                <th className="w-24 px-2 py-1 text-left font-semibold text-gray-700 text-xs">
                  <span className="inline-flex items-center gap-0.5 truncate max-w-full">
                    <SortIcon column="recurringTotal" sortColumn={sortColumn} sortDirection={sortDirection} onClick={() => handleSort('recurringTotal')} />
                    <span className="truncate">Recurring Total</span>
                  </span>
                </th>
                <th className="w-28 px-2 py-1 text-left font-semibold text-gray-700 text-xs">Billing Account</th>
                <th className="w-28 px-2 py-1 text-left font-semibold text-gray-700 text-xs">Service ID</th>
                <th className="w-24 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs">Connect Date</th>
                <th className="w-9 px-2 py-1" aria-label="Row actions" />
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-gray-50/50 ${idx % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                >
                  <td className="pl-4 pr-2 py-1 align-middle">
                    <input type="checkbox" className="rounded-md border-gray-300 text-blue-600 w-3.5 h-3.5" aria-label="Select row" />
                  </td>
                  <td className="px-2 py-1 text-gray-800 align-middle min-w-0 truncate" title={row.memberGroup}>{row.memberGroup || '—'}</td>
                  <td className="px-2 py-1 text-gray-800 align-middle truncate">{row.product}</td>
                  <td className="px-2 py-1 align-middle">
                    <FeasibilityBadge status={row.feasibilityStatus} />
                  </td>
                  <td className="px-2 py-1 text-gray-800 align-middle">{row.quantity}</td>
                  <td className="px-2 py-1 text-gray-800 align-middle">${row.oneTimeTotal}</td>
                  <td className="px-2 py-1 text-gray-800 align-middle">${row.recurringTotal}</td>
                  <td className="px-2 py-1 text-gray-500 align-middle truncate">{row.billingAccount}</td>
                  <td className="px-2 py-1 text-gray-500 align-middle truncate">{row.serviceId}</td>
                  <td className="px-2 py-1 text-gray-500 align-middle truncate">{row.connectDate}</td>
                  <td className="px-2 py-1 align-middle">
                    <div
                      className="relative inline-block"
                      ref={openMenuRowId === row.id ? menuAnchorRef : null}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuRowId((prev) => (prev === row.id ? null : row.id))
                        }}
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 shrink-0"
                        aria-label="Row actions"
                        aria-expanded={openMenuRowId === row.id}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {openMenuRowId === row.id && (
                        <div className="absolute right-0 top-full mt-1 z-20 min-w-[6rem] py-1 bg-white border border-gray-300 rounded-lg shadow-sm">
                          <button
                            type="button"
                            className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                            onClick={() => setOpenMenuRowId(null)}
                          >
                            Add Product
                          </button>
                          <button
                            type="button"
                            className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                            onClick={() => {
                              setDeleteModalRow({ id: row.id, memberGroup: row.memberGroup })
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
              ))}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className="flex-shrink-0 flex items-center justify-center w-full px-2 min-h-[1.75rem] py-1 bg-white border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => setDisplayedCount((prev) => Math.min(prev + 10, rowsToDisplay.length))}
              className="text-blue-600 hover:underline font-medium text-xs"
            >
              Load more
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation modal - same as Extracted Information tab */}
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
              Are you sure you want to delete this record for {deleteModalRow.memberGroup}?
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
                className="px-5 py-2.5 text-base font-normal text-white bg-[#003366] rounded-full hover:bg-[#002244]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SummaryTabContent
export { buildSummaryRows }
