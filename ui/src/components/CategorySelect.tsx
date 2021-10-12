import React, {Dispatch, SetStateAction} from 'react'
import {
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    SelectChangeEvent
} from '@mui/material'
import {useTheme} from "@mui/material/styles";

interface CategorySelect {
    cat: string;
    setCat: Dispatch<SetStateAction<string>>
}

const CategorySelect: React.FC<CategorySelect> = ({cat, setCat}) => {
    const theme = useTheme()

    const handleChange = (event: SelectChangeEvent) => {
        setCat(event.target.value)
    };

    return (
        <>
            <div>
                <FormControl variant="outlined" sx={{margin: theme.spacing(1), minWidth: 240}} color="error">
                    <InputLabel sx={{color: "white"}} id="demo-simple-select-outlined-label">Category</InputLabel>
                    <Select sx={{color: "white"}}
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={cat}
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