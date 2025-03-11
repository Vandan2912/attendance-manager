"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/Loader";
import { Trash2, MoreVertical, Download, File as FilePdf } from "lucide-react";
import { toast } from "react-toastify";

interface Material {
  _id: string;
  fileName: string;
  uploadedAt: string;
  filePath: string;
  uploadedBy: string;
}

export default function ClassDetailsPage() {
  const { id } = useParams();

  const [Loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>();
  const [materials, setMaterials] = useState<Material[]>([]);

  const getFileIcon = () => {
    return FilePdf;
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teacher/material/upload?classId=${id}`);
      const data = await response.json();
      if (response.ok) {
        setMaterials(data.materials);
      } else {
        console.error("Failed to fetch materials");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching materials:", error);
      setLoading(false);
    }
  };

  const deleteMaterial = async (materialId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this material?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/teacher/material/upload?materialId=${materialId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ materialId }),
      });

      if (response.ok) {
        toast.success("Material deleted successfully.");
        setMaterials((prev) => prev.filter((material) => material._id !== materialId));
      } else {
        toast.error("Failed to delete material.");
      }
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      setUser(userObj);
    }
    fetchMaterials();
  }, []);

  return (
    <div className="p-8">
      {Loading && <Loader />}

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Class Material</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.map((material) => {
                  const FileIcon = getFileIcon();
                  return (
                    <div
                      key={material._id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-200 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-50 rounded-lg">
                            <FileIcon className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{material.fileName}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(material.uploadedAt)
                                .toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                                .replace(",", "")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <a
                          target="_blank"
                          href={material.filePath}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => deleteMaterial(material._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
