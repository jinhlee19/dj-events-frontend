import Link from 'next/link';
import Image from 'next/image';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/Event.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

export default function EventPage({ evt }) {
	const router = useRouter();
	const { name, date, time, image, address, performers, description, venue } = evt.attributes;
	// console.log(evt.attributes.image.data.attributes.formats.medium.url);
	const deleteEvent = async e => {
		if (confirm('are you sure?')) {
			const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
				method: 'DELETE',
			});
			// const res2 = await fetch(`${API_URL}/upload/files/${evt.image.id}`, {
			// 	method: 'DELETE',
			// });
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.message);
			} else {
				router.push('/events');
			}
		}
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
				<ToastContainer />
				{evt.attributes.image ? (
					<div className={styles.img}>
						<Image src={image.data.attributes.formats.medium.url} width={960} height={600} alt="" />
					</div>
				) : (
					<div>No image</div>
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
	const res = await fetch(`${API_URL}/api/events?populate=*`);
	const json = await res.json();
	const events = json.data;
	return {
		props: { evt: events[0] },
		// props: { evt: events.attributes.slug },
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
