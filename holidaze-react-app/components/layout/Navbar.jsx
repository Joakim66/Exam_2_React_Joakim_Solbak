import Link from 'next/link'
import { useRouter } from 'next/router'

import { useEffect } from 'react'
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
    const [auth, setAuth] = useContext(AuthContext);

    const router = useRouter()
    
    function logout(){
        if (confirm('Are you sure you want to logout?')) {
            setAuth(null)
            router.push("/")
          } 
    }

    return(
        <nav className="navbar-primary">
            <div className="container">
                <div className="navbar-primary__home">
                    <Link href="/"><a>Home</a></Link>
                </div>
                <div className="navbar-primary__links">
                    {auth ? (
                        <>
                            <Link href="/admin"><a>Admin</a></Link>
                            <button onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <Link href="/login"><a>Login</a></Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;