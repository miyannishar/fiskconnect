"use client";

import { useState } from "react";
import { DataCard } from "@/components/shared/DataCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export function AdminUsersClient({ initialProfiles }: { initialProfiles: Profile[] }) {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Profile | null>(null);

  const filtered = initialProfiles.filter(
    (p) => roleFilter === "all" || p.role === roleFilter
  );

  return (
    <div className="space-y-6">
      <DataCard
        title="User directory"
        description="Filter by role and click a row to view details."
      >
        <Tabs value={roleFilter} onValueChange={setRoleFilter} className="w-full">
          <TabsList className="mb-4 w-full justify-start border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="student"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Students
            </TabsTrigger>
            <TabsTrigger
              value="alumni"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Alumni
            </TabsTrigger>
            <TabsTrigger
              value="admin"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Admin
            </TabsTrigger>
          </TabsList>
          <TabsContent value={roleFilter} className="mt-0">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No users match.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="table-crm w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Graduation year</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr
                        key={p.id}
                        className="cursor-pointer"
                        onClick={() => setSelected(p)}
                      >
                        <td className="font-medium">{p.full_name ?? "—"}</td>
                        <td>{p.email}</td>
                        <td>
                          <Badge variant="secondary" className="capitalize">
                            {p.role}
                          </Badge>
                        </td>
                        <td>{p.graduation_year ?? "—"}</td>
                        <td className="text-muted-foreground">{formatDate(p.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DataCard>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card">
          <DialogHeader>
            <DialogTitle>{selected?.full_name ?? selected?.email}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Role:</strong> <Badge variant="secondary" className="capitalize">{selected.role}</Badge></p>
              {selected.graduation_year && <p><strong>Graduation year:</strong> {selected.graduation_year}</p>}
              {selected.major && <p><strong>Major:</strong> {selected.major}</p>}
              {selected.current_title && <p><strong>Title:</strong> {selected.current_title}</p>}
              {selected.current_company && <p><strong>Company:</strong> {selected.current_company}</p>}
              {selected.industry && <p><strong>Industry:</strong> {selected.industry}</p>}
              {selected.location && <p><strong>Location:</strong> {selected.location}</p>}
              {selected.bio && <p><strong>Bio:</strong> {selected.bio}</p>}
              {selected.linkedin_url && (
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a href={selected.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {selected.linkedin_url}
                  </a>
                </p>
              )}
              <p className="pt-2 text-muted-foreground">Joined {formatDate(selected.created_at)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
