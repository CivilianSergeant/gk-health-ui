export enum ApiRoutes{
    DOMAIN = 'http://localhost',
    BASE_PATH = 'http://localhost:8181/api/',
    VERSION = 'v1',
    ALL_CENTERS = '/health-center',
    ADD_CENTER  = '/health-center/add',
    ALL_EMPLOYEES = '/employee',
    ADD_EMPLOYEE = '/employee/add',
    ALL_CATEGORIES = '/service-category',
    ADD_CATEGORY = '/service-category/add',
    ALL_SERVICES = '/service',
    ALL_PATIENTS = '/patient',
    ADD_PATIENT = '/patient/add',
    PATIENT_CARD_REGISTRATION = '/patient/card-registration',
    GET_PATIENT_BY_ID = '/patient/:id',
    GET_PATIENT_BY_PID = '/patient/by-pid/:id'
}

export function GetApiRoute(route: string,value=""){
    
    let _route = route;
    if(_route == ApiRoutes.GET_PATIENT_BY_ID){
        if(value !=null){
            _route = route.replace(":id",value);
        }
    }

    
    if(_route == ApiRoutes.GET_PATIENT_BY_PID){
        
        if(value !=null){
            _route = route.replace(":id",value);
            console.log(_route)
        }
    }
    console.log(ApiRoutes.BASE_PATH+ApiRoutes.VERSION+_route);
    return ApiRoutes.BASE_PATH+ApiRoutes.VERSION+_route;
}
