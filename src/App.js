import logo from './logo.svg';
import './App.css';
import { useState } from "react"
import Nappain from './Nappain';

let nappaimet = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "C", "+", "-", "*", "/", "="]
function App() {
  const [teksti, setTeksti] = useState("")  //          [a,b]

  //onko annettu jo aiemmin operaattori "+", "-", "*", "/"
  const [ekaOperaattori, setEkaOperaattori] = useState("")

  //tallettaa operandit1 ja 2
  const [operandi1, setOperandi1] = useState(0)
  const [operandi2, setOperandi2] = useState(false)

  const nappainPainettu = (x) => {

    if (x === "C") {
      setTeksti("")
      setEkaOperaattori("")
      setOperandi1(0)
      setOperandi2(0)
      return
    }
    else if (!isNaN(x)) { //jos syötetty nro
      console.log(x)

      if (ekaOperaattori !== "") {
        setOperandi2(true)
      }
    }
    else if (x === "+" ||
      x === "-" ||
      x === "*" ||
      x === "/") {

      if (teksti === "") { //jos ei ole aiemmin syötetty operaattoria 

        //tähän pitäisi huomioida myös se case, että syötetty operandi+operaattori, mutta tän perään tulee
        //taas operaattori syöte ->täs cases pitäis vanha operaattori korvata uusimmal painetulla

        if (ekaOperaattori === "") {
          setEkaOperaattori(x)
          setTeksti(eval("0") + x)
        }

        if (operandi1 === 0) { //operandi1 ei asetettu
          setOperandi1(eval(teksti.valueOf()))
          //console.log("operandi1: "+eval(teksti.valueOf()))    
        }

      }
      else { //jotain syötetty jo aiemmin, pitää laskea välitulos



        if (ekaOperaattori === "") {
          setEkaOperaattori(x)
          //console.log("isNan result: "+isNaN(x) + ", ekaoperaattori: "+ekaOperaattori)
        }

        console.log("isNan result: " + isNaN(x) + ", ekaoperaattori: " + ekaOperaattori +
          ", operandi2: " + operandi2)

        if (ekaOperaattori !== "" &&
          !operandi2) { //syötetty kaksi operaattoria peräkkäin, vain tuoreempi huomioidaan

          //teksti.charAt(teksti.length - 1 ) 
          //korvataan uusin syötetty operaattori vanhalla
          setTeksti(teksti.substring(0, teksti.length - 1) + x)
          setEkaOperaattori(x)
          setOperandi2(false)

          return
        }
        else {

          setTeksti(eval(teksti) + x)
          setEkaOperaattori(x)
          setOperandi2(false)

          return
          //setTeksti(teksti+x)  
        }

      }

    }
    else if (x === "=") {

      if (operandi2) {
        setEkaOperaattori("")
        setOperandi2(false)
        setTeksti(eval(teksti))
      }
      return
    }
    setTeksti(teksti + x)
  }
  return (
    <div>
      <p>{teksti}</p>

      {nappaimet.map((nappain, index) => <Nappain key={index} nappainPainettu={nappainPainettu} nappain={nappain} />)}
    </div>
  );
}

export default App;