export interface Groomer {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    availability: AvailabilityWithTimezone;
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

export interface AvailabilityWithTimezone extends Availability {
    timezone: string;
}

export type AvailabilityKey = keyof Availability;

export interface PublicGroomer {
    id: number;
    firstName: string;
    lastName: string;
    biography: string;
    photo: string;
    photoData: string;
}

export interface PublicGroomerAvailabilityResponse {
    available_slots: AvailabilitySlots;
}

export interface AvailabilitySlots {
    sun?: {date: string, times: string[][]};
    mon?: {date: string, times: string[][]};
    tue?: {date: string, times: string[][]};
    wed?: {date: string, times: string[][]};
    thu?: {date: string, times: string[][]};
    fri?: {date: string, times: string[][]};
    sat?: {date: string, times: string[][]};
}

export type AvailabilitySlotsKey = keyof AvailabilitySlots;