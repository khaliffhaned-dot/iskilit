import * as React from 'react';
import { Notification, Page } from '../types.ts';

interface NotificationsHubProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigate: (page: Page) => void;
}

const timeSince = (date: number) => {
    const seconds = Math.floor((new Date().getTime() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
};

const NotificationItem: React.FC<{
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onNavigate: (page: Page) => void;
}> = ({ notification, onMarkAsRead, onNavigate }) => {

    const handleClick = () => {
        if (!notification.read) {
            onMarkAsRead(notification.id);
        }
        if (notification.page) {
            onNavigate(notification.page);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full text-left p-4 transition-colors border-b border-slate-200 last:border-b-0 ${notification.page ? 'hover:bg-slate-100' : ''}`}
        >
            <div className="flex items-start gap-4">
                {!notification.read && <div className="w-2.5 h-2.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0 animate-pulse"></div>}
                <div className={notification.read ? 'pl-[26px]' : ''}>
                    <p className="font-semibold text-slate-800">{notification.title}</p>
                    <p className="text-sm text-slate-600">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{timeSince(notification.timestamp)}</p>
                </div>
            </div>
        </button>
    );
};


const NotificationsHub: React.FC<NotificationsHubProps> = ({
  isOpen,
  setIsOpen,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-500/30 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div
        className="absolute top-16 right-4 w-full max-w-sm bg-white/80 backdrop-blur-lg shadow-2xl border border-slate-200 rounded-lg flex flex-col transform transition-all fade-in"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
           <button
                onClick={onMarkAllAsRead}
                disabled={notifications.every(n => n.read)}
                className="text-center text-xs font-semibold text-amber-600 hover:text-amber-500 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
                Mark all as read
            </button>
        </header>
        
        <div className="flex-grow overflow-y-auto max-h-[70vh]">
            {notifications.length > 0 ? (
                notifications.map(n => (
                    <NotificationItem key={n.id} notification={n} onMarkAsRead={onMarkAsRead} onNavigate={onNavigate} />
                ))
            ) : (
                <div className="p-12 text-center text-slate-500">
                    <p>You have no notifications.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsHub;