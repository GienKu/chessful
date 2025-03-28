import { useEffect, useState } from 'react';

export const useAudio = (url: string): [() => void] => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const playSound = () => {
    audio.currentTime = 0;
    audio.play();
  };

  useEffect(() => {
    audio.addEventListener('ended', () => {
      audio.pause();
      audio.currentTime = 0;
    });
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playSound];
};
