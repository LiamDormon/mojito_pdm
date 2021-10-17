import React, {useState, useMemo, useEffect} from 'react';
import './App.css'
import {useNuiEvent} from "../hooks/useNuiEvent";
import {debugData} from "../utils/debugData";
import {useExitListener} from "../hooks/useExitListener";
import {fetchNui} from '../utils/fetchNui';
import Box from '@mui/material/Box';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Catalogue from "./Catalogue";
import Paper from '@mui/material/Paper'
import {blue, grey} from '@mui/material/colors';
import {CssBaseline} from "@mui/material";
import {useRecoilState, useRecoilValue} from 'recoil'
import GlobalState from "../state";

debugData([
    {
        action: 'setVisible',
        data: true,
    }
])

const App: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false)
    const mode = useRecoilValue(GlobalState.theme)
    const [, setBuyEnabled] = useRecoilState(GlobalState.canbuy)

    useEffect(() => {
        fetchNui<boolean>("fetch:canbuy").then((data) => {
            console.log(data)
            setBuyEnabled(data)
        }).catch(() => {
            setBuyEnabled(true)
        })
    })

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                            // palette values for light mode
                            primary: blue,
                            text: {
                                primary: grey[900],
                                secondary: grey[800],
                            },
                            background: {
                                default: "transparent"
                            }
                        }
                        : {
                            // palette values for dark mode
                            primary: blue,
                            text: {
                                primary: '#fff',
                                secondary: grey[500],
                            },
                            background: {
                                default: "transparent"
                            }
                        }),
                },
                components: {
                    MuiCssBaseline: {
                        styleOverrides: {
                            body: {
                                scrollbarColor: "#6b6b6b #2b2b2b",
                                "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                                    backgroundColor: mode === "dark"? grey[800] : grey[200],
                                },
                                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                                    borderRadius: 8,
                                    backgroundColor: grey[500],
                                    minHeight: 24,
                                },
                                "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                                    backgroundColor: grey[600],
                                },
                            },
                        },
                    },
                },
            }),
        [mode],
    );


    useNuiEvent<boolean>('setVisible', (data) => {
        setIsVisible(data)
    })
    useExitListener(setIsVisible)

    return (
        <ThemeProvider theme={theme}>
            <div className="container" style={{visibility: isVisible ? "visible" : "hidden"}}>
                <Box sx={{
                    width: 1100,
                    height: 600,
                    maxHeight: 600,
                }}>
                    <Paper elevation={2} sx={{minHeight: "100%", maxHeight: 600, overflowY: "scroll"}}>
                        <Catalogue/>
                    </Paper>
                </Box>
            </div>
            <CssBaseline />
        </ThemeProvider>
    );
}

export default App;
