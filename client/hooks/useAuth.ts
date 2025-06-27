import { useLogin, useLogout, useRegister , AuthService } from "@/services/AuthService";
import { User } from "@/types/IUser";
import { useEffect, useState } from "react";

let currentUser: User | null = null;
let isInitialized = false;

export function setAuthUser(user: User | null) {
  currentUser = user;
}

export function resetAuthState() {
  currentUser = null;
  isInitialized = false;
}

export async function initializeAuth() {
  if (isInitialized) return;
  
  try {
    const user = await AuthService.getUser();
    const token = await AuthService.getToken();
    
    if (user && token) {
      currentUser = user;
      await AuthService.setToken(token);
    } else {
      currentUser = null;
      await AuthService.logout();
    }
  } catch (error) {
    currentUser = null;
    await AuthService.logout();
  } finally {
    isInitialized = true;
  }
}

export function useAuth() {
  const [user, setUserState] = useState<User | null>(currentUser);
  const [isInitializedState, setIsInitializedState] = useState<boolean>(isInitialized);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  useEffect(() => {
    initializeAuth().then(() => {
      setUserState(currentUser);
      setIsInitializedState(true);
    });
  }, []);

  useEffect(() => {
    const checkAuthState = () => {
      if (user !== currentUser) {
        setUserState(currentUser);
      }
      if (isInitializedState !== isInitialized) {
        setIsInitializedState(isInitialized);
      }
    };

    const interval = setInterval(checkAuthState, 100);
    return () => clearInterval(interval);
  }, [user, isInitializedState]);

  const login = async (email: string, password: string) => {
    const result = await loginMutation.mutateAsync({ email, password });
    if (result.success) {
      setAuthUser(result.data.user);
      setUserState(result.data.user);
    }
    return result;
  };

  const register = async (userData: any) => {
    return await registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setAuthUser(null);
    setUserState(null);
    resetAuthState();
    setIsInitializedState(false);
  };

  return { 
    user, 
    login, 
    register, 
    logout,
    isInitialized: isInitializedState
  };
}