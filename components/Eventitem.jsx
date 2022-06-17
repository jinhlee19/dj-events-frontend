import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/EventItem.module.css';

export default function EventItem({ evt }) {
	console.log(evt);
	// const thumbnail = evt.attributes.image.data.attributes.formats.thumbnail;
	// console.log(thumbnail);
	const { name, date, time, slug, image } = evt.attributes;
	return (
		<div className={styles.event}>
			<div className={styles.img}>
				<Image
					src={image.data ? image.data.attributes.formats.thumbnail.url : '/images/event-default.png'}
					width={170}
					height={100}
					alt=""
				/>
			</div>
			<div className={styles.info}>
				<span>
					{new Date(date).toLocaleDateString('en-US')} at {time}
				</span>
				<h3>{name}</h3>
			</div>
			<div className={styles.link}>
				<Link href={`/events/${slug}`}>
					<a className="btn">Details</a>
				</Link>
			</div>
		</div>
	);
}

// Trouble Shooting : 14열 image가 아니라 image.data로 여부를 확인해야했었던 문제. :(
