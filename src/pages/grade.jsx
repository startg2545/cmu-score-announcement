import { useState, useEffect } from 'react';
import { Button, Form, Container, Header, Table } from 'semantic-ui-react'
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios'

function Grade() {
  const [name, setName] = useState('');
  const [student_code, setStudentCode] = useState('');
  const [point, setPoint] = useState('');
  const [comment, setComment] = useState('');
  const [data, setData] = useState(null);

  const location = useLocation()

  const userData = {
    name,
    student_code,
    point,
    comment
  }

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(name, student_code, point, comment)

    axios.post('https://sheet.best/api/sheets/535b6a05-91e4-4634-9ab4-c41b72e796bc', userData) 
        .then(res => {
          console.log(res);
          alert('Data inserted successfully');
          window.location.reload();
        })
    setName('');
    setStudentCode('');
    setPoint('');
    setComment('');
  }

  useEffect(() => {
    axios.get('https://sheet.best/api/sheets/535b6a05-91e4-4634-9ab4-c41b72e796bc')
        .then(res => setData(res));
    let year = location.search.split('&')[0].split('=')[1]
    let semaster = location.search.split('&')[1].split('=')[1]
    let courseNo = location.search.split('&')[2].split('=')[1]
    console.log(`year ${year}`)
    console.log(`semaster ${semaster}`)
    console.log(`courseNo ${courseNo}`)
  }, []);

  if (!data) {
    return <div />;
  }

  console.log(data);

  return (
    <Container className="container">
      <br/>
      <Header as="h2">
        React Google Sheets
      </Header>
      <Form onSubmit={submitHandler} className='form'>
        <Form.Field>
          <label htmlFor='name'>Name</label>
          <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter name'/>
        </Form.Field>
        <Form.Field>
          <label htmlFor='student_code'>Student Code</label>
          <input type='text' value={student_code} onChange={(e) => setStudentCode(e.target.value)} placeholder='Enter student code'/>
        </Form.Field>
        <Form.Field>
          <label htmlFor='point'>Point</label>
          <input type='text' value={point} onChange={(e) => setPoint(e.target.value)} placeholder='Enter point'/>
        </Form.Field>
        <Form.Field>
          <label htmlFor='comment'>Comment</label>
          <input type='text' value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Enter comment'/>
        </Form.Field>
        <Button color='green' type='submit'>Submit</Button>
      </Form>

      <hr />

      <Table celled>
        <Table.Header>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Student Code</Table.HeaderCell>
          <Table.HeaderCell>Point</Table.HeaderCell>
          <Table.HeaderCell>Comment</Table.HeaderCell>
        </Table.Header>
      </Table>
      <Table.Body>
        {data.data.map((val, idx) => (
          <Table.Row key={idx}>
            <Table.Cell>{val.name}</Table.Cell>
            <Table.Cell>{val.student_code}</Table.Cell>
            <Table.Cell>{val.point}</Table.Cell>
            <Table.Cell>{val.comment}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>

    </Container>
  );
}

export default Grade;
