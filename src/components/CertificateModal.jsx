import { useEffect, useState } from 'react';
import { renderCertificate, downloadCertificate } from '../utils/certificate.js';
import { issueCertificate } from '../api/client.js';
import { levelFor } from '../utils/stats.js';

export default function CertificateModal({ result, username, onClose }) {
  const [cert, setCert] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const saved = await issueCertificate({
          wpm: result.wpm, accuracy: result.accuracy, durationSec: result.durationSec,
        });
        const data = {
          username,
          wpm: result.wpm,
          accuracy: result.accuracy,
          level: saved.level || levelFor(result.wpm, result.accuracy),
          code: saved.code,
          issuedAt: saved.issuedAt || saved.createdAt,
        };
        if (!alive) return;
        setCert(data);
        setPreview(renderCertificate(data).toDataURL('image/png'));
      } catch (e) {
        if (alive) setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [result, username]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Your certificate</h3>
        <p>
          {error ? error
            : loading ? 'Generating your certificate…'
            : `Verification code ${cert.code}. Download it as a PNG to keep or share.`}
        </p>

        <div className="cert-preview">
          {preview ? <img src={preview} alt="Typing certificate preview" /> : <div className="empty">Rendering…</div>}
        </div>

        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onClose}>Close</button>
          <button className="btn btn--gold" disabled={loading || !!error} onClick={() => downloadCertificate(cert)}>
            ⬇ Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
