import { AppBar, Badge, IconButton, InputBase, Stack, Toolbar, Typography, Box, Menu, MenuItem, Avatar, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type MouseEvent } from "react";
import { useApp } from "@/store/AppContext";
import { CartDrawer } from "@/components/CartDrawer";

export function StoreHeader({ query, onQuery }: { query: string; onQuery: (q: string) => void }) {
  const { user, logout, cart } = useApp();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const open = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
  const close = () => setAnchor(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", color: "text.primary", borderBottom: "1px solid #eee" }}
    >
      <Toolbar sx={{ gap: 2, py: 1 }}>
        <Typography
          variant="h5"
          component={Link}
          {...({ to: "/" } as object)}
          sx={{ fontWeight: 900, letterSpacing: "-0.03em", mr: 2, textDecoration: "none", color: "inherit" }}
        >
          Luxe<Box component="span" sx={{ color: "secondary.main" }}>.</Box>
        </Typography>

        <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit", fontWeight: 500 }}>Shop</Link>
          {user?.role === "admin" && (
            <Link to="/admin" style={{ textDecoration: "none", color: "inherit", fontWeight: 500 }}>Admin</Link>
          )}
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{
          display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1,
          bgcolor: "#f4f4ef", borderRadius: 999, px: 2, py: 0.5, minWidth: 240,
        }}>
          <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <InputBase
            placeholder="Search products…"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            sx={{ flex: 1, fontSize: 14 }}
          />
        </Box>

        {user ? (
          <>
            <IconButton onClick={open}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 14 }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
              <MenuItem disabled sx={{ opacity: 1 }}>
                <Stack>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                </Stack>
              </MenuItem>
              {user.role === "admin" && (
                <MenuItem onClick={() => { close(); navigate({ to: "/admin" }); }}>
                  <AdminPanelSettingsOutlinedIcon fontSize="small" style={{ marginRight: 8 }} />
                  Admin dashboard
                </MenuItem>
              )}
              <MenuItem onClick={() => { close(); navigate({ to: "/orders" }); }}>My orders</MenuItem>
              <MenuItem onClick={() => { close(); logout(); }}>Sign out</MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            variant="text"
            startIcon={<PersonOutlineIcon />}
            onClick={() => navigate({ to: "/auth" })}
            sx={{ color: "text.primary" }}
          >
            Sign in
          </Button>
        )}
        <IconButton sx={{ display: { xs: "none", sm: "inline-flex" } }}>
          <Badge badgeContent={0} color="secondary" showZero={false}><FavoriteBorderIcon /></Badge>
        </IconButton>
        <IconButton onClick={() => setCartOpen(true)} aria-label="Open cart">
          <Badge badgeContent={cartCount} color="secondary"><ShoppingBagOutlinedIcon /></Badge>
        </IconButton>
      </Toolbar>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </AppBar>
  );
}