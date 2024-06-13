import { Container } from "semantic-ui-react";
import NavBar from "./NavBar.tsx";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage.tsx";
import { ToastContainer } from "react-toastify";

function App() {
    const location = useLocation();

    return (
        <>
            <ToastContainer position='bottom-right' hideProgressBar={true} theme={'colored'} />
            {location.pathname === '/' ? <HomePage /> : (
                <>
                    <NavBar />
                    <Container style={{marginTop: '7em'}}>
                        <Outlet />
                    </Container>
                </>
            )}
        </>
    );
}

export default observer(App);
