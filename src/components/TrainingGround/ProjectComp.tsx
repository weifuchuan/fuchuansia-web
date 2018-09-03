import * as React from 'react';
import { observer } from 'mobx-react';
import { Project } from '../../store';
import './ProjectComp.scss';

interface Props {
	project: Project;
	index: number;
	onClick: (index: number) => void; 
}

@observer
export default class ProjectComp extends React.Component<Props> {
	render() {
		return (
			<div
				className={`ProjectComp`}
				onClick={() => this.props.onClick(this.props.index)}
			>
				<div>
					<img src={this.props.project.icon} alt={this.props.project.name} />
				</div>
				<div>
					<div>{this.props.project.name}</div>
					<div dangerouslySetInnerHTML={{__html:this.props.project.profile}} />
				</div>
			</div>
		);
	}
}
