import React, { useState } from 'react';
import {
	Container,
	Title,
	SearchSection,
	SearchTitle,
	SearchForm,
	InputGroup,
	Input,
	Select,
	Button,
	ButtonGroup,
	Table,
	Th,
	Td,
} from './style';
import { useBillSendMutation } from './hooks/useBillSendMutation'; // 경로는 실제 위치에 맞게 수정
import { BillType } from './type'; // BillType의 실제 경로로 수정

const studentsData = [
	{
		name: '홍길동',
		school: '학교1',
		grade: '5학년',
		group: '그룹1',
		class: '초등 5반',
		teacher: '선생님1',
		paymentInfo: '미납 0건/예정 1건',
		contact: '010-0000-0000',
		selected: false,
	},
	{
		name: '김철수',
		school: '학교2',
		grade: '4학년',
		group: '그룹2',
		class: '초등 4반',
		teacher: '선생님2',
		paymentInfo: '미납 1건/예정 0건',
		contact: '010-1111-1111',
		selected: false,
	},
];

const StudentMgrPage = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [filters, setFilters] = useState({
		name: '',
		school: '',
		grade: '',
		group: '',
		class: '',
		teacher: '',
	});
	const [selectAll, setSelectAll] = useState(false);
	const [students, setStudents] = useState(studentsData);
	const { mutate: sendBill } = useBillSendMutation();

	const handleSearchChange = (e) => setSearchTerm(e.target.value);

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters((prevFilters) => ({
			...prevFilters,
			[name]: value,
		}));
	};

	const filterStudents = (students, filters) => {
		return students.filter((student) => {
			return Object.keys(filters).every((key) => student[key].includes(filters[key]));
		});
	};

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		setStudents(filterStudents(studentsData, { name: searchTerm }));
	};

	const handleFilterSubmit = (e) => {
		e.preventDefault();
		setStudents(filterStudents(studentsData, filters));
	};

	const handleBillingClick = () => {
		const selectedStudents = students.filter((student) => student.selected);
		if (selectedStudents.length === 0) {
			alert('청구서를 발송할 원생을 선택하세요.');
			return;
		}

		selectedStudents.forEach((student) => {
			const billData: BillType = {
				// 필요한 데이터로 빌드
				name: student.name,
				school: student.school,
				grade: student.grade,
				group: student.group,
				class: student.class,
				teacher: student.teacher,
				paymentInfo: student.paymentInfo,
				contact: student.contact,
			};
			sendBill(billData);
		});
	};

	const handleDeleteClick = () => console.log('Delete Clicked');
	const handleAddNewClick = () => console.log('Add New Student Clicked');

	const handleSelectAllChange = (e) => {
		const { checked } = e.target;
		setSelectAll(checked);
		setStudents((prevStudents) => prevStudents.map((student) => ({ ...student, selected: checked })));
	};

	const handleSelectChange = (index) => (e) => {
		const { checked } = e.target;
		setStudents((prevStudents) => {
			const newStudents = [...prevStudents];
			newStudents[index].selected = checked;
			if (!checked) {
				setSelectAll(false);
			} else if (newStudents.every((student) => student.selected)) {
				setSelectAll(true);
			}
			return newStudents;
		});
	};

	return (
		<Container>
			<Title>원생관리</Title>

			<SearchSection>
				<SearchTitle>통합검색</SearchTitle>
				<SearchForm onSubmit={handleSearchSubmit}>
					<InputGroup>
						<Select>
							<option>원생명</option>
							{/* Other options */}
						</Select>
						<Input placeholder="검색어 입력" value={searchTerm} onChange={handleSearchChange} />
						<Button type="submit">검색</Button>
					</InputGroup>
				</SearchForm>
			</SearchSection>

			<SearchSection>
				<SearchTitle>조건검색</SearchTitle>
				<SearchForm onSubmit={handleFilterSubmit}>
					<InputGroup>
						<Input name="name" placeholder="원생명 입력" value={filters.name} onChange={handleFilterChange} />
						<Input name="school" placeholder="학교명 입력" value={filters.school} onChange={handleFilterChange} />
						<Input name="grade" placeholder="학년명 입력" value={filters.grade} onChange={handleFilterChange} />
					</InputGroup>
					<InputGroup>
						<Select name="group" value={filters.group} onChange={handleFilterChange}>
							<option value="">그룹선택</option>
							<option value="그룹1">그룹1</option>
							<option value="그룹2">그룹2</option>
							{/* Other options */}
						</Select>
						<Select name="class" value={filters.class} onChange={handleFilterChange}>
							<option value="">반선택</option>
							<option value="초등 5반">초등 5반</option>
							<option value="초등 6반">초등 6반</option>
							{/* Other options */}
						</Select>
						<Select name="teacher" value={filters.teacher} onChange={handleFilterChange}>
							<option value="">주담임선택</option>
							<option value="선생님1">선생님1</option>
							<option value="선생님2">선생님2</option>
							{/* Other options */}
						</Select>
					</InputGroup>
					<Button type="submit">검색</Button>
				</SearchForm>
			</SearchSection>

			<ButtonGroup>
				<Button onClick={handleBillingClick}>청구서발송</Button>
				<Button onClick={handleDeleteClick}>삭제</Button>
				<Button onClick={handleAddNewClick}>신규원생등록</Button>
			</ButtonGroup>

			<StudentTable
				students={students}
				selectAll={selectAll}
				onSelectAllChange={handleSelectAllChange}
				onSelectChange={handleSelectChange}
			/>
		</Container>
	);
};

const StudentTable = ({ students, selectAll, onSelectAllChange, onSelectChange }) => {
	return (
		<Table>
			<thead>
				<tr>
					<Th>
						<input type="checkbox" checked={selectAll} onChange={onSelectAllChange} />
					</Th>
					<Th>원생명</Th>
					<Th>학교명</Th>
					<Th>학년명</Th>
					<Th>그룹</Th>
					<Th>수강반 정보</Th>
					<Th>주담임</Th>
					<Th>수납정보</Th>
					<Th>연락처</Th>
				</tr>
			</thead>
			<tbody>
				{students.map((student, index) => (
					<tr key={index}>
						<Td>
							<input type="checkbox" checked={student.selected} onChange={onSelectChange(index)} />
						</Td>
						<Td>{student.name}</Td>
						<Td>{student.school}</Td>
						<Td>{student.grade}</Td>
						<Td>{student.group}</Td>
						<Td>{student.class}</Td>
						<Td>{student.teacher}</Td>
						<Td>{student.paymentInfo}</Td>
						<Td>{student.contact}</Td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};

export default StudentMgrPage;