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

export interface Dog {
    name: string;
    breed: string;
    age: number;
    weight: number;
}