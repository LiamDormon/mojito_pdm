import React, {useState} from 'react';
import Grid from '@mui/material/Grid';
import Header from "./Header";
import Content from "./Content";

const Catalogue: React.FC = () => {
    const [cat, setCat] = useState("")

    return (
        <Grid container direction="column">
            <Grid item>
                <Header
                    cat={cat}
                    setCat={setCat}
                />
            </Grid>
            <Grid item container>
                <Grid item xs={false} sm={1} />

                <Grid item xs={12} sm={10}>
                    <Content
                        cat={cat}
                    />
                </Grid>

                <Grid item xs={false} sm={1} />
            </Grid>
        </Grid>
    )
}

export default Catalogue;