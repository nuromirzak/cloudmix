import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App.tsx";
import "./index.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {SnackbarProvider} from "notistack";

const fiveMinutes = 1000 * 60 * 5;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: fiveMinutes,
            retry: false,
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <SnackbarProvider maxSnack={3}>
                <App/>
            </SnackbarProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
