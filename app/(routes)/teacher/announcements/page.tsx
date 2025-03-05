"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, FileText, Paperclip, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  content: string;
  class: string;
  date: Date;
  attachments: string[];
  type: "general" | "assignment" | "material";
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Mid-term Exam Schedule",
      content:
        "The mid-term examinations will be held from March 15th to March 20th. Please check the detailed schedule below.",
      class: "Advanced Mathematics",
      date: new Date(),
      attachments: ["schedule.pdf"],
      type: "general",
    },
    {
      id: "2",
      title: "Assignment #3 - Linear Algebra",
      content:
        "Please complete the following problems from Chapter 4: 4.1, 4.2, 4.5, 4.8. Submit your solutions by next week.",
      class: "Advanced Mathematics",
      date: new Date(),
      attachments: ["assignment3.pdf"],
      type: "assignment",
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground mt-1">Manage and create announcements for your classes</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-purple-600 hover:bg-purple-700">
          <Megaphone className="mr-2 h-4 w-4" />
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
                  <Input placeholder="Enter announcement title" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Class</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Advanced Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea placeholder="Write your announcement here..." className="min-h-[150px]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Attachments</label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Button variant="outline" className="w-full">
                    <Paperclip className="mr-2 h-4 w-4" />
                    Add Files
                  </Button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700">Publish Announcement</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-semibold">{announcement.title}</h3>
                    <Badge
                      variant={
                        announcement.type === "assignment"
                          ? "destructive"
                          : announcement.type === "material"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {announcement.class} • {format(announcement.date, "MMM d, yyyy")}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-4">{announcement.content}</p>
              {announcement.attachments.length > 0 && (
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
    </div>
  );
}
