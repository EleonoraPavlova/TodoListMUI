import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { EditableSpan } from './EditableSpan'

const meta: Meta<typeof EditableSpan> = {
  title: 'TODOLISTS/EditableSpan',
  component: EditableSpan,
  tags: ['autodocs'],
  argTypes: {
    changeTitle: action('Clicked'),
  },
  args: {
    title: 'Start value empty. Add value push button set string.',
  },
}

export default meta
type Story = StoryObj<typeof EditableSpan>

// https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const EditableSpanStory: Story = {
  args: {
    title: 'New TITLE',
  },
}
