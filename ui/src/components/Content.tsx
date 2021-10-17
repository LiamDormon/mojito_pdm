import React, {useState, useEffect} from 'react'
import {Grid, Button} from '@mui/material'
import cardata from '../cars.json';
import VehCard from './VehCard'
import {useTheme} from "@mui/material/styles";

const getVehicleCard = (index: number, obj: Car) => {
    return (
        <Grid item xs={12} sm={4}>
            <VehCard key={index} {...obj} />
        </Grid>
    )
}

interface IContent {
    cat: string;
}

const Content: React.FC<IContent> = ({cat}) => {
    const [data, setData] = useState<Car[]>([])
    const [limit, setLimit] = useState<number>(12)
    const [maxdepth, setMaxdepth] = useState<boolean>(false)

    const theme = useTheme()

    const limits: Limits = {
        "Compacts": 0,
        "Coupe": 0,
        "Motorcycles": 0,
        "Muscle": 0,
        "Offroad": 0,
        "SUV": 0,
        "Sedan": 0,
        "Sports": 0,
        "Sports Classics": 0,
        "Super": 0,
        "Vans": 0
    }

    useEffect(() => {
        let temp: Car[] = []

        let count = limit
        if (cat === "Compacts") {
            count = 10
        }

        if (cat === "") {
            for (let i = 0; i < limit; i++) {
                temp.push(cardata[i])
            }

            return setData(temp)
        }

        let cars = cardata.filter((car) => car.category === cat)

        for (let i = 0; i < count; i++) {
            temp.push(cars[i])
        }
        setData(temp)
    }, [cat, limit])

    useEffect(() => {
        setLimit(12)
        setMaxdepth(false)
    }, [cat])

    const handleLimit = () => {
        let catlimit;
        if (cat === "") {
            catlimit = cardata.length
        } else {
            for (let car of cardata) {
                limits[car.category] += 1
            }
            catlimit = limits[cat]
        }

        if (limit + 12 > catlimit) {
            setLimit(catlimit)
            setMaxdepth(true)
        } else {
            setLimit(limit + 12)
            setMaxdepth(false)
        }
    }

    return (
        <>
            <Grid container spacing={1}>
                {data.map((obj, index) => getVehicleCard(index, obj))}
            </Grid>

            <div className="loadbutton">
                <Button sx={{
                    margin: theme.spacing(0, 0, 1, 0)
                }}
                    variant="contained"
                    color="primary"
                    onClick={handleLimit}
                    fullWidth
                    disabled={maxdepth}
                >

                    Show More

                </Button>
            </div>
        </>
    )
}

export default Content