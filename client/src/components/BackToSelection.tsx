import { NavLink } from 'react-router-dom';

type BackToSelectionProps = {
  text: string;
};

const BackToSelection: React.FC<BackToSelectionProps> = ({ text }) => {
  return (
    <NavLink className="back-to-selection-link" to="/selection">
      {text}
    </NavLink>
  );
};

export default BackToSelection;
