import { createContext, useContext } from 'react'

/**
 * Context for locations list used across Create Quote (Locations tab, Assign Configuration to locations)
 * and Technical Enrichment (Assign configurations to locations).
 */
export const LocationsContext = createContext({
  locations: [],
  onUpdateLocation: () => {},
  onDeleteLocations: () => {},
})

export function useLocations() {
  return useContext(LocationsContext)
}

export function LocationsProvider({ value, children }) {
  return (
    <LocationsContext.Provider value={value}>
      {children}
    </LocationsContext.Provider>
  )
}
