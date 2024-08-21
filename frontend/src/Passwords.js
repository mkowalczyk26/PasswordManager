import './Passwords.css'
import Axios from "axios"
import { useEffect, useState } from "react"
import { Link, useLocation} from 'react-router-dom'


function Pass() {
    
    const [list, newList] = useState([])
    const [element, newElement] = useState('')
    const [match, newMatch] = useState('')
    const [pass, setPass] = useState('')
    const [masterPassword, setMasterPassword] = useState(false)
    const [status, setStatus] = useState('')

    const location = useLocation()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const param = params.get('status')
        if (param) {
            setStatus(param)
            if (param == 'aktywne') {
                setMasterPassword(true)
            }
        }
    }, [location])

    const checkMaster = async () => {
        const res = await Axios.post("http://localhost:3005/checkmaster", {input: pass})
        newMatch(res.data.match)
        if (res.data.match) {
            setTimeout(() => {
                newMatch(false)
            }, 60000)
        }
    }

    const decryptPassword = async (enc) => {
        const div = document.querySelector(`[id="${enc.id}"]`);
        const service = enc.service
        const response = await Axios.post("http://localhost:3005/decrypt", {encrypted: enc.password, iv: enc.iv});
        if (div.innerText == service) {
            div.innerText = response.data
            setTimeout(() => {
                div.innerText = service;
            }, 5000);
        }
    }
    
    useEffect(() => {
      Axios.get("http://localhost:3005/get").then((res) => {
        newList(res.data)
      })
    }, [])

return (
    <div className='passwordBox'>
        {masterPassword ? (
            <div className='passwordBox'>
                {!match ? (
                    <div className='passwordCheck'>
                        <h1>Potwierdź hasło główne</h1>
                        <input
                            type='password'
                            placeholder='Hasło główne'
                            value={pass}
                            onChange={(event) => { setPass(event.target.value); }}
                        />
                        <button onClick={checkMaster}>Sprawdź</button>

                    </div>
                ) : (
                    <div>
                        <h1>Sprawdź zapisane hasła</h1>
                        <input
                            className="searchBox"
                            type="text"
                            placeholder="Wyszukaj"
                            value={element}
                            onChange={(event) => { newElement(event.target.value); }}
                        />
                        <div className='list'>
                            {list.map((el) => {
                                if (element === '' || el.service.includes(element)) {
                                    return (
                                        <div
                                        className='listElement'
                                        id={el.id}
                                        key={el.id}
                                        onClick={() => {
                                          decryptPassword({
                                            service: el.service,
                                            password: el.password,
                                            iv: el.iv,
                                            id: el.id
                                          });
                                        }}>
                                            { el.service }
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <div className='noPassword'>
                <div className='reflectedParam'>
                    <h2>Hasło główne: </h2>
                    <h2>{status}</h2>
                </div>
                <h1>Dodaj hasło główne</h1>
                <Link className='passwordLink' to="/">Dodaj</Link>
            </div>
        )}
    </div>
);
}

export default Pass