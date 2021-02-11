import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';
import { Category } from '@/entity/Category';

export class CategoryService{

    private categories: Category[] = [];

    async getCategories(): Promise<Category[]>{
        const response = await axios.get(GetApiRoute(ApiRoutes.ALL_CATEGORIES));
        if(response.status == 200){
            response.data.map((obj: Category)=>{
                this.categories.push(obj)
            });
        }
        return this.categories;
    }
}