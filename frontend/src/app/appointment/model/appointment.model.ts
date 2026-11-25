import { Customer, Dog } from "src/app/customer/model/customer.model";
import { Groomer } from "src/app/groomer/model/groomer.model";
import { Service } from "src/app/grooming-service/model/services.model";

export interface NewAppointmentRequest {
    groomer_id: number;
    customer_id: number;
    dog_id: number;
    datetime: Date;
    service_ids: number[];
    completed_on?: Date;
}

export interface UpdateAppointmentRequest extends NewAppointmentRequest {
    id: number;
}

export interface AppointmentResponse {
    id: number;
    groomer: Groomer;
    customer: Customer;
    dog: Dog;
    datetime: Date;
    services: Service[];
    completed_on?: Date;
}

export function convertAppointmentResponseToUpdateAppointmentRequest(request: AppointmentResponse): UpdateAppointmentRequest {
    return {
        id: request.id,
        groomer_id: request.groomer.id!,
        customer_id: request.customer.id!,
        dog_id: request.dog.id,
        datetime: request.datetime,
        service_ids: request.services.map(s => s.id!),
        completed_on: request.completed_on
    };
}