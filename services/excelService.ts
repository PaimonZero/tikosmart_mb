import apiClient from "./apiClient";

export interface ExportInventoryData {
  productIds: string[];
  departmentId?: string;
}

// Export Excel file for product and inventory data
/**
 * @route   POST /api/excel/inventory/export
 * @desc    Export inventory data (products and lots) to Excel
 * @access  Private (admin, manager, accountant)
 */
export const exportInventoryExcel = (data: ExportInventoryData) => {
  return apiClient.post("/excel/inventory/export", data, {
    responseType: "blob", // Important for file download
  });
};

// Import excel file for products
/**
 * @route   POST /api/excel/products/import
 * @desc    Import (create/update) products via Excel file
 * @access  Private (admin, manager)
 */
export const importProductExcel = (formData: FormData) => {
  return apiClient.post("/excel/products/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "json",
  });
};
