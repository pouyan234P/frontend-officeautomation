import { GetDepartmentModel } from "./getDepartmentModel";
import { GetuserModel } from "./getuserModel";

export interface GetPosition { 
    id: number;
    title: string;
    depID: GetDepartmentModel;
    userID: GetuserModel;
}
