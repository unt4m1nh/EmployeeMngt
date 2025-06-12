import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { getEmployees, removeEmployee } from '../store/employeeSlice';
import type { Employee } from '../store/employeeSlice';
import EmployeeForm from '../components/EmployeeForm';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import styles from './EmployeeList.module.css';

const EmployeeList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error, operationLoading } = useSelector(
    (state: RootState) => state.employees
  );

  // State for search, sort, and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort by salary
    filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.salary - b.salary;
      } else {
        return b.salary - a.salary;
      }
    });

    return filtered;
  }, [employees, searchTerm, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(
    filteredAndSortedEmployees.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredAndSortedEmployees.slice(
    startIndex,
    endIndex
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete) {
      try {
        await dispatch(removeEmployee(employeeToDelete.id)).unwrap();
        setIsDeleteModalOpen(false);
        setEmployeeToDelete(null);
      } catch (error) {
        // Error is handled by Redux
      }
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      buttons.push(
        <button
          key='prev'
          onClick={() => handlePageChange(currentPage - 1)}
          className={styles.paginationButton}
        >
          ←
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.paginationButton} ${
            i === currentPage ? styles.activePage : ''
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key='next'
          onClick={() => handlePageChange(currentPage + 1)}
          className={styles.paginationButton}
        >
          →
        </button>
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className={styles.employeeList}>
        <h2 className={styles.title}>Employee Directory</h2>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.employeeList}>
        <h2 className={styles.title}>Employee Directory</h2>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button
            className={styles.retryButton}
            onClick={() => dispatch(getEmployees())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.employeeList}>
      <h2 className={styles.title}>Employee Directory</h2>

      {/* Stats and Controls */}
      <div className={styles.controlsContainer}>
        <div className={styles.employeeStats}>
          <p className={styles.statsText}>
            Total Employees:{' '}
            <span className={styles.statsNumber}>{employees.length}</span>
            {searchTerm && (
              <span className={styles.filteredStats}>
                {' '}
                (Showing {filteredAndSortedEmployees.length} filtered)
              </span>
            )}
          </p>
        </div>

        <div className={styles.rightControls}>
          {/* Search Input */}
          <div className={styles.searchContainer}>
            <input
              type='text'
              placeholder='Search by name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={styles.clearButton}
              >
                ✕
              </button>
            )}
          </div>

          {/* Add Employee Button */}
          <button
            onClick={handleAddEmployee}
            className={styles.addButton}
            disabled={operationLoading}
          >
            + Add Employee
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className={styles.tableContainer}>
        <table className={styles.employeeTable}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>ID</th>
              <th className={styles.tableHeader}>Name</th>
              <th className={styles.tableHeader}>Email</th>
              <th className={styles.tableHeader}>Position</th>
              <th className={styles.tableHeader}>Department</th>
              <th
                className={`${styles.tableHeader} ${styles.sortableHeader}`}
                onClick={handleSortToggle}
              >
                Salary {sortOrder === 'asc' ? '↑' : '↓'}
              </th>
              <th className={styles.tableHeader}>Join Date</th>
              <th className={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((employee) => (
                <tr key={employee.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <span className={styles.employeeId}>{employee.id}</span>
                  </td>
                  <td className={styles.tableCell}>
                    <strong className={styles.employeeName}>
                      {employee.name}
                    </strong>
                  </td>
                  <td className={styles.tableCell}>{employee.email}</td>
                  <td className={styles.tableCell}>{employee.position}</td>
                  <td className={styles.tableCell}>
                    <span className={styles.departmentBadge}>
                      {employee.department}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.salary}>
                      {formatSalary(employee.salary)}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    {formatDate(employee.joinDate)}
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className={styles.editButton}
                        disabled={operationLoading}
                        title='Edit Employee'
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee)}
                        className={styles.deleteButton}
                        disabled={operationLoading}
                        title='Delete Employee'
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className={styles.noResults}>
                  {searchTerm
                    ? 'No employees found matching your search.'
                    : 'No employees found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}>
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredAndSortedEmployees.length)} of{' '}
            {filteredAndSortedEmployees.length} employees
          </div>
          <div className={styles.paginationButtons}>
            {renderPaginationButtons()}
          </div>
        </div>
      )}

      {/* Employee Form Modal */}
      <EmployeeForm
        employee={editingEmployee}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEmployee(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        employeeName={employeeToDelete?.name || ''}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        isLoading={operationLoading}
      />
    </div>
  );
};

export default EmployeeList;
