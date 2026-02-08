import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from "prop-types";
import { Button, MenuItem, Paper, Stack, TextField, Typography } from "@/components/ui/mui";
import { useState } from "react";
import { createSubstage, deleteSubstage } from "../api";
import { STAGE_ORDER } from "../utils";

export function SubStageManager({ substages, onChanged }) {
  const [name, setName] = useState("");
  const [mainStage, setMainStage] = useState("submitted");

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      await createSubstage({ name, main_stage: mainStage, order_index: 0, is_active: true });
      setName("");
      onChanged();
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  const handleDelete = async (substageId) => {
    try {
      await deleteSubstage(substageId);
      onChanged();
    } catch {
      // Error feedback is handled globally by the API client interceptor.
    }
  };

  return (_jsxs(Paper, { elevation: 0, sx: { p: 2, border: "1px solid #d6dfd0" }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, children: "Sub-Stage Manager" }), _jsxs(Stack, { direction: "row", spacing: 1, mb: 2, flexWrap: "wrap", children: [_jsx(TextField, { label: "Sub-stage name", value: name, onChange: (event) => setName(event.target.value), size: "small" }), _jsx(TextField, { select: true, size: "small", label: "Main stage", value: mainStage, onChange: (event) => setMainStage(event.target.value), children: STAGE_ORDER.map((stage) => (_jsx(MenuItem, { value: stage, children: stage }, stage))) }), _jsx(Button, { variant: "contained", onClick: () => void handleCreate(), children: "Add Sub-stage" })] }), _jsx(Stack, { spacing: 1, children: substages.map((substage) => (_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", sx: { p: 1, border: "1px solid #e3e9de" }, children: [_jsxs(Typography, { variant: "body2", children: [substage.main_stage, " \u2022 ", substage.name] }), _jsx(Button, { size: "small", color: "error", onClick: () => void handleDelete(substage.id), children: "Delete" })] }, substage.id))) })] }));
}

SubStageManager.propTypes = {
  substages: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChanged: PropTypes.func.isRequired,
};
