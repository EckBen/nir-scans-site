import PropTypes from 'prop-types';

export default function Button({onClick, variant='normal', className='', children}) {
  let variantStyles;
  switch (variant) {
    case 'normal':
      variantStyles = 'flex-row items-center justify-center rounded-md px-5 py-3 mb-4 border bg-[#007AFF] border-[#007AFF] font-semibold text-lg tracking-wider text-white hover:cursor-pointer hover:bg-[#0061c9]';
      break;
    case 'small':
      variantStyles = 'flex-row items-center justify-center rounded-sm px-3 py-1 border bg-[#007AFF] border-[#007AFF] font-semibold text-md text-white hover:cursor-pointer hover:bg-[#0061c9]';
      break;
    case 'anchor':
      variantStyles = 'font-semibold text-md underline text-blue-500 hover:text-blue-700 hover:cursor-pointer';
      break;
    default:
      variantStyles = '';
      break;
  }
  
  return (
    <button
      onClick={onClick}
      className={variantStyles + ' ' + className}
    >{children}</button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.string,
}