import React, {Dispatch, SetStateAction} from 'react'
import {
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    SelectChangeEvent
} from '@mui/material'
import {useTheme} from "@mui/material/styles";
import CarState from "../state/cars.state";
import {useRecoilState} from "recoil";

const CategorySelect: React.FC = () => {
    const theme = useTheme()
    const [category, setCategory] = useRecoilState(CarState.categorySearch)

    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value)
    };

    return (
        <>
            <div>
                <FormControl variant="outlined" sx={{margin: theme.spacing(1), minWidth: 240}} color="error">
                    <InputLabel sx={{color: "white"}}>Category</InputLabel>
                    <Select sx={{color: "white"}}
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={category}
                            onChange={handleChange}
                            label="Category"
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        <MenuItem value={"Sports"}>Sports</MenuItem>
                        <MenuItem value={"Compacts"}>Compacts</MenuItem>
                        <MenuItem value={"Muscle"}>Muscle</MenuItem>
                        <MenuItem value={"Sedan"}>Sedan</MenuItem>
                        <MenuItem value={"Coupe"}>Coupé</MenuItem>
                        <MenuItem value={"Super"}>Super</MenuItem>
                        <MenuItem value={"SUV"}>SUV</MenuItem>
                        <MenuItem value={"Vans"}>Vans</MenuItem>
                        <MenuItem value={"Offroad"}>Offroad</MenuItem>
                        <MenuItem value={"Sports Classics"}>Sports Classics</MenuItem>
                        <MenuItem value={"Motorcycles"}>Motorcycles</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </>
    )
}

export default CategorySelect