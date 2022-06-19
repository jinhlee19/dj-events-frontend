import Layout from '@/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDateForInput } from '@/utils/formatDate';
import { FaImage } from 'react-icons/fa';
import Modal from '@/components/Modal';
import ImageUpload from '@/components/ImageUpload';

export default function EditEventPage({ evt }) {
	const { name, performers, image, venue, address, date, time, description, slug } = evt.attributes;

	const [values, setValues] = useState({
		name: name,
		performers: performers,
		venue: venue,
		address: address,
		date: formatDateForInput(date),
		time: time,
		description: description,
	});

	const [imagePreview, setImagePreview] = useState(image.data ? image.data.attributes.formats.thumbnail.url : null);

	const [showModal, setShowModal] = useState(false);
	// console.log(evt);

	const handleInputChange = e => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};

	const imageUploaded = e => {
		console.log('upload');
	};

	const handleSubmit = async e => {
		e.preventDefault();

		//validation
		const hasEmptyField = Object.values(values).some(element => element === '');

		if (hasEmptyField) {
			toast.error('Please Fill in all the fields.');
		}

		const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
			method: 'PUT',
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
			<h2> Event Image </h2>

			{imagePreview ? (
				<Image src={imagePreview} height={100} width={170} />
			) : (
				<div>
					<p>No Image</p>
				</div>
			)}
			<div>
				{' '}
				<button onClick={() => setShowModal(true)} className="btn-secondary">
					<FaImage /> Set Image
				</button>
			</div>
			<Modal show={showModal} onClose={() => setShowModal(false)}>
				{' '}
				<ImageUpload evtId={evt.id} imageUploaded={imageUploaded} />
			</Modal>
		</Layout>
	);
}

export async function getServerSideProps({ params: { id } }) {
	// const res = await fetch(`${API_URL}/api/events/${id}?populate=*`);
	const res = await fetch(`${API_URL}/api/events?filters[id]id=${id}&populate=*`);
	const json = await res.json();
	const events = json.data;

	return {
		props: { evt: events[0] },
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
