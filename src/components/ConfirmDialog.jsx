import { useState } from 'react';

export function ConfirmDialog({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) {
    const [isClosing, setIsClosing] = useState(false);

    const handleConfirm = () => {
        setIsClosing(true);
        setTimeout(() => onConfirm(), 150);
    };

    const handleCancel = () => {
        setIsClosing(true);
        setTimeout(() => onCancel(), 150);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') handleCancel();
        if (e.key === 'Enter') handleConfirm();
    };

    const variantStyles = {
        danger: 'bg-red-500 hover:bg-red-600',
        primary: 'bg-[#6366f1] hover:bg-[#4f46e5]'
    };

    return (
        <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
            onClick={handleCancel}
            onKeyDown={handleKeyDown}
        >
            <div
                className={`bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 mb-6">{message}</p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg font-medium transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${variantStyles[variant]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
