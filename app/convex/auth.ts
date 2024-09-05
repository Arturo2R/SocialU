import { convexAuth } from "@convex-dev/auth/server";
import Microsoft from "@auth/core/providers/microsoft-entra-id";



export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Microsoft({
      clientId: '2d826c10-9e32-43fc-8aff-45c19400feba',
      clientSecret: 'E-j8Q~mLaOOgXyIFCG4t_ORCd8q5CBn2ComqQdl-',
    }),
  ],
});