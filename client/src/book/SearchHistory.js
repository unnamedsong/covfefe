import React, {Component} from 'react';
import {getHistoryCreatedBy} from "../util/APIUtils";
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
      loading: false
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {

    const username = this.props.currentUser.username;

    getHistoryCreatedBy(username)
      .then(response => {
        console.log(response);

        this.setState({
          history: response
        });

      })
      .catch(error => {

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
          loading={this.state.loading}
          pagination={false}
        />
      </div>
    );
  }

}

export default SearchHistory;
