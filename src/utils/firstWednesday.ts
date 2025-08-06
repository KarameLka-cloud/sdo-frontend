const firstWednesday: () => string = (): string => {
    const today = new Date();
    let year: number = today.getFullYear();
    let month: number = today.getMonth();

    let firstWednesday: Date = new Date(year, month, 1);

    while (firstWednesday.getDay() !== 3) {
        firstWednesday.setDate(firstWednesday.getDate() + 1);
    }

    if (today > firstWednesday) {
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }

        firstWednesday = new Date(year, month, 1);

        while (firstWednesday.getDay() !== 3) {
            firstWednesday.setDate(firstWednesday.getDate() + 1);
        }
    }

    const day: string = String(firstWednesday.getDate()).padStart(2, '0');
    const monthFormatted: string = String(firstWednesday.getMonth() + 1).padStart(2, '0');
    const yearFormatted: string = String(firstWednesday.getFullYear());

    return `${day}.${monthFormatted}.${yearFormatted}`;
}

export const firstWednesdayData = firstWednesday();
