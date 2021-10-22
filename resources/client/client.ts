import { QBCore } from './qbcore';
import { utils } from './utils';
import { RegisterNuiCB, ServerPromiseResp } from '@project-error/pe-utils';
import { Timerbar } from 'fivem-js';
import Config from './config';
import { VehicleProperties } from 'qbcore.js/@types/client';

on('mojito_pdm:client:open', async () => {
  const serverResp = await utils.emitNetPromise<ServerPromiseResp<number>>('fetch:pdm_online', {});
  if (Config.limit.enabled && serverResp.data > Config.limit.count)
    return QBCore.Functions.Notify('There are too many car dealers online', 'error');

  utils.Open(true);
});

RegisterNuiCB('exit', (data, cb) => {
  utils.Open(false);
  cb({});
});

RegisterNuiCB('test_drive', async (data, cb) => {
  const vehicle = data.vehicle;

  utils.Open(false);
  setTimeout(() => {
    emitNet('mojito_pdm:server:testdrive', vehicle);
  }, 500);

  cb({});
});

onNet('mojito_pdm:client:start_testdrive', (time: number) => {
  const timer = new Timerbar('Test Drive');
  timer.PlayerStyle = true;
  const interval = setInterval(() => {
    timer.Text = utils.FomatTime(time);
    time--;

    if (time == 0) {
      clearInterval(interval);
      timer.Visible = false;
    }
  }, 1000);
});

RegisterNuiCB('fetch:canbuy', async (data, cb) => {
  cb(Config.canbuy);
});

RegisterNuiCB('buy_vehicle', async (data, cb) => {
  const vehicle = data.vehicle;

  if (!QBCore.Shared.Vehicles[vehicle]) {
    return QBCore.Functions.Notify(
      { caption: 'Something went wrong', text: 'This vehicle does not appear to exist' },
      'error',
    );
  }

  const serverResp = await utils.emitNetPromise<ServerPromiseResp<{ msg: string }>>(
    'mojito_pdm:server:buyvehicle',
    {
      vehicle: vehicle,
    },
  );

  const type: string = serverResp.status === 'ok' ? 'success' : 'error';
  QBCore.Functions.Notify(serverResp.data.msg, type);

  cb({});
});

interface incommingVehicleBought {
  vehicle: string;
  plate: string;
}

utils.registerRPCListener<incommingVehicleBought>('mojito_pdm:client:vehiclebought', (data) => {
  let properties: VehicleProperties = null;
  QBCore.Functions.SpawnVehicle(
    data.vehicle,
    (veh: number) => {
      SetEntityHeading(veh, Config.buylocation.h);
      SetVehicleNumberPlateText(veh, data.plate);
      SetEntityAsMissionEntity(veh, true, true);
      SetPedIntoVehicle(PlayerPedId(), veh, -1);
      global.exports['LegacyFuel'].SetFuel(veh, 100);
      emit('vehiclekeys:client:SetOwner', data.plate);

      properties = QBCore.Functions.GetVehicleProperties(veh);
    },
    Config.buylocation,
  );

  return properties;
});

interface IFinanceCB {
  vehicle: string;
  downpayPercent: number;
}

RegisterNuiCB<IFinanceCB>('finance_vehicle', (data, cb) => {
  const { vehicle, downpayPercent } = data;
  if (!QBCore.Shared.Vehicles[vehicle])
    return QBCore.Functions.Notify('This vehicle does not appear to exist', 'error');
  emitNet('mojito_pdm:server:finance_vehicle', vehicle, downpayPercent);

  cb({});
});

interface IncommingFinanceMail {
  vehicleName: string;
  interest: number;
  outstanding: number;
}

onNet('mojito_pdm:client:financed_vehicle_mail', (data: IncommingFinanceMail) => {
  const { vehicleName, interest, outstanding } = data;

  emitNet('qb-phone:server:sendNewMail', {
    sender: 'Premium Deluxue Motorsport',
    subject: 'Vehicle Finance',
    message: `
      Your new ${vehicleName} is ready for collection <br />
      You have an outstanding balance of ${outstanding} at an interest rate of ${interest}% <br /> <br />
      Sincerly, <br />
      Los Santos Finance Ltd.
    `,
  });
});

on('mojito_pdm:client:check_finance', async () => {
  const plate = await utils.TakePlateInput();
  emitNet('mojito_pdm:server:check_finance', plate);
});
