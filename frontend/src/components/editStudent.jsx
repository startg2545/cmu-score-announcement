import React, { useState, useEffect } from 'react'
import editStu from './css/editStudent.module.css';
import { Table, Input } from "@mantine/core";
import { getStudentScores, putStudentGrade } from '../services';

const EditStudent = () => {
    const [data, setData] = useState([])
    const [point, setPoint] = useState(0)
    const [studentId, setStudentId] = useState(0)
    const [isOpeningForm, setIsOpeningForm] = useState(false)
    
    const columnNames = ['Number', 
    'Student Number',
    'Note',
    'Management'
    ]

    const editObj = JSON.parse(localStorage.getItem("Edit"))

    useEffect(()=>{
        const showData = async () => {
            const resp =  await getStudentScores(editObj);
            console.log(resp)
            setData(resp)
        }
        if (!data.length) showData()
    }, [editObj, data])

    const th = columnNames.map((element, key) => (
        <th key={key}>
            <center>{element}</center>
        </th>
    ))

    const td = data.map((element, key) => (
        <tr key={key}>
            <td>
                <center>{key+1}</center>
            </td>
            <td>
                <center>{element.studentId}</center>
            </td>
            <td>
                <center>{element.point}</center>
            </td>
            <td>
                <center><label onClick={()=>{
                    setIsOpeningForm(true)
                    setStudentId(element.studentId)
                }}>Edit</label></center>
            </td>
        </tr>
    ))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsOpeningForm(false)
        console.log("This student's point has been updated to", point)
        let send_obj = {
            studentId: studentId,
            courseNo: editObj.courseNo,
            semester: editObj.semester,
            section: editObj.section,
            year: editObj.year,
            scoreName: editObj.scoreName,
            point: parseInt(point)
        }
        console.log('send', send_obj)
        const resp = await putStudentGrade(send_obj);
        if (resp) console.log('receive', resp)
    }

    const editForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div>
                    <h1>You're editing score name: <b>{editObj.scoreName}</b></h1>
                </div>
                <label>Point</label>
                <Input type='text' onChange={e=>setPoint(e.target.value)} placeholder="Type student's point here."/>
                <div>
                    <button type='submit'>Save</button>
                </div>
            </form>
        )
    }

    return (
        <div className={editStu.editStudentFrameWindow}>
        <Table>
            <thead>
                <tr>
                    {th}
                </tr>
            </thead>
            <tbody>{td}</tbody>
        </Table>
        {isOpeningForm ? editForm() : null }
        </div>
    )
}

export default EditStudent
