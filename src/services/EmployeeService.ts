import { Employee } from '@/entity/Employee';
import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';

export class EmployeeService{

    private employees: Employee[] = [];

    async getEmployees(): Promise<Employee[]>{
        const result = await axios.get(GetApiRoute(ApiRoutes.ALL_EMPLOYEES));
        if(result.status==200){
            result.data.map((obj: Employee) => {obj._showDetails=true; this.employees.push(obj)});
        }

        return this.employees;
    } 
}