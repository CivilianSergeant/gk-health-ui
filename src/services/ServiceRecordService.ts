import { Invoice } from "@/entity/Invoice";
import { ApiRoutes, GetApiRoute, handleException, setAuthorizationToken } from "@/helpers/ApiRoutes";
import store from "@/store";
import axios from "axios";

export class ServiceRecordService {

     private invoice!: Invoice;
     private serviceRecords: Record<string, any>[] = [];

     async getServiceRecords(centerId: number, centerCode: string, officeTypeId: number,
          fromDate: Date, toDate: Date): Promise<any> {

          let response: any = '';

          const auth = store.getters.auth;

          const route = ApiRoutes.ALL_SERVICE_RECORD;
          if (fromDate != undefined && toDate != undefined) {

               response = await axios.post(GetApiRoute(route), {
                    centerCode: centerCode,
                    centerId: centerId,
                    officeTypeId: officeTypeId,
                    toDate: toDate, fromDate: fromDate
               }, setAuthorizationToken(auth.token));

          } else {
               response = await axios.get(GetApiRoute(route), setAuthorizationToken(auth.token));

          }

          if (response.status == 200) {
               this.serviceRecords = response.data.collection;
          }
          return this.serviceRecords;


     }

     async getInvoiceById(id: number): Promise<any> {
          const auth = store.getters.auth;
          try {
               const response = await axios.get(GetApiRoute(ApiRoutes.GET_INVOICE_RECORD_BY_ID, id.toString()),
                    setAuthorizationToken(auth.token));
               if (response.status == 200) {
                    this.invoice = response.data;
               }

               return this.invoice;
          } catch (error) {
               handleException(error);
          }
     }
}