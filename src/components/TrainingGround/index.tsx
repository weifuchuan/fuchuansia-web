import * as React from 'react';
import './index.scss';
import { Layout, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { Store } from '../../store';
import ProjectComp from './ProjectComp';
const { Content, Footer } = Layout;
const { Control } = require('react-keeper');

interface Props {
	store?: Store;
}

@inject('store')
@observer
export default class TrainingGround extends React.Component<Props> {
	render() {
		return (
			<React.Fragment>
				<Content style={{ padding: '0 50px' }}>
					<div className="TrainingGroundContent">
						<div>
							<div>
								{this.props.store!.projects.map((p, i) => (
									<ProjectComp
										key={i}
										project={p}
										index={i}
										onClick={() => {
											Control.go(`/project/${p._id}`);
										}}
									/>
								))}
							</div>
						</div>
					</div>
				</Content>
				<Footer style={{ textAlign: 'center' }}>fuchuansia.cn ©2018 Created by fuchuan</Footer>
			</React.Fragment>
		);
	}

	componentDidMount() {
		this.props.store!.fetchProjects().catch((err) => message.error(err.toString()));
	}
}
