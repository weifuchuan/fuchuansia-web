import * as React from 'react';
import './index.scss';
import { Layout, Menu, Icon, message, List, Spin } from 'antd';
import { inject, observer } from 'mobx-react';
import { Store } from '../../store';
import { observable, action } from 'mobx';
import { SelectParam } from 'antd/lib/menu';
import moment from 'moment';
import ReactDOM from 'react-dom';
require('moment/locale/zh-cn');
moment.locale('zh-cn');
const { Control } = require('react-keeper');
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

interface Props {
	store?: Store;
}

@inject('store')
@observer
export default class TrainingGround extends React.Component<Props> {
	@observable private collapsed: boolean = false;
	@action
	private onCollapse = () => {
		this.collapsed = !this.collapsed;
	};

	@observable private selectedClassId: string = '';
	@action
	private onSelectClass = async (params: SelectParam) => {
		this.selectedClassId = params.key;
		await this.props.store!
			.fetchArticleBaseInfo(
				this.props.store!.articleClasses.find((ac) => ac._id === this.selectedClassId)!.articles
			)
			.then(() => {
				this.forceUpdate();
			});
	};

	render() {
		let articleList = null;
		const ac = this.props.store!.articleClasses.find((ac) => ac._id === this.selectedClassId);
		if (ac) {
			articleList = (
				<List
					dataSource={ac.articles}
					renderItem={(id: string) => {
						const article = this.props.store!.articles.find((a) => a._id === id);
						if (article)
							return (
								<List.Item
									className={'Article'}
									ref={(r) => {
										if (r)
											(ReactDOM.findDOMNode(r)! as HTMLElement).onclick = (e) => {
												Control.go(`/article/${article._id}`);
											};
									}}
								>
									<List.Item.Meta
										title={article.title}
										description={moment(article.createAt).format('YYYY年MM月DD日 a h:mm ')}
									/>
								</List.Item>
							);
						else return <Spin size="large" />;
					}}
				/>
			);
		}

		const article = this.props.store!.articleClasses.find((ac) => ac._id === this.selectedClassId);

		return (
			<Content className="Content">
				<Layout className="Layout">
					<Sider trigger={null} collapsible collapsed={this.collapsed} collapsedWidth={0}>
						<Menu
							theme="dark"
							mode="inline"
							selectedKeys={this.selectedClassId ? [ this.selectedClassId ] : []}
							onSelect={this.onSelectClass}
						>
							{this.props.store!.articleClasses.map((cls) => {
								return (
									<Menu.Item key={cls._id}>
										<span>
											{cls.name}（{cls.articles.length}）
										</span>
									</Menu.Item>
								);
							})}
						</Menu>
					</Sider>
					<Layout>
						<Header style={{ background: '#f0f2f5', padding: 0 }}>
							<Icon
								className="trigger"
								type={this.collapsed ? 'menu-unfold' : 'menu-fold'}
								onClick={this.onCollapse}
							/>
							<span className="Name">{article ? article.name : null}</span>
							<span className="Profile">{article ? article.profile : null}</span>
						</Header>
						<Content
							style={{ margin: '0', padding: 24, background: '#fff', minHeight: 280, overflow: 'auto' }}
						>
							{articleList}
						</Content>
					</Layout>
				</Layout>
			</Content>
		);
	}

	componentDidMount() {
		this.props.store!
			.fetchArticleClasses()
			.then(() => {
				this.onSelectClass({ key: this.props.store!.articleClasses[0]._id } as any);
			})
			.catch((err) => message.error(err.toString()));
	}
}
