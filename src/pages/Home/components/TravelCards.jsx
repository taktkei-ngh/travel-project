import AnimatedContent from '~/component/Animation/AnimatedUI/AnimatedContent';

const TravelCard = ({ imageSrc, altText, title, description }) => {
    return (
        <div className="relative rounded-xl overflow-hidden shadow-lg group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
            {/* Hình ảnh */}
            <img
                src={imageSrc}
                alt={altText}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Nội dung */}
            <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                <h3 className="text-xl font-bold tracking-tight">{title}</h3>
                <p className="text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    {description}
                </p>
            </div>
        </div>
    );
};

const TravelCards = ({ cards }) => {
    return (
        <AnimatedContent
            distance={200}
            direction="horizontal"
            reverse={false}
            config={{ tension: 120, friction: 14 }}
            initialOpacity={0}
            animateOpacity
            scale={1.05}
            threshold={0.1}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                {cards.map((card, index) => (
                    <TravelCard
                        key={index}
                        imageSrc={card.imageSrc}
                        altText={card.altText}
                        title={card.title}
                        description={card.description}
                    />
                ))}
            </div>
        </AnimatedContent>
    );
};

export default TravelCards;