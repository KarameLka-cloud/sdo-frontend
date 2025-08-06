const formattedDate: () => string = (): string => {
    const date: Date = new Date();
    const optionsDate: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };
    const optionsWeekday: Intl.DateTimeFormatOptions = {
        weekday: "long",
    };
    const formattedDate: string = date.toLocaleDateString("ru-RU", optionsDate);
    const formattedWeekday: string = date.toLocaleDateString("ru-RU", optionsWeekday);
    return `${formattedDate} г., ${formattedWeekday}`;
};

const dateNow = formattedDate();

export default dateNow;
