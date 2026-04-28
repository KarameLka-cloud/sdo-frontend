export default function convertDate(inputDate?: string | null): string {
  if (!inputDate) {
    return "—";
  }

  const normalizedDate = inputDate.split("T")[0];
  const [year, month, day]: string[] = normalizedDate.split("-");

  if (!year || !month || !day) {
    return "—";
  }

  return `${day}.${month}.${year}`;
}
