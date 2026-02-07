export interface BorrowerDeal {
  id: string;
  property_address: string;
  loan_amount: number;
  stage: string;
  referring_partner_name?: string | null;
  created_at: string;
}

export interface BorrowerDashboard {
  deals: BorrowerDeal[];
}
