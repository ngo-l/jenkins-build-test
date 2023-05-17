import React, { useContext, createContext } from 'react'

//Todo add useElsieAlert hook 
const elsieAlertContext = createContext()

function useProvideElsieAlert() {
    return {}
}

export function ProvideElsieAlert({ children }) {
    const elsieAlert = useProvideElsieAlert()

    return <elsieAlertContext.Provider value={elsieAlert}>{children}</elsieAlertContext.Provider>
}

export const useElsieAlert = () => {
    return useContext(elsieAlertContext)
}
