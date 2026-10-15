# Custom journeys

Open **custom** in the game navigation. Choose a starting station and destination from the dropdowns. Route badges use MTA colours; boroughs distinguish stations with the same name. Arrow keys navigate, typing jumps to station names, Enter selects, and Escape closes the menu. Review the coloured itinerary, then start typing.

The router minimises transfers first, then station-to-station hops. Every station on a ride is typed; a transfer complex is typed once. At an interchange, wait for the train to arrive and choose **Board [line]**, then type the station name to continue. The active line colour changes on boarding. Space and Enter both submit. Uppercase controls case-sensitive matching.

The graph uses adjacent stops in the prototype’s representative regular service patterns, bidirectionally, and MTA complex IDs for transfers. No connections are inferred from station names. Not every branch or time-dependent pattern is represented. Routes describe this game network, not live travel advice, travel times, or service disruptions. Unavailable endpoints and identical stations cannot start a journey.

Tests cover direct and reversed rides, transfer continuity, duplicate station names, invalid endpoints and complete typing journeys.
