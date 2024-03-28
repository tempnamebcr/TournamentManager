import { useEffect } from 'react';

const useLink = (rel, href) => {
  useEffect(() => {
    const script = document.createElement('link');

    script.rel = rel;
    script.href = href;
    script.async = true;
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [href]);
};

export default useLink;
