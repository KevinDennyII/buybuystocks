export function IconPulse() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12h4l2-6 4 12 2-6h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSprout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20V10M12 10 8 6c0 3 2 5 4 4-1-3 1-6 4-6 3 0 5 3 4 6 2 1 4-1 4-4l-4 4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 4h9a3 3 0 0 1 3 3v13a1 1 0 0 0-1-1H6a2 2 0 0 0-2 2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 4h-1a3 3 0 0 0-3 3v13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = {
  pulse: IconPulse,
  sprout: IconSprout,
  book: IconBook,
};

export function FocusIcon({ name }) {
  const Cmp = ICONS[name] ?? IconBook;
  return <Cmp />;
}
