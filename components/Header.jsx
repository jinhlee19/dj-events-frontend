import { Fragment, useContext } from 'react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import Search from './Search';
import styles from '@/styles/Header.module.css';
import AuthContext from '@/context/AuthContext';

export default function Header() {
	const { user, logout } = useContext(AuthContext);
	return (
		<header className={styles.header}>
			<div className={styles.logo}>
				<Link href="/">
					<a>DJ event</a>
				</Link>
			</div>
			<Search />
			<nav>
				<ul>
					<li>
						<Link href="/events">
							<a>Events</a>
						</Link>
					</li>
					{user ? (
						// 로그인 되어있을때
						<>
							<li>
								<Link href="/events/add">
									<a>Add Event</a>
								</Link>
							</li>
							<li>
								<button onClick={() => logout()} className="btn-secondary btn-icon">
									<FaSignOutAlt /> Log out
								</button>
							</li>
						</>
					) : (
						// 로그아웃 상태일때
						<>
							{' '}
							<li>
								<Link href="/account/login">
									<a className="btn-secondary btn-icon">
										<FaSignInAlt /> Log In
									</a>
								</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
		</header>
	);
}
