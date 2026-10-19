// MailCard.jsx
import { useState } from 'react';

const MailCard = () => {
  const [showExtraFiles, setShowExtraFiles] = useState(false);

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-blue-600 text-2xl font-semibold mb-4">Gửi email</h2>
      <form action="/mailer/send" method="post" encType="multipart/form-data">
        <div className="mb-3">
          <label className="block text-gray-700">To</label>
          <input type="text" name="txtTo" placeholder="Nhập email người nhận..." className="w-full p-2 border rounded" />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700">CC</label>
          <input type="text" name="txtCC" placeholder="Nhập email(cc) ngăn cách nhau bởi dấu ','" className="w-full p-2 border rounded" />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700">BCC</label>
          <input type="text" name="txtBCC" placeholder="Nhập email(bcc) ngăn cách nhau bởi dấu ','" className="w-full p-2 border rounded" />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700">Tiêu đề</label>
          <input type="text" name="txtSubject" placeholder="Nhập tiêu đề..." className="w-full p-2 border rounded" />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700">Nội dung</label>
          <textarea name="txtContent" rows="4" placeholder="Nhập nội dung..." className="w-full p-2 border rounded"></textarea>
        </div>
        <div className="mb-3">
          <label className="block text-gray-700">File đính kèm</label>
          <input type="file" name="file" className="w-full p-2 border rounded" />
        </div>
        {showExtraFiles && (
          <>
            <div className="mb-3">
              <label className="block text-gray-700">File đính kèm</label>
              <input type="file" name="file1" className="w-full p-2 border rounded" />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700">File đính kèm</label>
              <input type="file" name="file2" className="w-full p-2 border rounded" />
            </div>
          </>
        )}
        <button type="button" onClick={() => setShowExtraFiles(true)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Thêm tệp</button>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded ml-4">Gửi</button>
      </form>
    </div>
  );
};

export default MailCard;
