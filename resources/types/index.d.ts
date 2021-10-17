interface Vector {
  x: number;
  y: number;
  z: number;
  h?: number;
}

interface ITemporary {
  enabled: boolean;
  time: number;
}

interface ILimit {
  enabled: boolean;
  jobname: string;
  count: number;
}

export interface IConfig {
  pdmlocation: Vector;
  testdrivespawn: Vector;
  buylocation: Vector;
  temporary: ITemporary;
  canbuy: boolean;
  limit: ILimit;
}
