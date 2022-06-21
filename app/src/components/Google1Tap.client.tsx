import Script from "next/script";
import { useEffect } from "react";
// import React, { useEffect } from "react";

type Props = {
  login: Function,
  user?: User
};

const Google1Tap = ({login, user}: Props,) => {

  useEffect(() => {
    // console.log("antesdel intervalor");
    // console.log("en el efecto", user);
    // console.log(user);
      // console.log("en el intervalor");
      globalThis?.window?.google?.accounts?.id?.initialize({
        client_id:
          "931771205523-v4jmgj8eu0cbuhqm4hep94q7lg3odpkm.apps.googleusercontent.com",
        callback: login,
        auto_select: true,
        itp_support: true,
        // skip_prompt_cookie: "localhost",
      });
      console.log("Tirado");
      globalThis?.window?.google?.accounts?.id?.prompt();
    // }
    // console.log("despues del intervalor");
    // }

    // return () => clearInterval(thatGoogle);
  }, [user]);
  return(<Script src="https://accounts.google.com/gsi/client" />);
};

export default Google1Tap
