import React, { useState, useEffect, useMemo } from "react";
import { Pencil, Trash2, UserPlus, Users } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Avatar } from "../../components/ui/Avatar";
import { Badge, BadgeVariant } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { FilterBar } from "../../components/ui/FilterBar";
import { IconButton } from "../../components/ui/IconButton";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Pagination } from "../../components/ui/Pagination";
import { Select } from "../../components/ui/Select";
import { Skeleton } from "../../components/ui/Skeleton";
import { useToast } from "../../components/ui/Toast";
import { TableShell, TABLE_CLASSES } from "../../components/dashboard";
import { cn } from "../../lib/cn";
import { ROLE_LABELS } from "../../lib/format";
import { useReveal } from "../../lib/motion";
import { userService } from "../../services/api";
import { User, UserRole } from "../../types";

const PAGE_SIZE = 10;
const ALL = "all";

const ROLE_BADGE: Record<UserRole, BadgeVariant> = {
  ADMIN: "primary",
  GLV: "gold",
  PARENT: "info",
  STUDENT: "neutral",
};

const ROLE_ORDER: UserRole[] = ["ADMIN", "GLV", "PARENT", "STUDENT"];

const ROLE_OPTIONS = ROLE_ORDER.map((role) => ({ value: role, label: ROLE_LABELS[role] }));

const isUserRole = (value: string): value is UserRole => (ROLE_ORDER as string[]).includes(value);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const assignmentLabel = (u: User) =>
  u.assignedClass || (u.childrenIds ? `${u.childrenIds.length} con` : "Toàn hệ thống");

export const UsersManagementPage: React.FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Tạo tài khoản
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newChristianName, setNewChristianName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("GLV");
  const [newClass, setNewClass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();

  // Xóa tài khoản (thao tác không đảo ngược → hộp thoại xác nhận)
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const revealRef = useReveal<HTMLDivElement>({ deps: [loading] });

  const fetchUsers = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await userService.getUsers(roleFilter);
      setUsers(data);
    } catch {
      setLoadError("Kiểm tra kết nối và thử lại.");
      toast.error("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, search]);

  const resetForm = () => {
    setNewName("");
    setNewChristianName("");
    setNewEmail("");
    setNewClass("");
    setNewRole("GLV");
    setNameError(undefined);
    setEmailError(undefined);
  };

  const closeCreateModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setNameError(undefined);
    setEmailError(undefined);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextNameError = newName.trim() ? undefined : "Vui lòng nhập họ và tên.";
    const nextEmailError =
      newEmail.trim() && !EMAIL_PATTERN.test(newEmail.trim()) ? "Email chưa đúng định dạng." : undefined;
    setNameError(nextNameError);
    setEmailError(nextEmailError);
    if (nextNameError || nextEmailError) return;

    setIsSubmitting(true);
    try {
      const created = await userService.createUser({
        name: newName.trim(),
        christianName: newChristianName.trim(),
        email: newEmail.trim(),
        role: newRole,
        assignedClass: newClass.trim(),
      });
      setUsers((prev) => [...prev, created]);
      toast.success(`Đã tạo tài khoản cho ${created.name} (${ROLE_LABELS[created.role]}).`);
      setIsModalOpen(false);
      resetForm();
    } catch {
      toast.error("Có lỗi xảy ra khi tạo người dùng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setDeleting(true);
    try {
      await userService.deleteUser(target.id);
      setUsers((prev) => prev.filter((u) => u.id !== target.id));
      toast.success(`Đã xóa tài khoản ${target.name}.`);
      setPendingDelete(null);
    } catch {
      toast.error("Không thể xóa người dùng.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.christianName && u.christianName.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = Boolean(search) || roleFilter !== "ALL";

  const editUser = (u: User) => toast.info(`Chỉnh sửa tài khoản ${u.name} đang được chuẩn bị.`);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Người dùng"
        description="Quản lý tài khoản Quản trị viên, Giáo lý viên, Phụ huynh và Học sinh"
        actions={
          <Button leftIcon={<UserPlus />} onClick={() => setIsModalOpen(true)}>
            Thêm tài khoản
          </Button>
        }
      />

      <FilterBar
        searchQuery={search}
        searchPlaceholder="Tìm theo tên, email, Tên Thánh"
        onSearchChange={setSearch}
        onSearchClear={() => setSearch("")}
        filters={[
          {
            id: "role",
            label: "Vai trò",
            value: roleFilter === "ALL" ? ALL : roleFilter,
            options: [{ value: ALL, label: "Tất cả vai trò" }, ...ROLE_OPTIONS],
            onChange: (v) => setRoleFilter(isUserRole(v) ? v : "ALL"),
          },
        ]}
        activeFiltersCount={roleFilter !== "ALL" ? 1 : 0}
        onClearAll={() => setRoleFilter("ALL")}
        mobileFilterTitle="Lọc người dùng"
      />

      <div ref={revealRef}>
        {loading ? (
          <Card padding="md" className="space-y-4" role="status" aria-label="Đang tải danh sách người dùng">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton variant="circular" className="size-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3 rounded-full" />
                  <Skeleton className="h-3 w-1/4 rounded-full" />
                </div>
                <Skeleton className="hidden h-6 w-24 rounded-full sm:block" />
              </div>
            ))}
          </Card>
        ) : loadError ? (
          <ErrorState title="Không thể tải danh sách người dùng" message={loadError} onRetry={fetchUsers} />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={<Users />}
            title={hasFilters ? "Không tìm thấy người dùng" : "Chưa có tài khoản nào"}
            description={hasFilters ? "Thử từ khóa khác hoặc chọn vai trò khác." : "Tạo tài khoản đầu tiên để bắt đầu."}
            action={
              hasFilters ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("ALL");
                  }}
                >
                  Xóa bộ lọc
                </Button>
              ) : (
                <Button leftIcon={<UserPlus />} onClick={() => setIsModalOpen(true)}>
                  Thêm tài khoản
                </Button>
              )
            }
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-ink-3" aria-live="polite">
              <span className="font-mono font-semibold text-ink">{filteredUsers.length}</span> tài khoản
              {hasFilters ? " phù hợp" : ""}
            </p>

            {/* Desktop / tablet */}
            <div data-reveal className="hidden md:block">
              <TableShell minWidthClassName="min-w-[48rem]" label="Danh sách người dùng">
                <thead>
                  <tr>
                    <th scope="col" className={TABLE_CLASSES.th}>
                      Người dùng
                    </th>
                    <th scope="col" className={TABLE_CLASSES.th}>
                      Vai trò
                    </th>
                    <th scope="col" className={TABLE_CLASSES.th}>
                      Email
                    </th>
                    <th scope="col" className={TABLE_CLASSES.th}>
                      Phân công
                    </th>
                    <th scope="col" className={cn(TABLE_CLASSES.th, "text-right")}>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagedUsers.map((u) => (
                    <tr key={u.id} className={TABLE_CLASSES.tr}>
                      <td className={TABLE_CLASSES.td}>
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} src={u.avatarUrl || undefined} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-ink">{u.name}</p>
                            {u.christianName && <p className="truncate text-xs text-primary-ink">{u.christianName}</p>}
                          </div>
                        </div>
                      </td>
                      <td className={TABLE_CLASSES.td}>
                        <Badge variant={ROLE_BADGE[u.role]} size="sm">
                          {ROLE_LABELS[u.role]}
                        </Badge>
                      </td>
                      <td className={cn(TABLE_CLASSES.td, "font-mono text-ink-2")}>{u.email || "—"}</td>
                      <td className={cn(TABLE_CLASSES.td, "text-ink-2")}>{assignmentLabel(u)}</td>
                      <td className={cn(TABLE_CLASSES.td, "text-right")}>
                        <div className="flex items-center justify-end gap-1">
                          <IconButton
                            aria-label={`Sửa tài khoản ${u.name}`}
                            variant="ghost"
                            icon={<Pencil />}
                            onClick={() => editUser(u)}
                          />
                          <IconButton
                            aria-label={`Xóa tài khoản ${u.name}`}
                            variant="ghost"
                            icon={<Trash2 />}
                            className="text-danger hover:bg-danger-soft hover:text-danger"
                            onClick={() => setPendingDelete(u)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
            </div>

            {/* Mobile */}
            <ul className="space-y-3 md:hidden">
              {pagedUsers.map((u) => (
                <Card key={u.id} as="li" data-reveal padding="md" className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar name={u.name} src={u.avatarUrl || undefined} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">
                        {u.christianName && <span className="text-primary-ink">{u.christianName} </span>}
                        {u.name}
                      </p>
                      <p className="truncate font-mono text-sm text-ink-3">{u.email || "Chưa có email"}</p>
                    </div>
                    <Badge variant={ROLE_BADGE[u.role]} size="sm">
                      {ROLE_LABELS[u.role]}
                    </Badge>
                  </div>
                  <p className="text-sm text-ink-2">
                    <span className="text-ink-3">Phân công: </span>
                    {assignmentLabel(u)}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Pencil />} className="flex-1" onClick={() => editUser(u)}>
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      leftIcon={<Trash2 />}
                      className="flex-1 text-danger hover:bg-danger-soft hover:text-danger"
                      onClick={() => setPendingDelete(u)}
                    >
                      Xóa
                    </Button>
                  </div>
                </Card>
              ))}
            </ul>

            {filteredUsers.length > PAGE_SIZE && (
              <div className="flex justify-center pt-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredUsers.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tạo tài khoản mới */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeCreateModal}
        title="Thêm tài khoản"
        description="Tài khoản mới có thể đăng nhập ngay với vai trò đã chọn."
        loading={isSubmitting}
        footer={
          <>
            <Button variant="outline" onClick={closeCreateModal} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" form="create-user-form" loading={isSubmitting}>
              Tạo tài khoản
            </Button>
          </>
        }
      >
        <form id="create-user-form" onSubmit={handleCreateUser} noValidate className="space-y-4">
          <Input
            id="new-user-christian-name"
            label="Tên Thánh"
            placeholder="VD: Maria, Giuse, Phanxicô"
            value={newChristianName}
            onChange={setNewChristianName}
          />
          <Input
            id="new-user-name"
            label="Họ và tên"
            placeholder="VD: Nguyễn Văn Nam"
            value={newName}
            required
            error={nameError}
            onChange={(val) => {
              setNewName(val);
              if (nameError) setNameError(undefined);
            }}
          />
          <Input
            id="new-user-email"
            type="email"
            label="Email đăng nhập"
            placeholder="VD: nam.nguyen@kito-vua.edu.vn"
            autoComplete="off"
            value={newEmail}
            error={emailError}
            onChange={(val) => {
              setNewEmail(val);
              if (emailError) setEmailError(undefined);
            }}
          />
          <Select
            id="new-user-role"
            label="Vai trò"
            value={newRole}
            onChange={(v) => setNewRole(isUserRole(v) ? v : "GLV")}
            options={ROLE_OPTIONS}
          />
          <Input
            id="new-user-class"
            label="Lớp phân công"
            placeholder="VD: Lớp 7A"
            helperText="Dành cho Giáo lý viên và Học sinh"
            value={newClass}
            onChange={setNewClass}
          />
        </form>
      </Modal>

      {/* Xác nhận xóa */}
      <Modal
        isOpen={Boolean(pendingDelete)}
        onClose={() => {
          if (!deleting) setPendingDelete(null);
        }}
        title="Xóa tài khoản?"
        description="Hành động này không thể hoàn tác."
        size="sm"
        role="alertdialog"
        loading={deleting}
        footer={
          <>
            <Button variant="outline" onClick={() => setPendingDelete(null)} disabled={deleting}>
              Hủy
            </Button>
            <Button variant="danger" leftIcon={<Trash2 />} loading={deleting} onClick={confirmDelete}>
              Xóa
            </Button>
          </>
        }
      >
        {pendingDelete && (
          <p className="text-base text-ink-2">
            Tài khoản của <span className="font-semibold text-ink">{pendingDelete.name}</span> (
            {ROLE_LABELS[pendingDelete.role]}) sẽ bị xóa khỏi hệ thống.
          </p>
        )}
      </Modal>
    </div>
  );
};
