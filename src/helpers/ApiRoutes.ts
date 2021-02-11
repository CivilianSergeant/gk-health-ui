export enum ApiRoutes{
    BASE_PATH = 'http://localhost:8181/api/',
    VERSION = 'v1',
    ALL_CENTERS = '/health-center',
    ADD_CENTER  = '/health-center/add',
    ALL_EMPLOYEES = '/employee',
    ADD_EMPLOYEE = '/employee/add',
    ALL_CATEGORIES = '/service-category',
    ALL_SERVICES = '/service',
    ALL_PATIENTS = '/patient'
}

export function GetApiRoute(route: ApiRoutes){
    console.log(ApiRoutes.BASE_PATH+ApiRoutes.VERSION+route);
    return ApiRoutes.BASE_PATH+ApiRoutes.VERSION+route;
}
