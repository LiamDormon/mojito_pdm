import React, {useState, useMemo, createContext} from 'react';
import './App.css'
import {useNuiEvent} from "../hooks/useNuiEvent";
import {debugData} from "../utils/debugData";
import {useExitListener} from "../hooks/useExitListener";
import Box from '@mui/material/Box';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Catalogue from "./Catalogue";
import Paper from '@mui/material/Paper'
import {blue, grey} from '@mui/material/colors';
import {CssBaseline} from "@mui/material";


debugData([
    {
        action: 'setVisible',
        data: true,
    }
])

export const ColorModeContext: React.Context<any> = createContext({
    toggleColorMode: () => {
    }
});

const App: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

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
                            }
                        }
                        : {
                            // palette values for dark mode
                            primary: blue,
                            text: {
                                primary: '#fff',
                                secondary: grey[500],
                            },
                        }),
                },
            }),
        [mode],
    );


    useNuiEvent<boolean>('setVisible', (data) => {
        setIsVisible(data)
    })
    useExitListener(setIsVisible)

    return (
        <ColorModeContext.Provider value={colorMode}>
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
        </ColorModeContext.Provider>
    );
}

export default App;
