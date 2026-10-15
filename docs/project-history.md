# NYC Metro

A subway typing web game: type station names to travel along an interactive NYC map.

Status: playable local prototype. Source lives in projects/nyc-metro-game; see its README for run instructions.

## Project structure

```text
NYC metro/
├── README.md
├── design/
│   ├── visual-board-01.png
│   ├── visual-board-02.png
│   ├── visual-board-03.png       # Latest visual reference
│   ├── visual-board-01-prompt.txt
│   └── visual-direction.md
└── projects/
    └── nyc-metro-game/           # Planned application
        ├── public/              # Static assets
        ├── src/
        │   ├── components/
        │   │   ├── map/         # Tracks, stations, train, pan and zoom
        │   │   ├── typing/      # Station prompt and inline feedback
        │   │   └── interface/   # Stats, controls and results
        │   ├── game/            # State reducer, input, scoring and timing
        │   ├── data/            # Stations, service sequences and geometry
        │   ├── styles/          # Design tokens and global styles
        │   ├── App.tsx
        │   └── main.tsx
        ├── tests/               # Scoring and complete keyboard journeys
        ├── index.html
        ├── package.json
        ├── tsconfig.json
        └── vite.config.ts
```

The application is implemented beneath projects/nyc-metro-game. Run instructions and limitations are documented in its README.

## Planned frontend stack

| Responsibility | Technology |
| --- | --- |
| Interface | React + TypeScript |
| Development and build | Vite |
| Styling | CSS Modules + CSS variables |
| Subway map | Custom interactive SVG |
| Animation | Motion |
| Game state | React useReducer |
| Transit data | Verified, typed static JSON |
| Preferences and personal bests | localStorage |
| Verification | Vitest + Playwright |

The first version runs in the browser. Accounts, shared leaderboards and multiplayer are later work.

## First version

- NYC only; start with one verified playable service and direction. Specific service to be selected.
- Choose a journey, type visible station names in order and press Enter to submit.
- Preserve spaces within names; define accepted punctuation and abbreviations.
- Show previous, current and next stations in a fixed bottom typing panel.
- Successful submission advances the train and highlights travelled track.
- Track completed stations, accuracy, elapsed time and WPM; provide results and restart.
- Support keyboard navigation, reduced motion and mobile keyboard layouts.

## Visual direction

Use [board 03](design/visual-board-03.png) and [design notes](design/visual-direction.md).

- Charcoal map, ivory text, bold transit typography and route-colour accents.
- Feedback appears directly in the station name, without a duplicate boxed-letter row.
- Stations, accuracy and time use typography over the map, with whitespace between them and no enclosing block or vertical dividers.
- Keep minimal thin progress bars beneath stations and accuracy. Time stays text-only.
- Generated map illustrations are style references, not verified transit data.

## Architecture

Keep typing and scoring independent of map rendering. Keystrokes update the typing panel; successful station submission triggers map movement.

Separate stable station IDs, names, service stop sequences and editable map coordinates. Represent local/express and branch patterns explicitly. Record transit-data source links, retrieval dates and usage terms.

## Build order

1. Scaffold the app and define data types.
2. Verify one service stop sequence.
3. Create the SVG map and typing panel.
4. Add input rules, scoring, train animation and results.
5. Verify complete keyboard journeys, long names, mobile layouts and reduced motion.
6. Expand NYC coverage.

## Monkeytype reference

See [Monkeytype benchmark](research/monkeytype-benchmark.md). Use its typing flow and session hierarchy alongside Metro Typing’s journey progression. This is a design hypothesis, not validated US market fit.

Start timing on the first character. Keep inline feedback, a quiet map during typing, WPM reporting and immediate replay. Journey mode retains Enter submission; evaluate exact-name automatic advancement separately. Spaces must remain part of station names. Preserve typography-led stats, thin progress bars and the existing board’s NYC identity.

## Approved gameplay visual

Lowen approved [prototype visual 01](design/prototype-visual-01.png) on 15 October 2026. This is the primary implementation reference; earlier boards provide supporting context. See [visual notes](design/prototype-visual-01.md).

## Prototype verification — 15 October 2026

Production build and four game-engine tests pass. Browser checks cover a complete ten-stop journey, incorrect submission, correction, replay, pause, station selection and the mobile layout. The map is an illustrative schematic; station data and implementation limits are documented with the source.

## Full 1 line

The prototype now includes all 38 standard stops from Van Cortlandt Park–242 St to South Ferry, playable downtown or uptown. The map follows the current station without manual controls. Seven tests pass, including end-to-end state progression in both directions. The 38-stop downtown journey was also completed through the browser.

## Detailed geographic map

MapLibre and OpenFreeMap vector tiles now replace the primary polygon map. Real MTA GTFS coordinates and a 266-point route shape position all 38 stops. The basemap includes real shoreline, streets, parks and building detail; it uses no satellite imagery. Automatic camera tracking and no manual pan/zoom remain. Internet access is required for map tiles. Attribution is visible; data references are documented with the source.

## Green services added

The prototype now offers 1, 4, 5 and 6 in a service selector. Green routes use official MTA #009952. Each has geographic route geometry, station typing, both directions, timed mode and separate personal bests. Included patterns: 4 Woodlawn–Utica Av (28 stops), 5 Dyre Av–Flatbush Av (36 stops), 6 Pelham Bay Park–Brooklyn Bridge (38 stops). Source patterns and exclusions are documented in src/data/SOURCES.md within the application. Build and 18 tests pass.

## Complete regular subway catalogue

All 25 regular NYC Subway services are now selectable, including the three distinct shuttles. Diamond 6X, 7X and FX are excluded, as is the separate Staten Island Railway. Regular numbered/lettered services retain their official names and normal express stopping patterns where applicable. Each entry uses a labelled MTA GTFS pattern, geographic shape and official colour. Desktop uses route bullets; mobile uses a dropdown. See projects/nyc-metro-game/SERVICE-CATALOGUE.md for endpoints and stop counts. Production build and all 94 tests pass, including completion in both gameplay directions for each service.
