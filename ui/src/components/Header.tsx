import React from 'react'
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import logo from '../logo.png';
import CategorySelect from "./CategorySelect";
import {fetchNui} from "../utils/fetchNui";
import GlobalState from "../state/global.state";
import {useRecoilState} from "recoil";
import {useVisibility} from "../providers/visibility";

const Header: React.FC = () => {
    const [colorMode, setColorMode] = useRecoilState(GlobalState.theme)
    const {setVisible} = useVisibility()

    const handleExit = async () => {
        try {
            await fetchNui("exit")
            setVisible(false);
        } catch (e) {
            console.error(e)
        }
    }

    const handleThemeswitch = () => {
        colorMode === "light" ? setColorMode("dark") : setColorMode("light")
    }

    return (
        <AppBar position="sticky">
            <Toolbar sx={{backgroundColor: "primary.dark"}}>
                <Typography sx={{flex: 1}}>
                    <img src={logo} height="100px" alt=""/>
                </Typography>

                <CategorySelect/>
                <IconButton sx={{ml: 1}} onClick={handleThemeswitch} color="inherit">
                    {colorMode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
                </IconButton>
                <IconButton sx={{ml: 1}} onClick={handleExit} color="inherit">
                    <CloseIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Header;