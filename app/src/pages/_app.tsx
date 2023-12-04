import {  Notifications } from "@mantine/notifications";
// import { getCookie, setCookies } from "cookies-next";
// import { GetServerSidePropsContext } from "next";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import {getPerformance} from "firebase/performance"
// import GlobalStyles from '../lib/globalStyles'
import {app} from "../firebase"
// import { allowedUniversities, emailDomainRegex } from "../hooks";
import{ Analytics } from '@vercel/analytics/react'
import Head from "next/head";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "../styles/globals.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider, createTheme, MantineColorScheme } from '@mantine/core';
import { useFirestore } from "../hooks/useFirestore";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function App(props: AppProps & { colorScheme: MantineColorScheme }) {
  const { Component, pageProps } = props;
  // const {
    // data: liveData,
    // error: dataError,
    // postsLoading,
  //   fetchData,
  // } = useFirestore();

  useEffect(() => {
    // setIsLoading("loading");
    // fetchData()//.then(() => setIsLoading("loaded"));
    // return () => {
    // };
    // console.log("FECHEADO PAPA")
    getPerformance(app)    
  }, []);
  // const [colorScheme, setColorScheme] = useState<ColorScheme>(
  //   props.colorScheme
  // );

  // const toggleColorScheme = (value?: ColorScheme) => {
  //   const nextColorScheme =
  //     value || (colorScheme === "dark" ? "light" : "dark");
  //   setColorScheme(nextColorScheme);
  //   setCookies("mantine-color-scheme", nextColorScheme, {
  //     maxAge: 60 * 60 * 24 * 30,
  //   });
  // };

  // useEffect(() => {
  //   globalThis?.window?.google?.accounts?.id?.initialize({
  //     client_id:
  //       "931771205523-v4jmgj8eu0cbuhqm4hep94q7lg3odpkm.apps.googleusercontent.com",
  //     callback: console.log,
  //     auto_select: true,
  //   });
  //// console.log("Tirado");
  //   globalThis?.window?.google?.accounts?.id?.prompt();
  // }, []);

  

  return (
    <>
      <Head>
        <title>Social U</title>
      </Head>
      {/* <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      > */}
        <MantineProvider theme={theme}
          // withGlobalStyles
          // withNormalizeCSS
        >
          <Notifications/>

            <AuthProvider>
              {/* <GlobalStyles /> */}
              <Component {...pageProps} />
            </AuthProvider>
            <Analytics />
        </MantineProvider>
      {/* </ColorSchemeProvider> */}
    </>
  );
}

// App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
//   colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
// });
