export interface Groomer {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    availability: Availability;
    biography: string;
    photo: string;
    photoData: string;
};

export interface Availability {
    sun?: {start: string, end: string},
    mon?: {start: string, end: string},
    tue?: {start: string, end: string},
    wed?: {start: string, end: string},
    thu?: {start: string, end: string},
    fri?: {start: string, end: string},
    sat?: {start: string, end: string},
}