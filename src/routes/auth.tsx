import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Alert, Box, Button, Container, Paper, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useApp } from "@/store/AppContext";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { user, login, signup } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError("Please enter email and password");
    if (tab === 0) {
      const r = login(email, password);
      if (r.error) setError(r.error);
    } else {
      if (!name.trim()) return setError("Please enter your name");
      if (password.length < 4) return setError("Password must be at least 4 characters");
      const r = signup({ email, password, name });
      if (r.error) setError(r.error);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      bgcolor: "background.default",
      backgroundImage: "radial-gradient(circle at 20% 20%, rgba(225,29,72,0.06), transparent 40%), radial-gradient(circle at 80% 80%, rgba(15,23,42,0.06), transparent 40%)",
    }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, border: "1px solid #eee" }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.03em" }}>
            Luxe<Box component="span" sx={{ color: "secondary.main" }}>.</Box>
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {tab === 0 ? "Welcome back — sign in to continue." : "Create your account to start shopping."}
          </Typography>

          <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(null); }} sx={{ mb: 3 }}>
            <Tab label="Sign in" />
            <Tab label="Create account" />
          </Tabs>

          <form onSubmit={submit}>
            <Stack spacing={2}>
              {tab === 1 && (
                <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              )}
              <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
              {error && <Alert severity="error">{error}</Alert>}
              <Button type="submit" variant="contained" size="large" sx={{ bgcolor: "#0f172a", "&:hover": { bgcolor: "#1e293b" } }}>
                {tab === 0 ? "Sign in" : "Create account"}
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                Demo admin: <b>admin@luxe.com</b> / <b>admin</b>
              </Typography>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}