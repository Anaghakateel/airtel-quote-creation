/**
 * Generates ~450 random location records for the Assign Configuration to locations list view.
 * Fields: id, streetAddress, floorNo, flatNo, city, state, country, premises, postalCode,
 * servicePoint, locationType, solutionType, circle, source, productsAssigned
 */

const STREET_NAMES = [
  'MG Road', 'Brigade Road', 'Indiranagar', 'Koramangala', 'Whitefield', 'Electronic City',
  'HSR Layout', 'JP Nagar', 'Jayanagar', 'Basavanagudi', 'Malleshwaram', 'Sadashivanagar',
  'Banashankari', 'BTM Layout', 'Sarjapur Road', 'Outer Ring Road', 'Marathahalli',
  'Bellandur', 'Brookfield', 'Kundalahalli', 'Mahadevapura', 'CV Raman Nagar',
  'Domlur', 'Ulsoor', 'Shivajinagar', 'Richmond Town', 'Frazer Town', 'Cunningham Road',
  'Lavelle Road', 'Residency Road', 'Commercial Street', 'St Marks Road', 'Church Street',
  'Park Street', 'Connaught Place', 'Karol Bagh', 'Saket', 'Dwarka', 'Rohini',
  'Andheri West', 'Bandra', 'Powai', 'Thane', 'Nerul', 'Vashi', 'Pune Cantonment',
  'Camp', 'Koregaon Park', 'Baner', 'Hinjewadi', 'Viman Nagar', 'Kalyani Nagar',
  'Jubilee Hills', 'Banjara Hills', 'Madhapur', 'Gachibowli', 'Hitech City', 'Secunderabad',
  'Anna Nagar', 'T Nagar', 'Adyar', 'Velachery', 'OMR', 'ECR', 'Porur', 'Chrompet',
  'Salt Lake', 'Park Street', 'Ballygunge', 'Lake Town', 'New Town', 'Rajarhat',
  'Gurgaon Sector', 'DLF Phase', 'Cyber City', 'MG Road Gurgaon', 'Sohna Road'
]

const CITIES = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar',
  'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad', 'Ranchi', 'Howrah',
  'Coimbatore', 'Kochi', 'Bhubaneswar', 'Mysore', 'Mangalore', 'Trivandrum',
  'Chandigarh', 'Dehradun', 'Gandhinagar', 'Noida', 'Greater Noida', 'Gurgaon',
  'Faridabad', 'Guwahati', 'Bareilly', 'Merrut', 'Moradabad', 'Aligarh'
]

const STATES = [
  'Karnataka', 'Maharashtra', 'Delhi', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat',
  'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Andhra Pradesh', 'Bihar', 'Punjab',
  'Haryana', 'Kerala', 'Odisha', 'Chhattisgarh', 'Assam', 'Jammu and Kashmir',
  'Uttarakhand', 'Himachal Pradesh', 'Goa', 'Chandigarh'
]

const PREMISES = ['Office', 'Retail', 'Warehouse', 'Residential', 'Industrial', 'Mixed Use', 'Data Center', 'Co-working']
const SERVICE_POINTS = ['SP-001', 'SP-002', 'SP-003', 'SP-004', 'SP-005', 'SP-100', 'SP-200', 'SP-300', 'SP-400', 'SP-500']
const LOCATION_TYPES = ['Corporate', 'Branch', 'Retail Outlet', 'Warehouse', 'Data Center', 'Residential', 'Kiosk', 'ATM']
const SOLUTION_TYPES = ['Dedicated', 'Shared', 'Hybrid', 'Managed', 'SD-WAN']
const CIRCLES = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Gujarat', 'North', 'South', 'East', 'West']
const SOURCES = ['AI Extracted', 'File Uploaded', 'File Upload', 'Manual Entry']

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function range(n) {
  return Array.from({ length: n }, (_, i) => i)
}

export function generateSampleLocations(count = 450) {
  const locations = []
  for (let i = 0; i < count; i++) {
    const city = pick(CITIES)
    const state = pick(STATES)
    const street = pick(STREET_NAMES)
    const num = Math.floor(Math.random() * 999) + 1
    const streetAddress = `${num}, ${street}, ${city}, ${state}, India`

    locations.push({
      id: `loc-${i + 1}`,
      streetAddress,
      floorNo: String(Math.floor(Math.random() * 20) + 1),
      flatNo: String(Math.floor(Math.random() * 50) + 1),
      city,
      state,
      country: 'India',
      premises: pick(PREMISES),
      postalCode: String(400000 + Math.floor(Math.random() * 99999)).slice(0, 6),
      servicePoint: pick(SERVICE_POINTS) + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
      locationType: pick(LOCATION_TYPES),
      solutionType: pick(SOLUTION_TYPES),
      circle: pick(CIRCLES),
      source: pick(SOURCES),
      productsAssigned: Math.random() > 0.3,
    })
  }
  return locations
}

export const SAMPLE_LOCATIONS = generateSampleLocations(450)
