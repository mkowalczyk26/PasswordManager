import './Home.css'
import Axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, Link } from 'react-router-dom'
const zxcvbn = require('zxcvbn')

function Home() {
    
    const [password, newPassword] = useState('')
    const [confirm, newConfirm] = useState('')
    const [masterPassword, setMasterPassword] = useState(false)

    let navigate = useNavigate()
    const changeRoute = () => {
        navigate('/dodaj')
    }


    const strength = (password) => {
        const st = document.getElementById('strength')
        const s = zxcvbn(password).score
        const bar1 = document.getElementById('bar1')
        const bar2 = document.getElementById('bar2')
        const bar3 = document.getElementById('bar3')
        const bar4 = document.getElementById('bar4')

        if (!password){
            st.innerText = ''
        } else {
            if (s == 0) {
                st.innerText = "bardzo słabe"
                bar1.style.backgroundColor = "white"
                bar2.style.backgroundColor = "white"
                bar3.style.backgroundColor = "white"
                bar4.style.backgroundColor = "white"
            } else if (s == 1){
                st.innerText = "słabe"
                bar1.style.backgroundColor = "red";
                bar2.style.backgroundColor = "white"
                bar3.style.backgroundColor = "white"
                bar4.style.backgroundColor = "white"
            } else if (s == 2) {
                st.innerText = "srednie"
                bar1.style.backgroundColor = "yellow"
                bar2.style.backgroundColor = "yellow"
                bar3.style.backgroundColor = "white"
                bar4.style.backgroundColor = "white"
            } else if (s == 3) {
                st.innerText = "silne"
                bar1.style.backgroundColor = "lightgreen"
                bar2.style.backgroundColor = "lightgreen"
                bar3.style.backgroundColor = "lightgreen"
                bar4.style.backgroundColor = "white"
            } else if (s == 4) {
                st.innerText = 'bardzo silne'
                bar1.style.backgroundColor = "green"
                bar2.style.backgroundColor = "green"
                bar3.style.backgroundColor = "green"
                bar4.style.backgroundColor = "green"
            }
        }
    }

    
    const checkPassword = async () => {
        const pass = await Axios.get("http://localhost:3005/getmaster").then((res) => {
            const isMasterPassword = res.data
            setMasterPassword(isMasterPassword)
        })
    }

    useEffect(() => {
        checkPassword()
    }, [])

    const savePassword = async () => {
        //console.log(password)
          if ((password.length >= 12) && (password == confirm) && (password.length < 64 )) {
            const res = await Axios.post("http://localhost:3005/setmaster", {password: password})
            changeRoute()
          }
      }

      function viewPassword (field) {
        const inp = document.getElementById(field)
        if(inp.type == "password") {
            inp.type = "text"
        } else {
            inp.type = "password"
        }
      }

    return(
    <div>
        <div className="masterPasswordForm">
            { masterPassword ? (
                <div className='passwordActive'>
                    <h1>Hasło główne jest aktywne</h1>
                    <Link className='changePassword' to="/zmienHaslo">Zmień hasło</Link>
                </div>
            ): (
                <div>
                    <h1>Stwórz hasło główne</h1>
                    <div className='passwordCreation'>
                    <div className='inputWrapper'>
                    <input type="password" id='main' placeholder="Hasło" onChange={(event) => {
                        setTimeout(() => {
                            newPassword(event.target.value);
                            strength(event.target.value);
                        }, 0);
                    }} onPaste={(event) => {
                        setTimeout(() => {
                            newPassword(event.target.value);
                            strength(event.target.value);
                        }, 0);
                        }}></input>
                    <button className='viewPassword' onClick={()=> viewPassword("main")}>
                        <span className="material-symbols-outlined">visibility</span>
                    </button>
                    </div>
                    <div className='strenghtWrapper'>
                    <div className='strenghtBar'>
                        <div className='bar' id='bar1'></div>
                        <div className='bar' id='bar2'></div>
                        <div className='bar' id='bar3'></div>
                        <div className='bar' id='bar4'></div>
                    </div>
                        <p id='strength'></p>
                    </div>
                    <div className='inputWrapper'>
                        <input type="password" id="confirm" placeholder="Potwierdź hasło" onChange={(event) => {
                            newConfirm(event.target.value)
                        }}></input>
                        <button className='viewPassword' onClick={()=> viewPassword("confirm")}>
                            <span className="material-symbols-outlined">visibility</span>
                        </button>
                    </div>
                    <button onClick={() => {
                        if(password == confirm) {
                            savePassword()
                        }
                    }}>Zatwierdź</button>
                    </div>
                </div>
            )}
        </div>
    </div>
    )
}

export default Home