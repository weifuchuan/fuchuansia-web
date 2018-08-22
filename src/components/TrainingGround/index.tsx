import * as React from 'react';
import './index.scss';
import { Layout } from 'antd';
import { inject, observer } from 'mobx-react';
import { Store } from 'src/store';
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
		);
	}
}
