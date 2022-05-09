import { Button, Container, Switch, Textarea } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import React, { useState } from "react";
import ImageDropzone from "../components/ImageDropzone";
// import { Container } from "tabler-icons-react";
import Layout from "../components/Layout/Layout";
import Protected from "../components/Protected";

type Props = {};

const CrearPost = (props: Props) => {
  // Event state
  const [event, setEvent] = useState(false);

  return (
    <Layout>
      <Protected.Route>
        <Container className="h-full">
          <form className="flex flex-col justify-between h-full" action="">
            <div>
              <ImageDropzone />
              <Textarea
                // icon={<At />}
                variant="unstyled"
                placeholder="Titulo"
                size="xl"
                required
                minRows={1}
                autosize
                classNames={{
                  input: "!text-3xl !font-bold dark:text-white-200 ",
                }}
              />
              <Textarea
                placeholder="Mensaje"
                variant="unstyled"
                radius="xl"
                size="md"
                minRows={5}
                required
                autosize
              />
              <Switch
                label="Post Anónimo"
                color="orange"
                // onLabel="Si"
                // offLabel="No"
              />
              <Switch
                mt="sm"
                label="Evento"
                color="orange"
                checked={event}
                onChange={(event) => setEvent(event.currentTarget.checked)}
                // onLabel="Si"
                // offLabel="No"
              />
              {event && (
                <>
                  <DatePicker
                    transition="pop-bottom-left"
                    placeholder="Escojer Dia De Reunion"
                    label="Día De Reunion"
                    required={event}
                    locale="es"
                  />
                  <TimeInput
                    defaultValue={new Date()}
                    label="Hora"
                    // error="No permitimos viajes en el tiempo, la hora tiene que ser en el futuro"
                    format="12"
                    required={event}
                    clearable
                  />
                  {/* <input type="time" name="time" id="time-is-value" /> */}
                </>
              )}
            </div>
            <Button
              type="submit"
              variant="filled"
              color="orange"
              size="md"
              className="w-full mt-4"
            >
              Enviar Post
            </Button>
          </form>
        </Container>
      </Protected.Route>
    </Layout>
  );
};

export default CrearPost;
