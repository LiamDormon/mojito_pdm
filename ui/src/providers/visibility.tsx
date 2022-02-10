
import React, {Context, createContext, useContext, useEffect, useState} from "react";
import {useNuiEvent} from "../hooks/useNuiEvent";
import {fetchNui} from "../utils/fetchNui";

const VisibilityCtx = createContext<VisibilityProviderValue | null>(null)

interface VisibilityProviderValue {
    setVisible: (visible: boolean) => void
    visible: boolean
}

export const VisibilityProvider: React.FC = ({children}) => {
    const [visible, setVisible] = useState(false)

    useNuiEvent<boolean>('setVisible', setVisible)

    useEffect(() => {
        if (!visible) return;

        const keyHandler = (e: KeyboardEvent) => {
            if (["Backspace", "Escape"].includes(e.code)) {
                fetchNui('exit')
            }
        }

        window.addEventListener("keydown", keyHandler)

        return () => window.removeEventListener("keydown", keyHandler)
    }, [visible])

    return (
        <VisibilityCtx.Provider
            value={{
                visible,
                setVisible
            }}
        >
            <div className="container" style={{visibility: visible ? "visible" : "hidden"}}>
                {children}
            </div>
        </VisibilityCtx.Provider>)
}

export const useVisibility = () => useContext<VisibilityProviderValue>(VisibilityCtx as Context<VisibilityProviderValue>)