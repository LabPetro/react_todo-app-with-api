import React from 'react';
import { Todo } from './types/Todo';
import { Status } from './types/status';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todosByStatus: (query?: Status) => Todo[];
  queryStatus: Status;
  deleteTodo: (id: number) => void;
  deletedIds: number[];
  tempTodo: Todo | null;
  updatingIds: number[];
  selectedTodo: Todo | null;
  newTitle: string;
  setNewTitle: (title: string) => void;
  updateTodo: (todo: Todo) => void;
  handleTitle: (e: React.FormEvent) => void;
  escapeKeyHandler: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  doubleClick: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  queryStatus,
  todosByStatus,
  deleteTodo,
  deletedIds,
  tempTodo,
  updatingIds,
  selectedTodo,
  newTitle,
  setNewTitle,
  updateTodo,
  handleTitle,
  escapeKeyHandler,
  doubleClick,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosByStatus(queryStatus)?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          deletedIds={deletedIds}
          updatingIds={updatingIds}
          selectedTodo={selectedTodo}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          updateTodo={updateTodo}
          handleTitle={handleTitle}
          escapeKeyHandler={escapeKeyHandler}
          doubleClick={doubleClick}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={() => {}}
          deletedIds={[]}
          updatingIds={[tempTodo.id]}
          selectedTodo={null}
          newTitle=""
          setNewTitle={() => {}}
          updateTodo={() => {}}
          handleTitle={() => {}}
          escapeKeyHandler={() => {}}
          doubleClick={() => {}}
        />
      )}
    </section>
  );
};
