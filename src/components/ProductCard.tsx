import { Box, Card, CardContent, Chip, IconButton, Rating, Stack, Typography, Button } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import type { Product } from "@/data/products";
import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/store/AppContext";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate({ to: "/product/$id", params: { id: String(product.id) } })}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 250ms ease, box-shadow 250ms ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 40px -20px rgba(15,23,42,0.25)",
        },
        "&:hover .product-image": { transform: "scale(1.05)" },
        "&:hover .add-btn": { opacity: 1, transform: "translateY(0)" },
      }}
    >
      <Box sx={{ position: "relative", pt: "100%", overflow: "hidden", bgcolor: "#f1f1ec" }}>
        <Box
          className="product-image"
          sx={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${product.image})`,
            backgroundSize: "cover", backgroundPosition: "center",
            transition: "transform 500ms ease",
          }}
        />
        <Chip
          label={product.category}
          size="small"
          sx={{ position: "absolute", top: 12, left: 12, bgcolor: "rgba(255,255,255,0.9)", fontWeight: 600 }}
        />
        <IconButton
          size="small"
          sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(255,255,255,0.9)", "&:hover": { bgcolor: "#fff" } }}
        >
          <FavoriteBorderIcon fontSize="small" />
        </IconButton>
        <Box
          className="add-btn"
          sx={{
            position: "absolute", left: 12, right: 12, bottom: 12,
            opacity: 0, transform: "translateY(8px)",
            transition: "all 250ms ease",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingBagOutlinedIcon />}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product.id); }}
            sx={{ bgcolor: "#0f172a", color: "#fff", "&:hover": { bgcolor: "#1e293b" } }}
          >
            Add to bag
          </Button>
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {product.description}
        </Typography>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mt: "auto", pt: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            ${product.price.toFixed(2)}
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <Rating value={product.rating} precision={0.1} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">
              {product.rating.toFixed(1)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}