import { Collapse, Textarea, ActionIcon, Switch } from '@mantine/core'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Send, } from 'tabler-icons-react'
import { useAuth } from '../../context/AuthContext'
import { useFirestore } from '../../hooks/useFirestore'
import { DEFAULT_COLOR } from '../../lib/constants'
import CommentForm from './CommentForm'

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
      anonimo: true, //
      postId: postId,
    }
  });
  
  return ( <Collapse in={opened}>
    <CommentForm postId={postId}/>
  </Collapse>  )
}
    {/* */}


export default MiniCommentForm