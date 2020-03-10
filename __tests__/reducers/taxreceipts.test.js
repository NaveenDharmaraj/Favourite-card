// import taxreceipt from '../../reducers/taxreceipt';

// describe('Tax Receipts Reducer', () => {
//     it('should return default state', () => {
//         const newState = taxreceipt(undefined, {});
//         expect(newState).toEqual({});
//     });
//     it('should return state for GET_INITIAL_TAX_RECEIPT_PROFILE ', () => {
//         const taxReceiptProfileList = [];
//         const type = 'GET_INITIAL_TAX_RECEIPT_PROFILE';
//         const payload = {
//             loader: undefined,
//             taxReceiptProfileList,
//             taxReceiptProfilePageCount: 2,
//         };

//         const newState = taxreceipt(undefined, {
//             payload,
//             type,
//         });
//         expect(newState).toEqual(payload);
//     });
//     it('should return state for GET_PAGINATED_TAX_RECEIPT_PROFILE ', () => {
//         const taxReceiptProfileList = [];
//         const type = 'GET_PAGINATED_TAX_RECEIPT_PROFILE';
//         const payload = {
//             loader: undefined,
//             taxReceiptProfileList,
//             taxReceiptProfilePageCount: 2,
//         };

//         const newState = taxreceipt(undefined, {
//             payload,
//             type,
//         });
//         expect(newState).toEqual(payload);
//     });
// });
