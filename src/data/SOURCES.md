# Full 1-line data

Verified against the MTA subway map and timetable on 15 October 2026:

- https://www.mta.info/map/5256 — official subway map; station names and route coverage.
- https://www.mta.info/document/9426 — 1 timetable, effective 17 May 2026; terminal names and direction (key stops only).

38 stops in north-to-south order: Van Cortlandt Park–242 St to South Ferry. The app reverses this array for uptown play. Marble Hill belongs to Manhattan; the northern three stops are in the Bronx. Names use typographic en dashes accepted interchangeably with ordinary hyphens. The Christopher Street stop uses the current Stonewall name.

This is a curated standard service sequence, not a live service feed. Temporary closures and reroutes are not modelled. The map uses original illustrative schematic coordinates and land outlines; background context lines are decorative, not verified services. No agency map artwork or branding is bundled. Check current MTA feeds and terms before expanding data use.

## Geographic map upgrade

The 38 station coordinates and 266 route-shape vertices are extracted from the MTA static GTFS feed: https://rrgtfsfeeds.s3.amazonaws.com/gtfs_subway.zip (retrieved 15 October 2026). A full 38-stop southbound trip was selected; station names and sequence were checked against the existing data. Shape/trip metadata is in line1-feed-metadata.json.

Basemap: OpenFreeMap Dark, https://tiles.openfreemap.org/styles/dark, using OpenStreetMap/OpenMapTiles geographic features. It provides detailed real shorelines, roads, parks and building footprints, not satellite imagery. Visible attribution links remain in the interface. Map tiles and fonts require an internet connection. No user location is requested.

Legacy x/y coordinates are retained only for a WebGL-unavailable schematic fallback; the primary map uses latitude/longitude and MTA route geometry.

## Official route colour

The 1 service uses #D82233, confirmed in both the MTA Brand Colors guide (https://www.mta.info/document/168976) and route 1's route_color field in the downloaded GTFS routes.txt. Verified 15 October 2026. This replaces legacy #EE352E and the custom pink travelled-track tint. Route strokes use full opacity; completed track is distinguished by width rather than a different hue. The same colour is used for the route bullet, train and visited dots, including the fallback map.

## Green services 4 / 5 / 6

Extracted from the same MTA GTFS archive on 15 October 2026, with the official #009952 route colour (also in https://www.mta.info/document/168976).

- 4: shape 4..S06R, Woodlawn to Crown Hts–Utica Av, 28 stops, daytime express in Manhattan/Brooklyn.
- 5: shape 5..S03R, Eastchester–Dyre Av to Flatbush Av–Brooklyn College, 36 stops, local in the Bronx and express in Manhattan.
- 6: shape 6..S01R, Pelham Bay Park to Brooklyn Bridge–City Hall, 38 local stops.

Each selection uses one complete scheduled southbound trip's actual stop sequence and shape, reversed for uptown play. Alternate branches, rush-hour Bronx express 5 / 6X, overnight 4 local and service disruptions are not modelled. Pattern descriptions are visible in the route selector. Source trip and shape IDs are stored in green-services.json. Scores are kept separately by service and mode.

## All regular NYC Subway services

25 service entries are included: 1–7, A/B/C/D/E/F/G/J/L/M/N/Q/R/W/Z and the 42 St, Franklin Avenue and Rockaway Park shuttles. Diamond variants 6X, 7X and FX and the separate Staten Island Railway are excluded. Regular services whose normal stopping patterns include express operation are retained.

Additional routes are extracted from the same MTA static GTFS. For each route, one common complete direction-1 trip pattern is selected; M is explicitly the full Forest Hills–Middle Village trip and N uses its regular daytime pattern. The 3 uses New Lots, A uses Far Rockaway, B uses Bedford Park Blvd. Alternate branches and time-of-day patterns are not merged or invented. Source trip and shape IDs, colours and chosen stops are retained in regular-services.json. The selector displays endpoints and stop count. Reverse gameplay traverses the chosen sequence in reverse; it does not claim to model all direction-specific timetable differences.

Boroughs are joined by GTFS station ID against MTA Subway Stations: https://data.ny.gov/resource/39hk-dx4f.json (retrieved 15 October 2026). Yellow routes use the feed's black route_text_color for contrast. All service colours come from routes.txt.

## Transfer indicators
MTA Subway Stations and Complexes: https://data.ny.gov/resource/39hk-dx4f.json . Connections use published `complex_id` and `daytime_routes`, not matching station names. Shuttle services are resolved to GS, FS and H using station IDs. Badges exclude the selected service. They describe regular daytime connections, not real-time or overnight availability. Other-route map lines use the existing representative GTFS patterns.
