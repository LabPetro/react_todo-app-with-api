import React from 'react';
import classNames from 'classnames';

interface HeaderProps {
  inputRef: React.RefObject<HTMLInputElement>;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  inputText: string;
  onInputChange: (value: string) => void;
  inputDisabled: boolean;
  todosLength: number;
  completedTodosLength: number;
  toggleAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  inputRef,
  submitHandler,
  inputText,
  onInputChange,
  inputDisabled,
  todosLength,
  completedTodosLength,
  toggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!!todosLength && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodosLength === todosLength,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={submitHandler}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={e => onInputChange(e.target.value)}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
