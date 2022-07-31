import { BellRinging, Logout, Send, Settings } from "tabler-icons-react";

export default function () {
  return {
    domain: "socia-u.vercel.app",
    siteName: "SocialU",
    logo: "/logo.png",
    bussiness: {
      address: "Cra 54 # 64",
      tel: "3453984934"
    },
    version: "0.12.33",
    sidebar: [
      { link: "/", label: "Feed", icon: BellRinging },
      { link: "/crear", label: "Crear Post", icon: Send },
      // { link: "/", label: "Security", icon: Fingerprint },
      // { link: "/", label: "SSH Keys", icon: Key },
      // { link: "/", label: "Databases", icon: DatabaseImport },
      { link: "/configuracion", label: "Configuración", icon: Settings },
      // { link: "/about", label: "Sobre Nosotros", icon: TwoFA },
    ],


  }
}