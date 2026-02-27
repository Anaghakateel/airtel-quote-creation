import { useState } from 'react'

// Parse street display from "number, Street, City, State, India"
function getStreetDisplay(streetAddress) {
  if (!streetAddress || typeof streetAddress !== 'string') return ''
  const parts = streetAddress.split(',').map((p) => p.trim())
  return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0] || ''
}

function LocationsTabContent({ locations = [] }) {
  const [displayedCount, setDisplayedCount] = useState(10)
  const visibleLocations = locations.slice(0, displayedCount)
  const hasMore = displayedCount < locations.length

  return (
    <div className="flex flex-col min-h-0 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Success scoped notification: address validation completed for all locations */}
      {locations.length > 0 && (
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#B9E6E5]" role="status">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#2D8C8C] text-white shrink-0" aria-hidden="true">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <p className="text-sm font-medium flex-1 min-w-0 text-[#1a6b6b]">
              The address validation is successfully completed for all {locations.length} locations
            </p>
          </div>
        </div>
      )}
      {/* Toolbar: View By, Displaying, Search - simplified to match screenshot 2 */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-600">View By</span>
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full bg-white text-xs text-blue-600"
          >
            No Grouping
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="text-xs text-gray-600">Displaying</span>
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full bg-white text-xs text-blue-600"
          >
            Address Validation
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="relative w-48">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search this list"
            className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-full text-xs w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs border-b border-gray-100">
        <p className="text-gray-600">
          Showing 1 to {Math.min(displayedCount, locations.length)} of {locations.length} locations • 0 records selected
        </p>
        <button
          type="button"
          className="font-medium text-gray-400 cursor-default"
        >
          View Selected(0)
        </button>
      </div>

      <div className="overflow-x-auto flex flex-col min-h-0" style={{ height: '24rem' }}>
        <div className="overflow-y-auto border-b border-gray-100 min-h-0" style={{ height: '22rem' }}>
          <table className="w-full text-xs leading-tight table-fixed">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-10 pl-4 pr-2 py-1 text-left">
                  <input
                    type="checkbox"
                    className="rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    aria-label="Select all"
                  />
                </th>
                <th className="w-40 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs">Street Address</th>
                <th className="w-28 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs">City</th>
                <th className="w-24 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs">State</th>
                <th className="w-20 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs">Country</th>
                <th className="w-24 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs">Postal Code</th>
                <th className="w-28 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs">Location Type</th>
                <th className="w-28 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs">Pincode Validation</th>
                <th className="w-28 px-2 py-1 text-left font-semibold text-gray-700 truncate text-xs">
                  <span className="inline-flex items-center gap-0.5">
                    Address Validation
                    <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleLocations.map((loc, idx) => {
                const street = getStreetDisplay(loc.streetAddress)
                const city = loc.city ?? ''
                const state = loc.state ?? ''
                const country = loc.country || 'India'
                return (
                  <tr
                    key={loc.id}
                    className={`border-b border-gray-100 hover:bg-gray-50/50 ${idx % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                  >
                    <td className="pl-4 pr-2 py-1 align-middle">
                      <input
                        type="checkbox"
                        className="rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                        aria-label="Select row"
                      />
                    </td>
                    <td className="px-2 py-1 text-gray-800 align-middle min-w-0 truncate" title={street}>{street || '—'}</td>
                    <td className="px-2 py-1 text-gray-800 align-middle min-w-0 truncate" title={city}>{city || '—'}</td>
                    <td className="px-2 py-1 text-gray-800 align-middle min-w-0 truncate" title={state}>{state || '—'}</td>
                    <td className="px-2 py-1 text-gray-800 align-middle min-w-0 truncate" title={country}>{country || '—'}</td>
                    <td className="px-2 py-1 text-gray-800 align-middle min-w-0 truncate" title={loc.postalCode}>{loc.postalCode || '—'}</td>
                    <td className="px-2 py-1 text-gray-500 align-middle">—</td>
                    <td className="px-2 py-1 text-gray-500 align-middle">—</td>
                    <td className="px-2 py-1 align-middle">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white shrink-0" aria-hidden>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className="text-gray-700">Success</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className="flex-shrink-0 flex items-center justify-center w-full px-2 min-h-[1.75rem] py-1 bg-white border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => setDisplayedCount((prev) => Math.min(prev + 10, locations.length))}
              className="text-blue-600 hover:underline font-medium text-xs"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationsTabContent
