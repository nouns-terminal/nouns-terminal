import { ReactNode } from 'react';

type Props = {
  direction: 'row' | 'column';
  gap: -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5;
  children: ReactNode;
};

export default function Stack(props: Props) {
  return (
    <div className="stack">
      {props.children}
      <style jsx>{`
        .stack {
          display: flex;
          flex-direction: ${props.direction};
          gap: var(${'--s' + props.gap});
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
