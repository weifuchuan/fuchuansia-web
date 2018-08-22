import React, { FormEvent } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, action, runInAction } from 'mobx';
import { Input, Layout, Menu, Tabs, Icon, Upload, Spin, message } from 'antd';
import { Button } from 'antd';
import './index.scss';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { RcFile } from 'antd/lib/upload/interface';

@inject('store')
@observer
export default class Admin extends React.Component {
	@observable authed: boolean = false;
	@observable token: string = '';
	@observable name: string = '';
	@observable icon: string = '';
	@observable profileHtml: string = '';
	@observable detailHtml: string = '';
	@observable updating: boolean = false;
	detailEditor: BraftEditor | null = null;
	profileEditor: BraftEditor | null = null;

	render() {
		if (this.authed) {
			return (
				<Layout>
					<Layout.Sider>
						<Menu theme="dark" defaultSelectedKeys={[ 'projects' ]}>
							<Menu.Item key="projects">projects</Menu.Item>
						</Menu>
					</Layout.Sider>
					<Layout.Content>
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
													const uri = await this.uploadMedia(file);
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
								<Input
									placeholder={'name'}
									value={this.name}
									onInput={(e: any) => (this.name = e.target.value)}
								/>
								<div>
									<BraftEditor
										height={150}
										controls={[
											'bold',
											'italic',
											'underline',
											'link',
											'strike-through',
											'code',
											'superscript',
											'split',
											'headings',
											'list_ul',
											'list_ol',
											'split',
											'emoji',
											'media'
										]}
										placeholder="profile"
										onHTMLChange={action((html: string) => {
											this.profileHtml = html;
										})}
										ref={(r: BraftEditor | null) => (this.profileEditor = r)}
										media={{
											allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
											image: true, // 开启图片插入功能
											video: true, // 开启视频插入功能
											audio: true, // 开启音频插入功能
											validateFn: (file: File) => {
												return file.size < 1024 * 1024 * 40;
											}, // 指定本地校验函数，说明见下文
											uploadFn: async (params: {
												file: File;
												progress: (progress: number) => void; // progress为0到100
												libraryId: string;
												success: (
													param: {
														url: string;
														meta?: {
															id?: string;
															title?: string;
															alt?: string;
															loop?: boolean; // 指定音视频是否循环播放
															autoPlay?: boolean; // 指定音视频是否自动播放
															controls?: boolean; // 指定音视频是否显示控制栏
															poster?: string; // 指定视频播放器的封面
														};
													}
												) => void; // res须为一个包含已上传文件url属性的对象：
												error: (err: any) => void;
											}) => {
												try {
													const uri = await this.uploadMedia(params.file);
													params.success({
														url: uri,
														meta: {
															loop: false,
															autoPlay: false,
															controls: true
														}
													});
												} catch (err) {
													params.error(err);
												}
											}, // 指定上传函数，说明见下文
											removeConfirmFn: null, // 指定删除前的确认函数，说明见下文
											onRemove: null, // 指定媒体库文件被删除时的回调，参数为被删除的媒体文件列表(数组)
											onChange: null, // 指定媒体库文件列表发生变化时的回调，参数为媒体库文件列表(数组)
											onInsert: null // 指定从媒体库插入文件到编辑器时的回调，参数为被插入的媒体文件列表(数组)
										}}
									/>
								</div>
								<div>
									<BraftEditor
										height={300}
										controls={[
											'bold',
											'italic',
											'underline',
											'link',
											'strike-through',
											'code',
											'superscript',
											'split',
											'headings',
											'list_ul',
											'list_ol',
											'split',
											'emoji',
											'media'
										]}
										placeholder="detail"
										onHTMLChange={action((html: string) => {
											this.detailHtml = html;
										})}
										ref={(r: BraftEditor | null) => (this.detailEditor = r)}
										media={{
											allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
											image: true, // 开启图片插入功能
											video: true, // 开启视频插入功能
											audio: true, // 开启音频插入功能
											validateFn: (file: File) => {
												return file.size < 1024 * 1024 * 40;
											}, // 指定本地校验函数，说明见下文
											uploadFn: async (params: {
												file: File;
												progress: (progress: number) => void; // progress为0到100
												libraryId: string;
												success: (
													param: {
														url: string;
														meta?: {
															id?: string;
															title?: string;
															alt?: string;
															loop?: boolean; // 指定音视频是否循环播放
															autoPlay?: boolean; // 指定音视频是否自动播放
															controls?: boolean; // 指定音视频是否显示控制栏
															poster?: string; // 指定视频播放器的封面
														};
													}
												) => void; // res须为一个包含已上传文件url属性的对象：
												error: (err: any) => void;
											}) => {
												try {
													const uri = await this.uploadMedia(params.file);
													params.success({
														url: uri,
														meta: {
															loop: false,
															autoPlay: false,
															controls: true
														}
													});
												} catch (err) {
													params.error(err);
												}
											}, // 指定上传函数，说明见下文
											removeConfirmFn: null, // 指定删除前的确认函数，说明见下文
											onRemove: null, // 指定媒体库文件被删除时的回调，参数为被删除的媒体文件列表(数组)
											onChange: null, // 指定媒体库文件列表发生变化时的回调，参数为媒体库文件列表(数组)
											onInsert: null // 指定从媒体库插入文件到编辑器时的回调，参数为被插入的媒体文件列表(数组)
										}}
									/>
								</div>
							</Tabs.TabPane>
							<Tabs.TabPane tab="UPDATE" key="UPDATE" />
							<Tabs.TabPane tab="DELETE" key="DELETE" />
						</Tabs>
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

	private uploadMedia = async (file: File): Promise<string> => {
		let data = new FormData();
		data.append('file', file);
		data.append('token', this.token);
		const resp = await fetch('/media-upload', { method: 'post', body: data });
		return await resp.text();
	};

	private post = async () => {
		try {
			const resp = await (await fetch('/project/add', {
				method: 'post',
				body: JSON.stringify({
					token: this.token,
					name: this.name,
					icon: this.icon,
					profile: this.profileHtml,
					detail: this.detailHtml
				})
			})).json();
			if (resp.result === 'ok') {
				message.success('success');
				runInAction(() => {
					this.name = '';
					this.icon = '';
					this.profileHtml = '';
					this.detailHtml = '';
				});
			} else {
				throw 'error';
			}
		} catch (err) {
			message.error(err);
		}
	};
}

/*
async authUploadFiles(files: { [name: string]: File }): Promise<MediaUploadResp> {
		let data = new FormData();
		for (let name in files) {
			data.append(name, files[name]);
		}
		const headers = new Headers();
		const token = await db.getItem(tokenKey);
		if (!token) {
			throw 'no token';
		}
		headers.append('Authorization', `Bearer ${token}`);
		const resp = await fetch('/media/upload', {
			body: data,
			method: 'post',
			headers
		});
		let json: Resp = await resp.json();
		if (json.code === code.noAuth) {
			await refreshToken();
			const headers = new Headers();
			const token = await db.getItem(tokenKey);
			if (!token) {
				throw 'no token';
			}
			headers.append('Authorization', `Bearer ${token}`);
			const resp = await fetch('/media/upload', {
				body: data,
				method: 'post',
				headers
			});
			return (await resp.json()) as MediaUploadResp;
		}
		return json as any;
	}
*/
