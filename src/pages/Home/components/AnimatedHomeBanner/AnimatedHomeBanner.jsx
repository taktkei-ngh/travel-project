
import BlurText from '~/component/Animation/AnimatedUI/BlurText';
import { Link } from 'react-router-dom';

export const AnimatedHomeBanner = () => {
    return (
        <div
            className="relative flex min-h-[500px] flex-col items-center justify-center bg-cover bg-center px-4 text-center text-white"
            style={{
                backgroundImage: "url('/img/banner/3.jpg')",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Banner Content */}
            <div className="relative z-10 flex flex-col items-center">
                <BlurText
                    text="ROAM"
                    animateBy="words"
                    direction="top"
                    delay={150}
                    className="mb-4 text-5xl font-extrabold uppercase tracking-widest md:text-7xl"
                />

                <BlurText
                    text="DISCOVER YOUR NEXT JOURNEY"
                    animateBy="words"
                    direction="top"
                    delay={180}
                    className="mb-6 text-xl font-semibold uppercase tracking-wide md:text-3xl"
                />

                <BlurText
                    text="Explore extraordinary destinations and create memories that last a lifetime."
                    animateBy="words"
                    direction="top"
                    delay={200}
                    className="max-w-2xl text-base leading-relaxed md:text-lg"
                />

                {/* Explore Tours Button */}
                <Link
                    to="/tour-trong-nuoc"
                    className="relative z-20 mt-8 inline-flex cursor-pointer items-center justify-center rounded-full bg-amber-500 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-amber-600"
                >
                    Explore Tours
                </Link>
            </div>
        </div>
    );
};
