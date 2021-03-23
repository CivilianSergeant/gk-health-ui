import { Employee } from '@/entity/Employee';
import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';
import store from '@/store';

export class EmployeeService{

    private employees: Employee[] = [];

    async getEmployees(): Promise<Employee[]>{
        const result = await axios.get(GetApiRoute(ApiRoutes.ALL_EMPLOYEES));
        if(result.status==200){
            result.data.map((obj: Employee) => {obj._showDetails=true; this.employees.push(obj)});
        }

        return this.employees;
    } 

    async getRemoteEmployees(): Promise<Employee[]>{
        const result = await axios.get(GetApiRoute(ApiRoutes.ALL_REMOTE_EMPLOYEES),{
            headers: {
              'Authorization': 'Bearer '+ store.state.auth.token
            }
        });
        if(result.status==200){
            result.data.map((obj: Employee) => {obj._showDetails=true; this.employees.push(obj)});
        }

        return this.employees;
    } 
}