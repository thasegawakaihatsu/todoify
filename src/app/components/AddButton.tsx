import { forwardRef } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { Button } from '@material-tailwind/react';

type Props = {
  handleAddButtonClick: () => void;
  handleAddButtonMouseUp: () => void;
};

export default forwardRef(function AddButton(props: Props, _ref) {
  const { handleAddButtonClick, handleAddButtonMouseUp } = props;
  return (
    <>
      <Button
        onClick={handleAddButtonClick}
        onMouseUp={handleAddButtonMouseUp}
        aria-label="Add"
        role="button"
        tabIndex={0}
        className="!fixed bottom-5 left-0 right-0 mx-auto w-[calc(100%-40px)] rounded-lg bg-main p-2 text-5xl
        text-white !shadow-none filter transition hover:brightness-95 pwa:bottom-[max(env(safe-area-inset-bottom),20px)]"
      >
        <div className="grid place-items-center">
          <IoIosAdd />
        </div>
      </Button>
    </>
  );
});