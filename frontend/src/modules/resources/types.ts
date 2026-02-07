export interface ResourceItem {
  id: string;
  category: "scripts" | "faq" | "loan_types";
  title: string;
  content: string;
  order_index: number;
}
