import { useState, useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';

function TicketDetails ({ order = {}, user = {} }) {
	let [time, setTime] = useState(0);

	let {doRequest, errors} = useRequest({
		url: '/api/payments',
		method: 'post',
		body: {
			orderId: order.id
		},
		onSuccess () {
			Router.push('/orders');
		}
	});

	async function onToken(token) {
		await doRequest({
			token: token.id
		});
	}

	useEffect(() => {
		function findTimeLeft () {
			let timeLeft = new Date(order.expiresAt) - new Date();
			timeLeft = Math.round(timeLeft / 1000);
			if (timeLeft <= 0) {
				setTime(timeLeft);
				clearInterval(timerId);
			} else {
				setTime(timeLeft);
			}
		}

		findTimeLeft();
		let timerId = setInterval(findTimeLeft, 1000);

		return () => {
			clearInterval(timerId)
		};
	}, [order]);

	if (time < 0) {
		return <div>Order Expired</div>;
	}
	return (
		<div>
			{time} seconds left to complete Payment
			<StripeCheckout
				token={onToken}
				stripeKey="pk_test_51IfimaSI8WqdBX9iKKPH4RbGWa1WSUKiWHDqXdA1qA6cg2BmH4wPSYXqlC5tgqVXbng65dJMyzuS39zQqbj6UHJV00OpXbSh3m"
				amount={order.ticket.price * 100}
				currency="INR"
				email={user.email}
			/>
			{ errors }
		</div>
	);
}

TicketDetails.getInitialProps = async (context, client, user) => {
	let { orderId } = context.query;

	let { data } = await client.get(`/api/orders/fetch-by-id/${orderId}`);

	return {
		order: data.result
	};
};

export default TicketDetails;