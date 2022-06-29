import Layout from '@/components/Layout';
import EventItem from '@/components/Eventitem';
import Link from 'next/link';
import { API_URL } from '@/config/index';

const PER_PAGE = 4;

export default function EventsPage({ events, page, total }) {
	// console.log(events);
	const lastPage = Math.ceil(total / PER_PAGE);
	return (
		<div>
			<Layout>
				<h1>Events</h1>
				{/* {events.length === 0 && <h3>No Events to Show</h3>} */}
				{events.map(evt => (
					<EventItem key={evt.id} evt={evt} />
				))}
				{page > 1 && (
					<Link href={`/events?page=${page - 1}`}>
						<a className="btn-secondary">Prev</a>
					</Link>
				)}

				{page < lastPage && (
					<Link href={`/events?page=${page + 1}`}>
						<a className="btn-secondary" style={{ float: 'right' }}>
							Next
						</a>
					</Link>
				)}
			</Layout>
		</div>
	);
}

// ------------------------  Lecture  ------------------------
export async function getServerSideProps({ query: { page = 1 } }) {
	// Calculate start page
	// page에 +를 붙임으로써 +page는 int가 된다. 또는 parseInt 등으로 변환해도 된다.
	const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

	// Fetch total/count
	const totalRes = await fetch(
		//TODO
		// `${API_URL}/api/events?populate=*&_sort=date:ASC&?filters[_limit][$eq]=${PER_PAGE}`
		`${API_URL}/api/events?pagination[page]=${page}&pagination[pageSize]=${PER_PAGE}&populate=*`
	);
	// const totalJson = await totalRes.json();
	// const total = totalJson.data;
	const totalData = await totalRes.json();
	const total = totalData.meta.pagination.total;
	console.log(total);
	// Fetch Events
	const eventRes = await fetch(
		`${API_URL}/api/events?sort=date%3Aasc&pagination[start]=${start}&pagination[limit]=${PER_PAGE}&populate=*`
	);
	const json = await eventRes.json();
	const events = json.data;

	return {
		// props: { events, page: +page, total },
		props: { events, page: +page, total },
	};
}

// ------------------------  Lecture Answer # 2  ------------------------

// export async function getServerSideProps({ query: { page = 1 } }) {
// 	const start = parseInt(page) === 1 ? 0 : (parseInt(page) - 1) * PER_PAGE;

// 	// Fetch Events
// 	const res = await fetch(
// 		`${API_URL}/api/events?sort=date%3Aasc&pagination[start]=${start}&pagination[limit]=${PER_PAGE}&populate=*`
// 	);

// 	const events = await res.json();

// 	return {
// 		props: {
// 			events: events.data,
// 			page: parseInt(page),
// 			total: events.meta.pagination.total,
// 		},
// 	};
// }

// ------------------------  LPagination Step 1 by Lecture  ------------------------

// export async function getServerSideProps({ query: { page = 1 } }) {
// 	console.log(page);

// 	// calculate start page
// 	// page에 +를 붙임으로써 +page는 int가 된다. 또는 parseInt 등으로 변환해도 된다.
// 	const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

// 	const res = await fetch(
// 		`${API_URL}/api/events?sort=date%3Aasc&pagination[start]=${start}&pagination[limit]=${PER_PAGE}&populate=*`
// 	);
// 	const json = await res.json();
// 	const events = json.data;
// 	return {
// 		props: { events },
// 	};
// }
