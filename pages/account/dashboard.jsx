import { parseCookies } from '@/helpers/index';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

import { API_URL } from '@/config/index';
import styles from '@/styles/Dashboard.module.css';

// export default function DashboardPage({ events, token }) {
export default function DashboardPage({ events }) {
	console.log(events);
	const router = useRouter();
	return (
		<Layout title="User Dashboard">
			<div className={styles.dash}>
				<h1>Dashboard</h1>
				<h3>My Events</h3>
				{events.map(evt => (
					<h4 key={evt.id}>{evt.name}</h4>
				))}
				{/* {events.map(evt => (
				<DashboardEvent key={evt.id} evt={evt} handleDelete={deleteEvent} />
			))} */}
			</div>
		</Layout>
	);

	// const deleteEvent = async id => {
	// 	if (confirm('Are you sure?')) {
	// 		const res = await fetch(`${API_URL}/events/${id}`, {
	// 			method: 'DELETE',
	// 			headers: {
	// 				Authorization: `Bearer ${token}`,
	// 			},
	// 		});

	// 		const data = await res.json();

	// 		if (!res.ok) {
	// 			toast.error(data.message);
	// 		} else {
	// 			router.reload();
	// 		}
	// 	}
	// };
}

export async function getServerSideProps({ req }) {
	const { token } = parseCookies(req);
	// console.log(token);
	const res = await fetch(`${API_URL}/api/events/me`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const events = await res.json();
	console.log(events);
	return {
		props: {
			events,
			// token,
		},
	};
}
