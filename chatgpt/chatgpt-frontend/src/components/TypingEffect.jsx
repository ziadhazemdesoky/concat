// src/components/TypingEffect.js

import React, { useEffect, useState } from 'react';

const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
 
  useEffect(() => {
      let currentIndex = 0;
      
    setDisplayedText(''); // Reset displayedText when text changes

    const interval = setInterval(() => {
      if (currentIndex < text.length - 1) {
        if(currentIndex == 0)
            setDisplayedText(prev => prev + text[currentIndex]);
        setDisplayedText(prev => prev + text[currentIndex]);
        currentIndex++;
        console.log(text, displayedText, currentIndex);
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default TypingEffect;
