import { Meta, Story } from '@storybook/react';
import { BellRinging, Send, Settings } from 'tabler-icons-react';

import {AppFooter ,  AppFooterProps} from "./AppFooter"

export default {
  component: AppFooter,
  title: "AppFooter",
}as Meta;


const Template: Story<AppFooterProps> = (args) => (<AppFooter {...args} />);

export const Default = Template.bind({});

Default.args = {
  buttons: [
    { route: "/", label: "Feed", icon: BellRinging },
    { route: "/crear", label: "Crear Post", icon: Send},
    // { route: "/", label: "Security", icon: Fingerprint },
    // { route: "/", label: "SSH Keys", icon: Key },
    // { route: "/", label: "Databases", icon: DatabaseImport },
    // { route: "/", label: "Authentication", icon: TwoFA },
    { route: "/configuracion", label: "Configuración", icon: Settings },
  ]
};

// export const Simple = Template.bind({});

// Simple.args = {
//   
// };