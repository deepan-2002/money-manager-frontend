export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer'
};

export const DIVISIONS = {
  OFFICE: 'office',
  PERSONAL: 'personal'
};

export const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Food', icon: '🍔', color: '#F59E0B' },
  { value: 'transport', label: 'Transport', icon: '🚗', color: '#3B82F6' },
  { value: 'fuel', label: 'Fuel', icon: '⛽', color: '#EF4444' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#8B5CF6' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: '#EC4899' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥', color: '#10B981' },
  { value: 'education', label: 'Education', icon: '📚', color: '#6366F1' },
  { value: 'utilities', label: 'Utilities', icon: '💡', color: '#F97316' },
  { value: 'rent', label: 'Rent', icon: '🏠', color: '#06B6D4' },
  { value: 'loan', label: 'Loan', icon: '💰', color: '#DC2626' },
  { value: 'insurance', label: 'Insurance', icon: '🛡️', color: '#059669' },
  { value: 'other', label: 'Other', icon: '📦', color: '#6B7280' }
];

export const INCOME_CATEGORIES = [
  { value: 'salary', label: 'Salary', icon: '💼', color: '#10B981' },
  { value: 'business', label: 'Business', icon: '🏢', color: '#3B82F6' },
  { value: 'investment', label: 'Investment', icon: '📈', color: '#8B5CF6' },
  { value: 'freelance', label: 'Freelance', icon: '💻', color: '#F59E0B' },
  { value: 'bonus', label: 'Bonus', icon: '🎁', color: '#EC4899' },
  { value: 'gift', label: 'Gift', icon: '🎀', color: '#F97316' },
  { value: 'other', label: 'Other', icon: '💵', color: '#6B7280' }
];

export const ACCOUNT_TYPES = [
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'bank', label: 'Bank Account', icon: '🏦' },
  { value: 'credit_card', label: 'Credit Card', icon: '💳' },
  { value: 'savings', label: 'Savings', icon: '🏦' }
];

export const PERIODS = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' }
];