import * as React from 'react';
import './index.scss';
import { Layout, Menu, Spin } from 'antd';
import { inject, observer } from 'mobx-react';
import { Store } from '../../store';
import { observable } from 'mobx';
import loadable from 'react-loadable';
import loadablezation from '../kit';
const { Header, Footer } = Layout;

const LoadableTrainingGround = loadable({
	loader: () => import('../TrainingGround/index'),
	loading: () => <Spin />,
	delay: 300
});
const LoadableBlog = loadable({
	loader: () => import('../Blog/index'),
	loading: () => <Spin />,
	delay: 300
});

interface Props {
	store?: Store;
}

@inject('store')
@observer
export default class Home extends React.Component<Props> {
	@observable selectKey: '1' | '2' = '2';

	render() {
		return (
			<Layout style={{ width: '100%' }}>
				<Header>
					<div className="logo">
						<a href="http://fuchuansia.cn">fuchuansia.cn</a>
					</div>
					<Menu
						theme="dark"
						mode="horizontal"
						defaultSelectedKeys={[ this.selectKey ]}
						selectedKeys={[ this.selectKey ]}
						style={{ lineHeight: '64px' }}
						onSelect={(params) => (this.selectKey = params.key as any)}
					>
						<Menu.Item key="1">训练场</Menu.Item>
						<Menu.Item key="2">博客</Menu.Item>
					</Menu>
				</Header>
				{this.selectKey === '1' ? <LoadableTrainingGround /> : <LoadableBlog />}
			</Layout>
		);
	}
}
