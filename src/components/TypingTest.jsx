import { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { getPassage } from '../data/lessons.js';
import { playKey } from '../utils/sound.js';
import { computeStats } from '../utils/stats.js';
import Keyboard from './Keyboard.jsx';

function freshText(difficulty) {
  return `${getPassage(difficulty)} ${getPassage(difficulty)} ${getPassage(difficulty)}`;
}

export default function TypingTest({ sound, difficulty, duration, onFinish }) {
  // `typed` only ever holds CORRECT characters — you cannot advance past a
  // mistake (stop-on-error). `wrongKey` is the last incorrect key pressed at
  // the current position; it shows in red until you type the right letter.
  const [target, setTarget] = useState(() => freshText(difficulty));
  const [typed, setTyped] = useState('');
  const [wrongKey, setWrongKey] = useState('');
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [focused, setFocused] = useState(false);
  const [, force] = useState(0);

  const startRef = useRef(0);
  const errorsRef = useRef(0);
  const wrongMapRef = useRef({});
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const innerRef = useRef(null);
  const curRef = useRef(null);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setTarget(freshText(difficulty));   // a different paragraph each run
    setTyped('');
    setWrongKey('');
    setStarted(false);
    setTimeLeft(duration);
    startRef.current = 0;
    errorsRef.current = 0;
    wrongMapRef.current = {};
    if (innerRef.current) innerRef.current.style.transform = 'translateY(0)';
  }, [difficulty, duration]);

  useEffect(() => { reset(); }, [difficulty, duration, reset]);

  const finish = useCallback(() => {
    clearInterval(timerRef.current);
    const elapsedMs = startRef.current ? Date.now() - startRef.current : duration * 1000;
    const correct = typed.length;               // all typed chars are correct
    const total = correct + errorsRef.current;   // + every wrong keystroke
    const stats = computeStats(correct, total, errorsRef.current, elapsedMs);
    const wrong = Object.entries(wrongMapRef.current)
      .map(([k, count]) => { const [expected, actual] = k.split('>'); return { expected, actual, count }; })
      .sort((a, b) => b.count - a.count);
    onFinish({ ...stats, wrong, durationSec: duration, difficulty });
  }, [typed, duration, onFinish, difficulty]);

  // Countdown — endless paragraph stops and scores when the timer hits zero.
  useEffect(() => {
    if (!started) return undefined;
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const left = Math.max(0, duration - elapsed);
      setTimeLeft(left);
      force((n) => n + 1);
      if (left <= 0) finish();
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [started, duration, finish]);

  // Keep the paragraph endless.
  useEffect(() => {
    if (target.length - typed.length < 80) {
      setTarget((t) => `${t} ${getPassage(difficulty)}`);
    }
  }, [typed, target, difficulty]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') return;
    if (timeLeft <= 0) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (wrongKey) setWrongKey('');            // clear a pending mistake first
      else setTyped((t) => t.slice(0, -1));
      return;
    }
    if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
    e.preventDefault();

    if (!started) { setStarted(true); startRef.current = Date.now(); }

    const cursor = typed.length;
    if (cursor >= target.length) return;
    const expected = target[cursor];

    if (e.key === expected) {
      // Correct key — advance and clear any pending mistake.
      setWrongKey('');
      playKey(expected === ' ' ? 'space' : 'ok', sound);
      setTyped((t) => t + e.key);
    } else {
      // Wrong key — DO NOT advance. Show it in red; you must fix it to move on.
      playKey('error', sound);
      errorsRef.current += 1;
      const k = `${expected}>${e.key}`;
      wrongMapRef.current[k] = (wrongMapRef.current[k] || 0) + 1;
      setWrongKey(e.key);
      force((n) => n + 1);
    }
  }, [started, target, timeLeft, sound, typed.length, wrongKey]);

  // Vertical-only auto-scroll: keep the active line near the top of the window.
  useLayoutEffect(() => {
    const cur = curRef.current;
    const inner = innerRef.current;
    if (!cur || !inner) return;
    const lineH = parseFloat(getComputedStyle(inner).lineHeight) || 46;
    const offset = Math.max(0, cur.offsetTop - lineH);
    inner.style.transform = `translateY(${-offset}px)`;
  }, [typed, wrongKey, target]);

  const live = useMemo(() => {
    const correct = typed.length;
    const total = correct + errorsRef.current;
    const elapsedMs = startRef.current ? Date.now() - startRef.current : 1;
    return computeStats(correct, total, errorsRef.current, Math.max(elapsedMs, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed, timeLeft, wrongKey]);

  // Render a bounded window of characters. pre-wrap wrapping + overflow-wrap
  // means words wrap at spaces and only break if a token is wider than the line,
  // so the text can never scroll horizontally.
  const cursor = typed.length;
  const end = Math.min(target.length, cursor + 260);
  const cells = [];
  for (let i = 0; i < end; i++) {
    const expected = target[i];
    let cls = 'ch ';
    let display = expected;
    let isCurrent = false;

    if (i < cursor) {
      cls += 'ch--correct';
    } else if (i === cursor) {
      isCurrent = true;
      if (wrongKey) {
        cls += expected === ' ' ? 'ch--wrong-space' : 'ch--wrong';
        display = wrongKey === ' ' ? '␣' : wrongKey;   // the wrongly typed letter, in red
      } else {
        cls += 'ch--current';
      }
    } else {
      cls += 'ch--pending';
    }

    cells.push(
      <span className={cls} key={i} ref={isCurrent ? curRef : null}>
        {display === ' ' ? ' ' : display}
      </span>
    );
  }

  return (
    <div>
      <div className="stats">
        <div className="stat">
          <div className="stat__value accent">{started ? live.wpm : 0}</div>
          <div className="stat__label">WPM</div>
        </div>
        <div className="stat">
          <div className="stat__value">{started ? `${live.accuracy}%` : '100%'}</div>
          <div className="stat__label">Accuracy</div>
        </div>
        <div className="stat">
          <div className="stat__value">{errorsRef.current}</div>
          <div className="stat__label">Errors</div>
        </div>
        <div className="stat">
          <div className="stat__value">{Math.ceil(timeLeft)}</div>
          <div className="stat__label">Seconds</div>
        </div>
      </div>

      <div className="screen" onClick={() => inputRef.current && inputRef.current.focus()}>
        <div className="screen__bar">
          <span className="screen__pill">⏱ {Math.ceil(timeLeft)}s</span>
          <span className="screen__progress">
            <span style={{ width: `${(1 - timeLeft / duration) * 100}%` }} />
          </span>
        </div>

        <input
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value=""
          onChange={() => {}}
          className="hidden-input"
          aria-label="Typing input"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
        />

        <div className="passage">
          <div className="passage__inner" ref={innerRef}>{cells}</div>
        </div>

        {!focused && (
          <div className="screen__overlay" onClick={() => inputRef.current.focus()}>
            <span>Click here and start typing to begin</span>
          </div>
        )}
      </div>

      <p className="hint">
        If you hit a wrong key it turns <b style={{ color: 'var(--error)' }}>red</b> and the cursor
        waits — you must type the correct letter to move on. <b>Backspace</b> clears a mistake.
      </p>

      <Keyboard nextChar={target[cursor]} />

      <div className="btn-row">
        <button className="btn btn--ghost" onClick={reset}>↻ New text</button>
        {started && <button className="btn btn--brand" onClick={finish}>Finish now</button>}
      </div>
    </div>
  );
}
