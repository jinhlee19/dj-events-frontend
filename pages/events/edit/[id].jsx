import Layout from '@/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditEventPage({ evt, id }) {
	console.log('evt: ' + evt);
	console.log('id:' + id);

	// const [values, setValues] = useState({
	// 	name: evt.name,
	// 	performers: evt.performers,
	// 	venue: evt.venue,
	// 	address: evt.address,
	// 	date: evt.date,
	// 	time: evt.time,
	// 	description: evt.description,
	// });
	const [values, setValues] = useState({
		name: '',
		performers: '',
		venue: '',
		address: '',
		date: '',
		time: '',
		description: '',
	});
	const handleInputChange = e => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};

	const handleSubmit = async e => {
		e.preventDefault();

		//validation
		const hasEmptyField = Object.values(values).some(element => element === '');

		if (hasEmptyField) {
			toast.error('Please Fill in all the fields.');
		}

		const res = await fetch(`${API_URL}/api/events`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ data: values }),
		});

		if (!res.ok) {
			toast.error('something went wrong');
		} else {
			const evt = await res.json();
			router.push(`/events/${evt.data.attributes.slug}`);
		}
	};

	const router = useRouter();
	return (
		<Layout title="Edit New Event">
			<Link href="/events">Go Back</Link>
			<h1>Edit Event</h1>
			<ToastContainer />
			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.grid}>
					<div>
						<label htmlFor="name">Event Name</label>
						<input type="text" id="name" name="name" value={values.name} onChange={handleInputChange} />
					</div>
					<div>
						<label htmlFor="performers">Performers</label>
						<input
							type="text"
							name="performers"
							id="performers"
							value={values.performers}
							onChange={handleInputChange}
						/>
					</div>
					<div>
						<label htmlFor="venue">Venue</label>
						<input type="text" name="venue" id="venue" value={values.venue} onChange={handleInputChange} />
					</div>
					<div>
						<label htmlFor="address">Address</label>
						<input type="text" name="address" id="address" value={values.address} onChange={handleInputChange} />
					</div>
					<div>
						<label htmlFor="date">Date</label>
						<input type="date" name="date" id="date" value={values.date} onChange={handleInputChange} />
					</div>
					<div>
						<label htmlFor="time">Time</label>
						<input type="text" name="time" id="time" value={values.time} onChange={handleInputChange} />
					</div>
				</div>
				<div>
					<label htmlFor="description">Event Description</label>
					<textarea
						type="text"
						name="description"
						id="description"
						value={values.description}
						onChange={handleInputChange}
					></textarea>
				</div>
				<input type="submit" value="Update Event" className="btn" />
			</form>
		</Layout>
	);
}

export async function getServerSideProps({ params: { id } }) {
	// const res = await fetch(`${API_URL}/api/events/${id}?populate=*`);
	const res = await fetch(`${API_URL}/api/events?filters[id]id=${id}&populate=*`);
	const json = await res.json();
	const evt = json.data;

	return {
		props: {
			id,
			evt,
		},
	};
}

// export async function getStaticPaths() {
// 	const res = await fetch(`${API_URL}/api/events/edit?populate=*`);
// 	const json = await res.json();
// 	const events = json.data;
// 	const paths = events.map(evt => ({
// 		params: { id: `${evt.id}` }, // id must be passed as a String
// 	}));
// 	return {
// 		paths,
// 		fallback: true, // false points to 404
// 	};
// }
// export async function getStaticProps(
// 	// params coming from getStaticPaths
// 	{ params: { id } }
// ) {
// 	// Strapi v3:: const res = await fetch(`${API_URL}/api/events/${id}`);
// 	const res = await fetch(`${API_URL}/api/events?filters[id]id=${id}&populate=*`);
// 	const json = await res.json();
// 	const events = await json.data;
// 	return {
// 		props: { evt: events[0] },
// 		revalidate: 1,
// 	};
// }
