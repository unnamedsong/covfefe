import React, {Component} from 'react';
import {getHistoryCreatedBy} from "../util/APIUtils";
import {notification} from "antd/lib/index";
import './SearchHistory.css';
import {Alert, Table} from 'antd';

const columns = [{
  title: '검색어',
  dataIndex: 'keyword',
  width: '80%'
}, {
  title: '검색일',
  dataIndex: 'createdAt',
  width: '20%'
}];

class SearchHistory extends Component {

  constructor(props) {
    super(props);

    this.state = {
      history: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {

    const username = this.props.currentUser.username;

    getHistoryCreatedBy(username)
      .then(response => {
        this.setState({
          history: response,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
        if (error.status === 401) {
          this.props.handleLogout('/login', 'error', 'You have been logged out. Please Login to continue!');
        } else {
          notification.error({
            message: 'Covfefe',
            description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
        }
      });
  }

  render() {
    return (
      <div className="history-container">
        <Alert message="검색결과는 최근 50개까지만 보여집니다." type="info" showIcon/>
        <Table
          columns={columns}
          rowKey={record => record.id}
          dataSource={this.state.history}
          loading={this.state.isLoading}
          pagination={false}
        />
      </div>
    );
  }

}

export default SearchHistory;
