import axios from 'axios';
import { GetApiRoute, ApiRoutes } from '@/helpers/ApiRoutes';
import { Category } from '@/entity/Category';

export class CategoryService{

    private categories: Category[] = [];
    private serviceCategory = {}

    async getCategories(): Promise<Category[]>{
        const response = await axios.get(GetApiRoute(ApiRoutes.ALL_CATEGORIES));
        if(response.status == 200){
            response.data.map((obj: Category)=>{
                this.categories.push(obj)
            });
        }
        return this.categories;
    }

    async getServiceCategoryById(id: number): Promise<Category>{
        const response = await axios.get(GetApiRoute(ApiRoutes.GET_SERVICIE_CATEGORY_BY_ID,id.toString()));
        if(response.status==200){
            this.serviceCategory = response.data.object;
        }
        return this.serviceCategory;
    }
}