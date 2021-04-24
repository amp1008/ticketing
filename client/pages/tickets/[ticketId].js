import useRequest from '../../hooks/use-request';
import Router from 'next/router';

function TicketDetails ({ ticket }) {
	let { doRequest, errors } = useRequest({
		url: '/api/orders/create',
		method: 'post',
		body: {
			ticketId: ticket.id
		},
		onSuccess: (order) => {
			let orderId = order.result && order.result.id;
			Router.push(`/orders/[orderId]`, `/orders/${orderId}`);
		}
	});

	return (
		<div>
			<h2>{ ticket.title }</h2>
			<h4>
				Price: { ticket.price }
			</h4>
			<h4>
				Status: { ticket.orderId ? 'Not Available' : 'Available' }
			</h4>
			{ errors }
			{!ticket.orderId && <button onClick={() => doRequest()} className="btn btn-primary">Purchase</button>}
		</div>
	);
}

TicketDetails.getInitialProps = async (context, client, user) => {
	let { ticketId } = context.query;

	let { data } = await client.get(`/api/tickets/fetch-by-id/${ticketId}`);

	return {
		ticket: data.result
	};
};

export default TicketDetails;