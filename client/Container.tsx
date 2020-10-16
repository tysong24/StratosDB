import React, { Component, SyntheticEvent } from "react";
import Announcement from "./components/Announcement";
import CodeEditor from "./components/CodeEditor";
import Sidebar from "./components/Sidebar";
import LineGraph from "./components/LineGraph";
import axios from "axios";

interface ContainerState {
  queries: any;
  queryStatistics: number[];
  queryEntry: any;
  //Announcement
  announcement: string;
  //codeEditorState
  schemaEntry: string;
  onClose: any;
  schemaName: string;
  //sideBar
  url: string;
  modalIsOpen: boolean;
  awsInfo: {
    user: string;
    host: string;
    database: string;
    password: string;
    port: string;
  };
}

class Container extends Component<{}, ContainerState> {
  constructor(props: {}) {
    super(props);

    this.schemaChange = this.schemaChange.bind(this);
    this.schemaSubmit = this.schemaSubmit.bind(this);
    this.queryChange = this.queryChange.bind(this);
    this.querySubmit = this.querySubmit.bind(this);
    this.refresh = this.refresh.bind(this);
    this.connect = this.connect.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.awsInfoChange = this.awsInfoChange.bind(this);
  }

  state: ContainerState = {
    queries: [],
    queryStatistics: [],
    queryEntry: "",
    announcement: "Welcome to StratosDB",
    schemaEntry: "",
    onClose: true,
    schemaName: "",
    url: "",
    modalIsOpen: false,
    awsInfo: {
      user: "",
      host: "",
      database: "",
      password: "",
      port: "",
    },
  };

  componentDidMount() {

    console.log("component mounted");
    console.log("before axios");
    axios
      .get("/refresh")
      .then((result) => console.log(result))
      .catch((err) => console.error(err));
  }

  // UPDATING SCHEMA STATE DURING TYPING
  schemaChange(event: string) {
    console.log("EVENT: ", event);
    this.setState({
      schemaEntry: event,
    });
  }

  // SUBMITTING SCHEMA CODE TO BACKEND
  schemaSubmit(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();

    console.log("state.queries before axios: ", this.state);

    const schemaObj: any = {
      schemaEntry: this.state.schemaEntry,
    };
    console.log("queryData", schemaObj);
    axios.post("/newSchema", schemaObj).then((data) => {
      console.log("explain data", data.data[0]);
      this.setState({ queries: data.data[0] });
      console.log("state after axios: ", this.state);
    });
  }

  // UPDATING QUERY STATE WHILE TYPING
  queryChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    console.log("EVENT: ", event.target.value);
    this.setState({
      queryEntry: event.target.value,
    });
  }

  // SUBMITTING QUERY SEARCH TO BACKEND
  querySubmit(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();

    console.log("state.queries before axios: ", this.state);

    // DIFFERENT OBJECT FOR QUERY ENTRY
    const queryObj: any = {
      queryEntry: this.state.queryEntry,
    };
    console.log("queryData", queryObj);
    axios.post("/results", queryObj).then((data) => {
      console.log("explain data", data.data[0]);
      this.setState({ queries: data.data[0] });
      console.log('state after axios: ', this.state);
      console.log('exec time', this.state.queries['Execution Time']);
      this.state.queryStatistics.push(this.state.queries['Execution Time']);
      console.log('BOOM', this.state.queryStatistics);
    });
  }

  // ESTABLISH CLOUD CONNECTION FUNCTION
  connect(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    console.log("in connect");
    // ADD THE PROPERTIES IN THE FORM INTO STATE BY USING SETSTATE
    console.log("state aws info: ", this.state.awsInfo);
    let info = this.state.awsInfo;
    // REMEMBER TO CHANGE THIS INTO A POST REQUEST ONCE WE GET THE ROUTE WORKING
    axios
      .post("/connect", info)
      .then(() => console.log("Success"))
      .catch((err) => console.log("There has been an error: ", err));

    // CLOSING MODAL
    this.setState({ modalIsOpen: false });
  }

  // SHOW POPUP CLOUD MODAL
  openModal: any = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  // CHANGING AWSINFO STATE
  awsInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    let newAWS: any = { ...this.state.awsInfo };
    newAWS[id] = value;
    this.setState({ awsInfo: newAWS });
  }

  // possibly needs component did update
  refresh(event: React.ChangeEvent<HTMLSelectElement>) {
    event.preventDefault();
    window.location.reload(false);
    console.log("refreshing");
  }

  render() {
    return (
      <div id="main-container">
        <div id="left-panel">
          <Sidebar
            url={this.state.url}
            refresh={this.refresh}
            connect={this.connect}
            modalIsOpen={this.state.modalIsOpen}
            openModal={this.openModal}
            closeModal={this.closeModal}
            awsInfo={this.state.awsInfo}
            awsInfoChange={this.awsInfoChange}
          />
        </div>
        <div id="right-panel">
          <Announcement announcement={this.state.announcement} />
          <div id="main-feature">
            <CodeEditor
              schemaEntry={this.state.schemaEntry}
              data={this.state.queries}
              onClose={this.state.onClose}
              schemaName={this.state.schemaName}
              schemaChange={this.schemaChange}
              schemaSubmit={this.schemaSubmit}
            />
            <div id="queries-results-panel">
              <div id="query-request">
                <textarea
                  id="query-input"
                  onChange={this.queryChange}
                ></textarea>
                <button id="query-submit" onClick={this.querySubmit}>
                  Submit Query
                </button>
              </div>
              <div id="visual-data">
                <LineGraph
                  queries={this.state.queries}
                  queryStatistics={this.state.queryStatistics}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Container;
