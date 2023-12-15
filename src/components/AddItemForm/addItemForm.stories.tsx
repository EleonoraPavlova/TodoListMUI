
import type { Meta, StoryObj } from '@storybook/react';
import { AddItemForm, AddItemFormProps } from './AddItemForm';
import { action } from '@storybook/addon-actions'
import TextField from "@mui/material/TextField";
import { ChangeEvent, useState, KeyboardEvent } from "react";
import { IconButton } from "@mui/material";
import AddTaskIcon from '@mui/icons-material/AddTask';


const meta: Meta<typeof AddItemForm> = {
  title: 'TODOLISTS/AddItemForm',
  component: AddItemForm,
  tags: ['autodocs'],
  argTypes: {
    addItem: {
      description: 'Button clicked inside form',
      action: 'clicked'
    }
  },
};

export default meta;
type Story = StoryObj<typeof AddItemForm>;


export const AddItemFormStory: Story = {
  args: {
    addItem: action('Button clicked inside form'),
  },
};


const AddItemFormError = (props: AddItemFormProps) => {
  let [error, setError] = useState<string>("Mistake")
  let [title, setTitle] = useState("")

  const addTasks = () => {
    if (title.trim() !== "") {
      props.addItem(title.trim());
      setTitle("");
    } else {
      setError(error);
    }
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error) setError("");
    if (e.key === "Enter") addTasks();
  }

  const onBlurHandler = () => {
    setError("");
  }

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: '8px' }}>
      <TextField value={title}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        label="Value"
        size="small"
        onBlur={onBlurHandler}
        sx={{ mr: '3px' }}
        error={!!error}
        helperText={error}
      />
      <IconButton aria-label="delete" size="small" onClick={addTasks} sx={{ ml: "4px" }} >
        <AddTaskIcon color={"success"} />
      </IconButton>

    </div>)
}


export const AddItemFormErrorStory: Story = {
  render: () => <AddItemFormError addItem={action("addItem was action")} errorText={"Mistake"} />
};

export const AddItemFormDisabledStory: Story = {
  render: () => <AddItemForm addItem={action("addItem was action")} disabled={true} errorText={""} />
};


