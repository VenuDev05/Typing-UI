// Draws a completion certificate onto a canvas and triggers a PNG download.
// Pure canvas so there are no extra dependencies.

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * @param {object} data { username, wpm, accuracy, level, code, issuedAt }
 * @returns {HTMLCanvasElement}
 */
export function renderCertificate(data) {
  const W = 1200;
  const H = 850;
  const scale = window.devicePixelRatio || 2;

  const canvas = document.createElement('canvas');
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = '#0e1024';
  ctx.fillRect(0, 0, W, H);

  // Soft radial glow
  const glow = ctx.createRadialGradient(W / 2, 300, 40, W / 2, 300, 700);
  glow.addColorStop(0, 'rgba(109,74,255,0.28)');
  glow.addColorStop(1, 'rgba(14,16,36,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Inner card
  ctx.fillStyle = '#14162e';
  roundRect(ctx, 48, 48, W - 96, H - 96, 24);
  ctx.fill();

  // Gold border
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#f2b34a';
  roundRect(ctx, 64, 64, W - 128, H - 128, 18);
  ctx.stroke();

  ctx.textAlign = 'center';

  // Brand mark
  ctx.fillStyle = '#a99bff';
  ctx.font = '600 24px "JetBrains Mono", monospace';
  ctx.fillText('⌨  TYPING  TRAINER', W / 2, 150);

  // Title
  ctx.fillStyle = '#f2b34a';
  ctx.font = '700 26px "Space Grotesk", sans-serif';
  ctx.fillText('CERTIFICATE OF ACHIEVEMENT', W / 2, 210);

  // "This certifies that"
  ctx.fillStyle = '#8b8fb0';
  ctx.font = '400 20px "Space Grotesk", sans-serif';
  ctx.fillText('This certifies that', W / 2, 280);

  // Name
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 60px "Space Grotesk", sans-serif';
  ctx.fillText(data.username || 'Anonymous', W / 2, 350);

  // Underline under name
  ctx.strokeStyle = 'rgba(242,179,74,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 220, 372);
  ctx.lineTo(W / 2 + 220, 372);
  ctx.stroke();

  // Level line
  ctx.fillStyle = '#8b8fb0';
  ctx.font = '400 20px "Space Grotesk", sans-serif';
  ctx.fillText('has completed a typing assessment and earned the rank of', W / 2, 428);

  ctx.fillStyle = '#6d4aff';
  ctx.font = '700 34px "Space Grotesk", sans-serif';
  ctx.fillText((data.level || 'Typist').toUpperCase(), W / 2, 474);

  // Stat blocks
  const stats = [
    { label: 'WORDS / MIN', value: String(data.wpm) },
    { label: 'ACCURACY', value: `${data.accuracy}%` },
    { label: 'RANK', value: (data.level || '').split(' ')[0] },
  ];
  const blockW = 240;
  const gap = 40;
  const totalW = blockW * stats.length + gap * (stats.length - 1);
  let bx = (W - totalW) / 2;
  const by = 530;
  stats.forEach((s) => {
    ctx.fillStyle = 'rgba(109,74,255,0.10)';
    roundRect(ctx, bx, by, blockW, 120, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(169,155,255,0.25)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, bx, by, blockW, 120, 14);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 44px "JetBrains Mono", monospace';
    ctx.fillText(s.value, bx + blockW / 2, by + 62);

    ctx.fillStyle = '#8b8fb0';
    ctx.font = '600 15px "Space Grotesk", sans-serif';
    ctx.fillText(s.label, bx + blockW / 2, by + 96);

    bx += blockW + gap;
  });

  // Footer: date + verification code
  const date = new Date(data.issuedAt || Date.now()).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  ctx.fillStyle = '#8b8fb0';
  ctx.font = '400 18px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Issued  ${date}`, 110, 740);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#f2b34a';
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.fillText(data.code ? `Verify: ${data.code}` : 'Local certificate', W - 110, 740);

  return canvas;
}

export function downloadCertificate(data) {
  const canvas = renderCertificate(data);
  const link = document.createElement('a');
  const safeName = (data.username || 'certificate').replace(/[^\w-]+/g, '_');
  link.download = `typing-certificate-${safeName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
