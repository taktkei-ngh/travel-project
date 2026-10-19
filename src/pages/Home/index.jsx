import { useEffect } from 'react';
import { TravelCards } from '~/pages/Home/components/TravelCards';
import { TravelCardLists } from '~/pages/Home/sections/TravelCardLists';
import Vacations from '~/pages/Home/sections/Vacations';
import { AboutSection } from '~/pages/Home/sections/AboutSection';
import { TourLists } from '~/pages/Home/sections/TourLists';
import { AnimatedHomeBanner } from '~/pages/Home/components/AnimatedHomeBanner/AnimatedHomeBanner';
import FadeContent from '~/component/Animation/AnimatedUI/FadeContent';
import { ComboTour } from '~/pages/Home/sections/ComboTour';
import { useTranslation } from 'react-i18next';
import { AboutLogin } from '~/pages/Home/sections/AboutLogin';
import { useAuth } from '~/config/AuthContext';
import { VouchersPage } from '~/pages/Home/sections/VouchersPage';
import { BlogSection } from '~/pages/Home/sections/BlogSection';

function Home() {
    const { currentUser } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        document.title = 'Pacific - Hành trình khám phá mọi nơi.';
    }, []);

    return (
        <FadeContent
            blur={true}
            duration={1000}
            easing="ease-out"
            initialOpacity={0}
        >
            <AnimatedHomeBanner />
            <div className={'container mx-auto'}>
                <VouchersPage/>
                <TravelCardLists />
                <Vacations />
                <AboutSection />
                <TourLists />
                <ComboTour />
                <BlogSection />
                {currentUser ? null : <AboutLogin />}
            </div>
        </FadeContent>
    );
}

export default Home;