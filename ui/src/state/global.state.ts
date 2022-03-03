import {atom} from 'recoil'

const GlobalState = {
    canBuy: atom<boolean>({
        key: "canbuy",
        default: false
    }),
    theme: atom<"light" | "dark">({
        key:"theme",
        default: "light",
    }),
    customColours: atom<boolean>({
        key: "customcolours",
        default: false
    })
}

export default GlobalState;