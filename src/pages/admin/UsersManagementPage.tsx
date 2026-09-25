import React, { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { SearchBar } from "../../components/ui/SearchBar";
import { Select } from "../../components/ui/Select";
import { Skeleton } from "../../components/ui/Skeleton";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toast";
import { userService } from "../../services/api";
import { User, UserRole } from "../../types";

export const UsersManagementPage: React.FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [search, setSearch] = useState("");

  // Create User Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newChristianName, setNewChristianName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("GLV");
  const [newClass, setNewClass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers(roleFilter);
      setUsers(data);
    } catch {
      toast.error("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.warning("Vui lòng nhập họ và tên người dùng.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await userService.createUser({
        name: newName,
        christianName: newChristianName,
        email: newEmail,
        role: newRole,
        assignedClass: newClass,
      });
      setUsers((prev) => [...prev, created]);
      toast.success(`Đã tạo tài khoản cho ${created.name} (${created.role}) thành công!`);
      setIsModalOpen(false);
      setNewName("");
      setNewChristianName("");
      setNewEmail("");
    } catch {
      toast.error("Có lỗi xảy ra khi tạo người dùng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản của ${user.name}?`)) {
      try {
        await userService.deleteUser(user.id);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        toast.success(`Đã xóa tài khoản ${user.name}.`);
      } catch {
        toast.error("Không thể xóa người dùng.");
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      (u.christianName && u.christianName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Quản Lý Tài Khoản & Người Dùng"
        description="Quản trị danh sách tài khoản Quản trị viên, Giáo lý viên, Phụ huynh và Học sinh"
        badge={<Badge variant="primary">Quyền Admin (§1)</Badge>}
        actions={
          <Button
            variant="primary"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Thêm tài khoản mới
          </Button>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[14px] border border-[#E7E5E4] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm theo tên, email, Tên Thánh..."
          />
        </div>

        <div className="w-48">
          <Select
            value={roleFilter}
            onChange={(v) => setRoleFilter(v as any)}
            options={[
              { value: "ALL", label: "Tất cả vai trò" },
              { value: "ADMIN", label: "Quản trị viên (Admin)" },
              { value: "GLV", label: "Giáo lý viên (GLV)" },
              { value: "PARENT", label: "Phụ huynh (Parent)" },
              { value: "STUDENT", label: "Học sinh (Student)" },
            ]}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[16px] border border-[#E7E5E4] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E7E5E4] bg-[#FAFAF9] text-[#57534E]">
                  <th className="py-3 px-4 font-semibold">Người Dùng</th>
                  <th className="py-3 px-4 font-semibold">Vai Trò</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Phân Công / Ghi Chú</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F4]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAFAF9] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1C1917]">
                        {u.christianName && (
                          <span className="text-[#B4232C] mr-1">{u.christianName}</span>
                        )}
                        {u.name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          u.role === "ADMIN"
                            ? "primary"
                            : u.role === "GLV"
                            ? "gold"
                            : "info"
                        }
                        size="sm"
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-[12px] text-[#57534E]">
                      {u.email || "—"}
                    </td>
                    <td className="py-3 px-4 text-[#78716C]">
                      {u.assignedClass || (u.childrenIds ? `${u.childrenIds.length} con` : "Toàn hệ thống")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Chỉnh sửa tài khoản ${u.name}`)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUser(u)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tạo Người Dùng Mới */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm Tài Khoản Người Dùng"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#1C1917] mb-1">
              Tên Thánh (nếu có)
            </label>
            <Input
              placeholder="VD: Maria, Giuse, Phanxicô..."
              value={newChristianName}
              onChange={(val) => setNewChristianName(val)}
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#1C1917] mb-1">
              Họ và tên *
            </label>
            <Input
              placeholder="VD: Nguyễn Văn Nam"
              value={newName}
              onChange={(val) => setNewName(val)}
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#1C1917] mb-1">
              Email đăng nhập
            </label>
            <Input
              type="email"
              placeholder="VD: nam.nguyen@kito-vua.edu.vn"
              value={newEmail}
              onChange={(val) => setNewEmail(val)}
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#1C1917] mb-1">
              Vai trò (Role)
            </label>
            <Select
              value={newRole}
              onChange={(v) => setNewRole(v as any)}
              options={[
                { value: "GLV", label: "Giáo lý viên (GLV)" },
                { value: "ADMIN", label: "Quản trị viên (Admin)" },
                { value: "PARENT", label: "Phụ huynh (Parent)" },
                { value: "STUDENT", label: "Học sinh (Student)" },
              ]}
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#1C1917] mb-1">
              Lớp phân công
            </label>
            <Input
              placeholder="VD: Lớp 7A"
              value={newClass}
              onChange={(val) => setNewClass(val)}
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
            >
              Tạo tài khoản
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
