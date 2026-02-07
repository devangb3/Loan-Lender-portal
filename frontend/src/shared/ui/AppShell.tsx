import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../modules/auth/hooks";

export function AppShell(): JSX.Element {
  const { user, logout } = useAuth();

  const links =
    user?.role === "admin"
      ? [
          { to: "/admin/pipeline", label: "Pipeline" },
          { to: "/admin/partners", label: "Partners" },
          { to: "/admin/lenders", label: "Lenders" },
          { to: "/admin/commissions", label: "Commissions" },
          { to: "/admin/exports", label: "Exports" },
        ]
      : user?.role === "partner"
        ? [
            { to: "/partner", label: "Dashboard" },
            { to: "/partner/resources", label: "Resources" },
          ]
        : [{ to: "/borrower", label: "Applications" }];

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(120deg, #f4f7f1 0%, #fef9ef 45%, #f1ebe7 100%)" }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: "blur(10px)" }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, letterSpacing: 1.2 }}>
            Loan Referral Platform
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {user && <Typography variant="body2">{user.email}</Typography>}
            <Button onClick={logout} color="inherit" variant="outlined" size="small">
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ pt: 4, pb: 6 }}>
        <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
          {links.map((link) => (
            <Button key={link.to} component={Link} to={link.to} variant="contained">
              {link.label}
            </Button>
          ))}
        </Stack>
        <Outlet />
      </Container>
    </Box>
  );
}
