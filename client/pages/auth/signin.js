import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

export default () => {
	let [email, setEmail] = useState('');
	let [password, setPassword] = useState('');
	let { doRequest, errors } = useRequest({
		url: '/api/users/signin',
		method: 'post',
		body: {
			email,
			password
		},
		onSuccess: () => {
			Router.push('/');
		}
	});

	async function submitForm (e) {
		e.preventDefault();
		await doRequest();
	}

	return (
		<form onSubmit={submitForm} className="p-4">
			<h1>Sign In</h1>
			<div className="form-group">
				<label>Email Address</label>
				<input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="form-control" />
			</div>

			<div className="form-group">
				<label>Password</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="form-control" />
			</div>

			{ errors }

			<button className="btn btn-primary">Sign In</button>
		</form>
	);
}