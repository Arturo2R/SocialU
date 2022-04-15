import { MediaQuery, Aside, Text } from "@mantine/core";
import React from "react";
import CommentWall from "../Comment/CommentWall";

type Props = {};

const co = [
  {
    author: {
      name: "John",
      image:
        "https://cr00.epimg.net/radio/imagenes/2021/01/02/tendencias/1609606240_435257_1609606414_noticia_normal.jpg",
    },
    body: "Esa vaina así esta muy jodida por lo que veo",
    postedAt: "10 AM",
    subComments: [
      {
        author: "anonimo",
        body: "Sera Tu Y TU madre Carecu",
        postedAt: "10 AM",
      },
      {
        author: {
          name: "Jhon",
          image:
            "https://cr00.epimg.net/radio/imagenes/2021/01/02/tendencias/1609606240_435257_1609606414_noticia_normal.jpg",
        },
        body: "La Tuya Caremonda",
        postedAt: "11 AM",
      },
    ],
  },
  {
    author: { name: "John", image: "/ds" },
    body: "Esa vaina así esta muy jodida por lo que veo",
    postedAt: "10 AM",
    subComments: [
      {
        author: { name: "Juan", image: "/ds" },
        body: "Sera Tu Y TU madre Carecu",
        postedAt: "10 AM",
      },
      {
        author: { name: "Jhon", image: "/ds" },
        body: "La Tuya Caremonda",
        postedAt: "11 AM",
      },
    ],
  },
];

const AppSidebar = (props: Props) => {
  return (
    <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
      <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
        <CommentWall comments={co} />
      </Aside>
    </MediaQuery>
  );
};

export default AppSidebar;
