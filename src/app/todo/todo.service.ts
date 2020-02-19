import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Todo} from '@app/todo/model/todo.interface';
import {TODOS_CREATE_QUERY, TODOS_GET_QUERY, TODOS_UPDATE_QUERY} from '@app/todo/model/todo.gql-schema';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(private apollo: Apollo) {
  }

  public getAllTodos() {
    return this.apollo.watchQuery({query: TODOS_GET_QUERY});
  }

  save(item: string) {
    const todo: any = {
      newTodoData: {
        title: item,
        status: true
      }
    };
    return this.apollo.mutate({mutation: TODOS_CREATE_QUERY, variables: todo});
  }

  update(item: Todo) {
    const todo: any = {
      newTodoData: {
        _id: item._id,
        title: item.title,
        status: item.status,
        created_at: item.created_at,
        created_by: item.created_by
      }
    };
    return this.apollo.mutate({mutation: TODOS_UPDATE_QUERY, variables: todo});
  }

  delete(id: string) {

  }
}
