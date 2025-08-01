/**
 * Notification System
 *
 * Toast notifications for user feedback with animations
 * and different types (success, error, info, warning).
 */

"use client";

import { useState, useEffect, createContext, useContext } from "react";

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString();
    const newNotification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case "success":
        return "border-green-500 bg-green-500/10 text-green-300";
      case "error":
        return "border-red-500 bg-red-500/10 text-red-300";
      case "warning":
        return "border-yellow-500 bg-yellow-500/10 text-yellow-300";
      case "info":
        return "border-blue-500 bg-blue-500/10 text-blue-300";
    }
  };

  return (
    <div
      className={`
        border rounded-lg p-4 backdrop-blur-sm shadow-lg transition-all duration-300 transform
        ${getColors()}
        ${
          isVisible && !isExiting
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }
        ${isExiting ? "translate-x-full opacity-0" : ""}
      `}
    >
      <div className="flex items-start space-x-3">
        <span className="text-lg flex-shrink-0">{getIcon()}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm">
            {notification.title}
          </h4>
          {notification.message && (
            <p className="text-sm mt-1 opacity-90">{notification.message}</p>
          )}
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="text-sm font-medium mt-2 hover:underline"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleClose}
          className="text-white/60 hover:text-white transition-colors flex-shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Utility functions for common notifications
export const notify = {
  success: (
    title: string,
    message?: string,
    action?: Notification["action"]
  ) => ({
    type: "success" as const,
    title,
    message,
    action,
  }),
  error: (
    title: string,
    message?: string,
    action?: Notification["action"]
  ) => ({
    type: "error" as const,
    title,
    message,
    action,
  }),
  warning: (
    title: string,
    message?: string,
    action?: Notification["action"]
  ) => ({
    type: "warning" as const,
    title,
    message,
    action,
  }),
  info: (title: string, message?: string, action?: Notification["action"]) => ({
    type: "info" as const,
    title,
    message,
    action,
  }),
};
