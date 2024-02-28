import type { Meta, StoryObj } from '@storybook/react'
import AppRedux from './AppRedux'
// import { store } from "../state/store";
// import { Provider } from "react-redux";
import { ReduxStoreProviderDecorator } from '../stories/decorators/ReduxStoreProviderDecorator'

const meta: Meta<typeof AppRedux> = {
  title: 'TODOLISTS/AppWithRedux',
  component: AppRedux,
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
type Story = StoryObj<typeof AppRedux>

export const AppReduxStory: Story = {}
