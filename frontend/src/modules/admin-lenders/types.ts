export interface Lender {
  id: string;
  lender_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  specialty: string;
  property_types: string;
  states: string;
  min_loan: number;
  max_loan: number;
  notes?: string | null;
}

export interface LenderImportResult {
  imported_count: number;
  skipped_count: number;
  errors: Array<{ row_number: number; error: string }>;
}

export interface AdminDealLite {
  id: string;
  property_address: string;
}
