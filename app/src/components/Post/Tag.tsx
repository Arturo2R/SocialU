import { Badge } from "@mantine/core";
import config from "@lib/config";

const conf = config();

export function Tag({ label }: { label: string; }): JSX.Element {
    return <Badge color={conf.categories.find(c => c.value === label)?.color} size="sm" autoContrast variant="light">{label}</Badge>;
}
