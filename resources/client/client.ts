import { QBCore } from './qbcore';
import { utils } from './utils';
import { RegisterNuiCB, ServerPromiseResp } from '@project-error/pe-utils';
import { Menu, MenuAlignment, Timerbar, UIMenuItem } from '@nativewrappers/client';
import Config from './config';
import { VehicleProperties } from 'qbcore.js/@types/client';

const exp = global.exports;

if (Config.qbtarget) {
  exp['qb-target'].AddCircleZone(
    'mojito_pdm',
    { x: -55.17767, y: -1096.946, z: 26.62873 },
    0.4,
    {
      name: 'mojito_pdm',
      useZ: true,
      debugPoly: false,
    },
    {
      options: [
        {
          type: 'client',
          event: 'mojito_pdm:client:open',
          icon: 'fas fa-book-open',
          label: 'Open Catalogue',
        },
        {
          type: 'client',
          event: 'mojito_pdm:client:check_finance',
          icon: 'fas fa-comment-dollar',
          label: 'Check Finance',
        },
      ],
      distance: 1.0,
    },
  );
}

setTimeout(() => {
  const RawCarsJSON = LoadResourceFile(GetCurrentResourceName(), 'cars.json')
  utils.SendUIMessage('setCars', JSON.parse(RawCarsJSON))
}, 1000)

on('mojito_pdm:client:open', async () => {
  const serverResp = await utils.emitNetPromise<ServerPromiseResp<number>>('fetch:pdm_online', {});
  if (Config.limit.enabled && serverResp.data > Config.limit.count)
    return QBCore.Functions.Notify('There are too many car dealers online', 'error');

  await utils.Open(true);
});

RegisterNuiCB('exit', async (data, cb) => {
  await utils.Open(false);
  cb({});
});

RegisterNuiCB('test_drive', async (data, cb) => {
  const vehicle = data.vehicle;

  await utils.Open(false);
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

RegisterNuiCB('fetchconfig', async (data, cb) => {
  cb({
    buy: Config.canbuy,
    colours: Config.colours
  });
});

interface IVehicleBoughtCB {
  vehicle: string;
  colour: RgbColour | null;
}

RegisterNuiCB<IVehicleBoughtCB>('buy_vehicle', async (data, cb) => {
  const { vehicle, colour } = data;

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
      colour: colour,
    },
  );

  const type: string = serverResp.status === 'ok' ? 'success' : 'error';
  QBCore.Functions.Notify(serverResp.data.msg, type);

  cb({});
});

interface RgbColour {
  r: number;
  g: number;
  b: number;
}

interface incommingVehicleBought {
  vehicle: string;
  plate: string;
  colour: RgbColour | null;
}

utils.registerRPCListener<incommingVehicleBought>(
  'mojito_pdm:client:vehiclebought',
  async (data) => {
    const properties: Promise<VehicleProperties> = new Promise((resolve) => {


      QBCore.Functions.SpawnVehicle(
        data.vehicle,
        (veh: number) => {
          SetEntityHeading(veh, Config.buylocation.h);
          SetVehicleNumberPlateText(veh, data.plate);
          SetEntityAsMissionEntity(veh, true, true);
          SetPedIntoVehicle(PlayerPedId(), veh, -1);
          if (data.colour) {
            const { r, g, b } = data.colour;
            SetVehicleCustomPrimaryColour(veh, r, g, b);
            SetVehicleCustomSecondaryColour(veh, r, g, b);
          }
          global.exports['LegacyFuel'].SetFuel(veh, 100);
          emit('vehiclekeys:client:SetOwner', data.plate);

          resolve(QBCore.Functions.GetVehicleProperties(veh));
        },
        Config.buylocation,
      );
    });

    return await properties;
  },
);

interface IFinanceCB {
  vehicle: string;
  downpayPercent: number;
  colour: RgbColour | null;
}

interface FinanceResp {
  msg: string;
  vehicleName: string;
  interest: number;
  outstanding: number;
}

RegisterNuiCB<IFinanceCB>('finance_vehicle', async (data, cb) => {
  const { vehicle, downpayPercent, colour } = data;
  if (!QBCore.Shared.Vehicles[vehicle])
    return QBCore.Functions.Notify('This vehicle does not appear to exist', 'error');
  emitNet('mojito_pdm:server:finance_vehicle', vehicle, downpayPercent, colour);

  const resp = await utils.emitNetPromise<ServerPromiseResp<FinanceResp>>(
    'mojito_pdm:server:finance_vehicle',
    { vehicle, downpayPercent, colour },
  );
  const { vehicleName, interest, outstanding } = resp.data;
  const success = resp.status === 'ok';

  const type: string = success ? 'success' : 'error';
  QBCore.Functions.Notify(resp.data.msg, type);
  if (!success) return;

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

  cb({});
});

interface FinancedVehicles {
  plate: string;
  outstandingBal: number;
  name: string;
}

on('mojito_pdm:client:check_finance', async () => {
  const MENU = new Menu('PDM Finance Ltd', 'Check your outstanding balances');
  MENU.Alignment = MenuAlignment.Right;

  const resp = await utils.emitNetPromise<ServerPromiseResp<FinancedVehicles[]>>(
    'mojito_pdm:getFinancedVehicles',
    {},
  );

  if (resp.status == 'error') {
    return QBCore.Functions.Notify('You do not have any vehicles on finance', 'error');
  }

  resp.data.forEach((item) => {
    const MENU_ITEM = new UIMenuItem(`${item.name} [${item.plate}]`, `$${item.outstandingBal}`);
    MENU.addItem(MENU_ITEM);
  });

  MENU.open();
});
