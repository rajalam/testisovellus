import logo from './logo.svg';
import './App.css';
import { useState } from "react"

//nappaimet=["1","2"..."+","-","="]
function Nappain(props) {
    // const [teksti, setTeksti] = useState("")  //          [a,b]
    //  console.log("tila", tila)
    //tila = true  // setTila (false)
    return (

        <button onClick={() => props.nappainPainettu(props.nappain)}>{props.nappain}</button>
    );
}

export default Nappain;