import {ActiveTodoPipe} from './active-todo.pipe';

describe('ActiveTodoPipe', () => {
  it('create an instance', () => {
    const pipe = new ActiveTodoPipe();
    expect(pipe).toBeTruthy();
  });
});
