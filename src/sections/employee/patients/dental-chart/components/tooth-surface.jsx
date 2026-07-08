import PropTypes from 'prop-types';
import { memo, useState, useCallback } from 'react';

/**
 * A single clickable tooth surface (occlusal / buccal / lingual / mesial / distal).
 *
 * Rendered as one SVG <path> whose outline follows the anatomic crown contour.
 * Keeps its own hover state and is fully keyboard-operable (Tab to focus,
 * Enter/Space to activate) for accessibility.
 */
function ToothSurface({
  fdiNumber,
  surfaceKey,
  d,
  fill,
  stroke,
  strokeWidth,
  ariaLabel,
  onSurfaceClick,
}) {
  const [hovered, setHovered] = useState(false);

  const activate = useCallback(
    (e) => {
      e.stopPropagation();
      onSurfaceClick(fdiNumber, surfaceKey);
    },
    [fdiNumber, surfaceKey, onSurfaceClick]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(e);
      }
    },
    [activate]
  );

  return (
    <g>
      <path
        id={`tooth-${fdiNumber}-${surfaceKey}`}
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        style={{ cursor: 'pointer', outline: 'none' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={activate}
        onKeyDown={handleKeyDown}
      />
      {hovered && (
        <path
          d={d}
          fill="rgba(25,118,210,0.22)"
          stroke="#1976D2"
          strokeWidth="0.8"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </g>
  );
}

ToothSurface.propTypes = {
  fdiNumber: PropTypes.number.isRequired,
  surfaceKey: PropTypes.string.isRequired,
  d: PropTypes.string.isRequired,
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ariaLabel: PropTypes.string,
  onSurfaceClick: PropTypes.func.isRequired,
};

ToothSurface.defaultProps = {
  fill: '#FFFFFF',
  stroke: '#9A8F7A',
  strokeWidth: 0.4,
  ariaLabel: undefined,
};

export default memo(ToothSurface);
