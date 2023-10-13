import { FormEvent } from "react"
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/connection";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const navigate = useNavigate();
    const [
        createUserWithEmailAndPassword,
        user,
      ] = useCreateUserWithEmailAndPassword(auth);
      
    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);
        createUserWithEmailAndPassword(formData.get("email") as string, 
                                        formData.get("password") as string);
    }  

    if (user) {
        navigate("/");
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <h1>Sign Up</h1><br/>
            <p>Email</p><br/>
            <input type="email" name="email"/><br/>
            <p>Password</p><br/>
            <input type="password" name="password"/><br/>
            <button type="submit">Submit</button>
        </form>
    )
};

export default SignUpPage;