"use client"

import { Button, Container, MultiSelect, Text, Textarea } from "@mantine/core";
import Switc from "@components/Comment/Switc";
import { EditorLoader, TextEditorProps } from "@components/TextEditor";
import { DEFAULT_COLOR, MAXIMUM_TITLE_LENGTH, MINIMUM_TITLE_LENGTH } from "@lib/constants";
import { useEffect, useState } from "react";
// import { Doc } from "@backend/dataModel";
import { Controller, SubmitHandler, useForm as hform } from "react-hook-form";
// import { useQuery } from "convex-helpers/react/cache/hooks";
import { api } from "@backend/api";
import config from "@lib/config";
import ImageDropzone from "@components/ImageDropzone";
import dynamic from "next/dynamic";

import { notifications } from "@mantine/notifications";
import { FileCheck } from "tabler-icons-react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { useUser } from "../../../context/UserStateContext";
import Protected from "@components/Protected";
import { AuthorInfo } from "@components/AuthorInfo";
// import { getHtmlFromEdjs } from "@lib/parseedjs";

let conf = config();

const TextEditor: React.ComponentType<TextEditorProps> = dynamic(() => import("@components/TextEditor"), {
    ssr: false,
    loading: () => <EditorLoader />,
});

const CrearPage = () => {
    // const user = useQuery(api.user.current)
    const { user } = useUser()
    const router = useRouter()


    const { register, handleSubmit, setValue, control, formState: { errors }, reset, watch } = hform({
        defaultValues: {
            title: "",
            message: "",
            isEvent: false,
            time: "", //
            date: null,
            image: "",
            tags: [],
            anonimo: user?.settings?.anonimoDefault || false,
            asBussiness: false,
        },
    });

    useEffect(() => {
        if (user?.settings) {
            setValue("anonimo", user.settings.anonimoDefault)
        }
    }, [user]);

    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageData, setImageData] = useState<{ width: number; height: number } | null>(null);
    const [imageChecking, setImageChecking] = useState<"loading" | "loaded" | null>(null);
    const [creatingPost, setCreatingPost] = useState<"loading" | "loaded" | null>(null);
    const [editorState, setEditorState] = useState<any>()
    // const [bussinessAccount, setBussinessAccount] = useState<Doc<"organization"> | null>(null);
    // const [hasBussinessAccount, setHasBussinessAccount] = useState<boolean>(false);

    useEffect(() => {
        if (imageUrl) {
            setValue("image", imageUrl)
        }
    }, [imageUrl])

    const createnewpost = useMutation(api.post.create)

    const submitPost: SubmitHandler<Record<string, any>> = async (payload) => {
        console.log(payload)
        setCreatingPost("loading")
        router.push("/")
        const message = JSON.stringify(payload.message)
        createnewpost({
            anonimo: payload.anonimo,
            asBussiness: payload.asBussiness || false,
            image: payload.image,
            content: message,
            tags: payload.tags,
            title: payload.title,
            // contentInHtml: getHtmlFromEdjs(payload.message, false).join(""),
            messageFormat: "EditorJS",
            renderMethod: message.includes("error") || message.includes("Error") ? "CustomEditorJSParser" : "DangerouslySetInnerHtml",
        }).then(() => setCreatingPost("loaded"))
        reset()
        notifications.show({
            id: "created-post",
            loading: creatingPost === "loading",
            autoClose: 3000,
            title: "Post creado",
            message: "Se Publicó 😀",
            color: DEFAULT_COLOR,
            className: "my-notification-class",
            icon: <FileCheck />,
        });
    }

    return (
        <Protected.Route>
            <Container p={0} className="h-full">
                <form
                    onSubmit={handleSubmit(submitPost)}
                    className="flex flex-col justify-between h-full"
                >
                    <div>
                        <ImageDropzone
                            setImageLoading={setImageChecking}
                            imageUrl={imageUrl}
                            setImageUrl={setImageUrl}
                            image={image}
                            setImage={setImage}
                            setImageData={setImageData}
                        />
                        <Textarea  // Titulo
                            variant="unstyled"
                            placeholder="Titulo"
                            error={errors.title?.message}
                            size="xl"
                            minRows={1}
                            autosize
                            classNames={{
                                input: "!text-3xl !font-bold dark:text-white-200 ",
                            }}
                            {...register("title", {
                                minLength: { value: MINIMUM_TITLE_LENGTH, message: `No menos de ${MINIMUM_TITLE_LENGTH} caracteres` },
                                maxLength: { value: MAXIMUM_TITLE_LENGTH, message: `No más de ${MAXIMUM_TITLE_LENGTH} caracteres` }
                            })}
                        />
                        <Controller
                            name="tags"
                            control={control}
                            render={({ field }) => (
                                <MultiSelect
                                    maxValues={1} // maximo de etiquetas TODO: tranfeer to constants file
                                    onChange={field.onChange}
                                    value={field.value}
                                    // label="Etiquetas"
                                    variant="unstyled"
                                    placeholder="Categorias"
                                    data={conf.categories.map(c => { return { label: c.name, value: c.value } })}
                                    clearable
                                    hidePickedOptions
                                />
                            )}
                        />
                        {/* ts-ignore */}
                        <TextEditor
                            data={editorState}
                            setDataState={setEditorState}
                            editorblock="editorjs"
                            control={control}
                            name="message"
                            editable
                        />
                        <div className={user?.isMember ? "h-[150px]" : "h-[75px]"}>
                            {(watch("asBussiness") === true && user?.isMember) && (
                                <AuthorInfo
                                    isBussiness={true}
                                    link={user.organization.url}
                                    name={user.organization.name}
                                    email={user.organization.url || `${user.organization.userName}@uninorte.edu.co`}
                                    image={user.organization.logo || undefined}
                                    icon
                                />
                            )}
                            {console.log(user, watch("asBussiness"))}
                            {(watch("anonimo") === false && user) && (
                                <AuthorInfo
                                    isBussiness={false}
                                    link={user.userName}
                                    name={user.displayName}
                                    email={user.email}
                                    image={user.photoURL || "/profile.jpg"}
                                    icon
                                />
                            )}
                        </div>

                        {user?.isMember && (
                            <Switc
                                label={`Publicar como ${user.organization.name}`}
                                color={user.organization.color}
                                control={control}
                                def={false}
                                name="asBussiness"
                                size="md"
                            />
                        )}
                        <Switc
                            label="Anonimo"
                            control={control}
                            def={user?.settings?.anonimoDefault || false}
                            name="anonimo"
                        />
                    </div>
                    <Button
                        loading={creatingPost == "loading" || imageChecking == "loading"}
                        type="submit"
                        variant="filled"
                        fullWidth
                        color={DEFAULT_COLOR}
                        size="md"
                        className="self-end w-full mt-4"
                    >
                        Enviar Post
                    </Button>
                </form>
            </Container>
        </Protected.Route>
    );
}

export default CrearPage;