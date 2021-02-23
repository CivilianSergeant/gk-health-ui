export class UserService{

    

    static async getUserInfo(userInfoEndPoint: string,token: string) {
        const result = await fetch(userInfoEndPoint,{
          method: 'get', 
          headers: new Headers({
            'Authorization': 'Bearer '+token, 
            'Content-Type': 'application/x-www-form-urlencoded'
          })
      
        });
        const user = await result.json();
        return user;
      }
}