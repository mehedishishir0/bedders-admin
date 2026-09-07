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

interface CreateCareSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCareSkillModal({
  isOpen,
  onClose,
}: CreateCareSkillModalProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createMutation = useMutation({
    mutationFn: async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";

      const res = await fetch(`${backendUrl}/care-skills`, {
        method: "POST",
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
        throw new Error(errorData.message || "Failed to create care skill");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Care skill created successfully!");
      queryClient.invalidateQueries({ queryKey: ["care-skills"] });
      resetForm();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Skill name is required.");
      return;
    }
    createMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#3B386E]">
            Add New Care Skill
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="skill-name" className="text-xs font-semibold text-gray-700">
              Skill Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="skill-name"
              placeholder="e.g. Dementia Care, Medication Administration"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="skill-desc" className="text-xs font-semibold text-gray-700">
              Description (Optional)
            </Label>
            <Textarea
              id="skill-desc"
              placeholder="Brief description of what this care skill entails..."
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
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#2A6592] hover:bg-[#1f4c70] text-white"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Adding..." : "Add Skill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
