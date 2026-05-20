import PropTypes from 'prop-types';

// Maps tooth status to fill color
export const STATUS_COLORS = {
  healthy: '#FFFFFF',
  cavity: '#EF5350',
  filling: '#42A5F5',
  crown: '#FFD700',
  missing: '#9E9E9E',
  root_canal: '#FF8F00',
  extraction_needed: '#AB47BC',
};

export const STATUS_STROKE = {
  healthy: '#BDBDBD',
  cavity: '#C62828',
  filling: '#1565C0',
  crown: '#F57F17',
  missing: '#616161',
  root_canal: '#E65100',
  extraction_needed: '#6A1B9A',
};

// FDI-style tooth numbering layout
// Upper arch: teeth 1-16 (1-8 right, 9-16 left)  — displayed left→right as: 16,15,...9,8,...1
// Lower arch: teeth 17-32 (17-24 left, 25-32 right) — displayed left→right as: 17,...24,25,...32
// We use a simpler sequential display (1-16 top, 17-32 bottom) with labels
export const UPPER_TEETH = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
export const LOWER_TEETH = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

// Tooth shape: molars wider, incisors narrower
const TOOTH_WIDTHS = {
  1: 18, 2: 18, 3: 20, 4: 16, 5: 16, 6: 22, 7: 22, 8: 22,
  9: 22, 10: 22, 11: 22, 12: 16, 13: 16, 14: 20, 15: 18, 16: 18,
  17: 18, 18: 18, 19: 20, 20: 16, 21: 16, 22: 22, 23: 22, 24: 22,
  25: 22, 26: 22, 27: 22, 28: 16, 29: 16, 30: 20, 31: 18, 32: 18,
};

function getTextColor(isMissing, currentStatus) {
  if (isMissing) return '#9E9E9E';
  if (currentStatus === 'healthy') return '#424242';
  return '#212121';
}

export default function ToothSVG({ toothNumber, status, onClick, size = 36 }) {
  const fill = STATUS_COLORS[status] || STATUS_COLORS.healthy;
  const stroke = STATUS_STROKE[status] || STATUS_STROKE.healthy;
  const isMissing = status === 'missing';
  const isMolar = [1,2,3,15,16,17,18,19,31,32].includes(toothNumber);

  return (
    <svg
      width={size}
      height={size + 8}
      viewBox="0 0 36 44"
      style={{ cursor: 'pointer', display: 'block' }}
      onClick={() => onClick(toothNumber)}
      aria-label={`Tooth ${toothNumber}: ${status}`}
    >
      {/* Root */}
      {!isMissing && (
        isMolar ? (
          <>
            <rect x="8" y="28" width="6" height="12" rx="3" fill="#E0D0C0" stroke="#C4A882" strokeWidth="0.8" />
            <rect x="22" y="28" width="6" height="12" rx="3" fill="#E0D0C0" stroke="#C4A882" strokeWidth="0.8" />
          </>
        ) : (
          <rect x="14" y="28" width="8" height="13" rx="4" fill="#E0D0C0" stroke="#C4A882" strokeWidth="0.8" />
        )
      )}

      {/* Crown body */}
      {isMissing ? (
        <line x1="6" y1="6" x2="30" y2="28" stroke="#9E9E9E" strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        <rect
          x="4"
          y="4"
          width="28"
          height="26"
          rx={isMolar ? 5 : 8}
          fill={fill}
          stroke={stroke}
          strokeWidth="1.8"
        />
      )}

      {/* Tooth number label */}
      <text
        x="18"
        y="21"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fontWeight="600"
        fill={getTextColor(isMissing, status)}
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {toothNumber}
      </text>
    </svg>
  );
}

ToothSVG.propTypes = {
  toothNumber: PropTypes.number.isRequired,
  status: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.number,
};
