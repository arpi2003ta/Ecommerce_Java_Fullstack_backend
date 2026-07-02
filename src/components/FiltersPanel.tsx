import { Box, Checkbox, FormControlLabel, Slider, Stack, Typography, Button, Divider } from "@mui/material";
import { CATEGORIES } from "@/data/products";

export type Filters = {
  categories: string[];
  price: [number, number];
  minRating: number;
};

export const DEFAULT_FILTERS: Filters = {
  categories: [],
  price: [0, 500],
  minRating: 0,
};

export function FiltersPanel({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
}) {
  const toggleCategory = (c: string) => {
    const has = value.categories.includes(c);
    onChange({
      ...value,
      categories: has ? value.categories.filter((x) => x !== c) : [...value.categories, c],
    });
  };

  return (
    <Box sx={{
      position: { md: "sticky" }, top: { md: 88 },
      p: 3, borderRadius: 3, bgcolor: "background.paper",
      border: "1px solid #eee",
    }}>
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Filters</Typography>
        <Button size="small" onClick={() => onChange(DEFAULT_FILTERS)}>Clear</Button>
      </Stack>

      <Typography variant="overline" color="text.secondary">Category</Typography>
      <Stack sx={{ mb: 2 }}>
        {CATEGORIES.map((c) => (
          <FormControlLabel
            key={c}
            control={
              <Checkbox
                size="small"
                checked={value.categories.includes(c)}
                onChange={() => toggleCategory(c)}
              />
            }
            label={c}
          />
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography variant="overline" color="text.secondary">Price</Typography>
      <Box sx={{ px: 1, mt: 1 }}>
        <Slider
          value={value.price}
          min={0}
          max={500}
          step={10}
          onChange={(_, v) => onChange({ ...value, price: v as [number, number] })}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `$${v}`}
        />
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Typography variant="caption" color="text.secondary">${value.price[0]}</Typography>
          <Typography variant="caption" color="text.secondary">${value.price[1]}</Typography>
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="overline" color="text.secondary">Minimum rating</Typography>
      <Box sx={{ px: 1, mt: 1 }}>
        <Slider
          value={value.minRating}
          min={0}
          max={5}
          step={0.5}
          marks
          onChange={(_, v) => onChange({ ...value, minRating: v as number })}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
}