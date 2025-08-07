import { TeacherRecruitmentForm } from "@/components/admin/teachers/TeacherRecruitmentForm";
import React from "react";
import { useParams } from "react-router-dom";

const AdminHRRecruit = ({ edit = false }) => {
  // If edit is true, we can pass a teacherId to fetch the teacher data
  const { teacherId } = useParams();
  if (!teacherId && edit) {
    console.error("No teacherId provided for editing.");
    return null;
  }
  return (
    <>
      <TeacherRecruitmentForm edit={edit} teacherId={teacherId} />
    </>
  );
};

export default AdminHRRecruit;
