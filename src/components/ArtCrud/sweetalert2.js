import Swal from "sweetalert2";

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This artwork will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    await deleteDoc(doc(db, "artworks", id));
    // Update your state or refetch data after deletion
    Swal.fire("Deleted!", "The artwork has been deleted.", "success");
  }
};
