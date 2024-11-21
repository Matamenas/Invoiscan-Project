import { getAuth, onAuthStateChanged} from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import "./App.css";
import { app } from "./firebase";

export default function Home () {
    const navigate = useNavigate();
    const [user, setUser] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
            console.log(user);
            if (!user) {
                navigate("/login");
            }
            setUser(!!user);
        });

        return () => {
            unsubscribe();
        };
    }, [user, setUser, navigate]);

    function handleClick() {
        const auth = getAuth(app);
        auth.signOut();
    }
    console.log(user);

    return (
        <div>
            <h1>Welcome</h1>
           <button onClick={handleClick}>Sign Out</button>
        </div>
    )
}