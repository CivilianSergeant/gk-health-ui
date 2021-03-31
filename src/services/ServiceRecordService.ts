import {ApiRoutes, GetApiRoute} from "@/helpers/ApiRoutes";
import axios from "axios";

export class ServiceRecordService{

    private serviceRecords: Record<string, any>[] = [];

     async getServiceRecords(fromDate: Date,toDate: Date): Promise<Record<string, any>[]>{
       
        let response: any = '';

        const route = ApiRoutes.ALL_SERVICE_RECORD;
        if(fromDate!=undefined && toDate!=undefined){
            
             response = await axios.post(GetApiRoute(route),{toDate:toDate,fromDate:fromDate});
             
        }else{
             response = await axios.get(GetApiRoute(route));
            
        }

        if(response.status==200){
            this.serviceRecords = response.data.collection;
        }
        return this.serviceRecords;

        // return [
        //     {id:1,name:"Tonima Hamid (003-202103102)",invoiceNumber:"INV-003-20210362-52",address:"test address",receivableAmount:1500,paid:500,createdAt:'2021-03-22'},
        //     {id:2,name:"Tonima Hamid (003-202103102)",invoiceNumber:"INV-003-20210362-52",address:"test address",receivableAmount:1500,paid:500,createdAt:'2021-03-22'},
        //     {id:3,name:"Tonima Hamid (003-202103102)",invoiceNumber:"INV-003-20210362-52",address:"test address",receivableAmount:1500,paid:500,createdAt:'2021-03-22'},
        //     {id:4,name:"Tonima Hamid (003-202103102)",invoiceNumber:"INV-003-20210362-52",address:"test address",receivableAmount:1500,paid:500,createdAt:'2021-03-22'},
        // ]
     }
}