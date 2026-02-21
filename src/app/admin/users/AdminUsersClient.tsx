"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export function AdminUsersClient({ initialProfiles }: { initialProfiles: Profile[] }) {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Profile | null>(null);

  const filtered = initialProfiles.filter(
    (p) => roleFilter === "all" || p.role === roleFilter
  );

  return (
    <div className="space-y-4">
      <Tabs value={roleFilter} onValueChange={setRoleFilter}>
        <TabsList className="bg-card border border-white/10">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="student">Students</TabsTrigger>
          <TabsTrigger value="alumni">Alumni</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>
        <TabsContent value={roleFilter} className="mt-4">
          <Card className="bg-card border-white/10">
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <p className="p-6 text-muted-foreground">No users match.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-left">
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Email</th>
                        <th className="p-4 font-medium">Role</th>
                        <th className="p-4 font-medium">Graduation year</th>
                        <th className="p-4 font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                          onClick={() => setSelected(p)}
                        >
                          <td className="p-4">{p.full_name ?? "—"}</td>
                          <td className="p-4">{p.email}</td>
                          <td className="p-4 capitalize">{p.role}</td>
                          <td className="p-4">{p.graduation_year ?? "—"}</td>
                          <td className="p-4 text-muted-foreground">
                            {formatDate(p.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-card border-white/10 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.full_name ?? selected?.email}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Role:</strong> {selected.role}</p>
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
              <p className="text-muted-foreground pt-2">Joined {formatDate(selected.created_at)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
