import { motion } from "framer-motion";
import { useState } from "react";

export interface CardItem {
  title: string;
  subtitle?: string;
  color: string;
  image: string;
  background?: "checkerboard";
}

const defaultCards: CardItem[] = [
  {
    title: "Original",
    subtitle: "Enhance image quality with AI",
    color: "from-violet-500 via-fuchsia-500 to-purple-700",
    image: "/cards_imgs/spiderman.jpeg",
  },
  {
    title: "Model: ClearReality V1",
    subtitle: "High-speed clean upscaling",
    color: "from-cyan-500 via-sky-500 to-blue-700",
    image: "/cards_imgs/spiderman_1model.png",
  },
  {
    title: "Model: ESRGAN",
    subtitle: "Create stunning AI artwork",
    color: "from-orange-400 via-pink-500 to-red-600",
    image: "/cards_imgs/spiderman1_2model.png",
  },
];

interface CardsTestProps {
  cards?: CardItem[];
}

export default function CardsTest({ cards = defaultCards }: CardsTestProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const cardCount = cards.length;
  const spacing = cardCount <= 2 ? 260 : 230;
  const containerWidth = (cardCount - 1) * spacing + 380;

  return (
    <div className="relative w-full h-[560px] sm:h-[620px] flex items-center justify-center overflow-visible">
      <div
        style={{ width: `${containerWidth}px` }}
        className="relative h-[700px] scale-[0.62] sm:scale-[0.72] md:scale-[0.78] lg:scale-[0.68] xl:scale-[0.8] origin-center transition-transform"
      >
        {cards.map((card, index) => {
          const left = index * spacing;

          let x = left;
          let y = 0;
          let scale = 0.96;
          let blur = 4;
          let rotate = cardCount === 1 ? 0 : (index - (cardCount - 1) / 2) * 8;

          if (hovered !== null) {
            if (hovered === index) {
              y = -100;
              scale = 1.08;
              blur = 0;
              rotate = 0;
            } else if (index < hovered) {
              x = left - 35;
              blur = 4;
            } else {
              x = left + 35;
              blur = 4;
            }
          }

          const isCheckerboard =
          card.background === "checkerboard";

          return (
            <motion.div
              key={index}
              onHoverStart={() => setHovered(index)}
              onHoverEnd={() => setHovered(null)}
              animate={{
                x,
                y,
                scale,
                rotate,
                filter: `blur(${blur}px)`,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
              style={{
                zIndex: hovered === index ? 50 : index,
              }}
              className={`absolute top-8
                h-[620px]
                w-[380px]
                rounded-[34px]
                overflow-hidden
                cursor-pointer
                ${
                isCheckerboard
                  ? "bg-white"
                  : `bg-gradient-to-br ${card.color}`
              }
                `}
            >


              {/* ==========================================
                CHECKERBOARD BACKGROUND
                Only shown when background="checkerboard"
            =========================================== */}

            {isCheckerboard && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: "#ffffff",
                  backgroundImage: `
                    linear-gradient(
                      45deg,
                      #e5e7eb 25%,
                      transparent 25%
                    ),
                    linear-gradient(
                      -45deg,
                      #e5e7eb 25%,
                      transparent 25%
                    ),
                    linear-gradient(
                      45deg,
                      transparent 75%,
                      #e5e7eb 75%
                    ),
                    linear-gradient(
                      -45deg,
                      transparent 75%,
                      #e5e7eb 75%
                    )
                  `,
                  backgroundSize: "32px 32px",
                  backgroundPosition: `
                    0 0,
                    0 16px,
                    16px -16px,
                    -16px 0px
                  `,
                }}
              />
            )}
            
              {/* Card Image */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Gradient Overlay for Title Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

              {/* Title Content Only */}
              <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white">
                <h1 className="text-3xl font-black leading-tight drop-shadow-md">
                  {card.title}
                </h1>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}