"use client";

import React, { useEffect, useState } from "react";
import { Users, Search, RefreshCw, Heart, Calendar } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchAdminUsers } from "@/store/slices/adminSlice";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingState } from "@/components/ui/LoadingState";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const { users, isLoading } = useAppSelector((state) => state.admin);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(
      fetchAdminUsers({
        page,
        limit: 10,
        search: searchTerm.trim() || undefined,
      })
    );
  }, [dispatch, page, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            User Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            View all registered golfers, assigned roles, charity preferences, and subscription status.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            dispatch(
              fetchAdminUsers({
                page,
                limit: 10,
                search: searchTerm.trim() || undefined,
              })
            )
          }
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <Input
          placeholder="Search by name or email..."
          leftIcon={<Search className="w-4 h-4" />}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Users Table */}
      {isLoading ? (
        <LoadingState message="Fetching user directory..." />
      ) : (
        <Card variant="glass">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Charity Partner</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Joined On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                users.data.map((u) => {
                  const latestSub =
                    u.subscriptions && u.subscriptions.length > 0
                      ? u.subscriptions[0]
                      : null;

                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">
                            {u.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {u.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge status={u.role} size="sm" />
                      </TableCell>
                      <TableCell>
                        {u.charity ? (
                          <div className="flex items-center gap-1.5 text-xs text-rose-300">
                            <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>{u.charity.name}</span>
                            <span className="text-slate-400 text-[11px]">
                              ({u.charityPercentage}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {latestSub ? (
                          <div className="flex items-center gap-2">
                            <Badge status={latestSub.status} size="sm" />
                            <span className="text-xs text-slate-400">
                              {latestSub.plan}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">No Sub</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-400">
                        {formatDate(u.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <Pagination
            pagination={users.pagination}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={isLoading}
          />
        </Card>
      )}
    </div>
  );
}
