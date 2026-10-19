import { Button, DatePicker, Divider, Drawer, Input, InputNumber, Radio, Rate, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { FaBars, FilterOutlined } from 'react-icons/fa';
import { CloseCircleOutlined } from '@ant-design/icons';
import CategoryServices from '~/services/CategoryServices';

export const SearchFilterBar = ({ onSearch, query: initialQuery = {} }) => {
    const { RangePicker } = DatePicker;
    const ratingAvg = [1, 2, 3, 4, 5];

    // Search states
    const [searchText, setSearchText] = useState(initialQuery.title || '');
    const [sides, setSides] = useState([]);
    const [searchSides, setSearchSides] = useState(initialQuery.categoryId || null);
    const [startDate, setStartDate] = useState(initialQuery.startDate || null);
    const [endDate, setEndDate] = useState(initialQuery.endDate || null);

    // Filter states
    const [rate, setRate] = useState(initialQuery.rate || null);
    const [searchPrices, setSearchPrices] = useState(initialQuery.searchPrices || 'All');
    const [minPrice, setMinPrice] = useState(initialQuery.minPrice || 0);
    const [maxPrice, setMaxPrice] = useState(initialQuery.maxPrice || 0);

    // Drawer state
    const [visible, setVisible] = useState(false);

    // Fetch categories
    useEffect(() => {
        CategoryServices.getCategories()
            .then((res) => {
                const formattedSides = [
                    { id: null, title: 'Tất cả vùng/miền' },
                    ...res.map((category) => ({
                        id: category.id,
                        title: category.title || category.name || 'Unknown',
                    })),
                ];
                setSides(formattedSides);
            })
            .catch((err) => {
                setSides([{ id: null, title: 'Tất cả vùng/miền' }]);
            });
    }, []);

    // Handle search and filter submission
    const handleSearch = () => {
        const query = {
            title: searchText || null,
            categoryId: searchSides !== null ? searchSides : null,
            startDate: startDate || null,
            endDate: endDate || null,
            rate: rate || null,
            searchPrices: searchPrices || 'All',
            minPrice: minPrice || null,
            maxPrice: maxPrice || null,
        };
        onSearch(query);
        setVisible(false);
    };

    // Handle reset
    const handleClear = () => {
        setSearchText('');
        setSearchSides(null);
        setStartDate(null);
        setEndDate(null);
        setRate(null);
        setSearchPrices('All');
        setMinPrice(0);
        setMaxPrice(0);
        onSearch({
            title: null,
            categoryId: null,
            startDate: null,
            endDate: null,
            rate: null,
            searchPrices: 'All',
            minPrice: null,
            maxPrice: null,
        });
        message.success('Đã làm mới tìm kiếm');
        setVisible(false);
    };

    // Common filter content for sidebar and drawer
    const filterContent = (
        <div className="flex flex-col gap-4">
            <Divider>Lọc nâng cao</Divider>
            <Select
                className="w-full"
                placeholder="Sắp xếp theo giá"
                onChange={(value) => setSearchPrices(value)}
                value={searchPrices}
                options={[
                    { label: 'Tất cả', value: 'All' },
                    { label: 'Cao tới thấp', value: 'HighToLow' },
                    { label: 'Thấp tới cao', value: 'LowToHigh' },
                ]}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputNumber
                    className="w-full"
                    placeholder="Giá thấp nhất"
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    suffix="VND"
                    value={minPrice}
                    onChange={(value) => setMinPrice(value)}
                />
                <InputNumber
                    className="w-full"
                    placeholder="Giá cao nhất"
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    suffix="VND"
                    value={maxPrice}
                    onChange={(value) => setMaxPrice(value)}
                />
            </div>

            <Divider>Rating</Divider>
            <Radio.Group
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="flex flex-col gap-2"
            >
                {ratingAvg.map((item) => (
                    <Radio key={item} value={item}>
                        <Rate value={item} disabled />
                    </Radio>
                ))}
            </Radio.Group>
            <Divider />
            <button
                onClick={handleClear}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2"
            >
                <CloseCircleOutlined className="text-lg text-red-500" />
                Xóa bộ lọc
            </button>
        </div>
    );

    return (
        <div className="w-full">
            {/* Mobile Layout */}
            <div className="md:hidden block p-4">
                <Button
                    type="text"
                    onClick={() => setVisible(!visible)}
                    icon={<FaBars />}
                    className="text-2xl text-orange-400 hover:text-orange-600"
                />
                <Drawer
                    open={visible}
                    onClose={() => setVisible(false)}
                    title="Lọc và tìm kiếm"
                    placement="bottom"
                    width={300}
                    closable={true}
                    destroyOnClose={true}
                    className="p-4"
                >
                    <div className="flex flex-col gap-6">
                        {/* Search Inputs */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-semibold">Tìm kiếm</h3>
                            <Input
                                placeholder="Tìm kiếm tour"
                                allowClear
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full font-bold rounded-lg"
                                size="large"
                            />
                            <Select
                                showSearch
                                options={sides}
                                size="large"
                                value={searchSides}
                                fieldNames={{ value: 'id', label: 'title' }}
                                onChange={(value) => setSearchSides(value)}
                                optionLabelProp="title"
                                className="w-full font-bold"
                                placeholder="Tất cả vùng/miền"
                            />
                            <RangePicker
                                size="large"
                                format="DD/MM/YYYY"
                                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                onChange={(dates) => {
                                    if (dates) {
                                        setStartDate(dates[0].format('YYYY-MM-DD'));
                                        setEndDate(dates[1].format('YYYY-MM-DD'));
                                    } else {
                                        setStartDate(null);
                                        setEndDate(null);
                                    }
                                }}
                                className="w-full font-bold"
                            />
                        </div>

                        {/* Filter Inputs */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-semibold">Filters</h3>
                            {filterContent}
                        </div>

                        {/* Drawer Buttons */}
                        <div className="flex flex-col gap-4">
                            <button
                                className="bg-orange-500 text-white px-6 py-3 rounded-md w-full"
                                onClick={handleSearch}
                            >
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                </Drawer>
            </div>
        </div>
    );
};