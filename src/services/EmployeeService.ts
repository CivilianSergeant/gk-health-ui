import { Employee } from '@/entity/Employee';
import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';
import store from '@/store';



export class EmployeeService{

    private employees: Employee[] = [];
    private employee!: Employee;

    async getEmployees(): Promise<Employee[]>{
        const result = await axios.get(GetApiRoute(ApiRoutes.ALL_EMPLOYEES));
        if(result.status==200){
            result.data.map((obj: Employee) => {obj._showDetails=true; this.employees.push(obj)});
        }

        return this.employees;
    } 

    

    async getRemoteEmployees(): Promise<Employee[]>{
        const auth: any =  store.getters.auth;
        const result = await axios.get(GetApiRoute(ApiRoutes.ALL_REMOTE_EMPLOYEES),{
            

            headers: {
              'Authorization': 'Bearer '+ auth.token
            }
        });
        if(result.status==200){
            result.data.map((obj: Employee) => {obj._showDetails=true; this.employees.push(obj)});
        }

        return this.employees;
    } 

    async getEmployeeByApiId(id: number): Promise<Employee>{
        const result = await axios.get(GetApiRoute(ApiRoutes.EMPLOYEE_BY_API_ID,id.toString()));
        if(result.status == 200){
            this.employee = result.data.object;
        }
        return this.employee;
    }
}