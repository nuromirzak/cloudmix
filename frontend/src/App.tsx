import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {ErrorFallbackPage} from "./pages/ErrorFallbackPage.tsx";
import {ProtectedRoute} from "./pages/ProtectedRoute.tsx";
import {RootLayout} from "./pages/RootLayout.tsx";
import {MainPage} from "./pages/MainPage.tsx";
import {LoginPage} from "./pages/LoginPage.tsx";
import {RegistrationPage} from "./pages/RegistrationPage.tsx";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" errorElement={<ErrorFallbackPage/>}>
                <Route
                    element={
                        <ProtectedRoute>
                            <RootLayout/>
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<MainPage/>}/>
                    <Route path="*" element={<ErrorFallbackPage/>}/>
                </Route>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="register" element={<RegistrationPage/>}/>
            </Route>,
        ),
    );

    return <RouterProvider router={router}/>;
}

export {App};

