
import { useEffect, useState } from 'react';
import {
    Button,
    DatePicker,
    Drawer,
    Input,
    InputNumber,
    message,
    Radio,
} from 'antd';
import { FaBars, FaSearch, FaTrashAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import CategoryServices from '~/services/CategoryServices';

const { RangePicker } = DatePicker;
const ALL_OPTION = '__ALL__';

const SearchBar = ({ onSearch }) => {
    const { t } = useTranslation();

    const allCategoryTitle = t('searchBar.ti1');

    const [visible, setVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchSides, setSearchSides] = useState(ALL_OPTION);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [minPrice, setMinPrice] = useState(null);
    const [region, setRegion] = useState('ALL');

    const [sides, setSides] = useState(() => [
        {
            value: ALL_OPTION,
            label: allCategoryTitle,
        },
    ]);

    // Load categories without depending directly on the t function.
    useEffect(() => {
        let isMounted = true;

        const loadCategories = async () => {
            try {
                const res = await CategoryServices.getCategories();

                if (!isMounted) return;

                // Support both a direct array and an API response
                // shaped like { success: true, data: [...], total: n }.
                let items = [];

                if (Array.isArray(res)) {
                    items = res;
                } else if (Array.isArray(res?.data)) {
                    items = res.data;
                } else if (Array.isArray(res?.data?.data)) {
                    items = res.data.data;
                }

                const categoryOptions = items
                    .filter((item) => item && (item.id != null || item._id != null))
                    .map((item) => ({
                        value: String(item.id ?? item._id),
                        label: String(item.title ?? item.name ?? '').trim(),
                    }))
                    .filter((item) => item.label.length > 0);

                setSides([
                    {
                        value: ALL_OPTION,
                        label: allCategoryTitle,
                    },
                    ...categoryOptions,
                ]);
            } catch (error) {
                if (!isMounted) return;

                console.error('Không thể tải danh mục:', error);

                setSides([
                    {
                        value: ALL_OPTION,
                        label: allCategoryTitle,
                    },
                ]);
            }
        };

        loadCategories();

        return () => {
            isMounted = false;
        };
    }, [allCategoryTitle]);

    const handleRefresh = () => {
        setSearchText('');
        setSearchSides(ALL_OPTION);
        setDateRange(null);
        setStartDate(null);
        setEndDate(null);
        setMaxPrice(null);
        setMinPrice(null);
        setRegion('ALL');
        setVisible(false);

        onSearch?.({
            searchText: '',
            searchSides: null,
            maxPrice: null,
            minPrice: null,
            startDate: null,
            endDate: null,
            region: null,
        });

        message.success('Đã xóa các bộ lọc', 1);
    };

    const handleSearch = () => {
        onSearch?.({
            searchText,
            searchSides: searchSides === ALL_OPTION ? null : searchSides,
            maxPrice,
            minPrice,
            startDate,
            endDate,
            region: region === 'ALL' ? null : region,
        });

        setVisible(false);
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);

        if (dates?.[0] && dates?.[1]) {
            setStartDate(dates[0].format('YYYY-MM-DD'));
            setEndDate(dates[1].format('YYYY-MM-DD'));
        } else {
            setStartDate(null);
            setEndDate(null);
        }
    };

    const priceFormatter = (value) =>
        value == null
            ? ''
            : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const categorySelect = (
    <select
        value={searchSides}
        onChange={(event) => setSearchSides(event.target.value)}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-base text-gray-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        aria-label={allCategoryTitle}
    >
        {sides.map((side) => (
            <option key={side.value} value={side.value}>
                {side.label}
            </option>
        ))}
    </select>
);

    const regionSelector = (
        <Radio.Group
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="flex flex-wrap gap-x-4 gap-y-2"
        >
            <Radio value="ALL">Tất cả</Radio>
            <Radio value="INSIDE">Trong nước</Radio>
            <Radio value="OUTSIDE">Ngoài nước</Radio>
        </Radio.Group>
    );

    const dateField = (
        <RangePicker
            value={dateRange}
            size="large"
            format="DD/MM/YYYY"
            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
            onChange={handleDateChange}
            className="w-full"
        />
    );

    const renderPriceFields = () => (
        <>
            <InputNumber
                value={minPrice}
                min={0}
                step={100000}
                formatter={priceFormatter}
                suffix="VND"
                placeholder={t('searchBar.ti3')}
                onChange={setMinPrice}
                className="w-full"
                size="large"
                aria-label={t('searchBar.ti3')}
            />

            <InputNumber
                value={maxPrice}
                min={0}
                step={100000}
                formatter={priceFormatter}
                suffix="VND"
                placeholder={t('searchBar.ti4')}
                onChange={setMaxPrice}
                className="w-full"
                size="large"
                aria-label={t('searchBar.ti4')}
            />
        </>
    );

    const actionButtons = (mobile = false) => (
        <div className={`flex gap-3 ${mobile ? 'flex-col' : 'flex-wrap'}`}>
            <Button
                type="primary"
                icon={<FaSearch />}
                size="large"
                onClick={handleSearch}
                className="!h-11 !rounded-xl !border-0 !bg-gray-950 !px-5 !font-semibold hover:!bg-orange-500"
                block={mobile}
            >
                {t('searchBar.ti5')}
            </Button>

            <Button
                icon={<FaTrashAlt />}
                size="large"
                onClick={handleRefresh}
                className="!h-11 !rounded-xl !border-gray-200 !px-5 !font-semibold !text-gray-600 hover:!border-red-300 hover:!text-red-500"
                block={mobile}
            >
                {mobile ? 'Xóa tất cả bộ lọc' : 'Xóa bộ lọc'}
            </Button>
        </div>
    );

    return (
        <>
            {/* Desktop search panel */}
            <section className="mx-auto hidden w-full max-w-6xl rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xl shadow-gray-900/5 md:block lg:p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                            ROAM · TÌM HÀNH TRÌNH
                        </p>

                        <h3 className="mt-1 text-lg font-extrabold text-gray-900">
                            {t('searchBar.ti2')}
                        </h3>
                    </div>

                    <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
                        Tùy chỉnh chuyến đi
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                    <div className="lg:col-span-6">
                        <label className="mb-2 block text-xs font-semibold text-gray-500">
                            Điểm đến hoặc tên tour
                        </label>

                        <Input
                            value={searchText}
                            placeholder={t('searchBar.ti2')}
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                            size="large"
                            className="w-full"
                        />
                    </div>

                    <div className="lg:col-span-6">
                        <label className="mb-2 block text-xs font-semibold text-gray-500">
                            Danh mục
                        </label>

                        {categorySelect}
                    </div>

                    <div className="lg:col-span-3">
                        <label className="mb-2 block text-xs font-semibold text-gray-500">
                            Giá tối thiểu
                        </label>

                        <InputNumber
                            value={minPrice}
                            min={0}
                            step={100000}
                            formatter={priceFormatter}
                            suffix="VND"
                            placeholder={t('searchBar.ti3')}
                            onChange={setMinPrice}
                            className="w-full"
                            size="large"
                        />
                    </div>

                    <div className="lg:col-span-3">
                        <label className="mb-2 block text-xs font-semibold text-gray-500">
                            Giá tối đa
                        </label>

                        <InputNumber
                            value={maxPrice}
                            min={0}
                            step={100000}
                            formatter={priceFormatter}
                            suffix="VND"
                            placeholder={t('searchBar.ti4')}
                            onChange={setMaxPrice}
                            className="w-full"
                            size="large"
                        />
                    </div>

                    <div className="lg:col-span-6">
                        <label className="mb-2 block text-xs font-semibold text-gray-500">
                            Khoảng thời gian
                        </label>

                        {dateField}
                    </div>

                    <div className="lg:col-span-12">
                        <label className="mb-3 block text-xs font-semibold text-gray-500">
                            Phạm vi tour
                        </label>

                        {regionSelector}
                    </div>

                    <div className="lg:col-span-12">
                        <div className="flex justify-end border-t border-gray-100 pt-4">
                            {actionButtons()}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile search drawer */}
            <div className="flex justify-end md:hidden">
                <Button
                    icon={<FaBars />}
                    size="large"
                    onClick={() => setVisible(true)}
                    className="!rounded-xl !border-gray-200 !bg-white !font-semibold !text-gray-900 shadow-sm"
                >
                    Bộ lọc tìm kiếm
                </Button>

                <Drawer
                    title={t('searchBar.ti8')}
                    placement="right"
                    closable
                    onClose={() => setVisible(false)}
                    open={visible}
                    width="min(92vw, 380px)"
                    styles={{
                        body: {
                            padding: 16,
                            backgroundColor: '#fafaf9',
                        },
                        header: {
                            backgroundColor: '#fff',
                            borderBottom: '1px solid #e5e7eb',
                        },
                    }}
                >
                    <div className="flex flex-col gap-5">
                        <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-500">
                                Điểm đến hoặc tên tour
                            </label>

                            <Input
                                value={searchText}
                                placeholder={t('searchBar.ti2')}
                                allowClear
                                onChange={(e) => setSearchText(e.target.value)}
                                size="large"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-500">
                                Danh mục
                            </label>

                            {categorySelect}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-500">
                                Giá tối thiểu
                            </label>

                            <InputNumber
                                value={minPrice}
                                min={0}
                                step={100000}
                                formatter={priceFormatter}
                                suffix="VND"
                                placeholder={t('searchBar.ti3')}
                                onChange={setMinPrice}
                                className="w-full"
                                size="large"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-500">
                                Giá tối đa
                            </label>

                            <InputNumber
                                value={maxPrice}
                                min={0}
                                step={100000}
                                formatter={priceFormatter}
                                suffix="VND"
                                placeholder={t('searchBar.ti4')}
                                onChange={setMaxPrice}
                                className="w-full"
                                size="large"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-500">
                                Khoảng thời gian
                            </label>

                            {dateField}
                        </div>

                        <div>
                            <label className="mb-3 block text-xs font-semibold text-gray-500">
                                Phạm vi tour
                            </label>

                            {regionSelector}
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            {actionButtons(true)}
                        </div>
                    </div>
                </Drawer>
            </div>
        </>
    );
};

export default SearchBar;
