import { useEffect, useState } from "react";

export function useMobileView(): boolean {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth < 650) {
      setIsMobileView(true);
    } else {
      setIsMobileView(false);
    }
  }, [window.innerWidth, window.innerHeight]);

  return isMobileView;
}
