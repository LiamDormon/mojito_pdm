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

export interface IConfig {
  pdmlocation: Vector;
  testdrivespawn: Vector;
  buylocation: Vector;
  temporary: ITemporary;
  canbuy: boolean;
}
