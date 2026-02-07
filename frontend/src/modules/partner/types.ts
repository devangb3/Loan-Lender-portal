export interface PartnerDashboard {
  deals_submitted: number;
  deals_closed: number;
  total_loan_volume: number;
  pending_commission: number;
  ytd_earnings: number;
}

export interface DealItem {
  id: string;
  property_address: string;
  loan_amount: number;
  stage: string;
  substage_id?: string | null;
  lender_id?: string | null;
  created_at: string;
}

export interface DealDetail extends DealItem {
  property_type: string;
  transaction_type: string;
  borrower_name: string;
  borrower_email: string;
  borrower_phone: string;
  internal_notes?: string | null;
  updated_at: string;
  days_in_current_stage: number;
}

export interface CommissionSummary {
  ytd_earnings: number;
  commission_goal: number;
  progress_pct: number;
  pending: number;
  earned: number;
  paid: number;
}
