import clsx from 'clsx';

export default function AccorionIcon({
  id,
  open,
}: {
  id: number;
  open: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className={clsx('h-5 w-5 transition-transform', {
        '-rotate-180': id === open,
      })}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}
