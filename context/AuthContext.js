import { createContext, useState, useEffect } from 'react';
import { Router, useRouter } from 'next/router';
import { NEXT_URL } from '@/config/index';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	const router = useRouter();
	useEffect(() => checkUserLoggedIn(), []);

	// Register user
	const register = async user => {
		console.log(user);
		// const res = await fetch(`${NEXT_URL}/api/register`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify(user),
		// });

		// const data = await res.json();

		// if (res.ok) {
		// 	setUser(data.user);
		// 	router.push('/account/dashboard');
		// } else {
		// 	setError(data.message);
		// 	setError(null);
		// }
	};

	// Login user
	const login = async ({ email: identifier, password }) => {
		console.log(identifier, password);
		const res = await fetch(`${NEXT_URL}/api/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				identifier,
				password,
			}),
		});

		const data = await res.json();
		console.log('data in authcontext', data);

		if (res.ok) {
			setUser(data.user);
			// router.push('/account/dashboard');
		} else {
			// setError(data.message);
			setError(data.error);
			// 여기서 상태처리 끊어낼때 사용한다. 이때, toast 메세지를 받는 error까지 전달되지 않음. so it does not stay as its state
			// setError(null);
		}
	};

	// Logout user
	const logout = async user => {
		const res = await fetch(`${NEXT_URL}/api/logout`, {
			method: 'POST',
		});

		if (res.ok) {
			setUser(null);
			router.push('/');
		}
	};

	// Check if user is logged in
	const checkUserLoggedIn = async user => {
		const res = await fetch(`${NEXT_URL}/api/user`);
		const data = await res.json();

		if (res.ok) {
			setUser(data.user);
			router.push('/account/dashboard');
		} else {
			setUser(null);
		}
	};

	return <AuthContext.Provider value={{ user, error, register, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
