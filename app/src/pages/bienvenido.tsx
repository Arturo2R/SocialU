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
import styles from './bievenido.module.css'
import '@mantine/core/styles/Button.css';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Bienvenido() {
  const { loginWithMicrosoft } = useAuth();
  return (
    <div className={styles.gradient}>
      <Container size="xs" py={40} >
        <Title ta="center" >
          Bievenido a SocialU!
        </Title>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <p className='space-y-3'>
            <p>
              Somos una red social exclusiva para estudiantes de la Universidad del Norte, diseñada para fomentar la colaboración estudiantil de una manera única y dinámica.
            </p>
            <p>
              Tenemos <Link href="/sobre-nosotros" className="text-orange-400 underline">reglas de la comunidad</Link> que debes seguir.
              Para proteger tu privacidad, hemos establecido un <Link href="/privacidad" className='text-orange-400 underline'>estatuto de privacidad</Link> y <Link href="/terminos-y-condiciones" className='text-orange-400 underline'>términos y condiciones</Link> que te invitamos a revisar.
            </p>
            <p>
              Requerimos que inicies sesión con tu cuenta universitaria a través del proveedor de Microsoft para garantizar la autenticidad y seguridad de nuestros usuarios.
            </p>
            <p>
              Al continuar, aceptas nuestras políticas y condiciones
            </p>
          </p>
          <Button fullWidth onClick={loginWithMicrosoft} mt="xl" color='orange'>
            Iniciar Sesión
          </Button>
        </Paper>
      </Container>
    </div>
  );
}