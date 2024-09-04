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
    categories: [
       // { color: "#F6D55C", name: "Erasmus", value: "erasmus" },
       { color: "#FF0000", name: "Confesiones", value: "confesiones" },
       // { color: "#2F4B7C", name: "Imagen", value: "imagen" },
       { color: "#3CAEA3", name: "Eventos", value: "eventos" },
       //{ color: "#ED553B", name: "Clases", value: "clases" },
       { color: "#20639B", name: "Ventas", value: "Ventas" },
       //
       { color: "#431C53", name: "Objetos perdidos", value: "Objetos_perdidos" },

       // Hola
       
    ],
    appNames: ['Campus Gossip', "Chisme.app", "Desembuchalo", 'Chismes En La U', 'Student Secrets', "Campus Confessions", "UniConfesiones", "UniLeaks", "Campus Help", "Campus Connect",]
    

  }
}
