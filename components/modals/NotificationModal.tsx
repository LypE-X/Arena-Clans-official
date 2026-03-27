import React from 'react';

const NotificationModal = ({ open, onClose, notification }: any) => {
    if (!open || !notification) return null;

    return (
        <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-dark-900 border border-[#21ff21]/40 rounded-2xl shadow-[0_0_25px_#21ff21]/20 p-8 max-w-md w-full text-center">

                <h2 className="text-2xl font-bold text-white mb-4">
                    {notification.title || 'Notificação'}
                </h2>

                <p className="text-gray-300 text-base leading-relaxed mb-6">
                    {notification.message}
                </p>

                <button
                    onClick={onClose}
                    className="w-full bg-[#21ff21] text-black font-semibold py-3 rounded-xl hover:bg-[#16cc16] transition-colors"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default NotificationModal;