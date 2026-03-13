import { useState } from 'react'

function formatINR(num) {
  if (num == null) return '₹0.00'
  const n = Number(num)
  if (n === 0) return '₹0.00'
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Details form dropdown options (used in Primary Link > Details)
const DETAILS_OPTIONS = {
  accessBandwidth: ['1 Mbps', '2 Mbps', '4 Mbps', '5 Mbps', '10 Mbps', '20 Mbps', '50 Mbps', '100 Mbps', '200 Mbps', '500 Mbps', '1 Gbps'],
  portBandwidth: ['1 Mbps', '2 Mbps', '4 Mbps', '5 Mbps', '10 Mbps', '20 Mbps', '50 Mbps', '100 Mbps', '200 Mbps', '500 Mbps', '1 Gbps'],
  contractTerm: ['6', '12', '24', '36', '48', '60'],
  media: ['FTTH', 'Fiber', 'Fiber Optics', 'Copper', 'Ethernet', 'Wireless', 'DSL'],
  pop: ['Single POP', 'Dual POP', 'Multi POP'],
  lastMile: ['Single Last Mile', 'Dual Last Mile', 'Multi Last Mile'],
  redundancy: ['No', 'Yes'],
  serviceType: ['Unmanaged', 'Managed', 'Co-Managed', 'Managed SD-WAN', 'DIY'],
  cpe: ['Select', 'CPE-A', 'CPE-B', 'CPE-C', 'Customer Provided', 'Not Required'],
  ipRequired: ['None', 'IPv4', 'IPv6', 'IPv4 & IPv6'],
  ddosRequired: ['No', 'Yes'],
  crossConnectRequired: ['No', 'Yes'],
}

function ConfigurationCartContent({ row, onBack, onUpdateCart, onDirtyChange, hideFooter }) {
  const [bundleExpanded, setBundleExpanded] = useState(true)
  const [primaryLinkExpanded, setPrimaryLinkExpanded] = useState(true)
  const [subProductsExpanded, setSubProductsExpanded] = useState({ connectivityIP: false, accessLastMile: false, portBandwidth: false })
  const [enterpriseRoutersExpanded, setEnterpriseRoutersExpanded] = useState(true)
  const [hasUpdates, setHasUpdates] = useState(false)
  const oneTimeTotal = row?.oneTimeTotal ?? 10000
  const monthlyTotal = row?.recurringTotal ?? 0
  const setDirty = (v) => {
    setHasUpdates(v)
    onDirtyChange?.(v)
  }

  const ChevronDown = ({ expanded }) => (
    <svg className={`w-4 h-4 shrink-0 transition-transform ${expanded ? '' : '-rotate-90'}`} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )

  return (
    <div className="relative flex flex-col min-h-0 h-full bg-white rounded-lg overflow-hidden">
      {/* Products section – only this area scrolls; any change enables Update Cart */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-24" onInput={() => setDirty(true)} onChange={() => setDirty(true)}>
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Products (1)</h2>

        <div className="flex items-stretch">
          {/* Hierarchy: vertical grey line only */}
          <div className="w-6 shrink-0 flex flex-col items-center pt-0.5">
            <div className="w-4 h-4 shrink-0" aria-hidden />
            <div className="w-px flex-1 min-h-[24px] bg-gray-400" aria-hidden />
          </div>

          <div className="flex-1 min-w-0 -ml-6 pl-6">
            {/* Internet [Bundle] – same layout as Primary Link: title + Add/Qty/totals on one line; sub-product below */}
            <div className="mb-0">
              <div className="py-2">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setBundleExpanded((e) => !e)}
                    className="flex items-center gap-1.5 text-left shrink-0 rounded hover:bg-gray-50 p-0.5 -m-0.5 cursor-pointer"
                    aria-expanded={bundleExpanded}
                    aria-label={bundleExpanded ? 'Collapse Internet Bundle' : 'Expand Internet Bundle'}
                  >
                    <ChevronDown expanded={bundleExpanded} />
                    <span className="text-sm font-semibold text-gray-900">Internet [Bundle]</span>
                  </button>
                  <div className="flex items-end gap-x-4 gap-y-0 flex-wrap">
                    <button type="button" className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      Add
                    </button>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Quantity</span>
                      <input type="number" defaultValue={1} className="w-12 px-2 py-0.5 text-xs border border-gray-300 rounded mt-0.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">OT Total</span>
                      <span className="text-xs font-medium mt-0.5">10,000.00</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">AR Total</span>
                      <span className="text-xs font-medium mt-0.5">1,31,900.00</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">MRC Total</span>
                      <span className="text-xs font-medium mt-0.5">0.00</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">One Time</span>
                      <span className="text-xs font-medium mt-0.5">0.00</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">ARC</span>
                      <span className="text-xs font-medium mt-0.5">0.00</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">MRC</span>
                      <span className="text-xs font-medium mt-0.5">0.00</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 shrink-0 self-center" aria-hidden />
                    <button type="button" className="p-1.5 text-gray-500 hover:bg-grey-bg rounded shrink-0 self-center" aria-label="Delete">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <button type="button" className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-grey-bg shrink-0 self-end" aria-label="Options">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                </div>
                {bundleExpanded && (
                  <p className="text-xs text-gray-600 mt-2">Sub Product Name <strong>Enterprise ILL</strong></p>
                )}
              </div>
            </div>

            {/* Primary Link + Details: indented with vertical line (hierarchy) */}
            <div className="border-l-2 border-gray-400 pl-4 ml-2 min-h-[1px]">
        {/* Primary Link – title + Add/Qty/totals on one line; explanation in three lines */}
        <div className="mt-3">
          <div className="py-2">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <button
                type="button"
                className="flex items-center gap-2 text-left shrink-0 rounded hover:bg-gray-50 p-0.5 -m-0.5 cursor-pointer"
                onClick={() => setPrimaryLinkExpanded((e) => !e)}
                aria-expanded={primaryLinkExpanded}
                aria-label={primaryLinkExpanded ? 'Collapse Primary Link' : 'Expand Primary Link'}
              >
                <ChevronDown expanded={primaryLinkExpanded} />
                <svg className="w-3.5 h-3.5 shrink-0 text-amber-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 2L2 22h20L12 2z" />
                </svg>
                <span className="text-sm font-semibold text-gray-900">Primary Link</span>
              </button>
              <div className="flex items-end gap-x-4 gap-y-0 flex-wrap">
                <button type="button" className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 shrink-0">Add</button>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Quantity</span>
                  <input type="number" defaultValue={1} className="w-12 px-2 py-0.5 text-xs border border-gray-300 rounded mt-0.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">OT Total</span>
                  <span className="text-xs font-medium mt-0.5">10,000.00</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">AR Total</span>
                  <span className="text-xs font-medium mt-0.5">1,31,900.00</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">MRC Total</span>
                  <span className="text-xs font-medium mt-0.5">0.00</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">One Time</span>
                  <input type="text" defaultValue="10,000.00" className="w-20 px-2 py-0.5 text-xs border border-gray-300 rounded mt-0.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">ARC</span>
                  <input type="text" defaultValue="1,31,900.00" className="w-24 px-2 py-0.5 text-xs border border-gray-300 rounded mt-0.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">MRC</span>
                  <input type="text" defaultValue="0.00" className="w-16 px-2 py-0.5 text-xs border border-gray-300 rounded mt-0.5" />
                </div>
                <button type="button" className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-grey-bg shrink-0 self-end" aria-label="Options">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
            {primaryLinkExpanded && (
              <>
                <p className="text-xs text-gray-700 mt-2">
                  Access Bandwidth <strong>10 Mbps</strong> Port Bandwidth <strong>10 Mbps</strong> Contract Term <strong>12</strong> Media <strong>FTTH</strong> POP <strong>Single POP</strong>
                </p>
                <p className="text-xs text-gray-700 mt-0.5">
                  Last Mile <strong>Single Last Mile</strong> Redundancy <strong>No</strong> Service Type <strong>Unmanaged</strong> IP Required <strong>IPv4</strong>
                </p>
                <p className="text-xs text-gray-700 mt-0.5">
                  DDOS Required <strong>No</strong> Cross Connect Required <strong>No</strong> Enterprise Connectivity Type <strong>Primary</strong>
                </p>
                <p className="text-xs text-gray-600 mt-1">Sub Product Name <strong>Enterprise ILL</strong></p>
              </>
            )}
          </div>

          {/* Details form (under Primary Link) – 4-column grid, no card */}
          {primaryLinkExpanded && (
            <div className="pt-3 mt-1">
              <p className="text-xs font-semibold text-gray-900 mb-3">Details</p>
              <div className="grid grid-cols-4 gap-x-4 gap-y-3 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1">*Access Bandwidth</label>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="1 Mbps">
                    {DETAILS_OPTIONS.accessBandwidth.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">*Port Bandwidth</label>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="1 Mbps">
                    {DETAILS_OPTIONS.portBandwidth.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Legacy Access Bandwidth</label>
                  <input type="text" className="w-full px-2 py-1.5 border border-gray-300 rounded" placeholder="" />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">*Contract Term</label>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="12">
                    {DETAILS_OPTIONS.contractTerm.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">*Media</label>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="FTTH">
                    {DETAILS_OPTIONS.media.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">POP</label>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="Single POP">
                    {DETAILS_OPTIONS.pop.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Last Mile</label>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="Single Last Mile">
                    {DETAILS_OPTIONS.lastMile.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Redundancy</label>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="Yes">
                    {DETAILS_OPTIONS.redundancy.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">*Service Type</label>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="Unmanaged">
                    {DETAILS_OPTIONS.serviceType.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">CPE</label>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="Select">
                    {DETAILS_OPTIONS.cpe.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">IP Required</label>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="IPv4">
                    {DETAILS_OPTIONS.ipRequired.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">DDOS Required</label>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="No">
                    {DETAILS_OPTIONS.ddosRequired.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Cross Connect Required</label>
                  <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="No">
                    {DETAILS_OPTIONS.crossConnectRequired.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Legacy Port Bandwidth</label>
                  <input type="text" className="w-full px-2 py-1.5 border border-gray-300 rounded" placeholder="" />
                </div>
              </div>
            </div>
          )}
        </div>

            {/* Optional Products (9) – inside Primary Link accordion; hidden when Primary Link is closed */}
            {primaryLinkExpanded && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Optional Products (9)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { name: 'Enterprise Connectivity Routers', oneTime: '0', monthly: '₹ 0' },
                  { name: 'DDOS', oneTime: '0', monthly: '₹ 0' },
                  { name: 'Cross Connect', oneTime: '0', monthly: '₹ 0' },
                  { name: 'Third Party', oneTime: '0', monthly: '₹ 0' },
                  { name: 'Manageability Charge', oneTime: '0', monthly: '-' },
                  { name: 'Dual POP Charge', oneTime: '0', monthly: '-' },
                  { name: 'Miscellaneous Charge', oneTime: '0', monthly: '₹ 0' },
                  { name: 'Installation Charge', oneTime: '0', monthly: '₹ 0' },
                  { name: 'Hardware Replacement Charge', oneTime: '0', monthly: '-' },
                ].map((product) => (
                  <div
                    key={product.name}
                    className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                  >
                    <p className="text-xs font-semibold text-gray-900 mb-2">{product.name}</p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <a href="#" className="text-xs text-airtel-red hover:underline">
                        Show Details
                      </a>
                      <div className="text-right text-xs">
                        <div className="text-gray-500">One Time</div>
                        <div className="font-medium text-gray-900">{product.oneTime}</div>
                        <div className="text-gray-500 mt-1">Monthly</div>
                        <div className="font-medium text-gray-900">{product.monthly}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Three sub-products below Optional Products: Connectivity IP Block, Access Last Mile Charge, Port Bandwidth Charge */}
            {[
              { id: 'connectivityIP', name: 'Connectivity IP Block' },
              { id: 'accessLastMile', name: 'Access Last Mile Charge' },
              { id: 'portBandwidth', name: 'Port Bandwidth Charge' },
            ].map(({ id, name }) => (
              <div key={id} className="mt-3 border-t border-gray-100 pt-3">
                <div className="py-2">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-left shrink-0 rounded hover:bg-gray-50 p-0.5 -m-0.5 cursor-pointer"
                      onClick={() => setSubProductsExpanded((s) => ({ ...s, [id]: !s[id] }))}
                      aria-expanded={subProductsExpanded[id]}
                      aria-label={subProductsExpanded[id] ? `Collapse ${name}` : `Expand ${name}`}
                    >
                      <ChevronDown expanded={subProductsExpanded[id]} />
                      <span className="text-sm font-semibold text-gray-900">{name}</span>
                    </button>
                    <div className="flex items-end gap-x-4 gap-y-0 flex-wrap">
                      <button type="button" className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 shrink-0">Add</button>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Quantity</span>
                        <input type="number" defaultValue={1} className="w-12 px-2 py-0.5 text-xs border border-gray-300 rounded mt-0.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">OT Total</span>
                        <span className="text-xs font-medium mt-0.5">0.00</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">AR Total</span>
                        <span className="text-xs font-medium mt-0.5">0.00</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">MRC Total</span>
                        <span className="text-xs font-medium mt-0.5">0.00</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">One Time</span>
                        <input type="text" defaultValue="0.00" className="w-20 px-2 py-0.5 text-xs border border-gray-300 rounded mt-0.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">ARC</span>
                        <input type="text" defaultValue="0.00" className="w-24 px-2 py-0.5 text-xs border border-gray-300 rounded mt-0.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">MRC</span>
                        <input type="text" defaultValue="0.00" className="w-16 px-2 py-0.5 text-xs border border-gray-300 rounded mt-0.5" />
                      </div>
                      <button type="button" className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-grey-bg shrink-0 self-end" aria-label="Options">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Sub-product: Enterprise Connectivity Routers (under Connectivity IP Block only) */}
                {id === 'connectivityIP' && subProductsExpanded.connectivityIP && (
                  <div className="border-l-2 border-gray-400 pl-4 ml-2 mt-2 mb-2">
                    <div className="py-2">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <button
                          type="button"
                          className="flex items-center gap-2 text-left shrink-0 rounded hover:bg-gray-50 p-0.5 -m-0.5 cursor-pointer"
                          onClick={() => setEnterpriseRoutersExpanded((e) => !e)}
                          aria-expanded={enterpriseRoutersExpanded}
                          aria-label={enterpriseRoutersExpanded ? 'Collapse Enterprise Connectivity Routers' : 'Expand Enterprise Connectivity Routers'}
                        >
                          <ChevronDown expanded={enterpriseRoutersExpanded} />
                          <svg className="w-3.5 h-3.5 shrink-0 text-amber-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path d="M12 2L2 22h20L12 2z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-900">Enterprise Connectivity Routers</span>
                        </button>
                        <div className="flex items-end gap-x-4 gap-y-0 flex-wrap">
                          <button type="button" className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 shrink-0">Add</button>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Quantity</span>
                            <input type="number" defaultValue={1} className="w-12 px-2 py-0.5 text-xs border border-gray-300 rounded mt-0.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">OT Total</span>
                            <span className="text-xs font-medium mt-0.5">0.00</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">AR Total</span>
                            <span className="text-xs font-medium mt-0.5">0.00</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">MRC Total</span>
                            <span className="text-xs font-medium mt-0.5">0.00</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">One Time</span>
                            <input type="text" defaultValue="0.00" className="w-20 px-2 py-0.5 text-xs border border-gray-300 rounded mt-0.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">ARC</span>
                            <input type="text" defaultValue="0.00" className="w-24 px-2 py-0.5 text-xs border border-gray-300 rounded mt-0.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">MRC</span>
                            <input type="text" defaultValue="0.00" className="w-16 px-2 py-0.5 text-xs border border-gray-300 rounded mt-0.5" />
                          </div>
                          <button type="button" className="p-1.5 text-gray-500 hover:bg-grey-bg rounded shrink-0 self-center" aria-label="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                          <button type="button" className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-grey-bg shrink-0 self-end" aria-label="Options">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mt-2">Router Ownership <strong>Airtel</strong> Is UTM <strong>No</strong></p>
                    </div>
                    {enterpriseRoutersExpanded && (
                      <div className="pt-3 mt-1">
                        <p className="text-xs font-semibold text-gray-900 mb-3">Details</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                          <div>
                            <label className="block text-gray-600 mb-1">Router Ownership</label>
                            <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="Airtel">
                              <option>Airtel</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-600 mb-1">Item Code</label>
                            <input type="text" className="w-full px-2 py-1.5 border border-gray-300 rounded" placeholder="" />
                          </div>
                          <div>
                            <label className="block text-gray-600 mb-1">Router Lease Type</label>
                            <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white">
                              <option>Select</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-600 mb-1">Is UTM</label>
                            <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white" defaultValue="No">
                              <option>No</option>
                              <option>Yes</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-600 mb-1">Router Type</label>
                            <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white">
                              <option>Select</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-600 mb-1">Sale Type</label>
                            <select className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white">
                              <option>Select</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {!hideFooter && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between gap-4 p-4 border-t border-gray-200 bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium text-gray-900">1</p>
            </div>
            <div>
              <p className="text-gray-500">One Time Total</p>
              <p className="font-semibold text-gray-900">{formatINR(oneTimeTotal)}</p>
            </div>
            <div>
              <p className="text-gray-500">Monthly Total</p>
              <p className="font-semibold text-gray-900">{formatINR(monthlyTotal)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onBack} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg">Back</button>
            <button type="button" onClick={() => hasUpdates && onUpdateCart?.()} className={hasUpdates ? 'px-4 py-2 rounded-md border border-gray-300 bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg' : 'px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-500 text-xs font-medium cursor-not-allowed'} disabled={!hasUpdates}>Update Cart</button>
            <button type="button" className={hasUpdates ? 'px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-500 text-xs font-medium cursor-not-allowed' : 'px-4 py-2 rounded-md bg-airtel-red text-white text-xs font-medium hover:opacity-90'} disabled={hasUpdates}>Add Products to Quote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfigurationCartContent
