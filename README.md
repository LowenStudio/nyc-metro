# NYC Metro

A subway station typing game built with React, TypeScript, Vite, MapLibre and Motion. The application lives directly at the repository root.

## Run locally

```sh
pnpm install
pnpm dev
```

Open the localhost URL printed by Vite.

```sh
pnpm test
pnpm build
pnpm preview
```

## Game modes

- **Journey:** type stations along one of 25 regular subway service patterns.
- **Timed:** a 60-second typing run.
- **Explore:** browse stations, routes and transfer connections.
- **Custom:** choose a start and destination from colour-coded dropdowns, review a route, and board connecting lines at transfers.

Space or Enter submits a completed name. **UPPERCASE** enables case-sensitive typing without changing station names. Escape pauses and resumes. The train and camera follow the route geometry; background routes and station dots remain visible across transfers.

## Structure

```text
src/         Application, components, route data and game logic
tests/       Routing, animation, station markers and gameplay tests
screenshots/ Verified UI screenshots
docs/        Earlier project notes and history
```

See [custom journeys](CUSTOM-JOURNEYS.md), [service catalogue](SERVICE-CATALOGUE.md), and [data sources](src/data/SOURCES.md).

Routes use representative MTA regular-service patterns and published station complexes. Some branches and time-dependent patterns are outside the prototype. There is no live disruption or travel-time information. Map tiles require internet access; a schematic fallback is available when WebGL is unavailable. Personal scores and preferences are stored in the browser.

## GitHub Pages

The site is deployed at https://lowenstudio.github.io/nyc-metro/ . GitHub Actions installs dependencies, runs tests, builds Vite and deploys only `dist/` on pushes to `main`. Pages must use GitHub Actions as its build source. Production assets use `/nyc-metro/`; local development remains at `/`.
