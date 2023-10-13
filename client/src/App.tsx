import { useAuthState } from 'react-firebase-hooks/auth';
import "./styles/variables.scss";
import './App.scss'
import { auth } from './firebase/connection';
import { Link } from 'react-router-dom';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <p>Attempt to connect user</p>
  }

  return user ? 
  <p>User logged in</p> : 
  <p>You should <Link to="/signin">sign in</Link> or <Link to="/signup">sign up</Link></p>
}

export default App
