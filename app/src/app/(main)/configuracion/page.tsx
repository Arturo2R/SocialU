"use client"
import { FC, useEffect } from "react";
import {
    Autocomplete, Button, Group,
    NumberInput,
    Paper,
    Space, Stack, Switch, Text, TextInput, Title
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { useMutation } from "convex/react";
import { api } from "@backend/api";

import { DEFAULT_COLOR } from "@lib/constants";
import { useUser } from "@context/UserStateContext";

import Protected from "@components/Protected";

const configuracion = () => {
    // const { user } = useStore.getState();
    const {user} = useUser()


    // const [loading, setLoading] = useState<boolean>(false)
    const formdata: UserState = {
        userName: user?.username || "",
        email: user?.email || "",
        displayName: user?.displayName || "",
        semester: user?.semester || "",
        photoURL: user?.photoURL || "",
        career: user?.career || "",
        phoneNumber: user?.phoneNumber || "",
        anonimoDefault: user?.settings?.anonimoDefault || false,
        useUserName: user?.settings?.useUserName || false,
    }

    const form = useForm({
        initialValues: formdata,
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

    useEffect(() => {
        form.setValues(formdata)
    }, [user])


    const updateProfile = useMutation(api.user.update)

    const saveConfiguration = (payload: configurationForm) => {
        updateProfile({
            data: {
                anonimoDefault: payload.anonimoDefault,
                useUserName: payload.useUserName,
                phoneNumber: payload.phoneNumber || undefined,
                description: payload.description || undefined,
                career: payload.career || undefined,
                semester: payload.semester || undefined,
            }
        }).then(() => notifications.show({
            id: "created-post",
            autoClose: 4000,
            title: "Perfil Actualizado",
            message: "El perfil ha sido actualizado exitosamente",
            color: DEFAULT_COLOR,
            className: "my-notification-class",
        }))
    };



    return (
        <Protected.Route>
        <Paper p="md" shadow="sm" radius="md">
            <Title>Configuración</Title>
            <form onSubmit={form.onSubmit((values) => saveConfiguration(values))}><Stack>
                <Space h="md" />
                <Title order={2}>Perfil</Title>
                <TextInput
                    disabled
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
                <Button 
                // loading={updatingProfile == "loading" || !user} 
                mt="sm" type="submit" color={DEFAULT_COLOR} radius="md" 
                className="uppercase"
                >Guardar</Button>
            </Stack>
            </form>
        </Paper>
    </Protected.Route>
    );
};

export default configuracion;

interface SCF {
    title: string;
    description: string;
    value?: boolean;
    onChange: Function;
}

const SwitchConfiguration: FC<SCF> = ({ title, description, value, onChange }) => {
    return (
    <Group
        justify="space-between"
        wrap="nowrap"
        gap="xl"
    >
        <div>
            <Text className="font-medium">{title}</Text>
            <Text size="xs" c="dimmed">{description}</Text>
        </div>
        <Switch
            onLabel="SI"
            offLabel="NO"
            checked={value}
            onChange={(e) => onChange(e.currentTarget.checked)}
            color={DEFAULT_COLOR}
            size="lg" 
        />
    </Group>
    );
}

