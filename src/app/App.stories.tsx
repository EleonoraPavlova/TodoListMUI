import type { Meta, StoryObj } from '@storybook/react'
// import { store } from "../state/store";
// import { Provider } from "react-redux";
import App from './App'
import { ReduxStoreProviderDecorator } from 'stories/decorators'

const meta: Meta<typeof App> = {
  title: 'TODOLISTS/App',
  component: App,
  tags: ['autodocs'],
  // decorators: [
  //   (Story) => (
  //     <Provider store={store}>
  //       <Story />
  //     </Provider>
  //   ),
  // ],
  //или подключить саму функцию декоратор
  decorators: [ReduxStoreProviderDecorator],
}

export default meta
type Story = StoryObj<typeof App>

export const AppMocStory: Story = {}
