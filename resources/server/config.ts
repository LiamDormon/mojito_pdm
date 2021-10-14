import { IConfig } from '../types';

const Config: IConfig = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'config.json'));

export default Config;
