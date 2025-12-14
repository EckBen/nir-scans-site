import PropTypes from 'prop-types';

export default function CardWithTitle({ children, title }) {
  return (
    <div className="w-full max-w-sm mt-6">
      <div className="bg-white shadow-md border border-gray-300 rounded px-3 pt-2 pb-8 mb-4">
        <h2 className='text-center text-2xl font-extrabold'>{title}</h2>

        {children}
      </div>
    </div>
  );
}

CardWithTitle.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string
}