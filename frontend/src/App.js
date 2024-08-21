import './App.css';
import { useEffect, useState } from 'react'
import Axios from 'axios'


function App() {
  const [service, newService] = useState('')
  const [password, newPassword] = useState('')
  const [masterPassword, setMasterPassword] = useState(false)


    
  const checkPassword = async () => {
      const pass = await Axios.get("http://localhost:3005/getmaster").then((res) => {
          const isMasterPassword = res.data
          setMasterPassword(isMasterPassword)
      })
  }
  
  useEffect(() => {
      checkPassword()
  }, [])



  const saveData = async () => {
    checkPassword()
    if ((service && password) && (password.length >= 12) && masterPassword){
      const res = await Axios.post("http://localhost:3005/", {service: service, password: password})
      console.log("data sent")
      console.log(res.data.result)
      document.getElementById('inp1').value = ''
      newService("")
      document.getElementById('inp2').value = ''
      newPassword("")
    } else {
      if (!service || !password){
        document.getElementById('message').innerText = "Pola nie mogą być puste"
        document.getElementById("inputNull").style.display = "block"
      } else if (!masterPassword) {
        document.getElementById('message').innerText = "Dodaj najpierw hasło główne"
        document.getElementById("inputNull").style.display = "block"
      } else {
        document.getElementById('message').innerText = "Hasło powinno mieć minimum 12 znaków"
        document.getElementById("inputNull").style.display = "block"
      }
    }
  }

  const modalVisibility = () => {
    const modal = document.getElementById("inputNull")
    if (modal.style.display == "none") {
      modal.style.display = "block"
    } else {
      modal.style.display = "none"
    }
  }

  return (
    <div className="App">
        <h1>Dodaj Usługę i Hasło</h1>
        <div id="passwordForm">
          <input id='inp1' type="text" placeholder="Nazwa usługi" onChange={(event) =>{
            newService(event.target.value)
          }}></input>
          <input id='inp2' type="password" placeholder="Hasło" onChange={(event) =>{
            newPassword(event.target.value)
          }}></input>
          <button onClick={saveData}>Dodaj</button>
        </div>
        <div id='inputNull'>
          <div className='modalInput'>
            <h1 id='message'>Pola nie mogą być puste</h1>
            <button onClick={modalVisibility}>Zamknij</button>
          </div>
        </div>
      </div>
  );
}

export default App;
