
const configObj = {
    envConfig: {},
    get envVariable() {
        return this.envConfig;
    },
    set envVariable(params) {
        this.envConfig = {
            ...this.envConfig,
            ...params,
        };
    },
};

export default configObj;
