// Tiện ích: SVG -> PNG trong suốt bằng resvg (không cần trình duyệt).
import { Resvg } from '@resvg/resvg-js';

export function svgToPng(svg, { width, background } = {}) {
  const r = new Resvg(svg, {
    ...(width ? { fitTo: { mode: 'width', value: width } } : {}),
    ...(background ? { background } : {}),
    font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' },
  });
  return r.render().asPng();
}
