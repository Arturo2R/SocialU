import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider
} from "@mantine/core";
import {  Notifications } from "@mantine/notifications";
import { getCookie, setCookies } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import { AuthProvider } from "../context/AuthContext";
// import GlobalStyles from '../lib/globalStyles'
import "../styles/globals.css";
// import { allowedUniversities, emailDomainRegex } from "../hooks";
import{ Analytics } from '@vercel/analytics/react'

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookies("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

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
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <Notifications/>

            <AuthProvider>
              {/* <GlobalStyles /> */}
              <Component {...pageProps} />
            </AuthProvider>
            <Analytics />
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});
