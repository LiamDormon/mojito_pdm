/// <reference types="react-scripts" />

interface Car {
    name: string;
    brand: string;
    description: string;
    brandLogo: string;
    image: string;
    price: string;
    category: string;
    spawncode: string;
    trunkspace: string;
    performance: CarPerformance;
}

interface CarPerformance {
    power: number;
    acceleration: number;
    handling: number;
    topspeed: number;
}

interface Limits {
    [key: string]: number;
}