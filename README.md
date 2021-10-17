# mojito_pdm

React / Typescript Catalogue for PDM, complete with test driving and purchasing

![Light Theme](https://i.imgur.com/47YYveC.png)
![Dark Theme](https://i.imgur.com/PCP4U5C.png)

## Features
- High Performance Material UI
- Filter vehicles by category
- Pre-configured vehicles and prices
- Test Driving with configurable locations and timer
- Buy vehicles from the catalogue

## Todos
- [x] Buy vehicles from the catalogue
- [x] Learn how to use state management libraries to fix the janky react code
- [x] Add the config option to restrict usage when car dealers are online
- [ ] Pull prices and trunk weight from shared.lua, for now these are static

## Config

```js
{
  "pdmlocation": {"x": -56.54, "y": -1096.18, "z": 26.42},                            // Location to teleport the player back to
  "testdrivespawn": {"x": -16.84, "y":  -1105.11, "z": 26.36, "h": 158.76},           // Location to spawn the car for test drives
  "buylocation": {"x": -16.84, "y":  -1105.11, "z": 26.36, "h": 158.76},	      // Location to spawn the car when it is purchased
  "temporary": {
    "enabled": true,                                                                  // Enable time limit on test drives
    "time": 120                                                                       // Time (in seconds) of the test drive
  },
  "canbuy": true,								      // Set to false to disable buying vehicles
  "limit": {                                              
    "enabled": true,                                                                  // Set to true to restrict usage when car dealers are online                                  
    "jobname": "cardealer",                                                           // Name of car dealer job
    "count": 2                                                                        // Maximum amount of car dealers that can be online before restrictions
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

## Building

Builds are automatically generated when a tagged release is pushed, to build manually from the master branch you can use the following:

### Yarn:

To build the UI:
`cd ui` -> `yarn` -> `yarn build`

To build the script:
`cd resources` -> `yarn` -> `yarn build`

### NPM:

To build the UI:

`cd ui` -> `npm i` -> `npm run build`

To build the script:

`cd resources` -> `npm i` -> `npm run build`

## Developing

Issues and pull requests are welcomed.

This project is using [Project Error's React Boilerplate](https://github.com/project-error/fivem-react-boilerplate-lua) which comes with useful utilities, use `yarn start` to start the dev server or `yarn start:game` to open the dev server and build at the same time.

## Credits

- Images and Brand Logos taken from [GTA Fandom Wiki](https://gta.fandom.com/wiki/) under CC-BY-SA license
- Build and Release script taken from [fivem-appearance](https://github.com/pedr0fontoura/fivem-appearance) under MIT license
- Github Actions workflow was created by [Taso](https://github.com/TasoOneAsia) for [txAdmin](https://github.com/tabarra/txAdmin) under MIT license
