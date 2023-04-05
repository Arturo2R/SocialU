import { Paper, TypographyStylesProvider } from '@mantine/core'
import React from 'react'
import SEO from '../SEO'
import Layout from './Layout'

type Props = {
  meta: {
    slug: string;
    description: string;
    image?: string;
    title: string;
  }
  children: React.ReactNode;
}

export const MDXLayout = ({meta,children}: Props) => {
  return (
    <Layout>
      <Paper p="md" shadow="sm" radius="md">
        <TypographyStylesProvider>
          {children}
        </TypographyStylesProvider>
        </Paper>
    </Layout>
  )
}
