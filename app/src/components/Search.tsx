"use client"
import { usefeed } from "@context/FeedContext"
import { CloseButton, Input } from "@mantine/core"
import { useState } from "react"
import { Search as SearchIcon } from "tabler-icons-react"

interface SeachInterface {
    close?: () => void;
}

export const Search = (props: SeachInterface) => {
    const [hovered, setHovered] = useState(false)

    const { setSearch, searchValue } = usefeed()
    const handlerClick = () => {
        setSearch('')
        if (props.close) {
            props.close()
        }
    }

    return (
        <form className="w-full">
            <Input
                onChange={(event) => setSearch(event.currentTarget.value)}
                // onReset={() => setSearch('')}
                // value={searchValue}
                onMouseOver={() => setHovered(true)}
                onMouseOut={() => setHovered(false)}
                variant={hovered ? "filled" : "default"}
                placeholder="Busca eventos"
                size="md" w="100%" radius="md"
                leftSection={<SearchIcon />}
                rightSectionPointerEvents="all"
                rightSection={
                    <CloseButton
                        aria-label="Clear input"
                        onClick={() => handlerClick()}
                        type="reset"
                        style={{ display: (searchValue || props.close) ? undefined : 'none' }}
                    />
                }
            />
        </form>
    )
}