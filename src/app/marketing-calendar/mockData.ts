// Marketing Calendar Events Data

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'national-festival' | 'regional-festival' | 'global-thematic' | 'birthday' | 'follow-up' | 'appointment' | 'meeting' | 'inactive-quarterly';
  date: Date;
  time?: string;
  duration?: number; // in minutes
  description?: string;
  attendees?: string[];
  location?: string;
  color?: string;
  calendar?: string; // which calendar it belongs to
}

// Base festival events (without birthdays)
const baseFestivalEvents: CalendarEvent[] = [
  // ===== JANUARY 2025 =====
  // Quarterly Inactive Customers Campaign
  {
    id: 'inactive-q-jan-2025',
    title: 'Inactive Customers Campaign',
    type: 'inactive-quarterly',
    date: new Date(2025, 0, 1),
    description: 'Re-engage inactive customers from the previous quarter',
    color: '#9747ff',
  },
  // New Year
  {
    id: 'ny-2025',
    title: 'New Year',
    type: 'global-thematic',
    date: new Date(2025, 0, 1),
    description: 'New Year Celebration',
    color: '#9747ff',
  },
  // Lohri
  {
    id: 'lohri-2025',
    title: 'Lohri',
    type: 'regional-festival',
    date: new Date(2025, 0, 13),
    description: 'Punjabi harvest festival',
    color: '#9747ff',
  },
  // Pongal
  {
    id: 'pongal-2025',
    title: 'Pongal',
    type: 'national-festival',
    date: new Date(2025, 0, 14),
    description: 'Tamil harvest festival',
    color: '#9747ff',
  },
  // Republic Day
  {
    id: 'republic-day-2025',
    title: 'Republic Day',
    type: 'national-festival',
    date: new Date(2025, 0, 26),
    description: 'Indian Republic Day',
    color: '#9747ff',
  },

  // ===== FEBRUARY 2025 =====
  // Valentine's Day
  {
    id: 'valentine-2025',
    title: "Valentine's Day",
    type: 'global-thematic',
    date: new Date(2025, 1, 14),
    description: 'Day of Love',
    color: '#9747ff',
  },

  // ===== MARCH 2025 =====
  // Women's Day
  {
    id: 'womens-day-2025',
    title: "Women's Day",
    type: 'global-thematic',
    date: new Date(2025, 2, 8),
    description: 'International Women\'s Day',
    color: '#9747ff',
  },
  // Holi
  {
    id: 'holi-2025',
    title: 'Holi',
    type: 'national-festival',
    date: new Date(2025, 2, 14),
    description: 'Festival of Colors',
    color: '#9747ff',
  },
  // Ugadi
  {
    id: 'ugadi-2025',
    title: 'Ugadi',
    type: 'regional-festival',
    date: new Date(2025, 2, 30),
    description: 'Telugu and Kannada New Year',
    color: '#9747ff',
  },

  // ===== APRIL 2025 =====
  // Quarterly Inactive Customers Campaign
  {
    id: 'inactive-q-apr-2025',
    title: 'Inactive Customers Campaign',
    type: 'inactive-quarterly',
    date: new Date(2025, 3, 1),
    description: 'Re-engage inactive customers from the previous quarter',
    color: '#9747ff',
  },
  // Baisakhi
  {
    id: 'baisakhi-2025',
    title: 'Baisakhi',
    type: 'regional-festival',
    date: new Date(2025, 3, 13),
    description: 'Punjabi New Year and harvest festival',
    color: '#9747ff',
  },
  // Vishu
  {
    id: 'vishu-2025',
    title: 'Vishu',
    type: 'regional-festival',
    date: new Date(2025, 3, 14),
    description: 'Malayalam New Year',
    color: '#9747ff',
  },
  // Earth Day
  {
    id: 'earth-day-2025',
    title: 'Earth Day',
    type: 'global-thematic',
    date: new Date(2025, 3, 22),
    description: 'Environmental awareness day',
    color: '#9747ff',
  },

  // ===== MAY 2025 =====
  // Mother's Day (2nd Sunday of May)
  {
    id: 'mothers-day-2025',
    title: "Mother's Day",
    type: 'global-thematic',
    date: new Date(2025, 4, 11),
    description: 'Celebrate mothers',
    color: '#9747ff',
  },

  // ===== JUNE 2025 =====
  // Father's Day (3rd Sunday of June)
  {
    id: 'fathers-day-2025',
    title: "Father's Day",
    type: 'global-thematic',
    date: new Date(2025, 5, 15),
    description: 'Celebrate fathers',
    color: '#9747ff',
  },

  // ===== JULY 2025 =====
  // Quarterly Inactive Customers Campaign
  {
    id: 'inactive-q-jul-2025',
    title: 'Inactive Customers Campaign',
    type: 'inactive-quarterly',
    date: new Date(2025, 6, 1),
    description: 'Re-engage inactive customers from the previous quarter',
    color: '#9747ff',
  },

  // ===== AUGUST 2025 =====
  // Friendship Day (1st Sunday of August)
  {
    id: 'friendship-day-2025',
    title: 'Friendship Day',
    type: 'global-thematic',
    date: new Date(2025, 7, 3),
    description: 'Celebrate friendship',
    color: '#9747ff',
  },
  // Raksha Bandhan
  {
    id: 'raksha-bandhan-2025',
    title: 'Raksha Bandhan',
    type: 'national-festival',
    date: new Date(2025, 7, 9),
    description: 'Bond between brothers and sisters',
    color: '#9747ff',
  },
  // Independence Day
  {
    id: 'independence-day-2025',
    title: 'Independence Day',
    type: 'national-festival',
    date: new Date(2025, 7, 15),
    description: 'Indian Independence Day',
    color: '#9747ff',
  },
  // Onam
  {
    id: 'onam-2025',
    title: 'Onam',
    type: 'national-festival',
    date: new Date(2025, 7, 28),
    description: 'Kerala harvest festival',
    color: '#9747ff',
  },

  // ===== SEPTEMBER 2025 =====
  // Ganesh Chaturthi
  {
    id: 'ganesh-chaturthi-2025',
    title: 'Ganesh Chaturthi',
    type: 'national-festival',
    date: new Date(2025, 8, 27),
    description: 'Birth of Lord Ganesha',
    color: '#9747ff',
  },
  // Navratri (Starting day)
  {
    id: 'navratri-2025',
    title: 'Navratri',
    type: 'regional-festival',
    date: new Date(2025, 8, 22),
    description: 'Nine nights festival',
    color: '#9747ff',
  },

  // ===== OCTOBER 2025 =====
  // Quarterly Inactive Customers Campaign
  {
    id: 'inactive-q-oct-2025',
    title: 'Inactive Customers Campaign',
    type: 'inactive-quarterly',
    date: new Date(2025, 9, 1),
    description: 'Re-engage inactive customers from the previous quarter',
    color: '#9747ff',
  },
  // Dussehra
  {
    id: 'dussehra-2025',
    title: 'Dussehra',
    type: 'national-festival',
    date: new Date(2025, 9, 2),
    description: 'Victory of good over evil',
    color: '#9747ff',
  },
  // Diwali (Multi-day festival - main day)
  {
    id: 'diwali-2025',
    title: 'Diwali',
    type: 'national-festival',
    date: new Date(2025, 9, 20),
    description: 'Festival of Lights',
    color: '#9747ff',
  },

  // ===== NOVEMBER 2025 =====
  // (Diwali celebrations may extend here depending on the year)

  // ===== DECEMBER 2025 =====
  // Christmas
  {
    id: 'christmas-2025',
    title: 'Christmas',
    type: 'national-festival',
    date: new Date(2025, 11, 25),
    description: 'Christian festival celebrating the birth of Jesus',
    color: '#9747ff',
  },

  // ===== EID CELEBRATIONS (Dates vary based on lunar calendar) =====
  // Eid al-Fitr 2025 (approximate)
  {
    id: 'eid-fitr-2025',
    title: 'Eid al-Fitr',
    type: 'national-festival',
    date: new Date(2025, 2, 31),
    description: 'Festival marking the end of Ramadan',
    color: '#9747ff',
  },
  // Eid al-Adha 2025 (approximate)
  {
    id: 'eid-adha-2025',
    title: 'Eid al-Adha',
    type: 'national-festival',
    date: new Date(2025, 5, 7),
    description: 'Festival of Sacrifice',
    color: '#9747ff',
  },

];

// ===== GENERATE BIRTHDAY EVENTS FOR EVERY DAY =====
// Function to generate birthday events for the entire year
function generateDailyBirthdays(): CalendarEvent[] {
  const birthdays: CalendarEvent[] = [];
  const year = 2025;
  const birthdayCounts = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 18, 20, 24]; // Variety of counts
  
  // Generate birthdays for all 12 months
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      // Use a seed to get consistent random counts
      const seed = (month * 31 + day) % birthdayCounts.length;
      const count = birthdayCounts[seed];
      
      birthdays.push({
        id: `birthday-${year}-${month}-${day}`,
        title: count === 1 ? '1 Birthday' : `${count} Birthdays`,
        type: 'birthday',
        date: new Date(year, month, day),
        description: count === 1 ? 'Customer birthday' : 'Customer birthdays',
        color: '#9747ff',
      });
    }
  }
  
  return birthdays;
}

// Add birthday events to mockEvents
export const mockEvents: CalendarEvent[] = [...baseFestivalEvents, ...generateDailyBirthdays()];

export interface EventFilter {
  id: string;
  label: string;
  enabled: boolean;
  color?: string;
}

export const eventFilters: EventFilter[] = [
  { id: 'birthday', label: 'Birthdays', enabled: true, color: '#9747ff' },
  { id: 'inactive-quarterly', label: 'Inactive Customers (Quarterly)', enabled: true, color: '#9747ff' },
  { id: 'national-festival', label: 'National Festivals', enabled: true, color: '#9747ff' },
  { id: 'regional-festival', label: 'Regional / Local Festivals', enabled: true, color: '#9747ff' },
  { id: 'global-thematic', label: 'Global / Thematic Days', enabled: true, color: '#9747ff' },
];

export const myCalendars: EventFilter[] = [
  { id: 'google', label: 'Google', enabled: true, color: '#4285f4' },
  { id: 'practo', label: 'Practo', enabled: true, color: '#10b759' },
  { id: 'pos', label: 'POS', enabled: true, color: '#ff6b35' },
];

// Helper functions
export function getEventsForDate(date: Date): CalendarEvent[] {
  return mockEvents.filter(event => 
    event.date.toDateString() === date.toDateString()
  );
}

export function getEventsForWeek(startDate: Date): Map<string, CalendarEvent[]> {
  const weekEvents = new Map<string, CalendarEvent[]>();
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateKey = currentDate.toDateString();
    weekEvents.set(dateKey, getEventsForDate(currentDate));
  }
  
  return weekEvents;
}

export function getEventCountSummary(date: Date): { [key: string]: number } {
  const events = getEventsForDate(date);
  const summary: { [key: string]: number } = {};
  
  events.forEach(event => {
    // Group by event type
    if (!summary[event.type]) {
      summary[event.type] = 0;
    }
    summary[event.type]++;
  });
  
  return summary;
}

// Get display label for event type
export function getEventTypeLabel(type: string, count: number = 1): string {
  switch (type) {
    case 'national-festival':
      return count > 1 ? `${count} National Festivals` : 'National Festival';
    case 'regional-festival':
      return count > 1 ? `${count} Regional Festivals` : 'Regional Festival';
    case 'global-thematic':
      return count > 1 ? `${count} Events` : 'Event';
    case 'birthday':
      return count > 1 ? `${count} Birthdays` : 'Birthday';
    case 'inactive-quarterly':
      return count > 1 ? `${count} Inactive Campaigns` : 'Inactive Customers Campaign';
    case 'follow-up':
      return count > 1 ? `${count} Follow-ups` : 'Follow-up';
    case 'appointment':
      return count > 1 ? `${count} Appointments` : 'Appointment';
    case 'meeting':
      return count > 1 ? `${count} Meetings` : 'Meeting';
    default:
      return count > 1 ? `${count} Events` : 'Event';
  }
}

// ===== INACTIVE CUSTOMERS (QUARTERLY) HELPERS =====
// Deterministic mock count of inactive customers for a given date.
export function getInactiveCustomerCountForDate(date: Date | null | undefined): number {
  if (!date) return 0;
  const seed = Number(`${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`);
  const base = 250 + (seed % 200); // 250-449
  return base;
}

// ===== BIRTHDAY FEATURE DATA =====

export interface BirthdayCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  birthDate: Date;
  age?: number;
}

// Generate customers for a specific date
export function getBirthdayCustomersForDate(date: Date): BirthdayCustomer[] {
  const dateKey = date.toDateString();
  
  // Mock customer names for demonstration
  const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rahul', 'Pooja', 'Karan', 'Neha', 
    'Arjun', 'Divya', 'Rohan', 'Kavya', 'Sanjay', 'Riya', 'Arun', 'Meera', 'Vishal', 'Shreya',
    'Kunal', 'Isha', 'Manish', 'Tanya', 'Deepak'];
  const lastNames = ['Sharma', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Verma', 'Mehta', 'Shah', 'Joshi', 'Rao',
    'Reddy', 'Nair', 'Iyer', 'Menon', 'Kapoor', 'Malhotra', 'Agarwal', 'Bansal', 'Chopra', 'Khanna'];
  
  // Determine number of customers based on event title
  const event = mockEvents.find(e => 
    e.type === 'birthday' && e.date.toDateString() === dateKey
  );
  
  if (!event) return [];
  
  // Extract count from title (e.g., "5 Birthdays" -> 5)
  const match = event.title.match(/(\d+)/);
  const count = match ? parseInt(match[1]) : 1;
  
  // Generate mock customers
  const customers: BirthdayCustomer[] = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    customers.push({
      id: `customer-${dateKey}-${i}`,
      name: `${firstName} ${lastName}`,
      phone: `+91 ${9000000000 + i}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      birthDate: new Date(date),
      age: 25 + (i % 40),
    });
  }
  
  return customers;
}

