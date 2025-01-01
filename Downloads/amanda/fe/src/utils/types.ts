/////////src/utils/types.ts////////////

// Core Types
export interface User {
  id: number;
  name: string;
}

// Tags and Categories
export interface Tag {
  id: number;
  name: string;
  type: TransactionType;
  userId: number;
}

export interface TransactionTag {
  id: number;
  name: string;
  type: TransactionType;
  userId: number;
}

export interface CategoryTag {
  name: string;
  count: number;
  amount: number;
}

// Enums
export enum TransactionType {
  BUSINESS = "BUSINESS",
  PERSONAL = "PERSONAL",
}

export enum BulkOperationType {
  BUSINESS = "BUSINESS",
  PERSONAL = "PERSONAL",
  LABEL = "LABEL",
  TAG = "TAG",
  CATEGORY = "CATEGORY",
  STATUS = "STATUS",
}

// Transactions
export interface Transaction {
  id: number;
  date: string;
  label: string;
  amount: number;
  custom: string | null;
  tag: TransactionTag | null;
  tagId: number | null;
  business: boolean;
  income: boolean;
  deposit: boolean;
  flag: boolean;
  hidden: boolean;
  lock: boolean;
  source: string;
  split: boolean;
  accountId?: number;
  uploadId?: number;
  plaidTransactionId?: string | null;
  merchant?: string | null;
  category?: string | null;
  pending?: boolean;
  userId: number;
  user?: User;
}

export interface TransactionsResponse {
  status: string;
  transactions: Transaction[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

// Transaction Filters and Query
export interface TransactionFilters {
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  month?: string;
}

export interface VisibilityPreferences {
  showHidden: boolean;
  showLocked: boolean;
  showFlagged: boolean;
  showSplit: boolean;
}

export interface SortState {
  column: "date" | "label" | "amount";
  direction: "asc" | "desc";
}

export interface TransactionQueryState {
  visibilityPreferences: VisibilityPreferences;
  transactionType?: TransactionType;
  filters: TransactionFilters;
  sort: SortState;
  bulkSelection?: BulkSelection;
}

export interface TransactionQueryParams {
  page?: number;
  itemsPerPage?: number;
  visibilityPreferences?: {
    showHidden?: boolean;
    showLocked?: boolean;
    showFlagged?: boolean;
    showSplit?: boolean;
  };
  transactionType?: TransactionType;
  filters?: {
    search?: string;
    minAmount?: number;
    maxAmount?: number;
    month?: string;
    sortColumn?: "date" | "label" | "amount";
    sortDirection?: "asc" | "desc";
  };
}

export interface TransactionParams {
  page: number;
  itemsPerPage: number;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  visibilityPreferences?: VisibilityPreferences;
  transactionType?: TransactionType;
  filters?: TransactionFilters;
}

export interface FetchTransactionsParams {
  page: number;
  itemsPerPage: number;
  queryState: TransactionQueryState;
}

export interface TransactionCategories {
  business: boolean;
  flag: boolean;
  lock: boolean;
  hidden: boolean;
  split: boolean;
  tagId: number | null;
}

// Bulk Operations
export interface BulkSelection {
  targetType?: BulkOperationType;
  label?: string;
  isLabelBulk?: boolean;
  isBusinessBulk?: boolean;
  isPersonalBulk?: boolean;
  isTagBulk?: boolean;
  isCategoryBulk?: boolean;
  isStatusBulk?: boolean;
  selectedIds?: number[];
}

export interface BulkUpdateParams {
  transactionIds: number[];
  operation: BulkOperationType;
  data: {
    business?: boolean;
    label?: string;
    tagId?: number;
  };
}

export interface BulkUpdateResponse {
  status: "success" | "error";
  updatedCount: number;
  message?: string;
}

// Logs
export interface TransLog {
  id: number;
  timestamp: string;
  transactionId: number;
  fieldName: FieldName;
  oldValue: string | null;
  newValue: string | null;
  method: Method;
  special: Special;
  comment: string | null;
  algo: string | null;
  priorTransLogId: number | null;
}

export type Method = "human" | "robot" | "rule" | "bulk";
export type Special = "split" | "revert" | null;
export type FieldName =
  | "label"
  | "category"
  | "flag"
  | "lock"
  | "hide"
  | "split";

export interface TransactionLogCounts {
  [key: number]: boolean;
}

// Bank and Account
export interface Bank {
  id: number;
  name: string;
  userId: number;
  isCustomBank: boolean;
}

export interface AddBankRequest {
  bankName: string;
  isCustomBank: boolean;
}

export interface BankResponse {
  status: "success" | "error";
  data?: Bank;
  error?: string;
}

export interface BanksListResponse {
  status: "success" | "error";
  data?: Bank[];
  error?: string;
}

export interface Account {
  id: number;
  name: string;
  officialName?: string;
  type: string;
  subtype?: string;
  mask?: string;
  currentBalance?: number;
  availableBalance?: number;
  isoCurrencyCode?: string;
  plaidItem: {
    plaidInstitutionId: string;
    status: string;
  };
}

// Upload
export interface UploadStats {
  positiveTransactions: number;
  negativeTransactions: number;
  withdrawalsArePositive: boolean;
  totalRows?: number;
  validRows?: number;
  invalidDates?: number;
  nullTransactions?: number;
}

export interface UploadResponse {
  status: "success" | "error";
  message?: string;
  uploadedRows: number;
  stats?: {
    positiveTransactions: number;
    negativeTransactions: number;
    withdrawalsArePositive: boolean;
    totalRows?: number;
    validRows?: number;
    invalidDates?: number;
    nullTransactions?: number;
  };
  error?: {
    message: string;
    details?: string;
  };
}

// Error Handling
export interface ApiError extends Error {
  status?: number;
  details?: string;
}

export interface UploadError {
  message: string;
  details?: string;
}

// Invitations and Shared Users
export interface Invitation {
  id: number;
  email: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  inviterId: number;
  inviteeId?: number;
  role: "PRIMARY" | "PARTNER" | "FINANCE";
  name: string;
  first_name: string;
  last_name: string;
  updatedAt: string;
  inviter?: {
    id: number;
    email: string;
    name?: string;
  };
  invitee?: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface SharedUser {
  id: number;
  email: string;
  name?: string;
}

// Rules
export interface Rules {
  id: number;
  label: string;
  nickname: string;
}

// Sources
export interface Member {
  id: string;
  name: string;
}

export interface Source {
  id: string;
  name: string;
}

// Component Props
export interface TransactionTableProps {
  queryState: TransactionQueryState;
  onChange: (updates: Partial<TransactionQueryState>) => void;
  onError: (error: string | null) => void;
}

export interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyData: TransLog[];
}

export interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId?: number;
}

// Tax Year and Business Percentage
export interface TaxYearResponse {
  status: "success" | "error";
  data?: {
    taxYear: number;
  };
  error?: string;
}

export interface BusinessPercentageResponse {
  status: "success" | "error";
  data?: {
    businessPercentage: number;
  };
  error?: string;
}

export interface UpdateBusinessPercentageRequest {
  businessPercentage: number;
}

export interface iUser {
  id: number;
  status: "NEW" | "ACTIVE" | "INACTIVE" | "PENDING";
  role: "PRIMARY" | "PARTNER" | "FINANCE";
  email: string;
  phone: string;
  name: string;
  first_name: string;
  last_name: string;
  createdAt: Date;
  updatedAt: Date;
  userNotExist: boolean;
  sentInvitations: Invitation[];
  household_primary: iHousehold;
  household_partner: iHousehold;
  household_finance: iHousehold;
}

export interface iHousehold {
  id: number;
  label: string;
  taxYear: number;
  primary_user: iUser;
  partner_user: iUser;
  finance_user: iUser;
  totalTransactions: number;
  businessPercentage: number;  
}

