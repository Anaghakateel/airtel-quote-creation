function FooterActions({ onValidate, validationComplete, onContinueWithValidRecords }) {
  return (
    <div className="flex justify-end gap-2 mt-2 pt-2 flex-shrink-0">
      <button
        type="button"
        onClick={() => onValidate?.()}
        className="px-4 py-1.5 border border-gray-300 rounded-md bg-white text-airtel-red text-xs font-medium hover:bg-grey-bg"
      >
        Verify Details
      </button>
      <button
        type="button"
        disabled={!validationComplete}
        onClick={() => validationComplete && onContinueWithValidRecords?.()}
        className={`px-4 py-1.5 border rounded-md text-xs font-medium ${validationComplete ? 'border-airtel-red bg-airtel-red text-white hover:opacity-90' : 'border-gray-300 bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        Continue with Verified Records
      </button>
    </div>
  )
}

export default FooterActions
