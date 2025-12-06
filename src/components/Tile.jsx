import PropTypes from 'prop-types';
import { NavLink } from 'react-router';

export default function Tile({ icon, label, href }) {
  return (  
    <div className='w-2/5 aspect-square border border-gray-200 rounded-sm bg-white hover:bg-gray-200'>
      <NavLink to={href} className='h-full w-full flex flex-col justify-center items-center'>
        <div className='h-2/3 w-2/3'>{icon}</div>
        <p className='text-xl mt-2'>{label}</p>
      </NavLink>
    </div>
  );
}

Tile.propTypes = {
  icon: PropTypes.object,
  label: PropTypes.string,
  href: PropTypes.string
};