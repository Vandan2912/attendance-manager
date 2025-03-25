"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Download, File, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  class: string;
  createdAt: Date;
  fileUrl: string;
}

export default function AnnouncementsPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [Classes, setClasses] = useState([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementId, setAnnouncementId] = useState("");
  const [selectedClass, setselectedClass] = useState("");

  const getAnnouncement = (classId: string) => {
    // Add announcement to the server
    fetch("/api/announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId: classId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements(() => [...data.announcement]);
      });
  };

  const getClasses = async () => {
    try {
      const user = sessionStorage.getItem("user");
      const userObj = JSON.parse(user!);
      const res = await fetch(`/api/student/classes?studentId=${userObj._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setClasses(data.classes);
      if (!res.ok) {
        throw new Error(data.error || "Failed to create class");
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
        </div>
      </div>

      <div className="my-4 space-y-2">
        <label className="text-sm font-medium">Class</label>
        <Select
          value={selectedClass}
          onValueChange={(e) => {
            setselectedClass(e);
            getAnnouncement(e);
          }}
        >
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

      <div className="space-y-4">
        {announcements.map((announcement) => (
          // <Card
          //   key={announcement._id}
          //   className="hover:shadow-lg transition-shadow"
          //   onClick={() => setSelectedAnnouncement(announcement)}
          // >
          //   <CardContent className="pt-6">
          //     <div className="flex justify-between items-start">
          //       <div className="space-y-1">
          //         <div className="flex items-center space-x-2">
          //           <h3 className="text-xl font-semibold">{announcement.title}</h3>
          //           <Badge
          //             variant={
          //               announcement.type === "Assignment"
          //                 ? "destructive"
          //                 : announcement.type === "Material"
          //                 ? "secondary"
          //                 : "default"
          //             }
          //           >
          //             {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
          //           </Badge>
          //         </div>
          //         <p className="text-muted-foreground text-sm">
          //           {announcement.course} • {format(announcement.date, "MMM d, yyyy")}
          //         </p>
          //       </div>
          //     </div>
          //     <p className="mt-4">{announcement.content}</p>
          //     {announcement?.attachments && announcement?.attachments?.length > 0 && (
          //       <div className="flex items-center mt-4 space-x-2">
          //         <FileText className="h-4 text-muted-foreground w-4" />
          //         <span className="text-muted-foreground text-sm">
          //           {announcement.attachments.length} attachment{announcement.attachments.length !== 1 ? "s" : ""}
          //         </span>
          //       </div>
          //     )}
          //   </CardContent>
          // </Card>
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
              {selectedAnnouncement?.fileUrl && (
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
                              <h4 className="text-gray-900 font-medium">
                                {selectedAnnouncement?.fileUrl?.substring(9)}
                              </h4>
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
