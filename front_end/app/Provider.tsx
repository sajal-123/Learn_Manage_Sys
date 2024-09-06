import React, { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../store/store";

interface ProviderProps {
    children: ReactNode;
}

export function Providers({ children }: ProviderProps) {
    return (
        <ReduxProvider store={store}>
            {children}
        </ReduxProvider>
    );
}
