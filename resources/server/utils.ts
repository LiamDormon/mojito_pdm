class Utils {
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
}

export let utils = new Utils();
