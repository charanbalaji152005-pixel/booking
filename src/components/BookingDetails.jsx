import React from 'react';
import { CalendarCheck, Calendar as CalendarIcon, Check, Tent, Ship } from 'lucide-react';

export default function BookingDetails({
  activities,
  bookings,
  activeActivity,
  onSelectActivity,
  onOpenBookingModal,
}) {
  // Calculate total payable
  const totalPayable = Object.entries(activities).reduce((acc, [name, act]) => {
    if (bookings[name]?.booked) {
      const numericPrice = parseInt(act.price.replace(/[^\d]/g, ''), 10) || 0;
      return acc + numericPrice;
    }
    return acc;
  }, 0);

  const formattedTotal = totalPayable > 0 ? `₹${totalPayable.toLocaleString('en-IN')}` : '₹0';

  return (
    <aside className="booking-details-panel">
      <div className="panel-header">
        <CalendarCheck size={18} className="panel-header-icon" />
        <h3 className="panel-title">Booking Details</h3>
      </div>

      <div className="panel-items-list">
        {Object.entries(activities).map(([name, act]) => {
          const isBooked = bookings[name]?.booked;
          const bookDate = bookings[name]?.formattedDate || '30 Sept 2026';
          const isSelected = activeActivity === name;

          return (
            <div
              key={name}
              className={`panel-row-item ${isSelected ? 'is-selected' : ''} ${isBooked ? 'is-booked-row' : ''}`}
              onClick={() => onSelectActivity(name)}
              role="button"
              tabIndex={0}
              title={`Switch to ${name}`}
            >
              <div className="row-item-left">
                <div className={`row-icon-badge ${act.accent}`}>
                  {name === 'Camping' ? <Tent size={16} /> : <Ship size={16} />}
                </div>
                <div className="row-item-meta">
                  <span className="row-activity-name">{name}</span>
                  {isBooked ? (
                    <span className="row-booked-tag">
                      <Check size={12} strokeWidth={2.5} /> {bookDate}
                    </span>
                  ) : (
                    <span className="row-unbooked-tag">Not Booked</span>
                  )}
                </div>
              </div>

              <div className="row-item-right">
                <span className="row-item-price">{act.price}</span>
                <button
                  type="button"
                  className={`row-action-btn ${isBooked ? 'edit-btn' : 'choose-btn'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenBookingModal(name);
                  }}
                  title={isBooked ? `Edit ${name} booking date` : `Open calendar to book ${name}`}
                >
                  <CalendarIcon size={11} className="row-cal-btn-icon" />
                  <span>{isBooked ? 'Edit' : 'Choose Date'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel-divider-line" />

      <div className="panel-total-row">
        <span className="total-label">Total Payable</span>
        <span className="total-amount">{formattedTotal}</span>
      </div>
    </aside>
  );
}
