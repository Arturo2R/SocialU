import { Title, Text, Anchor, Container } from '@mantine/core';
import useStyles from './Welcome.styles';

export function Welcome() {
  const { classes } = useStyles();

  return (
    <>
      <Container px="xl">
        <Title className={classes.title} align="center">
          Bienvenido A{' '}
          <Text inherit variant="gradient" component="span">
            SocialU
          </Text>
        </Title>
        <Text className='mx-auto mt-12 text-xl text-orange-400 align-center' align="center" size="lg" sx={{ maxWidth: 580 }} mx="auto" mt="xl">
          La red Social
        </Text>
      </Container>
    </>
  );
}
