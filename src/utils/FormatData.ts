import { format } from "date-fns";

export function formatData(date: Date): string {
  return format(date, "dd/MM/yyyy");
}
