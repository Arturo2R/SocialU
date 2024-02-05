import { IconBellRinging, IconSend, IconSettings } from "@tabler/icons-react";
import pk from "../package.json";
export default function () {
  return {
    domain: "redsocialu.com",
    siteName: "SocialU",
    logo: "/logo.png",
    bussiness: {
      address: "Cra 54 # 64",
      tel: "3453984934"
    },
    version: pk.version,
    sidebar: [
      { link: "/", label: "Feed", icon: IconBellRinging },
      { link: "/crear", label: "Crear Post", icon: IconSend },
      // { link: "/", label: "Security", icon: Fingerprint },
      // { link: "/", label: "SSH Keys", icon: Key },
      // { link: "/", label: "Databases", icon: DatabaseImport },
      { link: "/configuracion", label: "Configuración", icon: IconSettings },
      // { link: "/about", label: "Sobre Nosotros", icon: TwoFA },
    ],
    appNames: ['Campus Gossip',"Chisme.app","Desembuchalo", 'Chismes En La U', 'Student Secrets', "Campus Confessions","UniConfesiones", "UniLeaks", "Campus Help", "Campus Connect", ]


  }
}
