import { Button, Group, Text } from "@mantine/core";
import Link from "next/link";
// import { useMediaQuery } from "@mantine/hooks";
// import Link from "next/link";
import React from "react";
import { Send } from "tabler-icons-react";
import { DEFAULT_COLOR } from "@lib/constants";
// import { DEFAULT_COLOR } from "../../constants";


// const navs = [
//   { name: 'Homi', icon: Send, href: '/' },
//   { name: 'Publicar', icon: Send, href: '/crear' },
//   { name: 'Config', icon: Send, href: '/configuracion' },
// ]

// const Tab = ({ name, icon, href }) => {
//   return (
//               // <Link href={href} passHref>
//            <button type="button" className="inline-flex flex-col items-center justify-center px-5 bg-transparent dark:hover:bg-gray-800 group">
//                   <svg className="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
//                       <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
//                   </svg>
//                   <Text size="xs">{name}</Text>
//                </button>
//               //  </Link>
//   )
// }

const AppFooter = () => {
  // const matches = useMediaQuery("(min-width: 700px)");

    // return (
    //   <div className="fixed bottom-0 left-0 z-50 w-full bg-[#F2F5FF] h-16 border-t border-[rgb(222, 226, 230)]  dark:border-gray-600">
    //       <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
    //         {navs.map((nav, i) => (
    //           <Tab key={i} {...nav} />
    //         ))}
    //       </div>
    //   </div>

    // );

      return (

            <Group grow className="sm:hidden">
                <Button
                  component={Link}
                  href="/crear"
                  fullWidth={true}
                  rightSection={<Send />}
                  variant="subtle"
                  color={DEFAULT_COLOR}
                  size="md"
                  title="Crear Post"
                >
                  Crear Post
                </Button>
            </Group>

      );
};

export default AppFooter;
