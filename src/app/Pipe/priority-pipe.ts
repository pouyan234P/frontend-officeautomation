import { Pipe, type PipeTransform } from '@angular/core';
import { Priorityenum } from '../Model/enumletter/Priorityenum';

@Pipe({
  name: 'priorityEnum',
  standalone: true
})
export class PriorityPipe implements PipeTransform {

  transform(value: number): string {
     return Priorityenum[value] || 'Unknown';
  }

}
