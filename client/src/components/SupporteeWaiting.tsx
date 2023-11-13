import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, collections } from "../firebase/connection";
import { createSearchParams, useNavigate } from "react-router-dom";
import { getDocs, query, where } from "firebase/firestore";
import { assignSupportee } from "../helpers/chatFunctions";

const SupporteeWaiting: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const joinAsSupportee = async () => {
      try {
        const existingChatSnapshot = await getDocs(
          query(
            collections.chats,
            where('supporteeId', '==', user!.uid),
            where('status', '==', 'active')
          )
        );
        console.log(existingChatSnapshot);

        if (existingChatSnapshot.size > 0) {
          navigate({
            pathname: '/chat',
            search: createSearchParams({ chatId: existingChatSnapshot.docs[0].id }).toString()
          });
        } else {
          navigate({
            pathname: '/chat',
            search: createSearchParams({
              chatId: await assignSupportee(user!.uid, user!.displayName!)
            }).toString()
          });
        }
      } catch (e: unknown) {
        const error = e as { code: string };
        console.log(error);
      }
    };

    if(!loading) {
      if(!user) {
        navigate('/');
      } else {
        joinAsSupportee();
      }
    }
  }, [user, loading, navigate])
  
  return (
    <div className="supportee-waiting">
      <h3>אנחנו מאתרים עבורך תומך</h3>
      <p>נשימות עמוקות דרך הפה למשך 4 שניות עוזרות במיקוד הנשימה והרפיה של הגוף</p>
    </div>
  );
};

export default SupporteeWaiting;
