# Add a Marker to a Map (Maps JavaScript API)

## Overview

Markers display single locations on a map. In the Maps JavaScript API,
**Advanced Markers** (`AdvancedMarkerElement` and `PinElement`) are the standard
for adding performant, customizable markers to maps both programmatically in
JavaScript/TypeScript and declaratively using custom HTML web components
(`<gmp-advanced-marker>`).

## Prerequisites

1.  **Loaded Maps JavaScript API**: The Maps JavaScript API must be loaded on
    your page (preferring the dynamic library import bootstrap loader).
2.  **`marker` Library**: You must load the `marker` library to access
    `AdvancedMarkerElement` and `PinElement`.
3.  **Map ID**: A Map ID is **required** to use Advanced Markers. For testing or
    initial development, you can use `'DEMO_MAP_ID'`.

--------------------------------------------------------------------------------

## Implementation Workflows

### 1. Load the `marker` Library

#### Dynamic Library Import (Recommended)

Load the `maps` and `marker` libraries asynchronously at runtime using
`google.maps.importLibrary()`:

```javascript
const { Map } = await google.maps.importLibrary("maps");
const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
```

#### Direct Script Tag Loading

If loading via a direct `<script>` tag, append `libraries=maps,marker` to the
URL parameters:

```html
<script
  async
  src="https://maps.googleapis.com/maps/api/js?loading=async&key=YOUR_API_KEY&libraries=maps,marker"
></script>
```

--------------------------------------------------------------------------------

### 2. Add a Marker Programmatically (JavaScript / TypeScript)

You can associate an `AdvancedMarkerElement` with a map either by passing the
`Map` instance to the `map` option (when using a `<div>` container) or by
appending the marker element to a `<gmp-map>` web component.

#### Option A: Standard `<div>` Map Container

When initializing a map inside a standard `<div>` element, pass the `map`
instance into the `AdvancedMarkerElement` constructor options.

```typescript
let map: google.maps.Map;

async function initMap(): Promise<void> {
  //The location of Uluru
  const position = { lat: -25.344, lng: 131.031 };

  // Request needed libraries
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  // Instantiate the map with a required mapId and usage attribution
  map = new Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 4,
      center: position,
      mapId: 'DEMO_MAP_ID',
      internalUsageAttributionIds: ['gmp_git_agentskills_v1'],
    }
  );

  // Instantiate the AdvancedMarkerElement positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: 'Uluru',
  });
}

initMap();
```

*Source:
[samples/add-map/index.ts](https://github.com/googlemaps/js-samples/blob/HEAD/samples/add-map/index.ts?utm_campaign=gmp_git_agentskills_v1)*

#### Option B: Appending to a `<gmp-map>` Web Component

When using `<gmp-map>`, you can instantiate `AdvancedMarkerElement` in
JavaScript and append it directly to the DOM element:

```typescript
const mapElement = document.querySelector('gmp-map')!;

async function init() {
  const [{ AdvancedMarkerElement }] = await Promise.all([
    google.maps.importLibrary('marker') as Promise<google.maps.MarkerLibrary>,
    google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
  ]);

  const marker = new AdvancedMarkerElement({
    position: { lat: 37.4239163, lng: -122.0947209 },
    title: 'Mountain View, CA',
  });

  mapElement.append(marker);
}

void init();
```

--------------------------------------------------------------------------------

### 3. Add a Marker Using Custom HTML Elements (Web Components)

To add a marker declaratively in HTML, nest a `<gmp-advanced-marker>` element
inside a `<gmp-map>` element. Ensure `map-id` is configured on `<gmp-map>`.

> **Framework Note:** Frameworks like React manage DOM nodes during rendering
> and can conflict with direct DOM manipulation by Maps JavaScript API web
> components. When using React, either use programmatic JavaScript instantiation
> (`new AdvancedMarkerElement({ map })`) or use the official
> `@vis.gl/react-google-maps` library.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Add a Map with Markers using HTML</title>
    <style>
      gmp-map {
        height: 100%;
      }
      html,
      body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
    <script
      async
      src="https://maps.googleapis.com/maps/api/js?loading=async&key=YOUR_API_KEY&libraries=maps,marker"
    ></script>
  </head>
  <body>
    <gmp-map
      center="41.027748173921374, -92.41852445367961"
      zoom="13"
      map-id="DEMO_MAP_ID"
      internal-usage-attribution-ids="gmp_git_agentskills_v1">
      <gmp-advanced-marker
        position="41.027748173921374, -92.41852445367961"
        title="Ottumwa, IA"></gmp-advanced-marker>
    </gmp-map>
  </body>
</html>
```

--------------------------------------------------------------------------------

### 4. React Integration (`@vis.gl/react-google-maps`)

If building a React application, use `<APIProvider>`, `<Map>`,
`<AdvancedMarker>`, and `<Pin>` from `@vis.gl/react-google-maps`:

```tsx
import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const App = () => {
  const position = { lat: 53.55909, lng: 10.00576 };

  return (
    <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY!} libraries={['marker']}>
      <Map
        mapId={'DEMO_MAP_ID'}
        defaultZoom={12}
        defaultCenter={position}
        internalUsageAttributionIds={['gmp_git_agentskills_v1']}>
        <AdvancedMarker position={position} title={'Hamburg'}>
          <Pin background={'#22ccff'} borderColor={'#1e89a1'} glyphColor={'#0f677a'} />
        </AdvancedMarker>
      </Map>
    </APIProvider>
  );
};

export default App;
```

*Source: Adapted from
[examples/advanced-marker-interaction/src/app.tsx](https://github.com/visgl/react-google-maps/blob/HEAD/examples/advanced-marker-interaction/src/app.tsx?utm_campaign=gmp_git_agentskills_v1)*

--------------------------------------------------------------------------------

## Lifecycle Management & Common Patterns

### Remove or Hide a Marker

To remove an `AdvancedMarkerElement` from the map, set either its `map` property
or its `position` property to `null`:

```javascript
// Remove marker by unsetting the map reference
marker.map = null;

// OR remove marker by unsetting its position
marker.position = null;
```

To re-display a hidden marker, set `marker.map = myMap` (or restore
`marker.position`). To permanently delete it, set `marker.map = null` and remove
all references to the `marker` object.

### Interactive Markers (Click Listeners & InfoWindows)

Markers are only keyboard-focusable (accessible via Tab/Arrow keys) when they
have a `click` listener attached. Combine `AdvancedMarkerElement` with
`InfoWindow` to display contextual details on click:

```typescript
async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const position = { lat: -31.56391, lng: 147.154312 };

  const map = new Map(document.getElementById("map") as HTMLElement, {
    zoom: 6,
    center: position,
    mapId: "DEMO_MAP_ID",
    internalUsageAttributionIds: ["gmp_git_agentskills_v1"],
  });

  const infoWindow = new InfoWindow({
    content: "",
    disableAutoPan: true,
  });

  const pinGlyph = new PinElement({
    glyph: "A",
    glyphColor: "white",
  });

  const marker = new AdvancedMarkerElement({
    map,
    position,
    content: pinGlyph.element,
    title: "Location A",
  });

  // Adding a click listener also enables keyboard focus accessibility
  marker.addListener("click", () => {
    infoWindow.setContent(`${position.lat}, ${position.lng}`);
    infoWindow.open(map, marker);
  });
}

initMap();
```

*Source: Adapted from
[samples/marker-clustering/index.ts](https://github.com/googlemaps/js-samples/blob/HEAD/samples/marker-clustering/index.ts?utm_campaign=gmp_git_agentskills_v1)*

### Marker Clustering for Large Datasets

When rendering many markers on a map, use `@googlemaps/markerclusterer` with
`AdvancedMarkerElement` instances (created without setting `map` directly,
letting `MarkerClusterer` manage them):

```typescript
import { MarkerClusterer } from "@googlemaps/markerclusterer";

// 1. Create AdvancedMarkerElement array without attaching `map` directly
const markers = locations.map((position) => {
  return new google.maps.marker.AdvancedMarkerElement({ position });
});

// 2. Pass markers and map instance to MarkerClusterer
new MarkerClusterer({ markers, map });
```

*Source:
[samples/marker-clustering/index.ts](https://github.com/googlemaps/js-samples/blob/HEAD/samples/marker-clustering/index.ts?utm_campaign=gmp_git_agentskills_v1)*
