import { Switch } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useController, useForm } from "react-hook-form";

interface Props { control:any, name:string, label:string, required:boolean }

function DatePick({ control, name, label, required }:Props) {
  const {
    field,
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields }
  } = useController({
    name,
    control,
    rules: { required },
  });

  return (
    <DatePickerInput
      required={required}//{watch("isEvent")}
      locale="es"
      placeholder="Escojer Dia De Reunion"
      // transition="pop-bottom-left"
      label={label}
      color="orange"
      onChange={field.onChange} // send value to hook form 
      onBlur={field.onBlur} // notify when input is touched/blur
      value={field.value} // input value
      name={field.name} // send down the input name
      ref={field.ref} // send input ref, so we can focus on input when error appear
    />
  );
}

export default DatePick