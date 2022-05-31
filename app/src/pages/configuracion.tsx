import {
  Autocomplete,
  Group,
  NumberInput,
  Paper,
  Space,
  Switch,
  TextInput,
  Text,
  Title,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React,{FC, useState} from "react";
import Layout from "../components/Layout/Layout";
import Protected from "../components/Protected";
import { useAuth } from "../context/AuthContext";
// import { useStore } from "../store";

type Props = {};

const configuracion = (props: Props) => {
  // const { user } = useStore.getState();
  const [anonimo, setAnonimo]= useState<boolean>(false)


  const { resetPassword, user } = useAuth();

  const form = useForm({
    initialValues: {
      userName: user?.userName,
      email: user?.email,
      displayName: user?.displayName,
      semester: user?.semester,
      photoURL: user?.photoURL,
      career: user?.career,
      password: "",
      number: user?.phoneNumber,
    },
    // validate: {
    //   title: {
    //     minLength: 3,
    //     maxLength: 50,
    //   },
    //   message: {
    //     minLength: 3,
    //     maxLength: 200,
    //   },
    //   date: {},
    //   time: {},
    //   image: {},
    // },
  });

  console.log(user);

  return (
    <Protected.Route>
      <Layout>
        <Paper p="md" shadow="sm" radius="md">
          <Title>Configuración</Title>
          <form action=""><Stack>
            
              <Space h="md" />
              <Title order={2}>Perfil</Title>
              <TextInput
                label="Nombre De Usuario" // rightSections=""
                {...form.getInputProps("userName")}
              />
              <TextInput
                disabled
                label="Nombre" // rightSections=""
                {...form.getInputProps("displayName")}
              />
              <TextInput
                type="email"
                disabled
                label="Correo" // rightSections=""
                {...form.getInputProps("email")}
              />
              <TextInput
                // placeholder="klfsñjalks"
                type="password"
                label="Cambiar Contraseña" // rightSections=""
                {...form.getInputProps("password")}
              />
              <NumberInput
                // description="Se recalculara automaticamente"
                placeholder="3137864030"
                label="Número De Celular"
                min={1}
                max={12}
                {...form.getInputProps("number")}
              />
              <Autocomplete
                label="Tu Carrera"
                placeholder="Economía"
                data={[
                  "Economía",
                  "Ciencia De Datos",
                  "Medicina",
                  "Arquitectura",
                ]}
                {...form.getInputProps("career")}
              />
              <NumberInput
                placeholder="Semestre actual"
                description="Se recalculara automaticamente"
                label="Semestre"
                min={1}
                max={12}
                {...form.getInputProps("semester")}
              />
              <Space h="md" />
              <Title order={2}>Posts</Title>
              <SwitchConfiguration title="Anonimo Predeterminado"
               description="Publicar como anonimo predeterminadamente para los posts y los comentarios" 
               value={anonimo} 
               onChange={setAnonimo}
               />
            
          </Stack></form>
        </Paper>
      </Layout>
    </Protected.Route>
  );
};

export default configuracion;

interface SCF { 
  title: string; 
  description?: string; 
  value: boolean; 
  onChange: Function;
}

const SwitchConfiguration: FC<SCF> =({title, description, value, onChange})=> {
  return( <Group
    position="apart"
    // className={classes.item}
    noWrap
    spacing="xl"
  >
    <div>
      <Text className="font-medium">{title}</Text>
      {description && (

        <Text size="xs" color="dimmed">
        {description}
      </Text>
         )}
    </div>
    <Switch
      onLabel="ON"
      offLabel="OFF"
      checked={value}
      onChange={(e)=>onChange(e.currentTarget.checked)}
      // className={classes.switch}
      color="orange"
      size="lg" />
  </Group>);
}

