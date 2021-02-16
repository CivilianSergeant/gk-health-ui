import { LocalStorageService } from './LocalStorageService';

export class NavigationService{

    private localStorageService!: LocalStorageService;

    setLocalStorageService(localStorageService: LocalStorageService){
        this.localStorageService = localStorageService;
    }

    redirect(view: any,route: string){
        if(view.referrer != undefined || view.referrer != null){
            view.$router.push({name:view.referrer,params:{pid:view.form.pid}});
            this.localStorageService.clear('referrer');
        }else{
            view.$router.push({name:route});
        }
    }

}