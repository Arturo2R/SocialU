import { ActionIcon, Switch, Textarea } from "@mantine/core";
import React, { useEffect } from "react";
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
  const { user, bussinessAccount, hasBussinessAccount } = useAuth()
  // const [anonimo, setAnonimo] = useState<boolean>(user?.configuration?.anonimoDefault || false)
  // const [asBussiness, setAsBussiness] = useState<boolean>(hasBussinessAccount)

  const form = useForm({
    initialValues: {
      content: "",
      anonimo: user?.configuration?.anonimoDefault || false,
      postId: props.postId,
      asBussiness: hasBussinessAccount,
    },
  });

  const { createComment, creating } = useFirestore();

  useEffect(() => {
    form.setFieldValue('anonimo', form.values.asBussiness)
  }
    , [form.values.asBussiness])

  return (
    <form
      className="flex gap-x-2"
      onSubmit={form.onSubmit((values) => {
        createComment(values, user, hasBussinessAccount, bussinessAccount);
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
        {hasBussinessAccount && (
          <Switch
            mt="xs"
            size="md"
            color={bussinessAccount?.color || DEFAULT_COLOR}
            label={"Comentar como " + bussinessAccount?.name}
            {...form.getInputProps('asBussiness', { type: 'checkbox' })}
          ></Switch>
        )}
        <Switch
          mt="xs"
          color={DEFAULT_COLOR}
          label="Enviar Anonimamente"
          {...form.getInputProps('anonimo', { type: 'checkbox' })}
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
