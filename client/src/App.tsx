import { useAuthState } from 'react-firebase-hooks/auth';
import "./styles/variables.scss";
import './App.scss'
import { auth } from './firebase/connection';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <p>Attempt to connect user</p>
  }

  return user ? <p>User logged in</p> : <p>You should sign in</p>
}

export default App
