import React, { useState } from 'react'

const casesData = [
  { caseId: '000010001', contactName: 'Edward Stamos', subject: 'Case 2: The widgets received are wrong size', priority: 'High' },
  { caseId: '000010002', contactName: 'Edward Stamos', subject: 'Case 3: Cannot track our order', priority: 'Low' },
]

const contactsData = [
  { name: 'Horward Jones', title: 'Buyer', email: 'horwardjones@cumulus.com', phone: '(212) 555-5555' },
  { name: 'Edward Stamos', title: 'President and CEO', email: 'edwardstamos@cumulus.com', phone: '(212) 655-8585' },
  { name: 'Leanne Tomlin', title: 'VP Customer Support', email: 'leannetomlin@cumulus.com', phone: '(212) 342-0055' },
]

const assetGroups = [
  {
    name: '4G Infra',
    count: 2,
    rows: [
      { assetName: '4G Infra', lsi: '800023042581285', status: 'Active', solutionId: '', serviceAccount: 'STATE BANK OF BIKANER & JAIPUR (Service Account)', circuitId: '', bandWidth: '', assetInstallation: '2025-04-23T13:26' },
      { assetName: '4G Infra', lsi: '800007102584187', status: 'Active', solutionId: '', serviceAccount: 'STATE BANK OF BIKANER & JAIPUR1 (Service Account)', circuitId: '', bandWidth: '', assetInstallation: '2025-10-07T04:29' },
    ],
  },
  {
    name: 'Account Commitment',
    count: 26,
    rows: [
      { assetName: 'Account Commitment', lsi: '800004122463683', status: 'Active', solutionId: 'SL-2024120413503228778', serviceAccount: 'STATE BANK OF BIKANER & JAIPUR1 (Service Account)', circuitId: '', bandWidth: '', assetInstallation: '2024-12-04T00:00' },
      { assetName: 'Account Commitment', lsi: '800008052594787', status: 'Active', solutionId: '', serviceAccount: 'STATE BANK OF BIKANER & JAIPUR1 (Service Account)', circuitId: '', bandWidth: '', assetInstallation: '2025-05-08T13:06' },
      { assetName: 'Account Commitment', lsi: '800009052512951', status: 'Active', solutionId: '', serviceAccount: 'STATE BANK OF BIKANER & JAIPUR1 (Service Account)', circuitId: '', bandWidth: '', assetInstallation: '2025-05-09T07:11' },
      { assetName: 'Account Commitment', lsi: '800009052593776', status: 'Active', solutionId: '', serviceAccount: 'STATE BANK OF BIKANER & JAIPUR1 (Service Account)', circuitId: '', bandWidth: '', assetInstallation: '2025-05-09T07:55' },
      { assetName: 'Account Commitment', lsi: '800009052570216', status: 'Active', solutionId: '', serviceAccount: 'STATE BANK OF BIKANER & JAIPUR1 (Service Account)', circuitId: '', bandWidth: '', assetInstallation: '2025-05-09T12:47' },
      { assetName: 'Account Commitment', lsi: '800009052542190', status: 'Active', solutionId: '', serviceAccount: 'STATE BANK OF BIKANER & JAIPUR1 (Service Account)', circuitId: '', bandWidth: '', assetInstallation: '2025-05-09T12:49' },
      { assetName: 'Account Commitment', lsi: '800019052597424', status: 'Deleted', solutionId: '', serviceAccount: 'STATE BANK OF BIKANER & JAIPUR1 (Service Account)', circuitId: '', bandWidth: '', assetInstallation: '2025-05-19T00:00' },
      { assetName: 'Account Commitment', lsi: '800028052523019', status: 'Active', solutionId: '', serviceAccount: 'STATE BANK OF BIKANER & JAIPUR1 (Service Account)', circuitId: '', bandWidth: '', assetInstallation: '2025-05-28T00:00' },
    ],
  },
]

const ACCOUNT_TABS = ['Details', 'Related', 'Activity', 'Relationship', 'Service Request Dashboard', 'Billing Dashboard', 'Assets']

function OverviewChipIcon({ type, className }) {
  const c = className || 'w-5 h-5'
  if (type === 'contacts') return (
    <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
  )
  if (type === 'person') return (
    <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
  )
  if (type === 'briefcase') return (
    <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
  )
  if (type === 'ledger') return (
    <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>
  )
  if (type === 'payment') return (
    <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
  )
  if (type === 'document') return (
    <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
  )
  if (type === 'crown') return (
    <svg className={c} fill="currentColor" viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 2H5v2h14v-2z"/></svg>
  )
  return null
}

const ASSET_TABLE_HEADERS = [
  { key: 'checkbox', label: '', width: 'w-8' },
  { key: 'assetName', label: 'Asset Name' },
  { key: 'lsi', label: 'LSI' },
  { key: 'status', label: 'Status' },
  { key: 'solutionId', label: 'Solution Id' },
  { key: 'serviceAccount', label: 'Service Account' },
  { key: 'circuitId', label: 'Circuit Id' },
  { key: 'bandWidth', label: 'Band Width' },
  { key: 'assetInstallation', label: 'Asset Installation' },
]

function AccountsPage() {
  const [subTab, setSubTab] = useState('Assets')
  const [expandedAssetGroups, setExpandedAssetGroups] = useState(() =>
    Object.fromEntries(assetGroups.map((g) => [g.name, true]))
  )
  const toggleAssetGroup = (name) => {
    setExpandedAssetGroups((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Account header card - match Quote page look and feel */}
      <div className="bg-screenshot-grey border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">
        <div className="bg-screenshot-grey flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-gray-200">
          {/* Left: Icon + Account / HDFC Bank */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded flex items-center justify-center shrink-0 bg-emerald-600 text-white" aria-hidden="true">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-base text-gray-900">
                <span className="block font-normal">Account</span>
                <span className="block font-bold">HDFC Bank</span>
              </h1>
            </div>
          </div>
          {/* Right: Action buttons - Airtel red, gray border, rounded-md (same as Quote) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg"
            >
              Create Enterprise Quote
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg"
            >
              Create Enterprise Order
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg"
            >
              New Contract
              <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        {/* Summary stats row - same structure as Quote page */}
        <div className="flex flex-wrap items-center gap-8 px-5 py-4 bg-white">
          <div>
            <p className="text-xs text-gray-500 tracking-wide">Contacts</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">4</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 tracking-wide">Statements</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">12</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 tracking-wide">Cases</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">2</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 tracking-wide">Account Balances</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">10</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 tracking-wide">Opportunities</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">18</p>
          </div>
        </div>
      </div>

      {/* Content after header - unified white card (screenshot 2 layout) */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Sub-tabs from ACCOUNT_TABS */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-1 px-4 min-w-max">
            {ACCOUNT_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSubTab(tab)}
                className={`px-4 py-3 text-xs font-medium border-b-2 -mb-px ${
                  subTab === tab ? 'text-airtel-red border-airtel-red' : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Related tab content - Cases, Contacts, To Do List */}
        {subTab === 'Related' && (
        <div className="flex flex-col">
          {/* Cases section */}
          <div className="border-b border-gray-200 last:border-b-0">
            <div className="flex items-center justify-between px-4 py-3 bg-grey-bg border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-orange-600"><OverviewChipIcon type="briefcase" className="w-5 h-5" /></span>
                <span className="text-sm font-semibold text-gray-900">Cases(2)</span>
              </div>
              <span className="px-2 py-1 rounded bg-airtel-red text-white text-xs font-medium uppercase">New</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-grey-bg">
                    <th className="px-4 py-2.5 font-medium text-gray-700">Case</th>
                    <th className="px-4 py-2.5 font-medium text-gray-700">Contact Name</th>
                    <th className="px-4 py-2.5 font-medium text-gray-700">Subject</th>
                    <th className="px-4 py-2.5 font-medium text-gray-700">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {casesData.map((row, i) => (
                    <tr key={row.caseId} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-2.5 text-gray-800">{row.caseId}</td>
                      <td className="px-4 py-2.5 text-gray-800">{row.contactName}</td>
                      <td className="px-4 py-2.5"><a href="#" className="text-airtel-red hover:underline">{row.subject}</a></td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1 text-gray-800">
                          {row.priority}
                          <svg className="w-3.5 h-3.5 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t border-gray-100">
              <a href="#" className="text-xs text-gray-600 hover:underline">View All</a>
            </div>
          </div>

          {/* Contacts section */}
          <div>
            <div className="flex items-center justify-between px-4 py-3 bg-grey-bg border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-purple-600"><OverviewChipIcon type="contacts" className="w-5 h-5" /></span>
                <span className="text-sm font-semibold text-gray-900">Contacts(4)</span>
              </div>
              <span className="px-2 py-1 rounded bg-airtel-red text-white text-xs font-medium uppercase">New</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-grey-bg">
                    <th className="px-4 py-2.5 font-medium text-gray-700">Contact Name</th>
                    <th className="px-4 py-2.5 font-medium text-gray-700">Title</th>
                    <th className="px-4 py-2.5 font-medium text-gray-700">Email</th>
                    <th className="px-4 py-2.5 font-medium text-gray-700">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {contactsData.map((row, i) => (
                    <tr key={row.email} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-2.5 text-gray-800">{row.name}</td>
                      <td className="px-4 py-2.5 text-gray-800">{row.title}</td>
                      <td className="px-4 py-2.5"><a href="#" className="text-airtel-red hover:underline">{row.email}</a></td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1 text-gray-800">
                          {row.phone}
                          <svg className="w-3.5 h-3.5 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t border-gray-100">
              <a href="#" className="text-xs text-gray-600 hover:underline">View All</a>
            </div>
          </div>
        </div>
      )}

      {subTab === 'Details' && (
        <div className="p-6 text-sm text-gray-600">Details content placeholder.</div>
      )}

      {['Activity', 'Relationship', 'Service Request Dashboard', 'Billing Dashboard'].includes(subTab) && (
        <div className="p-6 text-sm text-gray-600">{subTab} content placeholder.</div>
      )}

      {subTab === 'Assets' && (
        <div className="flex flex-col">
          {/* Filters and search */}
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-200 bg-grey-bg">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">View By:</span>
              <select className="text-xs border border-gray-300 rounded px-2 py-1.5 bg-white">
                <option>Asset Name</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Displaying:</span>
              <select className="text-xs border border-gray-300 rounded px-2 py-1.5 bg-white">
                <option>All</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Search by fields:</span>
              <select className="text-xs border border-gray-300 rounded px-2 py-1.5 bg-white">
                <option>Select Field</option>
              </select>
            </div>
            <div className="flex items-center gap-1 flex-1 min-w-[200px]">
              <input type="text" placeholder="Search..." className="flex-1 text-xs border border-gray-300 rounded px-2 py-1.5" />
              <button type="button" className="px-3 py-1.5 rounded bg-airtel-red text-white text-xs font-medium">Q Search</button>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50">Asset Bulk Upload</button>
              <button type="button" className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50">Coupling Decoupling</button>
              <button type="button" className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50">Add Assets to Q</button>
            </div>
          </div>
          <p className="px-4 py-2 text-xs text-gray-600">Showing 1 to 10 of 1038 records.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-grey-bg">
                  <th className="px-4 py-2.5 w-8"><input type="checkbox" className="rounded" /></th>
                  <th className="px-4 py-2.5 font-medium text-gray-700">Asset Name</th>
                  <th className="px-4 py-2.5 font-medium text-gray-700">LSI</th>
                  <th className="px-4 py-2.5 font-medium text-gray-700">Status</th>
                  <th className="px-4 py-2.5 font-medium text-gray-700">Solution Id</th>
                  <th className="px-4 py-2.5 font-medium text-gray-700">Service Account</th>
                  <th className="px-4 py-2.5 font-medium text-gray-700">Circuit Id</th>
                  <th className="px-4 py-2.5 font-medium text-gray-700">Band Width</th>
                  <th className="px-4 py-2.5 font-medium text-gray-700">Asset Installation</th>
                </tr>
              </thead>
              <tbody>
                {assetGroups.map((group) => (
                  <React.Fragment key={group.name}>
                    <tr
                      className="border-b border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleAssetGroup(group.name)}
                    >
                      <td className="px-4 py-2.5"><input type="checkbox" className="rounded" onClick={(e) => e.stopPropagation()} /></td>
                      <td className="px-4 py-2.5 col-span-8" colSpan={8}>
                        <span className="inline-flex items-center gap-1 text-gray-800 font-medium">
                          <svg
                            className={`w-4 h-4 text-gray-500 transition-transform ${expandedAssetGroups[group.name] ? 'rotate-90' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          {group.name} ({group.count})
                        </span>
                      </td>
                    </tr>
                    {expandedAssetGroups[group.name] && (
                      <>
                        <tr className="border-b border-gray-200 bg-grey-bg">
                          <th className="px-4 py-2.5 w-8"></th>
                          <th className="px-4 py-2.5 font-medium text-gray-700">Asset Name</th>
                          <th className="px-4 py-2.5 font-medium text-gray-700">LSI</th>
                          <th className="px-4 py-2.5 font-medium text-gray-700">Status</th>
                          <th className="px-4 py-2.5 font-medium text-gray-700">Solution Id</th>
                          <th className="px-4 py-2.5 font-medium text-gray-700">Service Account</th>
                          <th className="px-4 py-2.5 font-medium text-gray-700">Circuit Id</th>
                          <th className="px-4 py-2.5 font-medium text-gray-700">Band Width</th>
                          <th className="px-4 py-2.5 font-medium text-gray-700">Asset Installation</th>
                        </tr>
                        {group.rows.map((row, i) => (
                          <tr key={`${group.name}-${row.lsi}-${i}`} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-4 py-2.5"><input type="checkbox" className="rounded" /></td>
                            <td className="px-4 py-2.5 text-gray-800">{row.assetName}</td>
                            <td className="px-4 py-2.5 text-gray-800">{row.lsi}</td>
                            <td className="px-4 py-2.5 text-gray-800">{row.status}</td>
                            <td className="px-4 py-2.5 text-gray-800">{row.solutionId || '—'}</td>
                            <td className="px-4 py-2.5 text-gray-800">{row.serviceAccount}</td>
                            <td className="px-4 py-2.5 text-gray-800">{row.circuitId || '—'}</td>
                            <td className="px-4 py-2.5 text-gray-800">{row.bandWidth || '—'}</td>
                            <td className="px-4 py-2.5 text-gray-800">{row.assetInstallation}</td>
                          </tr>
                        ))}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* To Do List footer - inside card, only for Related tab */}
      {subTab === 'Related' && (
      <div className="mt-auto pt-4 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-600 px-4 py-3">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded border-2 border-gray-400 bg-white" aria-hidden="true">
          <svg className="w-3.5 h-3.5 text-airtel-red" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
        <span>To Do List</span>
      </div>
      )}
    </div>
    </div>
  )
}

export default AccountsPage
