// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { events } = require('./data.json');

// eslint-disable-next-line import/no-anonymous-default-export
export default (req, res) => {
	if (req.method === 'GET') {
		res.status(200).json(events);
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).json({ message: `Method ${req.method} is not allowed` });
	}
};
