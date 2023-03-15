import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

export default function CModal(props) {
	let bodyStyle = props.bodyStyle;
	let style = props.style;
	let width = props.width;

	if (props.allowFullScreen) {
		bodyStyle = { height: 'calc(100vh - 102px)', overflow: 'scroll' };
		style = { top: 0, height: '100vh' };
		width = '100%';
	}

	return (
		<Modal
			closable={false}
			{...props}
			// title={<span style={{ color: '#dfe6e9' }}>{props.title}</span>}
			title={props.title}
			destroyOnClose={true}
			bodyStyle={bodyStyle}
			style={style}
			width={width}
		>
			{props.children}
		</Modal>
	);
}

CModal.propTypes = {
	...Modal.propTypes,
	allowFullScreen: PropTypes.bool,
};

CModal.defaultProps = {
	allowFullScreen: false,
};
