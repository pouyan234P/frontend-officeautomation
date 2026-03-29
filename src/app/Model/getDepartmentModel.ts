export interface GetDepartmentModel { 
    id: number;
    name: string;
    parentID: number;
}
export interface DepartmentTreeNode extends GetDepartmentModel {
  children: DepartmentTreeNode[];
  isExpanded?: boolean;
}
