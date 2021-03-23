import {useState} from 'react';

export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function(newMode, replace = false) {
    setMode(newMode);
    
    setHistory(prev => {
    
      if (replace) {
        prev[prev.length - 1] = newMode;
        return prev;
      }

      return [...prev, newMode];
    });
  };

  const back = function() {

    setHistory(prev => {

      if (prev.length === 1) return;

      const newHistory = [...prev];
      newHistory.pop();
      setMode(newHistory.slice(-1)[0]);
      return newHistory;
    });
  };

  return {mode, transition, back};
}