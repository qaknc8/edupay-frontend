import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import {
	Container,
	LoadingSpiner,
	PageTitle,
	TableContentBox,
	TableContentContainer,
	TableList,
	TableTitleBox,
	WarningMessage,
} from '../../styles/commonStyle';
import * as S from './style';
import { TabBox, TabMenu } from '../storage/style';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useGetChargeHistoryQuery } from './hooks/useGetChargeHistoryQuery';
import { formatNumber } from '../../utils/formatNumber';
import profileImg from './assets/images/profile.jpeg';
import { formatDate } from '../../utils/formatDate';
import { useGetUseHistoryQuery } from './hooks/useGetUseHistoryQuery';
import { useRefundMutation } from './hooks/useRefundMutation';
import { useGetUserQuery } from '../../components/Header/hooks/useGetUserQuery';
import { successAlert } from '../../utils/alert';

const Mypage = () => {
	const [page, setPage] = useState(1);
	const [tab, setTab] = useState('충전');
	const { mutate: refundMutate } = useRefundMutation();
	const { data: userInfo, refetch } = useGetUserQuery();
	const {
		data: chargeHistoryDatas,
		fetchNextPage: chargeHistoryFetchNextPage,
		hasNextPage: chargeHistoryHasNextPage,
		isFetching: chargeHistoryIsFetching,
		refetch: chargeHistoryRefetch,
	} = useGetChargeHistoryQuery();
	const {
		data: useHistoryDatas,
		fetchNextPage: useHistoryFetchNextPage,
		hasNextPage: useHistoryHasNextPage,
		isFetching: useHistoryIsFetching,
	} = useGetUseHistoryQuery();

	console.log(userInfo);

	const navigate = useNavigate();

	const goToProfileEdit = () => {
		navigate('/edit-profile');
	};

	const handleRefund = (impUid: string) => () => {
		const data = {
			user_id: userInfo && Number(userInfo?.userId),
			imp_uid: impUid,
		};
		refundMutate(data);
		refetch();
		chargeHistoryRefetch();
	};

	const handleSettle = () => {
		successAlert('정산요청이 완료되었습니다.');
	};

	const handleChangeTab = (e: React.MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement;
		setTab(target.name);
	};

	const observerRef = useRef(null);

	useEffect(() => {
		const observerOptions: IntersectionObserverInit = {
			root: null,
			rootMargin: '0px',
			threshold: 0.8,
		};

		const handleIntersection: IntersectionObserverCallback = (entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && chargeHistoryHasNextPage && !chargeHistoryIsFetching) {
					setPage((prevPage) => prevPage + 1);
				}
			});
		};

		const observer = new IntersectionObserver(handleIntersection, observerOptions);

		if (observerRef.current) {
			observer.observe(observerRef.current);
		}

		return () => {
			if (observerRef.current) {
				observer.unobserve(observerRef.current);
			}
		};
	}, [
		chargeHistoryFetchNextPage,
		chargeHistoryHasNextPage,
		chargeHistoryIsFetching,
		useHistoryFetchNextPage,
		useHistoryHasNextPage,
		useHistoryIsFetching,
	]);

	useEffect(() => {
		if (page > 0) {
			chargeHistoryFetchNextPage();
			useHistoryFetchNextPage();
		}
	}, [page, chargeHistoryFetchNextPage]);

	return (
		<Container>
			<PageTitle>마이페이지</PageTitle>
			<S.MypageContainer>
				<S.ProfileContainer>
					<S.ProfileImg style={{ backgroundImage: `url(${profileImg})` }} />
					<S.ProfileName>{userInfo?.academyName}</S.ProfileName>
				</S.ProfileContainer>
				<S.ProfileInfoContainer>
					<S.ProfileInfoBox>
						<h4>원생 수:</h4>
						<p>{userInfo?.studentCount}명</p>
					</S.ProfileInfoBox>
					<S.ProfileInfoBox>
						<h4>과목 수:</h4>
						<p>{userInfo?.lectureCount}명</p>
					</S.ProfileInfoBox>
					<S.ProfileInfoBox>
						<h4>정산예정금액:</h4>
						<p>{formatNumber(userInfo?.totalPaidBill)}원</p>
					</S.ProfileInfoBox>
				</S.ProfileInfoContainer>
				<S.ProfileBtnContainer>
					<PrimaryButton text="정산 요청" width="200px" onClick={handleSettle} />
					<PrimaryButton text="회원정보수정" width="200px" onClick={goToProfileEdit} />
				</S.ProfileBtnContainer>
			</S.MypageContainer>
			<TabBox>
				<TabMenu $active={tab === '충전'}>
					<button name="충전" onClick={handleChangeTab}>
						충전내역
					</button>
				</TabMenu>
				<TabMenu $active={tab === '사용'}>
					<button name="사용" onClick={handleChangeTab}>
						사용내역
					</button>
				</TabMenu>
			</TabBox>
			<S.MypageContainer>
				<TableTitleBox>
					<TableList $isTitle width="15%">
						날짜
					</TableList>
					<TableList $isTitle width="20%">
						충전개수
					</TableList>
					<TableList $isTitle width="40%">
						환불가능여부
					</TableList>
					<TableList $isTitle width="20%"></TableList>
				</TableTitleBox>
				<TableContentContainer>
					{tab === '충전'
						? chargeHistoryDatas?.pages.map((page, index) => (
								<Fragment key={index}>
									{page?.content.length > 0 ? (
										page?.content?.map((data) => (
											<TableContentBox key={data.id}>
												<TableList width="15%">{formatDate(data.createdAt)}</TableList>
												<TableList width="20%">{`${formatNumber(data.point)}개`}</TableList>
												<TableList width="40%">O</TableList>
												<TableList width="20%">
													<PrimaryButton
														text="환불신청"
														width="90%"
														textSize="13px"
														isFill
														onClick={handleRefund(data.paymentUid)}
														disabled={data.canRefund === false}
													/>
												</TableList>
											</TableContentBox>
										))
									) : (
										<WarningMessage>충전내역이 존재하지 않습니다.</WarningMessage>
									)}
								</Fragment>
							))
						: useHistoryDatas?.pages.map((page, index) => (
								<Fragment key={index}>
									{page?.content.length > 0 ? (
										page?.content?.map((data) => (
											<TableContentBox key={data.id}>
												<TableList width="15%">{formatDate(data.createdAt)}</TableList>
												<TableList width="20%">{`${formatNumber(data.point)}개`}</TableList>
												<TableList width="40%">O</TableList>
												<TableList width="20%">
													<PrimaryButton text="환불신청" width="90%" textSize="13px" isFill />
												</TableList>
											</TableContentBox>
										))
									) : (
										<WarningMessage>사용내역이 존재하지 않습니다.</WarningMessage>
									)}
								</Fragment>
							))}
					{(chargeHistoryIsFetching || useHistoryIsFetching) && <LoadingSpiner />}

					<div ref={observerRef} style={{ height: '10px', background: 'transparent' }} />
				</TableContentContainer>
			</S.MypageContainer>
		</Container>
	);
};

export default Mypage;
