import Link from 'next/link';
import Router from 'next/router';

function LandingPage ({ user, tickets = [] }) {
	let rows = tickets.map((ticket) => {
		return (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>{ticket.price}</td>
				<td>{ticket.orderId ? 'Unavailable' : 'Available'}</td>
				<td>
					<Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
						<a>View</a>
					</Link>
				</td>
			</tr>
		);
	});

	function showCreateTicketForm (event) {
		event.preventDefault();
		Router.push('/tickets/create');
	}

	return (
		<div>
			<div className="d-flex flex-row justify-content-between pb-2 align-items-center">
				<h3>Ticket List</h3>
			</div>

			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
						<th>Status</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{ rows }
				</tbody>
			</table>
		</div>
	);
}

/* Invoking getInitialProps on individual component */
LandingPage.getInitialProps = async (context, client, user) => {
	try {
		let { data } = await client.get('/api/tickets/fetch') || {};
		return {
			tickets: data.result || []
		};
	} catch (error) {
		console.error(error);
		return {};
	}
};

export default LandingPage;