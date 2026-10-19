import { Divider, InputNumber, Radio, message, Rate, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseCircleOutlined } from '@ant-design/icons';

export const Aside = ({ query, setQuery, titleType }) => {
    const { t } = useTranslation();
    const ratingAvg = [1, 2, 3, 4, 5];
    const [rate, setRate] = useState(query.rate || null);
    const [searchPrices, setSearchPrices] = useState(query.searchPrices || 'All');
    const [maxPrice, setMaxPrice] = useState(query.maxPrice || null);
    const [minPrice, setMinPrice] = useState(query.minPrice || null);

    useEffect(() => {
        setQuery((prevQuery) => ({
            ...prevQuery,
            rate,
            minPrice,
            maxPrice,
            searchPrices,
            region: titleType,
        }));
    }, [rate, searchPrices, minPrice, maxPrice, setQuery, titleType]);

    const handleClear = () => {
        setRate(null);
        setSearchPrices('All');
        setMinPrice(null);
        setMaxPrice(null);
        setQuery((prevQuery) => ({
            ...prevQuery,
            rate: null,
            minPrice: null,
            maxPrice: null,
            searchPrices: 'All',
            region: titleType,
        }));
    };

    return (
        <aside
            className="hidden w-3/12 md:block lg:block sticky top-4 h-fit border p-4 bg-gray-50 shadow-md rounded-md self-start">
            <Divider>{t('search.ti5')}</Divider>
            <Select
                className="w-full"
                placeholder={t('search.ti5')}
                optionFilterProp={'children'}
                onChange={(value) => setSearchPrices(value)}
                value={searchPrices}
                options={[
                    { label: t('search.ti6'), value: 'All' },
                    { label: t('search.ti7'), value: 'HighToLow' },
                    { label: t('search.ti8'), value: 'LowToHigh' },
                ]}
            />
            <div className="grid grid-cols-2 items-center gap-2">
                <InputNumber
                    className="w-full mt-4"
                    placeholder="Giá thấp nhất"
                    min={0}
                    step={100000}
                    formatter={(e) => `${e}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    suffix="VND"
                    value={minPrice}
                    onChange={(value) => {
                        if (maxPrice && value > maxPrice) {
                            message.error('Giá thấp nhất không thể lớn hơn giá cao nhất');
                            return;
                        }
                        setMinPrice(value);
                    }}
                />
                <InputNumber
                    className="w-full mt-4"
                    placeholder="Giá cao nhất"
                    min={0}
                    step={100000}
                    formatter={(e) => `${e}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    suffix="VND"
                    value={maxPrice}
                    onChange={(value) => {
                        if (minPrice && value < minPrice) {
                            message.error('Giá cao nhất không thể nhỏ hơn giá thấp nhất');
                            return;
                        }
                        setMaxPrice(value);
                    }}
                />
            </div>

            <Divider>{t('search.ti9')}</Divider>
            <Radio.Group
                value={rate}
                onChange={(e) => setRate(e.target.value)}
            >
                {ratingAvg.map((item, index) => (
                    <Radio key={index} value={item}>
                        <Rate value={item} disabled />
                    </Radio>
                ))}
            </Radio.Group>
            <Divider />
            <button
                onClick={handleClear}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 flex items-center justify-center gap-2"
            >
                <CloseCircleOutlined className="text-lg text-red-500" />
                Bỏ chọn
            </button>
        </aside>
    );
};