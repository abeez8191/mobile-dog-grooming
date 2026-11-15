export interface Appointment {
    id?: number;
    groomer: number;
    customer: number;
    datetime: Date;
    services: number[];
}