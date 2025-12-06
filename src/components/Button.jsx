import PropTypes from 'prop-types';

export default function Button({onClick, className='', children}) {
  return (
    <button
      onClick={onClick}
      className={'flex-row items-center justify-center rounded-md px-5 py-3 mb-4 border bg-[#007AFF] border-[#007AFF] font-semibold text-lg tracking-wider text-white hover:cursor-pointer hover:bg-[#0061c9] ' + className}
    >{children}</button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string
}