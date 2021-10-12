import { QBCore } from './qbcore';
import { PDM } from './utils';
import { RegisterNuiCB } from '@project-error/pe-utils';

on('mojito_pdm:client:open', () => {
  PDM.Open(true);
});

RegisterNuiCB('exit', (data, cb) => {
  PDM.Open(false);
  cb({});
});
