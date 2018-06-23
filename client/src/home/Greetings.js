import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import './Greetings.css';

class Greetings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="greetings-container">
          <h1>TODO: greetings</h1>
        </div>
    );
  }
}

export default withRouter(Greetings);