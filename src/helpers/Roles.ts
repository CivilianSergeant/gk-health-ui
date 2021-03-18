export enum Role{
    PARAMEDIC='Paramedic',
    Doctor='Doctor',
    HEALTH_ASSISTANT='Health Assistant',
    SUPER_ADMIN='Super Admin'
}

export function hasRole(_role: string, roles: string[]){
    return roles.filter(role=> role===_role);
}