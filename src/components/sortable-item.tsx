import {
  Dispatch,
  FocusEvent,
  KeyboardEvent,
  RefObject,
  SetStateAction,
  forwardRef,
  useCallback,
  MutableRefObject,
  useContext,
} from 'react';
import { Todo } from '@/types/Todo';
import { IndexedDBResult } from '@/types/IndexedDBResult';
import { Button } from '@/contexts/material-providers';
import { ThemeContext } from '@/contexts/theme-provider';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { isMobile, isTablet, isDesktop } from 'react-device-detect';
import { sortTodosOrderByDisplayOrder } from '@/utils/sortTodosOrderByDisplayOrder';
import { bgVariants, ringVariants } from '@/utils/colorVariants';
import { PiDotsSixVerticalBold, PiXBold } from 'react-icons/pi';
import clsx from 'clsx';

type Props = {
  id: string;
  displayOrder: number;
  name: string;
  todos: Todo[];
  editableRef: RefObject<HTMLSpanElement>;
  todosHistoryRef: MutableRefObject<Todo[][]>;
  todosHistoryCurrentIndex: MutableRefObject<number>;
  setCanUndo: Dispatch<SetStateAction<boolean>>;
  setCanRedo: Dispatch<SetStateAction<boolean>>;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  updatePartialIndexedDB: (
    id: string,
    updatedText: string,
  ) => Promise<IndexedDBResult>;
  updateAllIndexedDB: (todos: Todo[]) => Promise<IndexedDBResult>;
  deleteIndexedDB: (id: string) => Promise<IndexedDBResult>;
};

export default forwardRef(function SortableItem(props: Props, _ref) {
  const {
    id,
    name,
    todos,
    editableRef,
    todosHistoryRef,
    todosHistoryCurrentIndex,
    setCanUndo,
    setCanRedo,
    setTodos,
    updatePartialIndexedDB,
    updateAllIndexedDB,
    deleteIndexedDB,
  } = props;
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const theme = useContext(ThemeContext);
  const { mainColor, baseColor, mode } = theme;

  const handleDeleteButtonClick = async function () {
    const targetId = id;
    const prevTodos = todos.map((todo) => todo);
    const filterdTodos: Todo[] = prevTodos.filter(
      (todo) => todo.id !== targetId,
    );
    const sortedTodos: Todo[] = sortTodosOrderByDisplayOrder(filterdTodos);
    setTodos(sortedTodos);
    todosHistoryRef.current.push(sortedTodos);
    todosHistoryCurrentIndex.current = todosHistoryCurrentIndex.current + 1;
    setCanUndo(true);
    try {
      await deleteIndexedDB(targetId);
      updateAllIndexedDB(sortedTodos);
    } catch (error) {
      console.error(error);
      setTodos(prevTodos);
    }
  };

  const handleBlurContentEditable = async function (event: FocusEvent) {
    const targetId = id;
    const targetText = name;
    const prevTodos = todos.map((todo) => todo);
    const updatedText = (event.target as HTMLElement).innerText;
    const isEdited = targetText !== updatedText;
    if (updatedText) {
      if (!isEdited) return;
      const updatedTodos: Todo[] = prevTodos.map((todo) =>
        todo.id === targetId
          ? {
              id: todo.id,
              displayOrder: todo.displayOrder,
              name: updatedText,
            }
          : todo,
      );
      setTodos(updatedTodos);
      todosHistoryRef.current.push(updatedTodos);
      todosHistoryCurrentIndex.current = todosHistoryCurrentIndex.current + 1;
      setCanUndo(true);
      setCanRedo(false);
      try {
        updatePartialIndexedDB(targetId, updatedText);
      } catch (error) {
        console.error(error);
        setTodos(prevTodos);
      }
    } else {
      const filterdTodos: Todo[] = prevTodos.filter(
        (todo) => todo.id !== targetId,
      );
      const sortedTodos: Todo[] = sortTodosOrderByDisplayOrder(filterdTodos);
      setTodos(sortedTodos);
      todosHistoryRef.current.push(sortedTodos);
      todosHistoryCurrentIndex.current = todosHistoryCurrentIndex.current + 1;
      setCanUndo(true);
      setCanRedo(false);
      try {
        await deleteIndexedDB(targetId);
        updateAllIndexedDB(sortedTodos);
      } catch (error) {
        console.error(error);
        setTodos(prevTodos);
      }
    }
  };

  const handleKeyDownContentEditable = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      const targetElement = event.target as HTMLElement;
      targetElement.blur();
    }
  }, []);

  return (
    <li
      ref={setNodeRef}
      style={style}
      role="listitem"
      className={clsx(
        `flex items-center justify-between gap-1.5 rounded-md border px-1.5 py-2 sm:gap-2.5 sm:px-2 ${bgVariants[baseColor]}`,
        {
          'opacity-30': isDragging === true,
          'border-gray-100': mode === 'light',
          'border-gray-900': mode === 'dark',
        },
      )}
    >
      <div className="flex flex-1 items-center gap-1.5 sm:gap-2.5">
        <Button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          variant="text"
          color="white"
          ripple={false}
          className={clsx(
            `self-stretch rounded px-3 py-4 text-2xl hover:cursor-grab sm:px-4 sm:py-5`,
            {
              'text-gray-800 hover:bg-gray-900/10': mode === 'light',
              'text-gray-400 hover:bg-gray-900': mode === 'dark',
            },
          )}
        >
          <PiDotsSixVerticalBold />
        </Button>
        <span
          ref={editableRef}
          onBlur={handleBlurContentEditable}
          onKeyDown={handleKeyDownContentEditable}
          role="textbox"
          contentEditable
          inputMode="text"
          suppressContentEditableWarning
          className={clsx(
            `max-w-[calc(100svw-162px)] whitespace-break-spaces break-words rounded-sm px-1.5 py-1 text-2xl leading-snug ring-0 focus:w-full focus:outline-none focus-visible:ring-2 sm:max-w-[calc(100svw-190px)] sm:rounded ${ringVariants[mainColor]}`,
            {
              'text-gray-900': mode === 'light',
              'text-gray-300': mode === 'dark',
            },
          )}
        >
          {name}
        </span>
        {(isMobile || isTablet) && (
          <button
            className="flex-1 self-stretch bg-transparent"
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            disabled
          />
        )}
      </div>
      <Button
        aria-label={'Delete'}
        onClick={handleDeleteButtonClick}
        variant="text"
        color="white"
        ripple={false}
        className={clsx(
          `rounded px-3 py-4 text-xl hover:cursor-pointer active:brightness-95 sm:px-4 sm:py-5`,
          {
            'self-stretch': isDesktop === true,
            'text-gray-800 hover:bg-gray-900/10': mode === 'light',
            'text-gray-400 hover:bg-gray-900': mode === 'dark',
          },
        )}
      >
        <PiXBold />
      </Button>
    </li>
  );
});