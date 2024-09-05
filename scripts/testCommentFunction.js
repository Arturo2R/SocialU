const data = {
    comentarios: {
        "comentarios": {
            "0arOuCS": {
                "anonimo": true,
                "asBussiness": false,
                "author": "anonimo",
                "content": "A favor ya tenemos demasiada gente",
                "id": "0arOuCS",
                "parentId": "",
                "postId": "rwyMwIA",
                "postedAt": "2024-05-20T19:46:46.549Z",
                "subComments": {
                    "db2syBO": {
                        "anonimo": true,
                        "asBussiness": false,
                        "author": "anonimo",
                        "content": "Y quien lo dice? Bajo toda probabilidad el número de personas disminuirá radicalmente en los próximos años.",
                        "id": "db2syBO",
                        "parentId": "0arOuCS",
                        "postId": "rwyMwIA",
                        "postedAt": "2024-05-22T17:17:37.257Z",
                        "timeFormat": "JSONDate",
                        "subComments": {
                            "sub1": {
                                "anonimo": true,
                                "asBussiness": false,
                                "author": "anonimo",
                                "content": "Subcomment 1",
                                "id": "sub1",
                                "parentId": "db2syBO",
                                "postId": "rwyMwIA",
                                "postedAt": "2024-05-23T10:00:00.000Z"
                            },
                            "sub2": {
                                "anonimo": true,
                                "asBussiness": false,
                                "author": "anonimo",
                                "content": "Subcomment 2",
                                "id": "sub2",
                                "parentId": "db2syBO",
                                "postId": "rwyMwIA",
                                "postedAt": "2024-05-23T11:00:00.000Z"
                            }
                        }
                    }
                }
            },
            "2A82us7": {
                "anonimo": true,
                "asBussiness": false,
                "author": "anonimo",
                "content": "a favor, es decisión de cada quien",
                "id": "2A82us7",
                "parentId": "",
                "postId": "rwyMwIA",
                "postedAt": "2024-05-20T19:47:54.078Z",
                "timeFormat": "JSONDate",
                "subComments": {
                    "sub3": {
                        "anonimo": true,
                        "asBussiness": false,
                        "author": "anonimo",
                        "content": "Subcomment 3",
                        "id": "sub3",
                        "parentId": "2A82us7",
                        "postId": "rwyMwIA",
                        "postedAt": "2024-05-21T12:00:00.000Z"
                    }
                }
            },
            "38oB5KX": {
                "anonimo": true,
                "asBussiness": false,
                "author": "anonimo",
                "content": "Yo de aborto no sé, a mi lo que me gusta es la Ingeniería Civil",
                "id": "38oB5KX",
                "parentId": "",
                "postId": "rwyMwIA",
                "postedAt": "2024-05-20T19:46:16.873Z",
                "subComments": {
                    "sub4": {
                        "anonimo": true,
                        "asBussiness": false,
                        "author": "anonimo",
                        "content": "Subcomment 4",
                        "id": "sub4",
                        "parentId": "38oB5KX",
                        "postId": "rwyMwIA",
                        "postedAt": "2024-05-21T13:00:00.000Z"
                    },
                    "sub5": {
                        "anonimo": true,
                        "asBussiness": false,
                        "author": "anonimo",
                        "content": "Subcomment 5",
                        "id": "sub5",
                        "parentId": "38oB5KX",
                        "postId": "rwyMwIA",
                        "postedAt": "2024-05-21T14:00:00.000Z"
                    }
                }
            },
            "4B9uKX": {
                "anonimo": true,
                "asBussiness": false,
                "author": "anonimo",
                "content": "En contra, cada vida cuenta",
                "id": "4B9uKX",
                "parentId": "",
                "postId": "rwyMwIA",
                "postedAt": "2024-05-21T15:00:00.000Z",
                "subComments": {
                    "sub6": {
                        "anonimo": true,
                        "asBussiness": false,
                        "author": "anonimo",
                        "content": "Subcomment 6",
                        "id": "sub6",
                        "parentId": "4B9uKX",
                        "postId": "rwyMwIA",
                        "postedAt": "2024-05-22T16:00:00.000Z"
                    }
                }
            }
        }
    }
}

if (data.comentarios) {
    let commentse = []

    const laFunctionAgregadoraDeComentarios = (object) => {
        Object.keys(object).forEach((key) => {
            let includesSubcomments = Object.keys(object[key]).includes("subComments")

            if (includesSubcomments) {
                const { subComments, ...commentsse } = object[key]
                commentse.push(commentsse)
                laFunctionAgregadoraDeComentarios(object[key].subComments)
            }
            else {
                commentse.push(object[key])
            }
        }
        )
    }
    laFunctionAgregadoraDeComentarios(data.comentarios.comentarios)
    console.log(commentse)
}
