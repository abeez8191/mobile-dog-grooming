import { Customer } from "src/app/customer/model/customer.model";
import { Groomer } from "src/app/groomer/model/groomer.model";
import { Service } from "src/app/grooming-service/model/services.model";

export interface Appointment {
    id?: number;
    groomer_id?: number;
    groomer?: Groomer;
    customer_id?: number;
    customer?: Customer;
    datetime: Date;
    service_ids?: number[];
    services?: Service[];
}