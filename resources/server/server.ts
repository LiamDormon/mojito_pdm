import { QBCore } from './qbcore';
import { utils } from './utils';
import Config from './config';
import { IConfig } from '../types';
import { ServerPromiseResp } from '@project-error/pe-utils';

const CREATE_AUTOMOBILE = utils.joaat('CREATE_AUTOMOBILE');

onNet('mojito_pdm:server:testdrive', async (vehicle: string) => {
  const src = global.source.toString();
  const srcPed = GetPlayerPed(src);
  const [srcX, srcY] = GetEntityCoords(srcPed);
  const distance = Math.hypot(srcX - Config.pdmlocation.x, srcY - Config.pdmlocation.y);

  if (distance < 25.0) {
    const vehicleHash = GetHashKey(vehicle);
    let veh: number = Citizen.invokeNative(
      CREATE_AUTOMOBILE,
      vehicleHash,
      Config.testdrivespawn.x,
      Config.testdrivespawn.y,
      Config.testdrivespawn.z,
    );

    while (!DoesEntityExist(veh)) {
      await utils.Wait(10);
    }

    SetEntityHeading(veh, Config.testdrivespawn.h);
    const plate = `PDM${utils.random(11111, 99999)}`;
    SetVehicleNumberPlateText(veh, plate);

    await utils.Wait(1000);

    SetPedIntoVehicle(srcPed, veh, -1);

    emitNet('vehiclekeys:client:SetOwner', src, plate);
    emitNet('mojito_pdm:client:start_testdrive', src, Config.temporary.time);

    if (Config.temporary.enabled) {
      setTimeout(() => {
        if (GetVehiclePedIsIn(srcPed, false) == veh) {
          TaskLeaveAnyVehicle(srcPed, 0, 0);
        }

        DeleteEntity(veh);
        SetEntityCoords(
          srcPed,
          Config.pdmlocation.x,
          Config.pdmlocation.y,
          Config.pdmlocation.z,
          false,
          false,
          false,
          false,
        );
      }, 1000 * Config.temporary.time);
    }
  }
});

utils.onNetPromise<unknown, IConfig>('fetch:config', (req, res) => {
  const respData: ServerPromiseResp<IConfig> = {
    data: Config,
    status: 'ok',
  };

  res(respData);
});

interface incommingBuyVeh {
  vehicle: string;
}

interface outgoingBuyVeh {
  msg: string;
}

utils.onNetPromise<incommingBuyVeh, outgoingBuyVeh>(
  'mojito_pdm:server:buyvehicle',
  async (req, res) => {
    const src = req.source;
    const vehicle = req.data.vehicle;

    if (!QBCore.Shared.Vehicles[vehicle]) {
      return res({
        data: { msg: 'Vehicle does not exist' },
        status: 'error',
      });
    }

    const { price, shop, hash, name, brand } = QBCore.Shared.Vehicles[vehicle];

    const Player = QBCore.Functions.GetPlayer(src);
    const { bank, cash } = Player.PlayerData.money;

    if (bank - price >= 0) {
      Player.Functions.RemoveMoney('bank', price, 'vehicle-bought');
      const plate = await utils.GeneratePlate();
      const mods = await utils.callClientRPC('mojito_pdm:client:vehiclebought', src, {
        vehicle: vehicle,
        plate: plate,
      });

      global.exports.oxmysql.insert(
        'INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          Player.PlayerData.license,
          Player.PlayerData.citizenid,
          vehicle,
          hash,
          JSON.stringify(mods),
          plate,
          0,
        ],
      );

      emit(
        'qb-log:server:CreateLog',
        'vehicleshop',
        'Vehicle Purchased (PDM Catalogue)',
        'green',
        `**${GetPlayerName(
          src.toString(),
        )}** bought a ${name} ${brand} for $${price} from the bank`,
      );

      return res({
        status: 'ok',
        data: { msg: `Succesfully bought a new ${brand} ${name}` },
      });
    } else if (cash - price >= 0) {
      Player.Functions.RemoveMoney('cash', price, 'vehicle-bought');
      const plate = await utils.GeneratePlate();
      const mods = await utils.callClientRPC('mojito_pdm:client:vehiclebought', src, {
        vehicle: vehicle,
        plate: plate,
      });

      global.exports.oxmysql.insert(
        'INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          Player.PlayerData.license,
          Player.PlayerData.citizenid,
          vehicle,
          hash,
          JSON.stringify(mods),
          plate,
          0,
        ],
      );

      emit(
        'qb-log:server:CreateLog',
        'vehicleshop',
        'Vehicle Purchased (PDM Catalogue)',
        'green',
        `**${GetPlayerName(src.toString())}** bought a ${name} ${brand} for $${price} with cash`,
      );

      return res({
        status: 'ok',
        data: { msg: `Succesfully bought a new ${brand} ${name}` },
      });
    } else {
      return res({
        status: 'error',
        data: { msg: 'You have insufficient funds' },
      });
    }
  },
);
