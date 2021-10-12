import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {StyledEngineProvider} from '@mui/material/styles';

ReactDOM.render(
    <StyledEngineProvider injectFirst>
        <App/>
    </StyledEngineProvider>,
    document.getElementById('root')
);
