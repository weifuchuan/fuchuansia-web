import React from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';
import { Input, Layout, Menu, Tabs, Icon, Upload, Spin, message, InputNumber } from 'antd';
import { Button } from 'antd';
import './index.scss';
import { RcFile } from 'antd/lib/upload/interface';
import RichEditor from './RichEditor';
import { uploadMedia } from 'src/kit';
import { Store } from '../../store';

@inject('store')
@observer
export default class ArticleClassManager extends React.Component<{
	token: string;
	store?: Store;
}> {
	@observable private name: string = '';
	@observable private profile: string = '';
	@observable private order: number = 0;

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
						<Button
							type="primary"
							onClick={this.post}
							disabled={this.name.trim() === '' || this.profile.trim() === ''}
						>
							POST
						</Button>
					</div>
					<Input placeholder={'name'} value={this.name} onInput={(e: any) => (this.name = e.target.value)} />
					<Input
						placeholder={'profile'}
						value={this.profile}
						onInput={(e: any) => (this.profile = e.target.value)}
					/>
					<InputNumber
						placeholder="order"
						value={this.order}
						onChange={(v) => (this.order = Number.parseInt(v as any))}
					/>
				</Tabs.TabPane>
				<Tabs.TabPane tab="UPDATE" key="UPDATE" />
				<Tabs.TabPane tab="DELETE" key="DELETE" />
			</Tabs>
		);
	}

	private post = async () => {
		try {
			const resp = await (await fetch('/article-class/add', {
				method: 'post',
				body: JSON.stringify({
					token: this.props.token,
					name: this.name,
					profile: this.profile,
					order: this.order
				})
			})).json();
			message.success('success');
			runInAction(() => {
				this.props.store!.articleClasses.push(
					observable({
						_id: resp.id,
						name: this.name,
						profile: this.profile,
						articles: [],
						order: this.order
					})
				);
				this.name = '';
				this.profile = '';
				this.order = 0;
			});
		} catch (err) {
			message.error(err);
		}
	};
}
