import React from 'react';
import { inject, observer } from 'mobx-react';
import { observable, runInAction, IObservableValue, computed } from 'mobx';
import {
	Input,
	Tabs,
	message,
	DatePicker,
	TimePicker,
	Select
} from 'antd';
import { Button } from 'antd';
import './index.scss';
import RichEditor from './RichEditor';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { Store } from '../../store';
import { Article } from '../../store/model';

@inject('store')
@observer
export default class ArticleManager extends React.Component<{
	token: string;
	store?: Store;
}> {
	@observable title: string = '';
	@observable content: string = '';
	@observable articleClass: string = '';

	date: IObservableValue<moment.Moment> = observable.box(moment(new Date()));
	time: IObservableValue<moment.Moment> = observable.box(moment(new Date()));
	editor: RichEditor | null = null;
	@computed
	get createAt(): number {
		const date = this.date.get().toDate();
		const time = this.time.get().toDate();
		return new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			time.getHours(),
			time.getMinutes()
		).getTime();
	}

	@observable
	updateArticle: Article = {
		_id: '',
		title: '',
		createAt: 0,
		content: '',
		articleClass: ''
	};
	@observable selectedUpdateArticleClass: string = '';
	@observable selectedUpdateArticle: string = '';
	updateArticleDate: IObservableValue<moment.Moment> = observable.box(moment(new Date()));
	updateArticleTime: IObservableValue<moment.Moment> = observable.box(moment(new Date()));
	updateEditor: RichEditor | null = null;
	@computed
	get updateCreateAt(): number {
		const date = this.updateArticleDate.get().toDate();
		const time = this.updateArticleTime.get().toDate();
		return new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			time.getHours(),
			time.getMinutes()
		).getTime();
	}

	render() {
		return (
			<Tabs defaultActiveKey="ADD">
				<Tabs.TabPane tab="ADD" key="ADD">
					<div
						style={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end'
						}}
					>
						<Button type="primary" onClick={this.post}>
							POST
						</Button>
					</div>
					<Input placeholder="title" value={this.title} onInput={(e: any) => (this.title = e.target.value)} />
					<div
						style={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-start'
						}}
					>
						<DatePicker
							locale={locale}
							defaultValue={moment(this.createAt)}
							onChange={(date) => {
								this.date.set(date);
							}}
						/>
						<TimePicker
							allowEmpty={false}
							defaultValue={moment(this.createAt)}
							onChange={(date) => {
								this.time.set(date);
							}}
						/>
						<Select
							placeholder={'class'}
							style={{ width: 120 }}
							onChange={(c) => (this.articleClass = c as any)}
							value={this.articleClass}
						>
							{this.props.store!.articleClasses.map((ac) => {
								return (
									<Select.Option key={ac._id} value={ac._id}>
										{ac.name}
									</Select.Option>
								);
							})}
						</Select>
					</div>
					<div>
						<RichEditor
							height={500}
							onHTMLChange={(html) => (this.content = html)}
							token={this.props.token}
							ref={(r) => (this.editor = r)}
						/>
					</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab="UPDATE" key="UPDATE">
					<div
						style={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center'
							}}
						>
							<Select
								style={{ width: '120px' }}
								value={this.selectedUpdateArticleClass}
								onChange={(c) => (this.selectedUpdateArticleClass = c as any)}
							>
								{this.props.store!.articleClasses.map((ac) => (
									<Select.Option key={ac._id} value={ac._id}>
										{ac.name}
									</Select.Option>
								))}
							</Select>
							<Select
								style={{ width: '120px' }}
								value={this.selectedUpdateArticle}
								onChange={(c) => (this.selectedUpdateArticle = c as any)}
							>
								{this.props.store!.articleClasses.find(
									(ac) => ac._id === this.selectedUpdateArticleClass
								) ? (
									this.props.store!.articleClasses.find(
										(ac) => ac._id === this.selectedUpdateArticleClass
									)!.articles.map((a) => {
										this.props.store!.getArticleById(a);
										return <Select.Option />;
									})
								) : null}
							</Select>
						</div>
						<Button type="primary" onClick={this.update}>
							UPDATE
						</Button>
					</div>
					<Input
						placeholder="title"
						value={this.updateArticle.title}
						onInput={(e: any) => (this.updateArticle.title = e.target.value)}
					/>
					<div
						style={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-start'
						}}
					>
						<DatePicker
							locale={locale}
							value={moment(this.updateArticle.createAt)}
							onChange={(date) => {
								this.updateArticleDate.set(date);
							}}
						/>
						<TimePicker
							allowEmpty={false}
							value={moment(this.updateArticle.createAt)}
							onChange={(date) => {
								this.updateArticleTime.set(date);
							}}
						/>
						<Select
							placeholder={'class'}
							style={{ width: 120 }}
							onChange={(c) => (this.updateArticle.articleClass = c as any)}
							value={this.updateArticle.articleClass}
						>
							{this.props.store!.articleClasses.map((ac) => {
								return (
									<Select.Option key={ac._id} value={ac._id}>
										{ac.name}
									</Select.Option>
								);
							})}
						</Select>
					</div>
					<div>
						<RichEditor
							height={500}
							onHTMLChange={(html) => (this.updateArticle.content = html)}
							token={this.props.token}
							ref={(r) => (this.updateEditor = r)}
						/>
					</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab="DELETE" key="DELETE" />
			</Tabs>
		);
	}

	private post = async () => {
		try {
			const resp = await (await fetch('/article/add', {
				method: 'post',
				body: JSON.stringify({
					token: this.props.token,
					title: this.title,
					createAt: this.createAt,
					content: this.content,
					articleClass: this.articleClass
				})
			})).json();
			message.success('success');
			runInAction(() => {
				this.props.store!.articles.push(
					observable({
						_id: resp.id,
						title: this.title,
						content: this.content,
						createAt: this.createAt,
						articleClass: this.articleClass
					})
				);
				this.title = '';
				this.content = '';
				this.editor!.clear();
			});
		} catch (err) {
			message.error(err);
		}
	};

	async update() {
		try {
			this.updateArticle.createAt = this.updateCreateAt;
			message.success('success');
		} catch (err) {
			message.error(err);
		}
	}

	componentDidMount() {
		if (this.props.store!.articleClasses.length === 0) {
			this.props.store!
				.fetchArticleClasses()
				.then(() => (this.articleClass = this.props.store!.articleClasses[0]._id));
		}
	}
}
