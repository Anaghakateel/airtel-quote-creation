function TabsSection({ extractedInfoCount = 5000, locationsCount = 0, summaryCount = 0, activeTab = 'Extracted Information', onTabChange }) {
  const tabs = [
    { id: 'Summary', label: 'Summary', count: summaryCount },
    { id: 'Locations', label: 'Locations', count: locationsCount },
    { id: 'Subscribers', label: 'Subscribers', count: 0 },
    { id: 'Extracted Information', label: 'Extracted Information', count: extractedInfoCount },
  ]

  return (
    <div className="border-b border-gray-200 mb-4">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange?.(tab.id)}
            className={`px-4 py-3 text-xs font-medium border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            {tab.label}
            {tab.count !== null && tab.count !== undefined && ` (${tab.count})`}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TabsSection
