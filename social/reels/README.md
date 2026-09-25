# Rose Cottage Fold — 12 Reel Campaign

This folder turns the **existing Rose Cottage Fold website assets** into twelve vertical social reels. No substitute CGI or invented project imagery is used.

## Output
- 1080 × 1920 (9:16)
- H.264 MP4
- 18 seconds each
- FOX burgundy / antique-gold presentation
- Rose Cottage Fold identity + FOX mark
- Real project, planning and contact information from the website code

## Reel sequence
1. Project Story
2. Masterplan
3. Plot 1 — The Farmhouse
4. Plot 2 — The Stalls
5. Plot 3 — The Dairy
6. Plot 4 — The Threshing Barn
7. Plot 5 — The Granary
8. Plot 6 — The Carthouse
9. Planning — 25/01920/FUL
10. Design & Materials
11. Location — North Muskham
12. FOX / Enquiry

## Source assets
The renderer uses the media already committed under `/assets`, including:
`rose-cottage-story.mp4`, `rose-cottage-hero.mp4`, `film-0.mp4` through `film-4.mp4`, `film-location.mp4`, `fox-land-story.mp4`, the aerial/site-plan images, `rose-cottage-fold-logo.svg` and `fox-mark-gold.png`.

## Run
```bash
python3 social/reels/render_reels.py
```

The GitHub Action in `.github/workflows/render-rose-cottage-reels.yml` renders all 12 and uploads them as a downloadable workflow artifact.
