import { useStore } from '../lib/store';
import { useEffect } from 'react';

export function Toast() {
    const { toast, hideToast } = useStore();

    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                hideToast();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible, hideToast]);

    if (!toast.visible) return null;

    const variants = {
        success: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400',
        error: 'bg-red-500/10 border-red-500/50 text-red-400',
        info: 'bg-blue-500/10 border-blue-500/50 text-blue-400'
    };

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };

    return (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm ${variants[toast.type]}`}>
                <span className="text-xl">{icons[toast.type]}</span>
                <p className="font-medium">{toast.message}</p>
                <button
                    onClick={hideToast}
                    className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
