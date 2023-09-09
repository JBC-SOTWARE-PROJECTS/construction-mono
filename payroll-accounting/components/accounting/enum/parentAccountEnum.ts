export enum AccountCategory {
  ASSET = 'Asset',
  LIABILITY = 'Liability',
  EQUITY = 'Equity',
  REVENUE = 'Revenue',
  EXPENSE = 'Expense',
  COST_OF_SALE = 'Cost of Sale',
  OTHER_COMPREHENSIVE_INCOME = 'Other Comprehensive Income',
  GAIN_AND_LOSS = 'Gain and Loss',
}

export const AccountType = {
  CURRENT_ASSETS: { label: 'Current Assets', category: AccountCategory.ASSET },
  LONG_TERM_ASSETS: {
    label: 'Long-Term Assets',
    category: AccountCategory.ASSET,
  },
  CURRENT_LIABILITIES: {
    label: 'Current Liabilities',
    category: AccountCategory.LIABILITY,
  },
  LONG_TERM_LIABILITIES: {
    label: 'Long-Term Liabilities',
    category: AccountCategory.LIABILITY,
  },
  EQUITY: { label: 'Equity', category: AccountCategory.EQUITY },
  REVENUE: { label: 'Revenue', category: AccountCategory.REVENUE },
  EXPENSES: { label: 'Expenses', category: AccountCategory.EXPENSE },
} as const

export enum DomainEnum {
  NO_DOMAIN = 'NO_DOMAIN',
  ITEM_CATEGORY = 'ITEM_CATEGORY',
}
