import * as React from 'react';
import './index.scss';
import { Layout, Menu, Spin } from 'antd';
import { inject, observer } from 'mobx-react';
import { Store } from 'src/store';
import loadable from 'react-loadable';
const { Header, Footer } = Layout;

const LoadableTrainingGround = loadable({
	loader: () => import('../TrainingGround/index'),
	loading: () => <Spin />,
	delay: 300,
});

interface Props {
	store?: Store;
}

@inject('store')
@observer
export default class Home extends React.Component<Props> {
	render() {
		return (
			<Layout style={{ width: '100%' }}>
				<Header>
					<div className="logo">
						<a href="http://fuchuansia.cn">fuchuansia.cn</a>
					</div>
					<Menu theme="dark" mode="horizontal" defaultSelectedKeys={[ '1' ]} style={{ lineHeight: '64px' }}>
						<Menu.Item key="1">训练场</Menu.Item>
					</Menu>
				</Header>
				{/* <div>
					<Route
						loadComponent={(cb: any) =>
							import('src/components/TrainingGround')
								.then((C) => {
									cb(C.default);
									console.log('fuck');
								})
								.catch((err) => console.error(err))}
						path={'/home/tg'}
					/>
					<Route path={'/home/fuck'} component={() => <span>fuck</span>} />
				</div> */}
				<LoadableTrainingGround />
				<Footer style={{ textAlign: 'center' }}>fuchuansia.cn ©2018 Created by fuchuan</Footer>
			</Layout>
		);
	}

	componentDidMount() {
		// if (Control.path === '/home') Control.go('/home/tg');
	}
}
