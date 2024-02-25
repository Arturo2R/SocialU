
import { Collapse, Button, Group, Stack, Title, Text, Container } from '@mantine/core'
import React, { useState } from 'react'

import config from '../config'
import { useDisclosure } from '@mantine/hooks'

type Props = {}

const conf = config()

const FilterByTags = ({ category, categorySetter }: { category: CategoryState | null, categorySetter: React.Dispatch<React.SetStateAction<CategoryState | null>> }) => {



    return (
        <div className='mb-[20px]'>
            <Container hiddenFrom='sm' fluid pl={0} className='pr-0 sm:pr-[20px]'>
                <MobileFilterByTags category={category} categorySetter={categorySetter} />
            </Container>
            <Container visibleFrom='sm' fluid pl={0} pr={20}>
                <DesktopFilterByTags categoryState={category} categorySetter={categorySetter} />
            </Container>

        </div>
    )
}

function MobileFilterByTags({ category, categorySetter }: { category: CategoryState | null, categorySetter: React.Dispatch<React.SetStateAction<CategoryState | null>> }) {
    const [opened, { toggle }] = useDisclosure(false)

    return <>
        <Button radius="md" color={category?.color || 'gray'} size='md' variant={category?.variant || (opened ? 'filled' : 'outline')} onClick={toggle} fullWidth> Categoria{category?.name?": "+category.name:"s "}</Button>
        <Collapse in={opened}>
            <Stack gap={0} mt="xs" className="max-w-sm mx-auto">
                <Text size="sm" c="dimmed" className="text-center">
                    Filtrar por Categorias
                </Text>
                <Stack gap="xs">
                    {conf.categories.map((c, index) => category?.value !== c.value && (
                        <Button key={index} radius="md" size='md' onClick={() => { categorySetter({ ...c, variant: "light" }); toggle() }} variant='light' color={c.color}>{c.name}</Button>
                    ))}
                    {category !== null && (
                        <Button radius="md" size='md' onClick={() => { categorySetter(null); toggle() }} variant='light' color="gray">Todas</Button>
                    )}
                </Stack>
            </Stack>
        </Collapse>
    </>
}


const DesktopFilterByTags = ({ categoryState, categorySetter }: { categoryState: CategoryState | null, categorySetter: (State: CategoryState | null) => void }) => {
    return (
        <Group gap="xs" grow>
            <Button radius="md" size='md' onClick={() => { categorySetter(null) }} variant={categoryState === null ? 'light' : 'outline'} color="gray" >Todas</Button>
            {conf.categories.map((c, index) => (
                <Button key={index} radius="md" size='md' onClick={() => { categorySetter({ ...c, variant: "light" }) }} variant={categoryState?.value === c.value ? 'light' : 'outline'} color={c.color} >{c.name}</Button>
            ))}
        </Group>
    )
}


export default FilterByTags

