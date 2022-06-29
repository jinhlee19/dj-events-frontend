import Layout from '@/components/Layout';
import EventItem from '@/components/Eventitem';
import Link from 'next/link';
import { API_URL } from '@/config/index';
const PER_PAGE = 2;

export default function EventsPage({ events }) {
	// console.log(events);
	return (
		<div>
			<Layout>
				<h1>Events</h1>
				{/* {events.length === 0 && <h3>No Events to Show</h3>} */}
				{events.map(evt => (
					<EventItem key={evt.id} evt={evt} />
				))}
			</Layout>
		</div>
	);
}
export async function getServerSideProps({ query: { page = 1 } }) {
	console.log(page);

	// calculate start page
	// page에 +를 붙임으로써 +page는 int가 된다. 또는 parseInt 등으로 변환해도 된다.
	const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

	const res = await fetch(
		`${API_URL}/api/events?sort=date%3Aasc&pagination[start]=${start}&pagination[limit]=${PER_PAGE}&populate=*`
	);
	const json = await res.json();
	const events = json.data;
	return {
		props: { events },
	};
}
