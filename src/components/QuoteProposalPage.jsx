import { useState } from 'react'
import quotesIcon from './quotes.png'

const COMPLETED_STAGES = ['Quoted', 'Assigned', 'OV in Pro', 'OV Appr', 'OV Rejec']
const UPCOMING_STAGES = ['Contract', 'Custome', 'L2 Feasi', 'L2 DOA', 'Order Cr', 'Closed']
// Draft-stage progress bar: first segment "Draft" active; rest inactive (screenshot 1)
const DRAFT_VIEW_STAGES = ['Draft', 'Negotiati...', 'Feasibilit...', 'Feasibilit...', 'DOA App...', 'DOA App...', 'DOA Reje...', 'Proposal ...', 'Proposal...', 'Assigned...', 'OV In Pro...', 'OV Appr...', 'OV Rejec...', 'Contract...', 'Custome...', 'L2 Feasi...', 'L2 DOA I...', 'L2 DOA ...']

export default function QuoteProposalPage({ progressStage = 'Proposal', onEnrichQuoteClick }) {
  const [detailsTab, setDetailsTab] = useState('Details')
  const isDraft = progressStage === 'Draft'

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Top Quote card - same grey as Quote 1; Enterprise Quote + HDFC bank connectivity across India; same button set as Quote 1 */}
      <div className="bg-screenshot-grey border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4">
        <div className="bg-screenshot-grey flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-gray-200">
          {/* Left: Icon + Enterprise Quote / HDFC bank connectivity across India (same as Quote 1) */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded flex items-center justify-center shrink-0 overflow-hidden" aria-hidden="true">
              <img src={quotesIcon} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base text-gray-900">
                <span className="block font-normal">Enterprise Quote</span>
                <span className="block font-bold">HDFC bank connectivity across India</span>
              </h1>
            </div>
          </div>
          {/* Right: Top buttons — screenshot: + Follow, Bulk Download, Bulk Upload, Download/Upload Billing Details, Enrich Quote - UI */}
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              + Follow
            </button>
            <button type="button" className="px-4 py-2 border border-gray-300 rounded-md bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg">
              Bulk Download
            </button>
            <button type="button" className="px-4 py-2 border border-gray-300 rounded-md bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg">
              Bulk Upload
            </button>
            <button type="button" className="px-4 py-2 border border-gray-300 rounded-md bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg">
              Download Billing Details
            </button>
            <button type="button" className="px-4 py-2 border border-gray-300 rounded-md bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg">
              Upload Billing Details
            </button>
            <button
              type="button"
              onClick={onEnrichQuoteClick}
              className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg"
            >
              Enrich Quote - UI
              <svg className="w-3.5 h-3.5 text-airtel-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        {/* Quote details grid - white section below grey header (same as Quote 1 structure) */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 px-5 py-4 bg-white text-xs border-t border-gray-200">
          <div>
            <p className="text-gray-500">Quote Number</p>
            <p className="font-medium text-gray-900 mt-0.5">Qt-00542904</p>
          </div>
          <div>
            <p className="text-gray-500">Expiration Date</p>
            <p className="font-medium text-gray-900 mt-0.5">19/03/2026</p>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-500">Syncing</p>
            <div className="mt-1">
              <input type="checkbox" className="rounded border-2 border-dashed border-gray-400 bg-transparent" aria-label="Syncing" />
            </div>
          </div>
          <div>
            <p className="text-gray-500">Related Opportunity</p>
            <a href="#" className="font-medium text-airtel-red hover:underline mt-0.5 inline-block">HDFC Bank - 170226</a>
          </div>
          <div>
            <p className="text-gray-500">Account</p>
            <a href="#" className="font-medium text-airtel-red hover:underline mt-0.5 inline-block">HDFC Bank</a>
          </div>
          <div>
            <p className="text-gray-500">Effective Quote Total</p>
            <p className="font-medium text-gray-900 mt-0.5">0.00</p>
          </div>
        </div>
      </div>

      {/* Progress bar: Draft = first segment "Draft" active (screenshot 1); Proposal = completed + Proposal current + upcoming (screenshot 2) */}
      <div className="w-full flex items-center gap-0 mb-4 flex-wrap">
        <div className="flex items-center shrink-0 min-h-[40px]">
          {isDraft ? (
            <>
              {DRAFT_VIEW_STAGES.map((stage, i) => (
                <span key={`${stage}-${i}`} className="flex items-center">
                  <span
                    className="flex items-center justify-center py-2 px-3 text-xs font-medium shrink-0"
                    style={{
                      backgroundColor: i === 0 ? '#8B3A3A' : '#E5E7EB',
                      color: i === 0 ? '#fff' : '#4B5563',
                      borderRadius: i === 0 ? '8px 0 0 8px' : 0,
                      marginLeft: i === 0 ? 0 : '-1px',
                    }}
                  >
                    {stage}
                  </span>
                  {i < DRAFT_VIEW_STAGES.length - 1 && (
                    <span className="shrink-0 w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-l-[8px] border-l-[#E5E7EB]" aria-hidden style={{ marginLeft: '-1px' }} />
                  )}
                </span>
              ))}
            </>
          ) : (
            <>
              {COMPLETED_STAGES.map((stage, i) => (
                <span key={stage} className="flex items-center">
                  <span
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-white text-xs font-medium shrink-0"
                    style={{ backgroundColor: '#F05E4C', borderRadius: i === 0 ? '8px 0 0 8px' : 0 }}
                  >
                    <svg className="w-4 h-4 shrink-0 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {stage}
                  </span>
                  <span className="shrink-0 w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-l-[8px] border-l-white/90" aria-hidden style={{ marginLeft: '-1px' }} />
                </span>
              ))}
              <span
                className="flex items-center justify-center py-2 pl-3 pr-4 text-white text-xs font-medium shrink-0 min-w-[80px]"
                style={{
                  backgroundColor: '#8B3A3A',
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)',
                  marginLeft: '-2px',
                }}
              >
                Proposal...
              </span>
            </>
          )}
        </div>
        {!isDraft && (
          <div className="flex items-center gap-2 flex-wrap pl-3 text-xs text-gray-700 font-medium">
            {UPCOMING_STAGES.map((stage) => (
              <span key={stage} className="whitespace-nowrap">
                {stage}{stage === 'Closed' ? '' : '...'}
              </span>
            ))}
          </div>
        )}
        <div className="flex-1 min-w-[120px]" />
        <button
          type="button"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white rounded-md hover:opacity-90"
          style={{ backgroundColor: '#E02424' }}
        >
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Mark Status as Complete
        </button>
      </div>

      {/* Main two columns: Details + Activity */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: Details / Related / History + Quote Information (screenshot layout) */}
        <div className="flex-[2] min-w-0 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-100">
            {['Details', 'Related', 'History'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setDetailsTab(tab)}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px ${
                  detailsTab === tab
                    ? 'text-airtel-red font-semibold border-airtel-red bg-white border-l-4 border-l-airtel-red'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-4 overflow-y-auto">
            <button type="button" className="flex items-center gap-2 w-full text-left mb-3 group">
              <svg className="w-4 h-4 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <h2 className="text-sm font-semibold text-gray-900">Quote Information</h2>
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 text-xs border border-gray-200 rounded-lg overflow-hidden bg-white">
              {/* Left column */}
              <div className="divide-y divide-gray-100">
                {[
                  { label: 'Quote Number', value: 'Qt-00542904', edit: true },
                  { label: 'Owner ID', value: 'KAM User', icon: 'person', edit: true },
                  { label: 'Quote Name', value: 'Default', edit: true },
                  { label: 'Related Opportunity', value: 'HDFC Bank - 170226', link: true },
                  { label: 'Account', value: 'HDFC Bank', link: true },
                  { label: 'Opportunity Name', value: 'HDFC Bank - 170226', link: true },
                  { label: 'Account Name', value: 'HDFC Bank', link: true },
                  { label: 'NBA Account', value: 'HDFC Bank', link: true },
                  { label: 'Customer Contact', value: 'Mudit.', icon: 'info', link: true },
                  { label: 'Company Coordinator', value: '', edit: true },
                  { label: 'Status', value: 'Proposal Accepted', edit: true },
                  { label: 'Quote Cancel Reason', value: '', edit: true },
                  { label: 'Type', value: 'New' },
                  { label: 'Demo', value: 'checkbox' },
                  { label: 'Description', value: 'Default' },
                  { label: 'Service Circle', value: '', edit: true },
                  { label: 'Quote Currency', value: 'INR - Indian Rupee' },
                  { label: 'Secondary KAM', value: '', edit: true },
                  { label: 'PM Name', value: '', edit: true },
                ].map(({ label, value, link, edit, icon }) => (
                  <div key={label} className="flex items-center justify-between gap-2 py-2.5 px-3">
                    <dt className="text-gray-700 shrink-0">{label}</dt>
                    <dd className="flex items-center gap-1 min-w-0 justify-end text-right">
                      {value === 'checkbox' ? (
                        <input type="checkbox" className="rounded border-gray-300" aria-label={label} />
                      ) : (
                        <>
                          {icon === 'person' && (
                            <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                              <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                            </span>
                          )}
                          {icon === 'info' && (
                            <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-500 text-[10px] font-bold">i</span>
                          )}
                          {link ? (
                            <a href="#" className="text-airtel-red hover:underline truncate">{value || '—'}</a>
                          ) : (
                            <span className="text-gray-900">{value || '—'}</span>
                          )}
                          {edit && value !== 'checkbox' && (
                            <button type="button" className="p-0.5 text-gray-400 hover:text-gray-600 shrink-0" aria-label="Edit">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                          )}
                        </>
                      )}
                    </dd>
                  </div>
                ))}
              </div>
              {/* Right column */}
              <div className="divide-y divide-gray-100 border-l border-gray-100">
                {[
                  { label: 'Tax', value: '', edit: true },
                  { label: 'Effective Quote Total', value: '0.00' },
                  { label: 'Effective One Time Total', value: 'INR 0.00' },
                  { label: 'Effective Quote Annual Recurring Total', value: 'INR 0.00' },
                  { label: 'Effective Annual Recurring Total', value: 'INR 0.00' },
                  { label: 'Effective Recurring Total', value: 'INR 0.00' },
                  { label: 'Price List', value: 'B2B Enterprise Price List', link: true },
                  { label: 'CAF', value: '', edit: true },
                  { label: 'PRI/INAMA/DSL CAF#', value: '', edit: true },
                  { label: 'CAF Sync Status', value: '', edit: true },
                  { label: 'Frame Contract', value: '', edit: true },
                  { label: 'Approval Status', value: '', edit: true },
                  { label: 'PM', value: '', edit: true },
                  { label: 'PM Team Lead Phone', value: '', edit: true },
                  { label: 'PM Team Lead', value: '', edit: true },
                  { label: 'PM Email', value: '', edit: true },
                  { label: 'Address and Feasibility Status', value: 'Coordinate Validations Completed' },
                  { label: 'Validation Date', value: '', icon: 'info', edit: true },
                  { label: 'Validation Status', value: 'Not yet run', icon: 'info', edit: true },
                ].map(({ label, value, link, edit, icon }) => (
                  <div key={label} className="flex items-center justify-between gap-2 py-2.5 px-3">
                    <dt className="text-gray-700 shrink-0">{label}</dt>
                    <dd className="flex items-center gap-1 min-w-0 justify-end text-right">
                      {icon === 'info' && (
                        <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-500 text-[10px] font-bold">i</span>
                      )}
                      {link ? (
                        <a href="#" className="text-airtel-red hover:underline truncate">{value || '—'}</a>
                      ) : (
                        <span className="text-gray-900">{value || '—'}</span>
                      )}
                      {edit && (
                        <button type="button" className="p-0.5 text-gray-400 hover:text-gray-600 shrink-0" aria-label="Edit">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      )}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Activities card — screenshot layout */}
        <div className="flex-1 min-w-0 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Top: three activity-type filters (calendar, email, list) with dropdowns */}
          <div className="px-4 pt-4 pb-2 flex items-center gap-2 border-b border-gray-100">
            <button type="button" className="flex items-center gap-1 p-2 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-700">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            <button type="button" className="flex items-center gap-1 p-2 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-700">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            <button type="button" className="flex items-center gap-1 p-2 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-700">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2V9a2 2 0 00-2-2H9z" /></svg>
              <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
          <div className="px-4 py-2 flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs text-gray-700">
              <svg className="w-4 h-4 text-airtel-red" fill="currentColor" viewBox="0 0 24 24"><path d="M16 12V4h2v8h-2zm0 8v-2h2v2h-2zm-4-8V4h2v8h-2zm0 8v-2h2v2h-2zm-4-8V4h2v8H8zm0 8v-2h2v2H8zM6 4v16h12V4H6z" /></svg>
              Only show activities with insights
              <span className="relative inline-block w-9 h-5 rounded-full bg-gray-200">
                <span className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white border border-gray-300" />
              </span>
            </label>
          </div>
          <div className="px-4 pb-2 flex items-center justify-end gap-2 text-xs text-gray-600">
            <span>Filters: Within 2 months • All activities</span>
            <button type="button" className="p-1 text-airtel-red hover:opacity-80" aria-label="Settings">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
          <div className="px-4 pb-2 flex justify-end">
            <span className="text-xs">
              <button type="button" className="text-airtel-red hover:underline font-medium">Refresh</button>
              <span className="text-gray-400 mx-1">•</span>
              <button type="button" className="text-airtel-red hover:underline font-medium">Expand All</button>
              <span className="text-gray-400 mx-1">•</span>
              <button type="button" className="text-airtel-red hover:underline font-medium">View All</button>
            </span>
          </div>
          <div className="p-4 overflow-y-auto flex-1 border-t border-gray-100">
            {/* Upcoming & Overdue */}
            <button type="button" className="flex items-center gap-2 w-full text-left mb-2">
              <svg className="w-4 h-4 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <h3 className="text-xs font-semibold text-gray-900">Upcoming & Overdue</h3>
            </button>
            <p className="text-xs text-gray-500 text-center py-6">No activities to show. Get started by sending an email, scheduling a task, and more.</p>
            {/* February - 2026 */}
            <button type="button" className="flex items-center justify-between gap-2 w-full text-left mt-4 mb-2">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xs font-semibold text-gray-900">February - 2026</h3>
              </span>
              <span className="text-xs text-gray-500">Last Month</span>
            </button>
            <ul className="space-y-0">
              <li className="flex items-start gap-3 py-3 border-b border-gray-50 group">
                <div className="flex flex-col items-center shrink-0 pt-0.5">
                  <span className="text-gray-400 text-sm">&gt;</span>
                  <span className="w-6 h-6 rounded flex items-center justify-center mt-1 bg-gray-100">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                  <div className="w-px flex-1 min-h-[24px] bg-gray-200 mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">Proposal for Review</p>
                  <p className="text-xs text-gray-500">sent an email to mudit@gmail.com</p>
                  <p className="text-xs text-gray-400 mt-0.5">3:01 PM | 17-Feb</p>
                </div>
                <button type="button" className="p-1.5 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 shrink-0" aria-label="More"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
              </li>
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex items-start gap-3 py-3 border-b border-gray-50 group">
                  <div className="flex flex-col items-center shrink-0 pt-0.5">
                    <span className="text-gray-400 text-sm">&gt;</span>
                    <span className="w-6 h-6 rounded flex items-center justify-center mt-1 bg-gray-100">
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    <div className="w-px flex-1 min-h-[24px] bg-gray-200 mt-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">
                      Feasibility Completed
                      <span className="mx-1 text-gray-400">||</span>
                      <span className="text-airtel-red hover:underline inline-flex items-center gap-0.5">
                        HDFC Bank
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">sent an email to a_jizony.arakkal@airtel.com</p>
                    <p className="text-xs text-gray-400 mt-0.5">2:59 PM | 17-Feb</p>
                  </div>
                  <button type="button" className="p-1.5 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 shrink-0" aria-label="More"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500 bg-gray-50/50">
            <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-[10px] font-bold shrink-0">i</span>
            To change what&apos;s shown, try changing your filters.
          </div>
        </div>
      </div>
    </div>
  )
}
