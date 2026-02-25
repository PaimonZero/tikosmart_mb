import apiClient from "./apiClient";

export interface DepartmentParams {
  q?: string;
  limit?: number;
  offset?: number;
}

export interface DepartmentData {
  [key: string]: any;
}

export const listDepartments = (params: DepartmentParams = {}) => {
  const { q, limit = 10, offset = 0 } = params;

  return apiClient.get("/departments", {
    params: {
      q: q || undefined,
      limit: Number(limit),
      offset: Number(offset),
    },
  });
};
// optional: get department by id
export const getDepartment = (departmentId: string) => {
  return apiClient.get(`/departments/${departmentId}`);
};

export const createDepartment = (departmentData: DepartmentData) => {
  return apiClient.post("/departments", departmentData);
};

export const updateDepartment = (
  departmentId: string,
  departmentData: DepartmentData,
) => {
  return apiClient.put(`/departments/${departmentId}`, departmentData);
};

// update status
export const updateDepartmentStatus = (
  departmentId: string,
  status: string,
) => {
  return apiClient.put(`/departments/${departmentId}`, { status });
};

export const deleteDepartment = (departmentId: string) => {
  return apiClient.delete(`/departments/${departmentId}`);
};
