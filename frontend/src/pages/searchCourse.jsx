import axios from "axios";
import { useState, useEffect } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
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
const semaster = [
	{value: 0, text: 'Choose Semaster'},
	{value: 1, text: 'Semaster 1'},
	{value: 2, text: 'Semaster 2'},
	{value: 3, text: 'Semaster 3'}
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
	const [selectedSemaster, setSelectedSemaster] = useState(0);
	
	// Create an instance
	const accessToken = "2d63c18e-878d-487f-b7ae-53e42f5e1ce7";
	const controller = new AbortController();
	const signal = controller.signal;
	const navigate = useNavigate();
	const params = createSearchParams({
			courseNo: selectedCourseNo,
			section: selectedSection,
			year: selectedYear,
			semaster: selectedSemaster
	}).toString()
	console.log(params)

	const goToNav = () => {
		navigate('/add-score?' + params)
	}

	// Axios Part
	function axiosFetch() {
		console.log('Fetching');
		axios.get('https://api.cpe.eng.cmu.ac.th/api/v1/course/detail', {
			signal: signal,
			headers: { Authorization: `Bearer ${accessToken}` }
		}).then(res => setData(res.data.courseDetails))
		  .catch(err => console.error('Error:', err))
	}
	function axiosAbort() {
		console.log('Abort');
		controller.abort();
	}

	useEffect(() => {
		// Get API by using axios
		axios.get('https://api.cpe.eng.cmu.ac.th/api/v1/course/detail',
		{
			headers: { Authorization: `Bearer ${accessToken}` }
		})
		.then(res => setData(res.data.courseDetails));
		
	}, [])
	console.log(data)
	
	return (
		<body>
			{/* Here is professor dashboard's location */}
			<button onClick={axiosFetch} style={{ width: '50px' }}>Begin</button>
			<button onClick={axiosAbort} style={{ width: '50px' }}>Abort</button>
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
				<h3>Choose Semaster</h3>
				<select value={selectedSemaster} onChange={e=>setSelectedSemaster(e.target.value)} style={{ width: '170px' }} required>
					{semaster.map((res,index)=>(
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
