import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Todo} from './model/todo.interface';

@Directive({
  selector: '[appCompareTodo]',
  providers: [{provide: NG_VALIDATORS, useExisting: CompareValidatorDirective, multi: true}]
})
export class CompareValidatorDirective implements Validator {
  @Input('appCompareTodo') input: Todo[];

  validate(control: AbstractControl): { [key: string]: any } | null {
    const match = this.input ? this.input.find(item => item.title === control.value) : null;
    if (match) {
      return {'existing-value': {value: control.value}};
    }
    return null;
  }
}
