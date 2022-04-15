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
