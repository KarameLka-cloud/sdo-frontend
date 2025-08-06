const firstWednesday = (): string => {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();

    let firstWednesday = new Date(year, month, 1);

    while (firstWednesday.getDay() !== 3) { // 3 = среда
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

    const day = String(firstWednesday.getDate()).padStart(2, '0');
    const monthFormatted = String(firstWednesday.getMonth() + 1).padStart(2, '0');
    const yearFormatted = firstWednesday.getFullYear();

    return `${day}.${monthFormatted}.${yearFormatted}`;
}

export const firstWednesdayData = firstWednesday();
