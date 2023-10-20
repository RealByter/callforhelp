import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { auth } from './firebase/connection';
import { Link } from 'react-router-dom';
import Selection from './pages/Selection';

function App() {
  const [user, loading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  if (loading) {
    return <p>Attempt to connect user</p>;
  }

  // TODO - currently, if the user has a chat already - show him that chat 

  return user ? (
    <div>
      <Selection />
      {/*for now. delete in the future*/}
      <span style={{ position: 'absolute', bottom: "0", left: "0" }}>
        User logged in - <button onClick={signOut}>Logout</button>
      </span>
    </div>
  ) : (
      <p>
        כל בני אדם נולדו בני חורין ושווים בערכם ובזכויותיהם You should{' '}
        <Link to="/signin">sign in</Link> or <Link to="/signup">sign up</Link>
      </p>
    );
}

export default App;
