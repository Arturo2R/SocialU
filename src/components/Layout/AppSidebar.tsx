import { Aside, MediaQuery } from "@mantine/core";
import React from "react";
import CommentWall from "../Comment/CommentWall";

type Props = {};

const co = [
  {
    author: {
      name: "Juana",
      image: "/perfil.jpg",
    },
    body: "Esto se va a poner buen",
    postedAt: "Ayer 10 AM",
    subComments: [
      {
        author: { name: "Anónimo", image: "/porsche.jpg" },
        body: "Claro que sí, con la ayuda de Dios",
        postedAt: "Hace 3 minutos",
      },
    ],
  },
];

const AppSidebar = (props: Props) => (
  <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
    <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
      {/* <CommentWall comments={co} /> */}
    </Aside>
  </MediaQuery>
);

export default AppSidebar;
