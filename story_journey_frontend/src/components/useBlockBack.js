import { useEffect } from "react";

const useBlockBack = (condition) => {
  useEffect(() => {
    if (condition) {
      const handlePopState = (event) => {
        window.history.pushState(null, null, window.location.pathname);
      };

      window.history.pushState(null, null, window.location.pathname);
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [condition]);
};

export default useBlockBack;
