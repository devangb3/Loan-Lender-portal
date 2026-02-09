import { Stack } from "@/components/ui/mui";
import { APP_ROUTES } from "@/shared/constants";
import { useNavigate } from "react-router-dom";
import { DealSubmitForm } from "../components/DealSubmitForm";
import { PageHeader } from "@/shared/ui/PageHeader";

export function PartnerDealNewPage() {
  const navigate = useNavigate();

  return (
    <Stack spacing={3} className="page-enter">
      <PageHeader title="Submit a New Deal" subtitle="Fill out the details below to submit a new commercial loan deal." />
      <DealSubmitForm onSubmitted={() => navigate(APP_ROUTES.PARTNER_DEALS)} />
    </Stack>
  );
}
