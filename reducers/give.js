const give = (state = {}, action) => {
    console.log(action.type);
    switch (action.type) {
        case "SAVE_FLOW_OBJECT" :
            state = {
                ...state,
                flowObject: {
                    ...state.flowObject,
                    ...action.payload
                },
            }
            console.log('payload in reducer is -> ', action.payload)
            break;
    }
    return state;
}

export default give;
