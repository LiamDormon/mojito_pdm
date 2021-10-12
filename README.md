# mojito_pdm

React / Typescript Catalogue for PDM, complete with test driving and purchasing

## Features
- High Performance Material UI
- Pre-configured vehicles and prices
- Test Driving with configurable locations and timer

## Planned Features
- Buying Vehicles
- Pull prices and trunk weight from shared.lua, for now these are static

## Config

```js
{
  "pdmlocation": {"x": -56.54, "y": -1096.18, "z": 26.42},                            // Location to teleport the player back to
  "testdrivespawn": {"x": -16.84, "y":  -1105.11, "z": 26.36, "h": 158.76},           // Location to spawn the car
  "temporary": {
    "enabled": true,                                                                  // Enable time limit on test drives
    "time": 120                                                                       // Time (in seconds) of the test drive
  }
}
```

To edit car information use `ui/src/cars.json` for now.

## Usage

To open trigger the event `mojito_pdm:client:open`, you can do this with 3D text, DrawTextUI or qb-target like so:

```lua
	["mojito_pdm"] = {
		name="mojito_pdm",
		coords=vector3(-55.17767, -1096.946, 26.62873),
		radius=0.4,
		useZ=true,
		options = {
			{
				type="client",
				event="mojito_pdm:client:open",
				icon="fas fa-book-open",
				label="Open Catalogue"
			}
		},
		distance=1.0
	}
```
