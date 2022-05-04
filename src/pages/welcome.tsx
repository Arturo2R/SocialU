import React, { useEffect, useState } from "react";
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Group,
  Divider,
  Space,
} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { googleHandler } from "../firebaseAuth.config";
import { cookies } from "cookies-next";
import { auth, letSignOut } from "../firebase";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { showNotification } from "@mantine/notifications";
import { Cross1Icon } from "@modulz/radix-icons";
import { useRouter } from "next/router";
import { deleteUser } from "firebase/auth";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: "100vh",
    // height: "100%",
    backgroundRepeat: "no-repeat",
    // backgroundSize: "" ,
    backgroundSize: "cover",
    backgroundClip: "content-box",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: "100vh",
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const emailDomainRegex = /([a-z]*)@([a-z]*.[a-z]*.[a-z]*)/gm;

const allowedUniversities = [
  { name: "Universidad Del Norte", domain: "uninorte.edu.co" },
];

function AuthenticationPage() {
  const router = useRouter();

  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  let thisUser = auth.currentUser;

  const { classes } = useStyles();
  const [allowed, setAllowed] = useState<string>("unset");

  useEffect(() => {
    console.log("EL usuario cambio a" + allowed);
  }, [user]);

  // Validar si el usuario hace parte de una universidad
  const validationOfMembership = (email: string): boolean => {
    let validated: boolean = false;

    const emailDomain: string[] = emailDomainRegex.exec(email) || [
      "lalama.com",
      "lalalama.com",
      "lalama.com",
    ];
    console.log("=========");

    console.log(emailDomain);

    validated = allowedUniversities.some((item) => {
      return item.domain === emailDomain[2];
    });

    console.log(validated);
    console.log("---------");

    return validated;
  };

  const handleGoogletication = async () => {
    signInWithGoogle();
  };

  useEffect(() => {
    if (user) {
      console.log(user.user.email);
      let valid = validationOfMembership(user.user.email) ? "yes" : "no";
      setAllowed(valid);
      // allowed === false ? signOut() : console.log(allowed);
      console.log("allowed state is " + allowed);
    }
  }, [thisUser]);

  useEffect(() => {
    if (allowed === "yes") {
      router.push("/");

      showNotification({
        id: "welcome",
        disallowClose: true,
        onClose: () => console.log("unmounted"),
        onOpen: () => console.log("mounted"),
        autoClose: 5000,
        title: "Bienvenido",
        message: "Bienvenido a la aplicación",
        color: "orange",
        className: "my-notification-class",
        style: {},
        sx: {},
        loading: false,
      });
    }
    if (allowed === "no") {
      // signOut();

      deleteUser(thisUser)
        .then(() => {
          console.log("Deleted el caremonda");
        })
        .catch((error) => {
          // An error ocurred
          // ...
        });

      showNotification({
        id: "hello-there",
        disallowClose: true,
        onClose: () => console.log("unmounted"),
        onOpen: () => console.log("mounted"),
        autoClose: 5000,
        title: "No Estas Permitido",
        message:
          "No estas usando un correo universtario de una de nuestras universidades permitidas",
        color: "red",
        icon: <Cross1Icon />,
        className: "my-notification-class",
        style: {},
        sx: {},
        loading: false,
      });
    }
  }, [allowed]);

  // const handleCallback = (user) => console.log(user);

  // function handleCredentialResponse(response) {
  //   console.log("Encoded JWT ID token: " + response.credential);
  //   const allCookies = cookies(ctx);
  //   console.log(allCookies);
  // }

  // window.onload = function () {
  //   google.accounts.id.initialize({
  //     client_id: "YOUR_GOOGLE_CLIENT_ID",
  //     callback: handleCredentialResponse,
  //   });
  //   google.accounts.id.renderButton(
  //     document.getElementById("buttonDiv"),
  //     { theme: "outline", size: "large" } // customization attributes
  //   );
  //   google.accounts.id.prompt(); // also display the One Tap dialog
  // };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Group>
          <Image src="/logologo.svg" width={50} height={50} />
          <Title>SocialU</Title>
        </Group>

        <Space h="md" />

        <Title order={2} className={classes.title} mt="md" mb={10}>
          Bienvenido
        </Title>
        <Text mb={25}>La red social que te conecta en la universidad</Text>

        <Group grow mb="md" mt="md">
          {/* <div
            className="g_id_signin"
            data-type="standard"
            data-shape="rectangular"
            data-theme="outline"
            data-text="$ {button.text}"
            data-size="large"
            data-callback="handleCredentialResponse"
            data-locale="es-419"
            data-logo_alignment="left"
          ></div>
          <div id="button-div"></div> */}

          <Button onClick={handleGoogletication} radius="xl">
            Google
          </Button>

          {/* <GoogleButton radius="xl">Google</GoogleButton>
          <TwitterButton radius="xl">Twitter</TwitterButton> */}
        </Group>
        <Divider
          label="O continua con tu correo universitario"
          labelPosition="center"
          my="lg"
        />
        <TextInput
          label="Correo universitario"
          placeholder="hello@uninorte.edu.co"
          size="md"
        />
        <PasswordInput
          label="Contraseña"
          placeholder="Tu contraseña"
          mt="md"
          size="md"
        />
        {/* <Checkbox label="Keep me logged in" mt="xl" size="md" /> */}

        <Anchor component={Link} href="/">
          <Button color="orange" fullWidth mt="xl" size="md">
            Iniciar Sesión
          </Button>
        </Anchor>

        <Text align="center" mt="md">
          No tienes una cuenta?{" "}
          <Anchor<"a">
            color="orange"
            href="#"
            weight={700}
            onClick={(event) => event.preventDefault()}
          >
            Registrate
          </Anchor>
        </Text>
        <Space h="xl" />
        <Text align="center" lineClamp={3}>
          Si continuas aceptas los{" "}
          <Anchor color="orange" weight={700} component={Link} href="/terminos">
            Terminos De Servicio
          </Anchor>{" "}
          de SocialU y confirmas que has leído nuestra{" "}
          <Anchor className="mt-4" component={Link} href="/privacidad">
            Política de privacidad
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}

export default AuthenticationPage;
