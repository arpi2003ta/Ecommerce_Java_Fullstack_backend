import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Box, Button, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, MenuItem, Paper, Stack, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tabs, TextField, Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useMemo, useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { useApp } from "@/store/AppContext";
import { CATEGORIES, type Product } from "@/data/products";
import type { Order } from "@/store/AppContext";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const STATUSES: Order["status"][] = ["Pending", "Paid", "Shipped", "Delivered"];

function AdminPage() {
  const { user, products, orders, upsertProduct, deleteProduct, updateOrderStatus } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate({ to: "/auth" });
    else if (user.role !== "admin") navigate({ to: "/" });
  }, [user, navigate]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    return {
      products: products.length,
      orders: orders.length,
      revenue,
      pending: orders.filter((o) => o.status === "Pending").length,
    };
  }, [products, orders]);

  const openNew = () => {
    setEditing({
      id: Date.now(),
      name: "",
      category: CATEGORIES[0],
      price: 0,
      rating: 4.5,
      image: `https://picsum.photos/seed/new${Date.now()}/600/600`,
      description: "",
      createdAt: Date.now(),
    });
    setOpen(true);
  };

  const save = () => {
    if (!editing) return;
    upsertProduct(editing);
    setOpen(false);
    setEditing(null);
  };

  if (!user || user.role !== "admin") return null;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <StoreHeader query={query} onQuery={setQuery} />
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h3">Admin dashboard</Typography>
            <Typography color="text.secondary">Manage products and orders</Typography>
          </Box>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <StatCard label="Products" value={String(stats.products)} />
          <StatCard label="Orders" value={String(stats.orders)} />
          <StatCard label="Revenue" value={`$${stats.revenue.toFixed(2)}`} />
          <StatCard label="Pending" value={String(stats.pending)} accent />
        </Grid>

        <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #eee" }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderBottom: "1px solid #eee" }}>
            <Tab label="Products" />
            <Tab label="Orders" />
          </Tabs>

          {tab === 0 && (
            <Box sx={{ p: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "flex-end", mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openNew} sx={{ bgcolor: "#0f172a" }}>
                  Add product
                </Button>
              </Stack>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Rating</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: 1, backgroundImage: `url(${p.image})`, backgroundSize: "cover" }} />
                            <Typography sx={{ fontWeight: 600 }}>{p.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell><Chip label={p.category} size="small" /></TableCell>
                        <TableCell align="right">${p.price.toFixed(2)}</TableCell>
                        <TableCell align="right">{p.rating.toFixed(1)}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => { setEditing(p); setOpen(true); }}><EditIcon fontSize="small" /></IconButton>
                          <IconButton onClick={() => { if (confirm("Delete this product?")) deleteProduct(p.id); }}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {tab === 1 && (
            <Box sx={{ p: 2 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.length === 0 && (
                      <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>No orders yet</TableCell></TableRow>
                    )}
                    {orders.map((o) => (
                      <TableRow key={o.id} hover>
                        <TableCell sx={{ fontFamily: "monospace" }}>#{o.id.slice(0, 8).toUpperCase()}</TableCell>
                        <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{o.items.reduce((s, i) => s + i.qty, 0)}</TableCell>
                        <TableCell align="right">${o.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <TextField
                            select size="small" value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as Order["status"])}
                            sx={{ minWidth: 130 }}
                          >
                            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                          </TextField>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Container>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing && products.some((p) => p.id === editing.id) ? "Edit product" : "New product"}</DialogTitle>
        <DialogContent>
          {editing && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} fullWidth />
              <TextField select label="Category" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} fullWidth>
                {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <Stack direction="row" spacing={2}>
                <TextField label="Price" type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} fullWidth />
                <TextField label="Rating" type="number" slotProps={{ htmlInput: { step: 0.1, min: 0, max: 5 } }} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} fullWidth />
              </Stack>
              <TextField label="Image URL" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} fullWidth />
              <TextField label="Description" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} fullWidth multiline rows={3} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} variant="contained" sx={{ bgcolor: "#0f172a" }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Grid size={{ xs: 6, md: 3 }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", bgcolor: accent ? "#fef2f2" : "#fff" }}>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</Typography>
        <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 800 }}>{value}</Typography>
      </Paper>
    </Grid>
  );
}