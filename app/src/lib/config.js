import { IconBellRinging, IconSend, IconSettings } from "@tabler/icons-react";
import pk from "../../package.json";
export default function () {
  return {
    domain: "redsocialu.net",
    url: "https://redsocialu.net",
    description: "La Aplicación de la Universidad",
    siteName: "SocialU",
    logo: "/logo.png",
    publisher: "SocialU",
    creator: "Arturo Rebolledo",
    bussiness: {
      address: "Cra 54 # 64",
      tel: "3453984934"
    },
    version: pk.version,
    sidebar: [
      { link: "/", label: "Feed", icon: IconBellRinging, isProtected: false },
      { link: "/crear", label: "Crear Post", icon: IconSend, isProtected: true },
      // { link: "/", label: "Security", icon: Fingerprint },
      // { link: "/", label: "SSH Keys", icon: Key },
      // { link: "/", label: "Databases", icon: DatabaseImport },
      { link: "/configuracion", label: "Configuración", icon: IconSettings, isProtected: true },
      // { link: "/about", label: "Sobre Nosotros", icon: TwoFA },
    ],
    categories: [
      // { color: "#F6D55C", name: "Erasmus", value: "erasmus" },
      { color: "#FF0000", name: "Confesiones", active: true, value: "confesiones" },
      // { color: "#2F4B7C", name: "Imagen", active: true, value: "imagen" },
      { color: "#3CAEA3", name: "Eventos", active: true, value: "eventos" },
      //{ color: "#ED553B", name: "Clases", active: true, value: "clases" },
      { color: "#20639B", name: "Ventas", active: true, value: "Ventas" },
      //
      { color: "#431C53", name: "Objetos perdidos", active: true, value: "Objetos_perdidos" },

      // Hola
      { color: "#8000FF", name: "Parciales finales", active: true, value: "parciales_finales" },
    ],
    appNames: ['Campus Gossip', "Chisme.app", "Desembuchalo", 'Chismes En La U', 'Student Secrets', "Campus Confessions", "UniConfesiones", "UniLeaks", "Campus Help", "Campus Connect",]
  }
}
