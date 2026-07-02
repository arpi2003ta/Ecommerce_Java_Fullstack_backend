import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Box, Button, Chip, Container, Divider, Paper, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { useApp } from "@/store/AppContext";

export const Route = createFileRoute("/order/$id")({
  component: OrderSummary,
});

function OrderSummary() {
  const { id } = Route.useParams();
  const { orders } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const order = orders.find((o) => o.id === id);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <StoreHeader query={query} onQuery={setQuery} />
      <Container maxWidth="md" sx={{ py: 5 }}>
        {!order ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "1px solid #eee" }} elevation={0}>
            <Typography variant="h5">Order not found</Typography>
            <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate({ to: "/" })}>Back to shop</Button>
          </Paper>
        ) : (
          <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, border: "1px solid #eee" }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4">Thank you for your order!</Typography>
                <Typography color="text.secondary">Order #{order.id.slice(0, 8).toUpperCase()}</Typography>
              </Box>
            </Stack>
            <Chip label={order.status} color={order.status === "Delivered" ? "success" : "default"} sx={{ mb: 3 }} />

            <Typography variant="subtitle2" color="text.secondary">Shipping to</Typography>
            <Typography sx={{ mb: 3 }}>{order.address}</Typography>

            <Stack spacing={2}>
              {order.items.map((i) => (
                <Stack key={i.productId} direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Box sx={{ width: 64, height: 64, borderRadius: 2, backgroundImage: `url(${i.image})`, backgroundSize: "cover" }} />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700 }} noWrap>{i.name}</Typography>
                    <Typography variant="caption" color="text.secondary">Qty {i.qty} · ${i.price.toFixed(2)}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 700 }}>${(i.price * i.qty).toFixed(2)}</Typography>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />
            <Stack spacing={1}>
              <Row label="Subtotal" value={`$${order.subtotal.toFixed(2)}`} />
              <Row label="Shipping" value={order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`} />
              <Row label="Total" value={`$${order.total.toFixed(2)}`} bold />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button variant="contained" onClick={() => navigate({ to: "/" })} sx={{ bgcolor: "#0f172a" }}>Continue shopping</Button>
              <Button variant="outlined" onClick={() => navigate({ to: "/orders" })}>All orders</Button>
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
      <Typography sx={{ fontWeight: bold ? 800 : 400 }}>{label}</Typography>
      <Typography sx={{ fontWeight: bold ? 800 : 600 }}>{value}</Typography>
    </Stack>
  );
}