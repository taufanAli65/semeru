'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layouts/Header';
import { Sidebar, SidebarItem } from '@/components/layouts/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import {
    LayoutDashboard,
    Users,
    Search,
    Shield,
    Edit2
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { showToast } from '@/lib/notifications';
import api from '@/lib/axios';

interface User {
    user_id: string;
    email: string;
    roles: string[];
    created_at: string;
    user_information?: {
        name: string;
        nim: string;
        program_studi: string;
    };
}

interface Pagination {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
}

export const SuperAdminDashboard = () => {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users'>('dashboard');
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const availableRoles = ['SuperAdmin', 'Admin', 'Mentor', 'Mahasiswa'];

    // Stats (mocked for now as we focus on User Management)
    const stats = {
        totalUsers: users.length || 0,
        activeAdmins: users.filter(u => u.roles.includes('Admin')).length,
        activeMentors: users.filter(u => u.roles.includes('Mentor')).length
    };

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers();
        }
    }, [activeTab]);

    const loadUsers = async (page = 1) => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(search && { search })
            });

            const response = await api.get(`/users?${queryParams}`);

            if (response.data.success) {
                setUsers(response.data.data.users);
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.error('Failed to load users:', error);
            showToast.error('Gagal memuat data pengguna');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadUsers(1);
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setSelectedRoles(user.roles);
    };

    const handleRoleToggle = (role: string) => {
        setSelectedRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };

    const handleSaveRoles = async () => {
        if (!editingUser) return;

        try {
            await api.patch(`/users/${editingUser.user_id}/role`, { roles: selectedRoles });

            showToast.success('Role pengguna berhasil diperbarui');
            setEditingUser(null);
            loadUsers(pagination?.current_page || 1);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Gagal memperbarui role';
            showToast.error(message);
        }
    };

    return (
        <div className="flex h-screen bg-semeru-50">
            <Sidebar>
                <SidebarItem
                    icon={<LayoutDashboard className="h-5 w-5" />}
                    label="Dashboard"
                    isActive={activeTab === 'dashboard'}
                    onClick={() => setActiveTab('dashboard')}
                />
                <SidebarItem
                    icon={<Users className="h-5 w-5" />}
                    label="User Management"
                    isActive={activeTab === 'users'}
                    onClick={() => setActiveTab('users')}
                />
            </Sidebar>

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Header Section */}
                        <div className="bg-linear-to-r from-semeru-800 to-semeru-900 rounded-2xl p-8 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">
                                        Super Admin Console ⚡
                                    </h1>
                                    <p className="text-semeru-200 text-lg">
                                        Manage system access and global configurations.
                                    </p>
                                </div>
                                <Users className="h-16 w-16 text-semeru-400 opacity-50" />
                            </div>
                        </div>

                        {activeTab === 'dashboard' ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="border-semeru-200">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-500">System Users</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-semeru-600">{stats.totalUsers || '-'}</div>
                                        <p className="text-xs text-gray-400 mt-1">Registered accounts</p>
                                    </CardContent>
                                </Card>
                                {/* Placeholders for other stats */}
                            </div>
                        ) : (
                            <Card className="bg-white border-none shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between pb-6">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-800">User Management</CardTitle>
                                        <p className="text-sm text-gray-500 mt-1">Manage user roles and permissions</p>
                                    </div>
                                    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-sm">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search by name or email..."
                                                className="pl-9"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                        <Button type="submit" variant="secondary">
                                            Search
                                        </Button>
                                    </form>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg border border-gray-100 overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                                                <tr>
                                                    <th className="px-6 py-4">User</th>
                                                    <th className="px-6 py-4">Email</th>
                                                    <th className="px-6 py-4">Role</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {users.map((user) => (
                                                    <tr key={user.user_id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{user.user_information?.name || 'Unknown'}</p>
                                                                <p className="text-xs text-gray-500">{user.user_information?.nim || '-'}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${user.roles.includes('SuperAdmin') ? 'bg-purple-100 text-purple-800' :
                                                                    user.roles.includes('Admin') ? 'bg-blue-100 text-blue-800' :
                                                                        user.roles.includes('Mentor') ? 'bg-green-100 text-green-800' :
                                                                            'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {user.roles.join(', ')}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleEditClick(user)}
                                                            >
                                                                <Edit2 className="h-4 w-4 mr-1" />
                                                                Edit Role
                                                            </Button>

                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {pagination && (
                                        <div className="flex items-center justify-between mt-6">
                                            <p className="text-sm text-gray-500">
                                                Showing {(pagination.current_page - 1) * pagination.items_per_page + 1} to {Math.min(pagination.current_page * pagination.items_per_page, pagination.total_items)} of {pagination.total_items} results
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    disabled={pagination.current_page === 1}
                                                    onClick={() => loadUsers(pagination.current_page - 1)}
                                                >
                                                    Previous
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    disabled={pagination.current_page === pagination.total_pages}
                                                    onClick={() => loadUsers(pagination.current_page + 1)}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </main>

                <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)}>
                    <ModalHeader>
                        <h2 className="text-lg font-bold">Edit User Roles</h2>
                        <p className="text-sm text-gray-500">
                            Select roles for {editingUser?.user_information?.name || editingUser?.email}
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <div className="space-y-3">
                            {availableRoles.map(role => (
                                <label key={role} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-semeru-600 rounded border-gray-300 focus:ring-semeru-500"
                                        checked={selectedRoles.includes(role)}
                                        onChange={() => handleRoleToggle(role)}
                                    />
                                    <span className="text-sm font-medium text-gray-700">{role}</span>
                                </label>
                            ))}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={() => setEditingUser(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveRoles}>
                            Save Changes
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
};
