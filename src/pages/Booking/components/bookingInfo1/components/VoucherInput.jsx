import { useState } from 'react';

export const VoucherInput = ({ voucher, setVoucher, applyVoucher, voucherValid }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative w-full">
            <input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                onBlur={() => {
                    if (voucher) applyVoucher(voucher);
                    setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
                className={`w-full px-4 py-2 text-gray-700 bg-white border rounded-lg shadow-sm transition-all duration-300 
                   ${isFocused ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-blue-300'} 
                   focus:outline-none placeholder-gray-400`}
            />
            {/* Icon feedback với animation */}
            {voucher && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {voucherValid === true ? (
              <svg
                  className="h-5 w-5 text-green-500 animate-check"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
              >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
          ) : voucherValid === false ? (
              <svg
                  className="h-5 w-5 text-red-500 animate-x"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
              >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
          ) : null}
        </span>
            )}
        </div>
    );
};