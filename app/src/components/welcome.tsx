import {
  Anchor, Button, createStyles, Divider, Group, Image, Paper, PasswordInput, Space, Text, TextInput, Title
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { X } from "tabler-icons-react";
// import Image from 'next/image';
import { useAuth } from "../context/AuthContext";

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

function AuthenticationPage() {
  const { loginWithGoogle, login, valid, logout, loginWithMicrosoft } = useAuth();

  const { classes } = useStyles();

  const [form, setForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  

  const handleGoogletication = async () => {
    loginWithMicrosoft();
  };

  const handleLogin = () => {
    login(form.email, form.password);
  };

  const router = useRouter();

  useEffect(() => {
 // console.log("valid cambió a ", valid);
    if (valid === true) {
   // console.log("is valid");
      router.push("/");
      notifications.show({
        id: "welcome",
        
        autoClose: 5000,
        title: "Bienvenido",
        message: "Bienvenido a la aplicación",
        color: "orange",
        className: "my-notification-class",
      });
    }
    if (valid === false) {
      logout();
      notifications.show({
        id: "get-out",
        autoClose: false,
        title: "No Estas Permitido",
        message:
          "No estas usando un correo universtario de una de nuestras universidades permitidas",
        color: "red",
        icon: <X/>,
        // className: "my-notification-class",
      });
    }
  }, [valid]);


  // const handleChange = (e) => {
  //   setForm({...Form, email: e.target.value, password: e.target.value})
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

          <Button color="orange" onClick={handleGoogletication} radius="xl">
            Cuenta Microsoft
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
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <PasswordInput
          label="Contraseña"
          placeholder="Tu contraseña"
          mt="md"
          size="md"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {/* <Checkbox label="Keep me logged in" mt="xl" size="md" /> */}

        {/* <Anchor component={Link} href="/"> */}
        <Button
          color="blue"
          onClick={handleLogin}
          fullWidth
          mt="xl"
          size="md"
        >
          Iniciar Sesión
        </Button>
        {/* </Anchor> */}

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
