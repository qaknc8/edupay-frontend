import { ReactNode } from 'react';
import { usePopupStore } from '../stores/\bpopupStore';

const usePopup = () => {
	const { setPopup } = usePopupStore();

	const openPopup = (popup: ReactNode) => setPopup(popup);
	const closePopup = () => setPopup(null);

	return { openPopup, closePopup };
};

export default usePopup;
