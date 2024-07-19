/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

interface Props {
  todo: Todo;
  deleteTodo: (id: number) => void;
  deletedIds: number[];
  updatingIds: number[];
  selectedTodo: Todo | null;
  newTitle: string;
  setNewTitle: (title: string) => void;
  updateTodo: (todo: Todo) => void;
  handleTitle: (e: React.FormEvent) => void;
  escapeKeyHandler: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  doubleClick: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  deletedIds,
  updatingIds,
  selectedTodo,
  newTitle,
  setNewTitle,
  updateTodo,
  handleTitle,
  escapeKeyHandler,
  doubleClick,
}) => {
  const { id, title, completed } = todo;
  const deletedIdscheck = deletedIds.includes(id);
  const updatedIdscheck = updatingIds.includes(id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() =>
            updateTodo({
              ...todo,
              completed: !completed,
            })
          }
        />
      </label>

      {selectedTodo?.id === id ? (
        <form onSubmit={handleTitle}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todoapp__new-todo todoapp__new-todo--update"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleTitle}
            onKeyUp={escapeKeyHandler}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => doubleClick(todo)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            x
          </button>
        </>
      )}

      {/* 'is-active' class puts this modal on top of the todo */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': updatedIdscheck || deletedIdscheck,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
