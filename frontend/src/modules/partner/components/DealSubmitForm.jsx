import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from "prop-types";
import { Button, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@/components/ui/mui";
import { useState } from "react";
import { submitDeal } from "../api";
import { AddressAutocomplete } from "./AddressAutocomplete";
const propertyTypes = ["multifamily", "retail", "office", "industrial", "mixed_use", "land", "hospitality", "other"];
const transactionTypes = ["purchase", "refinance", "cash_out_refinance", "construction", "bridge"];
export function DealSubmitForm({ onSubmitted }) {
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [address, setAddress] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            const form = new FormData(event.currentTarget);
            form.set("property_address", address);
            if (file)
                form.append("upload", file);
            await submitDeal(form);
            event.currentTarget.reset();
            setFile(null);
            setAddress("");
            onSubmitted();
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs(Paper, { elevation: 0, sx: { p: 3, border: "1px solid #d6dfd0" }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "Submit Deal in 60 Seconds" }), _jsxs(Stack, { component: "form", spacing: 2, onSubmit: handleSubmit, children: [_jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { size: { xs: 12, md: 6 }, children: _jsx(TextField, { select: true, name: "property_type", fullWidth: true, defaultValue: "multifamily", label: "Property Type", children: propertyTypes.map((option) => (_jsx(MenuItem, { value: option, children: option }, option))) }) }), _jsx(Grid, { size: { xs: 12, md: 6 }, children: _jsx(TextField, { select: true, name: "transaction_type", fullWidth: true, defaultValue: "purchase", label: "Transaction Type", children: transactionTypes.map((option) => (_jsx(MenuItem, { value: option, children: option }, option))) }) }), _jsxs(Grid, { size: { xs: 12 }, children: [_jsx(AddressAutocomplete, { value: address, onChange: setAddress }), _jsx("input", { type: "hidden", name: "property_address", value: address })] }), _jsx(Grid, { size: { xs: 12, md: 4 }, children: _jsx(TextField, { name: "loan_amount", label: "Loan Amount", fullWidth: true, type: "number", required: true }) }), _jsx(Grid, { size: { xs: 12, md: 4 }, children: _jsx(TextField, { name: "borrower_name", label: "Borrower Name", fullWidth: true, required: true }) }), _jsx(Grid, { size: { xs: 12, md: 4 }, children: _jsx(TextField, { name: "borrower_phone", label: "Borrower Phone", fullWidth: true, required: true }) }), _jsx(Grid, { size: { xs: 12 }, children: _jsx(TextField, { name: "borrower_email", label: "Borrower Email", fullWidth: true, required: true, type: "email" }) })] }), _jsxs(Button, { variant: "outlined", component: "label", children: ["Optional Document Upload", _jsx("input", { type: "file", hidden: true, onChange: (event) => {
                                    setFile(event.target.files?.[0] ?? null);
                                } })] }), _jsx(Button, { type: "submit", variant: "contained", disabled: submitting, children: submitting ? "Submitting..." : "Submit Deal" })] })] }));
}
DealSubmitForm.propTypes = {
    onSubmitted: PropTypes.func.isRequired,
};
