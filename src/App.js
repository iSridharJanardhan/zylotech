import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task_name: "",
      task_desc: "",
      date: Math.floor(Date() / 1000),
      time: new Date().getTime(),
      tasklist: []
    };
    this.myRef = React.createRef();
    this.handleChangedate = this.handleChangedate.bind(this);
    this.handleChangetime = this.handleChangetime.bind(this);
    this.eventnamehandleChange = this.eventnamehandleChange.bind(this);
    this.eventdescriptionhandleChange = this.eventdescriptionhandleChange.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const response = await axios.get("http://localhost:4000/events");
    this.setState({ tasklist: response.data.zylotech.reverse() });
  }

  handleChangedate(date) {
    console.log(date);
    this.setState({
      date: date
    });
  }

  handleChangetime(date) {
    console.log(date);
    this.setState({
      time: date.getTime()
    });
  }

  eventnamehandleChange(event) {
    this.setState({ task_name: event.target.value });
  }

  eventdescriptionhandleChange(event) {
    this.setState({ task_desc: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    var data = {
      task_name: this.state.task_name,
      task_desc: this.state.task_desc,
      date: this.state.date,
      time: this.state.time
    };

    console.log(data);
    axios({
      method: "post",
      url: "http://localhost:4000/events/add",
      data: data,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(function(response) {
        //handle success
        console.log(response);
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });

    window.location.reload();
  }

  handleClick = async () => {
    const response = await axios.get("http://localhost:4000/events");
    this.setState({
      tasklist: response.data.zylotech.sort((a, b) => {
        var c = new Date(a.date);
        var d = new Date(b.date);
        return c - d;
      })
    });
    var arr = this.state.tasklist;
    this.setState({ tasklist: arr.slice(0, 3) });
  };

  handleClickall = async () => {
    const response = await axios.get("http://localhost:4000/events");
    this.setState({ tasklist: response.data.zylotech });
  };

  render() {
    const data = this.state.tasklist;

    return (
      <Router>
        <div className="App">
          {/* Navbar */}
          <nav class="uk-navbar-container" uk-navbar="true">
            <div class="uk-navbar-left">
              <ul class="uk-navbar-nav">
                <li class="uk-active">
                  <a href="#">Zylotech</a>
                </li>
              </ul>
            </div>
          </nav>

          {/*Main Container of the Page*/}

          <div class="uk-child-width-expand@s uk-text-center" uk-grid="true">
            {/*The Container that takes input*/}

            <div>
              <div class="uk-card uk-card-default uk-card-body">
                <h2>Enter Details Here</h2>
                {/*Input Forms*/}

                <form onSubmit={this.handleSubmit}>
                  <div class="uk-margin">
                    <input
                      class="uk-input"
                      type="text"
                      placeholder="Enter Task Name"
                      value={this.state.task_name}
                      onChange={this.eventnamehandleChange}
                    />
                  </div>

                  <div class="uk-margin">
                    <input
                      class="uk-input"
                      type="text"
                      placeholder="Enter Task Description"
                      value={this.state.task_desc}
                      onChange={this.eventdescriptionhandleChange}
                    />
                  </div>

                  <div uk-grid="true">
                    <div>
                      <h3>Date</h3>
                    </div>
                    <div>
                      <DatePicker
                        selected={this.state.date}
                        onChange={this.handleChangedate}
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  </div>

                  <div uk-grid="true">
                    <div>
                      <h3>Time</h3>
                    </div>
                    <div>
                      <DatePicker
                        selected={this.state.time}
                        onChange={this.handleChangetime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        dateFormat="h:mm aa"
                        timeCaption="Time"
                      />
                    </div>
                  </div>
                  {/*Submit Button*/}
                  <input
                    class="uk-button uk-button-primary"
                    type="submit"
                    value="Submit"
                  />
                </form>
                {/*Input forms ends here */}
              </div>
            </div>
            {/*The task list COntainer*/}

            <div>
              <div class="uk-card uk-card-default uk-card-body">
                <h2>Total Tasks : {this.state.tasklist.length}</h2>
                <div
                  class="uk-child-width-expand@s uk-text-center"
                  uk-grid="true"
                >
                  <div>
                    <input
                      class="uk-button uk-button-primary"
                      type="submit"
                      value="Upcoming"
                      onClick={this.handleClick}
                    />
                  </div>
                  <div>
                    <input
                      class="uk-button uk-button-primary"
                      type="submit"
                      value="All"
                      onClick={this.handleClickall}
                    />
                  </div>
                </div>
                <div>
                  <table ref={this.myRef} class="uk-table uk-table-divider">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "center" }}>Task Name</th>
                        <th style={{ textAlign: "center" }}>Task Date</th>
                        <th style={{ textAlign: "center" }}>Task Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map(item => {
                        return (
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              {item.task_name}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {moment(item.date).format("DD-MM-YYYY")}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {" "}
                              {new Date(parseInt(item.time)).getHours()}:
                              {new Date(parseInt(item.time)).getMinutes()}{" "}
                              {new Date(parseInt(item.time)).getHours() >= 12
                                ? "PM"
                                : "AM"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
  scrollToMyRef = () => window.scrollTo(0, this.myRef.offsetTop);
}

export default App;
