import React from 'react';

interface WarningModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-96">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Warnung</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                        Bestätigen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WarningModal;
