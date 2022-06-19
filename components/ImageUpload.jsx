import { useState } from 'react';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.css';

export default function ImageUpload() {
	const [image, setImage] = useState(null);

	return (
		<div className="styles.form">
			<h1>Upload Event Image</h1>
			<form onSubmit={handleSumbit}>
				<div className="styles.file">
					<input type="file" onChange={handleFileChange} />
				</div>
			</form>
		</div>
	);
}
