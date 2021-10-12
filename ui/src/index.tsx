import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {StyledEngineProvider} from '@mui/material/styles';
import {CssBaseline} from "@mui/material";

ReactDOM.render(
    <StyledEngineProvider injectFirst>
        <CssBaseline />
        <App/>
    </StyledEngineProvider>,
    document.getElementById('root')
);
