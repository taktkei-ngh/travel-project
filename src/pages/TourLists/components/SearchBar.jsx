
import { Button, DatePicker, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import CategoryServices from '~/services/CategoryServices';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;
const ALL_OPTION = '__ALL__';

export const SearchBar = ({ onSearch, query = {} }) => {
    const { t } = useTranslation();
    const allCategoryTitle = t('search.ti1');

    const [searchText, setSearchText] = useState(query.searchText ?? '');
    const [searchSides, setSearchSides] = useState(
        query.searchSides == null ? ALL_OPTION : String(query.searchSides)
    );
    const [startDate, setStartDate] = useState(query.startDate ?? null);
    const [endDate, setEndDate] = useState(query.endDate ?? null);
    const [sides, setSides] = useState([
        { value: ALL_OPTION, label: allCategoryTitle },
    ]);

    useEffect(() => {
        let isMounted = true;

        const loadCategories = async () => {
            try {
                const res = await CategoryServices.getCategories();

                if (!isMounted) return;

                const items = Array.isArray(res)
                    ? res
                    : Array.isArray(res?.data)
                        ? res.data
                        : Array.isArray(res?.data?.data)
                            ? res.data.data
                            : [];

                const categoryOptions = items
                    .filter((item) => item && (item.id != null || item._id != null))
                    .map((item) => ({
                        value: String(item.id ?? item._id),
                        label: String(item.title ?? item.name ?? '').trim(),
                    }))
                    .filter((item) => item.label.length > 0);

                setSides([
                    { value: ALL_OPTION, label: allCategoryTitle },
                    ...categoryOptions,
                ]);
            } catch (error) {
                if (!isMounted) return;

                console.error('Không thể tải danh mục tìm kiếm:', error);
                setSides([
                    { value: ALL_OPTION, label: allCategoryTitle },
                ]);
            }
        };

        loadCategories();

        return () => {
            isMounted = false;
        };
    }, [allCategoryTitle]);

    const handleSearch = () => {
        if (startDate && endDate && startDate > endDate) {
            message.error('Ngày bắt đầu không thể sau ngày kết thúc');
            return;
        }

        onSearch?.({
            searchText,
            searchSides: searchSides === ALL_OPTION ? null : searchSides,
            startDate,
            endDate,
        });
    };

    const handleRefresh = () => {
        setSearchText('');
        setSearchSides(ALL_OPTION);
        setStartDate(null);
        setEndDate(null);

        onSearch?.({
            searchText: '',
            searchSides: null,
            startDate: null,
            endDate: null,
        });

        message.success('Đã làm mới tìm kiếm');
    };

    const handleDateChange = (dates) => {
        if (dates?.[0] && dates?.[1]) {
            setStartDate(dates[0].format('YYYY-MM-DD'));
            setEndDate(dates[1].format('YYYY-MM-DD'));
        } else {
            setStartDate(null);
            setEndDate(null);
        }
    };

    return (
        <div className="mx-auto mt-4 hidden w-fit flex-row items-center justify-center gap-4 rounded-lg bg-gray-100 p-4 shadow-xl md:flex lg:flex">
            <Input
                value={searchText}
                placeholder={t('search.ti2')}
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                className="w-96 rounded-lg font-bold"
                size="large"
            />

            <select
                value={searchSides}
                onChange={(e) => setSearchSides(e.target.value)}
                aria-label={allCategoryTitle}
                className="h-10 w-96 rounded-lg border border-gray-200 bg-white px-3 font-bold text-gray-800 outline-none focus:border-orange-400"
            >
                {sides.map((side) => (
                    <option key={side.value} value={side.value}>
                        {side.label}
                    </option>
                ))}
            </select>

            <RangePicker
                size="large"
                format="DD/MM/YYYY"
                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                onChange={handleDateChange}
                className="w-96 font-bold"
            />

            <Button
                type="primary"
                onClick={handleSearch}
                className="!bg-orange-500"
            >
                {t('search.ti3')}
            </Button>

            <Button onClick={handleRefresh}>
                Xóa bộ lọc
            </Button>
        </div>
    );
};
