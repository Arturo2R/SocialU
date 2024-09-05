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
import { auth } from "../firebase";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import * as React from 'react';
import { OAuthStrategy } from '@clerk/types';
import { useSignIn, useSignUp } from '@clerk/nextjs';


export default function Bienvenido() {
  const { signIn } = useSignIn();
  const { signUp, setActive } = useSignUp();

  if (!signIn || !signUp) return null;

  const signInWith = (strategy: OAuthStrategy) => {
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/',
    });
  };

  async function handleSignIn(strategy: OAuthStrategy) {
    if (!signIn || !signUp) return null;

    // If the user has an account in your application, but does not yet
    // have an OAuth account connected to it, you can transfer the OAuth
    // account to the existing user account.
    const userExistsButNeedsToSignIn =
      signUp.verifications.externalAccount.status === 'transferable' &&
      signUp.verifications.externalAccount.error?.code ===
        'external_account_exists';

    if (userExistsButNeedsToSignIn) {
      const res = await signIn.create({ transfer: true });

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        });
      }
    }

    // If the user has an OAuth account but does not yet
    // have an account in your app, you can create an account
    // for them using the OAuth information.
    const userNeedsToBeCreated =
      signIn.firstFactorVerification.status === 'transferable';

    if (userNeedsToBeCreated) {
      const res = await signUp.create({
        transfer: true,
      });

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        });
      }
    } else {
      // If the user has an account in your application
      // and has an OAuth account connected to it, you can sign them in.
      signInWith(strategy);
    }
  }




  const { loginWithMicrosoft, loading, effection } = useAuth();
  const router = useRouter();
  useEffect(() => {
    
    effection(true)
    // return () => {
    //   unsubuscribe()
    // }
  }, [auth])
  

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

          <Button fullWidth onClick={()=>signInWith("oauth_microsoft")} mt="xl" color='orange'>
            Iniciar Sesión
          </Button>
        </Paper>
      </Container>
    </div>
  );
}