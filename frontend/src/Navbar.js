import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import Axios from 'axios'

const Navbar = () => {

    const navigate = useNavigate()

    const checkPassword = () => {
        Axios.get("http://localhost:3005/getmaster").then((res)=> {
            const isMasterPassword = res.data
            if(isMasterPassword == true){
                navigate(`/hasla?status=aktywne`)
            } else {
                navigate(`/hasla?status=nieaktywne`)
            }
        })
        }

    return (
        <nav className="navbar">
            <div className="navbarLinks">
                <div>
                    <Link to="/" className="navbar-link">Home</Link>
                </div>
                <div>
                    <Link to="/dodaj" className="navbar-link">Dodaj</Link>
                </div>
                <div>
                    <Link onClick={checkPassword} className="navbar-link">Hasła</Link>
                </div>
                <div>
                    <Link to="/generator" className="navbar-link">Generator</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

