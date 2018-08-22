import * as React from 'react';
import './App.scss';
import store from './store';
import { Provider } from 'mobx-react';

const { HashRouter, Route, Control } = require('react-keeper');
const Router = HashRouter;

class App extends React.Component {
	public render() {
		return (
			<Provider store={store}>
				<Router>
					<div style={{ flex: 1, display: 'flex' }}>
						<Route
							path={'/home'}
							loadComponent={(cb: any) => import('./components/Home').then((C) => cb(C.default))}
						/>
						<Route
							path={'/project/:id>'}
							loadComponent={(cb: any) => import('./components/Project').then((C) => cb(C.default))}
						/>
						<Route
							path={'/admin'}
							loadComponent={(cb: any) => import('./components/Admin').then((C) => cb(C.default))}
						/>
					</div>
				</Router>
			</Provider>
		);
	}

	componentDidMount() {
		if (Control.path === '/') {
			Control.go('/home');
		}
	}
}

export default App;
