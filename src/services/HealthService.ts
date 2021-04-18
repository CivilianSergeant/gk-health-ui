import { Service } from '@/entity/Service';
import axios from 'axios';
import { GetApiRoute, ApiRoutes, handleException, setAuthorizationToken } from '@/helpers/ApiRoutes';
import { LabTestUnit } from '@/entity/LabTestUnit';
import store from '@/store';

export class HealthService{

    private services: Service[] = [];

    async getServices(): Promise<any> {
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_SERVICES),
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                response.data.map((obj: Service) => this.services.push(obj));
            }
            return this.services;
        }catch(error){
            handleException(error);
        }
    }

    async getLabServices(): Promise<any> {
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.LAB_SERVICES),
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                response.data.map((obj: Service) => this.services.push(obj));
            }
            return this.services;
        }catch(error){
            handleException(error);
        }
    }

    async findServicesById(id: string): Promise<any> {
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_SERVICE_BY_ID,id),
            setAuthorizationToken(auth.token));
            let service!: Service;
            if(response.status == 200){
                service=response.data;
            }
            return service;
        }catch(error){
            handleException(error);
        }
    }

    async getServiceUnits(): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.ALL_LAB_TEST_UNIT),
            setAuthorizationToken(auth.token));
            let units!: LabTestUnit[];
            if(response.status == 200){
                units=response.data;
            }
            return units;
        }catch(error){
            handleException(error);
        }
    }

    async addServiceAttributes(payload: Record<string, any>): Promise<any>{
        const auth = store.getters.auth;
        try{
            const response = await axios.post(GetApiRoute(ApiRoutes.ADD_SERVICE_ATTRIBUTES),payload,
            setAuthorizationToken(auth.token));
            let service!: Service;
            if(response.status == 200){
                service = response.data.service;
                store.commit('setSuccessMsg','Attributes updated');
            }else{
                store.commit('setErrorMessage',response.data.message);
            }
            return service;
        }catch(error){
            handleException(error);
        }
    }


    
}