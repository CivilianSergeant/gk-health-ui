import { Service } from '@/entity/Service';
import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';
import { LabTestUnit } from '@/entity/LabTestUnit';
import store from '@/store';

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

    async getServiceUnits(): Promise<LabTestUnit[]>{
        const response = await axios.get(GetApiRoute(ApiRoutes.ALL_LAB_TEST_UNIT));
        let units!: LabTestUnit[];
        if(response.status == 200){
            units=response.data;
        }
        return units;
    }

    async addServiceAttributes(payload: Record<string, any>): Promise<Service>{
        const response = await axios.post(GetApiRoute(ApiRoutes.ADD_SERVICE_ATTRIBUTES),payload);
        let service!: Service;
        if(response.status == 200){
            service = response.data.service;
            store.commit('setSuccessMsg','Attributes updated');
        }else{
            store.commit('setErrorMessage',response.data.message);
        }
        return service;
    }


    
}