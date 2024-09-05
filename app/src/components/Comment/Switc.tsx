import { Switch } from "@mantine/core";
import { useController, useWatch } from "react-hook-form";
import { DEFAULT_COLOR } from "@lib/constants";

interface Props { control: any, name: string, label: string, def?: boolean, color?: string, size?: 'md' | 'sm' | 'lg' | 'xs' | 'xl' }

function Switc({ control, name, label, def, color, size }: Props) {
  const {
    field,
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
  });


  return (
    <Switch
      checked={field.value}
      mt="sm"
      mb="md"
      defaultChecked={def || false}
      label={label}
      size={size || "sm"}
      color={color || DEFAULT_COLOR}
      onChange={field.onChange} // send value to hook form 
      onBlur={field.onBlur} // notify when input is touched/blur
      value={field.value} // input value
      name={field.name} // send down the input name
      ref={field.ref} // send input ref, so we can focus on input when error appear
    />
  );
}

export default Switc