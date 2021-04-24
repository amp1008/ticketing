import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import Header from '../components/header';

import buildClient from '../api/build-client';

function AppComponent ({ Component, pageProps, user }) {
	let newProps = {
		...pageProps,
		user
	};
	return (
		<div>
			<Header user={user} />
			<div className="container">
				<Component {...newProps} />
			</div>
		</div>
	);
}

AppComponent.getInitialProps = async (appContext) => {
	try {
		let client = buildClient(appContext.ctx);
		let { data } = await client.get('/api/users/current-user');

		let pageProps = {};
		/* Executing initial props method of the individual component,
		as this method is not getting invoked from the component */
		console.log(appContext.Component);
		if (appContext.Component && appContext.Component.getInitialProps) {
			pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.user);
		}

		return {
			pageProps,
			user: data.user
		};
	} catch (error) {
		console.error(error);
		return {};
	}
};

export default AppComponent;