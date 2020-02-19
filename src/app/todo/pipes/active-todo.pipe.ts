import {Pipe, PipeTransform} from '@angular/core';
import {Todo} from '../model/todo.interface';

@Pipe({
  name: 'activeTodo'
})
export class ActiveTodoPipe implements PipeTransform {

  transform(value: Todo[], status: boolean): Todo[] {
    if (value) {
      return value.filter(item => item.status === status);
    }
  }

}
