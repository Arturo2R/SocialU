import {
    Autocomplete, Button, Group,
    NumberInput,
    Paper,
    Space, Stack, Switch, Text, TextInput, Title
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { FC, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/AuthContext";
import { useFirestore } from "../hooks/useFirestore";
// import { useStore } from "../store";

type Props = {};

const configuracion = (props: Props) => {
  // const { user } = useStore.getState();
  const [anonimo, setAnonimo]= useState<boolean>(false)
  const [useUserName, setuseUserName] = useState<boolean>(false)

  const { resetPassword, user, setUser} = useAuth();
  const {updateProfile: updateFirestoreProfile, updatingProfile} = useFirestore()

  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm({
    initialValues: {
      userName: user?.userName ,
      email: user?.email,
      displayName: user?.displayName,
      semester: user?.semester || "",
      photoURL: user?.photoURL,
      career: user?.career ||"",
      // password: "",
      phoneNumber: user?.phoneNumber || "",
      anonimoDefault: user?.configuration?.anonimoDefault || false, 
      useUserName: user?.configuration?.useUserName  || false,
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

  const saveConfiguration = (configurationData: any) => {
    if(user?.uid){
   // console.log("disparado")
      setLoading(true)
      updateFirestoreProfile(user.uid,configurationData, user, setUser).then(()=>showNotification({
        id: "created-post",
        disallowClose: true,
        autoClose: 4000,
        title: "Perfil Actualizado",
        message: "El perfil ha sido actualizado exitosamente",
        color: "orange",
        className: "my-notification-class",
        // icon: <FileCheck />,
      }))
      
      setLoading(false)
    }
  };

  return (
    // <Protected.Route>
      <Layout>
        <Paper p="md" shadow="sm" radius="md">
          <Title>Configuración</Title>
          <form onSubmit={form.onSubmit((values) => saveConfiguration(values))}><Stack>
            
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
              {/* <TextInput
                // placeholder="klfsñjalks"
                type="password"
                label="Cambiar Contraseña" // rightSections=""
                {...form.getInputProps("password")}
              /> */}
              <NumberInput
                // description="Se recalculara automaticamente"
                placeholder="3137864030"
                label="Número De Celular"
                {...form.getInputProps("phoneNumber")}
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
               {...form.getInputProps("anonimoDefault")}
               />
               <SwitchConfiguration title="Usar Nombre De Usuario"
               description="Usar el nombre de usuario en lugar del nombre real para las publicaciones y comentarios" 
               {...form.getInputProps("useUserName")}
               />
            <Button loading={loading} mt="sm" type="submit" color="orange" radius="md" uppercase>Guardar</Button>  
          </Stack>
          </form>
        </Paper>
      </Layout>
    // </Protected.Route>
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

