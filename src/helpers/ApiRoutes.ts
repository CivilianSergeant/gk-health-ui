export enum ApiRoutes{
    DOMAIN = 'http://localhost',
    BASE_PATH = 'http://localhost:8181/api/',
    VERSION = 'v1',
    ALL_CENTERS = '/health-center',
    ADD_CENTER  = '/health-center/add',
    ALL_EMPLOYEES = '/employee',
    ADD_EMPLOYEE = '/employee/add',
    ALL_CATEGORIES = '/service-category',
    ALL_SERVICES = '/service',
    ALL_PATIENTS = '/patient',
    ADD_PATIENT = '/patient/add',
    GET_PATIENT_BY_ID = '/patient/:id'
}

export function GetApiRoute(route: string,value=""){
    console.log(ApiRoutes.BASE_PATH+ApiRoutes.VERSION+route);
    let _route = route;
    if(_route == ApiRoutes.GET_PATIENT_BY_ID){
        if(value !=null){
            _route = route.replace(":id",value);
        }
    }
    return ApiRoutes.BASE_PATH+ApiRoutes.VERSION+_route;
}
