# Packet to Mountain View

An illustrated map of how the internet actually works, told as the journey of one
tap on your phone — through Wi-Fi, an Airtel GPON fibre line, India's internet
exchanges and the undersea cables, all the way to Google's servers.

Built as a plain static site. No build step, no dependencies, no framework.

## Run it

Just open `index.html` in a browser — double-click it, or:

```sh
open index.html          # macOS
```

It works straight from the filesystem. If you'd rather serve it over HTTP
(needed if you later add `fetch`, service workers, or want correct relative URLs):

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy it

Everything is static, so any host works. Drag the folder onto
[Netlify Drop](https://app.netlify.com/drop), or:

```sh
npx vercel --prod           # Vercel
npx surge .                 # Surge
```

For **GitHub Pages**: push the folder to a repo and turn on Pages for the
root of the default branch.

## What's in it

| File | What it does |
| --- | --- |
| `index.html` | The document: design tokens, all page styles, markup shell |
| `sketch.js` | Hand-drawn SVG toolkit — seeded wobbly ink, hatching, stipple, paper grain |
| `art.js` | One illustration per device, drawn with the toolkit into a 100 × 74 box |
| `scene.js` | One animated explainer diagram per device, shown when you open its panel |
| `bigscenes.js` | Full-scale scenes for the physical world: the flat, the street, the exchange |
| `bigscenes2.js` | Full-scale scenes for the carrier core and open internet, incl. the India maps |
| `hexfield.js` | The cellular honeycomb — frequency reuse, backhaul and a live handover |
| `data-map.js` | The 18 map nodes, the links between them, and the 19-step packet journey |
| `data-topics.js` | The five protocol layers and 24 concept explainers |
| `app.js` | Map rendering, pan/zoom, the journey player, the inspector drawer |
| `views.js` | Layers and Concepts pages, the diagrams, search, and URL routing |

Every map node opens with a full-scale scene plus a tighter mechanism diagram beneath it.
Big figures are marked `figure.zoom` and open full-screen when clicked.

The India outline in `bigscenes2.js` is projected from real longitude/latitude, and the
city positions are accurate; the backbone routes between them are illustrative.

The explainer animations are CSS-driven (`offset-path`, `stroke-dashoffset`), so they
switch off automatically under `prefers-reduced-motion`.

All the artwork is generated as SVG at runtime from seeded pseudo-randomness —
there are no image files, so it stays sharp at any zoom and recolours itself
between the light and dark themes.

## URLs

Every box and concept is addressable, so you can link straight to one:

```
#/                    the map
#/layers              protocol layers
#/concepts            all concepts
#/device/bng          a box on the map      (ids in data-map.js)
#/layer/l3            one protocol layer    (ids in data-topics.js)
#/topic/congestion    one concept           (ids in data-topics.js)
```

## Editing

The writing lives entirely in `data-map.js` and `data-topics.js` — each entry has
`lead`, `analogy`, `yours` (the Airtel-specific note), `sections` and `facts`.
Editing the prose never requires touching the rendering code.

To move a box on the map, change its `x`/`y` in `data-map.js`; the connecting
lines, arrows and labels re-route themselves.
