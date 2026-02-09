import { Button, MenuItem, Stack, TextField } from "@/components/ui/mui";
import { LenderAssignForm } from "../components/LenderAssignForm";
import { LenderImportForm } from "../components/LenderImportForm";
import { LendersTable } from "../components/LendersTable";
import { useLenders } from "../hooks";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PROPERTY_TYPES } from "@/shared/constants";

export function AdminLendersPage() {
  const {
    lenders,
    deals,
    query,
    setQuery,
    specialty,
    setSpecialty,
    stateFilter,
    setStateFilter,
    propertyType,
    setPropertyType,
    minLoan,
    setMinLoan,
    maxLoan,
    setMaxLoan,
    refresh,
  } = useLenders();

  return (
    <Stack spacing={3} className="page-enter">
      <PageHeader
        title="Lender Database"
        actions={(
          <>
            <Button
              variant="outlined"
              onClick={() => {
                setQuery("");
                setSpecialty("");
                setStateFilter("");
                setPropertyType("");
                setMinLoan("");
                setMaxLoan("");
              }}
            >
              Clear Filters
            </Button>
            <Button variant="contained" onClick={() => void refresh()}>Refresh</Button>
          </>
        )}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
        <TextField
          className="lg:col-span-2"
          label="Search lenders"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <TextField label="Specialty" value={specialty} onChange={(event) => setSpecialty(event.target.value)} />
        <TextField label="State" value={stateFilter} onChange={(event) => setStateFilter(event.target.value)} placeholder="CA" />
        <TextField
          select
          label="Property type"
          value={propertyType}
          onChange={(event) => setPropertyType(event.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {PROPERTY_TYPES.map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </TextField>
        <TextField label="Min loan" type="number" value={minLoan} onChange={(event) => setMinLoan(event.target.value)} />
        <TextField label="Max loan" type="number" value={maxLoan} onChange={(event) => setMaxLoan(event.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LenderImportForm onImported={() => void refresh()} />
        <LenderAssignForm deals={deals} lenders={lenders} onAssigned={() => void refresh()} />
      </div>

      <LendersTable lenders={lenders} onDeleted={() => void refresh()} />
    </Stack>
  );
}
