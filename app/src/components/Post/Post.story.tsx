import { Meta, StoryObj } from "@storybook/react";
import { PostCard } from "./Post";

const meta: Meta<typeof PostCard> = {
  component: PostCard,
};

export default meta;

type Story = StoryObj<PostCardProps>;

// interface PostCardProps  {
//     author:
//     | { image?: string | null; name: string; id: string }
//     | "anonimo";
//     imageData?: imageData;
//     image?: string;
//     description: string;
//     title: string;
//     date?: Date;
//     event?: boolean;
//     postId?: string;
//     // relevantCommentary?: Object;
//     asistants?: {
//       user: {
//         image: string;
//         name: string;
//         ref: `user/${string}`;
//       };
//       suscribedAt?: Timestamp;
//     }[];
//     // key: number;
//     userUID?: string;
//   }

export const SimpleConImagenVerticalLarga: Story = {
  args: {
    author: "anonimo",
    title: "title",
    image: "https://firebasestorage.googleapis.com/v0/b/socialu-c62e6.appspot.com/o/postsBanners%2F28487583.webp?alt=media&token=bd0acffd-2910-46cd-b0be-11487f75c935",
    description: "description",
    postId: "postId",
    userUID: "userUID",
    },
};

export const conAutor: Story = {
    args: {
        author: {
            id: "id",
            name: "Julian Roberto Pajaro",
            image: "https://firebasestorage.googleapis.com/v0/b/socialu-c62e6.appspot.com/o/postsBanners%2F28487583.webp?alt=media&token=bd0acffd-2910-46cd-b0be-11487f75c935",  
        },
        title: "Que Pasa mi Cuate",
        description: "Esta es una descripción mock de un post",
        postId: "postId",
        userUID: "userUID",
        },
    };


    // ...

    export const ConImagenHorizontal: Story = {
        args: {
            author: {
                id: "id",
                name: "John Doe",
                image: "https://example.com/john-doe.jpg",
            },
            title: "Lorem ipsum dolor sit amet",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae metus euismod, aliquet nunc id, aliquam nunc.",
            postId: "postId",
            userUID: "userUID",
        },
    };

    export const SinImagen: Story = {
        args: {
            author: {
                id: "id",
                name: "Jane Smith",
                image: null,
            },
            title: "Nulla facilisi",
            description: "Nulla facilisi. Sed euismod, urna a aliquet tincidunt, nunc nunc tincidunt urna, nec tincidunt urna nunc ac tellus.",
            postId: "postId",
            userUID: "userUID",
        },
    };

    export const ConEvento: Story = {
        args: {
            author: {
                id: "id",
                name: "Alice Johnson",
                image: "https://example.com/alice-johnson.jpg",
            },
            title: "Event Title",
            description: "This is a description of an event post",
            postId: "postId",
            userUID: "userUID",
            event: true,
        },
    };

    // ...


