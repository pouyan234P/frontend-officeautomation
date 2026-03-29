import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NewDept } from "../newDept/newDept";
import { DepartmentTreeNode, GetDepartmentModel } from '../Model/getDepartmentModel';
import { DepartmentService } from '../Services/departmentService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orgchart',
  imports: [CommonModule, NewDept,FormsModule],
  
  templateUrl: './orgchart.html',
  styleUrl: './orgchart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Orgchart implements OnInit {
  mydept: GetDepartmentModel[]=[];
  newdept: any={};
  isModalOpen = false;
  openModal()  { this.isModalOpen = true;  }
  closeModal() { this.isModalOpen = false; }
  departmentTree: DepartmentTreeNode[] = [];
  selectedDept: DepartmentTreeNode | null = null;
  ngOnInit(): void {
    this.loadDept();
    this.departmentTree = this.buildTree(this.mydept);
    if (this.departmentTree.length > 0) {
      this.selectDept(this.departmentTree[0]);
    }
  } 
  constructor(private service: DepartmentService,private cdr: ChangeDetectorRef)
  {

  }
  loadDept()
  {
    this.service.getDepartment().subscribe(
      {
        next: (data)=>
        {
          this.mydept=data;
          this.departmentTree = this.buildTree(this.mydept);
        
        // Select the first node if it exists
        if (this.departmentTree.length > 0) {
          this.selectDept(this.departmentTree[0]);
        }
        this.cdr.markForCheck();
      }
  })
  }
  onSave()
  {
    this.service.addDepartment(this.newdept).subscribe(
      {
        complete:()=>
        {
          
        }
      })
  }
  buildTree(list: GetDepartmentModel[]): DepartmentTreeNode[] {
    const map = new Map<number, DepartmentTreeNode>();
    const roots: DepartmentTreeNode[] = [];

    list.forEach(item => {
      // 2. Set isExpanded to true by default when building the map
      map.set(item.id, { ...item, children: [], isExpanded: true });
    });

    list.forEach(item => {
      if (item.parentID !== 0 && map.has(item.parentID)) {
        map.get(item.parentID)!.children.push(map.get(item.id)!);
      } else {
        roots.push(map.get(item.id)!);
      }
    });

    return roots;
  }

  selectDept(dept: DepartmentTreeNode) {
    this.selectedDept = dept;
  }

  // 3. New method to handle the + / - toggle click
  toggleExpand(event: Event, node: DepartmentTreeNode) {
    // This stops the click from also triggering the selectDept() on the row
    event.stopPropagation(); 
    node.isExpanded = !node.isExpanded;
  }
}
