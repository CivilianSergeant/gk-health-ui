export enum ApiRoutes{
    DOMAIN = 'http://localhost:8081',
    BASE_PATH = 'http://localhost:8282/api/',
    AUTH_BASEPATH = 'http://103.26.136.30:8080',
    AUTH_PATH = 'http://103.26.136.30:8080/auth',
    REALM_PATH = 'http://103.26.136.30:8080/auth/realms/GK_HEALTH',
    LOGOUT_PATH='http://103.26.136.30:8080/auth/realms/GK_HEALTH/protocol/openid-connect/logout',
    USER_INFO_PATH='http://103.26.136.30:8080/auth/realms/GK_HEALTH/protocol/openid-connect/userinfo',
    USER_ACCOUNT_PATH='http://103.26.136.30:8080/auth/realms/GK_HEALTH/account',
    REFRESH_TOKEN='http://103.26.136.30:8080/auth/realms/GK_HEALTH/protocol/openid-connect/token',
    VERSION = 'v1',

    // Centers
    ALL_CENTERS = '/health-center',
    ADD_CENTER  = '/health-center/add',
    GET_CENTERS_BY_KEYWORD = '/health-center/by-keyword/:id',

    ALL_EMPLOYEES = '/employee',
    ALL_REMOTE_EMPLOYEES = '/employee/remote-employees',
    ADD_EMPLOYEE = '/employee/add',
    EMPLOYEE_BY_API_ID = '/employee/api-id/:id',

    //Service Category  Routes
    ALL_CATEGORIES = '/service-category',
    ADD_CATEGORY = '/service-category/add',
    GET_SERVICIE_CATEGORY_BY_ID = '/service-category/:id',


  //Service  Routes
    ALL_SERVICES = '/service',
    ADD_SERVICE = '/service/add',
    UPDATE_SERVICE = '/service/update',
    LAB_SERVICES = '/service/lab-services',
    GET_SERVICE_BY_ID = '/service/:id',
    ADD_SERVICE_ATTRIBUTES = '/service-attribute/add',
    SERVICE_ATTRIBUTE_BY_ID = '/service-attribute/:id',

    //Service Records  Routes
    ALL_SERVICE_RECORD = '/report/service-records',
    ALL_SERVICE_RECORD_WITH_DATE = '/report/service-records/:fromDate/:toDate',

    //Medicine Routs
    ALL_MEDICINE = '/medicine',
    ADD_MEDICINE = '/medicine/add',
    GET_MEDICINE_BY_ID = '/medicine/:id',

    ALL_MEDICINE_BRAND = '/medicine-brand',
    ADD_MEDICINE_BRAND = '/medicine-brand/add',
    ALL_MEDICINE_GROUP = '/medicine-group',
    ADD_MEDICINE_GROUP = '/medicine-group/add',

    // Patient Routes
    ALL_PATIENTS = '/patient',
    ADD_PATIENT = '/patient/add',
    PATIENT_CARD_REGISTRATION = '/patient/card-registration',
    GET_PATIENT_BY_ID = '/patient/:id',
    GET_PATIENT_BY_PID = '/patient/by-pid/:id',
    GET_PATIENTIDS_BY_PID = '/patient/patient-ids/:id',
    ADD_PATIENT_FROM_CARD_MEMBER = '/patient/add/from-member',

    // Patient Invoice Routes
    PATIENT_INVOICE_CREATE = '/invoice/create',
    PATIENT_INVOICE_NUMBERS_BY_KEYWORD = '/invoice/invoice-numbers/:id',
    PATIENT_INVOICE_BY_ID = '/invoice/by-id/:id',

    ALL_FEEDING_RULES = '/feeding-rules',
    ALL_LAB_TEST_GROUP = '/lab-test-groups',
    ALL_LAB_TEST_UNIT = '/service-units',
    ALL_SPECIMENS = '/specimens',

    // Prescription Routes
    GET_PRESCRIPTION_PATIENT_AND_INVOICE = '/prescription/:patientId/:invoiceId',
    GET_PRESCRIPTION_BY_ID = '/prescription/:id',
    ADD_PRESCRIPTION = '/prescription/add',
    ALL_PRESCRIPTION = '/prescription',

    GET_LAB_TEST_BY_PATIENT_INVOICE_SERVICE = '/lab-test/:patientId/:invoiceId/:serviceId',
    GET_LAB_TEST_BY_ID = '/lab-test/:id',
    ADD_LAB_TEST = '/lab-test/add',
    GET_LAB_TEST_ALL = '/lab-test',

    GET_AVAILABLE_MENUS = '/menus/available-menus',
    GET_ROLES = '/roles',
    ADD_ROLE_PERMISSION = '/roles/permissions'
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
