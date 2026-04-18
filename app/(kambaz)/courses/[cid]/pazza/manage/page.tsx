"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../../../client";

const INSTRUCTOR_ROLES = ["FACULTY", "INSTRUCTOR", "TA"];

const TABS = [
  "General Settings",
  "Customize Q&A",
  "Manage Folders",
  "Manage Enrollment",
  "Create Groups",
  "Customize Course Page",
  "Piazza Network Settings",
];

interface Folder { id: string; name: string; }

function ManageFolders({ cid }: { cid: string }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    client.getPazzaFolders(cid).then(setFolders);
  }, [cid]);

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const startEdit = (folder: Folder) => {
    setEditingId(folder.id);
    setEditName(folder.name);
  };

  const saveEdit = async (folderId: string) => {
    if (!editName.trim()) return;
    const updated = await client.updatePazzaFolder(cid, folderId, editName.trim());
    setFolders((prev) => prev.map((f) => (f.id === folderId ? updated : f)));
    setEditingId(null);
  };

  const addFolder = async () => {
    if (!newName.trim()) return;
    const folder = await client.createPazzaFolder(cid, newName.trim());
    setFolders((prev) => [...prev, folder]);
    setNewName("");
  };

  const deleteSelected = async () => {
    await Promise.all(
      selectedIds.map((id) => client.deletePazzaFolder(cid, id).catch(console.error)),
    );
    setFolders((prev) => prev.filter((f) => !selectedIds.includes(f.id)));
    setSelectedIds([]);
  };

  return (
    <>
      <h2 className="fw-bold mb-2">Manage Folders</h2>
      <p className="text-muted mb-4" style={{ fontSize: "1rem" }}>
        Folders help organize your Pazza posts by topic or category. Create new folders to
        group related posts together, or delete folders that are no longer needed. Students
        and instructors can filter the Q&amp;A feed by folder to quickly find relevant posts.
      </p>
      <div className="d-flex flex-column align-items-center">
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div className="mb-2">
            {folders.map((folder) => (
              <div key={folder.id} className="d-flex align-items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(folder.id)}
                  onChange={() => toggleSelect(folder.id)}
                />
                {editingId === folder.id ? (
                  <>
                    <input
                      className="form-control form-control-sm"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(folder.id); if (e.key === "Escape") setEditingId(null); }}
                      autoFocus
                    />
                    <button className="btn btn-sm btn-primary" onClick={() => saveEdit(folder.id)}>Save</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span className="flex-grow-1" style={{ fontSize: "0.95rem" }}>{folder.name}</span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(folder)}>Edit</button>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-end mb-4">
            <button
              className="btn btn-sm btn-outline-danger"
              disabled={selectedIds.length === 0}
              onClick={deleteSelected}
            >
              Delete Selected {selectedIds.length > 0 && `(${selectedIds.length})`}
            </button>
          </div>

          <div className="d-flex gap-2">
            <input
              className="form-control form-control-sm"
              placeholder="New folder name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addFolder(); }}
            />
            <button className="btn btn-sm btn-primary" style={{ whiteSpace: "nowrap" }} onClick={addFolder}>
              Add Folder
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ManagePage() {
  const { cid } = useParams();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isInstructor = INSTRUCTOR_ROLES.includes((currentUser as any)?.role?.toUpperCase());

  if (!isInstructor) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
        <p className="fs-5">You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100">
      <div className="border-bottom" style={{ overflowX: "auto" }}>
        <ul className="nav nav-tabs border-0 flex-nowrap">
          {TABS.map((tab) => (
            <li key={tab} className="nav-item" style={{ whiteSpace: "nowrap" }}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                style={{ fontSize: 13, padding: "0.4rem 0.75rem" }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 flex-grow-1 overflow-auto">
        {activeTab === "Manage Folders" ? (
          <ManageFolders cid={cid as string} />
        ) : (
          <>
            <h5 className="fw-semibold mb-3">{activeTab}</h5>
            <p className="text-muted">Content for {activeTab} goes here.</p>
          </>
        )}
      </div>
    </div>
  );
}
