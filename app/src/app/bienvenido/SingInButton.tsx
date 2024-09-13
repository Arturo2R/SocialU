"use client"
import { useAuth, useSignIn, useSignUp } from '@clerk/clerk-react';
import { Button } from '@mantine/core';
// import { useAuthActions } from '@convex-dev/auth/react';
import { OAuthStrategy } from '@clerk/types';

const SignInButton = () => {
      // const { signIn: iniciarSesion } = useAuthActions()
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
    
    
    
    
      // const { loginWithMicrosoft, loading, effection } = useAuth();
      // const router = useRouter();
      // useEffect(() => {
        
      //   effection(true)
      //   // return () => {
      //   //   unsubuscribe()
      //   // }
      // }, [auth])
      

      return (
            // <Button fullWidth onClick={() => void iniciarSesion("microsoft-entra-id", { redirectTo: '/' })} mt="xl" color='orange'>
            <Button fullWidth onClick={() => void handleSignIn("oauth_microsoft")} mt="xl" color='orange'>
                  Iniciar Sesión
            </Button>
      );
}

export default SignInButton;