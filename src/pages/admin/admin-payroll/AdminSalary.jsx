/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowLeft,
  MonitorCheck,
  IndianRupee,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  createSalary,
  deleteSalaryById,
  getAllSalaries,
  updateSalaryById,
} from "@/services/salary.service";

const AdminSalary = () => {
  const navigate = useNavigate();
  const [salaries, setSalaries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
  });

  // Calculate total salary whenever form data changes
  const calculateTotalSalary = () => {
    return formData?.amount;
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      amount: 0,
    });
    setIsEditing(false);
    setEditingId(null);
  };

  async function fetchSalaries() {
    let salaries = await getAllSalaries();
    setSalaries(salaries);
  }

  useEffect(() => {
    fetchSalaries();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        // Update existing salary
        let updatedSalary = await updateSalaryById(editingId, formData);
        if (updatedSalary) {
          fetchSalaries();
        }
      } else {
        // Add new salary
        let newSalary = await createSalary(formData);
        if (newSalary) {
          fetchSalaries();
        }
      }
      resetForm();
    } catch (error) {
      toast.error("Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (salary) => {
    setFormData({
      name: salary.name,
      amount: salary.amount,
    });
    setIsEditing(true);
    setEditingId(salary._id);
  };

  // Handle delete
  const handleDelete = async (salary) => {
    let isDel = await deleteSalaryById(salary);
    console.log(isDel);
    if (isDel) {
      fetchSalaries();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm rounded-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between py-8 flex-col md:flex-row gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/admin/payroll")}
                  className="mr-2 bg-red-600 rounded-md hover:bg-red-700 text-white hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Salary Management
                  </h1>
                  <p className="text-xs text-gray-500">
                    Create and manage teacher salaries
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1">
                  {salaries.length} Total Salaries
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Edit className="h-5 w-5 text-red-600" />
                      Edit Salary
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 text-red-600" />
                      Add New Salary
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Name <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter salary name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Amount <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) =>
                        handleInputChange("amount", e.target.value)
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  {/* Total Salary Display */}
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Total Salary:
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        {formatCurrency(calculateTotalSalary())}
                      </span>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          {isEditing ? "Updating..." : "Adding..."}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {isEditing ? "Update" : "Add"} Salary
                        </>
                      )}
                    </Button>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="border-gray-300"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Salary Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-red-600" />
                    All Salaries
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">
                          Name
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Amount
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salaries.length > 0 ? (
                        salaries.map((salary) => (
                          <TableRow
                            key={salary._id}
                            className="hover:bg-gray-50 border-b border-gray-100"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <MonitorCheck className="h-4 w-4 text-gray-500" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {salary.name}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-gray-900">
                                {formatCurrency(salary.amount)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(salary)}
                                  className="border-gray-300 hover:bg-gray-50"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-300 text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Salary
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete the
                                        salary for {salary.name}? This action
                                        cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(salary)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-gray-500"
                          >
                            {"No salaries added yet."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSalary;
