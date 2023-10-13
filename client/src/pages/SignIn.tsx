import { FormEvent } from "react"
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/connection";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
    const navigate = useNavigate();
    const [
        signInWithEmailAndPassword,
        user,
      ] = useSignInWithEmailAndPassword(auth);
      
    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        signInWithEmailAndPassword(formData.get("email") as string, 
                                        formData.get("password") as string);
    }  

    if (user) {
        navigate("/");
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <p>Email</p><br/>
            <input type="email" name="email"/><br/>
            <p>Password</p><br/>
            <input type="password" name="password"/><br/>
            <button type="submit">Submit</button>
        </form>
    )
};

export default SignInPage;