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
export default class ProjectManager extends React.Component<{
	token: string;
	store?: Store;
}> {
	@observable name: string = '';
	@observable icon: string = '';
	@observable order: number = 0;
	@observable profileHtml: string = '';
	@observable detailHtml: string = '';
	@observable updating: boolean = false;
	detailEditor: RichEditor | null = null;
	profileEditor: RichEditor | null = null;

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
					<div style={{ display: 'flex', alignItems: 'center', margin: '0 0 8px' }}>
						<span>ICON：</span>
						<Upload
							accept={'image/*'}
							name="file"
							showUploadList={false}
							beforeUpload={(file: RcFile, FileList: RcFile[]): boolean => {
								this.updating = true;
								(async () => {
									try {
										const uri = await uploadMedia(file, this.props.token);
										this.icon = uri;
									} catch (err) {
										message.error(err);
									}
									this.updating = false;
								})();
								return false;
							}}
						>
							<Button>
								<Icon type="upload" /> Click to Upload
							</Button>
						</Upload>
						<span>{this.icon}</span>
						<Spin spinning={this.updating} />
					</div>
					<Input placeholder={'name'} value={this.name} onInput={(e: any) => (this.name = e.target.value)} />
					<InputNumber
						placeholder={'order'}
						defaultValue={0}
						onChange={(e: any) => {
							this.order = Number.parseInt(e.target.value);
						}}
					/>
					<div>
						<RichEditor
							height={150}
							onHTMLChange={action((html: string) => {
								this.profileHtml = html;
							})}
							token={this.props.token}
							ref={(r) => (this.profileEditor = r)}
						/>
					</div>
					<div>
						<RichEditor
							height={300}
							onHTMLChange={action((html: string) => {
								this.detailHtml = html;
							})}
							token={this.props.token}
							ref={(r) => (this.detailEditor = r)}
						/>
					</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab="UPDATE" key="UPDATE" />
				<Tabs.TabPane tab="DELETE" key="DELETE" />
			</Tabs>
		);
	}

	private post = async () => {
		try {
			const resp = await (await fetch('/project/add', {
				method: 'post',
				body: JSON.stringify({
					token: this.props.token,
					name: this.name,
					icon: this.icon,
					profile: this.profileHtml,
					detail: this.detailHtml,
					order: this.order
				})
			})).json();
			if (resp.result === 'ok') {
				message.success('success');
				runInAction(() => {
					this.name = '';
					this.icon = '';
					this.profileHtml = '';
					this.detailHtml = '';
					this.detailEditor!.clear();
					this.profileEditor!.clear();
					this.props.store!.projects.push(observable({
						_id: resp.id,
						icon: this.icon,
						name: this.name,
						profile: this.profileHtml,
						detail: this.detailHtml
					}));
				});
			} else {
				throw 'error';
			}
		} catch (err) {
			message.error(err);
		}
	};
}
