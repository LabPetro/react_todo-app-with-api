import React from 'react';
import classNames from 'classnames';

interface HeaderProps {
  inputRef: React.RefObject<HTMLInputElement>;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  inputText: string;
  setInputText: (value: string) => void;
  inputDisabled: boolean;
  todosLength: number;
  completedTodosLength: number;
  toggleAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  inputRef,
  submitHandler,
  inputText,
  setInputText,
  inputDisabled,
  todosLength,
  completedTodosLength,
  toggleAll,
}) => {
  return (
    <header className="todoapp__header">
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

      <form onSubmit={submitHandler}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
