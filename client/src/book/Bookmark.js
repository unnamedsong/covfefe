import React, {Component} from 'react';
import {deleteBookmark, getUserCreatedBookmark} from "../util/APIUtils";
import {withRouter} from "react-router-dom";
import {Button, message, Table} from 'antd';
import './Bookmark.css'

class Bookmark extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      pagination: {},
      loading: false,
      columns: [{
        title: 'Thumbnail',
        dataIndex: 'book.thumbnail',
        render: x => <img src={x} alt={'thumbnail'}/>,
      }, {
        title: '제목',
        dataIndex: 'book.title',
        sorter: true,
      }, {
        title: '지은이',
        dataIndex: 'book.authors',
        sorter: true,
        width: '20%'
      }, {
        title: '출판사',
        dataIndex: 'book.publisher',
        sorter: true
      }, {
        title: 'ISBN',
        dataIndex: 'book.isbn',
        sorter: true,
        width: '15%'
      }, {
        title: '생성일',
        dataIndex: 'creationDateTime',
        sorter: true,
        width: '20%'
      }, {
        title: '삭제',
        key: 'action',
        render: (record) => (
          <Button shape="circle" icon="delete" onClick={() => this.removeBookmark(record.id)}/>
        )
      }]
    };

  }

  success(msg) {
    message.success(msg);
  }

  handleTableChange(pagination, filters, sorter) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;

    this.setState({
      pagination: pager,
    });

    console.log('pagination: ', pagination);
    console.log('sorter: ', sorter);

    // TODO: sorting error
    let sorter_field;
    if (this.isEmpty(sorter)) {

    } else {
      sorter_field = sorter.field && sorter.field.split('.')[1];
    }


    const sorter_order = sorter.order === 'ascend' ? 'asc' : 'desc';

    const username = this.props.currentUser.username;

    // Spring 에선 page가 index 0부터 시작하므로 1을 빼준다
    this.loadBookmarks(username, (pagination.current - 1), pagination.pageSize, sorter_field, sorter_order);

  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }


  componentDidMount() {
    const username = this.props.currentUser.username;
    this.loadBookmarks(username, 0, 10, 'id', 'desc');
  }

  removeBookmark(book_id) {

    const username = this.props.currentUser.username;
    deleteBookmark(username, book_id)
      .then(response => {
        if (response.success) {
          this.success('Bookmark Deleted Successfully');
        }
        // reload data
        this.loadBookmarks(username, 0, 10, 'id', 'desc');
      })
      .catch(error => {
        console.log(error);
      });

  }

  loadBookmarks(username, page, size, sortField, sortOrder) {

    getUserCreatedBookmark(username, page, size, sortField, sortOrder)
      .then(response => {
        const pagination = {...this.state.pagination};
        // Read total count from server
        pagination.total = response.totalElements;
        this.setState({
          loading: false,
          data: response.content,
          pagination,
        });
      }).catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="bookmark-container">
        <Table
          columns={this.state.columns}
          rowKey={record => record.id}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange.bind(this)}
        />
      </div>
    );
  }

}

export default withRouter(Bookmark);
