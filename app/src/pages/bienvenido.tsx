import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
  } from '@mantine/core';
  import '@mantine/core/styles/Button.css';
  
  export default function Bienvenido() {
    return (
      <Container size={420} my={40}>
        <Title ta="center" >
          Bievenido a SocialU!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Bienvenido{' '}
          <Anchor size="sm" component="button">
            Create account
          </Anchor>
        </Text>
  
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Email" placeholder="you@mantine.dev" required />
          <PasswordInput label="Password" placeholder="Your password" required mt="md" />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl">
            Iniciar Sesión
          </Button>
        </Paper>
      </Container>
    );
  }