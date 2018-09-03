import * as React from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';
import { uploadMedia } from 'src/kit';

export default class RichEditor extends React.Component<{
	height: number;
	onHTMLChange: (html: string) => void;
	token: string;
}> {
	editor: any = null;
	render() {
		return (
			<BraftEditor
				height={this.props.height}
				placeholder="content"
				onHTMLChange={this.props.onHTMLChange}
				ref={(r: BraftEditor | null) => (this.editor = r)}
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
							const uri = await uploadMedia(params.file, this.props.token);
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
		);
	}

	setHtmlContent(html: string) {
		this.editor && this.editor.setContent(html, 'html');
	}

	clear() {
		this.editor && this.editor.clear();
	}
}
