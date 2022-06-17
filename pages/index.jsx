import Layout from '@/components/Layout';
import Link from 'next/link';
import EventItem from '@/components/Eventitem';
import { API_URL } from '@/config/index';

export default function HomePage({ events }) {
	return (
		<div>
			<Layout>
				<h1>Upcoming Events</h1>
				{events.length === 0 && <h3>No Events to Show</h3>}
				{events.map(evt => (
					<EventItem key={evt.id} evt={evt} />
				))}
				{events.length > 0 && (
					<Link href="/events">
						<a className="btn-secondary">View All Events</a>
					</Link>
				)}
			</Layout>
		</div>
	);
}
export async function getServerSideProps() {
	const res = await fetch(`${API_URL}/api/events?populate=*`);
	const json = await res.json();
	const events = json.data;

	return {
		props: { events },
	};
}

// export async function getStaticProps() {
// 	const res = await fetch(`${API_URL}/api/events`);
// 	const events = await res.json();
// 	console.log(events);
// 	return {
// 		props: { events },
// 		revalidate: 1,
// 	};
// }
