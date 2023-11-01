import { limit, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collections } from '../firebase/connection';

type FindAdditionalSupporteeProps = {
  findAdditionalSupportee: () => void;
  disabled: boolean;
  userId?: string;
};

const FindAdditionalSupportee: React.FC<FindAdditionalSupporteeProps> = ({
  findAdditionalSupportee,
  disabled,
  userId
}) => {
  const [openSearch, loadingOpenSearch] = useCollection(
    query(
      collections.chats,
      where('supporterId', '==', userId || 'empty'),
      where('supporteeId', '==', null),
      where('status', '==', 'active'),
      limit(1)
    )
  );

  return (
    <button
      onClick={findAdditionalSupportee}
      disabled={disabled || !userId || loadingOpenSearch || !!openSearch?.size}>
      מצא נתמך נוסף
    </button>
  );
};

export default FindAdditionalSupportee;
