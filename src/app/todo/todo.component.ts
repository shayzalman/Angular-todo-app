import {Component, OnInit} from '@angular/core';
import {TodosService} from './todo.service';
import {Todo} from './model/todo.interface';
import {AuthenticationService, User} from '@app/auth/authentication.service';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatSnackBar} from '@angular/material/snack-bar';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos: Todo[];
  user: User = null;
  responseErrors: { message?: string, action?: string } = {};
  // @ts-ignore
  emailFormControl = new FormControl({value: '', disabled: true}, [
    Validators.required,
    Validators.maxLength(20),
  ]);
  matcher = new MyErrorStateMatcher();
  maxlength = 148;

  constructor(
    private todosService: TodosService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {
    authService.currentUser.subscribe(obs => {
      this.user = obs;
      if (this.user) {
        this.emailFormControl.enable();
      } else {
        this.emailFormControl.disable();
      }
    });
  }

  ngOnInit(): void {
    this.todosService
      .getAllTodos()
      .valueChanges
      .subscribe(
        // @ts-ignore
        result => this.todos = result.data.todos
      );
  }

  updateState(todo: Todo) {
    if (!this.user) {
      this.responseErrors.message = 'Please login first';
      this.responseErrors.action = '401';
      this.openSnackBar(this.responseErrors);
      return false;
    }
    this.todos.map(item => {
      if (item._id === todo._id) {
        this.todosService.update(item)
          .subscribe(
            result => {
              if (result.errors && result.errors.length > 0) {
                // @ts-ignore
                this.responseErrors.message = result.errors[0].message.error;
                // @ts-ignore
                this.responseErrors.action = result.errors[0].message.statusCode;
                this.openSnackBar(this.responseErrors);
                // @ts-ignore
                if (result.errors[0].message.statusCode === 401) {
                  this.authService.currentUserValue = null;
                }
              } else {
                item.status = !item.status;
                this.todos = [...this.todos];
                this.responseErrors.message = 'item updated';
                this.responseErrors.action = 'V';
                this.openSnackBar(this.responseErrors);
                console.log(result);
              }
            },
            error => {
              this.responseErrors.message = 'An Error occurred';
              this.responseErrors.action = '500';
              this.openSnackBar(this.responseErrors);
            }
          );
      }
    });
    return false;
  }

  saveTodo(event: any) {
    this.todosService.save(event.target.value)
      .subscribe(
        result => {
          if (result.errors && result.errors.length > 0) {
            // @ts-ignore
            this.responseErrors.message = result.errors[0].message.error;
            // @ts-ignore
            this.responseErrors.action = result.errors[0].message.statusCode;
            this.openSnackBar(this.responseErrors);
            this.authService.currentUserValue = null;
          } else {
              // @ts-ignore
            if (result.data && result.data.create) {
              // @ts-ignore
              // tslint:disable-next-line:prefer-const
              let res = result.data.create;
              // tslint:disable-next-line:prefer-const
              let newTodo: Todo = {
                status: true,
                _id: res._id,
                title: res.title,
                created_at: res.created_at,
                created_by: res.created_by
              };
              this.todos.unshift(newTodo);
              this.todos = [...this.todos];
              this.emailFormControl.setValue('');
            }
          }
        },
        error => console.error(error)
      );
  }

  delete(id: string) {
    this.todosService.delete(id);
  }

  openSnackBar(data) {
    this.snackBar.open(data.message, data.action, {
      duration: 2000,
    });
  }
}
