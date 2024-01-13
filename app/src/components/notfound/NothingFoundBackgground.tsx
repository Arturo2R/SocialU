import { Container, Title, Text, Button, Group } from '@mantine/core';
import { Illustration } from './Illustration';
import classes from './NothingFoundBackground.module.css';

export function NothingFoundBackground() {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Aquí, no hay Nada</Title>
          <Text c="dimmed" size="lg" ta="center" className={classes.description}>
            La página que intentas abrir no existe. Puede que hayas escrito mal la dirección, o la página ha sido movida a otra URL. Si piensas que esto es un error, contacta al soporte.
          </Text>
          <Group justify="center">
            <Button size="md">Take me back to home page</Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}