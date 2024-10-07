'use client'
import { Box, Button, Code, Group, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import  { useState } from 'react'
import QRCode from "react-qr-code";
import '@mantine/code-highlight/styles.css';
import { CodeHighlight } from '@mantine/code-highlight';
import { createClient } from '@vercel/kv';

type Props = {}

const Holi = (props: Props) => {
  console.log("seconddddd", process.env.NEXT_PUBLIC_SECONDKV_REST_API_URL)
        console.log("seconddddd", process.env.NEXT_PUBLIC_SECONDKV_REST_API_TOKEN)
  const kv = createClient({
    url: process.env.NEXT_PUBLIC_SECONDKV_REST_API_URL || "",
    token: process.env.NEXT_PUBLIC_SECONDKV_REST_API_TOKEN || "",
  });
  const [finishedUrl, setFinishedUrl] = useState('')
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      original_url: '',
      utm_source: 'social',
      utm_medium: 'instagram',
      utm_campaign: '',
      utm_content: '',
      redirect_url: '',
    },

  });

  return (
    <Box maw={680} mx="auto" py={60}>
        <Code>
          {`${form.values.original_url}?utm_medium=${form.values.utm_medium}${form.values.utm_source ? '&utm_source='+form.values.utm_source:""}&utm_campaign=${form.values.utm_campaign}${form.values.utm_content ? '&utm_content='+form.values.utm_content:''}`}
        </Code>
    <Box maw={340} mx="auto">

      <form 
        onSubmit={form.onSubmit((values) => {
          const url = `${values.original_url}?utm_medium=${values.utm_medium}${values.utm_source ? '&utm_source='+values.utm_source:""}&utm_campaign=${values.utm_campaign}${values.utm_content ? '&utm_content='+values.utm_content:''}`
          kv.set(values.redirect_url, url)
          setFinishedUrl('https://redsocialu.com/r/'+values.redirect_url)
        })}
      >


        <TextInput
          withAsterisk
          required
          label="Original URL"
          placeholder="/anonimo/dfakjsd"
          {...form.getInputProps('original_url')}
        />

        <TextInput
          label="UTM Source"
          placeholder="social"
          {...form.getInputProps('utm_source')}
        />

        <TextInput
          withAsterisk
          required
          label="UTM Medium"
          placeholder="instagram"
          {...form.getInputProps('utm_medium')}
        />
        <TextInput
          withAsterisk
          required
          label="UTM Campaign"
          placeholder="summer-sale"
          {...form.getInputProps('utm_campaign')}
        />
        <TextInput
          label="UTM Content"
          placeholder="image-2"
          {...form.getInputProps('utm_content')}
        />

        <TextInput
          withAsterisk
          required
          label="Redirect URL"
          placeholder="Afde3d"
          {...form.getInputProps('redirect_url')}
        />


        <Group justify="flex-end" mt="md">
          <Button color='indigo' type="submit">Crear Redirect</Button>
        </Group>
      </form>
      {finishedUrl && (
        <>
        <Text>
          Finished Url
        </Text>
        <QRCode value={finishedUrl} />
        <CodeHighlight
        code={finishedUrl}
        language="tsx"
        withCopyButton={false}
        mt="md"
        />
        </>
      )}
      </Box>
    </Box>
  );
}

export default Holi