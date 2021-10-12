import { QBCore } from './qbcore';
import { utils } from './utils';
import Config from './config';

const CREATE_AUTOMOBILE = utils.joaat('CREATE_AUTOMOBILE');

onNet('mojito_pdm:server:testdrive', async (vehicle: string) => {
  const src = global.source.toString();
  const srcPed = GetPlayerPed(src);
  const [srcX, srcY, srcZ] = GetEntityCoords(srcPed);
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
