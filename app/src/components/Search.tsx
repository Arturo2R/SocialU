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

    const { setSearch, searchValue, category } = usefeed()
    const handlerClick = () => {
        setSearch('')
        if (props.close) {
            props.close()
        }
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            <Input
                onChange={(event) => setSearch(event.currentTarget.value)}
                // onReset={() => setSearch('')}
                // value={searchValue}
                onMouseOver={() => setHovered(true)}
                onMouseOut={() => setHovered(false)}
                variant={hovered ? "filled" : "default"}
                placeholder={`Busca ${category?.value || "posts"}`}
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