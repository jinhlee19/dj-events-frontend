//boom-dance-festival-experience

const { events } = require('./data.json');

// eslint-disable-next-line import/no-anonymous-default-export
export default (req, res) => {
	const evt = events.filter(ev => ev.slug === req.query.slug);
	if (req.method === 'GET') {
		res.status(200).json(evt);
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).json({ message: `Method ${req.method} is not allowed` });
	}
};
