export enum Role{
    PARAMEDIC='Paramedic',
    Doctor='Doctor',
    HEALTH_ASSISTANT='Health Assistant',
    SUPER_ADMIN='Super Admin'
}

export function hasRole(roles: string[]){
    roles = roles.filter(r=> r!='offline_access' && r!='uma_authorization')
    
    return (roles.length>0)? roles[0]:null;
}