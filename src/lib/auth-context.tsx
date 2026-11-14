'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  AutomationItem, 
  ChatbotConfig, 
  ServiceOrder, 
  AppNotification, 
  AutomationLog,
  UserRole 
} from '@/types';
import { 
  DEMO_CLIENT, 
  DEMO_ADMIN, 
  ALL_USERS, 
  INITIAL_AUTOMATIONS, 
  INITIAL_CHATBOTS, 
  INITIAL_ORDERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_LOGS 
} from '@/lib/mock-data';

interface AuthContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  automations: AutomationItem[];
  chatbots: ChatbotConfig[];
  orders: ServiceOrder[];
  notifications: AppNotification[];
  logs: AutomationLog[];
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; role?: UserRole; message?: string }>;
  register: (name: string, email: string, company: string, password?: string, phone?: string) => Promise<{ success: boolean; role?: UserRole; message?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  toggleAutomationStatus: (id: string) => void;
  runAutomationTest: (id: string) => Promise<{ success: boolean; message: string }>;
  addOrder: (order: { serviceId: string; serviceTitle: string; packageType: ServiceOrder['packageType']; price: string; notes?: string }) => void;
  updateOrderStatus: (orderId: string, status: ServiceOrder['status'], notes?: string) => void;
  updateChatbot: (bot: ChatbotConfig) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
  updateUserPassword: (userId: string, newPassword: string) => void;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => void;
  deleteUser: (userId: string) => void;
  addUser: (newUser: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_ADMIN);
  const [users, setUsers] = useState<UserProfile[]>(ALL_USERS);
  const [automations, setAutomations] = useState<AutomationItem[]>(INITIAL_AUTOMATIONS);
  const [chatbots, setChatbots] = useState<ChatbotConfig[]>(INITIAL_CHATBOTS);
  const [orders, setOrders] = useState<ServiceOrder[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [logs, setLogs] = useState<AutomationLog[]>(INITIAL_LOGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('nexus_current_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (
            parsed.id === 'usr-admin-001' ||
            parsed.name?.toLowerCase().includes('tolnai') ||
            parsed.email?.toLowerCase().includes('tolnai') ||
            parsed.name?.toLowerCase().includes('viktor') ||
            parsed.email?.toLowerCase().includes('viktornoss')
          ) {
            parsed.role = 'admin';
            parsed.name = 'Tolnai Viktor';
          }
          setCurrentUser(parsed);
        } catch {
          setCurrentUser(DEMO_ADMIN);
        }
      } else {
        setCurrentUser(DEMO_ADMIN);
      }
      const storedAutomations = localStorage.getItem('nexus_automations');
      if (storedAutomations) {
        setAutomations(JSON.parse(storedAutomations));
      }
      const storedOrders = localStorage.getItem('nexus_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
      const storedChatbots = localStorage.getItem('nexus_chatbots');
      if (storedChatbots) {
        setChatbots(JSON.parse(storedChatbots));
      }
      const storedUsers = localStorage.getItem('nexus_all_users');
      if (storedUsers) {
        try {
          const parsedUsers = JSON.parse(storedUsers).map((u: UserProfile) => {
            if (
              u.id === 'usr-admin-001' ||
              u.name?.toLowerCase().includes('tolnai') ||
              u.email?.toLowerCase().includes('tolnai') ||
              u.name?.toLowerCase().includes('viktor')
            ) {
              return { ...u, name: 'Tolnai Viktor', role: 'admin' as const };
            }
            return u;
          });
          if (!parsedUsers.some((u: UserProfile) => u.name === 'Tolnai Viktor' || u.id === 'usr-admin-001')) {
            parsedUsers.unshift(DEMO_ADMIN);
          }
          setUsers(parsedUsers);
        } catch {
          setUsers(ALL_USERS);
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage when states change
  useEffect(() => {
    if (!isLoading && currentUser) {
      localStorage.setItem('nexus_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('nexus_automations', JSON.stringify(automations));
    }
  }, [automations, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('nexus_orders', JSON.stringify(orders));
    }
  }, [orders, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('nexus_chatbots', JSON.stringify(chatbots));
    }
  }, [chatbots, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('nexus_all_users', JSON.stringify(users));
    }
  }, [users, isLoading]);

  const login = async (email: string, password?: string) => {
    const trimmed = email.trim().toLowerCase();
    
    // Check if admin email or Tolnai Viktor / admin keyword
    if (
      trimmed.includes('admin') || 
      trimmed === DEMO_ADMIN.email.toLowerCase() ||
      trimmed.includes('tolnai') ||
      trimmed.includes('viktornoss') ||
      trimmed.includes('viktor')
    ) {
      setCurrentUser(DEMO_ADMIN);
      return { success: true, role: 'admin' as const };
    }

    // Check existing users
    const found = users.find(u => u.email.toLowerCase() === trimmed || u.name.toLowerCase().includes('tolnai'));
    if (found) {
      if (found.name.toLowerCase().includes('tolnai') || found.email.toLowerCase().includes('tolnai')) {
        const adminFound = { ...found, role: 'admin' as const };
        setCurrentUser(adminFound);
        return { success: true, role: 'admin' as const };
      }
      setCurrentUser(found);
      return { success: true, role: found.role };
    }

    // Default to demo client or create quick session
    const isTolnai = trimmed.includes('tolnai') || trimmed.includes('viktor');
    const genericClient: UserProfile = {
      ...DEMO_CLIENT,
      email: trimmed,
      name: isTolnai ? 'Tolnai Viktor' : trimmed.split('@')[0].toUpperCase(),
      role: isTolnai ? 'admin' : 'client'
    };
    setCurrentUser(genericClient);
    return { success: true, role: genericClient.role };
  };

  const register = async (name: string, email: string, company: string, password?: string, phone?: string) => {
    const isTolnai = name.toLowerCase().includes('tolnai') || email.toLowerCase().includes('tolnai') || name.toLowerCase().includes('viktor');
    const isAdmin = isTolnai || email.toLowerCase().includes('admin');

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: isTolnai ? 'Tolnai Viktor' : name,
      email: email.trim().toLowerCase(),
      role: isAdmin ? 'admin' : 'client',
      company: company || (isTolnai ? 'Zentrion.ai Automation HQ' : 'Saját Vállalkozás Kft.'),
      plan: isAdmin ? 'Enterprise' : 'Growth',
      createdAt: new Date().toISOString().split('T')[0],
      apiKey: `nx_live_${Math.random().toString(36).substring(2, 15)}`,
      plainPassword: password || 'DefaultPass2026!',
      phone: phone || '+36 30 111 2233',
      status: 'active',
      lastLogin: new Date().toLocaleString('hu-HU')
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Add welcoming notification
    const welcomeNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      title: isAdmin ? 'Üdvözlünk Főadminisztrátorként!' : 'Sikeres regisztráció!',
      message: isAdmin
        ? `Üdvözlünk a Zentrion.ai vezérlőpultján, ${newUser.name}! Teljes adminisztrátori jogosultsággal rendelkezel.`
        : `Üdvözlünk a Zentrion.ai platformon, ${name}! Tekintsd meg az aktív automatizációkat vagy kérj egyedi AI rendszert.`,
      type: 'success',
      timestamp: 'Most',
      read: false,
      link: isAdmin ? '/admin' : '/dashboard'
    };
    setNotifications(prev => [welcomeNotif, ...prev]);

    return { success: true, role: newUser.role };
  };

  const updateUserPassword = (userId: string, newPassword: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, plainPassword: newPassword } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, plainPassword: newPassword } : null);
    }
  };

  const updateUserProfile = (userId: string, updates: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const addUser = (newUser: UserProfile) => {
    setUsers(prev => [newUser, ...prev]);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexus_current_user');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser(DEMO_ADMIN);
    } else {
      setCurrentUser(DEMO_CLIENT);
    }
  };

  const toggleAutomationStatus = (id: string) => {
    setAutomations(prev => prev.map(auto => {
      if (auto.id === id) {
        const newStatus = auto.status === 'active' ? 'paused' : 'active';
        return { ...auto, status: newStatus };
      }
      return auto;
    }));
  };

  const runAutomationTest = async (id: string): Promise<{ success: boolean; message: string }> => {
    const auto = automations.find(a => a.id === id);
    if (!auto) return { success: false, message: 'Automatizáció nem található' };

    // Simulate fast execution
    await new Promise(res => setTimeout(res, 800));

    const newLog: AutomationLog = {
      id: `log-${Date.now()}`,
      automationId: auto.id,
      automationTitle: auto.title,
      status: 'success',
      executionTimeMs: Math.floor(Math.random() * 600) + 250,
      timestamp: new Date().toLocaleString('hu-HU'),
      payloadSummary: `Kézi teszt indítás sikeres. Trigger: "${auto.trigger}" feldolgozva, ${auto.actionsCount} lépés végrehajtva.`
    };

    setLogs(prev => [newLog, ...prev]);
    setAutomations(prev => prev.map(a => a.id === id ? {
      ...a,
      totalRuns: a.totalRuns + 1,
      lastRun: 'Épp most'
    } : a));

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'usr-client-001',
      title: `Teszt futás sikeres: ${auto.title}`,
      message: `A munkafolyamat sikeresen lefutott (${newLog.executionTimeMs} ms).`,
      type: 'success',
      timestamp: 'Épp most',
      read: false,
      link: '/dashboard/automations'
    };
    setNotifications(prev => [notif, ...prev]);

    return {
      success: true,
      message: `A(z) "${auto.title}" teszt futtatása hibátlanul befejeződött (${newLog.executionTimeMs} ms).`
    };
  };

  const addOrder = (orderData: { 
    serviceId: string; 
    serviceTitle: string; 
    packageType: ServiceOrder['packageType']; 
    price: string; 
    notes?: string 
  }) => {
    const newOrder: ServiceOrder = {
      id: `ord-${Date.now()}`,
      userId: currentUser?.id || 'usr-client-001',
      clientName: currentUser?.name || 'Kovács Tamás',
      clientCompany: currentUser?.company || 'TechVentures Kft.',
      serviceId: orderData.serviceId,
      serviceTitle: orderData.serviceTitle,
      packageType: orderData.packageType,
      price: orderData.price,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      deliveryDate: 'Egyeztetés alatt',
      notes: orderData.notes || 'Webes felületről leadott megrendelés',
      assignedEngineer: 'Kijelölésre vár'
    };

    setOrders(prev => [newOrder, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'usr-client-001',
      title: 'Új megrendelés rögzítve!',
      message: `Sikeresen leadtad a megrendelést a következőre: ${orderData.serviceTitle} (${orderData.packageType} csomag).`,
      type: 'info',
      timestamp: 'Most',
      read: false,
      link: '/dashboard/orders'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: ServiceOrder['status'], notes?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { 
          ...o, 
          status, 
          notes: notes !== undefined ? notes : o.notes 
        };
      }
      return o;
    }));
  };

  const updateChatbot = (updatedBot: ChatbotConfig) => {
    setChatbots(prev => prev.map(b => b.id === updatedBot.id ? updatedBot : b));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    setCurrentUser(DEMO_CLIENT);
    setUsers(ALL_USERS);
    setAutomations(INITIAL_AUTOMATIONS);
    setChatbots(INITIAL_CHATBOTS);
    setOrders(INITIAL_ORDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setLogs(INITIAL_LOGS);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        automations,
        chatbots,
        orders,
        notifications,
        logs,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        toggleAutomationStatus,
        runAutomationTest,
        addOrder,
        updateOrderStatus,
        updateChatbot,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        updateUserPassword,
        updateUserProfile,
        deleteUser,
        addUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

