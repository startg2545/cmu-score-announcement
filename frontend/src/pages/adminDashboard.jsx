import React, { useState, useEffect, useContext } from "react";
import { TextInput, Button } from "@mantine/core";
import { addCurrent, getCurrent, deleteCurrent } from "../services";
import { CurrentContext } from "../context";

const AdminDashboard = () => {
  const { current, setCurrent } = useContext(CurrentContext);
  const [semester, setSemester] = useState(0);
  const [year, setYear] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resp_add = await addCurrent({
      semester,
      year,
    });
    console.log("send", resp_add);

    fetchData();

    document.getElementById("form").reset();
  };

  const fetchData = async () => {
    const resp = await getCurrent();
    setCurrent(resp);
  };

  useEffect(() => {
    const fetchData = async () => {
      const resp = await getCurrent();
      console.log(resp);
      setCurrent(resp);
    };
    fetchData();
  }, [setCurrent]);

  const handleDelete = async (_id) => {
    console.log("send", _id);
    const resp = await deleteCurrent({
      _id: _id,
    });
    console.log("receive", resp);

    fetchData();
  };

  const showCurrent = current.map((element, key) => {
    return (
      <label key={key}>
        <div>
          {element.semester}/{element.year}
          <button
            style={{ color: "red" }}
            onClick={() => handleDelete(element._id)}
          >
            <b>Delete</b>
          </button>
        </div>
      </label>
    );
  });

  return (
    <>
      <h1 style={{ paddingTop: "10%", fontSize: "30px" }}>
        This is admin Dashboard
      </h1>
      <b>Semester currently in active</b>
      {showCurrent}
      <form onSubmit={handleSubmit} id="form">
        <b>Add new semester and year</b>
        <div>
          <label>Semester</label>
          <TextInput
            type="text"
            placeholder="Add Semester"
            onChange={(e) => setSemester(e.target.value)}
          />
        </div>
        <div>
          <label>Year</label>
          <TextInput
            type="text"
            placeholder="Add Year"
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <Button type="submit" style={{ backgroundColor: "black" }}>
          Confirm
        </Button>
      </form>
    </>
  );
};

export default AdminDashboard;
