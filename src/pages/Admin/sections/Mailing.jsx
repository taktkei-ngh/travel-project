// Mailing.jsx
import MailingCard from './MailingCard';

const Mailing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold">Gửi Mail</h1>
      </header>
      <main className="flex flex-col items-center mt-6 px-4">
        <MailingCard />
      </main>
    </div>
  );
};

export default Mailing;
