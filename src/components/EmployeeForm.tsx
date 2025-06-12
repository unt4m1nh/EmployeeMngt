import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { addEmployee, editEmployee, clearError } from '../store/employeeSlice';
import type { Employee, CreateEmployeeData } from '../store/employeeSlice';
import styles from './EmployeeForm.module.css';

interface EmployeeFormProps {
  employee?: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { operationLoading, error } = useSelector(
    (state: RootState) => state.employees
  );

  const [formData, setFormData] = useState<CreateEmployeeData>({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: 0,
    joinDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Partial<CreateEmployeeData>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        position: employee.position,
        department: employee.department,
        salary: employee.salary,
        joinDate: employee.joinDate,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        position: '',
        department: '',
        salary: 0,
        joinDate: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
    dispatch(clearError());
  }, [employee, dispatch, isOpen]);

  const departments = [
    'Engineering',
    'Product',
    'Design',
    'Human Resources',
    'Marketing',
    'Sales',
    'Finance',
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateEmployeeData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    // if (formData.salary <= 0) {
    //   newErrors.salary = 'Salary must be greater than 0';
    // }

    if (!formData.joinDate) {
      newErrors.joinDate = 'Join date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (employee) {
        await dispatch(editEmployee({ ...employee, ...formData })).unwrap();
      } else {
        await dispatch(addEmployee(formData)).unwrap();
      }
      onClose();
    } catch (error) {
      // Error is handled by Redux slice
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'salary' ? Number(value) : value,
    }));

    // Clear error for this field
    if (errors[name as keyof CreateEmployeeData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor='name' className={styles.label}>
              Full Name *
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.name ? styles.inputError : ''
              }`}
              placeholder='Enter full name'
            />
            {errors.name && (
              <span className={styles.fieldError}>{errors.name}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='email' className={styles.label}>
              Email Address *
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.email ? styles.inputError : ''
              }`}
              placeholder='Enter email address'
            />
            {errors.email && (
              <span className={styles.fieldError}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor='position' className={styles.label}>
                Position *
              </label>
              <input
                type='text'
                id='position'
                name='position'
                value={formData.position}
                onChange={handleChange}
                className={`${styles.input} ${
                  errors.position ? styles.inputError : ''
                }`}
                placeholder='Enter position'
              />
              {errors.position && (
                <span className={styles.fieldError}>{errors.position}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='department' className={styles.label}>
                Department *
              </label>
              <select
                id='department'
                name='department'
                value={formData.department}
                onChange={handleChange}
                className={`${styles.select} ${
                  errors.department ? styles.inputError : ''
                }`}
              >
                <option value=''>Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <span className={styles.fieldError}>{errors.department}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor='salary' className={styles.label}>
                Salary *
              </label>
              <input
                type='number'
                id='salary'
                name='salary'
                value={formData.salary}
                onChange={handleChange}
                className={`${styles.input} ${
                  errors.salary ? styles.inputError : ''
                }`}
                placeholder='Enter salary'
                min='0'
              />
              {errors.salary && (
                <span className={styles.fieldError}>{errors.salary}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='joinDate' className={styles.label}>
                Join Date *
              </label>
              <input
                type='date'
                id='joinDate'
                name='joinDate'
                value={formData.joinDate}
                onChange={handleChange}
                className={`${styles.input} ${
                  errors.joinDate ? styles.inputError : ''
                }`}
              />
              {errors.joinDate && (
                <span className={styles.fieldError}>{errors.joinDate}</span>
              )}
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type='button'
              onClick={onClose}
              className={styles.cancelButton}
              disabled={operationLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className={styles.submitButton}
              disabled={operationLoading}
            >
              {operationLoading
                ? 'Saving...'
                : employee
                ? 'Update Employee'
                : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
