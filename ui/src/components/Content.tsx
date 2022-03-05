import React from 'react'
import {Grid} from '@mui/material'
import VehCard from './VehCard'
import CarState from "../state/cars.state";
import {useRecoilValue} from "recoil";

const Content: React.FC = () => {
    const filteredCars = useRecoilValue(CarState.filteredCars)

    return (
        <>
            <Grid container spacing={1}>
                {filteredCars.map((obj, index) => (
                    <Grid item xs={12} sm={4}>
                        <VehCard key={index} {...obj} />
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default Content