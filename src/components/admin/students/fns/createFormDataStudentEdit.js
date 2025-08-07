const createFormDataStudentEdit = (studentData) => {
  const formData = new FormData();

  // ✅ Add basic fields (only if they exist and are not empty)
  const appendIfExists = (key, value) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  };

  appendIfExists("name", studentData.name);
  appendIfExists("gender", studentData.gender);
  appendIfExists("dob", studentData.dob);
  appendIfExists("bloodGroup", studentData.bloodGroup);
  appendIfExists("nationality", studentData.nationality);
  appendIfExists("religion", studentData.religion);
  appendIfExists("category", studentData.category);
  appendIfExists("caste", studentData.caste);
  appendIfExists("aadharNumber", studentData.aadharNumber);
  appendIfExists("email", studentData.email);
  appendIfExists("phone", studentData.phone);
  appendIfExists("password", studentData.password);
  appendIfExists("studentClass", studentData.studentClass);

  // Boolean field
  formData.append("hasPreviousSchool", studentData.hasPreviousSchool || false);

  // ✅ Add JSON fields (stringified) - only if they have data
  if (studentData.address && Object.keys(studentData.address).length > 0) {
    formData.append("address", JSON.stringify(studentData.address));
  }

  if (studentData.guardian && Object.keys(studentData.guardian).length > 0) {
    formData.append("guardian", JSON.stringify(studentData.guardian));
  }

  if (studentData.mother && Object.keys(studentData.mother).length > 0) {
    formData.append("mother", JSON.stringify(studentData.mother));
  }

  if (studentData.father && Object.keys(studentData.father).length > 0) {
    formData.append("father", JSON.stringify(studentData.father));
  }

  if (
    studentData.previousSchool &&
    Object.keys(studentData.previousSchool).length > 0
  ) {
    formData.append(
      "previousSchool",
      JSON.stringify(studentData.previousSchool)
    );
  }

  // ✅ Handle Documents
  const newDocuments = [];
  const existingDocuments = [];
  const documentNames = [];

  if (studentData.documents && studentData.documents.length > 0) {
    studentData.documents.forEach((doc) => {
      if (doc.file instanceof File) {
        // New document file
        newDocuments.push(doc.file);
        documentNames.push(doc.name || doc.file.name);
      } else if (typeof doc.file === "string") {
        // Existing document (file path/name)
        existingDocuments.push({
          name: doc.name,
          file: doc.file,
        });
      }
    });
  }

  // Append document-related data
  formData.append("documentNames", JSON.stringify(documentNames));
  formData.append("existingDocuments", JSON.stringify(existingDocuments));

  // ✅ Add student image (if updated and is a File object)
  if (studentData.studentImage && studentData.studentImage instanceof File) {
    formData.append("studentImage", studentData.studentImage);
  }

  // ✅ Add new document files
  newDocuments.forEach((docFile) => {
    formData.append("documents", docFile);
  });

  // Debug: Log FormData contents
  console.log("FormData contents:");
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }

  return formData;
};

export default createFormDataStudentEdit;
