import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from "prop-types";
import { Paper, Stack, Typography } from "@/components/ui/mui";
export function ResourceGroup({ title, items }) {
    return (_jsxs(Paper, { elevation: 0, sx: { p: 2, border: "1px solid #d6dfd0" }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: title }), _jsx(Stack, { spacing: 1, children: items.map((item) => (_jsxs(Paper, { variant: "outlined", sx: { p: 1.5 }, children: [_jsx(Typography, { variant: "h6", children: item.title }), _jsx(Typography, { variant: "body2", children: item.content })] }, item.id))) })] }));
}
ResourceGroup.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
};
