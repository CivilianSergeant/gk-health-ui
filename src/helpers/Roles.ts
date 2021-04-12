export enum Role{
    PARAMEDIC='Paramedic',
    Doctor='Doctor',
    HEALTH_ASSISTANT='Health Assistant',
    SUPER_ADMIN='Super Admin'
}

export function hasRole(auth: any){
    
    
    const realmRoles: string[] = auth.realmAccess.roles;

    const accountRoles: string[] = (auth.resourceAccess['demo-vue-app'] != undefined)? auth.resourceAccess['demo-vue-app'].roles : [];
    let role: any = (accountRoles.length>0)? accountRoles[0] : null;
    if(role == null || role==""){
        const roles = realmRoles.filter(r=> r!='offline_access' && r!='uma_authorization')
        role = (roles.length>0)? roles[0]:null;
    }
    
    
    return role;
}