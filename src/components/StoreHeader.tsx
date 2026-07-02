import { AppBar, Badge, IconButton, InputBase, Stack, Toolbar, Typography, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";

export function StoreHeader({ query, onQuery }: { query: string; onQuery: (q: string) => void }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", color: "text.primary", borderBottom: "1px solid #eee" }}
    >
      <Toolbar sx={{ gap: 2, py: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: "-0.03em", mr: 2 }}>
          Luxe<Box component="span" sx={{ color: "secondary.main" }}>.</Box>
        </Typography>

        <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
          {["Shop", "New", "Collections", "Journal"].map((l) => (
            <Typography key={l} sx={{ fontWeight: 500, cursor: "pointer", "&:hover": { color: "secondary.main" } }}>
              {l}
            </Typography>
          ))}
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

        <IconButton><PersonOutlineIcon /></IconButton>
        <IconButton>
          <Badge badgeContent={2} color="secondary"><FavoriteBorderIcon /></Badge>
        </IconButton>
        <IconButton>
          <Badge badgeContent={3} color="secondary"><ShoppingBagOutlinedIcon /></Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}