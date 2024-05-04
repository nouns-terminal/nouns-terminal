import { useEffect, useRef } from 'react';
import Text, { textStyle } from './Text';

type Props = {
  label?: string;
  units?: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
};

export default function LabeledTextInput({
  label,
  units,
  placeholder,
  value,
  onChange,
  autoFocus,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container" onClick={() => inputRef.current?.focus()}>
      {label && (
        <Text variant="title-3" bold color="mid-text">
          {label}:
        </Text>
      )}
      <div className="input-container">
        <Text variant="title-3" color="low-text">
          {units}
        </Text>
        <input
          ref={inputRef}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          gap: var(--s-1);
        }
        .input-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          border: 1px solid var(--lines);
          padding: var(--s0);
        }
        input {
          flex: 1;
          text-align: right;
          border: none;
          background: none;
          outline: none;
          ${textStyle({ variant: 'title-2' })}
          font-size: calc(max(1rem, 16px));
        }
      }`}</style>
    </div>
  );
}
