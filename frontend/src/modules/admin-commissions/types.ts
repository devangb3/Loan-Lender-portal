export interface AdminDeal {
  id: string;
  property_address: string;
  loan_amount: number;
  stage: string;
}

export interface Commission {
  id: string;
  deal_id: string;
  partner_id: string;
  amount: number;
  status: "pending" | "earned" | "paid";
}
