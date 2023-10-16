'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AddButton from './components/add-button';
import TodoList from './components/todo-list';
import { Todo } from '@/types/Todo';
import { registerServiceWorker } from './utils/registerServiceWorker';
import AppInstallButton from './components/app-install-button';
import IconSvg from './components/icon-svg';
import {
  clearIndexedDB,
  createIndexedDB,
  deleteIndexedDB,
  fetchIndexedDB,
  insertIndexedDB,
  updateAllIndexedDB,
  updatePartialIndexedDB,
} from './utils/indexedDB';
import Undo from './components/undo';
import Redo from './components/redo';

declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  deferredPrompt: BeforeInstallPromptEvent | null;
  prompt(): Promise<void>;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showAppInstallButton, setShowAppInstallButton] = useState(false);
  const editableRef = useRef<HTMLSpanElement>(null);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const appInstallButtonRef = useRef<HTMLButtonElement>(null);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const todosHistoryRef = useRef<Todo[][]>([]);
  const todosHistoryCurrentIndex = useRef(0);

  const scrollToBottom = function () {
    scrollBottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

  const handleUndoClick = function () {
    const isOldest = todosHistoryCurrentIndex.current - 1 < 0;
    todosHistoryCurrentIndex.current = isOldest
      ? 0
      : todosHistoryCurrentIndex.current - 1;
    setCanUndo(
      todosHistoryCurrentIndex.current > 0 &&
        todosHistoryRef.current.length >= 2,
    );
    setCanRedo(
      todosHistoryCurrentIndex.current < todosHistoryRef.current.length - 1 &&
        todosHistoryRef.current.length >= 2,
    );
    const prevTodos = todosHistoryRef.current[todosHistoryCurrentIndex.current];
    if (canUndo) {
      try {
        clearIndexedDB();
        updateAllIndexedDB(prevTodos);
      } catch (error) {
        console.error(error);
      } finally {
        setTodos(prevTodos);
        scrollToBottom();
      }
    }
  };

  const handleRedoClick = function () {
    const isLatest =
      todosHistoryCurrentIndex.current + 1 >= todosHistoryRef.current.length;
    todosHistoryCurrentIndex.current = isLatest
      ? todosHistoryCurrentIndex.current
      : todosHistoryCurrentIndex.current + 1;
    setCanUndo(
      todosHistoryCurrentIndex.current > 0 &&
        todosHistoryRef.current.length >= 2,
    );
    setCanRedo(
      todosHistoryCurrentIndex.current < todosHistoryRef.current.length - 1 &&
        todosHistoryRef.current.length >= 2,
    );
    const nextTodos = todosHistoryRef.current[todosHistoryCurrentIndex.current];
    if (canRedo) {
      try {
        clearIndexedDB();
        updateAllIndexedDB(nextTodos);
      } catch (error) {
        console.error(error);
      } finally {
        setTodos(nextTodos);
        scrollToBottom();
      }
    }
  };

  const handleKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) return;
      if (event.key === 'Enter') {
        const target = event.target as HTMLElement;
        const insertID = uuidv4();
        const prevTodos: Todo[] = todos.map((todo) => todo);
        if (target.nodeName !== 'BODY') return;
        setTodos([
          ...prevTodos,
          { id: insertID, displayOrder: prevTodos.length, name: '' },
        ]);
        try {
          await insertIndexedDB(insertID, prevTodos.length, '');
        } catch (error) {
          console.error(error);
        }
        scrollToBottom();
        editableRef.current?.focus();
      }
    },
    [todos],
  );

  const handleAddButtonMouseUp = useCallback(async () => {
    const insertID = uuidv4();
    const prevTodos: Todo[] = todos.map((todo) => todo);
    setTodos([
      ...prevTodos,
      { id: insertID, displayOrder: prevTodos.length, name: '' },
    ]);
    todosHistoryRef.current.push([
      ...prevTodos,
      { id: insertID, displayOrder: prevTodos.length, name: '' },
    ]);
    todosHistoryCurrentIndex.current = todosHistoryCurrentIndex.current + 1;
    setCanRedo(false);
    setCanUndo(true);
    try {
      insertIndexedDB(insertID, prevTodos.length, '');
    } catch (error) {
      console.error(error);
    }
  }, [todos]);

  const handleAddButtonClick = useCallback(() => {
    scrollToBottom();
    editableRef.current?.focus();
  }, []);

  const handleAppInstallButtonClick = useCallback(async () => {
    if (!globalThis.window) return;
    const displayMode = window.matchMedia('(display-mode: standalone)').matches
      ? 'standalone'
      : 'browser tab';
    if (displayMode === 'standalone') return;
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try {
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowAppInstallButton(false);
    }
  }, [deferredPrompt]);

  const handleAppInstalled = useCallback(() => {
    if (!globalThis.window) return;
    console.log('PWA was installed');
    setDeferredPrompt(null);
    setShowAppInstallButton(false);
  }, [setDeferredPrompt]);

  const handleBeforeInstallPrompt = useCallback((event: Event) => {
    if (!globalThis.window) return;
    event.preventDefault();
    const beforeInstallPromptEvent = event as BeforeInstallPromptEvent;
    console.log('beforeInstallPromptEvent: ', beforeInstallPromptEvent);
    setDeferredPrompt(beforeInstallPromptEvent);
    setShowAppInstallButton(true);
  }, []);

  const handleVisibilityChange = useCallback(async () => {
    if (document.visibilityState === 'visible') {
      try {
        const fetchData = await fetchIndexedDB();
        setTodos(fetchData);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const handleWindowFocus = useCallback(async () => {
    try {
      const fetchData = await fetchIndexedDB();
      setTodos(fetchData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!globalThis.window) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!globalThis.window) return;
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [handleVisibilityChange]);

  useEffect(() => {
    if (!globalThis.window) return;
    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [handleWindowFocus]);

  useEffect(() => {
    if (!globalThis.window) return;
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
  }, [handleBeforeInstallPrompt]);

  useEffect(() => {
    if (!globalThis.window) return;
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, [handleAppInstalled]);

  useEffect(() => {
    const init = async () => {
      try {
        await createIndexedDB();
        const fetchData = await fetchIndexedDB();
        setTodos(fetchData);
        todosHistoryRef.current = [fetchData];
      } catch (error) {
        console.error(error);
      }
    };
    registerServiceWorker();
    init();
  }, []);

  return (
    <main>
      <div className="flex items-center justify-between px-[22px] pb-5 pt-3">
        <div className="flex items-center gap-2">
          <div className="hidden h-12 w-12 select-none items-center justify-center rounded-[24%] border border-gray-200 bg-white p-2 text-center minimum:flex">
            <IconSvg />
          </div>
          <h1
            style={{ fontWeight: 800 }}
            className="select-none text-4xl text-main"
          >
            ToDo
          </h1>
        </div>
        {showAppInstallButton && (
          <AppInstallButton
            handleAppInstallButtonClick={handleAppInstallButtonClick}
            appInstallButtonRef={appInstallButtonRef}
          />
        )}
      </div>
      {todos.length > 0 && (
        <>
          <TodoList
            todos={todos}
            editableRef={editableRef}
            todosHistoryRef={todosHistoryRef}
            todosHistoryCurrentIndex={todosHistoryCurrentIndex}
            setCanUndo={setCanUndo}
            setCanRedo={setCanRedo}
            setTodos={setTodos}
            updatePartialIndexedDB={updatePartialIndexedDB}
            updateAllIndexedDB={updateAllIndexedDB}
            deleteIndexedDB={deleteIndexedDB}
          />
        </>
      )}
      <Undo handleUndoClick={handleUndoClick} canUndo={canUndo} />
      <Redo handleRedoClick={handleRedoClick} canRedo={canRedo} />
      <AddButton
        handleAddButtonClick={handleAddButtonClick}
        handleAddButtonMouseUp={handleAddButtonMouseUp}
      />
      {todos.length > 0 && (
        <div
          ref={scrollBottomRef}
          className="h-[calc(env(safe-area-inset-bottom)+224px)] pwa:h-[max(calc(env(safe-area-inset-bottom)+204px),224px)]"
        />
      )}
    </main>
  );
}
