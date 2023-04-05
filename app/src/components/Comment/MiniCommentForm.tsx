import { Collapse, Textarea, ActionIcon, Switch } from '@mantine/core'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Send, } from 'tabler-icons-react'
import { useAuth } from '../../context/AuthContext'
import { useFirestore } from '../../hooks/useFirestore'

type Props = {
  opened: boolean, 
  postId: string, 
  userNameToResponder?: string, 
}

const MiniCommentForm = ({opened, postId, userNameToResponder,  }: Props) => {
  const {user} = useAuth()
  const { register,control,  handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      content: "",
      anonimo: user?.configuration.anonimoDefault, //
      postId: postId,
    }
  });
  const { createComment } = useFirestore();
  
  const onSubmit = (data:any) => createComment(data, user);
  return ( <p>Nada</p>   )
}
    {/* <Collapse in={opened}>
          <form  onSubmit={handleSubmit(onSubmit)}>
            <Textarea defaultValue={userNameToResponder &&("@"+userNameToResponder)} required={true} {...register("content")} />
              <div className="flex">

              <Controller
                defaultValue={false}
                name="anonimo"
                control={control}
                render={({ field }) =>( 
                  <Switch
                    mt="sm"
                    mb="md"
                    label="Anonimo"
                    color="orange"
                    {...field}
                  />
                  )
                }
               />
            <ActionIcon
              type="submit"
              component="button"
              color="orange"
              radius="xl"
              >
              <Send />
            </ActionIcon>
              </div>
          </form>
        </Collapse> */}


export default MiniCommentForm