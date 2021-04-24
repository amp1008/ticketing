import axios from 'axios';
import React, { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
	let [errors, setErrors] = useState(null);

	async function doRequest (props = {}) {
		try {
			setErrors(null);
			let response = await axios[method](url, {
				...body,
				...props
			});

			if (onSuccess) {
				return onSuccess(response.data);
			}
			return response.data;
		} catch (error) {
			console.error(error);
			let validationErrors = (error.response.data && error.response.data.errors) || [];
			setErrors(
				<div className="alert alert-danger">
					<h5>Validation Errors</h5>
					<ul className="">
						{validationErrors.map((err) => {
							return <li key={err.message}>{err.message}</li>
						})}
					</ul>
				</div>
			);
		}
	}

	return {
		doRequest,
		errors
	};
}