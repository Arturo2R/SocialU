import React, { useEffect } from "react";

// Next.js utilities for routing and page props
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import Head from "next/head";

// Mantine app provider theme and notifications
import { MantineProvider, createTheme, MantineColorScheme } from '@mantine/core';
import { Notifications } from "@mantine/notifications";

// React Context Providers for state management, will be deleted
import { DataStateProvider } from "@context/DataStateContext";
import { AuthProvider } from "@context/AuthContext";

// Posthog analytics for full app tracking and reports
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { POSTHOG_HOST_URL } from "../constants";
import { useReportWebVitals } from "next/web-vitals";

// Authentication with clerk and db with Convex
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";

// Styles from mantine, blocknote text editor and custom tailwind generated
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import "@blocknote/mantine/style.css";
import "../styles/globals.css";
import { env } from "process";


const theme = createTheme({
  white: "#F2F5FF",
  // fontSizes: {
  //   xs: rem(14),
  //   sm: rem(16),
  //   md: rem(18),
  //   lg: rem(20),
  //   xl: rem(22),
  // },

  fontSizes: {}
  /** Put your mantine theme override here */
});

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== 'undefined') {
  setTimeout(() => {
    // Your code here
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
      opt_in_site_apps: true,
      api_host: POSTHOG_HOST_URL,
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

  // const posthog = usePostHog()
  useReportWebVitals((metric) => {
    posthog.capture(metric.name, metric)
    console.log(metric)
  })

  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)

  return (
    <>
      <Head>
        <title>Social U</title>
      </Head>

          <PostHogProvider client={posthog}>
            <MantineProvider theme={theme}>
              <AuthProvider>
                <DataStateProvider>
                  <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
                    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                      <ConvexQueryCacheProvider debug>
                        <Notifications />
                         <Component {...pageProps} />
                      </ConvexQueryCacheProvider>
                    </ConvexProviderWithClerk>
                  </ClerkProvider>
                </DataStateProvider>
              </AuthProvider>
            </MantineProvider>
          </PostHogProvider>
    </>
  );
}

