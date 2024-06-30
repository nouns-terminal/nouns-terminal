export default function HorizontalLine() {
  return (
    <>
      <div className="hr" />
      <style jsx>{`
        .hr {
          height: 1px;
          background-color: var(--lines);
          margin: var(--s1) 0;
        }
      `}</style>
    </>
  );
}
