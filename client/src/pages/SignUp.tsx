const SignUpPage: React.FC = () => {
    return (
        <form>
            <p>Email</p><br/>
            <input type="email"/><br/>
            <p>Password</p><br/>
            <input type="password"/><br/>
            <button type="submit">Submit</button>
        </form>
    )
};

export default SignUpPage;