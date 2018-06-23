import React from 'react';
import {createBookmark, searchBooks} from '../util/APIUtils';
import './Search.css';
import {Button, Divider, Form, Icon, Input, List, message, Select} from 'antd';
import {withRouter} from 'react-router-dom';
import {notification} from "antd/lib/index";
import LoadingIndicator from '../common/LoadingIndicator';

const FormItem = Form.Item;
const Option = Select.Option;

const IconText = ({type, text}) => (
  <span>
    <Icon type={type} style={{marginRight: 8}}/>
    {text}
  </span>
);

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      books: [],
      pageable_count: 0,
      total_count: 0,
      _end: true,
      target: 'all',
      query: '',
      isLoading: false
    };
  }

  success(msg) {
    message.success(msg);
  }

  //
  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSelectChange(value) {
    // console.log(`selected ${value}`);
  }

  handleSubmit(e) {

    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {

        console.log('Received values of form: ', values);

        this.setState({
          isLoading: true
        });


        const username = this.props.currentUser.username;

        searchBooks(username, values.target, values.query)
          .then(response => {

            console.log('response: ', response);

            this.setState({
              books: response.books,
              pageable_count: response.pageable_count,
              total_count: response.total_count,
              _end: response._end,
              isLoading: false
            });

          }).catch(error => {
          this.setState({
            isLoading: true
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
    });
  }

  createBookmark(book) {

    createBookmark(book)
      .then(response => {
        if (response.success) {
          this.success('Bookmark Created Successfully');
        }
      }).catch(error => {
      console.error(error);
    });

  }

  // move to util
  validateThumbnailUrl(src) {
    if (!src) {
      return 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
    }
    return src;
  }

  render() {

    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

    // Only show error after a field is touched.
    const queryError = isFieldTouched('query') && getFieldError('query');

    const searchBarView = (
      <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
        <FormItem>
          {getFieldDecorator('target', {
            rules: [{required: false}],
            initialValue: 'all'
          })(
            <Select style={{width: 120}} size="large"
                    onChange={this.handleSelectChange.bind(this)}>
              <Option value="all">전체</Option>
              <Option value="title">제목</Option>
              <Option value="isbn">ISBN</Option>
              <Option value="keyword">주제어</Option>
              <Option value="contents">목차</Option>
              <Option value="overview">책소개</Option>
              <Option value="publisher">출판사</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          validateStatus={queryError ? 'error' : ''}
          help={queryError || ''}
        >
          {getFieldDecorator('query', {
            rules: [{required: true, message: '검색어를 입력하세요!'}],
          })(
            <Input prefix={<Icon type="search" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="검색어" size="large"/>
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            disabled={this.hasErrors(getFieldsError())}>검색</Button>
        </FormItem>
      </Form>
    );

    const bookViews = (
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log('TODO: request page and size!!!!');
            console.log(page);
          },
          pageSize: 5,
        }}
        dataSource={this.state.books}
        renderItem={item => (
          <List.Item key={item.title}
                     actions={[
                       <Button shape="circle" icon="star-o" onClick={() => this.createBookmark(item)}/>,
                       <IconText type="barcode" text={item.isbn}/>
                     ]}
                     extra={<img width={99} alt="logo"
                                 src={this.validateThumbnailUrl(item.thumbnail)}/>}>
            <List.Item.Meta
              title={<a href={item.url}>{item.title}</a>}
              description={`${item.publisher} | 정가: ${item.price} | 판매가: ${item.sale_price}`}/>
            {item.contents}
          </List.Item>)}/>
    );

    return (
      <div className="books-container">
        {searchBarView}
        {
          !this.state.isLoading && this.state.books.length === 0 ? (
            <div className="no-data-found">
              <span>검색 결과가 없습니다.</span>
            </div>
          ) : null
        }
        {
          !this.state.isLoading && this.state.pageable_count > 0 ? (
            <div>
              <Divider>검색 결과</Divider>
              {bookViews}
            </div>) : null
        }
        {
          this.state.isLoading ?
            <LoadingIndicator/> : null
        }
      </div>
    );
  }
}

export default withRouter(Form.create()(Search));