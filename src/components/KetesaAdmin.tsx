/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Trash2, 
  Plus, 
  Search, 
  MessageSquare, 
  Key, 
  Calendar, 
  Layers, 
  Globe, 
  RefreshCw, 
  UserMinus, 
  UserPlus, 
  HardDrive, 
  Filter, 
  ShieldAlert,
  FolderSync,
  X,
  Check,
  CheckCircle,
  AlertCircle,
  Hash,
  Sliders,
  Sparkles
} from 'lucide-react';
import { MatrixUser, MatrixRoom, MatrixMedia, RegistrationToken, UserRole } from '../types';

interface KetesaAdminProps {
  lang: 'fa' | 'en';
  authToken: string | null;
  currentUser: { role: UserRole; username: string } | null;
  showToast: (type: 'success' | 'error', text: string) => void;
}

const faTranslations = {
  tabUsers: "مدیریت کاربران",
  tabRooms: "مدیریت اتاق‌ها",
  tabMedia: "پاکسازی رسانه (Media Cache)",
  tabTokens: "توکن‌های ثبت‌نام",
  
  // Users
  searchUsers: "جستجوی کاربر (MXID)...",
  allUsers: "همه کاربران",
  adminUsers: "مدیران",
  activeUsers: "فعال",
  deactivatedUsers: "غیرفعال",
  addUserBtn: "ثبت‌نام کاربر جدید",
  username: "نام کاربری",
  mxidLabel: "شناسه ماتریکس (MXID)",
  displayNameLabel: "نام نمایشی",
  passwordLabel: "رمز عبور",
  makeAdminLabel: "دسترسی مدیریت سرور (Synapse Admin)",
  userRoleNormal: "کاربر عادی",
  userRoleAdmin: "مدیر سرور",
  userStatusActive: "فعال",
  userStatusDeactivated: "غیرفعال",
  deactivateBtn: "غیرفعال‌سازی",
  reactivateBtn: "فعال‌سازی و بازنشانی رمز",
  resetPasswordTitle: "رمز عبور جدید",
  
  // Rooms
  searchRooms: "جستجوی اتاق (نام، شناسه، مستعار)...",
  allRooms: "همه اتاق‌ها",
  publicRooms: "عمومی",
  privateRooms: "خصوصی",
  federatedRooms: "فدریتد (خارجی)",
  localRooms: "داخلی",
  createRoomBtn: "ایجاد اتاق جدید",
  roomNameLabel: "نام اتاق",
  roomAliasLabel: "آدرس مستعار (Alias)",
  roomTopicLabel: "موضوع / Topic",
  roomVisibilityLabel: "قابل رویت در دایرکتوری عمومی",
  roomFederationLabel: "اجازه ارتباط با سرورهای خارجی (Federation)",
  roomCreator: "ایجاد کننده",
  roomMembers: "اعضا",
  roomVersion: "نسخه اتاق",
  kickBtn: "اخراج کاربر",
  shutdownRoomBtn: "غیرفعال‌سازی و حذف اتاق",
  purgeRoomLabel: "پاکسازی کامل از دیتابیس (Purge)",
  sendMessageLabel: "ارسال پیام خداحافظی به اعضا قبل از حذف",
  sendMessagePlaceholder: "این اتاق به دلیل عدم رعایت قوانین سرور مسدود گردید.",
  
  // Media
  mediaStatsTitle: "آمار ذخیره‌سازی رسانه‌های ماتریکس",
  totalFiles: "تعداد کل فایل‌ها",
  remoteCacheSize: "حجم فایل‌های کش خارج",
  localFilesSize: "حجم رسانه‌های محلی",
  cleanupCacheBtn: "پاکسازی کش فایل‌های خارجی",
  cleanupAgeBtn: "حذف رسانه‌های قدیمی‌تر از",
  cleanupAgeDays: "روز",
  cleanupDomainBtn: "پاکسازی رسانه‌های دامنه خاص",
  domainPlaceholder: "مثلا matrix.org",
  mediaTableTitle: "فایل‌های رسانه‌ای ذخیره شده",
  searchMedia: "جستجوی فایل یا بارگذاری‌کننده...",
  fileName: "نام فایل",
  fileSize: "حجم",
  uploadedBy: "بارگذاری شده توسط",
  uploadedAt: "تاریخ بارگذاری",
  fileType: "نوع فایل",
  origin: "منشا",
  originLocal: "محلی",
  originRemote: "کش خارجی",
  purgeFileBtn: "حذف دائم فایل",
  
  // Tokens
  tokensTitle: "توکن‌های ثبت‌نام فعال و اختصاصی",
  tokensSubtitle: "استفاده از توکن، محدودیت‌های ثبت‌نام پیش‌فرض را لغو کرده و اجازه ثبت‌نام اختصاصی را می‌دهد.",
  createTokenBtn: "ایجاد توکن ثبت‌نام جدید",
  tokenStringLabel: "کد توکن (اختیاری - خالی برای تولید خودکار)",
  usesAllowedLabel: "تعداد دفعات مجاز استفاده (خالی برای نامحدود)",
  expiryLabel: "تاریخ انقضا (خالی برای بدون انقضا)",
  tokenLabel: "توکن",
  usesAllowed: "مجاز",
  usesCount: "استفاده شده",
  expiryTime: "تاریخ انقضا",
  tokenStatus: "وضعیت",
  revokeBtn: "ابطال توکن",
  unlimited: "نامحدود",
  neverExpired: "بدون انقضا",
  active: "فعال",
  expired: "منقضی شده / پر شده",
  
  // General Buttons & Alerts
  unauthorizedMsg: "دسترسی رد شد: نقش شما به عنوان 'مشاهده‌گر' اجازه مدیریت ماتریکس را نمی‌دهد.",
  loading: "در حال بارگذاری اطلاعات...",
  save: "ذخیره تغییرات",
  cancel: "انصراف",
  delete: "حذف",
  successAction: "عملیات با موفقیت در هسته ماتریکس ثبت گردید.",
  errorAction: "خطا در برقراری ارتباط با هسته Synapse.",
  viewMembers: "مشاهده اعضا",
  memberList: "لیست اعضای اتاق",
  powerLevel: "سطح دسترسی (Power Level)"
};

const enTranslations = {
  tabUsers: "User Management",
  tabRooms: "Room Management",
  tabMedia: "Media Cache Cleanup",
  tabTokens: "Registration Tokens",
  
  // Users
  searchUsers: "Search users by MXID...",
  allUsers: "All Users",
  adminUsers: "Synapse Admins",
  activeUsers: "Active",
  deactivatedUsers: "Deactivated",
  addUserBtn: "Register New User",
  username: "Username",
  mxidLabel: "Matrix ID (MXID)",
  displayNameLabel: "Display Name",
  passwordLabel: "Password",
  makeAdminLabel: "Server Administrator Access (Synapse Admin)",
  userRoleNormal: "Normal User",
  userRoleAdmin: "Server Admin",
  userStatusActive: "Active",
  userStatusDeactivated: "Deactivated",
  deactivateBtn: "Deactivate",
  reactivateBtn: "Reactivate & Reset",
  resetPasswordTitle: "New Password",
  
  // Rooms
  searchRooms: "Search rooms (Name, ID, Alias)...",
  allRooms: "All Rooms",
  publicRooms: "Public",
  privateRooms: "Private",
  federatedRooms: "Federated",
  localRooms: "Local",
  createRoomBtn: "Create New Room",
  roomNameLabel: "Room Name",
  roomAliasLabel: "Room Alias",
  roomTopicLabel: "Room Topic",
  roomVisibilityLabel: "List in server public directory",
  roomFederationLabel: "Allow federation with external servers",
  roomCreator: "Creator",
  roomMembers: "Members",
  roomVersion: "Room Version",
  kickBtn: "Kick User",
  shutdownRoomBtn: "Shutdown & Delete Room",
  purgeRoomLabel: "Permanently purge from server DB",
  sendMessageLabel: "Send farewell block message to room members first",
  sendMessagePlaceholder: "This room has been shut down due to violation of server policy.",
  
  // Media
  mediaStatsTitle: "Matrix Media Storage Analytics",
  totalFiles: "Total File Count",
  remoteCacheSize: "Remote Cached Size",
  localFilesSize: "Local Files Size",
  cleanupCacheBtn: "Purge Remote Cached Media",
  cleanupAgeBtn: "Purge Media Older Than",
  cleanupAgeDays: "days",
  cleanupDomainBtn: "Purge Media of Specific Domain",
  domainPlaceholder: "e.g. matrix.org",
  mediaTableTitle: "Stored Media Files",
  searchMedia: "Search media by name or uploader...",
  fileName: "File Name",
  fileSize: "Size",
  uploadedBy: "Uploaded By",
  uploadedAt: "Uploaded At",
  fileType: "MIME Type",
  origin: "Origin",
  originLocal: "Local Media",
  originRemote: "Remote Cache",
  purgeFileBtn: "Purge File",
  
  // Tokens
  tokensTitle: "Active Registration Tokens",
  tokensSubtitle: "Tokens allow controlled registration bypass matching pre-defined scopes and constraints.",
  createTokenBtn: "Generate Registration Token",
  tokenStringLabel: "Token String (Optional - leave blank for auto-generate)",
  usesAllowedLabel: "Max Uses (Leave blank for unlimited)",
  expiryLabel: "Expiry Date (Leave blank for no expiry)",
  tokenLabel: "Token",
  usesAllowed: "Allowed Uses",
  usesCount: "Uses Count",
  expiryTime: "Expiry Time",
  tokenStatus: "Status",
  revokeBtn: "Revoke Token",
  unlimited: "Unlimited",
  neverExpired: "Never Expired",
  active: "Active",
  expired: "Expired / Full",
  
  // General Buttons & Alerts
  unauthorizedMsg: "Access Denied: Your panel role as 'Viewer' does not permit Matrix server write access.",
  loading: "Syncing Ketesa engine...",
  save: "Save Changes",
  cancel: "Cancel",
  delete: "Delete",
  successAction: "Operation completed successfully on homeserver core.",
  errorAction: "Failed to communicate with Synapse homeserver.",
  viewMembers: "View Members",
  memberList: "Room Members List",
  powerLevel: "Power Level"
};

export default function KetesaAdmin({ lang, authToken, currentUser, showToast }: KetesaAdminProps) {
  const t = lang === 'fa' ? faTranslations : enTranslations;
  const isRtl = lang === 'fa';
  const hasWriteAccess = currentUser?.role !== 'Viewer';

  const [activeTab, setActiveTab] = useState<'users' | 'rooms' | 'media' | 'tokens'>('users');
  const [loading, setLoading] = useState(true);

  // States
  const [users, setUsers] = useState<MatrixUser[]>([]);
  const [rooms, setRooms] = useState<MatrixRoom[]>([]);
  const [media, setMedia] = useState<MatrixMedia[]>([]);
  const [tokens, setTokens] = useState<RegistrationToken[]>([]);

  // Search/Filter states
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'admins' | 'active' | 'deactivated'>('all');

  const [roomSearch, setRoomSearch] = useState('');
  const [roomFilter, setRoomFilter] = useState<'all' | 'public' | 'private' | 'federated' | 'local'>('all');

  const [mediaSearch, setMediaSearch] = useState('');

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', display_name: '', password: '', isAdmin: false });

  const [showReactivateModal, setShowReactivateModal] = useState<string | null>(null); // mxid
  const [reactivatePass, setReactivatePass] = useState('');
  const [reactivateAdmin, setReactivateAdmin] = useState(false);

  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', alias: '', topic: '', isPublic: true, isFederated: true });

  const [showRoomMembersModal, setShowRoomMembersModal] = useState<MatrixRoom | null>(null);

  const [showShutdownRoomModal, setShowShutdownRoomModal] = useState<MatrixRoom | null>(null);
  const [shutdownRoomConfig, setShutdownRoomConfig] = useState({ purge: true, sendMessage: true, messageText: '' });

  const [showCreateTokenModal, setShowCreateTokenModal] = useState(false);
  const [newToken, setNewToken] = useState({ token: '', usesAllowed: '', expiryTime: '' });

  // Bulk Media parameters
  const [cleanupDays, setCleanupDays] = useState('30');
  const [cleanupDomain, setCleanupDomain] = useState('');

  // Initial Fetching
  useEffect(() => {
    fetchAll();
  }, [authToken]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const [usersRes, roomsRes, mediaRes, tokensRes] = await Promise.all([
        fetch('/api/matrix/users', { headers }),
        fetch('/api/matrix/rooms', { headers }),
        fetch('/api/matrix/media', { headers }),
        fetch('/api/matrix/tokens', { headers })
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (roomsRes.ok) setRooms(await roomsRes.json());
      if (mediaRes.ok) setMedia(await mediaRes.json());
      if (tokensRes.ok) setTokens(await tokensRes.json());
    } catch (e) {
      showToast('error', t.errorAction);
    } finally {
      setLoading(false);
    }
  };

  // User Actions
  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasWriteAccess) return showToast('error', t.unauthorizedMsg);
    if (!newUser.username || !newUser.password) return;

    try {
      const res = await fetch('/api/matrix/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
          isAdmin: newUser.isAdmin
        })
      });

      if (res.ok) {
        showToast('success', t.successAction);
        setShowAddUserModal(false);
        setNewUser({ username: '', display_name: '', password: '', isAdmin: false });
        // Refresh users
        const usersData = await fetch('/api/matrix/users', { headers: { 'Authorization': `Bearer ${authToken}` } }).then(r => r.json());
        setUsers(usersData);
      } else {
        const err = await res.json();
        showToast('error', err.error || t.errorAction);
      }
    } catch (e) {
      showToast('error', t.errorAction);
    }
  };

  const handleDeactivateUser = async (mxid: string) => {
    if (!hasWriteAccess) return showToast('error', t.unauthorizedMsg);
    if (!confirm(`Are you sure you want to deactivate ${mxid}?`)) return;

    try {
      const res = await fetch('/api/matrix/users/deactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ mxid })
      });

      if (res.ok) {
        showToast('success', t.successAction);
        const usersData = await res.json();
        setUsers(prev => prev.map(u => u.mxid === mxid ? { ...u, isDeactivated: true } : u));
      } else {
        showToast('error', t.errorAction);
      }
    } catch (e) {
      showToast('error', t.errorAction);
    }
  };

  const handleReactivateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasWriteAccess) return showToast('error', t.unauthorizedMsg);
    if (!showReactivateModal || !reactivatePass) return;

    try {
      const res = await fetch('/api/matrix/users/reactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          mxid: showReactivateModal,
          password: reactivatePass,
          isAdmin: reactivateAdmin
        })
      });

      if (res.ok) {
        showToast('success', t.successAction);
        setShowReactivateModal(null);
        setReactivatePass('');
        // Refresh
        const usersRes = await fetch('/api/matrix/users', { headers: { 'Authorization': `Bearer ${authToken}` } });
        if (usersRes.ok) setUsers(await usersRes.json());
      } else {
        showToast('error', t.errorAction);
      }
    } catch (e) {
      showToast('error', t.errorAction);
    }
  };

  // Room Actions
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasWriteAccess) return showToast('error', t.unauthorizedMsg);
    if (!newRoom.name) return;

    try {
      const res = await fetch('/api/matrix/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: newRoom.name,
          alias: newRoom.alias,
          topic: newRoom.topic,
          isPublic: newRoom.isPublic,
          isFederated: newRoom.isFederated
        })
      });

      if (res.ok) {
        showToast('success', t.successAction);
        setShowCreateRoomModal(false);
        setNewRoom({ name: '', alias: '', topic: '', isPublic: true, isFederated: true });
        const roomsRes = await fetch('/api/matrix/rooms', { headers: { 'Authorization': `Bearer ${authToken}` } });
        if (roomsRes.ok) setRooms(await roomsRes.json());
      } else {
        const err = await res.json();
        showToast('error', err.error || t.errorAction);
      }
    } catch (e) {
      showToast('error', t.errorAction);
    }
  };

  const handleShutdownRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasWriteAccess) return showToast('error', t.unauthorizedMsg);
    if (!showShutdownRoomModal) return;

    try {
      const res = await fetch('/api/matrix/rooms/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          roomId: showShutdownRoomModal.id,
          purge: shutdownRoomConfig.purge,
          sendMessage: shutdownRoomConfig.sendMessage,
          messageText: shutdownRoomConfig.messageText || t.sendMessagePlaceholder
        })
      });

      if (res.ok) {
        showToast('success', t.successAction);
        setShowShutdownRoomModal(null);
        setShutdownRoomConfig({ purge: true, sendMessage: true, messageText: '' });
        // Refresh rooms
        const roomsRes = await fetch('/api/matrix/rooms', { headers: { 'Authorization': `Bearer ${authToken}` } });
        if (roomsRes.ok) setRooms(await roomsRes.json());
      } else {
        showToast('error', t.errorAction);
      }
    } catch (e) {
      showToast('error', t.errorAction);
    }
  };

  const handleKickMember = async (roomId: string, mxid: string) => {
    if (!hasWriteAccess) return showToast('error', t.unauthorizedMsg);
    if (!confirm(`Are you sure you want to kick ${mxid}?`)) return;

    try {
      const res = await fetch('/api/matrix/rooms/members/kick', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ roomId, mxid })
      });

      if (res.ok) {
        showToast('success', t.successAction);
        const data = await res.json();
        
        // Update local state
        setRooms(prev => prev.map(r => r.id === roomId ? data.room : r));
        if (showRoomMembersModal?.id === roomId) {
          setShowRoomMembersModal(data.room);
        }
      } else {
        showToast('error', t.errorAction);
      }
    } catch (e) {
      showToast('error', t.errorAction);
    }
  };

  // Media Actions
  const handlePurgeMediaFile = async (mediaId: string) => {
    if (!hasWriteAccess) return showToast('error', t.unauthorizedMsg);
    if (!confirm(`Are you sure you want to permanently delete media ${mediaId}?`)) return;

    try {
      const res = await fetch('/api/matrix/media/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ mediaId })
      });

      if (res.ok) {
        showToast('success', t.successAction);
        setMedia(prev => prev.filter(m => m.id !== mediaId));
      } else {
        showToast('error', t.errorAction);
      }
    } catch (e) {
      showToast('error', t.errorAction);
    }
  };

  const handleBulkMediaCleanup = async (type: 'remote_cache' | 'by_age' | 'by_domain') => {
    if (!hasWriteAccess) return showToast('error', t.unauthorizedMsg);
    
    let confirmMsg = '';
    let bodyData: any = { type };

    if (type === 'remote_cache') {
      confirmMsg = "Purge all cached remote media files from other homeservers? This operation is non-destructive for local content.";
    } else if (type === 'by_age') {
      const days = parseInt(cleanupDays);
      if (isNaN(days) || days <= 0) return showToast('error', 'Please enter a valid number of days.');
      confirmMsg = `Delete all media items older than ${days} days?`;
      bodyData.days = days;
    } else if (type === 'by_domain') {
      if (!cleanupDomain) return showToast('error', 'Please specify a remote homeserver domain.');
      confirmMsg = `Purge all media items originating from homeserver '${cleanupDomain}'?`;
      bodyData.domain = cleanupDomain;
    }

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch('/api/matrix/media/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(bodyData)
      });

      if (res.ok) {
        const data = await res.json();
        showToast('success', `${t.successAction} Purged ${data.purgedCount} items, reclaimed ${data.reclaimedSizeMB} MB.`);
        // Refresh media list
        const mediaRes = await fetch('/api/matrix/media', { headers: { 'Authorization': `Bearer ${authToken}` } });
        if (mediaRes.ok) setMedia(await mediaRes.json());
      } else {
        showToast('error', t.errorAction);
      }
    } catch (e) {
      showToast('error', t.errorAction);
    }
  };

  // Token Actions
  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasWriteAccess) return showToast('error', t.unauthorizedMsg);
    
    // Auto generate token string if not specified
    const tokenStr = newToken.token || 'MTX-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    try {
      const res = await fetch('/api/matrix/tokens/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          token: tokenStr,
          usesAllowed: newToken.usesAllowed || undefined,
          expiryTime: newToken.expiryTime || undefined
        })
      });

      if (res.ok) {
        showToast('success', t.successAction);
        setShowCreateTokenModal(false);
        setNewToken({ token: '', usesAllowed: '', expiryTime: '' });
        // Refresh tokens list
        const tokensRes = await fetch('/api/matrix/tokens', { headers: { 'Authorization': `Bearer ${authToken}` } });
        if (tokensRes.ok) setTokens(await tokensRes.json());
      } else {
        const err = await res.json();
        showToast('error', err.error || t.errorAction);
      }
    } catch (e) {
      showToast('error', t.errorAction);
    }
  };

  const handleRevokeToken = async (tokenStr: string) => {
    if (!hasWriteAccess) return showToast('error', t.unauthorizedMsg);
    if (!confirm(`Are you sure you want to revoke token ${tokenStr}?`)) return;

    try {
      const res = await fetch('/api/matrix/tokens/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ token: tokenStr })
      });

      if (res.ok) {
        showToast('success', t.successAction);
        setTokens(prev => prev.filter(t => t.token !== tokenStr));
      } else {
        showToast('error', t.errorAction);
      }
    } catch (e) {
      showToast('error', t.errorAction);
    }
  };

  // Filtering Logic
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.mxid.toLowerCase().includes(userSearch.toLowerCase()) || 
                          (u.displayName && u.displayName.toLowerCase().includes(userSearch.toLowerCase()));
    if (!matchesSearch) return false;
    if (userFilter === 'admins') return u.isAdmin;
    if (userFilter === 'active') return !u.isDeactivated;
    if (userFilter === 'deactivated') return u.isDeactivated;
    return true;
  });

  const filteredRooms = rooms.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(roomSearch.toLowerCase()) || 
                          r.id.toLowerCase().includes(roomSearch.toLowerCase()) ||
                          (r.alias && r.alias.toLowerCase().includes(roomSearch.toLowerCase()));
    if (!matchesSearch) return false;
    if (roomFilter === 'public') return r.isPublic;
    if (roomFilter === 'private') return !r.isPublic;
    if (roomFilter === 'federated') return r.isFederated;
    if (roomFilter === 'local') return !r.isFederated;
    return true;
  });

  const filteredMedia = media.filter(m => {
    return (m.fileName && m.fileName.toLowerCase().includes(mediaSearch.toLowerCase())) ||
           m.id.toLowerCase().includes(mediaSearch.toLowerCase()) ||
           m.uploadedBy.toLowerCase().includes(mediaSearch.toLowerCase()) ||
           m.mimeType.toLowerCase().includes(mediaSearch.toLowerCase());
  });

  // Calculate Media stats
  const totalFilesCount = media.length;
  const remoteCachedSizeB = media.filter(m => m.isCached).reduce((acc, curr) => acc + curr.fileSize, 0);
  const localSizeB = media.filter(m => !m.isCached).reduce((acc, curr) => acc + curr.fileSize, 0);
  const totalCachedSizeMB = (remoteCachedSizeB / 1024 / 1024).toFixed(2);
  const totalLocalSizeMB = (localSizeB / 1024 / 1024).toFixed(2);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <RefreshCw className="h-10 w-10 animate-spin text-indigo-400 mb-4" />
        <p className="font-mono text-sm">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`} id="ketesa-container">
      {/* Tab Navigation Dock */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/5 max-w-max">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-200 shadow-md'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
          }`}
          id="tab-users-btn"
        >
          <Users className="h-4 w-4" />
          <span>{t.tabUsers}</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded-full font-mono text-indigo-300">
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'rooms'
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-200 shadow-md'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
          }`}
          id="tab-rooms-btn"
        >
          <Layers className="h-4 w-4" />
          <span>{t.tabRooms}</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded-full font-mono text-purple-300">
            {rooms.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'media'
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-200 shadow-md'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
          }`}
          id="tab-media-btn"
        >
          <HardDrive className="h-4 w-4" />
          <span>{t.tabMedia}</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded-full font-mono text-amber-300">
            {totalCachedSizeMB} MB
          </span>
        </button>

        <button
          onClick={() => setActiveTab('tokens')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'tokens'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-200 shadow-md'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
          }`}
          id="tab-tokens-btn"
        >
          <Key className="h-4 w-4" />
          <span>{t.tabTokens}</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded-full font-mono text-emerald-300">
            {tokens.length}
          </span>
        </button>
      </div>

      {/* Dynamic Content Views */}
      <AnimatePresence mode="wait">
        {/* TAB 1: USERS */}
        {activeTab === 'users' && (
          <motion.div
            key="users-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            {/* Search, Filter & Actions rail */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-slate-900/25 p-4 rounded-xl border border-white/5">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} h-4 w-4 text-gray-500`} />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder={t.searchUsers}
                    className="w-full bg-slate-950/60 border border-white/5 hover:border-indigo-500/30 focus:border-indigo-500/80 rounded-lg py-2 px-4 text-sm font-mono text-gray-200 outline-none transition-all duration-300"
                  />
                </div>

                <div className="flex p-0.5 bg-slate-950/40 rounded-lg border border-white/5 text-xs font-medium">
                  {(['all', 'admins', 'active', 'deactivated'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setUserFilter(f)}
                      className={`px-3 py-1.5 rounded-md transition-all duration-300 ${
                        userFilter === f 
                          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {f === 'all' && t.allUsers}
                      {f === 'admins' && t.adminUsers}
                      {f === 'active' && t.activeUsers}
                      {f === 'deactivated' && t.deactivatedUsers}
                    </button>
                  ))}
                </div>
              </div>

              {hasWriteAccess && (
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all duration-300 shadow-md"
                  id="add-user-btn"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{t.addUserBtn}</span>
                </button>
              )}
            </div>

            {/* Users Table */}
            <div className="bg-slate-900/30 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-950/30 text-gray-400 text-xs uppercase tracking-wider font-mono">
                      <th className="py-3 px-4 text-center w-14">#</th>
                      <th className={`py-3 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>{t.mxidLabel}</th>
                      <th className={`py-3 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>{t.displayNameLabel}</th>
                      <th className="py-3 px-4 text-center">{t.tokenStatus}</th>
                      <th className="py-3 px-4 text-center">{t.userRoleAdmin}</th>
                      <th className="py-3 px-4 text-center w-40">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm font-medium">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-gray-500 font-mono">
                          No Matrix users matched your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u, i) => (
                        <tr key={u.mxid} className="hover:bg-white/5 transition-all duration-200">
                          <td className="py-3 px-4 text-center font-mono text-gray-500">{i + 1}</td>
                          <td className={`py-3 px-4 text-gray-200 font-mono ${isRtl ? 'text-right' : 'text-left'}`}>{u.mxid}</td>
                          <td className={`py-3 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                            <div className="flex items-center gap-2">
                              {u.avatarUrl && (
                                <img src={u.avatarUrl} alt="" className="h-6 w-6 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                              )}
                              <span className="text-gray-300 font-sans">{u.displayName || u.mxid.split(':')[0].replace('@', '')}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium ${
                              u.isDeactivated 
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {u.isDeactivated ? t.userStatusDeactivated : t.userStatusActive}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium ${
                              u.isAdmin 
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                                : 'bg-slate-500/10 text-gray-400 border border-white/5'
                            }`}>
                              {u.isAdmin ? t.userRoleAdmin : t.userRoleNormal}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center items-center gap-2">
                              {hasWriteAccess ? (
                                u.isDeactivated ? (
                                  <button
                                    onClick={() => {
                                      setShowReactivateModal(u.mxid);
                                      setReactivateAdmin(u.isAdmin);
                                    }}
                                    className="px-2.5 py-1 text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded font-medium transition-all duration-200"
                                  >
                                    {t.reactivateBtn.split(' ')[0]}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleDeactivateUser(u.mxid)}
                                    className="px-2.5 py-1 text-xs bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded font-medium transition-all duration-200"
                                  >
                                    {t.deactivateBtn}
                                  </button>
                                )
                              ) : (
                                <span className="text-xs text-gray-500 font-mono">-</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: ROOMS */}
        {activeTab === 'rooms' && (
          <motion.div
            key="rooms-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
          >
            {/* Search, Filter & Actions rail */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-slate-900/25 p-4 rounded-xl border border-white/5">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} h-4 w-4 text-gray-500`} />
                  <input
                    type="text"
                    value={roomSearch}
                    onChange={(e) => setRoomSearch(e.target.value)}
                    placeholder={t.searchRooms}
                    className="w-full bg-slate-950/60 border border-white/5 hover:border-purple-500/30 focus:border-purple-500/80 rounded-lg py-2 px-4 text-sm font-mono text-gray-200 outline-none transition-all duration-300"
                  />
                </div>

                <div className="flex p-0.5 bg-slate-950/40 rounded-lg border border-white/5 text-xs font-medium flex-wrap gap-1">
                  {(['all', 'public', 'private', 'federated', 'local'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setRoomFilter(f)}
                      className={`px-2.5 py-1.5 rounded transition-all duration-300 ${
                        roomFilter === f 
                          ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {f === 'all' && t.allRooms}
                      {f === 'public' && t.publicRooms}
                      {f === 'private' && t.privateRooms}
                      {f === 'federated' && t.federatedRooms}
                      {f === 'local' && t.localRooms}
                    </button>
                  ))}
                </div>
              </div>

              {hasWriteAccess && (
                <button
                  onClick={() => setShowCreateRoomModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm rounded-lg transition-all duration-300 shadow-md"
                  id="create-room-btn"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t.createRoomBtn}</span>
                </button>
              )}
            </div>

            {/* Rooms Cards Grid / List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredRooms.length === 0 ? (
                <div className="col-span-full bg-slate-900/15 border border-white/5 rounded-xl py-12 text-center text-gray-500 font-mono">
                  No rooms matched your parameters.
                </div>
              ) : (
                filteredRooms.map(r => (
                  <div
                    key={r.id}
                    className="relative flex flex-col justify-between p-5 bg-gradient-to-b from-slate-900/40 to-slate-950/40 border border-white/5 rounded-xl hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 group"
                  >
                    <div>
                      {/* Name & ID row */}
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-purple-400 flex-shrink-0" />
                          <h4 className="font-semibold text-gray-200 leading-tight tracking-tight group-hover:text-purple-300 transition-colors duration-200">
                            {r.name}
                          </h4>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase border ${
                            r.isPublic 
                              ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' 
                              : 'bg-red-500/5 text-red-400 border-red-500/10'
                          }`}>
                            {r.isPublic ? t.publicRooms : t.privateRooms}
                          </span>
                          {r.isFederated && (
                            <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase bg-indigo-500/5 text-indigo-400 border border-indigo-500/10">
                              {t.federatedRooms}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Alias */}
                      {r.alias && (
                        <p className="text-xs text-purple-400 font-mono select-all mb-2">{r.alias}</p>
                      )}

                      {/* Topic */}
                      <p className="text-xs text-gray-400 line-clamp-2 min-h-[32px] mb-4">
                        {r.topic || <span className="italic opacity-60">No topic assigned for this room.</span>}
                      </p>

                      {/* Meta stats */}
                      <div className="grid grid-cols-3 gap-2 border-t border-b border-white/5 py-2.5 mb-4 text-xs font-mono text-gray-400">
                        <div>
                          <span className="block text-[10px] text-gray-500 uppercase">{t.roomCreator}</span>
                          <span className="truncate block font-medium max-w-full text-gray-300 select-all">{r.creator}</span>
                        </div>
                        <div className="text-center border-l border-r border-white/5">
                          <span className="block text-[10px] text-gray-500 uppercase">{t.roomMembers}</span>
                          <span className="block text-indigo-300 font-bold">{r.membersCount}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] text-gray-500 uppercase">{t.roomVersion}</span>
                          <span className="block text-gray-300 font-medium">{r.version}</span>
                        </div>
                      </div>
                    </div>

                    {/* Room actions footer */}
                    <div className="flex justify-between items-center gap-2">
                      <button
                        onClick={() => setShowRoomMembersModal(r)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-850 hover:bg-slate-800 text-gray-300 border border-white/5 rounded-lg transition-colors duration-200"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>{t.viewMembers}</span>
                      </button>

                      {hasWriteAccess && (
                        <button
                          onClick={() => setShowShutdownRoomModal(r)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/25 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{t.shutdownRoomBtn.split(' ')[0]}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: MEDIA */}
        {activeTab === 'media' && (
          <motion.div
            key="media-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Quick Analytics & Stats widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/35 border border-white/5 rounded-xl p-5 flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/15">
                  <Sliders className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-xs font-mono text-gray-500 uppercase">{t.totalFiles}</span>
                  <span className="block text-2xl font-bold font-mono text-gray-100">{totalFilesCount}</span>
                </div>
              </div>

              <div className="bg-slate-900/35 border border-white/5 rounded-xl p-5 flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400 border border-orange-500/15">
                  <HardDrive className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-xs font-mono text-gray-500 uppercase">{t.remoteCacheSize}</span>
                  <span className="block text-2xl font-bold font-mono text-amber-300">{totalCachedSizeMB} MB</span>
                </div>
              </div>

              <div className="bg-slate-900/35 border border-white/5 rounded-xl p-5 flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/15">
                  <FolderSync className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-xs font-mono text-gray-500 uppercase">{t.localFilesSize}</span>
                  <span className="block text-2xl font-bold font-mono text-indigo-300">{totalLocalSizeMB} MB</span>
                </div>
              </div>
            </div>

            {/* Bulk actions panel */}
            {hasWriteAccess && (
              <div className="bg-slate-900/20 border border-white/5 rounded-xl p-5 space-y-4">
                <h4 className="font-semibold text-gray-200 text-sm flex items-center gap-2 border-b border-white/5 pb-2">
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                  <span>Interactive Cleanup Controls</span>
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                  {/* Option 1: purge remote cache */}
                  <div className="bg-slate-950/40 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <h5 className="font-medium text-amber-300 mb-1">{t.cleanupCacheBtn}</h5>
                      <p className="text-xs text-gray-400 mb-4">Cleans up remote files that haven't been accessed in a while from Synapse cache storage.</p>
                    </div>
                    <button
                      onClick={() => handleBulkMediaCleanup('remote_cache')}
                      className="w-full text-center py-2 bg-amber-600/15 hover:bg-amber-600/25 border border-amber-500/30 hover:border-amber-500/50 text-amber-300 rounded-lg font-medium transition-all duration-200"
                    >
                      Purge Remote Cache
                    </button>
                  </div>

                  {/* Option 2: Purge by Age */}
                  <div className="bg-slate-950/40 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <h5 className="font-medium text-orange-300 mb-1">{t.cleanupAgeBtn}</h5>
                      <p className="text-xs text-gray-400 mb-3">Removes all media uploads (both local & remote cache) that are older than specified age.</p>
                      <div className="flex items-center gap-2 mb-4">
                        <input
                          type="number"
                          value={cleanupDays}
                          onChange={(e) => setCleanupDays(e.target.value)}
                          className="w-20 bg-slate-900 border border-white/5 rounded px-2.5 py-1 text-center font-mono text-gray-200 text-xs focus:outline-none focus:border-orange-500"
                        />
                        <span className="text-xs text-gray-400">{t.cleanupAgeDays}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBulkMediaCleanup('by_age')}
                      className="w-full text-center py-2 bg-orange-600/15 hover:bg-orange-600/25 border border-orange-500/30 hover:border-orange-500/50 text-orange-300 rounded-lg font-medium transition-all duration-200"
                    >
                      Delete Old Media
                    </button>
                  </div>

                  {/* Option 3: Purge by Domain */}
                  <div className="bg-slate-950/40 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                    <div>
                      <h5 className="font-medium text-red-300 mb-1">{t.cleanupDomainBtn}</h5>
                      <p className="text-xs text-gray-400 mb-3">Purges all federated media cached from a specific remote Matrix homeserver domain.</p>
                      <input
                        type="text"
                        value={cleanupDomain}
                        onChange={(e) => setCleanupDomain(e.target.value)}
                        placeholder={t.domainPlaceholder}
                        className="w-full bg-slate-900 border border-white/5 rounded px-2.5 py-1.5 font-mono text-gray-200 text-xs focus:outline-none focus:border-red-500 mb-4"
                      />
                    </div>
                    <button
                      onClick={() => handleBulkMediaCleanup('by_domain')}
                      className="w-full text-center py-2 bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 hover:border-red-500/50 text-red-300 rounded-lg font-medium transition-all duration-200"
                    >
                      Purge Domain Media
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Media Table */}
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
                <h4 className="font-semibold text-gray-200 text-sm font-sans">{t.mediaTableTitle}</h4>
                <div className="relative min-w-[280px]">
                  <Search className={`absolute top-2.5 ${isRtl ? 'left-3' : 'right-3'} h-4 w-4 text-gray-500`} />
                  <input
                    type="text"
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    placeholder={t.searchMedia}
                    className="w-full bg-slate-950/60 border border-white/5 hover:border-amber-500/30 focus:border-amber-500/80 rounded-lg py-2 px-4 text-sm font-sans text-gray-200 outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="bg-slate-900/30 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-slate-950/30 text-gray-400 text-xs uppercase tracking-wider font-mono">
                        <th className="py-3 px-4 text-center w-14">#</th>
                        <th className={`py-3 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>{t.fileName}</th>
                        <th className={`py-3 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>MXC ID</th>
                        <th className="py-3 px-4 text-center">{t.fileSize}</th>
                        <th className={`py-3 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>{t.uploadedBy}</th>
                        <th className="py-3 px-4 text-center">{t.origin}</th>
                        <th className="py-3 px-4 text-center w-28">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm font-medium">
                      {filteredMedia.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-gray-500 font-mono">
                            No stored media files matching search parameters.
                          </td>
                        </tr>
                      ) : (
                        filteredMedia.map((m, i) => (
                          <tr key={m.id} className="hover:bg-white/5 transition-all duration-200">
                            <td className="py-3 px-4 text-center font-mono text-gray-500">{i + 1}</td>
                            <td className={`py-3 px-4 text-gray-200 ${isRtl ? 'text-right' : 'text-left'}`}>
                              <span className="block font-sans max-w-[160px] truncate" title={m.fileName || 'unnamed'}>
                                {m.fileName || <span className="italic text-gray-500 text-xs">unnamed</span>}
                              </span>
                              <span className="block text-[10px] text-gray-500 font-mono truncate">{m.mimeType}</span>
                            </td>
                            <td className={`py-3 px-4 text-purple-400 font-mono select-all text-xs max-w-[160px] truncate ${isRtl ? 'text-right' : 'text-left'}`} title={m.id}>
                              {m.id}
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-gray-300">
                              {(m.fileSize / 1024 / 1024).toFixed(2)} MB
                            </td>
                            <td className={`py-3 px-4 text-gray-400 font-mono truncate text-xs ${isRtl ? 'text-right' : 'text-left'}`} title={m.uploadedBy}>
                              {m.uploadedBy}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                                m.isCached 
                                  ? 'bg-orange-500/5 text-orange-400 border border-orange-500/10' 
                                  : 'bg-indigo-500/5 text-indigo-400 border border-indigo-500/10'
                              }`}>
                                {m.isCached ? t.originRemote : t.originLocal}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {hasWriteAccess ? (
                                <button
                                  onClick={() => handlePurgeMediaFile(m.id)}
                                  className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/15 rounded transition-all duration-200"
                                  title={t.purgeFileBtn}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              ) : (
                                <span className="text-gray-600 font-mono">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: TOKENS */}
        {activeTab === 'tokens' && (
          <motion.div
            key="tokens-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header banner explaining tokens */}
            <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 p-5 rounded-xl flex items-start gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg flex-shrink-0 border border-emerald-500/20">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-semibold text-gray-200 text-sm leading-none">{t.tokensTitle}</h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-4xl">{t.tokensSubtitle}</p>
              </div>

              {hasWriteAccess && (
                <button
                  onClick={() => setShowCreateTokenModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors duration-200 shadow-md flex-shrink-0"
                  id="create-token-btn"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{t.createTokenBtn.split(' ')[0]}</span>
                </button>
              )}
            </div>

            {/* Tokens table/list */}
            <div className="bg-slate-900/30 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-950/30 text-gray-400 text-xs uppercase tracking-wider font-mono">
                      <th className="py-3 px-4 text-center w-14">#</th>
                      <th className={`py-3 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>{t.tokenLabel}</th>
                      <th className="py-3 px-4 text-center">{t.usesAllowed}</th>
                      <th className="py-3 px-4 text-center">{t.usesCount}</th>
                      <th className={`py-3 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>{t.expiryTime}</th>
                      <th className="py-3 px-4 text-center">{t.tokenStatus}</th>
                      <th className="py-3 px-4 text-center w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm font-medium">
                    {tokens.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-gray-500 font-mono">
                          No active registration tokens found.
                        </td>
                      </tr>
                    ) : (
                      tokens.map((tk, i) => {
                        const isExpired = tk.expiryTime && new Date(tk.expiryTime).getTime() < Date.now();
                        const isFull = tk.usesAllowed && tk.usesCount >= tk.usesAllowed;
                        const isTokenActive = tk.isActive && !isExpired && !isFull;

                        return (
                          <tr key={tk.token} className="hover:bg-white/5 transition-all duration-200">
                            <td className="py-3 px-4 text-center font-mono text-gray-500">{i + 1}</td>
                            <td className={`py-3 px-4 text-emerald-400 font-mono select-all text-sm font-semibold tracking-wide ${isRtl ? 'text-right' : 'text-left'}`}>
                              {tk.token}
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-gray-300">
                              {tk.usesAllowed || <span className="opacity-50">{t.unlimited}</span>}
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-indigo-300">
                              {tk.usesCount}
                            </td>
                            <td className={`py-3 px-4 font-mono text-gray-400 text-xs ${isRtl ? 'text-right' : 'text-left'}`}>
                              {tk.expiryTime ? new Date(tk.expiryTime).toLocaleString() : <span className="opacity-50">{t.neverExpired}</span>}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${
                                isTokenActive 
                                  ? 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/10' 
                                  : 'bg-red-500/5 text-red-400 border border-red-500/10'
                              }`}>
                                {isTokenActive ? t.active : t.expired}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {hasWriteAccess ? (
                                <button
                                  onClick={() => handleRevokeToken(tk.token)}
                                  className="px-2 py-1 text-xs bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/25 rounded transition-all duration-200 font-medium"
                                >
                                  {t.revokeBtn.split(' ')[0]}
                                </button>
                              ) : (
                                <span className="text-gray-600 font-mono">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL 1: ADD MATRIX USER */}
      {/* ========================================== */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl relative space-y-4"
              id="add-user-modal"
            >
              <button
                onClick={() => setShowAddUserModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2 border-b border-white/5 pb-2">
                <UserPlus className="h-5 w-5 text-indigo-400" />
                <span>{t.addUserBtn}</span>
              </h3>

              <form onSubmit={handleRegisterUser} className="space-y-4 text-sm font-medium">
                <div className="space-y-1">
                  <label className="block text-xs text-gray-400">{t.username}</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="e.g. masoud"
                    required
                    className="w-full bg-slate-950/60 border border-white/5 focus:border-indigo-500 rounded-lg p-2.5 outline-none text-gray-200 font-mono text-xs transition-colors duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-gray-400">{t.passwordLabel}</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="w-full bg-slate-950/60 border border-white/5 focus:border-indigo-500 rounded-lg p-2.5 outline-none text-gray-200 font-mono text-xs transition-colors duration-200"
                  />
                </div>

                <div className="flex items-center gap-3 bg-slate-950/30 p-3 rounded-lg border border-white/5 mt-2">
                  <input
                    type="checkbox"
                    id="user-is-admin-cb"
                    checked={newUser.isAdmin}
                    onChange={(e) => setNewUser(prev => ({ ...prev, isAdmin: e.target.checked }))}
                    className="h-4 w-4 rounded border-white/10 bg-slate-900 text-indigo-600 focus:ring-0"
                  />
                  <label htmlFor="user-is-admin-cb" className="text-xs text-gray-300 leading-tight select-none">
                    {t.makeAdminLabel}
                  </label>
                </div>

                <div className="flex justify-end gap-2 border-t border-white/5 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg text-xs transition-colors duration-200"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs transition-colors duration-200 shadow-md"
                  >
                    {t.addUserBtn.split(' ')[0]}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL 2: REACTIVATE USER & RESET PASS */}
      {/* ========================================== */}
      <AnimatePresence>
        {showReactivateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl relative space-y-4"
              id="reactivate-modal"
            >
              <button
                onClick={() => {
                  setShowReactivateModal(null);
                  setReactivatePass('');
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 border-b border-white/5 pb-2">
                <RefreshCw className="h-5 w-5 animate-spin-slow" />
                <span>Reactivate Matrix User</span>
              </h3>

              <p className="text-xs text-gray-400 font-mono">
                MXID: <span className="text-indigo-300">{showReactivateModal}</span>
              </p>

              <form onSubmit={handleReactivateUser} className="space-y-4 text-sm font-medium">
                <div className="space-y-1">
                  <label className="block text-xs text-gray-400">{t.resetPasswordTitle}</label>
                  <input
                    type="password"
                    value={reactivatePass}
                    onChange={(e) => setReactivatePass(e.target.value)}
                    required
                    placeholder="Enter new account password"
                    className="w-full bg-slate-950/60 border border-white/5 focus:border-emerald-500 rounded-lg p-2.5 outline-none text-gray-200 font-mono text-xs transition-colors duration-200"
                  />
                </div>

                <div className="flex items-center gap-3 bg-slate-950/30 p-3 rounded-lg border border-white/5 mt-2">
                  <input
                    type="checkbox"
                    id="reactivate-is-admin-cb"
                    checked={reactivateAdmin}
                    onChange={(e) => setReactivateAdmin(e.target.checked)}
                    className="h-4 w-4 rounded border-white/10 bg-slate-900 text-emerald-600 focus:ring-0"
                  />
                  <label htmlFor="reactivate-is-admin-cb" className="text-xs text-gray-300 leading-tight select-none">
                    {t.makeAdminLabel}
                  </label>
                </div>

                <div className="flex justify-end gap-2 border-t border-white/5 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReactivateModal(null);
                      setReactivatePass('');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg text-xs transition-colors duration-200"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs transition-colors duration-200 shadow-md"
                  >
                    Reactivate Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL 3: CREATE ROOM */}
      {/* ========================================== */}
      <AnimatePresence>
        {showCreateRoomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl relative space-y-4"
              id="create-room-modal"
            >
              <button
                onClick={() => setShowCreateRoomModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2 border-b border-white/5 pb-2">
                <Plus className="h-5 w-5" />
                <span>{t.createRoomBtn}</span>
              </h3>

              <form onSubmit={handleCreateRoom} className="space-y-4 text-sm font-medium">
                <div className="space-y-1">
                  <label className="block text-xs text-gray-400">{t.roomNameLabel}</label>
                  <input
                    type="text"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Sales Division"
                    required
                    className="w-full bg-slate-950/60 border border-white/5 focus:border-purple-500 rounded-lg p-2.5 outline-none text-gray-200 text-xs transition-colors duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-gray-400">{t.roomAliasLabel} (alias)</label>
                  <input
                    type="text"
                    value={newRoom.alias}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, alias: e.target.value }))}
                    placeholder="e.g. sales (produces #sales:domain.com)"
                    className="w-full bg-slate-950/60 border border-white/5 focus:border-purple-500 rounded-lg p-2.5 outline-none text-gray-200 font-mono text-xs transition-colors duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-gray-400">{t.roomTopicLabel}</label>
                  <textarea
                    value={newRoom.topic}
                    onChange={(e) => setNewRoom(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="Optional topic statement"
                    rows={2}
                    className="w-full bg-slate-950/60 border border-white/5 focus:border-purple-500 rounded-lg p-2.5 outline-none text-gray-200 text-xs transition-colors duration-200 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2.5 bg-slate-950/30 p-3 rounded-lg border border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="room-public-cb"
                      checked={newRoom.isPublic}
                      onChange={(e) => setNewRoom(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="h-4 w-4 rounded border-white/10 bg-slate-900 text-purple-600 focus:ring-0"
                    />
                    <label htmlFor="room-public-cb" className="text-gray-300 leading-tight select-none">
                      {t.roomVisibilityLabel}
                    </label>
                  </div>

                  <div className="flex items-center gap-3 border-t border-white/5 pt-2.5">
                    <input
                      type="checkbox"
                      id="room-federated-cb"
                      checked={newRoom.isFederated}
                      onChange={(e) => setNewRoom(prev => ({ ...prev, isFederated: e.target.checked }))}
                      className="h-4 w-4 rounded border-white/10 bg-slate-900 text-purple-600 focus:ring-0"
                    />
                    <label htmlFor="room-federated-cb" className="text-gray-300 leading-tight select-none">
                      {t.roomFederationLabel}
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-white/5 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateRoomModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg text-xs transition-colors duration-200"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs transition-colors duration-200 shadow-md"
                  >
                    {t.createRoomBtn.split(' ')[0]}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL 4: VIEW MEMBERS */}
      {/* ========================================== */}
      <AnimatePresence>
        {showRoomMembersModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg p-6 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl relative space-y-4"
              id="room-members-modal"
            >
              <button
                onClick={() => setShowRoomMembersModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2 border-b border-white/5 pb-2">
                <Users className="h-5 w-5 text-indigo-400" />
                <span>{t.memberList} ({showRoomMembersModal.joinedMembers.length})</span>
              </h3>

              <p className="text-xs text-purple-400 font-mono">
                {showRoomMembersModal.name}
              </p>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {showRoomMembersModal.joinedMembers.map((m) => (
                  <div
                    key={m.mxid}
                    className="flex justify-between items-center p-3 bg-slate-950/30 border border-white/5 rounded-lg text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono text-gray-400">
                        @
                      </span>
                      <div>
                        <span className="block text-gray-200 font-mono text-xs truncate max-w-[180px] md:max-w-[240px]" title={m.mxid}>
                          {m.mxid}
                        </span>
                        <span className="block text-[10px] text-gray-500 font-mono">
                          PL: <span className="text-indigo-400 font-bold">{m.powerLevel}</span> ({m.role})
                        </span>
                      </div>
                    </div>

                    {hasWriteAccess && m.mxid !== showRoomMembersModal.creator ? (
                      <button
                        onClick={() => handleKickMember(showRoomMembersModal.id, m.mxid)}
                        className="flex items-center gap-1 px-2 py-1 text-[11px] bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded transition-colors duration-200"
                      >
                        <UserMinus className="h-3 w-3" />
                        <span>{t.kickBtn.split(' ')[0]}</span>
                      </button>
                    ) : m.mxid === showRoomMembersModal.creator ? (
                      <span className="text-[10px] font-mono font-medium uppercase px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/25 rounded">
                        Creator
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="flex justify-end border-t border-white/5 pt-4">
                <button
                  onClick={() => setShowRoomMembersModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg text-xs transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL 5: SHUTDOWN ROOM CONFIRM */}
      {/* ========================================== */}
      <AnimatePresence>
        {showShutdownRoomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl relative space-y-4"
              id="shutdown-room-modal"
            >
              <button
                onClick={() => setShowShutdownRoomModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-red-400 flex items-center gap-2 border-b border-white/5 pb-2">
                <ShieldAlert className="h-5 w-5 animate-pulse" />
                <span>Shutdown & Purge Room</span>
              </h3>

              <div className="text-xs text-gray-400 space-y-1 bg-slate-950/40 p-3 rounded-lg border border-white/5">
                <p>Room: <span className="text-red-300 font-semibold">{showShutdownRoomModal.name}</span></p>
                <p className="font-mono text-[10px] truncate">ID: {showShutdownRoomModal.id}</p>
              </div>

              <form onSubmit={handleShutdownRoom} className="space-y-4 text-sm font-medium">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="sd-purge-cb"
                      checked={shutdownRoomConfig.purge}
                      onChange={(e) => setShutdownRoomConfig(prev => ({ ...prev, purge: e.target.checked }))}
                      className="h-4 w-4 rounded border-white/10 bg-slate-900 text-red-600 focus:ring-0"
                    />
                    <label htmlFor="sd-purge-cb" className="text-xs text-gray-300 leading-tight select-none">
                      {t.purgeRoomLabel}
                    </label>
                  </div>

                  <div className="flex items-center gap-3 border-t border-white/5 pt-2.5">
                    <input
                      type="checkbox"
                      id="sd-sendmsg-cb"
                      checked={shutdownRoomConfig.sendMessage}
                      onChange={(e) => setShutdownRoomConfig(prev => ({ ...prev, sendMessage: e.target.checked }))}
                      className="h-4 w-4 rounded border-white/10 bg-slate-900 text-red-600 focus:ring-0"
                    />
                    <label htmlFor="sd-sendmsg-cb" className="text-xs text-gray-300 leading-tight select-none">
                      {t.sendMessageLabel}
                    </label>
                  </div>
                </div>

                {shutdownRoomConfig.sendMessage && (
                  <div className="space-y-1">
                    <textarea
                      value={shutdownRoomConfig.messageText}
                      onChange={(e) => setShutdownRoomConfig(prev => ({ ...prev, messageText: e.target.value }))}
                      placeholder={t.sendMessagePlaceholder}
                      rows={2}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-red-500 rounded-lg p-2.5 outline-none text-gray-200 text-xs transition-colors duration-200 resize-none"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 border-t border-white/5 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowShutdownRoomModal(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg text-xs transition-colors duration-200"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs transition-colors duration-200 shadow-md"
                  >
                    Shutdown Room
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL 6: CREATE REGISTRATION TOKEN */}
      {/* ========================================== */}
      <AnimatePresence>
        {showCreateTokenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl relative space-y-4"
              id="create-token-modal"
            >
              <button
                onClick={() => setShowCreateTokenModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 border-b border-white/5 pb-2">
                <Key className="h-5 w-5 animate-pulse" />
                <span>{t.createTokenBtn}</span>
              </h3>

              <form onSubmit={handleCreateToken} className="space-y-4 text-sm font-medium">
                <div className="space-y-1">
                  <label className="block text-xs text-gray-400">{t.tokenStringLabel}</label>
                  <input
                    type="text"
                    value={newToken.token}
                    onChange={(e) => setNewToken(prev => ({ ...prev, token: e.target.value }))}
                    placeholder="e.g. VIP-INVITE-ONLY"
                    className="w-full bg-slate-950/60 border border-white/5 focus:border-emerald-500 rounded-lg p-2.5 outline-none text-gray-200 font-mono text-xs transition-colors duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-gray-400">{t.usesAllowedLabel}</label>
                  <input
                    type="number"
                    value={newToken.usesAllowed}
                    onChange={(e) => setNewToken(prev => ({ ...prev, usesAllowed: e.target.value }))}
                    placeholder="e.g. 10 (Leave blank for unlimited)"
                    className="w-full bg-slate-950/60 border border-white/5 focus:border-emerald-500 rounded-lg p-2.5 outline-none text-gray-200 font-mono text-xs transition-colors duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-gray-400">{t.expiryLabel}</label>
                  <input
                    type="datetime-local"
                    value={newToken.expiryTime}
                    onChange={(e) => setNewToken(prev => ({ ...prev, expiryTime: e.target.value }))}
                    className="w-full bg-slate-950/60 border border-white/5 focus:border-emerald-500 rounded-lg p-2.5 outline-none text-gray-200 font-mono text-xs transition-colors duration-200"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-white/5 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateTokenModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg text-xs transition-colors duration-200"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs transition-colors duration-200 shadow-md"
                  >
                    Generate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
