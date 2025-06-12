import axios from 'axios';
import type { Employee, CreateEmployeeData } from '../store/employeeSlice';

// Mock data - replace with real API endpoint
let mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@company.com',
    position: 'Software Engineer',
    department: 'Engineering',
    salary: 75000,
    joinDate: '2023-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    position: 'Product Manager',
    department: 'Product',
    salary: 85000,
    joinDate: '2022-11-20',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    position: 'UX Designer',
    department: 'Design',
    salary: 70000,
    joinDate: '2023-03-10',
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    position: 'HR Manager',
    department: 'Human Resources',
    salary: 80000,
    joinDate: '2022-08-05',
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@company.com',
    position: 'DevOps Engineer',
    department: 'Engineering',
    salary: 78000,
    joinDate: '2023-02-28',
  },
];

// Simulate API call delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate next ID
const getNextId = () => {
  return Math.max(...mockEmployees.map((emp) => emp.id), 0) + 1;
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  await delay(1000);
  return [...mockEmployees];
};

export const createEmployee = async (
  employeeData: CreateEmployeeData
): Promise<Employee> => {
  await delay(500);

  // Check if email already exists
  if (mockEmployees.some((emp) => emp.email === employeeData.email)) {
    throw new Error('Employee with this email already exists');
  }

  const newEmployee: Employee = {
    id: getNextId(),
    ...employeeData,
  };

  mockEmployees.push(newEmployee);
  return newEmployee;
};

export const updateEmployee = async (employee: Employee): Promise<Employee> => {
  await delay(500);

  const index = mockEmployees.findIndex((emp) => emp.id === employee.id);
  if (index === -1) {
    throw new Error('Employee not found');
  }

  // Check if email already exists for other employees
  const emailExists = mockEmployees.some(
    (emp) => emp.email === employee.email && emp.id !== employee.id
  );
  if (emailExists) {
    throw new Error('Employee with this email already exists');
  }

  mockEmployees[index] = employee;
  return employee;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await delay(500);

  const index = mockEmployees.findIndex((emp) => emp.id === id);
  if (index === -1) {
    throw new Error('Employee not found');
  }

  mockEmployees.splice(index, 1);
};
