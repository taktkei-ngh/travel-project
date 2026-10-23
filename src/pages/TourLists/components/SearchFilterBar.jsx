import {
    Button,
    DatePicker,
    Divider,
    Drawer,
    Input,
    InputNumber,
    Radio,
    Rate,
    message,
} from 'antd';
import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import {
    CloseCircleOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import CategoryServices from '~/services/CategoryServices';

const { RangePicker } = DatePicker;

const ALL_OPTION = '';
const RATING_OPTIONS = [5, 4, 3, 2, 1];

const formatPrice = (value) => {
    if (value == null || value === '') return '';
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parsePrice = (value) =>
    value ? value.replace(/[^\d]/g, '') : '';

const PriceField = ({ label, value, onChange }) => (
    <div className="min-w-0">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
            {label}
        </label>

        <InputNumber
            className="w-full"
            style={{ width: '100%', borderRadius: 10 }}
            placeholder="Không giới hạn"
            min={0}
            step={100000}
            formatter={formatPrice}
            parser={parsePrice}
            value={value}
            onChange={onChange}
            aria-label={label}
        />
    </div>
);

export const SearchFilterBar = ({
    onSearch,
    query: initialQuery = {},
}) => {
    const [searchText, setSearchText] = useState(
        initialQuery.title ?? ''
    );

    const [sides, setSides] = useState([
        { id: null, title: 'Tất cả vùng/miền' },
    ]);

    const [searchSides, setSearchSides] = useState(
        initialQuery.categoryId == null
            ? ALL_OPTION
            : String(initialQuery.categoryId)
    );

    const [startDate, setStartDate] = useState(
        initialQuery.startDate ?? null
    );

    const [endDate, setEndDate] = useState(
        initialQuery.endDate ?? null
    );

    const [dateRange, setDateRange] = useState(null);

    const [rate, setRate] = useState(initialQuery.rate ?? null);

    const [searchPrices, setSearchPrices] = useState(
        initialQuery.searchPrices ?? 'All'
    );

    const [minPrice, setMinPrice] = useState(
        initialQuery.minPrice ?? null
    );

    const [maxPrice, setMaxPrice] = useState(
        initialQuery.maxPrice ?? null
    );

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadCategories = async () => {
            try {
                const response = await CategoryServices.getCategories();

                if (!isMounted) return;

                let categories = [];

                if (Array.isArray(response)) {
                    categories = response;
                } else if (Array.isArray(response?.data)) {
                    categories = response.data;
                } else if (Array.isArray(response?.data?.data)) {
                    categories = response.data.data;
                }

                const formattedCategories = categories
                    .filter(
                        (category) =>
                            category &&
                            (category.id != null || category._id != null)
                    )
                    .map((category) => ({
                        id: String(category.id ?? category._id),
                        title: String(
                            category.title ?? category.name ?? ''
                        ).trim(),
                    }))
                    .filter((category) => category.title.length > 0);

                setSides([
                    { id: null, title: 'Tất cả vùng/miền' },
                    ...formattedCategories,
                ]);
            } catch (error) {
                if (!isMounted) return;

                console.error('Không thể tải danh mục:', error);
                setSides([
                    { id: null, title: 'Tất cả vùng/miền' },
                ]);
            }
        };

        loadCategories();

        return () => {
            isMounted = false;
        };
    }, []);

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

    const handleSearch = () => {
        if (startDate && endDate && startDate > endDate) {
            message.error(
                'Ngày bắt đầu không thể sau ngày kết thúc.'
            );
            return;
        }

        if (
            minPrice != null &&
            maxPrice != null &&
            Number(minPrice) > Number(maxPrice)
        ) {
            message.error(
                'Giá thấp nhất không thể lớn hơn giá cao nhất.'
            );
            return;
        }

        onSearch?.({
            title: searchText.trim() || null,
            categoryId: searchSides || null,
            startDate,
            endDate,
            rate,
            searchPrices,
            minPrice:
                Number(minPrice) > 0 ? Number(minPrice) : null,
            maxPrice:
                Number(maxPrice) > 0 ? Number(maxPrice) : null,
        });

        setVisible(false);
    };

    const handleClear = () => {
        setSearchText('');
        setSearchSides(ALL_OPTION);
        setStartDate(null);
        setEndDate(null);
        setDateRange(null);
        setRate(null);
        setSearchPrices('All');
        setMinPrice(null);
        setMaxPrice(null);

        onSearch?.({
            title: null,
            categoryId: null,
            startDate: null,
            endDate: null,
            rate: null,
            searchPrices: 'All',
            minPrice: null,
            maxPrice: null,
        });

        setVisible(false);
        message.success('Đã xóa bộ lọc.');
    };

    const categorySelect = (
        <select
            value={searchSides}
            onChange={(event) => setSearchSides(event.target.value)}
            aria-label="Chọn vùng miền"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
        >
            {sides.map((category, index) => (
                <option
                    key={
                        category.id == null
                            ? `all-${index}`
                            : String(category.id)
                    }
                    value={
                        category.id == null
                            ? ALL_OPTION
                            : String(category.id)
                    }
                >
                    {category.title}
                </option>
            ))}
        </select>
    );

    const filterContent = (
        <div className="space-y-5">
            <section>
                <h3 className="mb-2 text-sm font-bold text-slate-800">
                    Sắp xếp theo giá
                </h3>

                <select
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
                    value={searchPrices}
                    onChange={(event) =>
                        setSearchPrices(event.target.value)
                    }
                    aria-label="Sắp xếp theo giá"
                >
                    <option value="All">Tất cả mức giá</option>
                    <option value="LowToHigh">
                        Giá từ thấp đến cao
                    </option>
                    <option value="HighToLow">
                        Giá từ cao đến thấp
                    </option>
                </select>
            </section>

            <section>
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">
                        Chọn khoảng giá
                    </h3>

                    <span className="rounded-lg bg-cyan-50 px-2.5 py-1 text-[10px] font-bold text-cyan-800">
                        VND
                    </span>
                </div>

                {/* Hai ô cùng hàng, tránh kéo bộ lọc quá dài */}
                <div className="grid grid-cols-2 gap-3">
                    <PriceField
                        label="Giá thấp nhất"
                        value={minPrice}
                        onChange={setMinPrice}
                    />

                    <PriceField
                        label="Giá cao nhất"
                        value={maxPrice}
                        onChange={setMaxPrice}
                    />
                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                    Để trống nếu không muốn giới hạn giá.
                </p>
            </section>

            <Divider className="!my-1" />

            <section>
                <h3 className="mb-1 text-sm font-bold text-slate-800">
                    Điểm đánh giá
                </h3>

                <p className="mb-3 text-xs text-slate-500">
                    Chọn mức đánh giá bạn mong muốn.
                </p>

                <Radio.Group
                    value={rate}
                    onChange={(event) => setRate(event.target.value)}
                    className="flex w-full flex-col gap-1"
                >
                    {RATING_OPTIONS.map((item) => (
                        <Radio
                            key={item}
                            value={item}
                            className="!ml-0 flex items-center rounded-xl border border-transparent px-3 py-2 transition hover:!border-slate-200 hover:!bg-slate-50"
                        >
                            <span className="flex flex-wrap items-center gap-2">
                                <Rate
                                    value={item}
                                    disabled
                                    className="!text-sm !text-amber-400"
                                />

                                <span className="text-xs text-slate-500">
                                    {item} sao
                                </span>
                            </span>
                        </Radio>
                    ))}
                </Radio.Group>
            </section>
        </div>
    );

    return (
        <div className="w-full">
            <div className="block p-4 md:hidden">
                <Button
                    onClick={() => setVisible(true)}
                    icon={<FaBars />}
                    className="!h-11 !rounded-xl !border-slate-200 !px-4 !font-semibold !text-slate-700"
                    aria-label="Mở bộ lọc tìm kiếm"
                >
                    Lọc và tìm kiếm
                </Button>

                <Drawer
                    open={visible}
                    onClose={() => setVisible(false)}
                    title={
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.17em] text-cyan-700">
                                TRAVEL WITH KEII
                            </div>

                            <div className="mt-1 text-lg font-bold text-slate-900">
                                Lọc và tìm kiếm
                            </div>
                        </div>
                    }
                    placement="bottom"
                    height="92dvh"
                    closable
                    destroyOnClose
                    styles={{
                        body: {
                            padding: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 0,
                            overflow: 'hidden',
                            background: '#ffffff',
                        },
                    }}
                >
                    {/* Only this area scrolls */}
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 py-5">
                        <section>
                            <h3 className="mb-3 text-sm font-bold text-slate-800">
                                Tìm kiếm tour
                            </h3>

                            <Input
                                placeholder="Nhập tên tour"
                                allowClear
                                value={searchText}
                                onChange={(event) =>
                                    setSearchText(event.target.value)
                                }
                                className="!h-11 !rounded-xl"
                            />

                            <div className="mt-4">
                                <label className="mb-2 block text-xs font-medium text-slate-500">
                                    Vùng / miền
                                </label>
                                {categorySelect}
                            </div>

                            <div className="mt-4">
                                <label className="mb-2 block text-xs font-medium text-slate-500">
                                    Ngày khởi hành
                                </label>

                                <RangePicker
                                    size="large"
                                    format="DD/MM/YYYY"
                                    placeholder={[
                                        'Ngày bắt đầu',
                                        'Ngày kết thúc',
                                    ]}
                                    value={dateRange}
                                    onChange={handleDateChange}
                                    className="w-full !rounded-xl"
                                />
                            </div>
                        </section>

                        <Divider className="!my-5" />

                        {filterContent}

                        {/* Extra space at the end of the scroll area */}
                        <div className="h-4 shrink-0" />
                    </div>

                    {/* Fixed action footer outside the scroll area */}
                    <div
                        className="grid shrink-0 grid-cols-2 gap-3 border-t border-slate-200 bg-white px-5 pt-3"
                        style={{
                            paddingBottom:
                                'calc(12px + env(safe-area-inset-bottom))',
                        }}
                    >
                        <Button
                            block
                            size="large"
                            onClick={handleClear}
                            className="!h-11 !rounded-xl !font-semibold"
                        >
                            <CloseCircleOutlined />
                            Xóa lọc
                        </Button>

                        <Button
                            type="primary"
                            block
                            size="large"
                            icon={<SearchOutlined />}
                            onClick={handleSearch}
                            className="!h-11 !rounded-xl !border-none !bg-cyan-700 !font-semibold hover:!bg-cyan-800"
                        >
                            Áp dụng
                        </Button>
                    </div>
                </Drawer>
            </div>
        </div>
    );
};