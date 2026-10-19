import React from 'react';

export const CardInfo = ({title, children}) => {
    return (
        <div className={"mt-2"}>
            <h3 className={'text-xl uppercase text-blue-800 font-semibold text-center'}>{title}</h3>
            <div className={'flex justify-center flex-wrap gap-4 mt-6'}>
                {children}
            </div>
        </div>
    );
};