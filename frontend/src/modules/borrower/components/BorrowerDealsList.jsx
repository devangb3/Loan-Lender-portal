import PropTypes from "prop-types";
import { Chip, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { toCurrency } from "../utils";

export function BorrowerDealsList({ deals }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {deals.map((deal) => (
        <Card key={deal.id} className="flex flex-col gap-3 p-5 hover:shadow-card-hover">
          <div className="flex items-start justify-between gap-2">
            <Typography variant="h6" className="leading-snug">{deal.property_address}</Typography>
            <Chip label={deal.stage} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{toCurrency(deal.loan_amount)}</span>
            <span>Referred by {deal.referring_partner_name ?? "Partner"}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

BorrowerDealsList.propTypes = {
  deals: PropTypes.arrayOf(PropTypes.object).isRequired,
};
