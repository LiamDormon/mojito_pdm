import React, {Dispatch, useState, SetStateAction} from 'react'
import {useTheme} from "@mui/material/styles";
import {Button, Stack, Typography, LinearProgress, Slide, Dialog} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions';
import PurchaseDialogueBody from "./PurchaseDialogueBody";
import GlobalState from '../state'
import {useRecoilValue} from "recoil";
import FinanceDialogueBody from "./FinanceDialogueBody";

function getModalStyle() {
    return {
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
    }
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children?: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Modal {
    name: string,
    brand: string,
    description: string,
    price: string;
    trunkspace: string,
    setOpen: Dispatch<SetStateAction<boolean>>
    performance: CarPerformance
    spawncode: string
}

const ModalBody: React.FC<Modal> = ({name, brand, description, price, trunkspace, setOpen, performance, spawncode}) => {
    const [modalStyle] = useState(getModalStyle)
    const theme = useTheme()
    const [pDialogueOpen, setpDialogueOpen] = useState<boolean>(false) // Purchase Dialogue
    const [fDialogueOpen, setfDialogueOpen] = useState<boolean>(false) // Finance Dialogue

    const handleClose = () => {
        setOpen(false)
    }
    const handlepDialogueClose = () => {
        setpDialogueOpen(false)
    }

    const handlefDialogueClose = () => {
        setfDialogueOpen(false)
    }

    const buyEnabled = useRecoilValue(GlobalState.canbuy)

    return (
        <>
            <div style={{
                ...modalStyle,
                position: "absolute",
                width: 600,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[7],
                padding: theme.spacing(2, 4, 3),
                color: theme.palette.mode === "dark" ? "white" : "black"
            }}>
                <h2>{`${brand} ${name}`}</h2>
                <h4>
                    Price: {price} <br/>
                    Trunk Space: {trunkspace}
                </h4>
                {performance &&
                <Typography>
                    Power <LinearProgress value={performance.power} variant="determinate"/>
                    Acceleration <LinearProgress value={performance.acceleration} variant="determinate"/>
                    Handling <LinearProgress value={performance.handling} variant="determinate"/>
                    Top Speed <LinearProgress value={performance.topspeed} variant="determinate"/>
                </Typography>
                }
                <p>
                    {description}
                </p>
                <Stack direction="row" spacing={2}>
                    <Button size="small" variant="outlined" color="error" onClick={handleClose}>Close</Button>
                    { buyEnabled && <Button size="small" variant="outlined" color="primary" onClick={() => setpDialogueOpen(true)}> Buy </Button> }
                    { buyEnabled && <Button size="small" variant="outlined" color="primary" onClick={() => setfDialogueOpen(true)}> Finance </Button> }
                </Stack>
                <Dialog
                    open={pDialogueOpen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handlepDialogueClose}
                >
                    <PurchaseDialogueBody
                        spawncode={spawncode}
                        price={price}
                        setDialogueOpen={setpDialogueOpen}
                        setModalOpen={setOpen}
                    />
                </Dialog>
                <Dialog
                    open={fDialogueOpen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handlefDialogueClose}
                    fullWidth
                    maxWidth={"xs"}
                >
                    <FinanceDialogueBody
                        spawncode={spawncode}
                        price={price}
                        setDialogueOpen={setfDialogueOpen}
                        setModalOpen={setOpen}
                    />
                </Dialog>
            </div>
        </>
    )
}

export default ModalBody