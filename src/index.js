import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import RoutesComponent from './config/routes';

// 获取一个root container
const rootContainer = document.getElementById('app');

// 使用 createRoot 创建一个root
const root = ReactDOM.createRoot(rootContainer);

// 使用新的render方法渲染Routes
root.render(
	<StrictMode>
		<RoutesComponent />
	</StrictMode>
);
