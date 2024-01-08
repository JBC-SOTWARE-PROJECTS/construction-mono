import { useEffect, useState } from 'react';

const useSessionCookie = (): string => {
  const [sessionCookie, setSessionCookie] = useState<string>('');

  useEffect(() => {
    const getSessionCookie = () => {
      const cookies = document.cookie.split(';');
      console.log("document.cookie", document.cookie)
      let session = '';
      cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (name.trim() === 'SESSION') {
          session = decodeURIComponent(value);
        }
      });
      setSessionCookie(session);
    };

    getSessionCookie();
    console.log("getcookie", getCookie("SESSION"))
    
  }, []);

  function getCookie(cname : string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  
  return sessionCookie;
};

export default useSessionCookie;