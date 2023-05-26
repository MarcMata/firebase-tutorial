import { auth, googleProvider } from "../config/firebase-config";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import {useState} from "react";


export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    console.log(auth?.currentUser?.email)


    const signIn = async() => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Sign In Successful");
        } catch (error) {
            alert(error.message);
        }
    }

    const signInWithGoogle = async() => {
        try {
            await signInWithPopup(auth, googleProvider);
            alert("Sign In Successful");
        } catch (error) {
            alert(error.message);
        }
    }

    const signOut = async() => {
        try {
            await auth.signOut();
            alert("Sign Out Successful");
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div>
            <input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="password"  onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={signIn}>Sign In</button>

            <button onClick={signInWithGoogle}>Sign in with google</button>

            <button onClick={signOut}>Logout</button>
        </div>
    );
};

export default Auth;