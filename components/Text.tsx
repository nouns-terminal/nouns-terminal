import { memo, ReactNode } from 'react';

type Color =
  | 'dark-bg'
  | 'surface-bg'
  | 'lines'
  | 'bright-text'
  | 'mid-text'
  | 'low-text'
  | 'hint-text'
  | 'yellow'
  | 'green'
  | 'red'
  | 'blue'
  | 'pink';

type Variant =
  | 'large-title'
  | 'title-1'
  | 'title-2'
  | 'title-3'
  | 'headline'
  | 'body'
  | 'subhead'
  | 'footnote';

type Props = {
  variant: Variant;
  bold?: boolean;
  color?: Color;
  children: ReactNode;
  multiline?: boolean;
};

export function textStyle(props: Omit<Props, 'children'>) {
  return `
      color: ${props.color ? 'var(--' + props.color + ')' : 'inherit'};
      font-weight: ${props.bold ? '600' : '400'};
      font-size: ${sizes[props.variant]}rem;
      line-height: ${props.multiline ? 1.2 : '0.8em'};
  `;
}

const Text = memo((props: Props) => {
  return (
    <span className="text">
      {props.children}
      <style jsx>{`
        .text {
          ${textStyle(props)}
        }
      `}</style>
    </span>
  );
});

const sizes = {
  'large-title': 2,
  'title-1': 1.5,
  'title-2': 1.3,
  'title-3': 1.1,
  headline: 1,
  body: 1,
  subhead: 0.9,
  footnote: 0.8,
};

Text.displayName = 'Text';

export default Text;
