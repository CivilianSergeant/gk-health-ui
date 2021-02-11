import { Employee } from '@/entity/Employee';
import { Patient } from '@/entity/Patient';
import { Prescription } from '@/entity/Prescription';

export class Center {

    private _id!: bigint;
    private _apiOfficeId!: bigint;
    private _name!: string;
    private _centerCode!: string;
    private _address!: string;
    private _employees: Employee[]=[];
    private _patients: Patient[] = [];
    private _prescriptions: Prescription[] = [];

    Center(id: bigint, apiOfficeId: bigint,name: string,centerCode: string,address: string){
        this._id=id;
        this._apiOfficeId =apiOfficeId;
        this._name = name;
        this._centerCode = centerCode;
        this._address = address;
        // this._employees = employees;
        // this._patients = patients;
        // this._prescriptions = 
    }

    public get id(){
        return this._id;
    }

    public get apiOfficeId (){
        return this._apiOfficeId;
    }

    public get name (){
        return this._name;
    }

    public get centerCode (){
        return this._centerCode;
    }

    public get address(){
        return this._address;
    }
}