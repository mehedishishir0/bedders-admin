"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Upload } from "lucide-react";

interface CreateBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateBannerModal({
  isOpen,
  onClose,
}: CreateBannerModalProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";

      const formData = new FormData();
      if (title) formData.append("title", title);
      if (description) formData.append("description", description);
      if (link) formData.append("link", link);

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (imageUrl) {
        formData.append("image", imageUrl);
      } else {
        throw new Error("Please select an image file or enter an image URL.");
      }

      const res = await fetch(`${backendUrl}/banners`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken || ""}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create banner");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Banner created successfully!");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      resetForm();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLink("");
    setImageUrl("");
    setSelectedFile(null);
    setFilePreview("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#3B386E]">
            Add New Banner
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="title" className="text-xs font-semibold text-gray-700">
              Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. Summer Special Offer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="imageFile" className="text-xs font-semibold text-gray-700">
              Upload Image File
            </Label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="imageFile"
                className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-md cursor-pointer text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                <Upload className="w-4 h-4 text-gray-500" />
                {selectedFile ? selectedFile.name : "Choose image file"}
              </label>
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="imageUrl" className="text-xs font-semibold text-gray-700">
              OR Image URL
            </Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/banner.jpg"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                if (selectedFile) {
                  setSelectedFile(null);
                  setFilePreview("");
                }
              }}
            />
          </div>

          {(filePreview || imageUrl) && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-700">Preview</Label>
              <div className="relative w-full h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={filePreview || imageUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs font-semibold text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Banner description / promotional details..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="link" className="text-xs font-semibold text-gray-700">
              Target Link URL
            </Label>
            <Input
              id="link"
              placeholder="https://example.com/promotions"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#2A6592] hover:bg-[#1f4c70] text-white"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Adding..." : "Add Banner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
