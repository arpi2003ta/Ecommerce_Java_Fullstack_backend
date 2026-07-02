import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { CAROUSEL_SLIDES } from "@/data/products";

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const count = CAROUSEL_SLIDES.length;

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 5500);
    return () => clearInterval(t);
  }, [count]);

  const go = (d: number) => setIndex((i) => (i + d + count) % count);

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 4,
        overflow: "hidden",
        height: { xs: 380, md: 520 },
        bgcolor: "#0f172a",
      }}
    >
      {CAROUSEL_SLIDES.map((slide, i) => (
        <Box
          key={slide.id}
          sx={{
            position: "absolute",
            inset: 0,
            opacity: i === index ? 1 : 0,
            transition: "opacity 800ms ease",
            backgroundImage: `linear-gradient(90deg, ${slide.tint}cc 0%, ${slide.tint}55 55%, transparent 100%), url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Stack
            sx={{
              justifyContent: "center",
              height: "100%",
              px: { xs: 4, md: 8 },
              maxWidth: { xs: "100%", md: "60%" },
              color: "#fff",
            }}
            spacing={2}
          >
            <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.85 }}>
              {slide.eyebrow}
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: 40, md: 68 }, lineHeight: 1.02 }}>
              {slide.title}
            </Typography>
            <Typography sx={{ fontSize: { xs: 16, md: 20 }, opacity: 0.9, maxWidth: 520 }}>
              {slide.subtitle}
            </Typography>
            <Box>
              <Button
                variant="contained"
                size="large"
                sx={{ bgcolor: "#fff", color: "#0f172a", "&:hover": { bgcolor: "#f1f5f9" } }}
              >
                Shop the collection
              </Button>
            </Box>
          </Stack>
        </Box>
      ))}

      <IconButton
        onClick={() => go(-1)}
        sx={{
          position: "absolute", top: "50%", left: 16, transform: "translateY(-50%)",
          bgcolor: "rgba(255,255,255,0.85)", "&:hover": { bgcolor: "#fff" },
        }}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
      <IconButton
        onClick={() => go(1)}
        sx={{
          position: "absolute", top: "50%", right: 16, transform: "translateY(-50%)",
          bgcolor: "rgba(255,255,255,0.85)", "&:hover": { bgcolor: "#fff" },
        }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>

      <Stack
        direction="row"
        spacing={1}
        sx={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)" }}
      >
        {CAROUSEL_SLIDES.map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i)}
            sx={{
              width: i === index ? 28 : 10,
              height: 10,
              borderRadius: 999,
              bgcolor: i === index ? "#fff" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 300ms ease",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}