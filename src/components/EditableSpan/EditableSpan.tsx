import { TextField } from '@mui/material'
import React, { ChangeEvent, useState, KeyboardEvent, memo } from 'react'
import styled from '@emotion/styled'

type EditableSpanProps = {
  title: string
  isDone?: boolean | undefined
  changeTitle: (title: string) => void
}

export const EditableSpan: React.FC<EditableSpanProps> = memo((props) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  let [title, setTitle] = useState<string>('')

  const onEditMode = () => {
    if (!props.isDone) {
      setEditMode(true)
      setTitle(props.title)
    }
  }

  const offEditMode = () => {
    setEditMode(false)
    props.changeTitle(title)
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyDownEditHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') offEditMode()
  }

  return editMode ? (
    <TextField
      value={title}
      onChange={onChangeHandler}
      onBlur={offEditMode}
      variant="standard"
      onKeyDown={onKeyDownEditHandler}
      autoFocus
    />
  ) : (
    <StyledEditableSpan onDoubleClick={onEditMode}>{props.title}</StyledEditableSpan>
  )
})

const StyledEditableSpan = styled.span`
  overflow: auto;
`

export default EditableSpan
