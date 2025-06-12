import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../services/employeeService';

export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  joinDate: string;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  joinDate: string;
}

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  operationLoading: boolean;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
  operationLoading: false,
};

export const getEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async () => {
    const response = await fetchEmployees();
    return response;
  }
);

export const addEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData: CreateEmployeeData) => {
    const response = await createEmployee(employeeData);
    return response;
  }
);

export const editEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async (employee: Employee) => {
    const response = await updateEmployee(employee);
    return response;
  }
);

export const removeEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id: number) => {
    await deleteEmployee(id);
    return id;
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getEmployees.fulfilled,
        (state, action: PayloadAction<Employee[]>) => {
          state.loading = false;
          state.employees = action.payload;
        }
      )
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })
      // Create employee
      .addCase(addEmployee.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(
        addEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.operationLoading = false;
          state.employees.push(action.payload);
        }
      )
      .addCase(addEmployee.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.error.message || 'Failed to create employee';
      })
      // Update employee
      .addCase(editEmployee.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(
        editEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.operationLoading = false;
          const index = state.employees.findIndex(
            (emp) => emp.id === action.payload.id
          );
          if (index !== -1) {
            state.employees[index] = action.payload;
          }
        }
      )
      .addCase(editEmployee.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.error.message || 'Failed to update employee';
      })
      // Delete employee
      .addCase(removeEmployee.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(
        removeEmployee.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.operationLoading = false;
          state.employees = state.employees.filter(
            (emp) => emp.id !== action.payload
          );
        }
      )
      .addCase(removeEmployee.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.error.message || 'Failed to delete employee';
      });
  },
});

export const { clearError } = employeeSlice.actions;
export default employeeSlice.reducer;
