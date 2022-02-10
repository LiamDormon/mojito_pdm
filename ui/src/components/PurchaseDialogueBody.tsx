import React, {Dispatch, SetStateAction, useState} from 'react'
import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import {fetchNui} from "../utils/fetchNui"
import {RgbColorPicker, RgbColor} from 'react-colorful'
import './colourpicker.css';
import {useVisibility} from "../providers/visibility";

interface IPurchaseDialogueBody {
    spawncode: string;
    price: string;
    setDialogueOpen: Dispatch<SetStateAction<boolean>>;
    setModalOpen: Dispatch<SetStateAction<boolean>>
}

const PurchaseDialogueBody: React.FC<IPurchaseDialogueBody> = ({spawncode, price, setDialogueOpen, setModalOpen}) => {
    const [colour, setColour] = useState<RgbColor>({r: 0, g: 0, b: 0})
    const handleClose = () => {
        setDialogueOpen(false)
    }
    const {setVisible} = useVisibility()

    const handleAccept = async () => {
        setDialogueOpen(false)
        setModalOpen(false)

        try {
            await fetchNui<void>("buy_vehicle", {
                vehicle: spawncode,
                colour: colour
            })
            await fetchNui("exit")
            setVisible(false)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Do you want to purchase this vehicle for {price}?
                </DialogContentText>

                <DialogContentText>
                    <br />
                    Pick a colour, any colour:
                    <RgbColorPicker color={colour} onChange={setColour} />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="success" variant="outlined" onClick={handleAccept}>Yes</Button>
                <Button color="error" variant="outlined" onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </>
    )
}

export default PurchaseDialogueBody