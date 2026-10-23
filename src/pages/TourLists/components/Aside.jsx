import { Divider, InputNumber, Radio, message, Rate, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseCircleOutlined } from '@ant-design/icons';

const formatPrice = (value) => {
    if (value == null || value === '') return '';
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parsePrice = (value) =>
    value ? value.replace(/[^\d]/g, '') : '';

export const Aside = ({ query, setQuery, titleType }) => {
    const { t } = useTranslation();

    const [rate, setRate] = useState(query.rate ?? null);
    const [searchPrices, setSearchPrices] = useState(
        query.searchPrices ?? 'All'
    );
    const [maxPrice, setMaxPrice] = useState(
        query.maxPrice ?? null
    );
    const [minPrice, setMinPrice] = useState(
        query.minPrice ?? null
    );

    useEffect(() => {
        setRate(query.rate ?? null);
        setSearchPrices(query.searchPrices ?? 'All');
        setMinPrice(query.minPrice ?? null);
        setMaxPrice(query.maxPrice ?? null);
    }, [
        query.rate,
        query.searchPrices,
        query.minPrice,
        query.maxPrice,
    ]);

    useEffect(() => {
        setQuery((prevQuery) => ({
            ...prevQuery,
            rate,
            minPrice,
            maxPrice,
            searchPrices,
            region: titleType,
        }));
    }, [
        rate,
        minPrice,
        maxPrice,
        searchPrices,
        setQuery,
        titleType,
    ]);

    const handlePriceChange = (type, value) => {
        if (value != null && Number(value) < 0) return;

        if (
            type === 'min' &&
            value != null &&
            maxPrice != null &&
            Number(value) > Number(maxPrice)
        ) {
            message.warning(
                'Giá thấp nhất không thể lớn hơn giá cao nhất.'
            );
            return;
        }

        if (
            type === 'max' &&
            value != null &&
            minPrice != null &&
            Number(value) < Number(minPrice)
        ) {
            message.warning(
                'Giá cao nhất không thể nhỏ hơn giá thấp nhất.'
            );
            return;
        }

        if (type === 'min') {
            setMinPrice(value);
        } else {
            setMaxPrice(value);
        }
    };

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
            className="
                sticky top-5 hidden h-fit min-w-0 shrink-0
                self-start overflow-hidden rounded-2xl
                border border-slate-200 bg-white
                shadow-md transition-shadow duration-300
                hover:shadow-lg
                md:block md:w-[320px]
                lg:w-[350px] xl:w-[370px]
            "
        >
            {/* Header */}
            <div className="border-b border-slate-100 px-6 py-6">
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                    Chọn lọc giá
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Tùy chỉnh lựa chọn để tìm chuyến đi phù hợp.
                </p>
            </div>

            <div className="space-y-7 p-6">
                {/* Sort by price */}
                <section>
                    <h4 className="mb-3 text-base font-semibold text-slate-800">
                        Sắp xếp theo giá
                    </h4>

                    <Select
                        size="large"
                        className="w-full"
                        value={searchPrices}
                        onChange={setSearchPrices}
                        options={[
                            {
                                label: t('search.ti6'),
                                value: 'All',
                            },
                            {
                                label: t('search.ti7'),
                                value: 'HighToLow',
                            },
                            {
                                label: t('search.ti8'),
                                value: 'LowToHigh',
                            },
                        ]}
                    />
                </section>

                <Divider className="!my-0" />

                {/* Price range */}
                <section>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h4 className="text-base font-semibold text-slate-800">
                            Khoảng giá
                        </h4>

                        <span className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-800">
                            VND
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-600">
                                Giá thấp nhất
                            </label>

                            <InputNumber
                                size="large"
                                className="w-full"
                                style={{
                                    width: '100%',
                                    borderRadius: 12,
                                }}
                                placeholder="Không giới hạn"
                                min={0}
                                step={100000}
                                formatter={formatPrice}
                                parser={parsePrice}
                                value={minPrice}
                                onChange={(value) =>
                                    handlePriceChange('min', value)
                                }
                                aria-label="Giá thấp nhất"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-600">
                                Giá cao nhất
                            </label>

                            <InputNumber
                                size="large"
                                className="w-full"
                                style={{
                                    width: '100%',
                                    borderRadius: 12,
                                }}
                                placeholder="Không giới hạn"
                                min={0}
                                step={100000}
                                formatter={formatPrice}
                                parser={parsePrice}
                                value={maxPrice}
                                onChange={(value) =>
                                    handlePriceChange('max', value)
                                }
                                aria-label="Giá cao nhất"
                            />
                        </div>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-slate-400">
                        Để trống nếu bạn không muốn giới hạn giá.
                    </p>
                </section>

                <Divider className="!my-0" />

                {/* Rating */}
                <section>
                    <h4 className="text-base font-semibold text-slate-800">
                        Điểm đánh giá
                    </h4>

                    <p className="mb-4 mt-2 text-sm leading-6 text-slate-500">
                        Chọn mức đánh giá mong muốn.
                    </p>

                    <Radio.Group
                        value={rate}
                        onChange={(event) =>
                            setRate(event.target.value)
                        }
                        className="flex w-full flex-col gap-2"
                    >
                        {[5, 4, 3, 2, 1].map((item) => (
                            <Radio
                                key={item}
                                value={item}
                                className="
                                    !ml-0 flex min-h-12 items-center
                                    rounded-xl border border-transparent
                                    px-3 py-3 transition-colors
                                    hover:!border-slate-200
                                    hover:!bg-slate-50
                                "
                            >
                                <span className="flex flex-wrap items-center gap-3">
                                    <Rate
                                        value={item}
                                        disabled
                                        className="!text-base !text-amber-400"
                                    />

                                    <span className="text-sm font-medium text-slate-600">
                                        {item} sao
                                    </span>
                                </span>
                            </Radio>
                        ))}
                    </Radio.Group>
                </section>

                {/* Reset filters */}
                <button
                    type="button"
                    onClick={handleClear}
                    className="
                        flex min-h-12 w-full items-center
                        justify-center gap-2 rounded-xl
                        border border-slate-200 bg-white
                        px-4 py-3 text-sm font-semibold
                        text-slate-600 transition-all duration-200
                        hover:border-rose-200 hover:bg-rose-50
                        hover:text-rose-600
                        focus:outline-none focus:ring-2
                        focus:ring-rose-100
                    "
                >
                    <CloseCircleOutlined className="text-base" />
                    Bỏ chọn bộ lọc
                </button>
            </div>
        </aside>
    );
};