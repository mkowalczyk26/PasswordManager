import './Generator.css'

function Generator() {

    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '1234567890'
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const all = lowercase + uppercase + numbers + special

    const generate = (length = 16) => {
        const display = document.getElementById('passwordDiv')
        let password = ''
        password += lowercase[Math.floor(Math.random() * lowercase.length)]
        password += uppercase[Math.floor(Math.random() * uppercase.length)]
        password += numbers[Math.floor(Math.random() * numbers.length)]
        password += special[Math.floor(Math.random() * special.length)]

        for (let i = 4; i < length; i++) {
            password += all.charAt(Math.floor(Math.random() * all.length))
        }
        password = password.split('').sort(() => Math.random() - 0.5).join('')
        display.innerText = password
        
    }


    const copy = () => {
        const text = document.getElementById('passwordDiv').innerText
        navigator.clipboard.writeText(text)
    }


    return (
        <div className='wrapper'>
            <h1>Wygeneruj bezpieczne hasło</h1>
            <div className='passwordWrapper'>
                <div id='passwordDiv'></div>
                <button onClick={()=> copy()}>Skopiuj</button>
            </div>
            <button id='generateBtn' onClick={()=> generate()}>Generuj</button>
        </div>
    )
}

export default Generator