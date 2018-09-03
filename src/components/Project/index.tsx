import * as React from 'react';
import { Store } from '../../store';
import { Project as ProjectModel } from '../../store';
import './index.scss';
import { inject, observer } from 'mobx-react';
import { Layout } from 'antd';
const { Control } = require('react-keeper');

interface Props {
	store?: Store;
	params: {
		id: string;
	};
}

@inject('store')
@observer
export default class Project extends React.Component<Props> {
	render() {
		const project: ProjectModel = this.props.store!.projects.find((p) => p._id === this.props.params.id)!;
		return (
			<Layout className="Project">
				<Layout.Header className="ProjectHeader">
					<div className="logo">
						<a href="http://fuchuansia.cn">fuchuansia.cn</a>
					</div>
					<div className="ProjectName">
						<span>PROJECT：</span>
						<span>{project.name}</span>
					</div>
				</Layout.Header>
				<Layout.Content className={'ProjectContent'}>
					<div className="ProjectProfile">
						<img src={project.icon} alt={project.name} />
						<div dangerouslySetInnerHTML={{ __html: project.profile}} />
					</div>
					<div className="ProjectDetail">
						<div dangerouslySetInnerHTML={{ __html: project.detail }} />
					</div>
				</Layout.Content>
			</Layout>
		);
	}
}
