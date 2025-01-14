import './App.css'
import {useEffect} from "react";
import OpenPage from "@/pages";

function App() {
    useEffect(() => {
        const handlePywebviewReady = () => {
            if (!window.pywebview!.state) {
                window.pywebview!.state = {};
            }

            // @ ts-expect-error This is a custom state
            // window.pywebview.state.setTicker = setTicker;
        };

        if (window.pywebview) {
            handlePywebviewReady();
        } else {
            window.addEventListener("pywebviewready", handlePywebviewReady);
        }

        return () => {
            window.removeEventListener("pywebviewready", handlePywebviewReady);
        };
    }, []);
    return (
        <>
            <OpenPage/>
        </>
    )
}

export default App
