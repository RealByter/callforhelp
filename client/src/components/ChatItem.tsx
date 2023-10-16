type ChatItemProps = {
//   children: React.ReactNode;
//   onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ChatItem: React.FC<ChatItemProps> = () => {
  return (
    <div>
        <h2>שם מלא</h2>
        <h3>תגובה אחרוונה
            <span>00:00</span>
        </h3>
        <span>1</span>
        <span>^</span>
    </div>
  );
};

export default ChatItem;
