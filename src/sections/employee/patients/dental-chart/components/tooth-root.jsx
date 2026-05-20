import PropTypes from 'prop-types';

const ROOT_FILL = '#E8DFD0';
const ROOT_STROKE = '#C4A882';

// Single tapered root shape centered in 44px wide space
function SingleRoot({ height }) {
  const w = 11;
  const cx = 22;
  const x1 = cx - w / 2;
  const x2 = cx + w / 2;
  return (
    <path
      d={`M${x1},0 L${x1 - 2},${height * 0.6} Q${cx},${height} ${x2 + 2},${height * 0.6} L${x2},0 Z`}
      fill={ROOT_FILL}
      stroke={ROOT_STROKE}
      strokeWidth="0.8"
    />
  );
}

// Two roots side by side
function DoubleRoot({ height }) {
  const w = 9;
  const h = height;
  const tip = h * 0.95;
  return (
    <>
      {/* Left root */}
      <path
        d={`M6,0 L5,${h * 0.5} Q10,${tip} 15,${h * 0.5} L14,0 Z`}
        fill={ROOT_FILL}
        stroke={ROOT_STROKE}
        strokeWidth="0.8"
      />
      {/* Right root */}
      <path
        d={`M30,0 L29,${h * 0.5} Q34,${tip} 39,${h * 0.5} L38,0 Z`}
        fill={ROOT_FILL}
        stroke={ROOT_STROKE}
        strokeWidth="0.8"
      />
    </>
  );
}

// Three roots (palatal + two buccal) for upper molars
function TripleRoot({ height }) {
  const h = height;
  return (
    <>
      {/* Left buccal */}
      <path
        d={`M3,0 L2,${h * 0.5} Q8,${h * 0.9} 13,${h * 0.5} L12,0 Z`}
        fill={ROOT_FILL}
        stroke={ROOT_STROKE}
        strokeWidth="0.8"
      />
      {/* Palatal (center, longer) */}
      <path
        d={`M17,0 L16,${h * 0.6} Q22,${h} 28,${h * 0.6} L27,0 Z`}
        fill={ROOT_FILL}
        stroke={ROOT_STROKE}
        strokeWidth="0.8"
      />
      {/* Right buccal */}
      <path
        d={`M31,0 L30,${h * 0.5} Q36,${h * 0.9} 41,${h * 0.5} L40,0 Z`}
        fill={ROOT_FILL}
        stroke={ROOT_STROKE}
        strokeWidth="0.8"
      />
    </>
  );
}

// ToothRoot renders roots pointing DOWN from y=0.
// The parent flips it vertically for upper arch teeth (roots point up).
function getRootShape(rootCount) {
  if (rootCount === 3) return TripleRoot;
  if (rootCount === 2) return DoubleRoot;
  return SingleRoot;
}

export default function ToothRoot({ rootCount, height, flipUp }) {
  const RootShape = getRootShape(rootCount);

  return (
    <svg
      width={44}
      height={height}
      viewBox={`0 0 44 ${height}`}
      style={{ display: 'block', transform: flipUp ? 'scaleY(-1)' : undefined }}
    >
      <RootShape height={height} />
    </svg>
  );
}

ToothRoot.propTypes = {
  rootCount: PropTypes.number,
  height: PropTypes.number,
  flipUp: PropTypes.bool,
};

ToothRoot.defaultProps = {
  rootCount: 1,
  height: 28,
  flipUp: false,
};

SingleRoot.propTypes = { height: PropTypes.number.isRequired };
DoubleRoot.propTypes = { height: PropTypes.number.isRequired };
TripleRoot.propTypes = { height: PropTypes.number.isRequired };
