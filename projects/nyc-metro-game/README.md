# NYC Metro prototype

React + TypeScript + Vite, with MapLibre geographic vector map and Motion. Based on the approved prototype visual in ../../design/.

## Run

```sh
pnpm install
pnpm dev
```

Open the Local URL printed by Vite. Node.js 20.19+ or 22.12+ is recommended.

```sh
pnpm test
pnpm build
```

## Play

- Journey: all 38 stations on the 1 line, Van Cortlandt Park–242 St to South Ferry; both directions are playable.
- Start typing immediately, without a click. Type the displayed name, then Enter. Case and hyphen/dash variants are accepted.
- Timed: 60 seconds; the full route repeats.
- Explore: select stations on the automatic background map.
- Escape pauses/resumes. Tab navigates controls normally; the restart control is directly after the typing input in keyboard order.
- Direction can be reversed. Settings explain scoring. Personal best WPM is stored locally.

WPM uses submitted correct characters / 5 / active minutes. Accuracy counts character entries, including mistakes later corrected. Prototype scores are not comparable to common-word typing tests; personal bests are stored separately for journey and timed modes. Pasted text is accepted for practice and scores are not competition-grade.

The primary map uses OpenStreetMap vector geography and MTA GTFS route coordinates; an illustrative SVG remains as a WebGL fallback. See src/data/SOURCES.md. No live service feeds, backend, accounts, or deployment. Google Fonts are optional external requests with system-font fallbacks. Browser reduced-motion preferences are respected.

Map revision: full-canvas background with fixed 1.2x zoom and automatic station tracking. Manual pan and zoom are removed. Input focuses on load and restores after background clicks while preserving control navigation.

Full-line update: the 38-stop standard 1 service replaces the original ten-stop sample. Automatic camera tracking covers the whole route; source references are in src/data/SOURCES.md. Personal-best storage is namespaced separately from the old sample.

Detailed-map update: MapLibre + OpenFreeMap Dark provides real street and coastline detail. The fixed automatic camera remains, without pan/zoom controls. Basemap tiles require internet access; WebGL-unavailable devices use the original schematic fallback. Attribution stays visible.

## Selectable services

Use the 1 / 4 / 5 / 6 route bullets above the journey title to change service. Switching resets the run, restores input focus and loads that service's geographic shape. Green services use MTA #009952. Scores are stored by service and mode.

Included patterns: 4 Woodlawn–Utica Av (28 stops); 5 Dyre Av–Flatbush Av (36 stops); 6 Pelham Bay Park–Brooklyn Bridge (38 stops). Pattern descriptions stay visible. Alternate 5 branches, overnight local 4 and rush-hour express variants are outside this prototype.

## All regular NYC Subway services

The selector now includes 25 regular services: 1–7, A/B/C/D/E/F/G/J/L/M/N/Q/R/W/Z and the three distinct S shuttles. Diamond 6X/7X/FX and SIR are excluded. Use the route bullets on desktop or the service dropdown on mobile. See SERVICE-CATALOGUE.md and src/data/SOURCES.md for selected patterns. Each service has real geographic geometry, route colour, both gameplay directions, timed mode and its own score history.

Typing shortcut: Space submits a correctly completed station name, just like Enter. Spaces inside an unfinished name remain normal text. Held Space does not spill into the next station.
