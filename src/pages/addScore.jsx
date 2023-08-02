import './css/main.css';
import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Header } from 'semantic-ui-react'
import { useLocation, useNavigate} from 'react-router-dom';
import * as XLSX from 'xlsx';

function AddScore() {
  const [courseNo, setCourseNo] = useState(0);
  const [section, setSection] = useState(0);
  const [year, setYear] = useState(0);
  const [semaster, setSemaster] = useState(0);
  const [scoreName, setScoreName] = useState('');
  const [studentNumber, setStudentNumber] = useState(0) 
  const [fullScore, setFullScore] = useState('');
  const [isDisplayMean, setIsDisplayMean] = useState(false);
  const [mean, setMean] = useState(0);
  const [note, setNote] = useState('');
  const [fileName, setFileName] = useState(null);
  const [json, setJson] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const data = {
    courseNo: courseNo,
    section: section,
    year: year,
    semaster: semaster,
    scoreName: scoreName,
    studentNumber: studentNumber,
    fullScore: fullScore,
    isDisplayMean: isDisplayMean,
    mean: mean,
    json: json
  }
  const submitHandler = (e) => {
    e.preventDefault();
    setIsDisplayMean(document.getElementById('show-mean').checked);
    navigate('/course-detail', {state: data});
  }

  useEffect(() => {
    let courseNo = location.search.split('&')[0].split('=')[1]  // get course number from Hooks
    let section = location.search.split('&')[1].split('=')[1]  // get section from Hooks
    let year = location.search.split('&')[2].split('=')[1]  // get year from Hooks
    let semaster = location.search.split('&')[3].split('=')[1]  // get semaster from Hooks
    setCourseNo(courseNo); setSection(section); setYear(year); setSemaster(semaster);
  }, [location]);


  // handle Microsoft Excel file (.xlsx)
  const handleFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: ""
    });
    setFileName(file.name)  // set for showing status
    setJson(jsonData);
    setStudentNumber(jsonData.length-1);

    // calculate mean
    var sum = 0;
    for (let i=1;i<jsonData.length;i++) {
      sum += jsonData[i][1];
    }
    var avg = sum / ( jsonData.length - 1 );
    setMean(avg);
  }
  function renderFile() {
    let obj = document.getElementById('file-status')
    if(obj!=null)
      obj.innerHTML = "File has been attached!";
  }
  function notYet() {
    let obj = document.getElementById('file-status')
    if(obj!=null)
      obj.innerHTML = "Please attach Microsoft Excel file with the right template.";
  }

  fileName!=null ? renderFile() : notYet();  // showing file status


  return (
    <Container>
      <br/>
      <Header as="h2">
        React Microsoft Excel
      </Header>
      <Form onSubmit={submitHandler}>
        <Form.Field>
          <label htmlFor='score_name' className='component'>Score Name: </label>
          <input type='text' value={scoreName} onChange={(e) => setScoreName(e.target.value)} placeholder='Enter Score Name'/>
        </Form.Field>
        <Form.Field>
          <label htmlFor='full_score'>Full Score: </label>
          <input type='text' value={fullScore} onChange={(e) => setFullScore(e.target.value)} placeholder='Enter Full Score'/>
        </Form.Field>
        <div className='element1'>
          <label>Display avarage score of section: </label>
          <input type='radio' id='show-mean' name='avg-score' value="show-mean" />
          <label>Show mean</label>
          <input type='radio' name='avg-score' value="not-show-mean" />
          <label>Don't show mean</label>
        </div>
        <div className='element1'>
          <label>Mean: </label>
          <label>** The system will calculate the mean value automatically.</label>
        </div>
        <div className='element1'>
          <label htmlFor='point'>Test score file: </label>
          <input type='file' name='file' onChange={(e) => handleFile(e)} />
          <br/><label id='file-status'></label>
        </div>
        <Form.Field>
          <label htmlFor='comment'>Note to students in section: </label>
          <input type='text' value={note} onChange={(e) => setNote(e.target.value)} placeholder='Enter comment'/>
        </Form.Field>
        <Button color='green' type='submit'>Submit</Button>
      </Form>
      <hr/>


      {/* <h3>ParseExcel</h3>
      {fileName && (
        <React.Fragment>
          <p>
            Filename: <span>{fileName}</span>
          </p>
          <p>
            json:{" "} 
            <select>
              {json.map((res,index) => (
                <option key={index} value={res}>{res[0]}</option>
              ))}
            </select>
          </p>
        </React.Fragment>
      )} */}

    </Container>
  );
}

export default AddScore;
