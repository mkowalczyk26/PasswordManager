import Axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import './PasswordChange.css'


function PasswordChange() {

    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const navigate = useNavigate()

    const checkMaster = async () => {
        const res = await Axios.post("http://localhost:3005/checkmaster", {input: password})
        if (res.data.match) {
            change()
        }
    }

    const change = async () => {
        if(newPassword.length >= 12) {
            const res = await Axios.post("http://localhost:3005/changemaster", {newPassword: newPassword})
            if (res.data.result == "success") {
                navigate('/dodaj')
            }
        }
    }

    return(
        <div className="passwordChangeWrapper">
            <h1>Zmień hasło główne</h1>
            <div className="passwordsInput">
                <input type="text" placeholder="Hasło główne" onChange={(event) => {
                    setPassword(event.target.value)
                }}></input>
                <input type="text" placeholder="Nowe hasło" onChange={(event) => {
                    setNewPassword(event.target.value)
                }}></input>
                <button onClick={checkMaster}>Zatwierdź</button>
            </div>
        </div>
    )
}

export default PasswordChange