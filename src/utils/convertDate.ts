const convertDate = (inputDate: string): string => {
    const [year, month, day]: string[] = inputDate.split("-");
    return `${day}.${month}.${year}`;
}

export default convertDate;
