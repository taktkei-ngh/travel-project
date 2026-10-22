
import React from 'react';
import AnimatedContent from '~/component/Animation/AnimatedUI/AnimatedContent';

const TravelCard = ({ imageSrc, altText, title, description, index }) => {
    return (
        <article className="group relative isolate min-w-0 overflow-hidden rounded-2xl border border-white/70 bg-gray-900 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            <div className="relative h-72 overflow-hidden sm:h-80 lg:h-[340px]">
                <img
                    src={imageSrc}
                    alt={altText || title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-900/25 to-gray-900/10 transition-opacity duration-500 group-hover:from-gray-950/90" />

                <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                    <span className="rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                        ROAM · EXPLORE
                    </span>
                    <span className="text-sm font-semibold text-white/85">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <span className="mb-3 block h-1 w-9 rounded-full bg-orange-400 transition-all duration-300 group-hover:w-16" />

                    <h3 className="text-xl font-extrabold leading-snug tracking-tight text-white sm:text-2xl">
                        {title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/75 transition-colors duration-300 group-hover:text-white/95">
                        {description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-orange-300">
                        <span>Discover more</span>
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                            →
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
};

const TravelCards = ({ cards = [] }) => {
    return (
        <AnimatedContent
            distance={100}
            direction="horizontal"
            reverse={false}
            config={{ tension: 120, friction: 18 }}
            initialOpacity={0}
            animateOpacity
            scale={1}
            threshold={0.1}
        >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                {cards.map((card, index) => (
                    <TravelCard
                        key={card.id ?? card.imageSrc ?? index}
                        imageSrc={card.imageSrc}
                        altText={card.altText}
                        title={card.title}
                        description={card.description}
                        index={index}
                    />
                ))}
            </div>
        </AnimatedContent>
    );
};

export default TravelCards;
