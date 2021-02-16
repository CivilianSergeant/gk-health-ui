export class LocalStorageService{

    set(key: string, value: string){
        window.localStorage.setItem(key,value);
    }

    get(key: string){
        return window.localStorage.getItem(key);
    }

    clear(key: string){
        window.localStorage.removeItem(key);
    }

    getReferrer(callback: any ,view: any){
        let referrer = (view.$route.params.referrer != undefined)? view.$route.params.referrer : null;
        console.log('h',this.get('referrer'));
      if(this.get('referrer') != undefined){
        referrer = this.get('referrer');
      }
      callback(referrer);
    }
}