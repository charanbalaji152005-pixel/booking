import React, { useState, useEffect, useCallback } from 'react';
import ExperienceCard from './components/ExperienceCard.jsx';
import BookingDetails from './components/BookingDetails.jsx';
import BookingModal from './components/BookingModal.jsx';

const activities = {
  Kayaking: {
    name: 'Kayaking',
    price: '₹3,299',
    duration: '4hrs',
    location: 'Drina, Serbia',
    accent: 'blue',
  },
  Camping: {
    name: 'Camping',
    price: '₹2,499',
    duration: '8hrs',
    location: 'Tara, Serbia',
    accent: 'green',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Camping');
  const [modalActivityKey, setModalActivityKey] = useState(null);

  // Initial state matching the video's initial view
  const [bookings, setBookings] = useState({
    Camping: {
      booked: true,
      date: '2026-09-30',
      formattedDate: '30 Sept 2026',
    },
    Kayaking: {
      booked: false,
      date: null,
      formattedDate: '',
    },
  });

  const handleToggleFlip = useCallback(() => {
    setActiveTab((prev) => (prev === 'Camping' ? 'Kayaking' : 'Camping'));
  }, []);

  const handleSelectTab = useCallback((name) => {
    setActiveTab(name);
  }, []);

  // Keyboard navigation for card flipping
  useEffect(() => {
    function handleKeyDown(e) {
      if (modalActivityKey) return; // Do not flip while modal is open
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        handleToggleFlip();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalActivityKey, handleToggleFlip]);

  const handleOpenModal = (activityKey = activeTab) => {
    // If opening modal for a different activity than currently shown, flip to it!
    if (activityKey !== activeTab) {
      setActiveTab(activityKey);
    }
    setModalActivityKey(activityKey);
  };

  const handleCloseModal = () => {
    setModalActivityKey(null);
  };

  const handleConfirmBooking = (activityKey, dateString) => {
    if (!activityKey) return;

    let formatted = '30 Sept 2026';
    if (dateString) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        formatted = d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      }
    }

    setBookings((prev) => ({
      ...prev,
      [activityKey]: {
        booked: true,
        date: dateString,
        formattedDate: formatted,
      },
    }));
  };

  const handleCancelBooking = (activityKey) => {
    if (!activityKey) return;
    setBookings((prev) => ({
      ...prev,
      [activityKey]: {
        booked: false,
        date: null,
        formattedDate: '',
      },
    }));
  };

  return (
    <main className="app-stage-root">
      {/* Top Activity Switcher */}
      <nav className="activity-segmented-switcher" role="tablist" aria-label="Activity selector">
        {['Kayaking', 'Camping'].map((name) => {
          const isActive = activeTab === name;
          return (
            <button
              key={name}
              role="tab"
              aria-selected={isActive}
              className={`switcher-pill-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => handleSelectTab(name)}
              title={`Switch to ${name} with 3D Flip`}
            >
              {name.toUpperCase()}
            </button>
          );
        })}
      </nav>

      {/* Main Dual Cards Grid */}
      <section className="app-cards-container">
        {/* Left Interactive 3D Experience Card with 3D Flip Motion */}
        <ExperienceCard
          activities={activities}
          bookings={bookings}
          activeKey={activeTab}
          onFlip={handleToggleFlip}
          onOpenModal={handleOpenModal}
        />

        {/* Right Booking Details Summary Panel */}
        <BookingDetails
          activities={activities}
          bookings={bookings}
          activeActivity={activeTab}
          onSelectActivity={handleSelectTab}
          onOpenBookingModal={handleOpenModal}
        />
      </section>

      {/* Booking Date Selection / Management Modal */}
      {modalActivityKey && (
        <BookingModal
          isOpen={Boolean(modalActivityKey)}
          onClose={handleCloseModal}
          activityKey={modalActivityKey}
          activity={activities[modalActivityKey]}
          isBooked={bookings[modalActivityKey]?.booked}
          initialDate={bookings[modalActivityKey]?.date || '2026-09-30'}
          onConfirm={handleConfirmBooking}
          onCancelBooking={handleCancelBooking}
        />
      )}
    </main>
  );
}