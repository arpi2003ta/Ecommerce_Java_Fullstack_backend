import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
  Chip,
  Drawer,
  IconButton,
  Button,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { PRODUCTS } from "@/data/products";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { FiltersPanel, DEFAULT_FILTERS, type Filters } from "@/components/FiltersPanel";

export const Route = createFileRoute("/")({
  component: Index,
});

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

const PAGE_SIZE = 9;

function Index() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (p.price < filters.price[0] || p.price > filters.price[1]) return false;
      if (p.rating < filters.minRating) return false;
      return true;
    });

    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      case "newest": list = [...list].sort((a, b) => b.createdAt - a.createdAt); break;
    }
    return list;
  }, [query, filters, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeFilterChips = [
    ...filters.categories.map((c) => ({ key: `c-${c}`, label: c, clear: () => setFilters({ ...filters, categories: filters.categories.filter((x) => x !== c) }) })),
    ...(filters.price[0] !== 0 || filters.price[1] !== 500
      ? [{ key: "p", label: `$${filters.price[0]}–$${filters.price[1]}`, clear: () => setFilters({ ...filters, price: [0, 500] as [number, number] }) }]
      : []),
    ...(filters.minRating > 0
      ? [{ key: "r", label: `${filters.minRating}★ & up`, clear: () => setFilters({ ...filters, minRating: 0 }) }]
      : []),
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <StoreHeader query={query} onQuery={(q) => { setQuery(q); setPage(1); }} />

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <HeroCarousel />

        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt: 6, mb: 3, alignItems: { sm: "flex-end" }, justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">Curated collection</Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 44 } }}>Shop everything</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {filtered.length} product{filtered.length === 1 ? "" : "s"}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Button
              variant="outlined"
              startIcon={<TuneIcon />}
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { md: "none" } }}
            >
              Filters
            </Button>
            <Select
              size="small"
              value={sort}
              onChange={(e) => { setSort(e.target.value as SortKey); setPage(1); }}
              sx={{ minWidth: 200, borderRadius: 999, bgcolor: "background.paper" }}
            >
              <MenuItem value="featured">Featured</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="rating">Top Rated</MenuItem>
            </Select>
          </Stack>
        </Stack>

        {activeFilterChips.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, mb: 2 }}>
            {activeFilterChips.map((c) => (
              <Chip key={c.key} label={c.label} onDelete={c.clear} />
            ))}
          </Stack>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: "none", md: "block" } }}>
            <FiltersPanel value={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            {pageItems.length === 0 ? (
              <Box sx={{ py: 10, textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>No products match your filters</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Try clearing filters or searching for something else.
                </Typography>
                <Button sx={{ mt: 2 }} variant="contained" onClick={() => { setFilters(DEFAULT_FILTERS); setQuery(""); }}>
                  Reset
                </Button>
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {pageItems.map((p) => (
                    <Grid key={p.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                      <ProductCard product={p} />
                    </Grid>
                  ))}
                </Grid>
                <Stack sx={{ mt: 5, alignItems: "center" }}>
                  <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={(_, v) => { setPage(v); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    shape="rounded"
                    color="primary"
                  />
                </Stack>
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 320, p: 2 }}>
          <FiltersPanel value={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => setDrawerOpen(false)}>
            Show {filtered.length} results
          </Button>
        </Box>
      </Drawer>

      <Box component="footer" sx={{ mt: 10, py: 6, borderTop: "1px solid #eee", textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: "-0.03em" }}>
          Luxe<Box component="span" sx={{ color: "secondary.main" }}>.</Box>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          © {new Date().getFullYear()} Luxe. Thoughtfully designed goods.
        </Typography>
      </Box>
    </Box>
  );
}

// silence unused import for TS if IconButton isn't referenced (kept for future use)
void IconButton;
