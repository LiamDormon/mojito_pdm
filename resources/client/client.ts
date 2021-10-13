import { QBCore } from './qbcore';
import { utils } from './utils';
import { RegisterNuiCB } from '@project-error/pe-utils';
import { Timerbar } from 'fivem-js';

on('mojito_pdm:client:open', () => {
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

let canbuy: boolean = false

setImmediate(async () => {
  const serverResp = await utils.emitNetPromise("fetch:config", {})
  canbuy = serverResp.data.canbuy
})

RegisterNuiCB("fetch:canbuy", async (data, cb) => {
  cb(canbuy)
})
