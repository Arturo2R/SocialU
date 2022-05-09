import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { getCookie, setCookies } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import React, { useState } from 'react';
import { AuthProvider } from '../context/AuthContext';
// import GlobalStyles from '../lib/globalStyles'
import '../styles/globals.css';
// import { allowedUniversities, emailDomainRegex } from "../hooks";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, {
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
  //   console.log("Tirado");
  //   globalThis?.window?.google?.accounts?.id?.prompt();
  // }, []);

  return (
    <>
      <Head>
        <title>Social U</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        {/* <link rel="shortcut icon" href="/favicon.svg" /> */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Script
        src="https://accounts.google.com/gsi/client"
      />
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <NotificationsProvider>
            <AuthProvider>
              {/* <GlobalStyles /> */}
              <Component {...pageProps} />
            </AuthProvider>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
});
