import { ActionIcon, Checkbox, Group, Switch, Textarea } from "@mantine/core";
import React from "react";
import { Send } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuth } from "../../context/AuthContext";

type Props = {
  postId: string;
};

const CommentForm = (props: Props) => {
  const {user} = useAuth()

  const form = useForm({
    initialValues: {
      content: "",
      anonimo: false,
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
    >
      {/* <Group grow> */}
      <div className="flex-1">
        <Textarea
          placeholder="Tu Comentario"
          className="mb-1"
          // label="Tu Comentario"
          variant="filled"
          radius="md"
          minRows={2}
          autosize
          required
          {...form.getInputProps("content")}
        />
        <Switch
          color="orange"
          label="Enviar Anonimamente"
          {...form.getInputProps("anonimo", { type: "checkbox" })}
        ></Switch>
      </div>
      {/* <div className=""> */}
      <ActionIcon
        className="flex-none"
        color="orange"
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
