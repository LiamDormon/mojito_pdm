import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {StyledEngineProvider} from '@mui/material/styles';
import {RecoilRoot} from 'recoil'

ReactDOM.render(

    <StyledEngineProvider injectFirst>
        <RecoilRoot>
            <App/>
        </RecoilRoot>
    </StyledEngineProvider>,
    document.getElementById('root')
);
