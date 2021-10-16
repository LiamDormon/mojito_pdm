import React, {Dispatch, SetStateAction, useContext} from 'react'
import {useTheme} from '@mui/material/styles';
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
import GlobalState from "../state";
import {useRecoilState} from "recoil";

interface Header {
    cat: string;
    setCat: Dispatch<SetStateAction<string>>
}

const Header: React.FC<Header> = (props) => {
    const theme = useTheme();
    const [colorMode, setColorMode] = useRecoilState(GlobalState.theme)

    const handleExit = () => {
        fetchNui("exit").then(() => {
            window.dispatchEvent(
                new MessageEvent("message", {
                    data: {
                        action: "setVisible",
                        data: false,
                    },
                })
            );
        }).catch(e => {
            console.error(e)
        })
    }

    const handleThemeswitch = () => {
        colorMode == "light" ? setColorMode("dark") : setColorMode("light")
    }

    return (
        <AppBar position="sticky">
            <Toolbar sx={{backgroundColor: "primary.dark"}}>
                <Typography sx={{flex: 1}}>
                    <img src={logo} height="100px" alt=""/>
                </Typography>

                <CategorySelect {...props} />
                <IconButton sx={{ml: 1}} onClick={handleThemeswitch} color="inherit">
                    {theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
                </IconButton>
                <IconButton sx={{ml: 1}} onClick={handleExit} color="inherit">
                    <CloseIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Header;