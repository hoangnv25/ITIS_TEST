import React from 'react';

interface PopupProps {
  message: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-[30]">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-[600px]">
        <p>{message}</p>
        <button onClick={onClose} className="mt-2 bg-blue-500 text-white py-1 px-4 rounded">
          Đóng
        </button>
      </div>
    </div>
  );
};

export default Popup;