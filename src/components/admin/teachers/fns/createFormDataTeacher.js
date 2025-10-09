const createFormDataTeacher = (formData) => {
  const formDataObj = new FormData();

  // Append all primitive fields
  formDataObj.append("name", formData.name || "");
  formDataObj.append("password", formData.password || "");
  formDataObj.append("gender", formData.gender || "");
  formDataObj.append("dob", formData.dob || "");
  formDataObj.append("bloodGroup", formData.bloodGroup || "");
  formDataObj.append("category", formData.category || "General");
  formDataObj.append("aadharNumber", formData.aadharNumber || "");
  formDataObj.append("email", formData.email || "");
  formDataObj.append("phone", formData.phone || "");
  formDataObj.append("qualification", formData.qualification || "");
  formDataObj.append("experience", formData.experience || 0);
  formDataObj.append("salary", formData.salary || 0);

  // File upload - Teacher Image
  if (formData.teacherImage) {
    formDataObj.append("teacherImage", formData.teacherImage);
  }

  // Append JSON-stringified address object
  formDataObj.append("address", JSON.stringify(formData.address));

  // Document names
  const documentNames =
    formData.documents && formData.documents.map((doc) => doc.name || "");
  formDataObj.append("documentNames", JSON.stringify(documentNames));

  // Document files (append one by one under the same field name "documents")
  formData.documents &&
    formData.documents.forEach((doc) => {
      if (doc.file) {
        formDataObj.append("documents", doc.file);
      }
    });

  return formDataObj;
};

export default createFormDataTeacher;
