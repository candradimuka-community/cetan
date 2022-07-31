import React, { createContext, useContext } from "react";

export const exampleContext = createContext({})
export const exampleProvider = ({children}) => {
    return (
        <exampleContext.Provider>
            {children}
        </exampleContext.Provider>
    )
}
const useExample = () => {
    return useContext(exampleContext)
}
export default useExample;