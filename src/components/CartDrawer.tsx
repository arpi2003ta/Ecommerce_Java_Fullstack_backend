import {
  Box, Button, Divider, Drawer, IconButton, Stack, Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/store/AppContext";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, products, setCartQty, removeFromCart, user } = useApp();
  const navigate = useNavigate();

  const items = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.productId)! }))
    .filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;

  const go = (to: "/cart" | "/checkout" | "/auth") => {
    onClose();
    navigate({ to });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 420 },
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", p: 2, borderBottom: "1px solid #eee" }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <ShoppingBagOutlinedIcon />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Your bag ({items.reduce((s, i) => s + i.qty, 0)})
          </Typography>
        </Stack>
        <IconButton onClick={onClose} aria-label="Close cart"><CloseIcon /></IconButton>
      </Stack>

      {items.length === 0 ? (
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4, textAlign: "center" }}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6">Your bag is empty</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Add something you love to get started.
          </Typography>
          <Button variant="contained" onClick={onClose} sx={{ bgcolor: "#0f172a", "&:hover": { bgcolor: "#1e293b" } }}>
            Continue shopping
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
            <Stack spacing={2}>
              {items.map((i) => (
                <Stack key={i.productId} direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      width: 72, height: 72, borderRadius: 2, flexShrink: 0,
                      backgroundImage: `url(${i.product.image})`,
                      backgroundSize: "cover", backgroundPosition: "center",
                    }}
                  />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>{i.product.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{i.product.category}</Typography>
                    <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mt: 1 }}>
                      <Stack direction="row" sx={{ alignItems: "center", border: "1px solid #eee", borderRadius: 999 }}>
                        <IconButton size="small" onClick={() => setCartQty(i.productId, i.qty - 1)} aria-label="Decrease quantity">
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 24, textAlign: "center", fontWeight: 700, fontSize: 14 }}>{i.qty}</Typography>
                        <IconButton size="small" onClick={() => setCartQty(i.productId, i.qty + 1)} aria-label="Increase quantity">
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <Typography sx={{ fontWeight: 800 }}>${(i.product.price * i.qty).toFixed(2)}</Typography>
                    </Stack>
                  </Box>
                  <IconButton size="small" onClick={() => removeFromCart(i.productId)} aria-label="Remove item">
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Box sx={{ borderTop: "1px solid #eee", p: 2 }}>
            <Stack spacing={0.75} sx={{ mb: 2 }}>
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`} muted />
              <Divider sx={{ my: 0.5 }} />
              <Row label="Total" value={`$${total.toFixed(2)}`} bold />
            </Stack>
            {subtotal < 200 && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mb: 1.5 }}>
                Spend ${(200 - subtotal).toFixed(2)} more for free shipping.
              </Typography>
            )}
            <Stack spacing={1}>
              <Button
                fullWidth variant="contained" size="large"
                onClick={() => go(user ? "/checkout" : "/auth")}
                sx={{ bgcolor: "#0f172a", "&:hover": { bgcolor: "#1e293b" } }}
              >
                {user ? "Checkout" : "Sign in to checkout"}
              </Button>
              <Button fullWidth variant="outlined" onClick={() => go("/cart")}>
                View full cart
              </Button>
            </Stack>
          </Box>
        </>
      )}
    </Drawer>
  );
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
      <Typography sx={{ fontWeight: bold ? 800 : 500, color: muted ? "text.secondary" : "text.primary" }}>{label}</Typography>
      <Typography sx={{ fontWeight: bold ? 800 : 600 }}>{value}</Typography>
    </Stack>
  );
}