interface Vector {
  x: number;
  y: number;
  z: number;
  h?: number;
}

interface ITemporary {
  enabled: true;
  time: number;
}

interface IConfig {
  pdmlocation: Vector;
  testdrivespawn: Vector;
  temporary: ITemporary;
}

const Config: IConfig = JSON.parse(LoadResourceFile(GetCurrentResourceName(), 'config.json'));

export default Config;
