import { Title, Text, Blockquote, List, Code } from "@mantine/core"

// This file is required to use @next/mdx in the `app` directory.

export function useMDXComponents(components) {
  // Allows customizing built-in components, e.g. to add styling.
  return {
    h1: ({ children }) => <Title order={1} >{children}</Title>,
    h2: ({ children }) => <Title order={2} >{children}</Title>,
    h3: ({ children }) => <Title order={3} >{children}</Title>,
    h4: ({ children }) => <Title order={4} >{children}</Title>,
    h5: ({ children }) => <Title order={5} >{children}</Title>,
    h6: ({ children }) => <Title order={6} >{children}</Title>,
    blockquote: ({ children }) => <Blockquote  >{children}</Blockquote>,
    p: ({ children }) => <Text >{children}</Text>,
    ul: ({ children }) => <List >{children}</List>,
    ol: ({ children }) => <List type="ordered" >{children}</List>,
    li: ({ children }) => <List.Item >{children}</List.Item>,
    pre: ({ children }) => <Code block>{children}</Code>,
    // image: <Image maw={240} mx="auto" radius="md" src="./avatar.png" alt="Random image" />
    ...components,
  }
}
