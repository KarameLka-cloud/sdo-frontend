export const convertTime = (inputTime: string): string => {
    return `${inputTime.split(":")[0]}:${inputTime.split(":")[1]}`;
}
