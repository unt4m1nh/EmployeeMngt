import type { Employee } from '../store/employeeSlice';
import styles from './EmployeeCard.module.css';

interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      Engineering: styles.engineeringBadge,
      Product: styles.productBadge,
      Design: styles.designBadge,
      'Human Resources': styles.hrBadge,
      Marketing: styles.marketingBadge,
    };
    return colors[department] || styles.defaultBadge;
  };

  return (
    <div className={styles.employeeCard}>
      <div className={styles.employeeHeader}>
        <h3 className={styles.employeeName}>{employee.name}</h3>
        <span className={styles.employeeId}>ID: {employee.id}</span>
      </div>
      <div className={styles.employeeDetails}>
        <div className={styles.detailRow}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>{employee.email}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Position:</span>
          <span className={styles.value}>{employee.position}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Department:</span>
          <span
            className={`${styles.departmentBadge} ${getDepartmentColor(
              employee.department
            )}`}
          >
            {employee.department}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Salary:</span>
          <span className={`${styles.value} ${styles.salary}`}>
            {formatSalary(employee.salary)}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Join Date:</span>
          <span className={styles.value}>{formatDate(employee.joinDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
