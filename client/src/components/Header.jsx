import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";

export default function Header () {
    const {setUserInfo, userInfo} = useContext(UserContext);

    useEffect(() => {
      fetch('http://localhost:4000/profile', {
        credentials: 'include',
      }).then(response => {
        response.json().then(userInfo => {
          setUserInfo(userInfo);
        });
      });
    }, [setUserInfo]);

  
    function logout() {
        fetch('http://localhost:4000/logout', {
          credentials: 'include',
          method: 'POST',
        });
        setUserInfo(null);
    }

    return (
        <header>
            <Link to="/" className="logo">My Blog</Link>
            <nav>
                { userInfo?.username && (
                    <>
                        <Link to="/create">Create new post</Link>
                        <a href="/" onClick={logout}>Logout</a>
                    </>
                ) }
                {!userInfo?.username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/Register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}