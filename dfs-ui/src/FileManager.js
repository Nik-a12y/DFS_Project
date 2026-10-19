import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/files";

export default function FileManager() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const loadFiles = async () => {
    try {
      const res = await axios.get(`${API_BASE}/list`);
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to load files", err);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const uploadFile = async () => {
    if (!selectedFile) return alert("Please select a file");

    setUploading(true);
    try {
      const buffer = await selectedFile.arrayBuffer();

      await axios.post(`${API_BASE}/upload`, buffer, {
        headers: {
          "Content-Type": "application/octet-stream",
          "X-Filename": selectedFile.name,
        },
      });

      setSelectedFile(null);
      loadFiles();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = async (fileId, originalName) => {
    const res = await axios.get(`${API_BASE}/${fileId}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = originalName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  // delete function
//   const deleteFile = async (fileId, originalName) => {
//   const confirmed = window.confirm(
//     `Are you sure you want to delete "${originalName}"?`
//   );

//   if (!confirmed) return;

//   try {
//     await axios.delete(`${API_BASE}/${fileId}`);
//     await loadFiles();
//     alert("File deleted successfully");
//   } catch (err) {
//     console.error("Delete failed", err);
//     alert("Delete failed. Please try again.");
//   }
// };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>📂 Distributed File Storage</h2>

        {/* Upload Section */}
        <div style={styles.uploadSection}>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={styles.fileInput}
          />
          <button
            onClick={uploadFile}
            disabled={uploading}
            style={{
              ...styles.uploadBtn,
              opacity: uploading ? 0.6 : 1,
            }}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>

      {/* Files Table */}
      <div style={styles.card}>
        <h3 style={styles.subTitle}>Stored Files</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Filename</th>
              <th>File ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan="3" style={styles.empty}>
                  No files uploaded yet
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr key={file.fileId}>
                  <td>{file.originalName}</td>
                  <td style={styles.mono}>{file.fileId}</td>
                  <td>
                    {/*download button*/}
                    <button
                      onClick={() =>
                        downloadFile(file.fileId, file.originalName)
                      }
                      style={styles.downloadBtn}
                    >
                      Download
                    </button>
                    {/*delet button*/}
                    {/* <button
    onClick={() =>
      deleteFile(file.fileId, file.originalName)
    }
    style={styles.deleteBtn}
  >
    Delete
  </button> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const styles = {
  page: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "Inter, Arial, sans-serif",
    background: "#f4f6f8",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    marginBottom: "25px",
  },
  title: {
    marginBottom: "15px",
  },
  subTitle: {
    marginBottom: "15px",
  },
  uploadSection: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  fileInput: {
    flex: 1,
  },
  uploadBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  mono: {
    fontFamily: "monospace",
    fontSize: "12px",
    color: "#555",
  },
  downloadBtn: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  deleteBtn: {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
},
  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#777",
  },
};
