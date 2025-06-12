import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.logo}>Employee Management</h1>
        <nav className={styles.nav}>
          <Link
            to='/'
            className={`${styles.navLink} ${
              location.pathname === '/' ? styles.active : ''
            }`}
          >
            Home
          </Link>
          <Link
            to='/employees'
            className={`${styles.navLink} ${
              location.pathname === '/employees' ? styles.active : ''
            }`}
          >
            Employees
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
