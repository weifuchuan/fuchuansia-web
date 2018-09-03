import React from 'react';
import loadable from 'react-loadable';
import { Spin } from 'antd';

export default function loadablezation(path: string) {
	return loadable({ 
		loader: () => import(path),
		loading: () => <Spin  />,
		delay: 300
	});
}
