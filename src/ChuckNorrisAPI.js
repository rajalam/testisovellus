import logo from './logo.svg';
import './App.css';
import { useState, useReducer, useEffect } from "react"
import axios from 'axios' // npm install axios , jos ei ole jo ladattu

function reducer(state, action) {
    switch (action.type) {
        case 'VITSIN_NOUTO_ALOITETTU':
            console.log("vitsin nouto aloitettu")
            return { ...state, vitsinNoutoAloitettu: true }
        case 'VITSI_NOUDETTU':
            console.log("vitsi noudettu")
            return { ...state, vitsi: action.payload /* ,kategorioidenNoutoAloitettu:false */ }
        case 'VITSIN_NOUTO_EPÄONNISTUI':
            console.log("datan nouto epäonnistui")
            return { ...state, vitsinNoutoEpäonnistui: true, vitsinNoutoAloitettu: false }
        case 'YYYY':
        default:
            throw new Error("Action.type kentän arvoa ei tunnistettu");
    }
}
function AppChuckNorris() {
    const [appData, dispatch] = useReducer(reducer, { vitsi: "", 
        vitsinNoutoAloitettu: false, 
        vitsinNoutoEpäonnistui: false });

    useEffect(() => {
        async function haeDataa() {
            //let result = await axios('https://api.huuto.net/1.1/categories');
            try {
                dispatch({ type: 'VITSIN_NOUTO_ALOITETTU' })
                let result = await axios('https://api.chucknorris.io/jokes/random');
                dispatch({ type: 'VITSI_NOUDETTU', payload: result.data.value })
                console.log(result.data.value)
            } catch (error) {
                console.log("Tuli muuten hitonmoinen ongelma:", error)
                dispatch({ type: 'VITSIN_NOUTO_EPÄONNISTUI' })

            }
        }
        haeDataa();
    }, []);

    return (
        <div>
            {/* {appData.kategoriat.map(item => <div>{item.title}</div>)} */}

            <div>{appData.vitsinNoutoAloitettu && "Noudetaan vitsi CN APIsta!"}</div>

            <div><h1>{appData.vitsi !== "" && appData.vitsi}</h1></div>

            <div>{appData.vitsinNoutoEpäonnistui && "Vitsin nouto epäonnistui"}</div>

        </div>
    );
}

export default AppChuckNorris;