
import {
    Paper,
    Title,
    Text,
    Container,
    List,
    ListItem,
    // LoadingOverlay,
  } from '@mantine/core';
  import '@mantine/core/styles/Button.css';
  import styles from '../../.pages/bievenido.module.css'
  import '@mantine/core/styles/Button.css';
  
  import * as React from 'react';

import Link from 'next/link';
import SignInButton from './SingInButton';
  
  
  export default function Bienvenido() {
    
  
    return (
      <div className={styles.gradient}>
        <Container size="xs" py={40} >
          <Title ta="center" >
            Bievenido a SocialU!
          </Title>
  
          <Paper withBorder shadow="md" p={30} mt={30} radius="md" >
          {/* <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "md", blur: 2 }} loaderProps={{ color: 'orange', type: 'bars' }} /> */}
            <Text fw="700">
              ¡Únete a nuestra red social exclusiva para estudiantes de la Universidad del Norte!
            </Text>
  

            <List spacing="xs" mt="xs">
              {/* <ListItem>Colabora con tus compañeros de una forma única y dinámica</ListItem> */}
              <ListItem>Para mantener la seguridad inicia sesión con tu cuenta universitaria de Microsoft.</ListItem>
              <ListItem>Sigue las <Link href="/sobre-nosotros" className="text-orange-400 underline">reglas de la comunidad</Link> para mantener un ambiente social seguro.</ListItem>
              <ListItem>Revisa nuestros <Link href="/privacidad" className='text-orange-400 underline'>políticas</Link> para proteger tu privacidad.</ListItem>
              <ListItem>Al continuar, estás aceptando nuestros <Link href="/terminos-y-condiciones" className='text-orange-400 underline'>términos y condiciones</Link>.</ListItem>
            </List>
  
            <SignInButton />     
          </Paper>
        </Container>
      </div>
    );
  }