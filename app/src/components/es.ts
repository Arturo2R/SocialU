export const es = {
  slash_menu: {
    heading: {
      title: "Encabezado 1",
      subtext: "Usado para un encabezado de nivel superior",
      aliases: ["h", "encabezado1", "h1"],
      group: "Encabezados",
    },
    heading_2: {
      title: "Encabezado 2",
      subtext: "Usado para secciones clave",
      aliases: ["h2", "encabezado2", "subencabezado"],
      group: "Encabezados",
    },
    heading_3: {
      title: "Encabezado 3",
      subtext: "Usado para subsecciones y encabezados de grupo",
      aliases: ["h3", "encabezado3", "subencabezado"],
      group: "Encabezados",
    },
    numbered_list: {
      title: "Lista Numerada",
      subtext: "Usado para mostrar una lista numerada",
      aliases: ["ol", "li", "lista", "listanumerada", "lista numerada"],
      group: "Bloques básicos",
    },
    bullet_list: {
      title: "Lista de Viñetas",
      subtext: "Usado para mostrar una lista desordenada",
      aliases: ["ul", "li", "lista", "listadeviñetas", "lista de viñetas"],
      group: "Bloques básicos",
    },
    check_list: {
      title: "Lista de Verificación",
      subtext: "Usado para mostrar una lista con casillas de verificación",
      aliases: [
        "ul",
        "li",
        "lista",
        "listadeverificación",
        "lista de verificación",
        "lista marcada",
        "casilla",
      ],
      group: "Bloques básicos",
    },
    paragraph: {
      title: "Párrafo",
      subtext: "Usado para el cuerpo de tu documento",
      aliases: ["p", "párrafo"],
      group: "Bloques básicos",
    },
    table: {
      title: "Tabla",
      subtext: "Usado para tablas",
      aliases: ["tabla"],
      group: "Avanzado",
    },
    image: {
      title: "Imagen",
      subtext: "Insertar una imagen",
      aliases: [
        "imagen",
        "subirImagen",
        "subir",
        "img",
        "foto",
        "medios",
        "url",
      ],
      group: "Medios",
    },
    video: {
      title: "Video",
      subtext: "Insertar un video",
      aliases: [
        "video",
        "subirVideo",
        "subir",
        "mp4",
        "película",
        "medios",
        "url",
      ],
      group: "Medios",
    },
    audio: {
      title: "Audio",
      subtext: "Insertar audio",
      aliases: [
        "audio",
        "subirAudio",
        "subir",
        "mp3",
        "sonido",
        "medios",
        "url",
      ],
      group: "Medios",
    },
    file: {
      title: "Archivo",
      subtext: "Insertar un archivo",
      aliases: ["archivo", "subir", "incrustar", "medios", "url"],
      group: "Medios",
    },
  },
  placeholders: {
    default: "Escribe algo o usa '/' para ver los comandos",
    heading: "Encabezado",
    bulletListItem: "Lista",
    numberedListItem: "Lista",
    checkListItem: "Lista",
  },
  file_blocks: {
    image: {
      add_button_text: "Añadir imagen",
    },
    video: {
      add_button_text: "Añadir video",
    },
    audio: {
      add_button_text: "Añadir audio",
    },
    file: {
      add_button_text: "Añadir archivo",
    },
  },
  // from react package:
  side_menu: {
    add_block_label: "Añadir bloque",
    drag_handle_label: "Abrir menú de bloque",
  },
  drag_handle: {
    delete_menuitem: "Eliminar",
    colors_menuitem: "Colores",
  },
  table_handle: {
    delete_column_menuitem: "Eliminar columna",
    delete_row_menuitem: "Eliminar fila",
    add_left_menuitem: "Añadir columna izquierda",
    add_right_menuitem: "Añadir columna derecha",
    add_above_menuitem: "Añadir fila arriba",
    add_below_menuitem: "Añadir fila abajo",
  },
  suggestion_menu: {
    no_items_title: "No se encontraron elementos",
    loading: "Cargando…",
  },
  color_picker: {
    text_title: "Texto",
    background_title: "Fondo",
    colors: {
      default: "Predeterminado",
      gray: "Gris",
      brown: "Marrón",
      red: "Rojo",
      orange: "Naranja",
      yellow: "Amarillo",
      green: "Verde",
      blue: "Azul",
      purple: "Púrpura",
      pink: "Rosa",
    },
  },

  formatting_toolbar: {
    bold: {
      tooltip: "Negrita",
      secondary_tooltip: "Mod+B",
    },
    italic: {
      tooltip: "Cursiva",
      secondary_tooltip: "Mod+I",
    },
    underline: {
      tooltip: "Subrayado",
      secondary_tooltip: "Mod+U",
    },
    strike: {
      tooltip: "Tachado",
      secondary_tooltip: "Mod+Shift+X",
    },
    code: {
      tooltip: "Código",
      secondary_tooltip: "",
    },
    colors: {
      tooltip: "Colores",
    },
    link: {
      tooltip: "Crear enlace",
      secondary_tooltip: "Mod+K",
    },
    file_caption: {
      tooltip: "Editar subtítulo",
      input_placeholder: "Editar subtítulo",
    },
    file_replace: {
      tooltip: {
        image: "Reemplazar imagen",
        video: "Reemplazar video",
        audio: "Reemplazar audio",
        file: "Reemplazar archivo",
      } as Record<string, string>,
    },
    file_rename: {
      tooltip: {
        image: "Renombrar imagen",
        video: "Renombrar video",
        audio: "Renombrar audio",
        file: "Renombrar archivo",
      } as Record<string, string>,
      input_placeholder: {
        image: "Renombrar imagen",
        video: "Renombrar video",
        audio: "Renombrar audio",
        file: "Renombrar archivo",
      } as Record<string, string>,
    },
    file_download: {
      tooltip: {
        image: "Descargar imagen",
        video: "Descargar video",
        audio: "Descargar audio",
        file: "Descargar archivo",
      } as Record<string, string>,
    },
    file_delete: {
      tooltip: {
        image: "Eliminar imagen",
        video: "Eliminar video",
        audio: "Eliminar audio",
        file: "Eliminar archivo",
      } as Record<string, string>,
    },
    file_preview_toggle: {
      tooltip: "Alternar vista previa",
    },
    nest: {
      tooltip: "Anidar bloque",
      secondary_tooltip: "Tab",
    },
    unnest: {
      tooltip: "Desanidar bloque",
      secondary_tooltip: "Shift+Tab",
    },
    align_left: {
      tooltip: "Alinear texto a la izquierda",
    },
    align_center: {
      tooltip: "Alinear texto al centro",
    },
    align_right: {
      tooltip: "Alinear texto a la derecha",
    },
    align_justify: {
      tooltip: "Justificar texto",
    },
  },
  file_panel: {
    upload: {
      title: "Subir",
      file_placeholder: {
        image: "Subir imagen",
        video: "Subir video",
        audio: "Subir audio",
        file: "Subir archivo",
      } as Record<string, string>,
      upload_error: "Error: La subida falló",
    },
    embed: {
      title: "Incrustar",
      embed_button: {
        image: "Incrustar imagen",
        video: "Incrustar video",
        audio: "Incrustar audio",
        file: "Incrustar archivo",
      } as Record<string, string>,
      url_placeholder: "Introduce URL",
    },
  },
  link_toolbar: {
    delete: {
      tooltip: "Eliminar enlace",
    },
    edit: {
      text: "Editar enlace",
      tooltip: "Editar",
    },
    open: {
      tooltip: "Abrir en nueva pestaña",
    },
    form: {
      title_placeholder: "Editar título",
      url_placeholder: "Editar URL",
    },
  },
  generic: {
    ctrl_shortcut: "Ctrl",
  },
};