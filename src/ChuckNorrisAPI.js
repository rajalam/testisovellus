import logo from './logo.svg';
import './App.css';
import { useState, useReducer, useEffect } from "react"
import axios from 'axios' // npm install axios , jos ei ole jo ladattu

function reducer(state, action) {
    switch (action.type) {
        case 'VITSIN_NOUTO_ALOITETTU':
            console.log("vitsin nouto aloitettu")
            return { ...state, vitsinNoutoAloitettu: true, haeUuttaDataa: false }
        case 'VITSI_NOUDETTU':
            console.log("vitsi noudettu")
            return { ...state, vitsi: action.payload, haeUuttaDataa: false }           
        case 'VITSIN_NOUTO_EPÄONNISTUI':
            console.log("datan nouto epäonnistui")
            return { ...state, vitsinNoutoEpäonnistui: true, vitsinNoutoAloitettu: false }
        case 'NOUDA_VITSI':
            console.log("noudetaan vitsiä")
            
            return { ...state, haeUuttaDataa: true }
        case 'YYYY':
        default:
            throw new Error("Action.type kentän arvoa ei tunnistettu");
    }
}
function AppChuckNorris() {
    const [appData, dispatch] = useReducer(reducer, {
        vitsi: "",
        vitsinNoutoAloitettu: false,
        vitsinNoutoEpäonnistui: false,
        haeUuttaDataa: false
    });

    useEffect(() => {
        async function haeDataa() {
            //let result = await axios('https://api.huuto.net/1.1/categories');


            try {
                dispatch({ type: 'VITSIN_NOUTO_ALOITETTU' })

                //await axios onnistumista on vaikea testailla Firefoxilla Tiedosto->Työskentele yhteydettömässä
                //tilassa, koska selain tuottaa vaan edellisen tuloksen tuolla haulla ilmeisesti
                //selaimen välimuistista, enkä saa Firefoxia heittämään poikkeusta, vaikka axios yhteyttä
                //APIin ei löytyisikään
                let result = await axios('https://api.chucknorris.io/jokes/random');
                dispatch({ type: 'VITSI_NOUDETTU', payload: result.data.value })
                console.log(result.data.value)
            } catch (error) {

                console.log("Tuli muuten hitonmoinen ongelma:", error)
                dispatch({ type: 'VITSIN_NOUTO_EPÄONNISTUI' })

            }
        }
        if (appData.haeUuttaDataa) { //haetaan vain kun uutta tietoa tilattu
            haeDataa();
        }
    }, [appData.haeUuttaDataa]);

    return (
        <div>
            {/* {appData.kategoriat.map(item => <div>{item.title}</div>)} */}

            <div>{appData.vitsinNoutoAloitettu && "Noudetaan vitsi CN APIsta!"}</div>

            <div><h1>{appData.vitsi !== "" && appData.vitsi}</h1></div>

            <div>{appData.vitsinNoutoEpäonnistui && "Vitsin nouto epäonnistui"}</div>

            <div>
                <h6><input type="button" onClick={(event) => {
                    dispatch({
                        type: 'NOUDA_VITSI'
                    })
                }}
                    value="Hae vitsi!" /></h6></div>
        </div>
    );
}

export default AppChuckNorris;