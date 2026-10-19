import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

// Component tái sử dụng cho nút
const ActionButton = ({ onClick, text }) => (
	<motion.button
		whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)' }}
		whileTap={{ scale: 0.95 }}
		className="flex items-center mx-auto bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-full transition-all duration-300 mt-3"
		onClick={onClick}
	>
		<FaArrowLeft className="mr-2" />
		{text}
	</motion.button>
);

// Component chính
export function NotFound() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	// Animation variants để tái sử dụng
	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
	};

	const titleVariants = {
		hidden: { scale: 0.5, opacity: 0 },
		visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } },
	};

	return (
		<div
			className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-yellow-800 text-white overflow-hidden">
			{/* Hiệu ứng nền CSS đơn giản (thay cho particles) */}
			<div
				className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)] animate-pulse"></div>

			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="relative text-center p-8 z-10"
			>
				{/* Tiêu đề 404 */}
				<motion.h1
					variants={titleVariants}
					className="text-[10rem] md:text-[14rem] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500 drop-shadow-[0_4px_12px_rgba(255,196,0,0.8)] font-anton-variable"
				>
					404
				</motion.h1>

				{/* Thông báo lỗi */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.6 }}
					className="mt-2 text-lg md:text-xl text-gray-200 max-w-md mx-auto"
				>
					{t('notFound.ti1') || 'Oops! The page you’re looking for doesn’t exist.'}
				</motion.p>

				{/* Nút quay lại */}
				<ActionButton onClick={() => navigate(-1)} text={t('notFound.ti2') || 'Go Back'} />
			</motion.div>
		</div>
	);
}

export default NotFound;