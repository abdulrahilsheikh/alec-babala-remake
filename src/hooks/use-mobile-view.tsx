import { useLayoutEffect, useState } from "react";

export function useMobileView(): boolean {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 650);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobileView;
}
