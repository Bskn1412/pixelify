'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const ROW_ONE = [
  { src: '/home/shots/students1.webp', label: 'students' },
  { src: '/home/shots/students3.webp', label: 'students' },
  { src: '/home/shots/designers.webp', label: 'designers' },
  { src: '/home/shots/photographers.webp', label: 'photographers' },
  { src: '/home/shots/business_owners.webp', label: 'business_owners' },
  { src: '/home/shots/content_creators.webp', label: 'content_creators' },
  { src: '/home/shots/digital_artists.webp', label: 'digital_artists' },
];

const ROW_TWO = [
  { src: '/home/shots/jewellery.webp', label: 'Jewellery' },
  { src: '/home/shots/products.webp', label: 'Products' },
  { src: '/home/shots/digital_artists3.webp', label: 'business_owners' },
  { src: '/home/shots/digital_artists2.webp', label: 'photographers' },
  { src: '/home/shots/automotive.webp', label: 'Automotive' },
  { src: '/home/shots/food.webp', label: 'Food' },
  { src: '/home/shots/wedding.webp', label: 'Wedding' }, 
];

/** Scroll-driven filmstrip of real Pixelify results, echoing Framer's image wheel. */
export function ImageWheel() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const xOne = useTransform(scrollYProgress, [0, 1], ['2%', '-12%']);
  const xTwo = useTransform(scrollYProgress, [0, 1], ['-12%', '2%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [-1.4, 1.4]);

  return (
    <div className="fh-wheel" ref={ref}>
      <motion.div
        className="fh-wheel-row"
        style={reduce ? undefined : { x: xOne, rotate }}
      >
        {[...ROW_ONE, ...ROW_ONE].map((card, index) => (
          <div
            className="fh-wheel-card"
            key={`one-${index}`}
            aria-hidden={index >= ROW_ONE.length}
          >
            <img src={card.src} alt={index < ROW_ONE.length ? card.label : ''} loading="lazy" />
          </div>
        ))}
      </motion.div>

      <motion.div
        className="fh-wheel-row"
        style={reduce ? undefined : { x: xTwo, rotate }}
      >
        {[...ROW_TWO, ...ROW_TWO].map((card, index) => (
          <div
            className="fh-wheel-card"
            key={`two-${index}`}
            aria-hidden={index >= ROW_TWO.length}
          >
            <img src={card.src} alt={index < ROW_TWO.length ? card.label : ''} loading="lazy" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
