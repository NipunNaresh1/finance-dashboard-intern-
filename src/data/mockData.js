// ─── MOCK DATA ───────────────────────────────────────────────────────────────
// All dummy data lives here. Easy to swap with a real API later.

export const USERS = [
  { username: "nipunnaresh1", password: "Nipun@123", role: "admin", name: "Nipun Naresh" },
  { username: "viewer01",     password: "View@123",  role: "viewer", name: "Guest Viewer" },
];

export const CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Utilities",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

export const INITIAL_TRANSACTIONS = [
  { id: 1,  date: "2024-06-01", description: "Monthly Salary",        amount: 85000, category: "Salary",         type: "income"  },
  { id: 2,  date: "2024-06-02", description: "Zomato Order",          amount: 450,   category: "Food & Dining",  type: "expense" },
  { id: 3,  date: "2024-06-03", description: "Uber Ride",             amount: 220,   category: "Transport",      type: "expense" },
  { id: 4,  date: "2024-06-04", description: "Amazon Shopping",       amount: 3200,  category: "Shopping",       type: "expense" },
  { id: 5,  date: "2024-06-06", description: "Netflix Subscription",  amount: 649,   category: "Entertainment",  type: "expense" },
  { id: 6,  date: "2024-06-07", description: "Freelance Project",     amount: 25000, category: "Freelance",      type: "income"  },
  { id: 7,  date: "2024-06-08", description: "Electricity Bill",      amount: 1800,  category: "Utilities",      type: "expense" },
  { id: 8,  date: "2024-06-09", description: "Doctor Visit",          amount: 800,   category: "Healthcare",     type: "expense" },
  { id: 9,  date: "2024-06-10", description: "Swiggy Order",          amount: 380,   category: "Food & Dining",  type: "expense" },
  { id: 10, date: "2024-06-12", description: "Metro Card Recharge",   amount: 500,   category: "Transport",      type: "expense" },
  { id: 11, date: "2024-06-13", description: "Mutual Fund SIP",       amount: 10000, category: "Investment",     type: "expense" },
  { id: 12, date: "2024-06-15", description: "Dinner with Friends",   amount: 1200,  category: "Food & Dining",  type: "expense" },
  { id: 13, date: "2024-06-17", description: "Movie Tickets",         amount: 600,   category: "Entertainment",  type: "expense" },
  { id: 14, date: "2024-06-18", description: "Freelance Payment",     amount: 15000, category: "Freelance",      type: "income"  },
  { id: 15, date: "2024-06-20", description: "Grocery Shopping",      amount: 2800,  category: "Shopping",       type: "expense" },
  { id: 16, date: "2024-06-22", description: "Internet Bill",         amount: 999,   category: "Utilities",      type: "expense" },
  { id: 17, date: "2024-06-24", description: "Pharmacy",              amount: 350,   category: "Healthcare",     type: "expense" },
  { id: 18, date: "2024-06-25", description: "Cab to Airport",        amount: 850,   category: "Transport",      type: "expense" },
  { id: 19, date: "2024-06-27", description: "Bonus Received",        amount: 20000, category: "Salary",         type: "income"  },
  { id: 20, date: "2024-06-28", description: "Clothes Shopping",      amount: 4500,  category: "Shopping",       type: "expense" },
  // May data for comparison
  { id: 21, date: "2024-05-01", description: "Monthly Salary",        amount: 85000, category: "Salary",         type: "income"  },
  { id: 22, date: "2024-05-03", description: "Food Delivery",         amount: 680,   category: "Food & Dining",  type: "expense" },
  { id: 23, date: "2024-05-06", description: "Freelance Work",        amount: 18000, category: "Freelance",      type: "income"  },
  { id: 24, date: "2024-05-10", description: "Electricity Bill",      amount: 1650,  category: "Utilities",      type: "expense" },
  { id: 25, date: "2024-05-14", description: "Amazon Order",          amount: 2100,  category: "Shopping",       type: "expense" },
  { id: 26, date: "2024-05-18", description: "Gym Membership",        amount: 1500,  category: "Healthcare",     type: "expense" },
  { id: 27, date: "2024-05-22", description: "Weekend Trip",          amount: 8000,  category: "Entertainment",  type: "expense" },
  { id: 28, date: "2024-05-25", description: "Mutual Fund SIP",       amount: 10000, category: "Investment",     type: "expense" },
];

export const MONTHLY_TREND = [
  { month: "Jan", income: 85000, expenses: 32000 },
  { month: "Feb", income: 90000, expenses: 28000 },
  { month: "Mar", income: 85000, expenses: 35000 },
  { month: "Apr", income: 95000, expenses: 30000 },
  { month: "May", income: 103000, expenses: 41930 },
  { month: "Jun", income: 145000, expenses: 28096 },
];
