import React, {Dispatch, SetStateAction, useState} from 'react'
import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slider
} from '@mui/material'
import {fetchNui} from "../utils/fetchNui";

interface IFinanceDialogueBody {
    spawncode: string;
    price: string;
    setDialogueOpen: Dispatch<SetStateAction<boolean>>;
    setModalOpen: Dispatch<SetStateAction<boolean>>
}

const FinanceDialogueBody: React.FC<IFinanceDialogueBody> = ({spawncode, price, setDialogueOpen, setModalOpen}) => {
    const [downpay, setDownpay] = useState<number>(20)

    const handleClose = () => {
        setDialogueOpen(false)
    }

    const handleAccept = () => {
        setDialogueOpen(false)
        setModalOpen(false)

        fetchNui("finance_vehicle", {
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

    const calculateDownpayment = () => {
        const total = parseFloat(price.slice(1).replace(/,/g, ''))

        return Math.round(total * (1 / downpay))
    }

    const onSliderChange = (e: any) => {
        setDownpay(e.target.value)
    }

    interface iInterest {
        [key: number]: number
    }
    const interestRates: iInterest = {
        10: 20,
        20: 15,
        30: 10,
        40: 5
    }

    return (
        <>
            <DialogTitle>Confirm your finance options</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Downpayment: ${ calculateDownpayment() }.00 <br />
                    Interest Rate: { interestRates[downpay] }%
                </DialogContentText>

                <br />
                <Slider
                    defaultValue={downpay}
                    marks={[
                        {value: 10, label: "10%"},
                        {value: 20, label: "20%"},
                        {value: 30, label: "30%"},
                        {value: 40, label: "40%"},
                    ]}
                    min={10}
                    max={40}
                    step={10}
                    getAriaValueText={(value) => value+"%"}
                    onChange={onSliderChange}
                />

            </DialogContent>
            <DialogActions>
                <Button color="success" variant="outlined" onClick={handleAccept}>Confirm</Button>
                <Button color="error" variant="outlined" onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </>
    )
}

export default FinanceDialogueBody