function ListOrders ({ orders }) {
	return (
		<ul>
			{orders.map((order) => {
				return <li key={order.id}>{order.ticket.title} - {order.status} </li>
			})}
		</ul>
	);
}

ListOrders.getInitialProps = async function (context, client, user) {
	try {
		let { data } = await client.get('/api/orders/fetch') || {};
		return {
			orders: data.result || []
		};
	} catch (error) {
		console.error(error);
		return {};
	}
};

export default ListOrders;