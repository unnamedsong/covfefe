import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import './Greetings.css';

class Greetings extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const jumbotron = (
      <div className="jumbotron">
        <h1>Covfefe Application</h1>
        <p>카카오 책검색 오픈 API를 이용하여 책의 정보를 얻을 수 있는 책 검색 웹 서비스</p>
      </div>
    );
    return (
      <div className="greetings-container">
        {jumbotron}
      </div>
    );
  }
}

export default withRouter(Greetings);