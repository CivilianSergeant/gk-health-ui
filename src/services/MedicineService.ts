export class MedicineService{

    private medicines: Record<string, any>[] = [];

    async getMedicines(): Promise<Record<string, any>[]>{
        return [
            {id:1,name:"Napa"},
            {id:2,name:"Monas"},
            {id:3,name:"Antazol 0.1%"},
            {id:4,name:"sergel 20"}
        ]
    }
}