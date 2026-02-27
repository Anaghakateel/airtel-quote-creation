import { useState } from 'react'

const overviewChips = [
  { label: 'Contacts', count: 4, icon: 'contacts', color: 'text-purple-600' },
  { label: 'Statements', count: 12, icon: 'person', color: 'text-blue-600' },
  { label: 'Cases', count: 2, icon: 'briefcase', color: 'text-orange-600' },
  { label: 'Account Balances', count: 10, icon: 'ledger', color: 'text-purple-600' },
  { label: 'Payments/Adjustments...', count: null, icon: 'payment', color: 'text-green-600' },
  { label: 'Notes/Attachments', count: 6, icon: 'document', color: 'text-orange-600' },
  { label: 'Opportunities', count: 18, icon: 'crown', color: 'text-red-600' },
]

const casesData = [
  { caseId: '000010001', contactName: 'Edward Stamos', subject: 'Case 2: The widgets received are wrong size', priority: 'High' },
  { caseId: '000010002', contactName: 'Edward Stamos', subject: 'Case 3: Cannot track our order', priority: 'Low' },
]

const contactsData = [
  { name: 'Horward Jones', title: 'Buyer', email: 'horwardjones@cumulus.com', phone: '(212) 555-5555' },
  { name: 'Edward Stamos', title: 'President and CEO', email: 'edwardstamos@cumulus.com', phone: '(212) 655-8585' },
  { name: 'Leanne Tomlin', title: 'VP Customer Support', email: 'leannetomlin@cumulus.com', phone: '(212) 342-0055' },
]

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

function AccountsPage() {
  const [subTab, setSubTab] = useState('Related')

  return (
    <div className="flex flex-col gap-6">
      {/* Account title + actions */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-lg bg-[#032d60] flex items-center justify-center text-white shrink-0">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Account</p>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5">HDFC Bank</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="px-4 py-2 border border-blue-600 rounded-full bg-white text-blue-600 text-xs font-medium hover:bg-gray-50"
          >
            Create Enterprise Quote
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-blue-600 rounded-full bg-white text-blue-600 text-xs font-medium hover:bg-gray-50"
          >
            Create Enterprise Order
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 px-4 py-2 border border-blue-600 rounded-full bg-white text-blue-600 text-xs font-medium hover:bg-gray-50"
          >
            New Contract
            <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Overview chips */}
      <div className="flex flex-wrap gap-2">
        {overviewChips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 text-xs font-medium hover:bg-gray-50 hover:border-gray-300"
          >
            <span className={chip.color}>
              <OverviewChipIcon type={chip.icon} className="w-4 h-4" />
            </span>
            <span className="border-b border-dotted border-gray-400 border-opacity-60">{chip.label}{chip.count != null ? `(${chip.count})` : ''}</span>
          </button>
        ))}
      </div>

      {/* Sub-tabs: Details, Related, Assets */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1">
          {['Details', 'Related', 'Assets'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSubTab(tab)}
              className={`px-4 py-3 text-xs font-medium border-b-2 -mb-px ${
                subTab === tab ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Related tab content */}
      {subTab === 'Related' && (
        <div className="flex flex-col gap-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Cases section */}
          <div className="border-b border-gray-200 last:border-b-0">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-orange-600"><OverviewChipIcon type="briefcase" className="w-5 h-5" /></span>
                <span className="text-sm font-semibold text-gray-900">Cases(2)</span>
              </div>
              <button type="button" className="px-3 py-1.5 border border-blue-600 rounded-full bg-white text-blue-600 text-xs font-medium hover:bg-blue-50">New</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-2.5 font-medium text-gray-700">Case</th>
                    <th className="px-4 py-2.5 font-medium text-gray-700">Contact Name</th>
                    <th className="px-4 py-2.5 font-medium text-gray-700">Subject</th>
                    <th className="px-4 py-2.5 font-medium text-gray-700">Priority</th>
                    <th className="w-10 px-2 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {casesData.map((row) => (
                    <tr key={row.caseId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2.5"><a href="#" className="text-blue-600 hover:underline">{row.caseId}</a></td>
                      <td className="px-4 py-2.5"><a href="#" className="text-blue-600 hover:underline">{row.contactName}</a></td>
                      <td className="px-4 py-2.5"><a href="#" className="text-blue-600 hover:underline">{row.subject}</a></td>
                      <td className="px-4 py-2.5 text-gray-800">{row.priority}</td>
                      <td className="px-2 py-2.5">
                        <button type="button" className="p-1 rounded-full text-gray-500 hover:bg-gray-200" aria-label="Actions">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t border-gray-100">
              <a href="#" className="text-xs text-blue-600 hover:underline">View All</a>
            </div>
          </div>

          {/* Contacts section */}
          <div>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-purple-600"><OverviewChipIcon type="contacts" className="w-5 h-5" /></span>
                <span className="text-sm font-semibold text-gray-900">Contacts(4)</span>
              </div>
              <button type="button" className="px-3 py-1.5 border border-blue-600 rounded-full bg-white text-blue-600 text-xs font-medium hover:bg-blue-50">New</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-2.5 font-medium text-gray-700">Contact Name</th>
                    <th className="px-4 py-2.5 font-medium text-gray-700">Title</th>
                    <th className="px-4 py-2.5 font-medium text-gray-700">Email</th>
                    <th className="px-4 py-2.5 font-medium text-gray-700">Phone</th>
                    <th className="w-10 px-2 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {contactsData.map((row) => (
                    <tr key={row.email} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2.5"><a href="#" className="text-blue-600 hover:underline">{row.name}</a></td>
                      <td className="px-4 py-2.5 text-gray-800">{row.title}</td>
                      <td className="px-4 py-2.5"><a href="#" className="text-blue-600 hover:underline">{row.email}</a></td>
                      <td className="px-4 py-2.5 text-gray-800">{row.phone}</td>
                      <td className="px-2 py-2.5">
                        <button type="button" className="p-1 rounded-full text-gray-500 hover:bg-gray-200" aria-label="Actions">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t border-gray-100">
              <a href="#" className="text-xs text-blue-600 hover:underline">View All</a>
            </div>
          </div>
        </div>
      )}

      {subTab === 'Details' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-sm text-gray-600">Details content placeholder.</div>
      )}

      {subTab === 'Assets' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-sm text-gray-600">Assets content placeholder.</div>
      )}

      {/* To Do List footer */}
      <div className="mt-auto pt-4 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-600">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span>To Do List</span>
      </div>
    </div>
  )
}

export default AccountsPage
