import format from "date-fns/format";

export function generateSlug(input: string) {
  return input
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .replace(/ +/g, "-") //  merge multiple spaces in a row
    .replace(/\s/g, "-")
    .toLowerCase();
}

export const formatDate = (date: string) => {
  return format(new Date(date), "MMMM d, yyyy");
};
