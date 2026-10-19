import React from 'react';

const PriceInfo = ({child, ...currentData}) => {
    return (
        <div className={'flex justify-between gap-28 text-lg font-semibold'}>
            {child}
        </div>
    );
};

export default PriceInfo;
