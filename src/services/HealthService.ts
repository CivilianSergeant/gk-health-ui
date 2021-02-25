import { Service } from '@/entity/Service';
import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';

export class HealthService{

    private services: Service[] = [];

    async getServices(): Promise<Service[]> {
        const response = await axios.get(GetApiRoute(ApiRoutes.ALL_SERVICES));
        if(response.status == 200){
            response.data.map((obj: Service) => this.services.push(obj));
        }
        return this.services;
    }

    async findServicesById(id: string): Promise<Service> {
        const response = await axios.get(GetApiRoute(ApiRoutes.GET_SERVICE_BY_ID,id));
        let service!: Service;
        if(response.status == 200){
            service=response.data;
        }
        return service;
    }


    
}