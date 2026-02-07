export interface KanbanDeal {
  id: string;
  property_address: string;
  loan_amount: number;
  partner_id: string;
  borrower_id: string;
  stage: string;
  substage_id?: string | null;
}

export type KanbanBoard = Record<string, KanbanDeal[]>;

export interface SubStage {
  id: string;
  name: string;
  main_stage: string;
  order_index: number;
  is_active: boolean;
}
