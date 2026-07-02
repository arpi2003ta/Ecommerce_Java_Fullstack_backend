import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Box, Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { useApp } from "@/store/AppContext";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const { user, orders } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => { if (!user) navigate({ to: "/auth" }); }, [user, navigate]);
  if (!user) return null;

  const mine = orders.filter((o) => o.userId === user.id);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <StoreHeader query={query} onQuery={setQuery} />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h3" sx={{ mb: 4 }}>My orders</Typography>
        {mine.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "1px solid #eee" }}>
            <Typography variant="h6">No orders yet</Typography>
            <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate({ to: "/" })}>Start shopping</Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {mine.map((o) => (
              <Paper key={o.id} elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", cursor: "pointer" }}
                onClick={() => navigate({ to: "/order/$id", params: { id: o.id } })}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>Order #{o.id.slice(0, 8).toUpperCase()}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item{o.items.length === 1 ? "" : "s"}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Chip label={o.status} size="small" />
                    <Typography sx={{ fontWeight: 800 }}>${o.total.toFixed(2)}</Typography>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}