import logo from './logo.svg';
import './App.css';
import { useState, useReducer, useEffect } from "react"
import axios from 'axios' // npm install axios , jos ei ole jo ladattu

function reducer(state, action) {
    
    //täysi kopio appDatasta
    let appDataKopio = JSON.parse(JSON.stringify(state))
    
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
            //setVitsiTimer = true
            return { ...state, haeUuttaDataa: true }
        case 'TALLENNA_VITSI':
            console.log("tallennetaan vitsiä")
            
            console.log("tallennetaan vitsiä, vitsikopio", appDataKopio.vitsi )
            console.log("tallennus, appdataKopio, vitsit: ", appDataKopio.vitsit )

            //appDataKopio.vitsit = [...appDataKopio.vitsit, appDataKopio.vitsi]
            if( appDataKopio.vitsit == null ) { //jos yhtään vitsiä ei talletettu vielä
                //toisella kutsukerralla appDataKopio.vitsit muuttuu undefined tilaan syystä x ja
                //sinne uusien vitsien lisäily ei sitten onnistu, jumituin pitkäksi aikaa tämän ongelman
                //kanssa, vaikuttaa siltä että appData.vitsit viite(lista ilman alkioita) ei toimi 
                //kopioituessa kuten oletan
                //vaan sen arvoksi tulee kopioinnin tuloksena undefined, minkä jälkeen sille ei voi mitään
                //operaatioita esim. push antaa vaan Array operaatiot heittää poikkeuksen
                appDataKopio.vitsit = [appDataKopio.vitsi]
            }

            //lisätään uusi, ei-tyhjä vitsi vitsilistadataan loppuun
            if( appDataKopio.vitsi !== "" )  {
               
                appDataKopio.vitsit.push( appDataKopio.vitsi )
                //data tallennus tarvitaan
                appDataKopio.tallennetaanko = true
            }
             
            return { appDataKopio } 
        case "ALUSTA_DATA":
            console.log("Reduceria kutsuttiin", action)
            return { ...action.payload, tietoAlustettu: true }
        case "PAIVITA_TALLENNUSTILA":
            console.log("Reduceria kutsuttiin", action)
            return { ...state, tallennetaanko: action.payload }

        case 'YYYY':
        default:
            throw new Error("Action.type kentän arvoa ei tunnistettu");
    }
}
function AppChuckNorris() {

    //vitsidatan määrittely
    /* let vitsiData = {
        vitsit: [],
        
        tietoAlustettu: false
    } */

    //reducer alustus
    const [appData, dispatch] = useReducer(reducer, {
        vitsi: "",
        vitsit: [],
        vitsinNoutoAloitettu: false,
        vitsinNoutoEpäonnistui: false,
        haeUuttaDataa: false,
        tallennetaanko: false,
        tietoAlustettu: false
    });

    //vitsiTimer alustus
    const [vitsiTimer, setVitsiTimer] = useState(-1)


    //effectien alustus, suoritetaan renderöinnin eli return{...} sisällön rungon 
    //suoritus jälkeen
    useEffect(() => {

        //haetaan vitsidata
        let appdata = localStorage.getItem("appdata");

        if (appdata != null) { //local storage dataa löytyi

            console.log("Data luettu local storagesta")

            dispatch({ type: "ALUSTA_DATA", payload: (JSON.parse(appdata)) })
        } 
    }, []);


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

        if (vitsiTimer > -1) { //jos timer käynnissä
            clearTimeout(vitsiTimer)
        }


        //setVitsiTimer pitäis muuttaa siten, että se tulee kutsutuksi vain silloin kun on max
        //1 timer pyörimässä ettei voi monta timeria pyöriä yhtäaikaa->tarvitaanko sitä ehtoa?
        setVitsiTimer(setTimeout(() => {

            console.log("setTimeout laukee, noudetaan vitsi")
            dispatch({ type: 'NOUDA_VITSI' })
            //dispatch({ type: 'TALLENNA_VITSI'})

        }, 10000
        )
        )

        if (appData.haeUuttaDataa) { //haetaan vain kun uutta tietoa tilattu || ajastin lauennut
            haeDataa();
            if( appData.vitsi !== "" ) {
               dispatch({ type: 'TALLENNA_VITSI'})
            }
        }
        
        if( appData.tallennetaanko ) { //tallennus tila menossa, päivitetään vitsidata

            console.log("Vitsidata pitää tallentaa")
            console.log("Vitsi: ", appData.vitsi)
                 
            localStorage.setItem("appdata", JSON.stringify( appData ))
            dispatch({ type: "PAIVITA_TALLENNUSTILA", payload: false })
      
          }      

    }, [appData.haeUuttaDataa, appData.tallennetaanko]);

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