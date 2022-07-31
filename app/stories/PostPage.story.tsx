import { Meta, Story } from '@storybook/react';

import PostPage, { PostPageProps} from "../src/pages/[authorId]/[postId]/index"

export default {
  component: PostPage,
  title: "PostPage",
}as Meta;


const Template: Story<PostPageProps> = (args) => (<PostPage {...args} />);

export const Default = Template.bind({});

Default.args = {
  authorId: "fdkajsfldksa",
  postId: "flaka",
  data: {
    useUserName: false,
    anonimo: true,
    authorEmail: "elaro@gj.co",
    authorImage: "sjs",
    createdAt: Date.now(),
    message: "Hola que hay mis cuates",
    title: "Hola que hay",
    authorName: "Nani",
    date: "sks",
    authorRef: "fjs", 
    id: "postId",
    userUID: "fsd",
  }
};

// export const Simple = Template.bind({});

// Simple.args = {
//  ...Default.args,
//   // event: true,
//   postId: "kljfsld",
//   author: {
//     image: "/profile.jpg",
//     name: "Arturo R",
//     id: "fsdkldj",
//   },
//   asistants: [
//     {
//       user: { 
//         name: "Juan",
//         image: "https://source.unsplash.com/random/30x40",
//         ref: "user/kljlafds",
//       }
//     },
//   ],
// };