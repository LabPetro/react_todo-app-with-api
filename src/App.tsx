import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import * as helpers from './api/todos';
import { Status } from './types/status';
import { Emessage } from './types/Emessage';
import { Header } from './Header';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { Notification } from './Notification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [queryStatus, setQueryStatus] = useState(Status.all);
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState(Emessage.null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputText, setInputText] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loadingIds, setLoadingIds] = useState<{
    updating: number[];
    deleting: number[];
  }>({ updating: [], deleting: [] });
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const closingErrMessage = () => {
    setErrMessage(Emessage.null);
  };

  const handleErrMessage = (message: Emessage) => {
    setErrMessage(message);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      closingErrMessage();
    }, 3000);
  };

  const presentInput = (inref: React.RefObject<HTMLInputElement>) => {
    if (inref.current) {
      inref.current.focus();
    }
  };

  useEffect(() => {
    presentInput(inputRef);
    setIsLoading(true);

    helpers
      .getTodos()
      .then(setTodos)
      .catch(() => handleErrMessage(Emessage.load))
      .finally(() => setIsLoading(false));

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const todosByStatus = (query = queryStatus) => {
    return todos?.filter(todo => {
      switch (query) {
        case Status.completed:
          return todo.completed;

        case Status.active:
          return !todo.completed;

        case Status.all:
          return todo;
      }
    });
  };

  const addTodo = () => {
    const userId = 837;

    const newTodo: Omit<Todo, 'id'> = {
      userId,
      title: inputText.trim(),
      completed: false,
    };

    setInputDisabled(true);
    const tempId = 0;

    setTempTodo({ id: tempId, ...newTodo });
    setLoadingIds(prev => ({ ...prev, updating: [...prev.updating, tempId] }));

    helpers
      .addTodo(newTodo)
      .then(todoFromServer => {
        setTodos(currentTodos => [...currentTodos, todoFromServer]);
        setLoadingIds(prev => ({
          ...prev,
          updating: prev.updating.filter(id => id !== tempId),
        }));
        setInputText('');
      })
      .catch(() => handleErrMessage(Emessage.add))
      .finally(() => {
        setTempTodo(null);
        setInputDisabled(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          presentInput(inputRef);
        }, 0);
      });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputText.trim()) {
      handleErrMessage(Emessage.title);

      return;
    }

    addTodo();
  };

  const deleteTodo = (id: number) => {
    setLoadingIds(prev => ({ ...prev, deleting: [...prev.deleting, id] }));

    helpers
      .deleteTodo(id)
      .then(() => {
        setTodos(presentTodos => presentTodos.filter(todo => todo.id !== id));
        setSelectedTodo(null);
      })
      .catch(() => {
        handleErrMessage(Emessage.delete);
      })
      .finally(() => {
        setLoadingIds(prev => ({
          ...prev,
          deleting: prev.deleting.filter(delId => delId !== id),
        }));

        setTimeout(() => {
          presentInput(inputRef);
        }, 0);
      });
  };

  const updateTodo = (patchedTodo: Todo) => {
    setLoadingIds(prev => ({
      ...prev,
      updating: [...prev.updating, patchedTodo.id],
    }));

    helpers
      .updateTodo(patchedTodo)
      .then(serverTodo => {
        const { id } = serverTodo;

        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === id ? serverTodo : todo)),
        );
        setSelectedTodo(null);
      })
      .catch(() => {
        handleErrMessage(Emessage.update);
      })
      .finally(() => {
        setLoadingIds(prev => ({
          ...prev,
          updating: prev.updating.filter(updId => updId !== patchedTodo.id),
        }));
      });
  };

  const toggleAll = () => {
    const active = todosByStatus(Status.active).length;
    const complete = todosByStatus(Status.completed).length;
    const allTodos = todosByStatus(Status.all);

    if (active === todos.length || complete === todos.length) {
      allTodos.forEach(todo =>
        updateTodo({ ...todo, completed: !todo.completed }),
      );
    } else {
      todosByStatus(Status.active).forEach(todo =>
        updateTodo({ ...todo, completed: true }),
      );
    }
  };

  const doubleClick = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const handleTitle = (newTitle: string) => {
    if (!selectedTodo) {
      return;
    }

    const uiTitle = newTitle.trim();

    if (uiTitle === '') {
      deleteTodo(selectedTodo.id);
    } else if (uiTitle !== selectedTodo.title) {
      updateTodo({ ...selectedTodo, title: uiTitle });
    } else {
      setSelectedTodo(null);
    }
  };

  const escapeKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && selectedTodo) {
      setSelectedTodo(null);
    }
  };

  const hasCompletedTodos = () => {
    return todos.some(todo => todo.completed);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          submitHandler={submitHandler}
          inputText={inputText}
          setInputText={setInputText}
          inputDisabled={inputDisabled}
          todosLength={todos.length}
          completedTodosLength={todosByStatus(Status.completed).length}
          toggleAll={toggleAll}
        />

        {!isLoading && (
          <TodoList
            todosByStatus={todosByStatus}
            queryStatus={queryStatus}
            deleteTodo={deleteTodo}
            loadingIds={loadingIds}
            tempTodo={tempTodo}
            selectedTodo={selectedTodo}
            updateTodo={updateTodo}
            handleTitle={handleTitle}
            escapeKeyHandler={escapeKeyHandler}
            doubleClick={doubleClick}
          />
        )}

        {!!todos.length && (
          <Footer
            todosByStatus={todosByStatus}
            queryStatus={queryStatus}
            setQueryStatus={setQueryStatus}
            hasCompletedTodos={hasCompletedTodos}
            deleteTodo={deleteTodo}
          />
        )}
      </div>

      <Notification
        errMessage={errMessage}
        closingErrMessage={closingErrMessage}
      />
    </div>
  );
};
