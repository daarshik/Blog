"use client";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { app } from "../firebase";
import { useRouter } from "next/navigation";
import { checkUser, login } from "../app/api/auth";

// Define types for the user profile
type UserProfile = {
  name: string;
  email: string;
  loggedIn: boolean;
};

// Define the shape of the state
type StateType = {
  isLoading: boolean;
  isLoaded: boolean;
  userProfile: UserProfile;
};

// Define action types
type ActionType =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER_PROFILE"; payload: UserProfile }
  | { type: "IS_LOADED" };

// Define the initial state
const initialState: StateType = {
  isLoading: false,
  isLoaded: true,
  userProfile: {
    name: "",
    email: "",
    loggedIn: false,
  },
};

// Define the context type
interface UserContextType {
  state: StateType;
  setLoading: (isLoading: boolean) => void;
  handleGoogleClick: () => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Reducer function with proper types
function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER_PROFILE":
      return { ...state, userProfile: action.payload };
    case "IS_LOADED":
      return { ...state, isLoaded: false };
    default:
      return state;
  }
}

// Define provider props
interface UserProviderProps {
  children: ReactNode;
}

// UserProvider component
function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const auth = getAuth(app);
  const router = useRouter();

  // Check if user is already authenticated (on page load)
  // useEffect(() => {
  //   const res = checkUser();
  //   dispatch({ type: "SET_USER_PROFILE", payload: res?.data });
  // }, []);

  // Set loading state
  function setLoading(isLoading: boolean) {
    dispatch({ type: "SET_LOADING", payload: isLoading });
  }

  // Handle Google login
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      // const { email, displayName: name, photoURL } = resultFromGoogle.user;

      setLoading(true);
      const res = await login({
        // email,
        // name,
        // photoURL,
        idToken: resultFromGoogle?._tokenResponse?.idToken,
      });

      dispatch({ type: "SET_USER_PROFILE", payload: res?.data });
      //   setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const value: UserContextType = {
    state,
    setLoading,
    handleGoogleClick,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Hook to use the UserContext
export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

export default UserProvider;
