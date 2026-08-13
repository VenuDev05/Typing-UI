const ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

// A visual hint of which key comes next. Purely illustrative.
export default function Keyboard({ nextChar }) {
  const target = (nextChar || '').toLowerCase();
  const isSpace = nextChar === ' ';

  const renderKey = (k) => (
    <div key={k} className={`key ${target === k ? 'key--next' : ''}`}>
      {k}
    </div>
  );

  return (
    <div className="kbd" aria-hidden="true">
      {ROWS.map((row, i) => (
        <div className="kbd__row" key={i}>
          {i === 1 && <div className="key key--wide">home</div>}
          {row.map(renderKey)}
          {i === 1 && <div className="key key--wide">enter</div>}
        </div>
      ))}
      <div className="kbd__row">
        <div className={`key key--space ${isSpace ? 'key--next' : ''}`}>space</div>
      </div>
    </div>
  );
}
