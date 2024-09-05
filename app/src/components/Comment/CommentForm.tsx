import { ActionIcon, Paper, SegmentedControl, Switch, Text, Textarea } from "@mantine/core";
import React, { useEffect } from "react";
import { Send } from "tabler-icons-react";
import { useForm } from "@mantine/form";

import { DEFAULT_COLOR } from "@lib/constants";
import { nanoid } from "@lib/utils";

import { useMutation } from "convex/react";
import { api } from "@backend/api";
import { Id } from "@backend/dataModel";
import { UserState } from "@context/UserStateContext";

type Props = {
  postId: Id<"post">;
  respondto?: Id<"comment">;
  closeCollapse?: Function
  user: UserState;
};

const CommentForm = (props: Props) => {
  
  const form = useForm({
    initialValues: {
      content: "",
      anonimo: props.user?.settings?.anonimoDefault || false,
      postId: props.postId,
      asBussiness: false,
    },
  });

  // useEffect(() => {
  //   form.setFieldValue('anonimo', form.values.asBussiness)
  // }
  //   , [form.values.asBussiness])

  const create = useMutation(api.comment.create)


  const commentFormId = nanoid();

  return (
      <form
        className="flex gap-x-2"
        onSubmit={form.onSubmit((values) => {
          create({
            anonimo: values.anonimo,
            asOrganization: values.asBussiness,
            content: values.content,
            parentId: props.respondto || undefined,
            postId: props.postId,
          })
          console.log("Creando; ",
            {
              anonimo: values.anonimo,
              asOrganization: values.asBussiness,
              content: values.content,
              parentId: props.respondto || undefined,
              postId: props.postId,
            }
          )
          if(props.closeCollapse){props?.closeCollapse(false)}
          form.reset();
        })}
        name={"comment-form-"+ commentFormId}
        id={"CommentForm-"+  commentFormId}
      >
        <div className="flex-1">
          <Textarea
            placeholder="Tu Comentario"
            className="mb-1"
            // label="Tu Comentario"
            variant="filled"
            name={"Comentario-"+  commentFormId}	
            form={"CommentForm-"+  commentFormId}	
            radius="md"
            minRows={2}
            autosize
            required
            {...form.getInputProps("content")}
          />
          {props.user!.isMember && (
            <Switch
              mt="xs"
              size="md"
              color={props.user!.organization.color || DEFAULT_COLOR}
              label={"Comentar como " + props.user!.organization.name}
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

      </form>
  );
};

export default CommentForm;
