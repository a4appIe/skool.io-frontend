const createFormDataTeacherEdit = (teacherData) => {
  const formData = new FormData();

  // ✅ Add basic fields (only if they exist and are not empty)
  const appendIfExists = (key, value) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  };

  appendIfExists("name", teacherData.name);
  appendIfExists("password", teacherData.password);
  appendIfExists("gender", teacherData.gender);
  appendIfExists("dob", teacherData.dob);
  appendIfExists("bloodGroup", teacherData.bloodGroup);
  appendIfExists("category", teacherData.category);
  appendIfExists("aadharNumber", teacherData.aadharNumber);
  appendIfExists("email", teacherData.email);
  appendIfExists("phone", teacherData.phone);
  appendIfExists("qualification", teacherData.qualification);
  appendIfExists("salary", teacherData.salary);

  // Handle experience (can be 0, so check specifically for null/undefined)
  if (teacherData.experience !== null && teacherData.experience !== undefined) {
    formData.append("experience", teacherData.experience);
  }

  // ✅ Add JSON fields (stringified) - only if they have data
  if (teacherData.address && Object.keys(teacherData.address).length > 0) {
    formData.append("address", JSON.stringify(teacherData.address));
  }

  // ✅ Handle Documents
  const newDocuments = [];
  const existingDocuments = [];
  const documentNames = [];

  if (teacherData.documents && teacherData.documents.length > 0) {
    teacherData.documents.forEach((doc) => {
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

  // ✅ Add teacher image (if updated and is a File object)
  if (teacherData.teacherImage && teacherData.teacherImage instanceof File) {
    formData.append("teacherImage", teacherData.teacherImage);
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

export default createFormDataTeacherEdit;
