import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import './styles/App.scss';
import { auth } from './firebase/connection';
import { Link } from 'react-router-dom';

function App() {
  const [user, loading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  if (loading) {
    return <p>Attempt to connect user</p>;
  }

  return user ? (
    <p>
      User logged in - <button onClick={signOut}>Logout</button>
    </p>
  ) : (
    <p>
      כל בני אדם נולדו בני חורין ושווים בערכם ובזכויותיהם You should{' '}
      <Link to="/signin">sign in</Link> or <Link to="/signup">sign up</Link>
    </p>
  );
}

export default App;
