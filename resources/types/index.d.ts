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

interface IFinance {
  installment_percent: number;
  runs_on: number;
  runs_at: string;
}

export interface IConfig {
  pdmlocation: Vector;
  testdrivespawn: Vector;
  buylocation: Vector;
  temporary: ITemporary;
  canbuy: boolean;
  colours: boolean;
  limit: ILimit;
  finance: IFinance;
  qbtarget: boolean;
}
