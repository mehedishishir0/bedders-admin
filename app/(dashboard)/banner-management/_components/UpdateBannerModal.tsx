"use client";

import React, { useState, useEffect } from "react";
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
import { BannerItem } from "./BannersTable";

interface UpdateBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: BannerItem | null;
}

export default function UpdateBannerModal({
  isOpen,
  onClose,
  banner,
}: UpdateBannerModalProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  useEffect(() => {
    if (banner) {
      setTitle(banner.title || "");
      setDescription(banner.description || "");
      setLink(banner.link || "");
      setImageUrl(banner.image || "");
      setSelectedFile(null);
      setFilePreview("");
    }
  }, [banner]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!banner) return;
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("link", link);

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (imageUrl) {
        formData.append("image", imageUrl);
      }

      const res = await fetch(`${backendUrl}/banners/${banner.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken || ""}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update banner");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Banner updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#3B386E]">
            Edit Banner
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="edit-title" className="text-xs font-semibold text-gray-700">
              Title
            </Label>
            <Input
              id="edit-title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-imageFile" className="text-xs font-semibold text-gray-700">
              Change Image File
            </Label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="edit-imageFile"
                className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-md cursor-pointer text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                <Upload className="w-4 h-4 text-gray-500" />
                {selectedFile ? selectedFile.name : "Choose new image file"}
              </label>
              <input
                id="edit-imageFile"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-imageUrl" className="text-xs font-semibold text-gray-700">
              OR Image URL
            </Label>
            <Input
              id="edit-imageUrl"
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
            <Label htmlFor="edit-description" className="text-xs font-semibold text-gray-700">
              Description
            </Label>
            <Textarea
              id="edit-description"
              placeholder="Banner description..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-link" className="text-xs font-semibold text-gray-700">
              Target Link URL
            </Label>
            <Input
              id="edit-link"
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
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#2A6592] hover:bg-[#1f4c70] text-white"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
