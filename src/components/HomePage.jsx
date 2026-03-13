import { useState } from 'react'

export default function HomePage({ onRefresh }) {
  const [dashboardTab, setDashboardTab] = useState('Home Page Dashboard')
  const [appointmentsTab, setAppointmentsTab] = useState('Appointments')

  const approvalItems = [
    { type: 'Quote', ref: 'test_opp_12', submitter: 'Vivek Kumar' },
    { type: 'Quote', ref: 'IQ opp ashrit2', submitter: 'Ashrit Udupa' },
    { type: 'Quote', ref: 'N/W_API_USD_1', submitter: 'Ashish Motgi' },
  ]

  const dashboardTabs = ['Home Page Dashboard', 'Account Dashboard', 'Lead Dashboard', 'Opportunity Dashboard']
  const appointmentsTabs = ['Appointments', 'Tasks', 'Einstein']

  return (
    <div className="flex flex-col min-h-0 flex-1 p-1.5 w-full max-w-full overflow-visible">
      <div className="flex gap-1.5 flex-1 min-h-0 w-full">
        {/* Left column - Items to Approve + Dashboard tabs */}
        <div className="flex flex-col gap-1 flex-[2] min-w-0 shrink">
          {/* Items to Approve - with list */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Items to Approve</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {approvalItems.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-gray-50/50">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-900">Quote – {item.ref}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Approval Process Extension Submitted by {item.submitter}</p>
                  </div>
                  <button type="button" className="shrink-0 p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-grey-bg" aria-label="More options">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-4 py-2 border-t border-gray-100">
              <button type="button" className="text-xs font-medium text-airtel-red hover:underline">View All</button>
            </div>
          </div>

          {/* Items to Approve - empty state */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Items to Approve</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 mb-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <p className="text-sm font-medium text-gray-700">No Items to Approve</p>
              <p className="text-xs text-gray-500 mt-1">There are currently no items available for approval.</p>
            </div>
          </div>

          {/* Dashboard tabs */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200">
              {dashboardTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDashboardTab(tab)}
                  className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 -mb-px ${
                    dashboardTab === tab ? 'text-airtel-red border-airtel-red' : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-4 min-h-[100px] text-xs text-gray-500">
              {dashboardTab} content
            </div>
          </div>
        </div>

        {/* Right column - Appointments, Tasks, Einstein + Opportunity Close Date (visible behind Agentforce panel) */}
        <div className="flex flex-col gap-1 flex-[1] min-w-[320px] shrink-0">
          {/* Appointments / Tasks / Einstein */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200">
              {appointmentsTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setAppointmentsTab(tab)}
                  className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px ${
                    appointmentsTab === tab ? 'text-airtel-red border-airtel-red' : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Today&apos;s Events</h3>
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50/50 rounded-lg border border-gray-100">
                <div className="w-28 h-20 flex items-center justify-center text-sky-200 mb-4" aria-hidden>
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <p className="text-sm font-medium text-gray-700">Looks like you&apos;re free and clear the rest of the day.</p>
                <button type="button" className="mt-4 px-4 py-2 rounded-md bg-airtel-red text-white text-xs font-medium hover:opacity-90">View Calendar</button>
              </div>
            </div>
          </div>

          {/* Opportunity Close Date in Past */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Opportunity Close Date in Past</h2>
            </div>
            <div className="p-4 flex-1 min-h-0 flex flex-col">
              <div className="flex gap-4 flex-1 min-h-0">
                <div className="flex-1 min-h-[200px] flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50/30">
                  <div className="text-center text-gray-500 text-xs">
                    <p className="font-medium text-gray-600">Record Count</p>
                    <p className="mt-2">Bar chart (0 – 200)</p>
                    <p className="mt-1 text-gray-400">Close Date 17/02/2026 – 07/03/2026</p>
                  </div>
                </div>
                <div className="w-48 shrink-0 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50/30">
                  <p className="text-xs font-medium text-gray-700 mb-2">Opportunity Name</p>
                  {['HDFC BANK LIMITED - 050226', 'ILL_check2ndMarch', 'ILL_new_26thFeb', 'IQ_whatsapp_25thFeb', 'Non Standard Bandwidth check', 'NW CHNG', 'QA Bill Consolidation', 'QA testing bILL consolidation', 'test Shifting Opp'].map((name, i) => (
                    <div key={i} className="flex items-center gap-2 py-1 text-xs text-gray-600">
                      <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: `hsl(${(i * 37) % 360}, 60%, 50%)` }} />
                      <span className="truncate">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" className="mt-3 text-xs font-medium text-airtel-red hover:underline">View Report</button>
            </div>
            <div className="px-4 py-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Sort by:</span>
                <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700">Most Recent Activity</select>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Q</span>
                  <input type="text" placeholder="Search this feed..." className="text-xs border border-gray-300 rounded pl-5 pr-2 py-1 w-40" />
                </div>
                <button type="button" className="p-1.5 rounded text-gray-500 hover:bg-grey-bg" aria-label="Filter"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                <button
                  type="button"
                  onClick={() => onRefresh?.()}
                  className="p-1.5 rounded text-gray-500 hover:bg-grey-bg"
                  aria-label="Refresh"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
              </div>
            </div>
            <p className="px-4 pb-2 text-xs text-gray-400">As of Today at 12:02 pm</p>
          </div>
        </div>
      </div>
    </div>
  )
}
