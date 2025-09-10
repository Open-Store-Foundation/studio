import {Injection} from "@di";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {RouterProvider} from "react-router";
import {WagmiProvider} from "wagmi";
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from "@mui/material/styles";
import {appRouter} from "@router";
import {theme} from "@theme";

function App() {
    const queryClient = new QueryClient()

    return (
        <WagmiProvider config={Injection.Web3.config.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme} defaultMode={'system'} modeStorageKey={"mui-theme-mode-key"}>
                    <CssBaseline />
                    <RouterProvider router={appRouter}/>
                </ThemeProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default App
