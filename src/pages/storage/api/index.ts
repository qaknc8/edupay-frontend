import axiosApi from '../../../api/axios';
import { FilterSearchType, ReceiptRequestType, StorageResponseType } from '../type';

const SIZE = 10;

export const getStorages = async (searchFilter: FilterSearchType, page: number): Promise<StorageResponseType> => {
	const response = await axiosApi.get<StorageResponseType>(
		`payments?status=${searchFilter.isPaid}&year=${searchFilter.year}&month=${searchFilter.month}${searchFilter.studentName && `&studentName=${searchFilter.studentName}`}&page=${page}&size=${SIZE}`,
	);

	return response.data;
};

export const sendReceipt = async (receipt: ReceiptRequestType) => {
	const response = await axiosApi.post('/receipt/send', receipt);

	return response.data;
};
