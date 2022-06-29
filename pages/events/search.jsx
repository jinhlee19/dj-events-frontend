import Layout from '@/components/Layout';
import Link from 'next/link';
import EventItem from '@/components/Eventitem';
import { API_URL } from '@/config/index';

export default function SearchPage({ events, term }) {
	return (
		<div>
			<Layout title="Search Results}">
				<Link href="/">
					<a> {'<'} Go Back </a>
				</Link>
				<h1>Search Results for {term}</h1>
				{events.length === 0 && <h3>No Events to Show</h3>}
				{events.map(evt => (
					<EventItem key={evt.id} evt={evt} />
				))}
			</Layout>
		</div>
	);
}

export async function getServerSideProps({ query: { term } }) {
	const qs = require('qs');
	const query = qs.stringify(
		{
			filters: {
				$or: [
					{ name: { $containsi: term } },
					{ performers: { $containsi: term } },
					{ description: { $containsi: term } },
					{ venue: { $containsi: term } },
				],
			},
		},
		{
			encode: false,
		}
	);

	const res = await fetch(`${API_URL}/api/events?${query}&populate=*`);
	const json = await res.json();
	const events = json.data;
	return {
		props: { events, term },
	};
}
