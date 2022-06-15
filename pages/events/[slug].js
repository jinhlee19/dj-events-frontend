import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';

export default function EventPage({ evt }) {
	const router = useRouter();
	console.log(router);
	return (
		<Layout>
			<h1>{evt.name}</h1>

			<button className="btn" onClick={() => router.push('/')}>
				click
			</button>
		</Layout>
	);
}
export async function getStaticPaths() {
	const res = await fetch(`${API_URL}/api/events`);
	const events = await res.json();
	const paths = events.map(evt => ({
		params: { slug: evt.slug },
	}));
	return {
		// paths: [{ params: { id: 1 } }, { params: { id: 2 } }, { params: { id: 3 } }]
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params: { slug } }) {
	const res = await fetch(`${API_URL}/api/events/${slug}`);
	const events = await res.json();
	console.log(events);
	return {
		props: { evt: events[0] },
		revalidate: 1,
	};
}

// export async function getServerSideProps({ query: { slug } }) {
// 	const res = await fetch(`${API_URL}/api/events/${slug}`);
// 	const events = await res.json();
// 	console.log(events);
// 	return {
// 		props: { evt: events[0] },
// 	};
// }
