export interface Customer {
    id?: number;
    firstName: string;
    lastName: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zipCode: string;
    email: string;
    phoneNumber: string;
    dogs?: Dog[];
}

export interface NewCustomer extends Customer {
    password: string;
}

export interface Dog {
    id: number;
    name: string;
    breed: string;
    owner_id: number;
    notes: Note[]
}

export interface Note {
    id?: number;
    message: string;
    dog_id?: number;
    groomer: {id: number, firstName: string, lastName: string};
    created_on?: Date;
    updated_on?: Date;
}

export interface NoteRequest {
    id?: number;
    message: string;
    groomer_id: number;
}