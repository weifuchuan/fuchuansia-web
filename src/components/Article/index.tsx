import * as React from 'react';
import { Store, Article, ArticleClass } from '../../store';
import { Project as ProjectModel } from '../../store';
import './index.scss';
import { inject, observer } from 'mobx-react';
import { Layout, Breadcrumb, Spin } from 'antd';
import { observable, action } from 'mobx';
import moment from 'moment';
require('moment/locale/zh-cn');
moment.locale('zh-cn');
const { Control, Link } = require('react-keeper');

interface Props {
	store?: Store;
	params: {
		id: string;
	};
}

@inject('store')
@observer
export default class Art extends React.Component<Props> {
	@observable
	private article: Article = {
		_id: '',
		title: '',
		createAt: 0,
		content: '',
		articleClass: ''
	};
	@observable
	private ac: ArticleClass = {
		_id: '',
		name: '',
		profile: '',
		articles: []
	};
	@observable loading: boolean = false;

	render() {
		const article: Article = this.article;
		const ac = this.ac;
		return (
			<React.Fragment>
				<div className="article">
					<div>
						<div>
							<div>
								<Breadcrumb style={{ padding: '30px 0' }} separator={'＞'}>
									<Breadcrumb.Item>
										<Link to={'/home'}>博客</Link>
									</Breadcrumb.Item>
									<Breadcrumb.Item>
										<Link to={'/home'}>{ac.name}</Link>
									</Breadcrumb.Item>
									<Breadcrumb.Item>
										<Link to={`/article/${article._id}`}>
											{article.title.length > 20 ? (
												article.title.slice(0, 20) + '...'
											) : (
												article.title
											)}
										</Link>
									</Breadcrumb.Item>
								</Breadcrumb>
								<h1 className={'title'}>{article.title}</h1>
								<div className={'create-at'}>
									<span>{moment(article.createAt).format('YYYY-MM-DD a h:mm')}</span>
								</div>
								<div className={'content'}>
									<div dangerouslySetInnerHTML={{ __html: article.content }} />
								</div>
							</div>
						</div>
					</div>
				</div>
				{this.loading ? (
					<div
						style={{
							position: 'fixed',
							top: 0,
							left: 0,
							height: '100vh',
							width: '100vw',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							zIndex: 100
						}}
					>
						<Spin size={'large'} />
					</div>
				) : null}
			</React.Fragment>
		);
	}

	componentDidMount() {
		const id = this.props.params.id;
		this.loading = true;
		this.props.store!.getArticleById(id).then(
			action((a: Article) => {
				this.article = observable(a);
				const ac = this.props.store!.articleClasses.find((ac) => ac._id === a.articleClass);
				if (ac) {
					this.ac = observable(ac);
				} else {
					this.props.store!.fetchArticleClasses().then(() => {
						const ac = observable(this.props.store!.articleClasses.find((ac) => ac._id === a.articleClass)!);
						if (ac) {
							this.ac = observable(ac);
						} else {
							this.ac.name = "not exists"
						}
					});
				}
				this.loading = false;
			})
		);
	}
}
