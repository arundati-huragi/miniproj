import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

const Notifications = () => {
  const authState = useSelector(state => state.authReducer);
  const [notifications, setNotifications] = useState([]);
  const [fetchData] = useFetch();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!authState.isLoggedIn) return;
    const config = {
      url: '/notifications',
      method: 'get',
      headers: { Authorization: `Bearer ${authState.token}` },
    };
    const data = await fetchData(config, { showSuccessToast: false });
    if (data && data.notifications) {
      console.log("Fetched notifications:", data.notifications);
      setNotifications(data.notifications);
    }
  }, [authState.isLoggedIn, authState.token, fetchData]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every 60 seconds
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNotificationClick = (notification) => {
    if (notification.task && notification.task._id) {
      navigate(`/tasks/${notification.task._id}`);
      setShowDropdown(false);
    } else {
      console.warn("No taskId found for notification:", notification);
    }
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation(); // Prevent triggering notification click
    if (!authState.isLoggedIn) return;
    const config = {
      url: `/notifications/${notificationId}`,
      method: 'delete',
      headers: { Authorization: `Bearer ${authState.token}` },
    };
    const data = await fetchData(config);
    if (data && data.status) {
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } else {
      console.error('Failed to delete notification');
    }
  };

  const badge = unreadCount > 0 ? (
    <span className="absolute top-1 right-1 z-[9999] inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
      {unreadCount}
    </span>
  ) : null;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative focus:outline-none"
        aria-label="Notifications"
      >
        <i className="fa-solid fa-bell text-white text-xl"></i>
        {badge}

      </button>

      {showDropdown && (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded shadow-lg z-[9999] max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-black text-sm">No notifications</div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification._id}
                className={`p-3 border-b border-gray-200 cursor-pointer flex justify-between items-start ${
                  notification.read ? 'bg-gray-100' : 'bg-white font-semibold'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="text-black text-sm">
                  {notification.message}
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteNotification(e, notification._id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                  aria-label="Delete notification"
                  title="Delete notification"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
