// Helper functions
export const getRoomTitle = (roomNo) => {
  const titles = {
    D: 'Deluxe Bedroom Apartment',
    L: 'Luxury Bedroom Apartment',
    R: 'Room With View Bedroom Apartment',
    P: 'Penthouse Apartment',
  }
  return titles[roomNo?.[0]] || 'Bedroom Apartment'
}

