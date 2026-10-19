import { Empty } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export const EmptyComponent = ({ description }) => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-center w-full h-full py-32">
            <Empty
                className="h-full"
                image={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                description={<h1 className="mt-6 font-semibold text-2xl">{t("empty.ti1")} {description} {t("empty.ti2")}</h1>}
            />
        </div>
    );
};