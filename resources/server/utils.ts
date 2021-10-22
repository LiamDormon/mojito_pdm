import { ServerUtils } from '@project-error/pe-utils';
import { QBCore } from './qbcore';

class Utils extends ServerUtils {
  Wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  random = (min: number, max: number): number => Math.floor(Math.random() * (max - min)) + min;

  joaat = (key: any) => {
    key = key.toLowerCase();

    const hash = new Uint32Array(1);

    for (const i in key) {
      hash[0] += key.charCodeAt(Number(i));
      hash[0] += hash[0] << 10;
      hash[0] ^= hash[0] >>> 6;
    }

    hash[0] += hash[0] << 3;
    hash[0] ^= hash[0] >>> 11;
    hash[0] += hash[0] << 15;

    return '0x' + hash[0].toString(16).toUpperCase();
  };

  GeneratePlate = async (): Promise<string> => {
    let plate =
      QBCore.Shared.RandomInt(1) +
      QBCore.Shared.RandomStr(2) +
      QBCore.Shared.RandomInt(2) +
      QBCore.Shared.RandomStr(3);
    plate = plate.toUpperCase();
    const result = await global.exports.oxmysql.singleSync(
      'SELECT plate FROM player_vehicles WHERE plate = ?',
      [plate],
    );

    if (!result) return plate;
    else return this.GeneratePlate();
  };

  GenerateMailId = (): number => {
    return Math.floor(Math.random() * 999999);
  };
}

export let utils = new Utils();
