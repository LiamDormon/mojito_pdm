import { QBCore } from './qbcore';
import { utils } from './utils';
import Config from './config';

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

interface RgbColour {
    r: number;
    g: number;
    b: number;
}

interface incommingBuyVeh {
  vehicle: string;
  colour: RgbColour
}

interface outgoingBuyVeh {
  msg: string;
}

utils.onNetPromise<incommingBuyVeh, outgoingBuyVeh>(
  'mojito_pdm:server:buyvehicle',
  async (req, res) => {
    const src = req.source;
    const {vehicle, colour} = req.data;

    if (!QBCore.Shared.Vehicles[vehicle]) {
      return res({
        data: { msg: 'Vehicle does not exist' },
        status: 'error',
      });
    }

    const { price, hash, name, brand } = QBCore.Shared.Vehicles[vehicle];

    const Player = QBCore.Functions.GetPlayer(src);
    const { bank, cash } = Player.PlayerData.money;

    if (bank - price >= 0) {
      Player.Functions.RemoveMoney('bank', price, 'vehicle-bought');
      const plate = await utils.GeneratePlate();
      const mods = await utils.callClientRPC('mojito_pdm:client:vehiclebought', src, {
        vehicle: vehicle,
        plate: plate,
        colour: colour
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

utils.onNetPromise<null, number>('fetch:pdm_online', (req, res) => {
  const Players = QBCore.Functions.GetQBPlayers();
  let count: number = 0;
  for (let id in Players) {
    const ply = Players[id];
    if (ply.PlayerData.job.name == Config.limit.jobname) count++;
  }

  res({
    status: 'ok',
    data: count,
  });
});

interface IInterest {
  [key: number]: number;
}
const interestRates: IInterest = {
  10: 20,
  20: 15,
  30: 10,
  40: 5,
};

onNet('mojito_pdm:server:finance_vehicle', async (spawncode: string, downpayPercent: number, colour: RgbColour) => {
  const { price, name, brand } = QBCore.Shared.Vehicles[spawncode];
  const downpay = Math.round(price * (downpayPercent / 100));
  const interestPercent = interestRates[downpayPercent];
  const src = global.source;

  const Player = QBCore.Functions.GetPlayer(src);
  const { bank } = Player.PlayerData.money;

  if (bank - downpay <= 0) {
    return emitNet(
      'QBCore:Notify',
      src,
      'You have insufficient funds to finance this vehicle',
      'error',
    );
  }

  Player.Functions.RemoveMoney('bank', downpay, 'finance-vehicle');

  const plate = await utils.GeneratePlate();
  const mods = await utils.callClientRPC('mojito_pdm:client:vehiclebought', src, {
    vehicle: spawncode,
    plate: plate,
    colour: colour
  });

  global.exports.oxmysql.insert(
    'INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      Player.PlayerData.license,
      Player.PlayerData.citizenid,
      spawncode,
      GetHashKey(spawncode),
      JSON.stringify(mods),
      plate,
      0,
    ],
  );

  const outstandingBal = price - downpay;

  global.exports.oxmysql.insert(
    'INSERT INTO vehicle_finance (plate, citizenid, model, interest_rate, outstanding_bal) VALUES (?, ?, ?, ?, ?)',
    [plate, Player.PlayerData.citizenid, spawncode, interestPercent, outstandingBal],
  );

  emit(
    'qb-log:server:CreateLog',
    'vehicleshop',
    'Vehicle Financed (PDM Catalogue)',
    'green',
    `**${GetPlayerName(
      src.toString(),
    )}** financed a ${name} ${brand}: \n Downpay: ${downpay} \n Interest Rate: ${interestPercent}`,
  );

  emitNet('mojito_pdm:client:financed_vehicle_mail', src, {
    vehicleName: `${brand} ${name}`,
    outstanding: outstandingBal,
    interest: interestPercent,
  });
});

onNet('mojito_pdm:server:check_finance', (plate: string) => {
  const src = global.source;
  if (!plate) return;

  global.exports.oxmysql.single(
    'SELECT outstanding_bal from vehicle_finance WHERE plate = :plate',
    {
      plate: plate,
    },
    (res: any) => {
      if (res) {
        const { outstanding_bal } = res;
        emitNet('QBCore:Notify', src, `Your outstanding balance stands at $${outstanding_bal}`);
      } else {
        emitNet('QBCore:Notify', src, 'We could not find this registration in our system');
      }
    },
  );
});

interface IFinanceDatabase {
  id: number;
  plate: string;
  citizenid: string;
  model: string;
  interest_rate: number;
  outstanding_bal: number;
  warning: number;
}

if (Config.canbuy) {
  const [hour, minute] = Config.finance.runs_at.split(':');
  const day = Config.finance.runs_on;

  const CronTask = (d: number) => {
    if (d != day) return;

    console.log('[mojito_pdm]: Running cron task');

    global.exports.oxmysql.execute('SELECT * FROM vehicle_finance', (res: IFinanceDatabase[]) => {
      res.forEach(async (vehicle) => {
        const { price, name, brand } = QBCore.Shared.Vehicles[vehicle.model];
        const payment = price * (Config.finance.installment_percent / 100);

        const Owner = QBCore.Functions.GetPlayerByCitizenId(vehicle.citizenid);
        if (Owner) {
          const { bank } = Owner.PlayerData.money;

          if (bank - payment >= 0) {
            Owner.Functions.RemoveMoney('bank', payment, 'vehicle-finance-paid');
            let outstanding = vehicle.outstanding_bal - payment;
            if (outstanding <= 0) {
              global.exports.oxmysql.execute('DELETE FROM vehicle_finance WHERE plate = :plate', {
                plate: vehicle.plate,
              });

              global.exports.oxmysql.insert(
                'INSERT INTO player_mails (citizenid, sender, subject, message, mailid) VALUES (:cid, :sender, :subject, :message, :mailid)',
                {
                  cid: vehicle.citizenid,
                  sender: 'PDM Finance Ltd.',
                  subject: 'Vehicle Finance',
                  message: `
                We are pleased to inform you that your ${brand} ${name}, Reg: ${vehicle.plate} has now been fully paid off. <br /> <br />
                Sincerly, <br />
                PDM Finance Ltd.
                `,
                  mailid: utils.GenerateMailId(),
                },
              );
            } else {
              outstanding = outstanding * (vehicle.interest_rate / 100 + 1.0); // Apply interest
              global.exports.oxmysql.update(
                'UPDATE vehicle_finance SET outstanding_bal = :outstanding, warning = 0',
                {
                  outstanding: outstanding,
                },
              );

              global.exports.oxmysql.insert(
                'INSERT INTO player_mails (citizenid, sender, subject, message, mailid) VALUES (:cid, :sender, :subject, :message, :mailid)',
                {
                  cid: vehicle.citizenid,
                  sender: 'PDM Finance Ltd.',
                  subject: 'Vehicle Finance',
                  message: `
                We have deducted $${payment} from your bank account for your ${brand} ${name}, Reg: ${vehicle.plate} and ${vehicle.interest_rate}% interest has been applied <br />
                Your outstanding balance is now $${outstanding}<br /> <br />
                Sincerly, <br />
                PDM Finance Ltd.
                `,
                  mailid: utils.GenerateMailId(),
                },
              );
            }
          } else {
            // Take all we can
            Owner.Functions.SetMoney('bank', 0);

            if (vehicle.warning === 1) {
              // Vehicle is repossesd
              global.exports.oxmysql.execute('DELETE FROM vehicle_finance WHERE plate = :plate', {
                plate: vehicle.plate,
              });

              global.exports.oxmysql.insert(
                'INSERT INTO player_mails (citizenid, sender, subject, message, mailid) VALUES (:cid, :sender, :subject, :message, :mailid)',
                {
                  cid: vehicle.citizenid,
                  sender: 'PDM Finance Ltd.',
                  subject: 'Vehicle Finance',
                  message: `
                We regret to inform you that your ${brand} ${name}, Reg: ${vehicle.plate} has been repossed due to missed payments <br />
                Sincerly, <br />
                PDM Finance Ltd.
                `,
                  mailid: utils.GenerateMailId(),
                },
              );
            } else {
              let outstanding = vehicle.outstanding_bal - bank;
              outstanding += outstanding * (vehicle.interest_rate / 100 + 1.0); // Apply interest
              global.exports.oxmysql.update(
                'UPDATE vehicle_finance SET outstanding_bal = :outstanding, warning = 1',
                {
                  outstanding: outstanding,
                },
              );

              global.exports.oxmysql.insert(
                'INSERT INTO player_mails (citizenid, sender, subject, message, mailid) VALUES (:cid, :sender, :subject, :message, :mailid)',
                {
                  cid: vehicle.citizenid,
                  sender: 'PDM Finance Ltd.',
                  subject: 'Vehicle Finance',
                  message: `
                You could not afford the due payment of ${payment} for your ${brand} ${name}, Reg: ${vehicle.plate} <br />
                If you miss your next payment your vehicle will be repossesed.
                Your outstanding balance is now $${outstanding}<br /> <br />
                Sincerly, <br />
                PDM Finance Ltd.
                `,
                  mailid: utils.GenerateMailId(),
                },
              );
            }
          }
        } else {
          const Owner = await global.exports.oxmysql.singleSync(
            'SELECT * FROM `players` WHERE `citizenid` = :citizenid',
            {
              citizenid: vehicle.citizenid,
            },
          );

          const money = JSON.parse(Owner.money);
          let bank = money.bank;

          if (bank - payment >= 0) {
            money.bank -= payment;
            global.exports.oxmysql.update(
              'UPDATE players SET money = :money WHERE citizenid = :cid',
              {
                money: JSON.stringify(money),
                cid: Owner.citizenid,
              },
            );

            let outstanding = vehicle.outstanding_bal - payment;
            if (outstanding <= 0) {
              global.exports.oxmysql.execute('DELETE FROM vehicle_finance WHERE plate = :plate', {
                plate: vehicle.plate,
              });

              global.exports.oxmysql.insert(
                'INSERT INTO player_mails (citizenid, sender, subject, message, mailid) VALUES (:cid, :sender, :subject, :message, :mailid)',
                {
                  cid: vehicle.citizenid,
                  sender: 'PDM Finance Ltd.',
                  subject: 'Vehicle Finance',
                  message: `
                We are pleased to inform you that your ${brand} ${name}, Reg: ${vehicle.plate} has now been fully paid off. <br /> <br />
                Sincerly, <br />
                PDM Finance Ltd.
                `,
                  mailid: utils.GenerateMailId(),
                },
              );
            } else {
              outstanding = outstanding * (vehicle.interest_rate / 100 + 1.0); // Apply interest
              global.exports.oxmysql.update(
                'UPDATE vehicle_finance SET outstanding_bal = :outstanding, warning = 0',
                {
                  outstanding: outstanding,
                },
              );

              global.exports.oxmysql.insert(
                'INSERT INTO player_mails (citizenid, sender, subject, message, mailid) VALUES (:cid, :sender, :subject, :message, :mailid)',
                {
                  cid: vehicle.citizenid,
                  sender: 'PDM Finance Ltd.',
                  subject: 'Vehicle Finance',
                  message: `
                We have deducted $${payment} from your bank account for your ${brand} ${name}, Reg: ${vehicle.plate} and ${vehicle.interest_rate}% interest has been applied <br />
                Your outstanding balance is now $${outstanding}<br /> <br />
                Sincerly, <br />
                PDM Finance Ltd.
                `,
                  mailid: utils.GenerateMailId(),
                },
              );
            }
          } else {
            // Take all we can
            money.bank = 0;
            global.exports.oxmysql.update(
              'UPDATE players SET money = :money WHERE citizenid = :cid',
              {
                money: JSON.stringify(money),
                cid: Owner.citizenid,
              },
            );

            if (vehicle.warning === 1) {
              // Vehicle is repossesd

              global.exports.oxmysql.insert(
                'INSERT INTO player_mails (citizenid, sender, subject, message, mailid) VALUES (:cid, :sender, :subject, :message, :mailid)',
                {
                  cid: vehicle.citizenid,
                  sender: 'PDM Finance Ltd.',
                  subject: 'Vehicle Finance',
                  message: `
                We regret to inform you that your ${brand} ${name}, Reg: ${vehicle.plate} has been repossed due to missed payments <br />
                Sincerly, <br />
                PDM Finance Ltd.
                `,
                  mailid: utils.GenerateMailId(),
                },
              );

              global.exports.oxmysql.execute('DELETE FROM vehicle_finance WHERE plate = :plate', {
                plate: vehicle.plate,
              });
            } else {
              let outstanding = vehicle.outstanding_bal - bank;
              outstanding += outstanding * (vehicle.interest_rate / 100 + 1.0); // Apply interest
              global.exports.oxmysql.update(
                'UPDATE vehicle_finance SET outstanding_bal = :outstanding, warning = 1',
                {
                  outstanding: outstanding,
                },
              );

              global.exports.oxmysql.insert(
                'INSERT INTO player_mails (citizenid, sender, subject, message, mailid) VALUES (:cid, :sender, :subject, :message, :mailid)',
                {
                  cid: vehicle.citizenid,
                  sender: 'PDM Finance Ltd.',
                  subject: 'Vehicle Finance',
                  message: `
                You could not afford the due payment of ${payment} for your ${brand} ${name}, Reg: ${vehicle.plate} <br />
                If you miss your next payment your vehicle will be repossesed.
                Your outstanding balance is now $${outstanding}<br /> <br />
                Sincerly, <br />
                PDM Finance Ltd.
                `,
                  mailid: utils.GenerateMailId(),
                },
              );
            }
          }
        }
      });
    });
  };

  emit('cron:runAt', hour, minute, CronTask);

  RegisterCommand(
    'test:cron',
    (source: number) => {
      if (source != 0) return;
      CronTask(1);
    },
    false,
  );
}
