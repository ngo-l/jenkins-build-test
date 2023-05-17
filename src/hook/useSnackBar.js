import React, { useContext, createContext } from 'react'

//Todo add useSnackBar hook
const snackBarContext = createContext()

function useProvideSnackBar() {
    return {}
}

export function ProvideSnackBar({ children }) {
    const snackBar = useProvideSnackBar()

    return <snackBarContext.Provider value={snackBar}>{children}</snackBarContext.Provider>
}

export const useSnackBar = () => {
    return useContext(snackBarContext)
}
