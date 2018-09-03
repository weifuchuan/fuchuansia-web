import React from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';
import { Input, Layout, Menu, Tabs, Icon, Upload, Spin, message, InputNumber } from 'antd';
import { Button } from 'antd';
import './index.scss';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { RcFile } from 'antd/lib/upload/interface';
import ProjectManager from './ProjectManager';
import ArticleManager from './ArticleManager';
import ArticleClassManager from './ArticleClassManager';

@inject('store')
@observer
export default class Admin extends React.Component {
	@observable authed: boolean = false;
	@observable token: string = '';
	@observable selectedKey = 'projects';

	render() {
		if (this.authed) {
			return (
				<Layout>
					<Layout.Sider>
						<Menu
							theme="dark"
							selectedKeys={[ this.selectedKey ]}
							onSelect={(params) => (this.selectedKey = params.key)}
						>
							<Menu.Item key="projects">projects</Menu.Item>
							<Menu.Item key="articles">articles</Menu.Item>
							<Menu.Item key="article-classes">article classes</Menu.Item>
						</Menu>
					</Layout.Sider>
					<Layout.Content>
						{this.selectedKey === 'projects' ? (
							<ProjectManager token={this.token} />
						) : this.selectedKey === 'articles' ? (
							<ArticleManager token={this.token} />
						) : this.selectedKey === 'article-classes' ? (
							<ArticleClassManager token={this.token} />
						) : null}
					</Layout.Content>
				</Layout>
			);
		} else {
			return (
				<div className={'Auth'}>
					<div>
						<Input onInput={this.onTokenInput} />
						<Button style={{ marginTop: '0.5em', width: '100%' }} type="primary" onClick={this.auth}>
							GO
						</Button>
					</div>
				</div>
			);
		}
	}

	@action
	private onTokenInput = (event: any) => {
		this.token = event.target.value;
	};
	private auth = async (e: React.MouseEvent<HTMLButtonElement>) => {
		try {
			const resp = await (await fetch('/auth', {
				method: 'POST',
				body: JSON.stringify({ token: this.token })
			})).json();
			if (resp.result === 'ok') {
				this.authed = true;
			} else {
				throw 'error';
			}
		} catch (err) {
			message.error(err);
		}
	};
}
