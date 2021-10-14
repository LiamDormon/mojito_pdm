import React, {Dispatch, SetStateAction} from 'react'
import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import {fetchNui} from "../utils/fetchNui";

interface DialogueBody {
    spawncode: string;
    price: string;
    setDialogueOpen: Dispatch<SetStateAction<boolean>>;
    setModalOpen: Dispatch<SetStateAction<boolean>>
}

const DialogueBody: React.FC<DialogueBody> = ({spawncode, price, setDialogueOpen, setModalOpen}) => {
    const handleClose = () => {
        setDialogueOpen(false)
    }

    const handleAccept = () => {
        setDialogueOpen(false)
        setModalOpen(false)
        // Send the event to buy the vehicle, then close the whole thing
        fetchNui("buy_vehicle", {
            vehicle: spawncode
        }).then(() => {
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
        }).catch((e) => {
            console.error(e)
        })
    }

    return (
        <>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Do you want to purchase this vehicle for {price}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="success" variant="outlined" onClick={handleAccept}>Yes</Button>
                <Button color="error" variant="outlined" onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </>
    )
}

export default DialogueBody