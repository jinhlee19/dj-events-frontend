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
					<Link href={`/events/edit/${evt.id}`}>
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
				{evt.attributes.image.data ? (
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
// export async function getStaticPaths() {
// 	const res = await fetch(`${API_URL}/api/events`);
// 	const json = await res.json();
// 	const events = json.data;
// 	const paths = events.map(evt => ({
// 		params: { slug: evt.attributes.slug },
// 	}));
// 	return {
// 		paths,
// 		fallback: false,
// 	};
// }

// export async function getStaticProps({ params: { slug } }) {
// 	const res = await fetch(`${API_URL}/api/events?filters[${slug}][$eq]populate=*`);
// 	const json = await res.json();
// 	const events = json.data;
// 	return {
// 		props: { evt: events[0] },
// 		revalidate: 1,
// 	};
// }

export async function getStaticPaths() {
	const res = await fetch(`${API_URL}/api/events?populate=*`);
	const json = await res.json();
	const events = json.data;

	// TODO: 왜 이 부분에서 MAP으로 뿌리는건지? 해당 슬러그페이지 아닌가? getStaticPaths는 한페이지 해당이 아닌 전체 슬러그를 어떻게 뿌릴건지 결정하는건가??
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
	// TODO: getStaticPaths에서 얼만큼의 데이터를 가져오는걸까?
	{ params: { slug } }
) {
	// Strapi v3:: const res = await fetch(`${API_URL}/api/events/${slug}`);
	const res = await fetch(`${API_URL}/api/events?filters[slug]slug=${slug}&populate=*`);
	const json = await res.json();
	const events = await json.data;
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
