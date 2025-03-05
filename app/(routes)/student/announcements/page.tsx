"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileIcon, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Announcement {
  id: string;
  title: string;
  type: "General" | "Assignment" | "Material";
  course: string;
  date: Date;
  content: string;
  attachments?: {
    name: string;
    url: string;
  }[];
}

export default function AnnouncementsPage() {
  const announcements: Announcement[] = [
    {
      id: "1",
      title: "Mid-term Exam Schedule",
      type: "General",
      course: "Advanced Mathematics",
      date: new Date("2025-03-06"),
      content:
        "The mid-term examinations will be held from March 15th to March 20th. Please check the detailed schedule below.",
      attachments: [
        {
          name: "exam_schedule.pdf",
          url: "#",
        },
      ],
    },
    {
      id: "2",
      title: "Assignment #3 - Linear Algebra",
      type: "Assignment",
      course: "Advanced Mathematics",
      date: new Date("2025-03-06"),
      content:
        "Please complete the following problems from Chapter 4: 4.1, 4.2, 4.5, 4.8. Submit your solutions by next week.",
      attachments: [
        {
          name: "assignment3.pdf",
          url: "#",
        },
      ],
    },
  ];

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
        </div>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card
            key={announcement.id}
            className="hover:shadow-lg transition-shadow"
            onClick={() => setSelectedAnnouncement(announcement)}
          >
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-semibold">{announcement.title}</h3>
                    <Badge
                      variant={
                        announcement.type === "Assignment"
                          ? "destructive"
                          : announcement.type === "Material"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {announcement.course} • {format(announcement.date, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <p className="mt-4">{announcement.content}</p>
              {announcement?.attachments && announcement?.attachments?.length > 0 && (
                <div className="mt-4 flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {announcement.attachments.length} attachment{announcement.attachments.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAnnouncement && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <DialogTitle>{selectedAnnouncement.title}</DialogTitle>
                  <Badge variant={selectedAnnouncement.type === "General" ? "secondary" : "destructive"}>
                    {selectedAnnouncement.type}
                  </Badge>
                </div>
                <div className="text-muted-foreground">
                  <p>{selectedAnnouncement.course}</p>
                  <p>{format(selectedAnnouncement.date, "MMMM d, yyyy")}</p>
                </div>
              </DialogHeader>

              <div className="mt-4">
                <p className="text-foreground">{selectedAnnouncement.content}</p>

                {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Attachments</h3>
                    <div className="space-y-2">
                      {selectedAnnouncement.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-md border bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <FileIcon size={20} />
                            <span>{attachment.name}</span>
                          </div>
                          <button
                            onClick={() => window.open(attachment.url, "_blank")}
                            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            <Download size={16} />
                            <span>Download</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
