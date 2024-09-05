import type { Metadata } from "next";
import Link from "next/link";
import React from 'react';

// Authentication with clerk and db with Convex
import ConvexClientProvider from "../context/ConvexClientProvider";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { ClerkProvider } from "@clerk/nextjs";
// Custom Data Provider
import {UserStateProvider} from "@context/UserStateContext"
import {FeedStateProvider} from "@context/FeedContext"

// Posthog analytics for full app tracking and reports
import { PHProvider } from "@context/providers";
import PostHogPageView from "@components/PostHogPageView";

// Mantine Components
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from '@mantine/modals';
import {theme} from "@lib/theme";

// Styles from mantine, blocknote text editor and custom tailwind generated
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import "@blocknote/mantine/style.css";
import "../styles/globals.css";
import config from "@lib/config";

const conf = config()

export const metadata: Metadata = {
  title: {
    template: "%s | SocialU",
    default: 'SocialU App',

  },
  description: conf.description,
  appleWebApp: true,
  applicationName: conf.siteName,
  publisher: conf.publisher,
  creator: conf.creator,
  metadataBase: new URL(conf.url),
  twitter: {
    creator: "@_arturo2r",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: conf.siteName,
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="es">
        <head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
          <ColorSchemeScript />
        </head>
        <body>
          <PHProvider>
            <ConvexClientProvider>
              
            <ConvexQueryCacheProvider>
              <UserStateProvider>
                <FeedStateProvider>
                  <MantineProvider theme={theme}>
                    <ModalsProvider>
                        <PostHogPageView />
                        <Notifications />
                            {children}
                      </ModalsProvider>
                  </MantineProvider>
                </FeedStateProvider>
              </UserStateProvider>
            </ConvexQueryCacheProvider>
            </ConvexClientProvider>
          </PHProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}