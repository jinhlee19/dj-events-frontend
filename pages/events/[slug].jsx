import Link from 'next/link';
import Image from 'next/image';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/Event.module.css';

export default function EventPage({ evt }) {
	const { name, date, time, slug, image, address, performers, description, venue } = evt.attributes;
	const imgSrc = evt.attributes.image.data.attributes.formats.medium.url;
	const deleteEvent = e => {
		console.log('delete');
	};
	return (
		<Layout>
			<div className={styles.event}>
				<div className={styles.controls}>
					<Link href={`/events/edit/{evt.id}`}>
						<a>
							<FaPencilAlt /> Edit Event
						</a>
					</Link>
					<a href="#" className={styles.delete} onClick={deleteEvent}>
						<FaTimes /> Delete Event
					</a>
				</div>
				<span>
					{new Date(date).toLocaleDateString('en-US')} at {time}
				</span>
				<h1>{name}</h1>
				{evt.attributes.image && (
					<div className={styles.img}>
						<Image src={imgSrc} width={960} height={600} alt="" />
					</div>
				)}
				<h3>Performers:</h3>
				<p>{performers}</p>
				<h3>Description:</h3>
				<p>{description}</p>
				<h3>Venue: {venue}</h3>
				<p>{address}</p>
				<Link href="/events">
					<a className={styles.back}> {'<'} Go Back</a>
				</Link>
			</div>
		</Layout>
	);
}
export async function getStaticPaths() {
	const res = await fetch(`${API_URL}/api/events`);
	const json = await res.json();
	const events = json.data;
	const paths = events.map(evt => ({
		params: { slug: evt.attributes.slug },
	}));
	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params: { slug } }) {
	const res = await fetch(`${API_URL}/api/events?populate=*&_sort=date:ASC`);
	const json = await res.json();
	const events = json.data;
	// console.log(events);
	return {
		props: { evt: events[0] },
		revalidate: 1,
	};
}

// export async function getServerSideProps({ query: { slug } }) {
// 	const res = await fetch(`${API_URL}/api/events/${slug}`);
// 	const json = await res.json();
// 	const events = json.data;
// 	console.log(events);
// 	return {
// 		props: { evt: events[0] },
// 	};
// }
