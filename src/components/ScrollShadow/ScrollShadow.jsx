import { useEffect } from 'react';
import PropTypes from 'prop-types';

import './ScrollShadow.css';

export default function ScrollShadow({ wrapperId, children }) {
  function handleScroll() {
    const content = document.querySelector('.content');
    const wrapper = document.querySelector(wrapperId);
    const shadowTop = document.querySelector('.shadow--top');
    const shadowBottom = document.querySelector('.shadow--bottom');
    const contentScrollHeight = content.scrollWidth - wrapper.offsetWidth;

    if (contentScrollHeight <= 0) {
      shadowTop.style.opacity = 0;
      shadowBottom.style.opacity = 0;
    } else {
      const currentScroll = content.scrollLeft / (contentScrollHeight);
      shadowTop.style.opacity = currentScroll;
      shadowBottom.style.opacity = 1 - currentScroll;
    }
  }
  
  useEffect(() => {
    handleScroll();
    const content = document.querySelector('.content');
    content.addEventListener('scroll', handleScroll);
    return () => {
      content.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <>
      <div className="shadow shadow--top"></div>
      <div className="shadow shadow--bottom"></div>
      <div className="content">{children}</div>
    </>
  );
}

ScrollShadow.propTypes = {
  wrapperId: PropTypes.string.isRequired,
  children: PropTypes.node
};