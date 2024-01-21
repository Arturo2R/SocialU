import { ActionIcon,Switch, Textarea } from "@mantine/core";
import React from "react";
import { Send } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuth } from "../../context/AuthContext";
import { DEFAULT_COLOR } from "../../constants";

type Props = {
  postId: string;
  respondto?: string
};

const CommentForm = (props: Props) => {
  const {user} = useAuth()
  const [anonimo, setAnonimo] = useState<boolean>(user?.configuration?.anonimoDefault || false)

  const form = useForm({
    initialValues: {
      content: "",
      anonimo: user?.configuration?.anonimoDefault || false,
      postId: props.postId,
    },
  });

  const { createComment, creating } = useFirestore();

  return (
    <form
      className="flex gap-x-2"
      onSubmit={form.onSubmit((values) => {
        createComment(values, user);
        form.reset();
      })}
      name="comment-form"
      id="CommentForm"
    >
      {/* <Group grow> */}
      <div className="flex-1">
        <Textarea
          placeholder="Tu Comentario"
          className="mb-1"
          // label="Tu Comentario"
          variant="filled"
          name="Comentario"
          form="CommentForm"
          radius="md"
          minRows={2}
          autosize
          required
          {...form.getInputProps("content")}
        />
        <Switch
          mt="xs"
          color={DEFAULT_COLOR}
          label="Enviar Anonimamente"
          checked={anonimo}
          onChange={(e) => {
            setAnonimo(e.currentTarget.checked);
            form.setFieldValue("anonimo", e.currentTarget.checked);
          }}
        ></Switch>
      </div>
      {/* <div className=""> */}
      
      <ActionIcon
        aria-label="Enviar Comentario"
        component="button"
        className="flex-none"
        color={DEFAULT_COLOR}
        size="xl"
        radius="md"
        variant="light"
        type="submit"
      >
        <Send />
      </ActionIcon>
      {/* </div> */}
      {/* </Group> */}
    </form>
  );
};

export default CommentForm;
