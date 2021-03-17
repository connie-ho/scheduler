import {useState} from 'react';

export default function useVisualMode (initial){

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function(newMode, replace=false) {
    setMode(newMode);
    
    if (replace) {
      history[history.length - 1] = newMode;
      return;
    }
    
    setHistory(prev => [...prev, newMode])
  }

  const back = function() {
    
    if (history.length === 1) return;

    history.pop();
    setHistory([...history]);
    setMode(history.pop());
  }

  return {mode, transition, back};
}