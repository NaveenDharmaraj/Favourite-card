const isFalsy = (val) => {
    const falsyArray = [
        undefined,
        null,
        NaN,
        0,
        '',
        false,
    ];
    return falsyArray.includes(val);
};

export {
    isFalsy,
};
