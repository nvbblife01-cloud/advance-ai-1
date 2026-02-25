interface Props {
  onClick: () => void;
  label?: string;
}

export function AddButton({ onClick, label = 'Add' }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-30 h-14 min-w-14 rounded-full bg-brand-500 px-5 text-white shadow-lg hover:bg-brand-700 md:bottom-6"
    >
      + {label}
    </button>
  );
}
