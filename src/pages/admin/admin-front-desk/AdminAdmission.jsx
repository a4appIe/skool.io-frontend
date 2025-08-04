import { StudentAdmissionForm } from "@/components/admin/students/StudentAdmissionForm";
import React from "react";
import { useParams } from "react-router-dom";

const AdminAdmission = (edit = false) => {
  // If edit is true, we can pass a studentId to fetch the student data
  const { studentId } = useParams();
  if (!studentId && edit) {
    console.error("No studentId provided for editing.");
    return null; // or handle the error as needed
  }
  return (
    <>
      <StudentAdmissionForm edit={edit} studentId={studentId} />
    </>
  );
};

export default AdminAdmission;
