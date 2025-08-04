const createFormDataStudent = (formData) => {
  const formDataObj = new FormData();
  // Append all primitive fields
  formDataObj.append("name", formData.name || "");
  formDataObj.append("gender", formData.gender || "");
  formDataObj.append("dob", formData.dob || "");
  formDataObj.append("bloodGroup", formData.bloodGroup || "");
  formDataObj.append("nationality", formData.nationality || "");
  formDataObj.append("religion", formData.religion || "");
  formDataObj.append("caste", formData.caste || "");
  formDataObj.append("category", formData.category || "");
  formDataObj.append("aadharNumber", formData.aadharNumber || "");
  formDataObj.append("email", formData.email || "");
  formDataObj.append("phone", formData.phone || "");
  formDataObj.append("password", formData.password || "");
  formDataObj.append("studentClass", formData.studentClass || "");
  formDataObj.append("admissionNumber", formData.admissionNumber || "");
  formDataObj.append("admissionDate", formData.admissionDate || "");
  formDataObj.append("hasPreviousSchool", formData.hasPreviousSchool);

  // File upload
  if (formData.studentImage) {
    formDataObj.append("studentImage", formData.studentImage);
  }

  // Append JSON-stringified complex objects
  formDataObj.append("address", JSON.stringify(formData.address));
  formDataObj.append("guardian", JSON.stringify(formData.guardian));
  formDataObj.append("mother", JSON.stringify(formData.mother));
  formDataObj.append("father", JSON.stringify(formData.father));
  formDataObj.append("previousSchool", JSON.stringify(formData.previousSchool));

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

export default createFormDataStudent;
