import React, { useEffect, useRef } from 'react';

export function Logo() {
  return <Noggles left={EYE_EE} right={EYE_EE} />;
}

export default function NogglesThatFollowCursor() {
  const containerRef = useRef<SVGSVGElement>(null);

  const [leftEye, setLeftEye] = React.useState(EYE_EE);
  const [rightEye, setRightEye] = React.useState(EYE_EE);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const div = containerRef.current;
      if (!div) {
        return;
      }

      const rect = div.getBoundingClientRect();
      const midY = Math.round(rect.top + rect.height / 2);
      const midX = Math.round(rect.left + rect.width / 2);
      const cX = e.clientX;
      const cY = e.clientY;

      const distance = Math.sqrt((cX - midX) ** 2 + (cY - midY) ** 2);

      if (distance > 300) {
        setLeftEye(EYE_EE);
        setRightEye(EYE_EE);
        return;
      }

      const computeEye = (midX: number, midY: number) => {
        const angle = Math.atan2(cY - midY, cX - midX) * (180 / Math.PI);
        const index = (Math.round(angle / 45) + 4) % 8;
        return EYES[index];
      };

      setLeftEye(computeEye(Math.round(rect.left + rect.height), midY));
      setRightEye(computeEye(Math.round(rect.left + rect.height * 2), midY));
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const rightEyeFixed = VALID_EYE_PAIRS.find(
    ([left, right]) => left === leftEye && right === rightEye
  )
    ? rightEye
    : leftEye;

  return <Noggles r={containerRef} left={leftEye} right={rightEyeFixed} />;
}

function Noggles({
  left,
  right,
  r,
}: {
  left: number;
  right: number;
  r?: React.Ref<SVGSVGElement>;
}) {
  return (
    <svg ref={r} width="48" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#aaaa)">
        <path d="M24 3H12v12h12V3ZM45 3H33v12h12V3Z" fill="#fff" />
        {renderEye(12, left).map((d, i) => (
          <path key={i} d={d} fill="#000" />
        ))}
        {renderEye(33, right).map((d, i) => (
          <path key={i} d={d} fill="#000" />
        ))}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27 0H9v6H0v9h3V9h6v9h18V9h3v9h18V0H30v6h-3V0Zm18 15V3H33v12h12Zm-21 0H12V3h12v12Z"
          fill="#F3322C"
        />
      </g>
      <defs>
        <clipPath id="aaaa">
          <path fill="#fff" d="M0 0h48v18H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

const EYE_EE = 0b01010101;
const EYE_SE = 0b00010111;
const EYE_SS = 0b00001111;
const EYE_SW = 0b00101011;
const EYE_WW = 0b10101010;
const EYE_NW = 0b11101000;
const EYE_NN = 0b11110000;
const EYE_NE = 0b11010100;

const EYES = [EYE_WW, EYE_NW, EYE_NN, EYE_NE, EYE_EE, EYE_SE, EYE_SS, EYE_SW];

const VALID_EYE_PAIRS = [
  ...EYES.map((eye) => [eye, eye]),
  [EYE_NE, EYE_NW],
  [EYE_EE, EYE_WW],
  [EYE_SE, EYE_SW],
];

function renderEye(xStart: number, eye: number) {
  return eye
    .toString(2)
    .padStart(8, '0')
    .split('')
    .map((bit, i) => {
      if (bit === '0') {
        return null;
      }

      const x = xStart + (i % 2 === 0 ? 0 : 6);
      const y = Math.floor(i / 2) * 3 + 3;
      return `M${x},${y}h6v3h-6v3Z`;
    })
    .filter(Boolean) as string[];
}
