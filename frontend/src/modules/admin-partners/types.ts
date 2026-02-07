export interface AdminPartner {
  id: string;
  user_id: string;
  company: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  is_approved: boolean;
  is_active: boolean;
  deal_count: number;
  conversion_rate: number;
  total_volume: number;
  commission_owed: number;
}
