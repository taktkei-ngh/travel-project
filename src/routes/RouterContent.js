import config from '~/config';
import Home from '~/pages/Home';
import Contacts from '~/pages/Contacts/Contacts';
import About from '~/pages/Introduce/About';
import { TourLists } from '~/pages/TourLists/TourLists';
import { Login } from '~/pages/Account/Login';
import { Register } from '~/pages/Account/Register';
import { TourDetail } from '~/pages/TourLists/TourDetail/TourDetail';
import { ProfileUI } from '~/pages/Account/ProfileUI/ProfileUI';
import { Booking } from '~/pages/Booking/Booking';
import HistoryPayment from '~/pages/Account/HistoryPayment/HistoryPayment';
import { Success } from '~/pages/Booking/status/Success';
import { ForgetPassword } from '~/pages/Account/ForgetPassword';
import { ChangePassword } from '~/pages/Account/ChangePassword';
import { BookedTour } from '~/pages/Account/historyBooked/BookedTour';
import { AdminLayout } from '~/component/Layout/Admin/AdminLayout';
import AdminHome from '~/pages/Admin/AdminHome';
import { News } from '~/pages/News/News';
import { Error } from '~/pages/Booking/status/Error';
import { OAuth2Redirect } from '~/pages/Account/components/OAuth2Redirect';
import { Terms } from '~/pages/Terms/Terms';
import { DetailNews } from '~/pages/News/DetailNews/DetailNews';
import { BookingRedirect } from '~/pages/Account/components/BookingRedirect';
import { OAuth2Login } from '~/pages/Account/components/OAuth2Login';

export const RouterContent = [
	{
		path: config.routes.home,
		element: <Home />,
	},
	{
		path: config.routes.tourTrongNuoc,
		element: <TourLists titleType={'INSIDE'} />,
	},
	{
		path: config.routes.login,
		element: <Login />,
	},
	{
		path: config.routes.oauth2 + ':provider',
		element: <OAuth2Login />,
	},
	{
		path: config.routes.oauth2Redirect,
		element: <OAuth2Redirect />,
	},
	{
		path: config.routes.register,
		element: <Register />,
	},
	{
		path: config.routes.tourDetail + ':id',
		element: <TourDetail />,
	},
	{
		path: config.routes.tourNgoaiNuoc,
		element: <TourLists titleType={'OUTSIDE'} />,
	},
	{
		path: config.routes.contacts,
		element: <Contacts />,
	},
	{
		path: config.routes.about,
		element: <About />,
	},
	{
		path: config.routes.profile,
		element: <ProfileUI />,
	},
	{
		path: config.routes.booking + ':id',
		element: <Booking />,
	},
	{
		path: config.routes.terms,
		element: <Terms />,
	},
	{
		path: config.routes.historyBooked,
		element: <BookedTour />,
	},
	{
		path: config.routes.historyPayment,
		element: <HistoryPayment />,
	},
	{
		path: config.routes.forgotPassword,
		element: <ForgetPassword />,
	},
	{
		path: config.routes.changePassword,
		element: <ChangePassword />,
	},
	{
		path: config.routes.checkOutSuccess,
		element: <Success />,
	},
	{
		path: config.routes.checkoutFail,
		element: <Error />,
	},
	{
		path: config.routes.news + '*',
		element: <DetailNews />,
	},
	{
		path: config.routes.adminHome,
		element: (
			<AdminLayout>
				<AdminHome />
			</AdminLayout>
		),
	},
	{
		path: config.routes.news,
		element: <News />,
	},
	{
		path: config.routes.redirectBooking + ':id',
		element: <BookingRedirect />,
	},
];
