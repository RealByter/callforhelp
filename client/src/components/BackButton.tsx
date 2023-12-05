import { NavLink } from 'react-router-dom';

type BackButtonProps = {
  to: string;
};

const BackButton: React.FC<BackButtonProps> = ({ to }) => {
  return (
    <div className='back-button'>
      <NavLink to={to} className="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="19"
          viewBox="0 0 11 19"
          fill="none">
          <path
            d="M9.48542 17.9706L1.00014 9.48535L9.48542 1.00007"
            stroke="#0E1C74"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </NavLink>
    </div>
  );
};

export default BackButton;
