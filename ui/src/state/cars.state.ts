import cars from '../cars.default.json'
import {atom, selector} from 'recoil'

const CarState = {
    rawCars: atom<Car[]>({
        key: 'cars',
        default: cars
    }),
    categorySearch: atom<string>({
        key: 'categorySearch',
        default: ''
    }),
    filteredCars: selector<Car[]>({
        key: 'filteredCars',
        get: ({get}) => {
            const cars: Car[] = get(CarState.rawCars)
            const searchCategory: string = get(CarState.categorySearch).trim()

            return !searchCategory ? cars : [...cars].filter(item => item.category == searchCategory)
        }
    })
}

export default CarState