
import { useTranslation } from '@/locales';

export default function Bgmarquee(){
  const { t } = useTranslation();
  const fallback = [
    'Chopper segmentation', 'WebGPU on-device', 'Zero uploads',
    'Hair-level edges', 'Transparent PNG', 'No sign-up', 'Unlimited runs',
  ];
  const items = t.bgMarquee || fallback;

  return (
      <div className="bgr-marquee" style={{ '--rv-i': '0.2s' } as React.CSSProperties} aria-hidden="true">
        <div className="bgr-marquee-track">
          {[...items, ...items].map((m, i) => (
            <span key={i}><i>✦</i> {m}</span>
          ))}
        </div>
      </div>
  )
}