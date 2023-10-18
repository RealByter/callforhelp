import Button from './Button';
import Paragraph from './Paragraph';

type ChoiceProps = {
  paragraphText: string;
  buttonText: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const Choice: React.FC<ChoiceProps> = ({ paragraphText, buttonText, onClick }) => {
  return (
    <div className='choice'>
      <Paragraph>{paragraphText}</Paragraph>
      <Button onClick={onClick}>{buttonText}</Button>
    </div>
  );
};

export default Choice;
