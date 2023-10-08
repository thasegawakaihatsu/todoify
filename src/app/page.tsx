'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from './components/button';
import TodoList from './components/todoList';
import { Todo } from '@/types/Todo';
import { sortTodosOrderByDisplayOrder } from './features/sortTodosOrderByDisplayOrder';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const editableRef = useRef<HTMLSpanElement>(null);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = function () {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBtnClick = async function () {
    scrollToBottom();
    await setTodos([
      ...todos,
      { id: uuidv4(), displayOrder: todos.length, name: '' },
    ]);
    editableRef.current?.focus();
  };

  const dbVer = 1;
  const dbName = 'TodoDB';
  const dbStore = 'todos';
  const dbKeyPath = 'id';

  const setTodosOrderByDisplayOrder = useCallback((todos: Todo[]) => {
    const tmpArr: Todo[] = [];
    todos.map((todo, index) => {
      tmpArr.push({ id: todo.id, displayOrder: index, name: todo.name });
    });
    const sortedTodos = tmpArr.toSorted(
      (a, b) => a.displayOrder - b.displayOrder
    );
    setTodos(sortedTodos);
    console.log('setTodosOrderByDisplayOrder called');
  }, []);

  const createIndexedDB = useCallback(() => {
    if (!globalThis.window) return;
    const request = window.indexedDB.open(dbName, dbVer);
    request.onupgradeneeded = (event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(dbStore)) {
        const objectStore = db.createObjectStore(dbStore, {
          keyPath: dbKeyPath,
        });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('displayOrder', 'displayOrder', {
          unique: false,
        });
        objectStore.createIndex('id', 'id', { unique: true });
        objectStore.transaction.oncomplete = (event) => {
          console.log('createIndexedDB onupgradeneeded called');
        };
        objectStore.transaction.onerror = (event) => {
          console.error(event);
        };
      }
    };
    request.onsuccess = (event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([dbStore], 'readwrite');
      transaction.oncomplete = (event) => {
        console.log('createIndexedDB onupgradeneeded called');
      };
      transaction.onerror = (event) => {
        console.error('Transaction error');
      };
    };
    request.onerror = (event) => {
      console.error(event);
    };
  }, []);
  const readIndexedDB = useCallback(() => {
    if (!globalThis.window) return;
    const request = window.indexedDB.open(dbName, dbVer);
    request.onsuccess = (event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([dbStore], 'readonly');
      const objectStore = transaction.objectStore(dbStore);
      const tmpArr: Todo[] = [];
      objectStore.openCursor().onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          tmpArr.push(cursor.value);
          cursor.continue();
        } else {
          const sortedTodos = tmpArr.toSorted(
            (a, b) => a.displayOrder - b.displayOrder
          );
          setTodosOrderByDisplayOrder(sortedTodos);
          console.log(`Got all todos`);
        }
      };
      objectStore.openCursor().onerror = (event) => {
        console.error(event);
      };
      transaction.oncomplete = (event) => {
        console.log('readIndexedDB called');
      };
      transaction.onerror = (event) => {
        console.error(event);
      };
    };
    request.onerror = (event) => {
      console.error(event);
    };
  }, []);
  const updateIndexedDB = useCallback((id: string, updatedText: string) => {
    if (!globalThis.window) return;
    const request = window.indexedDB.open(dbName, dbVer);
    request.onsuccess = (event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([dbStore], 'readwrite');
      const objectStore = transaction.objectStore(dbStore);
      const getResult: Todo = { id: '', displayOrder: -1, name: '' };
      const getRequest = objectStore.get(id);
      getRequest.onsuccess = (event) => {
        const { id, displayOrder, name } = (event.target as IDBRequest)
          .result as Todo;
        getResult.id = id;
        getResult.displayOrder = displayOrder;
        getResult.name = name;
        const updatedTodo: Todo = {
          id: getResult.id,
          displayOrder: getResult.displayOrder,
          name: updatedText,
        };
        const putRequest = objectStore.put(updatedTodo);
        putRequest.onsuccess = (event) => {};
        putRequest.onerror = (event) => {
          console.error(event);
        };
      };
      getRequest.onerror = (event) => {
        console.error(event);
      };
      transaction.oncomplete = (event) => {
        console.log('updateIndexedDB called');
      };
      transaction.onerror = (event) => {
        console.error(event);
      };
    };
    request.onerror = (event) => {
      console.error(event);
    };
  }, []);
  const updateAllIndexedDB = useCallback((todos: Todo[]) => {
    if (!globalThis.window) return;
    const request = window.indexedDB.open(dbName, dbVer);
    request.onsuccess = (event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([dbStore], 'readwrite');
      const objectStore = transaction.objectStore(dbStore);
      const sortedTodos: Todo[] = sortTodosOrderByDisplayOrder(todos);
      sortedTodos.forEach((todo) => {
        const putRequest = objectStore.put(todo);
        putRequest.onsuccess = (event) => {};
        putRequest.onerror = (event) => {
          console.error(event);
        };
      });
      transaction.oncomplete = (event) => {
        console.log('updateAllIndexedDB called');
      };
      transaction.onerror = (event) => {
        console.error(event);
      };
    };
    request.onerror = (event) => {
      console.error(event);
    };
  }, []);
  const deleteIndexedDB = useCallback((id: string) => {
    if (!globalThis.window) return;
    const request = window.indexedDB.open(dbName, dbVer);
    request.onsuccess = (event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([dbStore], 'readwrite');
      const objectStore = transaction.objectStore(dbStore);
      const deleteRequest = objectStore.delete(id);
      deleteRequest.onsuccess = (event) => {};
      deleteRequest.onerror = (event) => {
        console.error(event);
      };
      transaction.oncomplete = (event) => {
        console.log('deleteIndexedDB called');
      };
      transaction.onerror = (event) => {
        console.error(event);
      };
    };
    request.onerror = (event) => {
      console.log(event);
    };
  }, []);
  const clearIndexedDB = useCallback(() => {
    if (!globalThis.window) return;
    const request = window.indexedDB.open(dbName, dbVer);
    request.onsuccess = (event) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([dbStore], 'readwrite');
      const objectStore = transaction.objectStore(dbStore);
      const clearRequest = objectStore.clear();
      clearRequest.onsuccess = (event) => {};
      clearRequest.onerror = (event) => {
        console.error(event);
      };
      transaction.oncomplete = (event) => {
        console.log('clearIndexedDB called');
      };
      transaction.onerror = (event) => {
        console.error(event);
      };
    };
    request.onerror = (event) => {
      console.error(event);
    };
  }, []);

  useEffect(() => {
    createIndexedDB();
    readIndexedDB();
  }, []);

  useEffect(() => {
    updateAllIndexedDB(todos);
  }, [todos]);

  return (
    <main>
      <h1
        style={{ fontWeight: 800 }}
        className="text-main text-4xl px-[22px] pt-3 pb-5"
      >
        ToDo
      </h1>
      <TodoList
        todos={todos}
        setTodos={setTodos}
        editableRef={editableRef}
        readIndexedDB={readIndexedDB}
        updateIndexedDB={updateIndexedDB}
        updateAllIndexedDB={updateAllIndexedDB}
        deleteIndexedDB={deleteIndexedDB}
        setTodosOrderByDisplayOrder={setTodosOrderByDisplayOrder}
      />
      <div ref={scrollBottomRef} className="h-24"></div>
      <Button handleBtnClick={handleBtnClick} />
    </main>
  );
}
