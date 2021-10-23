# mojito_pdm

React / Typescript Catalogue for PDM, complete with test driving and purchasing

![Light Theme](https://i.imgur.com/3TZhwyk.jpg)
![Dark Theme](https://i.imgur.com/Z46KGkw.jpg)

<p align="center">
	<a href="https://imgur.com/a/sx9xOen"> Imgur Album </a>
</p>

## Features
- High Performance Material UI
- Filter vehicles by category
- Pre-configured vehicles and prices
- Test Driving with configurable locations and timer
- Buy vehicles from the catalogue
- Finance vehicles

## Todos
- [x] Buy vehicles from the catalogue
- [x] Learn how to use state management libraries to fix the janky react code
- [x] Add the config option to restrict usage when car dealers are online
- [x] Finance System

## Instalation
Download the latest version from the releases. Note that the master branch is not considered the most stable branch and you should not build from master unless you know what you're doing.

If you have buying and finance enabled you need to add the following to your database and install the [cron](https://github.com/esx-framework/cron) dependency
```sql
CREATE TABLE IF NOT EXISTS `vehicle_finance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plate` varchar(10) NOT NULL,
  `citizenid` varchar(255) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `interest_rate` int(11) DEFAULT NULL,
  `outstanding_bal` int(11) DEFAULT NULL,
  `warning` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `citizenid` (`citizenid`),
  CONSTRAINT `cid` FOREIGN KEY (`citizenid`) REFERENCES `players` (`citizenid`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
```

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
  },
  "finance": {
    "installment_percent": 10,                                                        // Percentage cost of finance installments
    "runs_on": 1,                                                                     // The day of the week the installments are taken 1 = monday
    "runs_at": "18:30"                                                                // The time of day the installments are taken in 24h format
  }
}
```

To edit car information use `ui/src/cars.json` and compile, do this from the latest tagged version of the source code - the master branch is not considered stable.
This data is matching that of the shared.lua of the offical qbcore repository at the time of writing, some vehicles are missing and contributing is very much appreciated and credit will be given.

## Usage

To open trigger the event `mojito_pdm:client:open`, you can do this with 3D text, DrawTextUI or qb-target like so:
To open the propmt to check finance trigger the event `mojito_pdm:client:check_finance`

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
		},
		{
			type="client",
			event="mojito_pdm:client:check_finance",
			icon="fas fa-comment-dollar",
			label="Check Finance"
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


<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
