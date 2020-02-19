import gql from 'graphql-tag';

export const TODOS_GET_QUERY = gql`
  query allPosts {
    todos {
      _id
      title
      status
      created_at
    }
  }
`;

export const TODOS_CREATE_QUERY = gql`
  mutation newItem($newTodoData: TodoInput!){
    create(newTodoData: $newTodoData) {
      _id
      title
      created_at
      created_by
    }
  }
`;

export const TODOS_UPDATE_QUERY = gql`
  mutation updateItem($newTodoData: TodoInput!){
    update(newTodoData: $newTodoData)
  }
`;
