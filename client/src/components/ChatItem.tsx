import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

type ChatItemProps = {
//   children: React.ReactNode;
//   onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ChatItem: React.FC<ChatItemProps> = () => {
  return (
    <div className='chat-item'>
        <div className='content'>
            <span className='name' >שם מלא</span>
            <span className='last-message'>תגובה אחרונה <span>00:00</span>
            </span>
        </div>

        <div className='rest'>
            <span className='unread-messages'>1</span>
            <KeyboardArrowLeftIcon />
        </div>
    </div>
  );
};

export default ChatItem;
