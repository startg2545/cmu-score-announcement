import './css/main.css';
import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Header } from 'semantic-ui-react'
import { useLocation, useNavigate} from 'react-router-dom';
import * as XLSX from 'xlsx';

function AddScore() {
  const [details, setDetails] = useState([])
  const [courseNo, setCourseNo] = useState(0);
  const [section, setSection] = useState(0);
  const [year, setYear] = useState(0);
  const [semaster, setSemaster] = useState(0);
  const [scoreName, setScoreName] = useState('');
  const [fullScore, setFullScore] = useState('');
  const [isDisplayMean, setIsDisplayMean] = useState(false);
  const [note, setNote] = useState('');
  const [fileName, setFileName] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const data = {
    courseNo: courseNo,
    section: section,
    year: year,
    semaster: semaster,
    details: details
  }

  const submitHandler = (e) => {
    e.preventDefault()
    setIsDisplayMean(document.getElementById('show-mean').checked);
    console.log(data)
    navigate('/add-database', {state: data});
  }

  useEffect(() => {
    let courseNo = location.search.split('&')[0].split('=')[1]  // get course number from Hooks
    let section = location.search.split('&')[1].split('=')[1]  // get section from Hooks
    let year = location.search.split('&')[2].split('=')[1]  // get year from Hooks
    let semaster = location.search.split('&')[3].split('=')[1]  // get semaster from Hooks
    setCourseNo(courseNo); setSection(section); setYear(year); setSemaster(semaster);
    console.log(details)
  }, [location, details]);


  // handle Microsoft Excel file (.xlsx)
  function getResults(list, keys) {
    // list is array of dictionary, keys is array
    const results_list = []
    for (let i in list) {
      let obj = {}
      for ( let j in keys) {
        obj[keys[j]] = list[i][j] 
      }
      results_list[i] = obj
    }
    return results_list
  }

  function getAvg(list, keys) {
    // list is array of dictionary, keys is array
    var sum = 0;
    if ( keys[0] === 'student_code' && keys[1] === 'point' && keys[2] === 'comment' ) {
      // this is single scores
      for (let i in list) { sum += list[i]['point'] }
      const avg = sum / ( list.length );
      return avg.toFixed(2)  
    } else {
      // this is multiple scores
      const avg_obj = {}
      for (let i=1; i<keys.length; i++) {
        for (let j in list) { sum += list[j][keys[i]] }
        const avg = sum / ( list.length )
        avg_obj[keys[i]] = avg.toFixed(2)
      }
      return avg_obj
    }
  }

  const handleFileMultiple = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const resultsData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: ""
    });
    const keys = resultsData.shift()
    setFileName(file.name)  // set for showing status
    var full_score = 0
    var results = {}
    var avg = 0
    if ( keys[0] === 'student_code' && keys[1] === 'point' && keys[2] === 'comment' ) {
      full_score = fullScore
      results = getResults(resultsData, keys)
      avg = getAvg(results, keys)
      setDetails([
        { 
          scoreName: scoreName,
          fullScore: fullScore,
          isDisplayMean: isDisplayMean,
          studentNumber: resultsData.length,
          note: note,
          mean: avg,
          results: results
        }
      ])
    } else {
      full_score = resultsData.pop()
      full_score[0] = 'full_score'  // set keys into first index of array
      results = getResults(resultsData, keys)
      avg = getAvg(results, keys)
      for (let i=1; i<keys.length; i++) {
        setDetails([
          ...details,
          { 
            scoreName: keys[i],
            fullScore: results[resultsData.length-1][keys[i]],
            isDisplayMean: isDisplayMean,
            studentNumber: resultsData.length,
            note: note,
            mean: avg,
            results: results
          }
        ])
      }
    }
  }

  const handleFileSingle = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const resultsData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: ""
    });
    setFileName(file.name)  // set for showing status
    const keys = resultsData.shift()
    const results = getResults(resultsData, keys)
    const avg = getAvg(results, keys)
    const studentNumber = resultsData.length
    setDetails([
      { 
        scoreName: scoreName,
        fullScore: fullScore,
        isDisplayMean: isDisplayMean,
        studentNumber: studentNumber,
        note: note,
        mean: avg,
        results: results
      }
    ])
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
  fileName!=null ? renderFile() : notYet();  // show file status


  return (
    <Container>
      <br/>
      <Header as="h2">
        React Microsoft Excel
      </Header>
      <h3>Announce Multiple Score</h3>
      <Form onSubmit={submitHandler}>
        <Form.Field>
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
          <div>
            <input type='file' name='file-multiple' onChange={(e) => handleFileMultiple(e)} />
            <label id='file-status'></label>
          </div>
        </div>
        <Form.Field>
          <label htmlFor='comment'>Note to students in section: </label>
          <input type='text' value={note} onChange={(e) => setNote(e.target.value)} placeholder='Enter comment'/>
        </Form.Field>
        <Button type='submit'>Submit</Button>
        </Form.Field>
      </Form>
      <hr/>
      <Form onSubmit={submitHandler}>
        <h3>Announce Single Score</h3>
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
          <input type='radio' id='show-mean' name='avg-score' value={isDisplayMean} onChange={()=> setIsDisplayMean(true)} />
          <label>Show mean</label>
          <input type='radio' name='avg-score' value={isDisplayMean} onChange={()=> setIsDisplayMean(false)} />
          <label>Don't show mean</label>
        </div>
        <div className='element1'>
          <label>Mean: </label>
          <label>** The system will calculate the mean value automatically.</label>
        </div>
        <div className='element1'>
          <label htmlFor='point'>Test score file: </label>
          <div>
            <input type='file' name='file-single' onChange={(e) => handleFileSingle(e)} />
            <label id='file-status'></label>
          </div>
        </div>
        <Form.Field>
          <label htmlFor='comment'>Note to students in section: </label>
          <input type='text' value={note} onChange={(e) => setNote(e.target.value)} placeholder='Enter comment'/>
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>
      <hr/>

    </Container>
  );
}

export default AddScore;
