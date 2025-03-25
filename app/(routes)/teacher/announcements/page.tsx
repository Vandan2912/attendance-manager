"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, FileText, X, Upload, FileIcon, Paperclip, Download, File, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import Link from "next/link";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  class: string;
  createdAt: Date;
  fileUrl: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>();
  const [Classes, setClasses] = useState([]);
  const [selectedClass, setselectedClass] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementId, setAnnouncementId] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement>();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const userObj = JSON.parse(user!);
    setUser(userObj);
    getAnnouncement();
    // Fetch announcements from the server
    fetch("/api/classes/getByTeacher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherId: userObj._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClasses(data.class);
      });
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle file upload logic here
    console.log(acceptedFiles);
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "video/*": [".mp4", ".webm"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  const addAnnouncement = () => {
    // validate payload
    if (selectedClass === "" || title === "" || content === "") {
      toast.error("Please add all details");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      formData.append("fileUrl", `/uploads/${file?.name}`);
    }
    formData.append("classId", selectedClass);
    formData.append("title", title);
    formData.append("content", content);

    // Add announcement to the server
    fetch("/api/announcement/create", {
      method: "POST",
      // headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("create", data);
        setAnnouncements((prev) => [...prev, data.announcement]);
        setIsCreating(false);
      });
  };

  const getAnnouncement = () => {
    // Add announcement to the server
    fetch("/api/announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId: "" }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("getAnnouncement", data);
        setAnnouncements(() => [...data.announcement]);
      });
  };

  // delete announcement
  const deleteAnnouncement = (announcementId: string) => {
    fetch(`/api/announcement/delete?id=${announcementId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ announcementId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("delete", data);
        setAnnouncements((prev) => prev.filter((announcement) => announcement._id !== announcementId));
      });
  };

  useEffect(() => {
    if (announcementId) {
      announcements.map((announcement) => {
        if (announcement._id === announcementId) {
        }
      });
    } else {
      setAnnouncementId("");
    }
  }, [announcementId]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground mt-1">Manage and create announcements for your classes</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-purple-600 hover:bg-purple-700">
          <Megaphone className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Announcement</CardTitle>
            <CardDescription>Share important information with your class</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Enter announcement title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Class</label>
                  <Select value={selectedClass} onValueChange={(e) => setselectedClass(e)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {Classes.map((classItem: any) => (
                        <SelectItem key={classItem._id} value={classItem._id}>
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Write your announcement here..."
                  className="min-h-[150px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Attachments</label>
                {/* <div className="border-2 border-dashed p-4 rounded-lg text-center">
                  <Button variant="outline" className="w-full">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Add Files
                  </Button>
                </div> */}

                <div className="space-y-6">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-500"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-12 text-purple-500 w-12 mb-4 mx-auto" />
                    <p className="text-gray-600">
                      {isDragActive ? "Drop the files here..." : "Drag & drop files here, or click to select files"}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">Supports: PDF, Word, Images, Videos (Max 100MB)</p>
                  </div>

                  <div>
                    {file && (
                      <div className="flex gap-4 items-center">
                        <div className="bg-purple-50 p-2 rounded-lg">
                          <FileIcon className="h-6 text-purple-600 w-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 text-sm font-medium">{file.name}</p>
                          <p className="text-gray-500 text-xs">{file.size} bytes</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="bg-red-50 p-2 rounded-lg text-red-500 hover:bg-red-100 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={(e) => {
                    e.preventDefault();
                    addAnnouncement();
                  }}
                >
                  Publish Announcement
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {announcements.map((announcement) => (
          // <Link key={announcement._id} href={`/announcement/${announcement._id}`} passHref>
          <Card
            key={announcement._id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setAnnouncementId(announcement._id);
              setSelectedAnnouncement(announcement);
              setShowAnnouncementModal(true);
            }}
          >
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-semibold">{announcement.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {announcement.class} •{" "}
                    {announcement.createdAt ? format(new Date(announcement.createdAt), "MMM d, yyyy") : "Invalid Date"}
                  </p>
                </div>
              </div>
              <p className="mt-4">{announcement.content}</p>
              {announcement.fileUrl && (
                <div className="flex items-center mt-4 space-x-2">
                  <FileText className="h-4 text-muted-foreground w-4" />
                  <span className="text-muted-foreground text-sm">1 attachment</span>
                </div>
              )}
            </CardContent>
          </Card>
          // </Link>
        ))}
      </div>

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="flex bg-black/50 justify-center p-4 fixed inset-0 items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-4">Announcement Details</h2>
              <button
                type="button"
                onClick={() => setShowAnnouncementModal(false)}
                className="p-2 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title : {selectedAnnouncement?.title}</label>
              </div>
              <div>
                <label className="text-sm font-medium">Content : </label>
                <span>{selectedAnnouncement?.content}</span>
              </div>
              <div>
                <label className="text-sm font-medium">Attachments</label>
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="grid grid-cols-1 gap-4">
                    <div
                      key={selectedAnnouncement?._id}
                      className="border border-gray-200 p-4 rounded-lg group hover:border-purple-200 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                          <div className="bg-purple-50 p-2 rounded-lg">
                            <File className="h-6 text-purple-600 w-6" />
                          </div>
                          <div>
                            <h4 className="text-gray-900 font-medium">{selectedAnnouncement?.fileUrl?.substring(9)}</h4>
                            <p className="text-gray-500 text-sm">
                              {selectedAnnouncement?.createdAt
                                ? format(new Date(selectedAnnouncement.createdAt), "MMM d, yyyy, h:mm a")
                                : format(new Date(), "MMM d, yyyy, h:mm a")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <a
                          target="_blank"
                          href={selectedAnnouncement?.fileUrl}
                          className="flex flex-1 bg-purple-50 justify-center rounded-lg text-purple-600 gap-2 hover:bg-purple-100 items-center px-3 py-2 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="flex bg-red-50 justify-center p-2 rounded-lg text-red-600 w-full gap-2 hover:bg-red-50 items-center mt-3 transition-colors"
                  onClick={() => deleteAnnouncement(selectedAnnouncement?._id ?? "")}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Announcement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
