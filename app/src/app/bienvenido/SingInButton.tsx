"use client"
import { Button } from '@mantine/core';
import { useAuthActions } from '@convex-dev/auth/react';

const SignInButton = () => {
      const { signIn: iniciarSesion } = useAuthActions()

      return (
            <Button fullWidth onClick={() => void iniciarSesion("microsoft-entra-id", { redirectTo: '/' })} mt="xl" color='orange'>
                  Iniciar Sesión
            </Button>
      );
}

export default SignInButton;