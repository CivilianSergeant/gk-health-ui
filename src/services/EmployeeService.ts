import { Employee } from '@/entity/Employee';
import axios from 'axios';
import { GetApiRoute, ApiRoutes, setAuthorizationToken, handleException } from '@/helpers/ApiRoutes';
import store from '@/store';



export class EmployeeService{

    private employees: Employee[] = [];
    private employee!: Employee;

    async getEmployees(q: any): Promise<any>{
        const auth = store.getters.auth;
        try{
            const result = await axios.get(GetApiRoute(ApiRoutes.ALL_EMPLOYEES)
            +`?centerId=${q.center}&employeeCode=${q.employeeCode}&fullName=${q.fullName}&contactNo=${q.contactNo}&email=${q.email}`+
            `&page=${q.page}&size=${q.size}&sortBy=${q.sortBy}&sortDesc=${q.sortDesc}`,
            setAuthorizationToken(auth.token));
            if(result.status==200){
                this.employees = result.data.object;
            }

            return this.employees;
        }catch(error){
            handleException(error);
        }
    } 

    async getDoctors(): Promise<any>{
        const auth: any = store.getters.auth;
        try{
            const response = await axios.get(GetApiRoute(ApiRoutes.GET_DOCTORS),
            setAuthorizationToken(auth.token));
            if(response.status == 200){
                this.employees = response.data.collection;
            }
        }catch(e){
            handleException(e);
        }
        return this.employees;
    }

    async getRemoteEmployees(): Promise<any>{
        const auth: any =  store.getters.auth;
        try{
            const result = await axios.get(GetApiRoute(ApiRoutes.ALL_REMOTE_EMPLOYEES),
            setAuthorizationToken(auth.token));
            if(result.status==200){
                result.data.map((obj: Employee) => {obj._showDetails=true; this.employees.push(obj)});
            }

            return this.employees;
        }catch(error){
            handleException(error);
        }
    } 

    async getEmployeeByApiId(id: number): Promise<any>{
        const auth: any =  store.getters.auth;
        try{
            const result = await axios.get(GetApiRoute(ApiRoutes.EMPLOYEE_BY_API_ID,id.toString()),
            setAuthorizationToken(auth.token));
            if(result.status == 200){
                this.employee = result.data.object;
            }
            return this.employee;
        }catch(error){
            handleException(error);
        }
    }
}