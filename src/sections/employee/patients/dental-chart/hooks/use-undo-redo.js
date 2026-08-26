import { useRef, useState, useCallback } from 'react';

const MAX_HISTORY = 50;

export default function useUndoRedo(initialState) {
  const [state, setStateRaw] = useState(initialState);
  const past = useRef([]); // array of previous states
  const future = useRef([]); // array of undone states

  const setState = useCallback((newState, skipHistory = false) => {
    setStateRaw((prev) => {
      const next = typeof newState === 'function' ? newState(prev) : newState;

      if (!skipHistory) {
        past.current = [...past.current.slice(-MAX_HISTORY), prev];
        future.current = [];
      }

      return next;
    });
  }, []);

  const undo = useCallback(() => {
    if (past.current.length === 0) return;
    setStateRaw((current) => {
      const previous = past.current[past.current.length - 1];
      past.current = past.current.slice(0, -1);
      future.current = [current, ...future.current.slice(0, MAX_HISTORY - 1)];
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    if (future.current.length === 0) return;
    setStateRaw((current) => {
      const next = future.current[0];
      future.current = future.current.slice(1);
      past.current = [...past.current.slice(-MAX_HISTORY), current];
      return next;
    });
  }, []);

  const canUndo = past.current.length > 0;
  const canRedo = future.current.length > 0;

  const resetHistory = useCallback((newState) => {
    past.current = [];
    future.current = [];
    setStateRaw(newState);
  }, []);

  return { state, setState, undo, redo, canUndo, canRedo, resetHistory };
}
