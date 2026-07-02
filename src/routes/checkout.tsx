import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Alert, Box, Button, Container, Divider, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { useApp } from "@/store/AppContext";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { user, cart, products, placeOrder, updateProfile } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [name, setName] = useState(user?.name ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) navigate({ to: "/auth" });
  }, [user, navigate]);

  const items = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.productId)! })).filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 200 ? 0 : 12;
  const total = subtotal + shipping;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !address || !city || !zip) return setError("Please complete all shipping fields");
    if (items.length === 0) return setError("Your cart is empty");
    updateProfile({ name, address });
    const fullAddress = `${name}, ${address}, ${city} ${zip}`;
    const order = placeOrder(fullAddress);
    if (order) navigate({ to: "/order/$id", params: { id: order.id } });
  };

  if (!user) return null;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <StoreHeader query={query} onQuery={setQuery} />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h3" sx={{ mb: 4 }}>Checkout</Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Shipping details</Typography>
              <form onSubmit={submit}>
                <Stack spacing={2}>
                  <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                  <TextField label="Street address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />
                    <TextField label="ZIP / Postal code" value={zip} onChange={(e) => setZip(e.target.value)} fullWidth />
                  </Stack>
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Payment integration is disabled in this demo. Placing an order records it for the order summary and admin.
                  </Alert>
                  {error && <Alert severity="error">{error}</Alert>}
                  <Button type="submit" variant="contained" size="large" sx={{ bgcolor: "#0f172a", "&:hover": { bgcolor: "#1e293b" } }}>
                    Place order
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Order</Typography>
              <Stack spacing={2}>
                {items.map((i) => (
                  <Stack key={i.productId} direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Box sx={{ width: 56, height: 56, borderRadius: 1.5, backgroundImage: `url(${i.product.image})`, backgroundSize: "cover" }} />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700 }} noWrap>{i.product.name}</Typography>
                      <Typography variant="caption" color="text.secondary">Qty {i.qty}</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700 }}>${(i.product.price * i.qty).toFixed(2)}</Typography>
                  </Stack>
                ))}
                <Divider />
                <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                <Row label="Shipping" value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`} />
                <Divider />
                <Row label="Total" value={`$${total.toFixed(2)}`} bold />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
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