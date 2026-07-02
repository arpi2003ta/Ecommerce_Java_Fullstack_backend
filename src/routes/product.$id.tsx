import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Box, Button, Chip, Container, Grid, Rating, Stack, Typography, IconButton } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { ProductCard } from "@/components/ProductCard";
import { useApp } from "@/store/AppContext";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { products, addToCart } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <Box>
        <StoreHeader query={query} onQuery={setQuery} />
        <Container sx={{ py: 10, textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Product not found</Typography>
          <Button component={Link} {...({ to: "/" } as object)} sx={{ mt: 2 }} variant="contained">Back to shop</Button>
        </Container>
      </Box>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <StoreHeader query={query} onQuery={setQuery} />
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <IconButton onClick={() => navigate({ to: "/" })} sx={{ mb: 2 }}><ArrowBackIcon /></IconButton>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                borderRadius: 4, overflow: "hidden", bgcolor: "#f1f1ec",
                aspectRatio: "1 / 1",
                backgroundImage: `url(${product.image})`,
                backgroundSize: "cover", backgroundPosition: "center",
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2.5}>
              <Chip label={product.category} sx={{ alignSelf: "flex-start", bgcolor: "primary.main", color: "#fff" }} />
              <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 44 } }}>{product.name}</Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Rating value={product.rating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">{product.rating.toFixed(1)} rating</Typography>
              </Stack>
              <Typography variant="h3" sx={{ fontSize: 36, fontWeight: 800 }}>
                ${product.price.toFixed(2)}
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {product.description} Every piece is crafted with attention to detail — designed to feel just as good as it looks. Free shipping on orders over $200.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingBagOutlinedIcon />}
                  onClick={() => addToCart(product.id)}
                  sx={{ bgcolor: "#0f172a", "&:hover": { bgcolor: "#1e293b" } }}
                >
                  Add to bag
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => { addToCart(product.id); navigate({ to: "/cart" }); }}
                >
                  Buy now
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {related.length > 0 && (
          <Box sx={{ mt: 10 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>You may also like</Typography>
            <Grid container spacing={3}>
              {related.map((p) => (
                <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <ProductCard product={p} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}