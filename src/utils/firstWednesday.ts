import {
  format,
  isAfter,
  isSameDay,
  isWednesday,
  nextWednesday,
  startOfMonth,
} from "date-fns";

function firstWednesdayOfMonth(date: Date): Date {
  const firstOfMonth = startOfMonth(date);
  return isWednesday(firstOfMonth) ? firstOfMonth : nextWednesday(firstOfMonth);
}

const today = new Date();
let target = firstWednesdayOfMonth(today);

if (isAfter(today, target) && !isSameDay(today, target)) {
  target = firstWednesdayOfMonth(
    new Date(today.getFullYear(), today.getMonth() + 1, 1),
  );
}

export default format(target, "dd.MM.yyyy");
