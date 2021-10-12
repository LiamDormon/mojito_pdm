import { QBCore } from './qbcore';
import { PDM } from './utils';
import { RegisterNuiCB } from '@project-error/pe-utils';
import { Timerbar } from 'fivem-js';

on('mojito_pdm:client:open', () => {
  PDM.Open(true);
});

RegisterNuiCB('exit', (data, cb) => {
  PDM.Open(false);
  cb({});
});

RegisterNuiCB('test_drive', async (data, cb) => {
  const vehicle = data.vehicle;

  PDM.Open(false);
  setTimeout(() => {
    emitNet('mojito_pdm:server:testdrive', vehicle);
  }, 500);

  cb({});
});

onNet('mojito_pdm:client:start_testdrive', (time: number) => {
  const timer = new Timerbar('Test Drive');
  timer.PlayerStyle = true;
  const interval = setInterval(() => {
    timer.Text = PDM.FomatTime(time);
    time--;

    if (time == 0) {
      clearInterval(interval);
      timer.Visible = false;
    }
  }, 1000);
});
