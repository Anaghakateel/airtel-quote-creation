function FooterActions({ onValidate, validationComplete, hasSelection, onContinueWithSelected, onContinueWithValidRecords }) {
  const continueWithSelectedEnabled = validationComplete && hasSelection
  return (
    <div className="flex justify-end gap-2 mt-2 pt-2 flex-shrink-0">
      <button
        type="button"
        onClick={() => onValidate?.()}
        className="px-4 py-1.5 border border-blue-600 rounded-full bg-white text-blue-600 text-xs font-medium hover:bg-blue-50"
      >
        Validate
      </button>
      <button
        type="button"
        disabled={!continueWithSelectedEnabled}
        onClick={() => continueWithSelectedEnabled && onContinueWithSelected?.()}
        className={`px-4 py-1.5 border rounded-full text-xs font-medium ${continueWithSelectedEnabled ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50' : 'border-gray-300 bg-white text-gray-400 cursor-not-allowed'}`}
      >
        Continue with Selected
      </button>
      <button
        type="button"
        disabled={!validationComplete}
        onClick={() => validationComplete && onContinueWithValidRecords?.()}
        className={`px-4 py-1.5 rounded-full text-xs font-medium ${validationComplete ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
      >
        Continue with Valid Records
      </button>
    </div>
  )
}

export default FooterActions
