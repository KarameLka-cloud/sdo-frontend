type Event = {
    id: number;
    title: string;
    description: string;
    department: string;
    time: string;
    date: string;
};

export type EventType = {
    event: Event;
    mutation?: any;
}
