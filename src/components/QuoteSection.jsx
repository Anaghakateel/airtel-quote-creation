function QuoteSection({ oneTimeTotal = 0, monthlyTotal = 0, quoteTotal = 0 }) {
  const oneTimeDisplay = oneTimeTotal > 0 ? `$${oneTimeTotal.toLocaleString()}` : '$000'
  const monthlyDisplay = monthlyTotal > 0 ? `$${monthlyTotal.toLocaleString()}` : '$000'
  const quoteDisplay = quoteTotal > 0 ? `$${quoteTotal.toLocaleString()}` : '$000'
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
          $
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quote</h1>
          <p className="text-base font-medium text-gray-700 mt-0.5">HDFC bank connectivity across India</p>
          <div className="flex flex-wrap gap-6 mt-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">One Time Total</p>
              <span className="text-blue-600 font-medium text-xs">{oneTimeDisplay}</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Monthly Total</p>
              <span className="text-blue-600 font-medium text-xs">{monthlyDisplay}</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Quote Total</p>
              <span className="text-blue-600 font-medium text-xs">{quoteDisplay}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {/* Add Products: standalone pill */}
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-full bg-white text-blue-600 text-xs font-medium hover:bg-gray-50 shrink-0"
        >
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Products
        </button>
        {/* Segmented group: shared border, rounded on both ends (pill) */}
        <div className="inline-flex items-stretch border border-gray-400 rounded-full bg-white overflow-hidden">
          <button
            type="button"
            className="px-4 py-2 text-blue-600 text-xs font-medium hover:bg-gray-50 border-r border-gray-400"
          >
            Create Enterprise Quote
          </button>
          <button
            type="button"
            className="px-4 py-2 text-blue-600 text-xs font-medium hover:bg-gray-50 border-r border-gray-400"
          >
            Discounts & Promotions
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 px-4 py-2 text-blue-600 text-xs font-medium hover:bg-gray-50 border-r border-gray-400"
          >
            Create Final Orders
          </button>
          <button
            type="button"
            className="flex items-center justify-center px-3 py-2 text-blue-600 hover:bg-gray-50"
            aria-label="More actions"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuoteSection
