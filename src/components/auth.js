import { auth } from "../config/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {useState} from "react";


export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const signIn = async() => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Sign In Successful");
        } catch (error) {
            alert(error.message);
        }
    }
    return (
        <div>
            <input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="password"  onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={signIn}>Sign In</button>
        </div>
    );
};

export default Auth;