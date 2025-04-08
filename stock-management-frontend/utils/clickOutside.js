import { useEffect, useRef } from "react";

/**
 * Custom hook to detect clicks outside a given element
 * @param {function} onClose - Function to call when outside click is detected
 */
const useClickOutside = (onClose) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return ref;
};

export default useClickOutside;
