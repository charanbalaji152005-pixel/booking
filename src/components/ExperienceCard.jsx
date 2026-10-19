import React from 'react';
import { MapPin, Check, RotateCw, Calendar as CalendarIcon } from 'lucide-react';
import TiltCard from './TiltCard.jsx';

import tentImg from '../assets/tent.png';
import kayakImg from '../assets/kayak.png';
import pineBranchImg from '../assets/pine-branch.png';
import waterSplashImg from '../assets/water-splash.png';
import mossyRockImg from '../assets/mossy-rock.png';
import pebblesImg from '../assets/pebbles.png';
import grassBg from '../assets/grass-bg.jpg';
import waterBg from '../assets/water-bg.jpg';

function CardFace({
  activityKey,
  activity,
  isBooked,
  bookingDate,
  onOpenModal,
  onFlip,
  isHovered,
  isBackFace = false,
}) {
  const isCamping = activityKey === 'Camping';

  return (
    <article
      className={`experience-card-frame ${activity.accent} ${isBackFace ? 'card-back-face' : 'card-front-face'} ${
        isHovered ? 'card-hovered' : ''
      }`}
    >
      {/* Top Visual Half */}
      <div className="card-media-viewport">
        {/* Subtle 3D Flip button on card */}
        <button
          type="button"
          className="card-quick-flip-btn"
          onClick={(e) => {
            e.stopPropagation();
            onFlip();
          }}
          title={`Flip to ${isCamping ? 'Kayaking' : 'Camping'}`}
          aria-label={`Flip to ${isCamping ? 'Kayaking' : 'Camping'}`}
        >
          <RotateCw size={12} className="flip-icon-spin" />
          <span>Flip</span>
        </button>

        {/* Background Texture */}
        <img
          src={isCamping ? grassBg : waterBg}
          alt={isCamping ? 'Lush green grass' : 'Crystal turquoise ocean water'}
          className="media-background-texture"
        />

        {/* Gradient fog blend at bottom */}
        <div className="media-gradient-blend" />

        {/* Secondary Breakout Object (Pine Branch / Water Splash) */}
        <img
          src={isCamping ? pineBranchImg : waterSplashImg}
          alt={isCamping ? 'Pine tree branch' : 'Water ocean splash'}
          className={`breakout-layer secondary-breakout ${isCamping ? 'pine-branch' : 'water-splash'} ${
            isHovered ? 'breakout-active' : ''
          }`}
        />

        {/* Main Breakout Hero Object (Tent / Kayak) */}
        <img
          src={isCamping ? tentImg : kayakImg}
          alt={isCamping ? '3D Camping Tent' : '3D Yellow Kayak'}
          className={`breakout-layer hero-breakout ${isCamping ? 'tent-hero' : 'kayak-hero'} ${
            isHovered ? 'breakout-active' : ''
          }`}
        />
      </div>

      {/* Bottom Content Half */}
      <div className="card-body-content">
        <h2 className="activity-title">{activity.name}</h2>

        <div className="price-main">
          <span className="price-amount">{activity.price}</span>
          <span className="price-separator">/</span>
          <span className="price-unit">{activity.duration}</span>
        </div>

        <p className="per-person-text">per person</p>

        <div className="location-row">
          <MapPin size={15} className="location-pin-icon" />
          <span>{activity.location}</span>
        </div>

        {/* Booking status pill */}
        <div className="status-slot">
          {isBooked ? (
            <button
              type="button"
              className="booked-status-pill clickable-pill"
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal(activityKey);
              }}
              title="Click to manage or change booking date"
              aria-label={`Booked for ${bookingDate || '30 Sept 2026'}. Click to manage.`}
            >
              <Check size={13} strokeWidth={2.5} className="pill-check-icon" />
              <span>Booked: {bookingDate || '30 Sept 2026'}</span>
            </button>
          ) : (
            <div className="status-placeholder" />
          )}
        </div>

        {/* Main Action Button */}
        <button
          type="button"
          className={`card-cta-button ${isBooked ? 'cta-manage' : 'cta-choose'}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(activityKey);
          }}
          title={isBooked ? 'Manage Booking Date' : 'Open Calendar to Choose Date'}
        >
          <CalendarIcon size={13} className="btn-inline-icon" />
          <span>{isBooked ? 'Manage Booking' : 'Choose Date'}</span>
        </button>
      </div>

      {/* Floating Corner Stone / Pebbles */}
      <div
        className={`floating-corner-prop ${isCamping ? 'mossy-stone-prop' : 'pebbles-prop'} ${
          isHovered ? 'prop-hovered' : ''
        }`}
      >
        <img
          src={isCamping ? mossyRockImg : pebblesImg}
          alt={isCamping ? 'Mossy river rock' : 'Smooth river pebbles'}
          className="corner-prop-img"
        />
      </div>
    </article>
  );
}

export default function ExperienceCard({
  activities,
  bookings,
  activeKey,
  onFlip,
  onOpenModal,
}) {
  const isFlipped = activeKey === 'Kayaking';

  return (
    <div className="experience-card-outer-wrapper">
      <TiltCard
        className="main-experience-tilt"
        maxTilt={14}
        isFlipped={isFlipped}
        onFlip={onFlip}
      >
        {({ isHovered }) => (
          <div className={`card-3d-flipper ${isFlipped ? 'is-flipped' : ''}`}>
            {/* FRONT FACE: Camping */}
            <div className="card-flipper-face card-front-face-wrapper">
              <CardFace
                activityKey="Camping"
                activity={activities.Camping}
                isBooked={bookings.Camping?.booked}
                bookingDate={bookings.Camping?.formattedDate}
                onOpenModal={onOpenModal}
                onFlip={onFlip}
                isHovered={!isFlipped && isHovered}
                isBackFace={false}
              />
            </div>

            {/* BACK FACE: Kayaking */}
            <div className="card-flipper-face card-back-face-wrapper">
              <CardFace
                activityKey="Kayaking"
                activity={activities.Kayaking}
                isBooked={bookings.Kayaking?.booked}
                bookingDate={bookings.Kayaking?.formattedDate}
                onOpenModal={onOpenModal}
                onFlip={onFlip}
                isHovered={isFlipped && isHovered}
                isBackFace={true}
              />
            </div>
          </div>
        )}
      </TiltCard>
    </div>
  );
}
