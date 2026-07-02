import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Box, Button, Container, Divider, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { useApp } from "@/store/AppContext";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { cart, products, setCartQty, removeFromCart, user } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const items = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.productId)! })).filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <StoreHeader query={query} onQuery={setQuery} />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h3" sx={{ mb: 4 }}>Your bag</Typography>

        {items.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: "center", borderRadius: 4, border: "1px solid #eee" }} elevation={0}>
            <Typography variant="h6">Your bag is empty</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>Discover something you'll love.</Typography>
            <Button variant="contained" onClick={() => navigate({ to: "/" })} sx={{ bgcolor: "#0f172a" }}>Continue shopping</Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={2}>
                {items.map((i) => (
                  <Paper key={i.productId} elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #eee" }}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                      <Box sx={{ width: 96, height: 96, borderRadius: 2, backgroundImage: `url(${i.product.image})`, backgroundSize: "cover", backgroundPosition: "center", flexShrink: 0 }} />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700 }} noWrap>{i.product.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{i.product.category}</Typography>
                        <Typography sx={{ fontWeight: 800, mt: 0.5 }}>${i.product.price.toFixed(2)}</Typography>
                      </Box>
                      <Stack direction="row" sx={{ alignItems: "center", border: "1px solid #eee", borderRadius: 999 }}>
                        <IconButton size="small" onClick={() => setCartQty(i.productId, i.qty - 1)}><RemoveIcon fontSize="small" /></IconButton>
                        <Typography sx={{ minWidth: 28, textAlign: "center", fontWeight: 700 }}>{i.qty}</Typography>
                        <IconButton size="small" onClick={() => setCartQty(i.productId, i.qty + 1)}><AddIcon fontSize="small" /></IconButton>
                      </Stack>
                      <IconButton onClick={() => removeFromCart(i.productId)}><DeleteOutlineIcon /></IconButton>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", position: { md: "sticky" }, top: { md: 88 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Order summary</Typography>
                <Stack spacing={1.2}>
                  <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                  <Row label="Shipping" value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`} />
                  <Divider />
                  <Row label="Total" value={`$${total.toFixed(2)}`} bold />
                </Stack>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3, bgcolor: "#0f172a", "&:hover": { bgcolor: "#1e293b" } }}
                  onClick={() => navigate({ to: user ? "/checkout" : "/auth" })}
                >
                  {user ? "Checkout" : "Sign in to checkout"}
                </Button>
                {subtotal < 200 && subtotal > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, textAlign: "center" }}>
                    Spend ${(200 - subtotal).toFixed(2)} more for free shipping.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
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