import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.heroSection}>
        <h1 className={styles.title}>
          Welcome to Employee Management Dashboard
        </h1>
        <p className={styles.subtitle}>
          Manage your workforce efficiently with our comprehensive employee
          management system.
        </p>
        <Link to='/employees' className={styles.ctaButton}>
          View Employees
        </Link>
      </div>

      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Employee Records</h3>
          <p className={styles.featureDescription}>
            Keep track of all employee information including personal details,
            positions, and departments.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Department Management</h3>
          <p className={styles.featureDescription}>
            Organize employees by departments and manage team structures
            effectively.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Salary Tracking</h3>
          <p className={styles.featureDescription}>
            Monitor compensation details and maintain transparent salary
            records.
          </p>
        </div>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Reports & Analytics</h3>
          <p className={styles.featureDescription}>
            Generate insights from employee data to make informed decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
