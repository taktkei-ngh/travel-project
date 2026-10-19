// MailingCard.jsx
import { useState } from 'react';

const MailingCard = () => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles([...files, ...event.target.files]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ to, cc, bcc, subject, content, files });
    alert("Email đã được gửi!");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Gửi email</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">To</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded"
            placeholder="Nhập email người nhận..."
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">CC</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            placeholder="Nhập email(cc) ngăn cách nhau bởi dấu ','"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">BCC</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            placeholder="Nhập email(bcc) ngăn cách nhau bởi dấu ','"
            value={bcc}
            onChange={(e) => setBcc(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Tiêu đề</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            placeholder="Nhập tiêu đề..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Nội dung</label>
          <textarea
            className="w-full px-3 py-2 border rounded"
            placeholder="Nhập nội dung..."
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block font-medium">File đính kèm</label>
          <input
            type="file"
            className="w-full px-3 py-2 border rounded"
            multiple
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Gửi
        </button>
      </form>
    </div>
  );
};

export default MailingCard;
