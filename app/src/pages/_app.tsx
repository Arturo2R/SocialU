import {  Notifications } from "@mantine/notifications";

import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";

import Head from "next/head";


import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import "../styles/globals.css";

import { MantineProvider, createTheme, MantineColorScheme } from '@mantine/core';
import { DataStateProvider } from "../context/DataStateContext";
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const theme = createTheme({
  /** Put your mantine theme override here */
});

  // Check that PostHog is client-side (used to handle Next.js SSR)
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      // Your code here
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
        opt_in_site_apps: true,
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        // Enable debug mode in development
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug()
        }
    })
  }, 0);
}

export default function App(props: AppProps & { colorScheme: MantineColorScheme }) {
  const { Component, pageProps } = props;
  const router = useRouter()

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog?.capture('$pageview')
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])


  

  return (
    <>
      <Head>
        <title>Social U</title>
      </Head>
      <PostHogProvider client={posthog}>
        <MantineProvider theme={theme}>
          <Notifications/>
            <AuthProvider>
              <DataStateProvider>
                <Component {...pageProps} />
              </DataStateProvider>
            </AuthProvider>
        </MantineProvider>
      </PostHogProvider>
    </>
  );
}

