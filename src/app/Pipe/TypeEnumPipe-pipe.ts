import { Pipe, type PipeTransform } from '@angular/core';
import { Priorityenum } from '../Model/enumletter/Priorityenum';
import { Typeenum } from '../Model/enumletter/Typeenum';

@Pipe({
  name: 'typeEnum',
  standalone: true
})
export class TypeEnumPipePipe implements PipeTransform {

  transform(value: number): string {
    // Converts the number (0) to the string ("Normal")
    return Typeenum[value] || 'Unknown'; 
  }

}
