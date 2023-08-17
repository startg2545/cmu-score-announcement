import { useState, useEffect } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { getAllCourses } from "../services";
import './css/main.css';

const year = [
	{value: 0, text: 'Choose academic year'},
	{value: 2566, text: '2566'},
	{value: 2565, text: '2565'},
	{value: 2564, text: '2564'},
	{value: 2563, text: '2563'},
	{value: 2562, text: '2562'},
	{value: 2561, text: '2561'},
	{value: 2560, text: '2560'},
	{value: 2559, text: '2559'},
	{value: 2558, text: '2558'},
	{value: 2557, text: '2557'},
	{value: 2556, text: '2556'},
	{value: 2555, text: '2555'},
	{value: 2554, text: '2554'},
	{value: 2553, text: '2553'},
	{value: 2552, text: '2552'},
]
const semester = [
	{value: 0, text: 'Choose Semester'},
	{value: 1, text: 'Semester 1'},
	{value: 2, text: 'Semester 2'},
	{value: 3, text: 'Semester 3'}
]
const sections = [
	{value: 0, text: 'Choose Section'},
	{value: 1, text: '001'},
	{value: 2, text: '002'},
	{value: 3, text: '003'},
	{value: 701, text: '701'},
	{value: 702, text: '702'},
	{value: 703, text: '703'},
	{value: 801, text: '801'},
	{value: 802, text: '802'},
	{value: 803, text: '803'},
]

const SearchCourse = () => {
	const [data, setData] = useState([]);
	const [selectedCourseNo, setSelectedCourseNo] = useState("");
	const [selectedSection, setSelectedSection] = useState("");
	const [selectedYear, setSelectedYear] = useState(0);
	const [selectedSemester, setSelectedSemester] = useState(0);
	
	const navigate = useNavigate();
	const params = createSearchParams({
			semester: selectedSemester,
			year: selectedYear,
			courseNo: selectedCourseNo,
			section: selectedSection
	}).toString()
	console.log(params)

	const goToNav = () => {
		navigate('/upload-score-page?' + params)
	}

	useEffect(() => {
		const fetchData = async () => {
			const res =  await getAllCourses();
			setData(res.courseDetails);
		}
		fetchData();
	}, [getAllCourses])
	console.log(data)
	
	return (
		<body>
			<form onSubmit={()=>{
				goToNav()
			}}>
			<div>
				<h3>Choose Course</h3>
				<select value={selectedCourseNo} onChange={e=>setSelectedCourseNo(e.target.value)} style={{ width: '170px' }} required>
					<option>Choose Course</option>
					{data.map((res,index)=>(
						<option key={index} value={res.value}>
							{res.courseNo}
						</option>
					))}
				</select>
				<h3>Choose Section</h3>
				<select value={selectedSection} onChange={e=>setSelectedSection(e.target.value)} style={{ width: '170px' }} required>
					{sections.map((res,index)=>(
						<option key={index} value={res.value}>
							{res.text}
						</option>
					))}
				</select>
				<h3>Choose Year</h3>
				<select value={selectedYear} onChange={e=>setSelectedYear(e.target.value)} style={{ width: '170px' }} required>
					{year.map((res,index)=>(
						<option key={index} value={res.value}>
							{res.text}
						</option>
					))}
				</select>
				<h3>Choose Semester</h3>
				<select value={selectedSemester} onChange={e=>setSelectedSemester(e.target.value)} style={{ width: '170px' }} required>
					{semester.map((res,index)=>(
						<option key={index} value={res.value}>
							{res.text}
						</option>
					))}
					
				</select>
			</div>
			<button style={{ width: '200px' }} type="submit">Save The Course Selection</button>
			</form>
		</body>
	);
};

export default SearchCourse;
