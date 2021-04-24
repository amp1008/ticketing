import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

let CreateTicket = () => {
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState(0);
	const { doRequest, errors } = useRequest({
		url: '/api/tickets/create',
		method: 'post',
		body: {
			title,
			price
		},
		onSuccess: (ticket) => {
			setTitle('');
			setPrice(0);
			Router.push('/');
		}
	});

	function submitTicketForm (e) {
		e.preventDefault();
		doRequest();
	}

	function onBlur () {
		let value = parseInt(price);
		if (isNaN(value)) {
			return;
		}
		setPrice(value);
	}

	return (
		<div>
			<h3>Create a Ticket</h3>
			<form onSubmit={submitTicketForm}>
				<div className="form-group">
					<label>Title</label>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="form-control" />
				</div>

				<div className="form-group">
					<label>Price</label>
					<input
						type="number"
						value={price}
						onBlur={onBlur}
						onChange={(e) => setPrice(e.target.value)}
						className="form-control" />
				</div>

				{ errors }

				<button className="btn btn-primary">Submit</button>
			</form>
		</div>
	);
};

export default CreateTicket;