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
import {RgbColorPicker, RgbColor} from "react-colorful";
import './colourpicker.css'
import {useVisibility} from "../providers/visibility";
import {useRecoilValue} from "recoil";
import GlobalState from "../state";

interface IFinanceDialogueBody {
    spawncode: string;
    price: string;
    setDialogueOpen: Dispatch<SetStateAction<boolean>>;
    setModalOpen: Dispatch<SetStateAction<boolean>>
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

const FinanceDialogueBody: React.FC<IFinanceDialogueBody> = ({spawncode, price, setDialogueOpen, setModalOpen}) => {
    const [downpay, setDownpay] = useState(20)
    const [colour, setColour] = useState<RgbColor>({r: 0, g: 0, b:0})
    const {setVisible} = useVisibility()
    const coloursEnabled = useRecoilValue(GlobalState.customcolours)

    const handleClose = () => {
        setDialogueOpen(false)
    }

    const handleAccept = async () => {
        setDialogueOpen(false)
        setModalOpen(false)

        try {
            await fetchNui<void>("finance_vehicle", {
                vehicle: spawncode,
                downpayPercent: downpay,
                colour: coloursEnabled ? colour : null
            })
            await fetchNui("exit")
            setVisible(false)
        } catch (e) {
            console.error(e)
        }
    }

    const calculateDownpayment = () => {
        const total = parseFloat(price.slice(1).replace(/,/g, ''))

        return Math.round(total * (downpay / 100))
    }

    const onSliderChange = (e: any) => {
        setDownpay(e.target.value)
    }

    return (
        <>
            <DialogTitle>Confirm your finance options</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Downpayment: ${calculateDownpayment()}.00 <br/>
                    Interest Rate: {interestRates[downpay]}%
                </DialogContentText>

                <br/>
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
                    getAriaValueText={(value) => value + "%"}
                    onChange={onSliderChange}
                />

                {coloursEnabled &&
                <DialogContentText>
                    <br />
                    Pick a colour, any colour:
                    <RgbColorPicker color={colour} onChange={setColour} />
                </DialogContentText>
                }

            </DialogContent>
            <DialogActions>
                <Button color="success" variant="outlined" onClick={handleAccept}>Confirm</Button>
                <Button color="error" variant="outlined" onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </>
    )
}

export default FinanceDialogueBody