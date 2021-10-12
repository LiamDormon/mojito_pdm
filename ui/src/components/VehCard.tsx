import React, {useEffect, useState} from 'react'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import AssignmentIcon from '@mui/icons-material/Assignment'
import {
    Card,
    CardHeader,
    CardMedia,
    Button,
    Modal,
    Tooltip,
    Zoom,
    CardActions
} from '@mui/material'
import {fetchNui} from "../utils/fetchNui";
import {useTheme} from "@mui/material/styles";
import ModalBody from './ModalBody'

const VehCard: React.FC<Car> = ({
    name,
    brand,
    description,
    brandLogo,
    image,
    price,
    category,
    spawncode,
    trunkspace,
    performance
}) => {
    const theme = useTheme();

    const [open, setOpen] = useState<boolean>(false)
    const testDrive = () => {
        fetchNui("test_drive", {vehicle: spawncode}).then()
    }

    // Functions
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <Card sx={{
            boxShadow: theme.shadows[3],
            margin: theme.spacing(2)
        }} variant="outlined">
            <CardHeader
                avatar={<img height={40} style={{maxWidth: 100, maxHeight: 40}} src={brandLogo} alt={brand}/>}
                title={name}
                subheader={category}
            />
            <CardMedia style={{height: "150px"}} image={image}/>
            <CardActions>
                <Tooltip TransitionComponent={Zoom} sx={{maxWidth: 120}} arrow title="Test drive this vehicle">
                    <Button
                        size="small"
                        variant={theme.palette.mode == "dark" ? "contained" : "outlined"}
                        color="primary"
                        startIcon={<DirectionsCarIcon/>}
                        onClick={testDrive}
                        disableElevation
                    >
                        TEST DRIVE
                    </Button>
                </Tooltip>
                <Tooltip TransitionComponent={Zoom} arrow sx={{maxWidth: 120}}
                         title="View more information about this vehicle">
                    <Button
                        size="small"
                        variant={theme.palette.mode == "dark" ? "contained" : "outlined"}
                        color="primary"
                        startIcon={<AssignmentIcon/>}
                        onClick={handleOpen}
                        disableElevation
                    >
                        MORE INFO
                    </Button>
                </Tooltip>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {<ModalBody
                        name={name}
                        brand={brand}
                        description={description}
                        price={price}
                        trunkspace={trunkspace}
                        setOpen={setOpen}
                        performance={performance}
                    />}
                </Modal>
            </CardActions>
        </Card>
    )
}

export default VehCard