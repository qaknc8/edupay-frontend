import PrimaryButton from '../../buttons/PrimaryButton';
import TextInput from '../../inputs/TextInput';
import Textarea from '../../inputs/Textarea';
import * as S from './style';
import { IoSearchOutline } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import usePopup from '../../../hooks/usePopup';
import useCustomForm from '../../../hooks/useCustomForm';
import * as Yup from 'yup';
import { Controller, SubmitErrorHandler } from 'react-hook-form';
import { useBillSendMutation } from './hooks/useBillSendMutation';
import { errorAlert } from '../../../utils/alert';

const billFormSchema = Yup.object().shape({
	studentName: Yup.string().required('원생을 검색 후 선택하세요.'),
	grade: Yup.string().required(''),
	tel: Yup.string().required(''),
	subject: Yup.string().required(''),
	tuition: Yup.string().required(''),
	deadline: Yup.string().required(''),
	message: Yup.string().required('안내메세지를 입력해주세요.'),
});

interface FormValues {
	studentName: string;
	grade: string;
	tel: string;
	subject: string;
	tuition: string;
	deadline: string;
	message: string;
}

type SubmitHandler<TSubmitFieldValues extends FormValues> = (
	data: TSubmitFieldValues,
	e?: React.BaseSyntheticEvent,
) => void | Promise<void>;

const BillPopup = () => {
	const { closePopup } = usePopup();
	const { control, handleSubmit, reset, setValue } = useCustomForm<FormValues>(billFormSchema, 'onSubmit');
	const { mutate: sendBillMutate } = useBillSendMutation();

	const handleSubmitBill: SubmitHandler<FormValues> = (data) => {
		sendBillMutate(data);
		reset();
	};

	const handleSubmitError: SubmitErrorHandler<FormValues> = (errors) => {
		if (errors.studentName) {
			errorAlert(errors.studentName.message);
		} else if (errors.message) {
			errorAlert(errors.message.message);
		}
	};

	const handleClickUserChoice = () => {
		setValue('studentName', '조정택');
		setValue('grade', '고등학교 3학년');
		setValue('tel', '010-9774-3591');
		setValue('subject', '수학, 과학');
		setValue('tuition', '10,000,000');
		setValue('deadline', '~2024.07.10');
	};

	return (
		<S.Container>
			<S.Title>
				<span>청구서 발급</span>
				<button onClick={closePopup}>
					<IoMdClose size={30} />
				</button>
			</S.Title>
			<S.BillForm onSubmit={handleSubmit(handleSubmitBill, handleSubmitError)}>
				<S.UserSearchBox>
					<TextInput placeholder="원생명을 입력해주세요." />
					<S.SearchBtn type="button">
						<IoSearchOutline size={30} />
					</S.SearchBtn>
				</S.UserSearchBox>
				<S.UserListBox>
					<S.UserList>
						<li>
							<S.UserInfo>
								<span>조정택</span> / 1997.07.08 / 010-9774-3591
							</S.UserInfo>
							<PrimaryButton
								type="button"
								text="선택"
								isFill
								width="45px"
								textSize="12px"
								onClick={handleClickUserChoice}
							/>
						</li>
						<li>
							<S.UserInfo>
								<span>조정택</span> / 1997.07.08 / 010-9774-3591
							</S.UserInfo>
							<PrimaryButton
								type="button"
								text="선택"
								isFill
								width="45px"
								textSize="12px"
								onClick={handleClickUserChoice}
							/>
						</li>
						<li>
							<S.UserInfo>
								<span>조정택</span> / 1997.07.08 / 010-9774-3591
							</S.UserInfo>
							<PrimaryButton
								type="button"
								text="선택"
								isFill
								width="45px"
								textSize="12px"
								onClick={handleClickUserChoice}
							/>
						</li>
						<li>
							<S.UserInfo>
								<span>조정택</span> / 1997.07.08 / 010-9774-3591
							</S.UserInfo>
							<PrimaryButton
								type="button"
								text="선택"
								isFill
								width="45px"
								textSize="12px"
								onClick={handleClickUserChoice}
							/>
						</li>
						<li>
							<S.UserInfo>
								<span>조정택</span> / 1997.07.08 / 010-9774-3591
							</S.UserInfo>
							<PrimaryButton
								type="button"
								text="선택"
								isFill
								width="45px"
								textSize="12px"
								onClick={handleClickUserChoice}
							/>
						</li>
						<li>
							<S.UserInfo>
								<span>조정택</span> / 1997.07.08 / 010-9774-3591
							</S.UserInfo>
							<PrimaryButton
								type="button"
								text="선택"
								isFill
								width="45px"
								textSize="12px"
								onClick={handleClickUserChoice}
							/>
						</li>
					</S.UserList>
				</S.UserListBox>
				<S.UserInfoContainer>
					<S.InputContainer>
						<label htmlFor="studentName">이름</label>
						<Controller
							name="studentName"
							control={control}
							defaultValue=""
							render={({ field }) => <TextInput id="studentName" disabled {...field} />}
						/>
					</S.InputContainer>
					<S.InputContainer>
						<label htmlFor="grade">학년</label>
						<Controller
							name="grade"
							control={control}
							defaultValue=""
							render={({ field }) => <TextInput id="grade" disabled {...field} />}
						/>
					</S.InputContainer>
					<S.InputContainer>
						<label htmlFor="tel">연락처</label>
						<Controller
							name="tel"
							control={control}
							defaultValue=""
							render={({ field }) => <TextInput id="tel" disabled {...field} />}
						/>
					</S.InputContainer>
				</S.UserInfoContainer>
				<S.BillSubTitle>수강 정보</S.BillSubTitle>
				<S.UserInfoContainer>
					<S.InputContainer>
						<label htmlFor="subject">수강과목</label>
						<Controller
							name="subject"
							control={control}
							defaultValue=""
							render={({ field }) => <TextInput id="subject" disabled {...field} />}
						/>
					</S.InputContainer>
					<S.InputContainer>
						<label htmlFor="tuition">수강료</label>
						<Controller
							name="tuition"
							control={control}
							defaultValue=""
							render={({ field }) => <TextInput id="tuition" disabled {...field} />}
						/>
					</S.InputContainer>
					<S.InputContainer>
						<label htmlFor="deadline">결제기한</label>
						<Controller
							name="deadline"
							control={control}
							defaultValue=""
							render={({ field }) => <TextInput id="deadline" disabled {...field} />}
						/>
					</S.InputContainer>
				</S.UserInfoContainer>
				<S.BillSubTitle>안내 메세지</S.BillSubTitle>
				<S.MessageContainer>
					<Controller
						name="message"
						control={control}
						defaultValue=""
						render={({ field }) => <Textarea placeholder="안내메세지를 입력하세요." {...field} />}
					/>
				</S.MessageContainer>
				<S.BillBtnContainer>
					<PrimaryButton type="submit" text="발송" width="49%" isFill />
					<PrimaryButton type="button" text="취소" width="49%" onClick={closePopup} />
				</S.BillBtnContainer>
			</S.BillForm>
		</S.Container>
	);
};

export default BillPopup;
