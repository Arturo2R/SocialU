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
  List,
  LoadingOverlay,
} from '@mantine/core';
import '@mantine/core/styles/Button.css';
import styles from './bievenido.module.css'
import '@mantine/core/styles/Button.css';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Bienvenido() {
  const { loginWithMicrosoft, loading } = useAuth();
  return (
    <div className={styles.gradient}>
      <Container size="xs" py={40} >
        <Title ta="center" >
          Bievenido a SocialU!
        </Title>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md" >
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "md", blur: 2 }} loaderProps={{ color: 'orange', type: 'bars' }} />
          <Text fw="700">
            ¡Únete a nuestra red social exclusiva para estudiantes de la Universidad del Norte!
          </Text>


          <List spacing="xs" mt="xs">
            {/* <List.Item>Colabora con tus compañeros de una forma única y dinámica</List.Item> */}
            <List.Item>Para mantener la seguridad inicia sesión con tu cuenta universitaria de Microsoft.</List.Item>
            <List.Item>Sigue las <Link href="/sobre-nosotros" className="text-orange-400 underline">reglas de la comunidad</Link> para mantener un ambiente social seguro.</List.Item>
            <List.Item>Revisa nuestros <Link href="/privacidad" className='text-orange-400 underline'>políticas</Link> para proteger tu privacidad.</List.Item>
            <List.Item>Al continuar, estás aceptando nuestros <Link href="/terminos-y-condiciones" className='text-orange-400 underline'>términos y condiciones</Link>.</List.Item>
          </List>

          <Button fullWidth onClick={loginWithMicrosoft} mt="xl" color='orange'>
            Iniciar Sesión
          </Button>
        </Paper>
      </Container>
    </div>
  );
}