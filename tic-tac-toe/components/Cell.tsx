import React from 'react';

type Props = {
  value: string | null;
  onClick: () => void;
};

const Cell: React.FC<Props> = ({ value, onClick }) => {
  return (
    <button
      className="w-12 h-12 flex items-center justify-center border border-gray-400 text-xl"
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Cell;
