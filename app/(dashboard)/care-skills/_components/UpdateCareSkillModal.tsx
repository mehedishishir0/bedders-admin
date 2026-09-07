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
import { CareSkillItem } from "./CareSkillsTable";

interface UpdateCareSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: CareSkillItem | null;
}

export default function UpdateCareSkillModal({
  isOpen,
  onClose,
  skill,
}: UpdateCareSkillModalProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (skill) {
      setName(skill.name || "");
      setDescription(skill.description || "");
    }
  }, [skill]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!skill) return;
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";

      const res = await fetch(`${backendUrl}/care-skills/${skill.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken || ""}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update care skill");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Care skill updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["care-skills"] });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Skill name is required.");
      return;
    }
    updateMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#3B386E]">
            Edit Care Skill
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="edit-skill-name" className="text-xs font-semibold text-gray-700">
              Skill Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-skill-name"
              placeholder="Skill Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-skill-desc" className="text-xs font-semibold text-gray-700">
              Description (Optional)
            </Label>
            <Textarea
              id="edit-skill-desc"
              placeholder="Description..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
