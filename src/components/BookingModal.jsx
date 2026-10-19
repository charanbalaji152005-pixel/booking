import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, X, Tent, Ship, Trash2, Check, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BookingModal({
  isOpen,
  onClose,
  activityKey,
  activity,
  isBooked = false,
  onConfirm,
  onCancelBooking,
  initialDate = '2026-09-30',
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [quickPick, setQuickPick] = useState('Tomorrow');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Starts closed as a button trigger

  // Calendar navigation month and year (September 2026)
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(8); // September (0-indexed)

  const calendarWrapperRef = useRef(null);

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
      const parts = initialDate.split('-');
      if (parts.length === 3) {
        setViewYear(parseInt(parts[0], 10));
        setViewMonth(parseInt(parts[1], 10) - 1);
      }
    }
    // Start with calendar closed when opening modal
    setIsCalendarOpen(false);
  }, [initialDate, isOpen]);

  // Close calendar if clicked outside the calendar wrapper
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        isCalendarOpen &&
        calendarWrapperRef.current &&
        !calendarWrapperRef.current.contains(e.target)
      ) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalendarOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (isCalendarOpen) {
          setIsCalendarOpen(false);
        } else if (isOpen) {
          onClose();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCalendarOpen, onClose]);

  if (!isOpen || !activity) return null;

  // Format YYYY-MM-DD to DD-MM-YYYY
  const formatDisplayDate = (dStr) => {
    if (!dStr) return '29-09-2026';
    const parts = dStr.split('-');
    if (parts.length !== 3) return dStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const handleQuickPick = (type) => {
    setQuickPick(type);
    const now = new Date(2026, 8, 28); // Sep 28, 2026 reference
    let target = new Date(now);

    if (type === 'Tomorrow') {
      target.setDate(now.getDate() + 1); // 29-09-2026
    } else if (type === 'This Saturday') {
      target.setDate(now.getDate() + 2); // 30-09-2026
    } else if (type === 'In 1 Week') {
      target.setDate(now.getDate() + 7); // 05-10-2026
    }

    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const dd = String(target.getDate()).padStart(2, '0');
    const formatted = `${yyyy}-${mm}-${dd}`;
    setSelectedDate(formatted);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
  };

  const handleSelectDay = (day, monthOffset = 0) => {
    let targetMonth = viewMonth + monthOffset;
    let targetYear = viewYear;

    if (targetMonth < 0) {
      targetMonth = 11;
      targetYear -= 1;
    } else if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }

    const yyyy = targetYear;
    const mm = String(targetMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
    setQuickPick('');
    // Close dropdown after selecting date just like interactive date pickers
    setIsCalendarOpen(false);
  };

  const prevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleToday = (e) => {
    e.stopPropagation();
    setSelectedDate('2026-09-30');
    setViewYear(2026);
    setViewMonth(8);
    setQuickPick('This Saturday');
    setIsCalendarOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedDate('2026-09-29');
    setQuickPick('Tomorrow');
  };

  const handleConfirm = () => {
    onConfirm(activityKey, selectedDate || '2026-09-30');
    onClose();
  };

  const handleCancelBooking = () => {
    if (onCancelBooking) {
      onCancelBooking(activityKey);
    }
    onClose();
  };

  // Build calendar matrix
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // Sunday = 0
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const selParts = selectedDate ? selectedDate.split('-').map((v) => parseInt(v, 10)) : [];
  const selY = selParts[0];
  const selM = selParts[1] ? selParts[1] - 1 : null;
  const selD = selParts[2];

  const calendarCells = [];

  // Previous month overflow days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      monthOffset: -1,
      isSelected: selY === viewYear && selM === viewMonth - 1 && selD === d,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      monthOffset: 0,
      isSelected: selY === viewYear && selM === viewMonth && selD === d,
    });
  }

  // Next month overflow days
  const remainingCells = 35 - calendarCells.length;
  if (remainingCells > 0) {
    for (let d = 1; d <= remainingCells; d++) {
      calendarCells.push({
        day: d,
        isCurrentMonth: false,
        monthOffset: 1,
        isSelected: selY === viewYear && selM === viewMonth + 1 && selD === d,
      });
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Activity Badge */}
        <div className={`modal-activity-badge ${activity.accent}`}>
          {activity.name === 'Camping' ? <Tent size={14} /> : <Ship size={14} />}
          <span>{activity.name.toUpperCase()}</span>
        </div>

        <h2 className="modal-title">
          {isBooked ? 'Manage Booking Date' : 'Select Booking Date'}
        </h2>
        <p className="modal-subtitle">
          {activity.location} • {activity.price} per person
        </p>

        {/* Date Field with Calendar Toggle Button */}
        <div className="modal-field-group">
          <label className="modal-label" htmlFor="calendar-trigger-btn">CHOOSE DATE</label>
          
          <div className="calendar-button-wrapper" ref={calendarWrapperRef}>
            <div className={`modal-date-picker-box ${isCalendarOpen ? 'is-active-box' : ''}`}>
              <button
                type="button"
                className="modal-date-text-btn"
                onClick={() => setIsCalendarOpen((prev) => !prev)}
                title="Click to toggle calendar"
                aria-label="Selected date: click to change"
              >
                <span className="modal-date-text">{formatDisplayDate(selectedDate)}</span>
              </button>

              {/* The Calendar as dedicated Button */}
              <button
                id="calendar-trigger-btn"
                type="button"
                className={`modal-calendar-icon-btn ${isCalendarOpen ? 'is-active-cal-btn' : ''}`}
                onClick={() => setIsCalendarOpen((prev) => !prev)}
                aria-expanded={isCalendarOpen}
                aria-haspopup="dialog"
                aria-label="Toggle calendar date picker"
                title="Open calendar"
              >
                <CalendarIcon size={18} className="modal-calendar-icon" />
              </button>
            </div>

            {/* Floating Dropdown Calendar Popup */}
            {isCalendarOpen && (
              <div
                className="custom-calendar-popup floating-dropdown"
                role="dialog"
                aria-label="Calendar date picker"
              >
                {/* Calendar Header with Month/Year Navigation */}
                <div className="calendar-header-bar">
                  <button
                    type="button"
                    className="cal-nav-btn prev"
                    onClick={prevMonth}
                    aria-label="Previous month"
                    title="Previous month"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="cal-month-title">
                    <span>{MONTH_NAMES[viewMonth]}, {viewYear}</span>
                    <ChevronDown size={14} className="cal-title-chevron" />
                  </div>

                  <button
                    type="button"
                    className="cal-nav-btn next"
                    onClick={nextMonth}
                    aria-label="Next month"
                    title="Next month"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Day of Week Labels */}
                <div className="calendar-weekdays-row">
                  {DAYS_OF_WEEK.map((d) => (
                    <span key={d} className="cal-weekday-cell">{d}</span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="calendar-days-grid">
                  {calendarCells.map((cell, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`cal-day-cell ${cell.isCurrentMonth ? 'in-month' : 'out-month'} ${
                        cell.isSelected ? 'is-selected-day' : ''
                      }`}
                      onClick={() => handleSelectDay(cell.day, cell.monthOffset)}
                    >
                      {cell.day}
                    </button>
                  ))}
                </div>

                {/* Calendar Footer Actions */}
                <div className="calendar-footer-bar">
                  <button type="button" className="cal-footer-action-btn" onClick={handleClear}>
                    Clear
                  </button>
                  <button type="button" className="cal-footer-action-btn today-btn" onClick={handleToday}>
                    Today
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Pick Pills */}
        <div className="quick-picks-row">
          {['Tomorrow', 'This Saturday', 'In 1 Week'].map((label) => (
            <button
              key={label}
              type="button"
              className={`quick-pick-pill ${quickPick === label ? 'active' : ''}`}
              onClick={() => handleQuickPick(label)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Actions Column */}
        <div className="modal-actions-column">
          <button type="button" className="modal-confirm-btn" onClick={handleConfirm}>
            <Check size={16} />
            <span>{isBooked ? 'Save Changes' : 'Confirm Booking'}</span>
          </button>

          {isBooked && (
            <button
              type="button"
              className="modal-cancel-booking-btn"
              onClick={handleCancelBooking}
            >
              <Trash2 size={14} />
              <span>Cancel Booking</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
