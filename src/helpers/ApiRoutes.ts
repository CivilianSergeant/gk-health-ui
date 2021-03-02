export enum ApiRoutes{
    DOMAIN = 'http://localhost:8081',
    BASE_PATH = 'http://localhost:8181/api/',
    AUTH_BASEPATH = 'http://103.26.136.30:8080',
    AUTH_PATH = 'http://103.26.136.30:8080/auth',
    REALM_PATH = 'http://103.26.136.30:8080/auth/realms/GK_HEALTH',
    LOGOUT_PATH='http://103.26.136.30:8080/auth/realms/GK_HEALTH/protocol/openid-connect/logout',
    USER_INFO_PATH='http://103.26.136.30:8080/auth/realms/GK_HEALTH/protocol/openid-connect/userinfo',
    USER_ACCOUNT_PATH='http://103.26.136.30:8080/auth/realms/GK_HEALTH/account',
    REFRESH_TOKEN='http://103.26.136.30:8080/auth/realms/GK_HEALTH/protocol/openid-connect/token',
    VERSION = 'v1',
    ALL_CENTERS = '/health-center',
    ADD_CENTER  = '/health-center/add',
    ALL_EMPLOYEES = '/employee',
    ADD_EMPLOYEE = '/employee/add',
    ALL_CATEGORIES = '/service-category',
    ADD_CATEGORY = '/service-category/add',
    ALL_SERVICES = '/service',
    ADD_SERVICE = '/service/add',
    UPDATE_SERVICE = '/service/update',
    GET_SERVICE_BY_ID = '/service/:id',
    ADD_SERVICE_ATTRIBUTES = '/service-attribute/add',
    SERVICE_ATTRIBUTE_BY_ID = '/service-attribute/:id',
    ALL_PATIENTS = '/patient',
    ADD_PATIENT = '/patient/add',
    PATIENT_CARD_REGISTRATION = '/patient/card-registration',
    PATIENT_INVOICE_CREATE = '/patient/invoice/create',
    GET_PATIENT_BY_ID = '/patient/:id',
    GET_PATIENT_BY_PID = '/patient/by-pid/:id',
    ALL_LAB_TEST_GROUP = '/lab-test-groups',
    ALL_LAB_TEST_UNIT = '/service-units'
}

export function GetApiRoute(route: string,value=""){
    
    let _route = route;
    if(_route == ApiRoutes.GET_SERVICE_BY_ID){
        if(value !=null){
            _route = route.replace(":id",value);
        }
    }

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
    
    if(_route.match(':id')){
        if(value != null){
            _route = route.replace(":id",value);
        }
    }
    console.log(ApiRoutes.BASE_PATH+ApiRoutes.VERSION+_route);
    return ApiRoutes.BASE_PATH+ApiRoutes.VERSION+_route;
}
