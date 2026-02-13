import { Button, Stack } from "@/components/ui/mui";
import { SubStageManager } from "../components/SubStageManager";
import { useEffect, useState } from "react";
import { listSubstages } from "../api";
import { PageHeader } from "@/shared/ui/PageHeader";
import { APP_ROUTES } from "@/shared/constants";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function AdminSubstagesPage() {
  const [substages, setSubstages] = useState([]);
  const navigate = useNavigate();

  const refreshSubstages = async () => {
    try {
      setSubstages(await listSubstages());
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(APP_ROUTES.ADMIN_PIPELINE);
  };

  useEffect(() => {
    void refreshSubstages();
  }, []);

  return (
    <Stack spacing={3} className="page-enter">
      <PageHeader
        title="Sub-Stages"
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" className="gap-1.5" onClick={goBack}>
              <ArrowLeft size={14} />
              Back
            </Button>
            <Link to={APP_ROUTES.ADMIN_PIPELINE}>
              <Button variant="outlined" size="small" className="gap-1.5">
                <ArrowLeft size={14} />
                Back to Pipeline
              </Button>
            </Link>
            <Button variant="contained" onClick={() => void refreshSubstages()}>Refresh</Button>
          </Stack>
        }
      />
      <SubStageManager substages={substages} onChanged={() => void refreshSubstages()} />
    </Stack>
  );
}
