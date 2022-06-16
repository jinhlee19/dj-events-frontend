# Snippet

```jsx
// nil
import Link from 'next/link';
// nir
import Router from 'next/router';
// niur
import { useRouter } from 'next/router';
// nih
import Head from 'next/head';
// nf
export default function () {
	return <div>Enter</div>;
}
// nuur
const router = useRouter();
```

The API endpoints change when switching to Strapi v4:

GET all events:

${API_URL}/api/events?populate=\*`
GET single event:

${API_URL}/api/events?filters[slug]slug=${slug}&populate=_
example : http://localhost:1337/api/events?filters[slug]slug=encore-night-boat-party&populate=_

/pages/index.js

```jsx
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import Link from 'next/link';
import EventItem from './../components/EventItem';

export default function HomePage({ events }) {
	console.log(events);
	return (
		<Layout>
			<h1>Upcoming Events</h1>
			{events.length === 0 && <h3>No events yet</h3>}
			{events.map(evt => (
				<EventItem key={evt.id} evt={evt} />
			))}
			{events.length > 0 && (
				<Link href="/events">
					<a className={'btn-secondary'}>View All Events</a>
				</Link>
			)}
		</Layout>
	);
}

export async function getStaticProps() {
	const res = await fetch(`${API_URL}/api/events?populate=*&_sort=date:ASC&_limit=3`);
	const json = await res.json();
	const events = json.data;
	// console.log(events.data);

	return {
		props: { events },
		revalidate: 1, // seconds to ckeck if data changes on getStaticProps
	};
}
```

```jsx
/pages/events/index.js

import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import EventItem from "@/components/EventItem";

export default function EventsPage({ events }) {
// console.log(events);
return (
<Layout>
<h1>Events</h1>
{events.length === 0 && <h3>No events yet</h3>}
{events.map((evt) => (
<EventItem key={evt.id} evt={evt} />
))}
</Layout>
);
}

export async function getStaticProps() {
const res = await fetch(`${API_URL}/api/events?populate=*&_sort=date:ASC`);
const eventsData = await res.json();
const events = eventsData.data;

return {
props: { events },
revalidate: 1, // seconds to ckeck if data changes on getStaticProps
};
}
```

/components/EventItem.js

```jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/Image';
import styles from '@/styles/EventItem.module.css';

export default function EventItem({ evt }) {
	const { attributes } = evt;
	// console.log(attributes);
	return (
		<div className={styles.event}>
			<div className={styles.img}>
				<Image
					src={attributes.image ? attributes.image.data.attributes.formats.thumbnail.url : '/images/event-default.png'}
					width="170"
					height="100"
				/>
			</div>
			<div className={styles.info}>
				<span>
					{new Date(attributes.date).toLocaleDateString('en-US')} @ {attributes.time}
				</span>
				<h3>{attributes.name}</h3>
			</div>
			<div className={styles.link}>
				<Link href={`/events/${attributes.slug}`}>
					<a className={'btn'}>Details</a>
				</Link>
			</div>
		</div>
	);
}
```

/pages/events/[slug].js

```jsx
import React from 'react';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/Event.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';

export default function EventPage({ evt }) {
	const deleteEvent = () => {
		console.log('delete');
	};

	console.log(evt);
	if (evt !== undefined) {
		const { attributes } = evt;
		console.log(attributes);
		return (
			<Layout>
				<div className={styles.event}>
					<div className={styles.controls}>
						<Link href={`/events/edit/${evt.id}`}>
							<a>
								<FaPencilAlt />
								Edit event
							</a>
						</Link>
						<a className={styles.delete} onClick={deleteEvent}>
							<FaTimes /> Delete Event
						</a>
					</div>
					<span>
						{new Date(attributes.date).toLocaleDateString('en-US')} at {attributes.time}
					</span>
					<h1>{attributes.name}</h1>
					{/_ {evt.image && ( _/}
					<div className={styles.image}>
						<Image src={attributes.image.data.attributes.formats.medium.url} width={960} height={600} />
					</div>
					{/_ )} _/}
					<h3>Performers: </h3>
					<p>{attributes.performers}</p>
					<h3>Description: </h3>
					<p>{attributes.description}</p>
					<h3>Venue: {attributes.venue}</h3>
					<p>{attributes.address}</p>

					<Link href="/events">
						<a className={styles.back}>{'<'} Go back</a>
					</Link>
				</div>
			</Layout>
		);
	}
}

export async function getStaticPaths() {
	const res = await fetch(`${API_URL}/api/events?populate=*`);
	const eventsData = await res.json();
	const events = eventsData.data;
	const paths = events.map(evt => ({
		params: { slug: `${evt.slug}` }, // slug must be passed as a String
	}));
	return {
		paths,
		fallback: true, // false points to 404
	};
}

export async function getStaticProps(
	// params coming from getStaticPaths
	{ params: { slug } }
) {
	// const res = await fetch(`${API_URL}/api/events/${slug}`);
	const res = await fetch(`${API_URL}/api/events?filters[slug]slug=${slug}&populate=*`);
	const eventsData = await res.json();
	const events = await eventsData.data;
	return {
		props: { evt: events[0] },
		revalidate: 1,
	};
}

// export async function getServerSideProps({ query: { slug } }) {
// const res = await fetch(`${API_URL}/api/events/${slug}`);
// const events = await res.json();
// return {
// props: { evt: events[0] },
// };
// }
```
